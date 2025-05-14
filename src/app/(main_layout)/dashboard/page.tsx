import ServerAutorization from "@/components/common/ServerAutorization";

const Dashboard = async () => {
	return (
		<ServerAutorization>
			<div className='min-h-screen flex items-center justify-center'>
				<div>
					<h1 className='text-3xl font-bold tracking-tight text-center'>Welcome</h1>
					<p className='text-muted-foreground mt-1 text-center'>Heres whats happening in your workspace today.</p>
				</div>
			</div>
		</ServerAutorization>
	);
};
export default Dashboard;
