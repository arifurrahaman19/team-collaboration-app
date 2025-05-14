import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FEATURES } from "@/lib/features";
import { User, UserRole } from "@/types";
import { format } from "date-fns";
import { User as UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AuthorizationCheckpost from "../common/AuthorizationCheckpost";

interface UserListProps {
	users: User[];
	onUpdateRole?: (userId: string, role: UserRole) => void;
	onSelectUser?: (userId: string) => void;
}

const getBadgeForRole = (role: UserRole) => {
	switch (role) {
		case "ADMIN":
			return (
				<Badge variant='default' className='bg-red-500 text-white min-w-[80px] flex justify-center w-fit'>
					Admin
				</Badge>
			);
		case "MANAGER":
			return (
				<Badge variant='default' className='bg-blue-500 text-white min-w-[80px] flex justify-center w-fit'>
					Manager
				</Badge>
			);
		case "MEMBER":
			return (
				<Badge variant='default' className='bg-green-500 text-white min-w-[80px] flex justify-center w-fit'>
					Member
				</Badge>
			);
		default:
			return <Badge>Unknown</Badge>;
	}
};

export default function UserList({ users, onSelectUser }: UserListProps) {
	return (
		<Card>
			<CardHeader className='flex flex-row items-center justify-between w-full'>
				<CardTitle>Members</CardTitle>
				<AuthorizationCheckpost featurePrivilege={FEATURES.ADD_USER}>
					<Link href='/users/add' className='text-white bg-primary px-3 py-2 rounded-md'>
						Add New Member
					</Link>
				</AuthorizationCheckpost>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className='w-[300px]'>Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Joined</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{users.map((user) => (
							<TableRow key={user.id}>
								<TableCell>
									<div className='flex items-center space-x-3'>
										<div className='h-8 w-8 rounded-full bg-secondary flex items-center justify-center'>
											{user.avatar ? <Image src={user.avatar} alt={user.name} width={1000} height={1000} className='h-8 w-8 rounded-full' /> : <UserIcon className='h-4 w-4' />}
										</div>
										<div>{user.name}</div>
									</div>
								</TableCell>
								<TableCell>{user.email}</TableCell>
								<TableCell>{getBadgeForRole(user.role)}</TableCell>
								<TableCell>{format(user.createdAt, "MMM d, yyyy")}</TableCell>
								<TableCell>
									<Button variant='outline' size='sm' onClick={() => onSelectUser && onSelectUser(user.id)}>
										Message
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
