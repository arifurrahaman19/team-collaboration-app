"use client";
import { KEY_AUTH_TOKEN } from "@/constant";
import { useToast } from "@/hooks/use-toast";
import axios from "@/lib/axios";
import { AuthContextType, User } from "@/types";
import { Cookies } from "@/utils";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const { toast } = useToast();

	useEffect(() => {
		const checkAuth = () => {
			try {
				const storedUser = localStorage.getItem("unity_pulse_user");
				if (storedUser) {
					setUser(JSON.parse(storedUser));
				}
			} catch (error) {
				console.error("Auth check failed:", error);
			} finally {
				setIsLoading(false);
			}
		};

		setTimeout(checkAuth, 500);
	}, []);

	const login = async (email: string, password: string) => {
		setIsLoading(true);
		try {
			const loginRes = await axios.post("/api/auth/login", { email, password });
			const loggedInUser = loginRes?.data?.user;
			setUser(loginRes?.data?.user);
			localStorage.setItem("unity_pulse_user", JSON.stringify(loggedInUser));
			Cookies.set(KEY_AUTH_TOKEN, loginRes?.data?.token!);
			toast({
				title: "Logged in successfully",
				description: `Welcome, ${loggedInUser.name}!`,
			});
		} catch (error: any) {
			console.log("AuthContext Login->", error);
			toast({
				title: "Login failed",
				description: error?.response?.data?.error,
				variant: "destructive",
			});
			throw error;
		} finally {
			setIsLoading(false);
		}
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem("unity_pulse_user");
		Cookies.destroy(KEY_AUTH_TOKEN);
		toast({
			title: "Logged out",
			description: "You have been logged out successfully.",
		});
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated: Boolean(user),
				login,
				logout,
			}}>
			{!isLoading && children}
			{isLoading && (
				<div className='flex items-center justify-center min-h-screen'>
					<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-unity-600' />
				</div>
			)}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
