export type UserRole = "ADMIN" | "MANAGER" | "MEMBER";

export interface User {
	id: string;
	name: string;
	email: string;
	avatar?: string;
	role: UserRole;
	createdAt: Date;
}

export interface Message {
	id: string;
	content: string;
	senderId: string;
	receiverId: string;
	createdAt: Date;
	read: boolean;
	attachments?: FileAttachment[];
}

export interface FileAttachment {
	id: string;
	name: string;
	url: string;
	type: string;
	size: number;
	uploadedBy: string;
	createdAt: Date;
}

export interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	login: (email: string, password: string, roleId?: string) => Promise<void>;
	logout: () => void;
}

export interface ChatConversation {
	id: string;
	participants: User[];
	lastMessage?: Message;
	unreadCount: number;
}
