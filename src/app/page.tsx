import LoginForm from "@/components/auth/LoginForm";
import { KEY_AUTH_TOKEN } from "@/constant";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const HomePage = async () => {
	const token = (await cookies()).get(KEY_AUTH_TOKEN);
	if (!token) {
		return (
			<div className='min-h-screen bg-gradient-to-r from-unity-600 to-unity-800 flex flex-col items-center justify-center'>
				<div className='container mx-auto px-4 py-16 text-white'>
					<LoginForm />
				</div>
			</div>
		);
	} else {
		redirect("/dashboard");
	}
};
export default HomePage;
