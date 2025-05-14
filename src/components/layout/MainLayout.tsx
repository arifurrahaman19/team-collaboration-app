import Sidebar from "./Sidebar";

interface MainLayoutProps {
	children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
	return (
		<div className='flex min-h-screen bg-background'>
			<Sidebar />
			<div className='flex-1 px-6 overflow-auto'>{children}</div>
		</div>
	);
}
