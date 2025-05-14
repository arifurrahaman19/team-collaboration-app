import { getToken } from "@/utils";
import axios from "axios";

const axiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
});

axiosInstance.interceptors.request.use(
	async function (config: any) {
		const token = getToken();
		const customHeaders = {
			"Content-Type": "application/json",
			"Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
			Pragma: "no-cache",
			Expires: "0",
			authorization: Boolean(token) ? `Bearer ${token}` : "",
		};

		config.headers = {
			...customHeaders,
			...config.headers,
		};

		return config;
	},
	function (error) {
		console.log("Promise.reject->", error);
		return Promise.reject(error);
	}
);

// Add response interceptor to prevent browser caching
axiosInstance.interceptors.response.use(
	function (response) {
		// Add no-cache headers to response
		response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
		response.headers["Pragma"] = "no-cache";
		response.headers["Expires"] = "0";
		return response;
	},
	function (error) {
		return Promise.reject(error);
	}
);

export default axiosInstance;
