import NextAuth, { DefaultSession } from 'next-auth';

// INTERFACES
import { RequestUser } from '@/interfaces/request-user.interface';

declare module 'next-auth' {
	/**
	 * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		user?: RequestUser & DefaultSession['user'];
	}
}
