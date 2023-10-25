import { NextAuthOptions, getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import jwtDecode from 'jwt-decode';

// SERVICES
import { api } from '@/lib/axios';

// INTERFACES
import { IRequestUser } from '@/interfaces/request-user.interface';

export const authOptions: NextAuthOptions = {
	session: {
		strategy: 'jwt',
		maxAge: 60 * 60 * 12, // 12h - must be equal backend settings
	},
	jwt: {
		maxAge: 60 * 60 * 12, // 12h - must be equal backend settings
	},
	secret: process.env.NEXTAUTH_SECRET,
	// pages: {
	// 	newUser: '/sign-up',
	// 	signIn: '/sign-in',
	// 	error: '/error',
	// },
	providers: [
		CredentialsProvider({
			type: 'credentials',
			credentials: {
				email: {
					label: 'email',
					type: 'email',
					placeholder: 'your@email.com',
				},
				password: { label: 'Password', type: 'password' },
			},
			authorize: async (credentials, req) => {
				try {
					const token = await api
						.post<string>(`/auth/login`, credentials)
						.then((res) => res.data);

					if (token) {
						const userToken =
							jwtDecode<Record<string, string>>(token);

						return Promise.resolve({
							id: userToken.UserId,
							firstName: userToken.FirstName,
							lastName: userToken.LastName,
							email: userToken.Email,
							picture: userToken.Picture,
							token,
						} as IRequestUser);
					} else {
						return null;
					}
				} catch (error: any) {
					console.error(error);
					if (
						error.message.includes('Network Error') ||
						error.message.includes('connect ECONNREFUSED')
					) {
						throw new Error('Unable to connect to the server');
					}

					const errorMsg =
						error.response?.data?.message || error.message;
					throw new Error(
						JSON.stringify({
							error: errorMsg,
							status: error.response.status,
							ok: false,
						}),
					);
				}
			},
		}),
	],
	callbacks: {
		// redirect: () => {
		// 	return process.env.NEXTAUTH_URL as string;
		// },
		jwt: async ({ token, user }) => {
			user && (token.user = user);
			return token;
		},
		session: async ({ session, token }) => {
			if (session.user) {
				session.user = token.user as IRequestUser;
			}
			return session;
		},
	},
};

export const getAuthSession = () => getServerSession(authOptions);
