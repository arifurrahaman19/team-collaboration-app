"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import MainLayout from "@/components/layout/MainLayout";
import UserList from "@/components/users/UserList";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Users() {
	const { user } = useAuth();
	const router = useRouter();
	const [users, setUsers] = useState([]);

	const handleSelectUser = (userId: string) => {
		router.push(`/chat?userId=${userId}`);
	};

	const fetchUsers = async () => {
		try {
			const res = await axios.get("/api/auth/user/getAll");
			setUsers(res?.data);
		} catch (err) {
			console.error("Error fetching users:", err);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	if (user?.role !== "ADMIN" && user?.role !== "MANAGER") {
		return (
			<MainLayout>
				<div className='flex items-center justify-center h-[calc(100vh-120px)]'>
					<div className='text-center'>
						<h1 className='text-2xl font-bold mb-2'>Access Denied</h1>
						<p className='text-muted-foreground mb-4'>You dont have permission to view this page.</p>
					</div>
				</div>
			</MainLayout>
		);
	}
	if (!user) return null;

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold tracking-tight'>Team Members</h1>
				<p className='text-muted-foreground mt-1'>{user.role === "ADMIN" ? "Manage team members and their roles" : "View team members information"}</p>
			</div>
			<UserList users={users} onSelectUser={handleSelectUser} />
		</div>
	);
}
