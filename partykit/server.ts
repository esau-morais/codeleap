import type * as Party from "partykit/server";

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

export default class PostsServer implements Party.Server {
	constructor(readonly room: Party.Room) {}

	onConnect() {
		this.broadcastPresence();
	}

	onClose() {
		this.broadcastPresence();
	}

	onMessage(message: string, sender: Party.Connection) {
		try {
			const msg: Message = JSON.parse(message);

			if (msg.type === "presence") {
				return;
			}

			this.room.broadcast(message, [sender.id]);
		} catch (error) {
			console.error("Invalid message:", error);
		}
	}

	broadcastPresence() {
		const connections = [...this.room.getConnections()];
		const presenceMsg: PresenceEvent = {
			type: "presence",
			count: connections.length,
		};
		this.room.broadcast(JSON.stringify(presenceMsg));
	}
}
