import type { Post } from "../api/posts";

export const TIME_GROUPS = [
	"Today",
	"Yesterday",
	"This Week",
	"Older",
] as const;
type TimeGroup = (typeof TIME_GROUPS)[number];

function getTimeGroup(datetime: string): TimeGroup {
	const date = new Date(datetime);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffDays === 0) return "Today";
	if (diffDays === 1) return "Yesterday";
	if (diffDays <= 7) return "This Week";
	return "Older";
}

export function groupPostsByTime(posts: Post[]): Record<TimeGroup, Post[]> {
	const grouped = Object.groupBy(posts, (post) =>
		getTimeGroup(post.created_datetime),
	);
	return {
		Today: grouped.Today ?? [],
		Yesterday: grouped.Yesterday ?? [],
		"This Week": grouped["This Week"] ?? [],
		Older: grouped.Older ?? [],
	};
}
