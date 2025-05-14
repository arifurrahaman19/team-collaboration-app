import { KEY_AUTH_TOKEN } from "@/constant";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

type Props = {
	children: ReactNode;
	redirectUrl?: string;
};

const ServerAutorization = async (props: Props) => {
	const { children, redirectUrl } = props;
	const token = (await cookies()).get(KEY_AUTH_TOKEN);
	if (!token) {
		redirect(redirectUrl ? redirectUrl : "/");
	}
	return children;
};

export default ServerAutorization;
