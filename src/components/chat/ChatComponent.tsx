"use client";
import ChatInterface from "@/components/chat/ChatInterface";
import axios from "@/lib/axios";
import { User } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ChatUsersList from "./ChatUsersList";

const ChatComponent = () => {
	const searchParams = useSearchParams();
	const userId = searchParams.get("userId");
	const [selectedUser, setSelectedUser] = useState<User>();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [users, setUsers] = useState<User[]>();

	const handleUserSelect = (user: User) => {
		setSelectedUser(user);
	};

	const fetchUsers = async () => {
		setIsLoading(true);
		try {
			const res = await axios.get("/api/auth/user/getAll");
			if (userId) {
				const user = res?.data?.find((u: User) => u?.id === userId);
				setSelectedUser(user);
			}
			setUsers(res?.data);
			setIsLoading(false);
		} catch (err) {
			console.error("Error fetching users:", err);
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	return (
		<>
			<div className='w-full md:w-72 border rounded-lg'>
				<div className='p-4'>
					<h2 className='text-lg font-medium mb-4'>Conversations</h2>
					<ChatUsersList isLoading={isLoading} users={users ?? []} handleUserSelect={handleUserSelect} selectedUser={selectedUser} />
				</div>
			</div>
			{selectedUser && (
				<div className='flex-1 overflow-hidden'>
					<ChatInterface selectedUser={selectedUser} />
				</div>
			)}
		</>
	);
};

export default ChatComponent;
