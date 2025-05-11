import { useAuth } from "@/context/AuthContext";
import { isAuthorized } from "@/utils";
import { IsAuthorizedProps } from "@/utils/isAuthorized";
import { ReactNode } from "react";

type AuthorizationCheckpostProps = IsAuthorizedProps & {
	children: ReactNode;
};
export default function AuthorizationCheckpost({ children, featurePrivilege, featurePrivileges = [], privileges = [] }: AuthorizationCheckpostProps) {
	const user = useAuth();

	if (
		isAuthorized({
			privileges: privileges,
			featurePrivileges: featurePrivileges,
			role: user?.user?.role!,
			featurePrivilege,
		})
	) {
		return children;
	}
	return "";
}
