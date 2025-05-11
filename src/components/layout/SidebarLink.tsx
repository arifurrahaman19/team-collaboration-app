"use client";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

interface SidebarLinkProps {
	to: string;
	icon: React.ReactNode;
	label: string;
}

const SidebarLink = ({ to, icon, label }: SidebarLinkProps) => {
	const pathname = usePathname();
	const router = useRouter();
	const isActive = pathname === to;

	return (
		<button
			onClick={() => router.push(to)}
			className={cn("text-white w-full flex items-center gap-2 cursor-pointer px-2 py-1 rounded-md hover:bg-primary hover:text-white", isActive && "bg-primary text-white")}>
			{icon}
			{label}
		</button>
	);
};
export default SidebarLink;
