'use client';

import { FC, ReactNode, useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Toaster as SonnerToaster } from 'sonner';
import NextTopLoader from 'nextjs-toploader';

// PROVIDERS
import { ThemeProvider } from './use-theme';
import { ModalProvider } from './modal.provider';
import { EdgeStoreProvider } from '@/lib/edgestore';
import { LoginModalProvider } from './login-modal.provider';
import { RegisterModalProvider } from './register-modal.provider';

interface LayoutProps {
	children: ReactNode;
	pageProps: any;
}

const AppProvider: FC<LayoutProps> = ({ children, pageProps }) => {
	const [QC] = useState(
		new QueryClient({
			defaultOptions: {
				queries: {
					refetchOnMount: false,
					refetchOnWindowFocus: false,
					retry: 1,
				},
			},
		}),
	);

	return (
		<>
			<SonnerToaster richColors closeButton position="bottom-center" />
			<NextTopLoader color="#2a2a2a" />
			<EdgeStoreProvider>
				<QueryClientProvider client={QC} {...pageProps}>
					<SessionProvider {...pageProps}>
						<ThemeProvider
							attribute="class"
							defaultTheme="system"
							storageKey="notion-theme-2"
							enableSystem
							disableTransitionOnChange
						>
							<ModalProvider />
							<RegisterModalProvider>
								<LoginModalProvider>
									{children}
								</LoginModalProvider>
							</RegisterModalProvider>
						</ThemeProvider>
					</SessionProvider>
				</QueryClientProvider>
			</EdgeStoreProvider>
		</>
	);
};

export { AppProvider };
