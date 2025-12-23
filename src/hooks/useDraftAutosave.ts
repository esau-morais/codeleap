import { useEffect } from "react";
import type { UseFormWatch } from "react-hook-form";

const DRAFT_KEY = "codeleap-post-draft";

export function useDraftAutosave<T extends Record<string, unknown>>(
	watch: UseFormWatch<T>,
	reset: (values?: T) => void,
) {
	useEffect(() => {
		const saved = localStorage.getItem(DRAFT_KEY);
		if (saved) {
			try {
				reset(JSON.parse(saved));
			} catch {
				localStorage.removeItem(DRAFT_KEY);
			}
		}
	}, [reset]);

	useEffect(() => {
		const subscription = watch((value) => {
			const hasContent = Object.values(value).some(
				(v) => typeof v === "string" && v.trim(),
			);
			if (hasContent) {
				localStorage.setItem(DRAFT_KEY, JSON.stringify(value));
			} else {
				localStorage.removeItem(DRAFT_KEY);
			}
		});
		return () => subscription.unsubscribe();
	}, [watch]);

	return () => localStorage.removeItem(DRAFT_KEY);
}
