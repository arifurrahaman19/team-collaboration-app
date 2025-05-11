import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
	try {
		const users = await prisma.user.findMany({
			orderBy: { createdAt: "desc" },
		});

		return NextResponse.json(users);
	} catch (error) {
		console.error("Failed to fetch users:", error);
		return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
	}
}
