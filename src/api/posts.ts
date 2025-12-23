const BASE_URL = "https://dev.codeleap.co.uk/careers/";

export interface Post {
	id: number;
	username: string;
	created_datetime: string;
	title: string;
	content: string;
}

export interface CreatePostData {
	username: string;
	title: string;
	content: string;
}

export interface UpdatePostData {
	title: string;
	content: string;
}

export const postsApi = {
	getAll: async (): Promise<{ results: Post[] }> => {
		const res = await fetch(BASE_URL);
		if (!res.ok) throw new Error("Failed to fetch posts");
		return res.json();
	},

	create: async (data: CreatePostData): Promise<Post> => {
		const res = await fetch(BASE_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});
		if (!res.ok) throw new Error("Failed to create post");
		return res.json();
	},

	update: async (id: number, data: UpdatePostData): Promise<Post> => {
		const res = await fetch(`${BASE_URL}${id}/`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});
		if (!res.ok) throw new Error("Failed to update post");
		return res.json();
	},

	delete: async (id: number): Promise<void> => {
		const res = await fetch(`${BASE_URL}${id}/`, { method: "DELETE" });
		if (!res.ok) throw new Error("Failed to delete post");
	},
};
