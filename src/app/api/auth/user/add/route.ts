import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcrypt";

const hashPassword = async (password: string) => {
	const saltRounds = 10;
	return await bcrypt.hash(password, saltRounds);
};

const UserSchema = z.object({
	name: z.string().min(1),
	email: z.string().email("Invalid Email"),
	password: z.string().min(6, "Password min 6 character"),
	role: z.enum(["ADMIN", "MANAGER", "MEMBER"]),
});

export async function POST(req: NextRequest) {
	const body = await req.json();
	const parsed = UserSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
	}
	const { name, email, password, role } = parsed.data;

	const hashedPassword = await hashPassword(password);

	try {
		const user = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				role,
			},
		});

		return NextResponse.json(user, { status: 201 });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ error: "Email may already exist or invalid data" }, { status: 400 });
	}
}
