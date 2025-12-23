import {
	useInfiniteQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
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
