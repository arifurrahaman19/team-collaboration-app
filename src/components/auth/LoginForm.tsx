import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [isLoading, setIsLoading] = useState(false);
	const { login } = useAuth();
	const router = useRouter();

	const validate = () => {
		try {
			loginSchema.parse({ email, password });
			setErrors({});
			return true;
		} catch (error) {
			if (error instanceof z.ZodError) {
				const newErrors: Record<string, string> = {};
				error.errors.forEach((err) => {
					if (err.path) {
						newErrors[err.path[0]] = err.message;
					}
				});
				setErrors(newErrors);
			}
			return false;
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validate()) return;
		setIsLoading(true);
		try {
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
			<form onSubmit={handleSubmit}>
				<CardContent className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='email'>Email</Label>
						<Input className='text-foreground' id='email' type='email' placeholder='your.email@example.com' value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
						{errors.email && <p className='text-sm text-destructive'>{errors.email}</p>}
					</div>
					<div className='space-y-2'>
						<Label htmlFor='password'>Password</Label>
						<Input className='text-foreground' id='password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
						{errors.password && <p className='text-sm text-destructive'>{errors.password}</p>}
					</div>
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
