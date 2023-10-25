// COMPONENTS
import { Navbar } from './_components/navbar';

interface MarketingLayoutProps {
	children: React.ReactNode;
}

const MarketingLayout = ({ children }: MarketingLayoutProps) => {
	return (
		<div className="min-h-full dark:bg-[#1F1F1F]">
			<Navbar />
			<main className="h-full pt-32">{children}</main>
		</div>
	);
};

export default MarketingLayout;
