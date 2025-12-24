import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEscapeKey } from "../hooks/useEscapeKey";
import { type PostInput, postSchema } from "../lib/schemas";

interface EditModalProps {
	title: string;
	content: string;
	onSave: (title: string, content: string) => void;
	onCancel: () => void;
	isSaving?: boolean;
}

export default function EditModal({
	title,
	content,
	onSave,
	onCancel,
	isSaving,
}: EditModalProps) {
	const {
		register,
		handleSubmit,
		watch,
		formState: { isValid },
	} = useForm<PostInput>({
		resolver: zodResolver(postSchema),
		mode: "onChange",
		defaultValues: { title, content },
	});

	useEscapeKey(onCancel);

	const onSubmit = (data: PostInput) => onSave(data.title, data.content);

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 animate-modalFadeIn">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="bg-white border border-[#999] rounded-2xl p-4 sm:p-6 w-full max-w-[660px] animate-modalSlideIn"
			>
				<h2 className="text-lg sm:text-[22px] font-bold text-black mb-6">
					Edit item
				</h2>

				<div className="mb-4">
					<div className="flex justify-between items-center mb-2">
						<label htmlFor="edit-title" className="block text-base text-black">
							Title
						</label>
						<span className="text-xs text-[#777]">
							{watch("title")?.length || 0} characters
						</span>
					</div>
					<input
						id="edit-title"
						{...register("title")}
						placeholder="Hello world"
						className="w-full border border-[#777] rounded-lg px-[11px] py-2 text-sm placeholder:text-[#ccc]"
					/>
				</div>

				<div className="mb-6">
					<div className="flex justify-between items-center mb-2">
						<label
							htmlFor="edit-content"
							className="block text-base text-black"
						>
							Content
						</label>
						<span className="text-xs text-[#777]">
							{watch("content")?.length || 0} characters
						</span>
					</div>
					<textarea
						id="edit-content"
						{...register("content")}
						placeholder="Content here"
						className="w-full border border-[#777] rounded-lg px-[11px] py-2 text-sm h-[74px] resize-none placeholder:text-[#ccc]"
					/>
				</div>

				<div className="flex justify-end gap-3 sm:gap-4">
					<button
						type="button"
						onClick={onCancel}
						className="bg-white border border-black text-black font-bold text-sm sm:text-base px-6 sm:px-8 py-2 rounded-lg hover:bg-gray-50 transition-colors"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={!isValid || isSaving}
						className="bg-[#47b960] text-white font-bold text-sm sm:text-base px-6 sm:px-8 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
					>
						{isSaving ? "Saving..." : "Save"}
					</button>
				</div>
			</form>
		</div>
	);
}
