'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { MenuIcon } from 'lucide-react';

// SERVICES
import { DocumentService } from '@/services/document.service';

// COMPONENTS
import { Menu } from './menu';
import { Title } from './title';
import { Banner } from './banner';
import { Publish } from './publish';

interface NavbarProps {
	isCollapsed: boolean;
	onResetWidth: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isCollapsed, onResetWidth }) => {
	const params = useParams();

	const documentQuery = useQuery({
		queryKey: [`document-${params.documentId}`],
		queryFn: async () =>
			DocumentService.getById(params.documentId as string),
	});

	if (documentQuery.isLoading || documentQuery.isPending) {
		return (
			<nav className="bg-background dark:bg-[#1f1f1f] px-3 py-2 w-full flex items-center justify-between">
				<Title.Skeleton />

				<div className="flex items-center gap-x-2">
					<Menu.Skeleton />
				</div>
			</nav>
		);
	}

	if (!documentQuery.data || documentQuery.error) return null;

	return (
		<>
			<nav className="bg-background dark:bg-[#1f1f1f] px-3 py-2 w-full flex items-center gap-x-4">
				{isCollapsed && (
					<MenuIcon
						role="button"
						onClick={onResetWidth}
						className="h-6 w-6 text-muted-foreground"
					/>
				)}

				<div className="flex items-center justify-between w-full">
					<Title initialData={documentQuery.data} />

					<div className="flex items-center gap-x-2">
						<Publish initialData={documentQuery.data} />
						<Menu
							documentId={documentQuery.data.id}
							isArchived={documentQuery.data.isArchived}
						/>
					</div>
				</div>
			</nav>

			{documentQuery.data.isArchived && (
				<Banner documentId={documentQuery.data.id} />
			)}
		</>
	);
};

export { Navbar };
