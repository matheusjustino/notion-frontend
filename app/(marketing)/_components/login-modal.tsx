'use client';

import { memo, useCallback, useState } from 'react';
import { signIn } from 'next-auth/react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

// PROVIDERS
import { useLoginModal } from '@/providers/login-modal.provider';
import { useRegisterModal } from '@/providers/register-modal.provider';

// COMPONENTS
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
	email: z.string().email().min(1),
	password: z
		.string()
		.min(3, { message: 'Password must contain at least 3 character(s)' }),
});

type FormType = z.infer<typeof formSchema & FieldValues>;

const LoginModal: React.FC = memo(() => {
	const { show, setShow } = useLoginModal();
	const { setShow: setShowRegisterModal } = useRegisterModal();
	const [isLoading, setIsLoading] = useState(false);

	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm<FormType>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: 'teste@email.com',
			password: '123',
		},
	});

	const handleRegisterModal = () => {
		setShowRegisterModal(true);
		setShow(false);
	};

	const onSubmit: SubmitHandler<FormType> = useCallback(
		async (data, event) => {
			event?.preventDefault();

			try {
				setIsLoading(true);
				const result = await signIn('credentials', {
					...data,
					redirect: false,
				});

				if (result?.error) {
					const parsedError = JSON.parse(
						JSON.stringify(result.error),
					);
					const message =
						typeof parsedError === 'string'
							? parsedError
							: parsedError.error;

					return toast.error(message || 'Something went wrong', {
						description: 'Please try again',
					});
				}

				toast.success('Logged in successfully');

				setShow(false);
			} catch (error: any) {
				console.error(error);
				const errorMsg =
					error.response?.message ||
					error.message ||
					'Something went wrong';

				return toast.error(errorMsg, {
					description: 'Please try again later',
				});
			} finally {
				setIsLoading(false);
			}
		},
		[setShow],
	);

	return (
		<Modal show={show} setShow={setShow}>
			<div className="w-full h-full flex flex-col gap-8">
				<div className="flex flex-col gap-1">
					<h1 className="font-bold text-xl">Sign in</h1>
					<h2 className="text-gray-400 text-sm">
						To continuo to Notion
					</h2>
				</div>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col gap-4 w-full"
				>
					<Input
						id="email"
						placeholder="Email"
						type="email"
						register={register('email', { required: true })}
						errors={errors}
					/>
					<Input
						id="password"
						placeholder="Password"
						type="password"
						register={register('password', { required: true })}
						errors={errors}
					/>
					<Button loading={isLoading} disabled={isLoading}>
						Login
					</Button>
					<div className="text-xs ml-auto">
						No account?{' '}
						<span
							onClick={handleRegisterModal}
							className="text-blue-500 hover:cursor-pointer hover:underline"
						>
							Sign up
						</span>
					</div>
				</form>
			</div>
		</Modal>
	);
});

LoginModal.displayName = 'Login Modal';

export { LoginModal };
