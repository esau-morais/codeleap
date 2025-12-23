import { useState } from "react";
import "./globas.css";
import type { Post } from "./api/posts";
import DeleteModal from "./components/DeleteModal";
import EditModal from "./components/EditModal";
import MainScreen from "./components/MainScreen";
import Signup from "./components/Signup";
import { useDeletePost, usePosts, useUpdatePost } from "./hooks/usePosts";
import { useUserStore } from "./store/useUserStore";

function App() {
	const { username, setUsername } = useUserStore();
	const [deletePostId, setDeletePostId] = useState<number | null>(null);
	const [editPost, setEditPost] = useState<Post | null>(null);

	const { data: posts = [], isLoading } = usePosts();
	const deletePost = useDeletePost();
	const updatePost = useUpdatePost();

	const confirmDelete = () => {
		if (deletePostId !== null) {
			deletePost.mutate(deletePostId, {
				onSuccess: () => setDeletePostId(null),
			});
		}
	};

	const handleEditPost = (id: number) => {
		const post = posts.find((p) => p.id === id);
		if (post) setEditPost(post);
	};

	const saveEdit = (title: string, content: string) => {
		if (!editPost) return;
		updatePost.mutate(
			{ id: editPost.id, data: { title, content } },
			{ onSuccess: () => setEditPost(null) },
		);
	};

	if (!username) {
		return <Signup onSignup={setUsername} />;
	}

	return (
		<>
			<MainScreen
				username={username}
				posts={posts}
				onDeletePost={setDeletePostId}
				onEditPost={handleEditPost}
				isLoading={isLoading}
			/>
			{deletePostId !== null && (
				<DeleteModal
					onConfirm={confirmDelete}
					onCancel={() => setDeletePostId(null)}
					isDeleting={deletePost.isPending}
				/>
			)}
			{editPost && (
				<EditModal
					title={editPost.title}
					content={editPost.content}
					onSave={saveEdit}
					onCancel={() => setEditPost(null)}
					isSaving={updatePost.isPending}
				/>
			)}
		</>
	);
}

export default App;
