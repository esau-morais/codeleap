import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Post } from "../api/posts";
import { useDraftAutosave } from "../hooks/useDraftAutosave";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import { useCreatePost } from "../hooks/usePosts";
import { type PostInput, postSchema } from "../lib/schemas";
import { groupPostsByTime, TIME_GROUPS } from "../lib/timeGrouping";
import { useUserStore } from "../store/useUserStore";
import PostCard from "./PostCard";
import PostSkeleton from "./PostSkeleton";

interface MainScreenProps {
	username: string;
	posts: Post[];
	onDeletePost: (id: number) => void;
	onEditPost: (id: number) => void;
	isLoading?: boolean;
	isError?: boolean;
	onLoadMore?: () => void;
	hasMore?: boolean;
	isLoadingMore?: boolean;
}

export default function MainScreen({
	username,
	posts,
	onDeletePost,
	onEditPost,
	isLoading,
	isError,
	onLoadMore,
	hasMore,
	isLoadingMore,
}: MainScreenProps) {
	const { logout } = useUserStore();
	const createPost = useCreatePost();
	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState: { isValid },
	} = useForm<PostInput>({
		resolver: zodResolver(postSchema),
		mode: "onChange",
	});

	const clearDraft = useDraftAutosave(watch, reset);

	const loadMoreRef = useIntersectionObserver(
		() => {
			if (hasMore && !isLoadingMore && onLoadMore) {
				onLoadMore();
			}
		},
		{ threshold: 0.1 },
	);

	const onSubmit = (data: PostInput) => {
		createPost.mutate(
			{ username, ...data },
			{
				onSuccess: () => {
					reset();
					clearDraft();
				},
			},
		);
	};

	const groupedPosts = groupPostsByTime(posts);

	return (
		<div className="min-h-screen bg-[#ddd]">
			<div className="max-w-[800px] mx-auto bg-white min-h-screen">
				<div className="bg-[#7695ec] px-4 sm:px-9 py-7 flex justify-between items-center">
					<h1 className="text-lg sm:text-[22px] font-bold text-white">
						CodeLeap Network
					</h1>
					<button
						type="button"
						onClick={logout}
						className="text-white text-sm hover:underline"
					>
						Logout
					</button>
				</div>

				<div className="border-b border-[#999]" />

				<div className="px-4 sm:px-6 py-6">
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="bg-white border border-[#999] rounded-2xl p-4 sm:p-6 mb-6"
					>
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-lg sm:text-[22px] font-bold text-black">
								What's on your mind?
							</h2>
							{(watch("title") || watch("content")) && (
								<span className="text-xs text-[#777] italic">Draft saved</span>
							)}
						</div>

						<div className="mb-4">
							<div className="flex justify-between items-center mb-2">
								<label
									htmlFor="post-title"
									className="block text-base text-black"
								>
									Title
								</label>
								<span className="text-xs text-[#777]">
									{watch("title")?.length || 0} characters
								</span>
							</div>
							<input
								id="post-title"
								{...register("title")}
								placeholder="Hello world"
								className="w-full border border-[#777] rounded-lg px-[11px] py-2 text-sm placeholder:text-[#ccc]"
							/>
						</div>

						<div className="mb-4">
							<div className="flex justify-between items-center mb-2">
								<label
									htmlFor="post-content"
									className="block text-base text-black"
								>
									Content
								</label>
								<span className="text-xs text-[#777]">
									{watch("content")?.length || 0} characters
								</span>
							</div>
							<textarea
								id="post-content"
								{...register("content")}
								placeholder="Content here"
								className="w-full border border-[#777] rounded-lg px-[11px] py-2 text-sm h-[74px] resize-none placeholder:text-[#ccc]"
							/>
						</div>

						<div className="flex justify-end">
							<button
								type="submit"
								disabled={!isValid || createPost.isPending}
								className="bg-[#7695ec] text-white font-bold text-base px-8 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
							>
								{createPost.isPending ? "Creating..." : "Create"}
							</button>
						</div>
					</form>

					{isLoading ? (
						<>
							<PostSkeleton />
							<PostSkeleton />
							<PostSkeleton />
						</>
					) : isError ? (
						<div className="bg-white border border-[#999] rounded-2xl p-6 text-center">
							<p className="text-[#777] text-lg mb-2">Failed to load posts</p>
							<p className="text-[#999] text-sm">
								Please check your connection and try again
							</p>
						</div>
					) : (
						<>
							{TIME_GROUPS.map(
								(group) =>
									groupedPosts[group].length > 0 && (
										<div key={group}>
											<h3 className="text-lg font-bold text-black mb-4 mt-6 first:mt-0">
												{group}
											</h3>
											{groupedPosts[group].map((post) => (
												<PostCard
													key={post.id}
													{...post}
													currentUsername={username}
													onDelete={onDeletePost}
													onEdit={onEditPost}
												/>
											))}
										</div>
									),
							)}
							{hasMore && <div ref={loadMoreRef} className="h-10" />}
							{isLoadingMore && <PostSkeleton />}
						</>
					)}
				</div>
			</div>
		</div>
	);
}
