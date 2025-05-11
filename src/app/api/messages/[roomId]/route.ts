import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: Promise<{ roomId: string }> }) {
	const { roomId } = await params;

	if (!roomId) {
		return Response.json({ error: "Invalid room ID" }, { status: 400 });
	}

	try {
		const messages = await prisma.message.findMany({
			where: { roomId },
			orderBy: { createdAt: "asc" },
		});

		return Response.json({ messages });
	} catch (error) {
		console.error("Error fetching messages:", error);
		return Response.json({ error: "Failed to fetch messages" }, { status: 500 });
	}
}
