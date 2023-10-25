'use client';

import { MouseEvent, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Search, Trash, Undo } from 'lucide-react';
import { toast } from 'sonner';

// SERVICES
import { DocumentService } from '@/services/document.service';

// COMPONENTS
import { Input } from '@/components/ui/input';
import { ConfirmDeleteModal } from './confirm-delete-modal';
import { Spinner } from '@/components/ui/spinner';

const TrashBox: React.FC = () => {
	const router = useRouter();
	const params = useParams();
	const [search, setSearch] = useState<string>('');

	const queryClient = useQueryClient();
	const restoreDocumentMutation = useMutation({
		mutationKey: [`restore-document`],
		mutationFn: DocumentService.restoreDocuments,
		onSuccess: async (data) => {
			const listDocumentsQueryKey = data.parentDocumentId
				? `list-documents-${data.parentDocumentId}`
				: 'list-documents';
			await Promise.all([
				queryClient.setQueryData([`document-${data.id}`], () => data),
				queryClient.refetchQueries({
					queryKey: [`list-archive-documents`],
					exact: true,
				}),
				queryClient.refetchQueries({
					queryKey: [listDocumentsQueryKey],
				}),
				queryClient.refetchQueries({
					queryKey: [`list-documents-${data.id}`],
				}),
			]);
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
	const listArchiveDocumentsQuery = useQuery({
		queryKey: [`list-archive-documents`],
		queryFn: DocumentService.listArchiveDocuments,
	});

	const onRestore = (e: MouseEvent, documentId: string) => {
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

	const onDelete = (documentId: string) => {
		const promise = deleteDocumentMutation.mutateAsync(documentId);

		toast.promise(promise, {
			loading: 'Deleting document...',
			success: 'Note deleted!',
			error: 'Failed to delete note.',
		});
	};

	const onClick = (documentId: string) => {
		router.push(`/documents/${documentId}`);
	};

	const filteredDocuments =
		listArchiveDocumentsQuery.data?.filter((doc) =>
			doc.title.toLowerCase().includes(search),
		) ?? [];

	if (
		listArchiveDocumentsQuery.isLoading ||
		listArchiveDocumentsQuery.isPending
	) {
		return <Spinner className="m-auto" size="lg" />;
	}

	return (
		<div className="text-sm p-2">
			<div className="flex items-center gap-x-2">
				<Search className="w-4 h-4" />

				<Input
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
					placeholder="Filter by page title"
				/>
			</div>

			<div className="mt-3 px-1 pb-1">
				<p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
					No documents found.
				</p>

				{listArchiveDocumentsQuery.data?.map((document) => (
					<div
						key={document.id}
						role="button"
						onClick={() => onClick(document.id)}
						className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"
					>
						<span className="truncate pl-2">{document.title}</span>

						<div className="flex items-center">
							<div
								role="button"
								onClick={(e) => onRestore(e, document.id)}
								className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
							>
								<Undo className="w-4 h-4 text-muted-foreground" />
							</div>

							<ConfirmDeleteModal
								onConfirm={() => onDelete(document.id)}
							>
								<div
									role="button"
									className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
								>
									<Trash className="w-4 h-4 text-muted-foreground" />
								</div>
							</ConfirmDeleteModal>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export { TrashBox };
