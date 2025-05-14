"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
	email: z.string().nonempty("Email is Required").email("Invalid email address"),
	password: z.string().nonempty("Password is Required").min(6, "Password must be at least 6 characters"),
});

export type loginSchemaValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
	const [isLoading, setIsLoading] = useState(false);
	const { login } = useAuth();
	const router = useRouter();

	const form = useForm<loginSchemaValues>({
		resolver: zodResolver(loginSchema),
	});

	const { formState } = form;
	const { errors } = formState;

	const handleSubmit = async (values: loginSchemaValues) => {
		setIsLoading(true);
		try {
			const { email, password } = values;
			await login(email, password);
			router.push("/dashboard");
		} catch (error) {
			console.error("Login failed:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className='w-full max-w-md mx-auto text-white'>
			<CardHeader>
				<CardTitle className='text-2xl'>Login</CardTitle>
				<CardDescription className='text-white'>Enter your credentials to access your team workspace</CardDescription>
			</CardHeader>
			<form onSubmit={form.handleSubmit(handleSubmit)}>
				<CardContent className='space-y-4'>
					<Controller
						control={form.control}
						name='email'
						render={({ field }) => (
							<div className='space-y-2'>
								<Label htmlFor='email'>Email</Label>
								<Input id='email' type='email' placeholder='your.email@example.com' disabled={isLoading} {...field} />
								{errors.email && <p className='text-sm text-red-500'>{errors.email?.message}</p>}
							</div>
						)}
					/>
					<Controller
						control={form.control}
						name='password'
						render={({ field }) => (
							<div className='space-y-2'>
								<Label htmlFor='password'>Password</Label>
								<Input className='text-foreground' id='password' type='password' disabled={isLoading} {...field} />
								{errors.password && <p className='text-sm text-red-500'>{errors?.password?.message}</p>}
							</div>
						)}
					/>
				</CardContent>
				<CardFooter className='flex flex-col'>
					<Button type='submit' className='w-full' disabled={isLoading}>
						{isLoading ? "Logging in..." : "Login"}
					</Button>
					<div className='mt-4 text-sm text-center'>Don&apos;t have an account? Contact with admin.</div>
					<div className='mt-4 text-sm text-center'>
						Email: rasel@gmail.com (Manager) <br />
						PW: 123456
					</div>
					<div className='mt-4 text-sm text-center'>
						Email: arifur.frontend@gmail.com (Admin) <br />
						PW: 123456
					</div>
				</CardFooter>
			</form>
		</Card>
	);
}
