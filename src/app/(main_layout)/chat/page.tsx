"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import ChatInterface from "@/components/chat/ChatInterface";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { User } from "@prisma/client";

export default function Chat() {
	const { user } = useAuth();
	const searchParams = useSearchParams();
	const userId = searchParams.get("userId");
	const [selectedUser, setSelectedUser] = useState<User>();
	const [users, setUsers] = useState<User[]>();
	const handleUserSelect = (user: User) => {
		setSelectedUser(user);
	};

	const fetchUsers = async () => {
		try {
			const res = await axios.get("/api/auth/user/getAll");
			if (userId) {
				const user = res?.data?.find((u: User) => u?.id === userId);
				setSelectedUser(user);
			}
			setUsers(res?.data);
		} catch (err) {
			console.error("Error fetching users:", err);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	if (!user) return null;
	return (
		<div className='h-[calc(100vh-120px)] flex overflow-hidden gap-2'>
			<div className='w-full md:w-72 border-r'>
				<div className='p-4'>
					<h2 className='text-lg font-medium mb-4'>Conversations</h2>
					<div className='space-y-1'>
						{users?.map((otherUser) => (
							<button
								key={otherUser?.id}
								onClick={() => handleUserSelect(otherUser)}
								className={`w-full flex items-center gap-3 p-2 rounded-md transition-colors cursor-pointer
                      ${selectedUser?.id === otherUser.id ? "bg-primary text-primary-foreground text-white" : "hover:bg-muted"}`}>
								<Avatar className='h-10 w-10'>
									<AvatarImage src={undefined} />
									<AvatarFallback className='border'>{otherUser?.name.charAt(0)}</AvatarFallback>
								</Avatar>
								<div className='flex-1 text-left'>
									<p className='font-medium'>{otherUser?.name}</p>
									<p className={`text-xs ${selectedUser?.id === otherUser?.id ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{otherUser?.role}</p>
								</div>
							</button>
						))}
					</div>
				</div>
			</div>
			{selectedUser && (
				<div className='flex-1 overflow-hidden'>
					<ChatInterface selectedUser={selectedUser} />
				</div>
			)}
		</div>
	);
}
