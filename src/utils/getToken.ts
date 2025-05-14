import { KEY_AUTH_TOKEN } from "@/constant";
import { Cookies } from "@/utils";

const getToken = () => {
	const token = Cookies.get(KEY_AUTH_TOKEN);
	return token;
};
export default getToken;
