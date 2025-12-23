export default function PostSkeleton() {
	return (
		<div className="bg-white border border-[#999] rounded-2xl overflow-hidden mb-6">
			<div className="bg-[#7695ec] px-4 sm:px-6 py-4 sm:py-[26px]">
				<div className="h-7 bg-white/20 rounded w-3/4 animate-skeleton" />
			</div>
			<div className="px-4 sm:px-6 py-4 sm:py-6">
				<div className="flex justify-between items-center mb-4">
					<div className="h-5 bg-gray-200 rounded w-24 animate-skeleton" />
					<div className="h-5 bg-gray-200 rounded w-32 animate-skeleton" />
				</div>
				<div className="space-y-2">
					<div className="h-4 bg-gray-200 rounded w-full animate-skeleton" />
					<div className="h-4 bg-gray-200 rounded w-5/6 animate-skeleton" />
					<div className="h-4 bg-gray-200 rounded w-4/6 animate-skeleton" />
				</div>
			</div>
		</div>
	);
}
