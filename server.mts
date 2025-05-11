import { createServer } from "node:http";
import next from "next";
import { Server as SocketIOServer } from "socket.io";
import axios from "axios";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);
const app = next({ dev, hostname, port });

const API_BASE_URL = `http://${hostname}:${port}`;

const handle = app.getRequestHandler();

app.prepare().then(() => {
	const httpServer = createServer(handle);
	const io = new SocketIOServer(httpServer);

	io.on("connection", (socket) => {
		console.log("User connected", socket.id);

		socket.on("join-room", ({ room, userName }) => {
			socket.join(room);
			console.log(`User ${userName} joined room ${room}`);
			socket.to(room).emit("user_joined", `${userName} joined room ${room}`);
		});

		socket.on("message", async ({ room, message, senderId, receiverId }) => {
			try {
				const res = await axios.post(`${API_BASE_URL}/api/messages`, {
					content: message,
					senderId,
					receiverId,
					roomId: room,
				});
				const savedMessage = res?.data;
				socket.to(room).emit("message", { id: savedMessage.id, senderId: savedMessage.senderId, content: savedMessage.content, createdAt: savedMessage.createdAt });
			} catch (error) {
				console.error("Failed to save message:", error);
			}
		});

		socket.on("disconnect", () => {
			console.log("User disconnected", socket.id);
		});
	});

	httpServer.listen(port, () => {
		console.log(`Server running on http://${hostname}:${port}`);
	});
});
