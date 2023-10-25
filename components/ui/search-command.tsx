'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { File } from 'lucide-react';

// HOOKS
import { useSearch } from '@/hooks/use-search';

// COMPONENTS
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from './command';
import { DocumentService } from '@/services/document.service';

const SearchCommand: React.FC = () => {
	const router = useRouter();
	const [isMounted, setIsMounted] = useState(false);
	const { data: session } = useSession();

	const toggle = useSearch((store) => store.onToggle);
	const isOpen = useSearch((store) => store.isOpen);
	const onClose = useSearch((store) => store.onClose);

	const listDocumentsQuery = useQuery({
		queryKey: [`list-documents`],
		queryFn: async () => DocumentService.list(),
	});

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				toggle();
			}
		};

		document.addEventListener('keydown', down);
		return () => document.removeEventListener('keydown', down);
	}, [toggle]);

	const onSelect = (id: string) => {
		router.push(`/documents/${id}`);
		onClose();
	};

	if (!isMounted) {
		return null;
	}

	return (
		<CommandDialog open={isOpen} onOpenChange={onClose}>
			<CommandInput
				placeholder={`Search ${session?.user.firstName}'s Notion...`}
			/>
			<CommandList>
				<CommandEmpty>No results found.</CommandEmpty>
				<CommandGroup heading="Documents">
					{listDocumentsQuery.data?.map((document) => (
						<CommandItem
							key={document.id}
							value={`${document.id}-${document.title}`}
							title={document.title}
							onSelect={() => onSelect(document.id)}
						>
							{document.icon ? (
								<p className="mr-2 text-[18px]">
									{document.icon}
								</p>
							) : (
								<File className="mr-2 h-4 w-4" />
							)}
							<span>{document.title}</span>
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	);
};

export { SearchCommand };
