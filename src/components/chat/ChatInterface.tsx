"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/context/AuthContext";
import axios from "@/lib/axios";
import { socket } from "@/lib/socketClient";
import { User } from "@prisma/client";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
	senderId: string;
	content: string;
}

export const getRoomId = (userAId: string, userBId: string) => {
	return [userAId, userBId].sort().join("_");
};

interface ChatInterfaceProps {
	selectedUser: User;
	onBack?: () => void;
	showBack?: boolean;
}

export default function ChatInterface({ selectedUser }: ChatInterfaceProps) {
	const { user: currentUser } = useAuth();
	const [newMessage, setNewMessage] = useState("");
	const [messages, setMessages] = useState<Message[]>([]);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const room = currentUser && selectedUser ? getRoomId(currentUser.id, selectedUser.id) : "";

	const handleSendMessage = () => {
		if (!newMessage.trim() || !currentUser || !selectedUser) return;

		const data = {
			room,
			message: newMessage,
			senderId: currentUser.id,
			receiverId: selectedUser.id,
		};
		setMessages((prev) => [
			...prev,
			{
				senderId: currentUser.id,
				receiverId: selectedUser.id,
				content: newMessage,
				createdAt: new Date().toISOString(),
			},
		]);
		socket.emit("message", data);
		setNewMessage("");
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	async function fetchMessages(roomId: string) {
		const res = await axios.get(`/api/messages/${roomId}`);
		const data = res?.data;
		setMessages(data.messages);
	}

	useEffect(() => {
		if (currentUser && selectedUser) {
			socket.emit("join-room", { room, userName: currentUser?.name });
		}
	}, [currentUser, selectedUser, room]);

	useEffect(() => {
		if (currentUser && selectedUser) {
			const roomId = getRoomId(currentUser?.id, selectedUser?.id);
			fetchMessages(roomId);
		}
	}, [currentUser?.id, selectedUser?.id]);

	useEffect(() => {
		const handleMessage = (data: Message) => {
			setMessages((prev) => [...prev, data]);
		};
		socket.on("message", handleMessage);
		return () => {
			socket.off("message", handleMessage);
		};
	}, []);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	if (!currentUser || !selectedUser) return null;

	return (
		<div className='flex flex-col h-full border rounded-md overflow-hidden'>
			<div className='p-4 border-b flex items-center gap-3 bg-background'>
				<Avatar>
					<AvatarImage src={undefined} />
					<AvatarFallback className='border'>{selectedUser?.name?.charAt(0)}</AvatarFallback>
				</Avatar>
				<div>
					<h3 className='font-medium'>{selectedUser?.name}</h3>
					<p className='text-sm text-muted-foreground'>{selectedUser?.role}</p>
				</div>
			</div>

			<ScrollArea className='flex-1 p-4'>
				<div className='space-y-4'>
					{messages.map((message, index) => {
						const isCurrentUser = message.senderId === currentUser.id;
						const sender = isCurrentUser ? currentUser : selectedUser;

						return (
							<div key={index} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
								<div className='flex gap-2 max-w-[80%]'>
									{!isCurrentUser && (
										<Avatar className='h-8 w-8'>
											<AvatarImage src={undefined} />
											<AvatarFallback className='border'>{sender?.name?.charAt(0)}</AvatarFallback>
										</Avatar>
									)}

									<div>
										<div className={`rounded-lg p-3 ${isCurrentUser ? "bg-primary text-white" : "bg-gray-300"}`}>{message.content}</div>
									</div>

									{isCurrentUser && (
										<Avatar className='h-8 w-8'>
											<AvatarImage src={undefined} />
											<AvatarFallback className='border'>{sender?.name?.charAt(0)}</AvatarFallback>
										</Avatar>
									)}
								</div>
							</div>
						);
					})}
					<div ref={messagesEndRef} />
				</div>
			</ScrollArea>

			<div className='p-4 border-t bg-background'>
				<div className='flex gap-2'>
					{/* <Button variant='outline' size='icon' type='button'>
						<Paperclip className='h-4 w-4' />
					</Button> */}
					<Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={handleKeyPress} placeholder='Type a message...' className='flex-1' />
					<Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
						<Send className='h-4 w-4 mr-2' />
						Send
					</Button>
				</div>
				{/* <div className='flex gap-2 mt-2'>
					<Button variant='ghost' size='sm' type='button' className='text-xs'>
						<LucideImage className='h-3 w-3 mr-1' />
						Image
					</Button>
					<Button variant='ghost' size='sm' type='button' className='text-xs'>
						<File className='h-3 w-3 mr-1' />
						File
					</Button>
				</div> */}
			</div>
		</div>
	);
}
