import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const EditUserSchema = z.object({
	name: z.string().optional(),
	email: z.string().email().optional(),
	password: z.string().min(6).optional(),
	role: z.enum(["ADMIN", "MANAGER", "MEMBER"]).optional(),
});

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
	const body = await req.json();
	const parsed = EditUserSchema.safeParse(body);

	if (!parsed.success) {
		return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
	}

	try {
		const user = await prisma.user.update({
			where: { id: params.id },
			data: parsed.data,
		});

		return NextResponse.json(user, { status: 200 });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error: "User update failed" }, { status: 500 });
	}
}
