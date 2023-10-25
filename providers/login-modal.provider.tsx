'use client';

import { createContext, useCallback, useContext, useState } from 'react';

interface LoginModalContextData {
	show: boolean;
	setShow: (value: boolean) => void;
}

const LoginModalContext = createContext<LoginModalContextData>(
	{} as LoginModalContextData,
);

interface LoginModalProviderProps {
	children: React.ReactNode;
}

export const LoginModalProvider: React.FC<LoginModalProviderProps> = ({
	children,
}) => {
	const [show, setShow] = useState<boolean>(false);

	const handleShow = useCallback((value: boolean) => {
		setShow(value);
	}, []);

	const modalProviderData: LoginModalContextData = {
		show,
		setShow: handleShow,
	};

	return (
		<LoginModalContext.Provider value={modalProviderData}>
			{children}
		</LoginModalContext.Provider>
	);
};

export const useLoginModal = () => useContext(LoginModalContext);
