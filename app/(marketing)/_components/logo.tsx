import { memo } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const Logo: React.FC = memo(() => {
	return (
		<div className="hidden md:flex items-center gap-x-2">
			<Image
				src="/notion-logo.svg"
				height="40"
				width="40"
				alt="Logo"
				priority
			/>

			<p className={cn('font-semibold')}>Notion</p>
		</div>
	);
});

Logo.displayName = 'Logo';

export { Logo };
