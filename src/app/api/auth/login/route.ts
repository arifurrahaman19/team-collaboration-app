import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const verifyPassword = async (password: string, hashed: string) => {
	return await bcrypt.compare(password, hashed);
};

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const parsed = loginSchema.parse(body);

		const user = await prisma.user.findUnique({
			where: { email: parsed.email },
		});

		if (!user) {
			return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
		}
		const isValid = await verifyPassword(parsed.password, user.password);
		if (!isValid) {
			return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
		}

		const secret = process.env.SECRET!;
		const expiresIn = process.env.AUTH_JWT_EXPIRES_IN as any;
		const token = jwt.sign({ uid: user.id, email: user.email, userType: user.role }, secret, { expiresIn });

		return NextResponse.json({
			message: "Login successful",
			token,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
	}
}
