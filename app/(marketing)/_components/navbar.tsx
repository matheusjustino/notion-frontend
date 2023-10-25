'use client';

import { memo } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Loader } from 'lucide-react';

// UTILS
import { cn } from '@/lib/utils';

// HOOKS
import { useScrollTop } from '@/hooks/use-scroll-top';

// PROVIDERS
import { useLoginModal } from '@/providers/login-modal.provider';
import { useRegisterModal } from '@/providers/register-modal.provider';

// COMPONENTS
import { Logo } from './logo';
import { AvatarMenu } from './avatar-menu';
import { LoginModal } from './login-modal';
import { Button } from '@/components/ui/button';
import { RegisterModal } from './register-modal';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { Spinner } from '@/components/ui/spinner';

const Navbar: React.FC = memo(() => {
	const { data: session, status } = useSession();
	const { setShow: setShowLoginModal } = useLoginModal();
	const { setShow: setShowRegisterModal } = useRegisterModal();
	const scrolled = useScrollTop();

	return (
		<div
			className={cn(
				`z-50 bg-background fixed top-0 flex items-center w-full p-6
				dark:bg-[#1F1F1F]`,
				scrolled && 'border-b shadow-sm',
			)}
		>
			<Logo />

			<div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
				{status === 'loading' && <Spinner size="lg" />}

				{status === 'unauthenticated' && (
					<>
						<Button
							variant="ghost"
							onClick={() => setShowLoginModal(true)}
						>
							Login
						</Button>
						<Button onClick={() => setShowRegisterModal(true)}>
							Get notion free
						</Button>
					</>
				)}

				{status === 'authenticated' && (
					<>
						<Link href="/documents">
							<Button variant="ghost">Enter Notion</Button>
						</Link>

						<AvatarMenu user={session.user} />
					</>
				)}

				<ModeToggle />
			</div>

			<LoginModal />
			<RegisterModal />
		</div>
	);
});

Navbar.displayName = 'Navbar';

export { Navbar };
