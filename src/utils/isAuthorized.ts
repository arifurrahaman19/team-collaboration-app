import getRoleBaseFeatures from "./getRoleBaseFeatures";
import { Role } from "@prisma/client";

export type IsAuthorizedProps = {
	privileges?: Array<string>;
	featurePrivilege?: string;
	featurePrivileges?: Array<string>;
};

type IsAuthorizedPropsWithRole = IsAuthorizedProps & {
	role: Role;
};

export default function isAuthorized({ privileges = [], featurePrivilege, featurePrivileges = [], role }: IsAuthorizedPropsWithRole) {
	if (!privileges || !(privileges.length > 0)) {
		privileges = getRoleBaseFeatures(role!);
	}
	if (featurePrivilege && privileges.includes(featurePrivilege)) return true;
	else if (!featurePrivilege && featurePrivileges?.length) {
		const matchedPrivileges = featurePrivileges.filter((pri) => privileges.includes(pri));
		if (matchedPrivileges.length) return true;
	}
	return false;
}
