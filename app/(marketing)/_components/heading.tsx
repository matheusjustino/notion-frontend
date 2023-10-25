'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ArrowRight } from 'lucide-react';

// PROVIDERS
import { useRegisterModal } from '@/providers/register-modal.provider';

// COMPONENTS
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

const Heading: React.FC = () => {
	const { status } = useSession();
	const { setShow } = useRegisterModal();

	return (
		<div className="max-w-3xl space-y-4">
			<h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
				Your Ideas, Documents, & Plans. Unified. Welcome to{' '}
				<span className="underline">Notion</span>
			</h1>

			<h3 className="text-base sm:text-xl md:text-2xl font-medium">
				Notion is the connected workspace where <br /> better, faster
				work happens.
			</h3>

			{status === 'loading' && <Spinner className="mx-auto" size="lg" />}

			{status === 'authenticated' && (
				<Button asChild>
					<Link href="/documents">
						Enter Notion <ArrowRight className="h-4 w-4 ml-2" />
					</Link>
				</Button>
			)}

			{status === 'unauthenticated' && (
				<Button onClick={() => setShow(true)}>
					Get Notion Free <ArrowRight className="h-4 w-4 ml-2" />
				</Button>
			)}
		</div>
	);
};

export { Heading };
