"use client";
import { useAuth } from "@/context/AuthContext";
import { MessageSquare, User, Users, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SidebarLink from "./SidebarLink";
import { useToast } from "@/hooks/use-toast";
import { FEATURES } from "@/lib/features";

const links = [
	{ to: "/dashboard", icon: <User size={18} />, label: "Dashboard", feature: FEATURES.DASHBOARD },
	{ to: "/chat", icon: <MessageSquare size={18} />, label: "Messages", feature: FEATURES.MESSAGES },
	{ to: "/users", icon: <Users size={18} />, label: "Users", feature: FEATURES.USERS },
];

export default function Sidebar() {
	const { user, logout } = useAuth();
	const { toast } = useToast();
	const router = useRouter();

	const handleLogout = () => {
		logout();
		router.push("/");
		toast({
			title: "Logged out",
			description: "You have been logged out successfully",
		});
	};

	if (!user) return null;

	return (
		<div className='bg-sidebar min-h-full flex flex-col w-56 py-6 px-3'>
			<div className='flex items-center justify-center mb-8'>
				<h1 className='text-xl font-bold text-white'>Unity Pulse</h1>
			</div>
			<div className='flex-grow space-y-2'>
				{links.map((link, index) => (
					<SidebarLink key={index} {...link} />
				))}
			</div>
			<div className='pt-4 border-t border-sidebar-border mt-4'>
				<div className='flex items-center gap-3 px-2 mb-8'>
					<div className='h-8 w-8 rounded-full bg-white/20 flex items-center justify-center'>
						{user?.avatar ? <Image src={user?.avatar} alt={user?.name} width={1000} height={1000} className='h-8 w-8 rounded-full' /> : <User size={16} className='text-white' />}
					</div>
					<div className='overflow-hidden'>
						<p className='text-sm font-medium text-white truncate'>{user?.name}</p>
						<p className='text-xs text-white/70'>{user?.role}</p>
					</div>
				</div>
				<Button variant='ghost' size='sm' className='w-full justify-start text-white hover:text-white hover:bg-sidebar-accent pb-20' onClick={handleLogout}>
					<LogOut size={16} className='mr-2' />
					Logout
				</Button>
			</div>
		</div>
	);
}
