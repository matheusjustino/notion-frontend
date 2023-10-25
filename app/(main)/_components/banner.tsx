'use client';

import { MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// SERVICES
import { DocumentService } from '@/services/document.service';

// COMPONENTS
import { Button } from '@/components/ui/button';
import { ConfirmDeleteModal } from './confirm-delete-modal';
import { IDocument } from '@/interfaces/document.interface';

interface BannerProps {
	documentId: string;
}

const Banner: React.FC<BannerProps> = ({ documentId }) => {
	const router = useRouter();

	const queryClient = useQueryClient();
	const restoreDocumentMutation = useMutation({
		mutationKey: [`restore-document`],
		mutationFn: DocumentService.restoreDocuments,
		onSuccess: async (data) => {
			queryClient.setQueryData<IDocument | undefined>(
				[`document-${data.id}`],
				() => data,
			);
			queryClient.setQueryData<IDocument[] | undefined>(
				['list-archive-documents'],
				(oldData) => {
					if (oldData) {
						oldData = oldData.filter((doc) => doc.id !== data.id);
					}

					return oldData;
				},
			);
			queryClient.setQueryData<IDocument[] | undefined>(
				[
					data.parentDocumentId
						? `list-documents-${data.parentDocumentId}`
						: 'list-documents',
				],
				(oldData) => {
					if (oldData) {
						oldData = oldData.concat(data);
					}

					return oldData;
				},
			);
		},
		onError: (error: any) => {
			console.error(error);
		},
	});
	const deleteDocumentMutation = useMutation({
		mutationKey: [`restore-document`],
		mutationFn: DocumentService.deleteDocuments,
		onSuccess: async () => {
			queryClient.refetchQueries({
				queryKey: [`list-archive-documents`],
				exact: true,
			});

			router.push(`/documents`);
		},
		onError: (error: any) => {
			console.error(error);
		},
	});

	const onRestore = (e: MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		e.preventDefault();

		const promise = restoreDocumentMutation.mutateAsync({
			documentId,
		});

		toast.promise(promise, {
			loading: 'Restoring document...',
			success: 'Note restored!',
			error: 'Failed to restore note.',
		});
	};

	const onDelete = () => {
		const promise = deleteDocumentMutation.mutateAsync(documentId);

		toast.promise(promise, {
			loading: 'Deleting document...',
			success: 'Note deleted!',
			error: 'Failed to delete note.',
		});
	};

	return (
		<div className="w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center">
			<p>This page is in the Trash.</p>

			<Button
				size="sm"
				onClick={onRestore}
				variant="outline"
				className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 h-auto font-normal"
			>
				Restore page
			</Button>

			<ConfirmDeleteModal onConfirm={onDelete}>
				<Button
					size="sm"
					variant="outline"
					className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 h-auto font-normal"
				>
					Delete forever
				</Button>
			</ConfirmDeleteModal>
		</div>
	);
};

export { Banner };
