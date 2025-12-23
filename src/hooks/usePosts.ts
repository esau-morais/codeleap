import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	type CreatePostData,
	postsApi,
	type UpdatePostData,
} from "../api/posts";

export const usePosts = () => {
	return useQuery({
		queryKey: ["posts"],
		queryFn: postsApi.getAll,
		select: (data) => data.results,
	});
};

export const useCreatePost = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: CreatePostData) => postsApi.create(data),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
	});
};

export const useUpdatePost = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: number; data: UpdatePostData }) =>
			postsApi.update(id, data),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
	});
};

export const useDeletePost = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: number) => postsApi.delete(id),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
	});
};
