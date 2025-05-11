"use client";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";

export default function HomePage() {
	const router = useRouter();
	const { isAuthenticated } = useAuth();

	useEffect(() => {
		if (isAuthenticated) {
			router.push("/dashboard");
		}
	}, [isAuthenticated]);

	return (
		<div className='min-h-screen bg-gradient-to-r from-unity-600 to-unity-800 flex flex-col items-center justify-center'>
			<div className='container mx-auto px-4 py-16 text-white'>
				<LoginForm />
			</div>
		</div>
	);
}
