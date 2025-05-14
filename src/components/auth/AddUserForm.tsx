"use client";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import axios from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const addUserSchema = z
	.object({
		name: z.string({ message: "Name is required" }).min(2, "Name must be at least 2 characters"),
		email: z.string({ message: "Email is required" }).min(2, "Email cannot be empty").email("Invalid email address"),
		role: z.string({ message: "Role is required" }).nonempty("Role cannot be empty"),
		password: z.string({ message: "Password is required" }).min(6, "Password must be at least 6 characters"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export type AddMemberFormValues = z.infer<typeof addUserSchema>;

const AddUserForm = () => {
	const router = useRouter();
	const { toast } = useToast();
	const form = useForm<AddMemberFormValues>({
		resolver: zodResolver(addUserSchema),
	});
	const { formState } = form;
	const { errors } = formState;
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (values: AddMemberFormValues) => {
		console.log(values);
		setIsLoading(true);
		try {
			const { name, email, password, role } = values;
			const res = await axios.post("/api/auth/user/add", { name, email, password, role });
			console.log("handleSubmit->", res);
			router.push("/users");
		} catch (error: any) {
			console.error("Signup failed:", error?.response?.data?.error);
			toast({
				title: "Error",
				description: error?.response?.data?.error,
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form onSubmit={form.handleSubmit(handleSubmit)}>
			<CardContent className='space-y-4'>
				<Controller
					control={form.control}
					name='name'
					render={({ field }) => (
						<div className='space-y-2'>
							<Label htmlFor='name'>Full Name</Label>
							<Input id='name' placeholder='John Doe' disabled={isLoading} {...field} />
							{errors?.name && <p className='text-sm text-red-500'>{errors?.name?.message}</p>}
						</div>
					)}
				/>
				<Controller
					control={form.control}
					name='email'
					render={({ field }) => (
						<div className='space-y-2'>
							<Label htmlFor='email'>Email</Label>
							<Input id='email' type='email' placeholder='your.email@example.com' disabled={isLoading} {...field} />
							{errors.email && <p className='text-sm text-red-500'>{errors.email?.message}</p>}
						</div>
					)}
				/>
				<Controller
					control={form.control}
					name='role'
					render={({ field: { onChange, value } }) => (
						<div className='space-y-2 w-full'>
							<Label htmlFor='role'>Role</Label>
							<Select onValueChange={onChange} value={value}>
								<SelectTrigger className='w-full' id='role'>
									<SelectValue placeholder='Select Role' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='ADMIN'>Admin</SelectItem>
									<SelectItem value='MANAGER'>Manager</SelectItem>
									<SelectItem value='MEMBER'>Member</SelectItem>
								</SelectContent>
							</Select>
							{errors.role && <p className='text-sm text-red-500'>{errors.role?.message}</p>}
						</div>
					)}
				/>
				<Controller
					control={form.control}
					name='password'
					render={({ field }) => (
						<div className='space-y-2'>
							<Label htmlFor='password'>Password</Label>
							<Input id='password' type='password' placeholder='Password' disabled={isLoading} {...field} />
							{errors.password && <p className='text-sm text-red-500'>{errors.password?.message}</p>}
						</div>
					)}
				/>
				<Controller
					control={form.control}
					name='confirmPassword'
					render={({ field }) => (
						<div className='space-y-2'>
							<Label htmlFor='confirmPassword'>Confirm Password</Label>
							<Input id='confirmPassword' type='password' placeholder='Confirm Password' disabled={isLoading} {...field} />
							{errors.confirmPassword && <p className='text-sm text-red-500'>{errors.confirmPassword?.message}</p>}
						</div>
					)}
				/>
			</CardContent>
			<CardFooter className='flex flex-col'>
				<Button type='submit' className='w-full' disabled={isLoading}>
					{isLoading ? "Creating account..." : "Submit"}
				</Button>
			</CardFooter>
		</form>
	);
};
export default AddUserForm;
