import { useEscapeKey } from "../hooks/useEscapeKey";

interface DeleteModalProps {
	onConfirm: () => void;
	onCancel: () => void;
	isDeleting?: boolean;
}

export default function DeleteModal({
	onConfirm,
	onCancel,
	isDeleting,
}: DeleteModalProps) {
	useEscapeKey(onCancel);

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 animate-modalFadeIn">
			<div className="bg-white border border-[#999] rounded-2xl p-4 sm:p-6 w-full max-w-[660px] animate-modalSlideIn">
				<h2 className="text-lg sm:text-[22px] font-bold text-black mb-6 sm:mb-10">
					Are you sure you want to delete this item?
				</h2>
				<div className="flex justify-end gap-3 sm:gap-4">
					<button
						type="button"
						onClick={onCancel}
						className="bg-white border border-[#999] text-black font-bold text-sm sm:text-base px-6 sm:px-8 py-2 rounded-lg hover:bg-gray-50 transition-colors"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={onConfirm}
						disabled={isDeleting}
						className="bg-[#ff0000] text-white font-bold text-sm sm:text-base px-6 sm:px-8 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isDeleting ? "Deleting..." : "Delete"}
					</button>
				</div>
			</div>
		</div>
	);
}
