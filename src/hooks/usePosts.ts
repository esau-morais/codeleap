import {
	useInfiniteQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
	type CreatePostData,
	postsApi,
	type UpdatePostData,
} from "../api/posts";

export const usePosts = () => {
	return useInfiniteQuery({
		queryKey: ["posts"],
		queryFn: ({ pageParam }) => postsApi.getAll(pageParam, 10),
		initialPageParam: 0,
		getNextPageParam: (lastPage, _allPages, lastPageParam) => {
			if (!lastPage.next) return undefined;
			return lastPageParam + 10;
		},
		select: (data) => ({
			pages: data.pages,
			pageParams: data.pageParams,
			posts: data.pages.flatMap((page) => page.results),
		}),
	});
};

export const useCreatePost = (broadcast?: (message: unknown) => void) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreatePostData) => postsApi.create(data),
		onSuccess: (post) => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			toast.success("Post created successfully");
			broadcast?.({ type: "post_created", post });
		},
		onError: () => {
			toast.error("Failed to create post. Please try again.");
		},
	});
};

export const useUpdatePost = (broadcast?: (message: unknown) => void) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: number; data: UpdatePostData }) =>
			postsApi.update(id, data),
		onSuccess: (post, variables) => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			toast.success("Post updated successfully");
			broadcast?.({ type: "post_updated", postId: variables.id, post });
		},
		onError: () => {
			toast.error("Failed to update post. Please try again.");
		},
	});
};

export const useDeletePost = (broadcast?: (message: unknown) => void) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: number) => postsApi.delete(id),
		onSuccess: (_data, id) => {
			queryClient.invalidateQueries({ queryKey: ["posts"] });
			toast.success("Post deleted successfully");
			broadcast?.({ type: "post_deleted", postId: id });
		},
		onError: () => {
			toast.error("Failed to delete post. Please try again.");
		},
	});
};
