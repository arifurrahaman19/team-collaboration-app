"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { FEATURES } from "@/lib/features";
import { LogOut, MessageSquare, User, Users } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SidebarLink from "./SidebarLink";

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

	return (
		<div className='bg-sidebar min-h-full flex flex-col w-56 py-6 px-3'>
			<div className='flex items-center mb-8 border-b border-gray-600 pb-5'>
				<h1 className='flex items-center gap-2 text-xl font-bold text-white'>
					<span className='border border-white rounded-full flex items-center justify-center w-[35px] h-[35px]'>UP</span> Unity Pulse
				</h1>
			</div>
			<div className='flex-grow space-y-2'>
				{links.map((link, index) => (
					<SidebarLink key={index} {...link} />
				))}
			</div>
			<div className='pt-4 border-t border-gray-600 mt-4'>
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
