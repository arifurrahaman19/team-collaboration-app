import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
	const body = await req.json();

	try {
		const res = await prisma.message.create({
			data: {
				...body,
			},
		});

		return NextResponse.json(res, { status: 200 });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error: "Something went wrong" }, { status: 400 });
	}
}
