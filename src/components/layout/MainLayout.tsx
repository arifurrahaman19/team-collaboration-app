"use client";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "./Sidebar";
import { useRouter } from "next/navigation";

interface MainLayoutProps {
	children: React.ReactNode;
	requireAuth?: boolean;
}

export default function MainLayout({ children, requireAuth = true }: MainLayoutProps) {
	const router = useRouter();
	const { isAuthenticated } = useAuth();

	useEffect(() => {
		if (requireAuth && !isAuthenticated) {
			router.push("/");
		}
	}, [requireAuth, isAuthenticated]);

	return (
		<div className='flex min-h-screen bg-background'>
			<Sidebar />
			<div className='flex-1 p-6 overflow-auto'>{children}</div>
		</div>
	);
}
