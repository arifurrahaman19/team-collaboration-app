import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@prisma/client";
import { Skeleton } from "../ui/skeleton";

type Props = { users: User[]; isLoading: boolean; handleUserSelect: (user: User) => void; selectedUser: User | undefined };

const ChatUsersList = ({ users, handleUserSelect, selectedUser, isLoading }: Props) => {
	return (
		<div className='space-y-1'>
			{isLoading && !users?.length ? (
				<div className='flex flex-col space-y-1'>
					{[1, 2, 3, 4, 5].map((i) => (
						<div key={i} className='flex gap-2 m-2 items-center'>
							<Skeleton className='shrink-0 h-[40px] w-[40px] rounded-[500px]' />
							<div className='flex flex-col gap-1 w-full'>
								<Skeleton className='h-[24px] w-full' />
								<Skeleton className='h-[16px] w-full' />
							</div>
						</div>
					))}
				</div>
			) : !isLoading && !users?.length ? (
				<>"No User Found!"</>
			) : null}

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
	);
};

export default ChatUsersList;
