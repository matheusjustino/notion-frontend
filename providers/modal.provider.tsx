'use client';

import { useEffect, useState } from 'react';

// COMPONENTS
import { SettingsModal } from '@/app/(main)/_components/settings-modal';
import { CoverImageModal } from '@/components/ui/cover-image-modal';

const ModalProvider: React.FC = () => {
	const [isMounted, setIsMounted] = useState<boolean>(false);

	useEffect(() => setIsMounted(true), []);

	if (!isMounted) return null;

	return (
		<>
			<SettingsModal />
			<CoverImageModal />
		</>
	);
};

export { ModalProvider };
