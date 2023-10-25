import { memo } from 'react';

// COMPONENTS
import { Dialog, DialogContent, DialogHeader } from './dialog';

interface ModalProps {
	children: React.ReactNode;
	show: boolean;
	setShow: (value: boolean) => void;
}

const Modal: React.FC<ModalProps> = memo(({ children, show, setShow }) => {
	return (
		<Dialog open={show} onOpenChange={setShow}>
			<DialogContent className="sm:max-w-[425px] flex items-center justify-center">
				<DialogHeader onClick={() => setShow(false)}></DialogHeader>
				{children}
			</DialogContent>
		</Dialog>
	);
});

Modal.displayName = 'Modal';

export { Modal };
