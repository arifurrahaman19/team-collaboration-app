import { ROLE_ADMIN, ROLE_MANAGER, ROLE_MEMBER } from "@/lib/features";
import { Role } from "@prisma/client";
const getRoleBaseFeatures = (role: Role) => {
	switch (role) {
		case Role.ADMIN:
			return ROLE_ADMIN;
		case Role.MANAGER:
			return ROLE_MANAGER;
		case Role.MEMBER:
			return ROLE_MEMBER;
	}
};

export default getRoleBaseFeatures;
