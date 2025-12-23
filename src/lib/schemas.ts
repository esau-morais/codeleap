import { z } from "zod";

export const signupSchema = z.object({
	username: z.string().min(1, "Username is required").trim(),
});

export const postSchema = z.object({
	title: z.string().min(1, "Title is required").trim(),
	content: z.string().min(1, "Content is required").trim(),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type PostInput = z.infer<typeof postSchema>;
