import { memo } from 'react';

// PROVIDERS
import { useRegisterModal } from '@/providers/register-modal.provider';
import { useLoginModal } from '@/providers/login-modal.provider';

// COMPONENTS
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const RegisterModal: React.FC = memo(() => {
	const { show, setShow } = useRegisterModal();
	const { setShow: setShowLoginModal } = useLoginModal();

	const handleLoginModal = () => {
		setShowLoginModal(true);
		setShow(false);
	};

	return (
		<Modal show={show} setShow={setShow}>
			<div className="w-full flex flex-col gap-8">
				<div className="flex flex-col gap-1">
					<h1 className="font-bold text-xl">Sign up</h1>
					<h2 className="text-gray-400 text-sm">
						To continuo to Notion
					</h2>
				</div>

				<form className="flex flex-col gap-4 w-full">
					<Input placeholder="First Name" type="text" />
					<Input placeholder="Last Name" type="text" />
					<Input placeholder="Email" type="email" />
					<Input placeholder="Password" type="password" />
					<Button>Register</Button>
					<div className="text-xs ml-auto">
						Already have an account?{' '}
						<span
							onClick={handleLoginModal}
							className="text-blue-500 hover:cursor-pointer hover:underline"
						>
							Sign in
						</span>
					</div>
				</form>
			</div>
		</Modal>
	);
});

RegisterModal.displayName = 'Register Modal';

export { RegisterModal };
