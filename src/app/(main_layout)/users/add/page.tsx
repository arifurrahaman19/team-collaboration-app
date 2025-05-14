import AddUserForm from "@/components/auth/AddUserForm";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const AddUser = async () => {
	return (
		<Card className='w-[70%] mx-auto mt-9'>
			<CardHeader>
				<CardTitle className='text-2xl'>Add an user</CardTitle>
			</CardHeader>
			<AddUserForm />
		</Card>
	);
};

export default AddUser;
