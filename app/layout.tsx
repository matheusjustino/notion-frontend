import './globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';

// PROVIDERS
import { AppProvider } from '@/providers/app.provider';

const font = Poppins({
	subsets: ['latin'],
	weight: ['400', '500', '600', '700'],
	display: 'swap',
});

export const metadata: Metadata = {
	title: 'Notion',
	description: 'The connected workspace where better, faster work happens.',
	icons: {
		icon: [
			{
				media: '(prefers-color-scheme: light)',
				url: '/notion-logo.svg',
				href: '/notion-logo.svg',
			},
		],
	},
};

export default function RootLayout({
	children,
	...props
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={font.className}>
				<AppProvider pageProps={props}>{children}</AppProvider>
			</body>
		</html>
	);
}
