"use client";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
	const { user } = useAuth();

	if (!user) return null;
	return (
		<div className='min-h-screen flex items-center justify-center'>
			<div>
				<h1 className='text-3xl font-bold tracking-tight text-center'>Welcome, {user?.name}</h1>
				<p className='text-muted-foreground mt-1 text-center'>Heres whats happening in your workspace today.</p>
			</div>
		</div>
	);
}
