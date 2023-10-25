'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { MoreHorizontal, Trash } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// INTERFACES
import { IDocument } from '@/interfaces/document.interface';

// SERVICES
import { DocumentService } from '@/services/document.service';

// COMPONENTS
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface MenuProps {
	documentId: string;
	isArchived: boolean;
}

const Menu = ({ documentId, isArchived }: MenuProps) => {
	const { data: session } = useSession();
	const router = useRouter();

	const level = 0;

	const queryClient = useQueryClient();
	const archiveDocumentMutation = useMutation({
		mutationKey: [`archive-document-${documentId}`],
		mutationFn: DocumentService.archive,
		onSuccess: async (data) => {
			const queryKey = level
				? `list-documents-${data.parentDocumentId}`
				: `list-documents`;
			queryClient.setQueryData<IDocument[] | undefined>(
				[queryKey],
				(oldData) => {
					if (oldData) {
						oldData = oldData.filter((old) => old.id !== data.id);
					}

					return oldData;
				},
			);

			queryClient.setQueryData([`document-${data.id}`], () => data);

			await queryClient.refetchQueries({
				queryKey: [`list-archive-documents`],
			});

			router.push('/documents');
		},
		onError: (error: any) => {
			console.error(error);
		},
	});

	const onArchive = () => {
		if (isArchived) return;

		const promise = archiveDocumentMutation.mutateAsync({
			documentId,
		});

		toast.promise(promise, {
			loading: 'Moving to trash...',
			success: 'Note moved to trash!',
			error: 'Failed to archive note.',
		});
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size="sm" variant="ghost">
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-60"
				align="end"
				alignOffset={8}
				forceMount
			>
				<DropdownMenuItem
					onClick={onArchive}
					disabled={isArchived}
					className="cursor-pointer"
				>
					<Trash className="h-4 w-4 mr-2" />
					Delete
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<div className="text-xs text-muted-foreground p-2">
					Last edited by: {session?.user.firstName}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

Menu.Skeleton = function MenuSkeleton() {
	return <Skeleton className="h-10 w-10" />;
};

export { Menu };
