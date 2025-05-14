"use client";
import UserList from "@/components/users/UserList";
import { useAuth } from "@/context/AuthContext";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const UsersPageComponent = () => {
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

	return (
		<>
			<div>
				<h1 className='text-3xl font-bold tracking-tight'>Team Members</h1>
				<p className='text-muted-foreground mt-1'>{user?.role === "ADMIN" ? "Manage team members and their roles" : "View team members information"}</p>
			</div>
			<UserList users={users} onSelectUser={handleSelectUser} />
		</>
	);
};

export default UsersPageComponent;
