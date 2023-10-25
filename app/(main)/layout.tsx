'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

// COMPONENTS
import { Spinner } from '@/components/ui/spinner';
import { Navigation } from './_components/navigation';
import { SearchCommand } from '@/components/ui/search-command';

export default function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { status } = useSession();

	if (status === 'loading') {
		return (
			<div className="flex items-center justify-center h-full">
				<Spinner size="lg" />
			</div>
		);
	}

	if (status === 'unauthenticated') {
		return redirect('/');
	}

	return (
		<div className="h-full flex dark:bg-[#1f1f1f]">
			<Navigation />
			<main className="flex-1 h-full overflow-y-auto">
				<SearchCommand />

				{children}
			</main>
		</div>
	);
}
