import { useQueryClient } from "@tanstack/react-query";
import PartySocket from "partysocket";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type PostEvent = {
	type: "post_created" | "post_updated" | "post_deleted";
	postId?: number;
	post?: unknown;
};

type PresenceEvent = {
	type: "presence";
	count: number;
};

type Message = PostEvent | PresenceEvent;

const PARTYKIT_HOST = import.meta.env.VITE_PARTYKIT_HOST || "127.0.0.1:1999";

export function usePartyKit() {
	const queryClient = useQueryClient();
	const socketRef = useRef<PartySocket | null>(null);
	const [onlineCount, setOnlineCount] = useState(0);

	useEffect(() => {
		const socket = new PartySocket({
			host: PARTYKIT_HOST,
			room: "posts",
		});

		socket.addEventListener("message", (event) => {
			try {
				const message: Message = JSON.parse(event.data);

				if (message.type === "presence") {
					setOnlineCount(message.count);
				} else if (message.type === "post_created") {
					queryClient.invalidateQueries({ queryKey: ["posts"] });
					toast.info("New post added");
				} else if (message.type === "post_updated") {
					queryClient.invalidateQueries({ queryKey: ["posts"] });
					toast.info("Post updated");
				} else if (message.type === "post_deleted") {
					queryClient.invalidateQueries({ queryKey: ["posts"] });
					toast.info("Post deleted");
				}
			} catch (error) {
				console.error("Failed to parse message:", error);
			}
		});

		socketRef.current = socket;

		return () => {
			socket.close();
		};
	}, [queryClient]);

	const broadcast = (message: PostEvent) => {
		socketRef.current?.send(JSON.stringify(message));
	};

	return { broadcast, onlineCount };
}
