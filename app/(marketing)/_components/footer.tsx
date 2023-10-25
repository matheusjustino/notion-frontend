import { memo } from 'react';

// COMPONENTS
import { Logo } from './logo';
import { Button } from '@/components/ui/button';

const Footer: React.FC = memo(() => {
	return (
		<footer className="flex items-center w-full p-6 bg-background z-50 dark:bg-[#1F1F1F]">
			<Logo />

			<div
				className="md:ml-auto w-full justify-between md:justify-end
				flex items-center gap-x-2 text-muted-foreground"
			>
				<Button variant="ghost" size="sm">
					Privacy Policy
				</Button>

				<Button variant="ghost" size="sm">
					Terms & Conditions
				</Button>
			</div>
		</footer>
	);
});

Footer.displayName = 'Footer';

export { Footer };
