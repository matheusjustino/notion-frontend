'use client';

import { createContext, useCallback, useContext, useState } from 'react';

interface RegisterModalContextData {
	show: boolean;
	setShow: (value: boolean) => void;
}

const RegisterModalContext = createContext<RegisterModalContextData>(
	{} as RegisterModalContextData,
);

interface RegisterModalProviderProps {
	children: React.ReactNode;
}

export const RegisterModalProvider: React.FC<RegisterModalProviderProps> = ({
	children,
}) => {
	const [show, setShow] = useState<boolean>(false);

	const handleShow = useCallback((value: boolean) => {
		setShow(value);
	}, []);

	const modalProviderData: RegisterModalContextData = {
		show,
		setShow: handleShow,
	};

	return (
		<RegisterModalContext.Provider value={modalProviderData}>
			{children}
		</RegisterModalContext.Provider>
	);
};

export const useRegisterModal = () => useContext(RegisterModalContext);
