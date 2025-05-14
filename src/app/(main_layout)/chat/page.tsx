import ChatComponent from "@/components/chat/ChatComponent";
import ServerAutorization from "@/components/common/ServerAutorization";

export default async function Chat() {
	return (
		<ServerAutorization>
			<div className='h-[calc(100vh)] py-10 flex overflow-hidden gap-2'>
				<ChatComponent />
			</div>
		</ServerAutorization>
	);
}
