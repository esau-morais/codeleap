interface PostCardProps {
	id: number;
	username: string;
	created_datetime: string;
	title: string;
	content: string;
	currentUsername: string;
	onDelete: (id: number) => void;
	onEdit: (id: number) => void;
}

export default function PostCard({
	id,
	username,
	created_datetime,
	title,
	content,
	currentUsername,
	onDelete,
	onEdit,
}: PostCardProps) {
	const isOwner = username === currentUsername;

	const getTimeAgo = (datetime: string) => {
		const date = new Date(datetime);
		const now = new Date();
		const minutes = Math.floor((now.getTime() - date.getTime()) / 60000);

		if (minutes < 60) return `${minutes} minutes ago`;
		const hours = Math.floor(minutes / 60);
		if (hours < 24) return `${hours} hours ago`;
		const days = Math.floor(hours / 24);
		return `${days} days ago`;
	};

	return (
		<div className="bg-white border border-[#999] rounded-2xl overflow-hidden mb-6 animate-fadeIn">
			<div className="bg-[#7695ec] px-4 sm:px-6 py-4 sm:py-[26px] flex justify-between items-start gap-3">
				<h2 className="text-lg sm:text-[22px] font-bold text-white break-words">
					{title}
				</h2>
				{isOwner && (
					<div className="flex gap-2 sm:gap-[14px] flex-shrink-0">
						<button
							type="button"
							onClick={() => onDelete(id)}
							className="w-7 h-7 sm:w-[31px] sm:h-[30px] hover:opacity-80 transition-opacity"
							aria-label="Delete post"
						>
							<svg viewBox="0 0 24 24" fill="white" aria-hidden="true">
								<path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5z" />
							</svg>
						</button>
						<button
							type="button"
							onClick={() => onEdit(id)}
							className="w-7 h-7 sm:w-[31px] sm:h-[30px] hover:opacity-80 transition-opacity"
							aria-label="Edit post"
						>
							<svg viewBox="0 0 24 24" fill="white" aria-hidden="true">
								<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
							</svg>
						</button>
					</div>
				)}
			</div>
			<div className="px-4 sm:px-6 py-4 sm:py-6">
				<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-1">
					<p className="text-base sm:text-lg font-bold text-[#777] break-all">
						@{username}
					</p>
					<p className="text-sm sm:text-lg text-[#777]">
						{getTimeAgo(created_datetime)}
					</p>
				</div>
				<p className="text-base sm:text-lg text-black whitespace-pre-wrap break-words">
					{content}
				</p>
			</div>
		</div>
	);
}
