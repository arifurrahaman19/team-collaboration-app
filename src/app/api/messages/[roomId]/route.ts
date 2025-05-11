import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest, { params }: { params: { roomId: string } }) {
	const roomId = params.roomId;

	if (!roomId) {
		return NextResponse.json({ error: "Invalid room ID" }, { status: 400 });
	}

	try {
		const messages = await prisma.message.findMany({
			where: { roomId },
			orderBy: { createdAt: "asc" },
		});

		return NextResponse.json({ messages });
	} catch (error) {
		console.error("Error fetching messages:", error);
		return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
	}
}
