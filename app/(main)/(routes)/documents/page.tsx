'use client';

import { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { PlusCircle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// INTERFACES
import { IDocument } from '@/interfaces/document.interface';

// SERVICES
import { DocumentService } from '@/services/document.service';

// COMPONENTS
import { Button } from '@/components/ui/button';

const DocumentsPage: NextPage = () => {
	const { data: session } = useSession();
	const router = useRouter();

	const queryClient = useQueryClient();
	const createDocumentMutation = useMutation({
		mutationKey: [`create-document`],
		mutationFn: DocumentService.create,
		onSuccess: (data) => {
			queryClient.setQueryData<IDocument[] | undefined>(
				[`list-documents`],
				(oldData) => {
					if (oldData) {
						oldData.push(data);
					}

					return oldData;
				},
			);

			router.push(`/documents/${data.id}`);
		},
		onError: (error: any) => {
			console.error(error);
		},
	});

	const onCreate = () => {
		const promise = createDocumentMutation.mutateAsync({
			title: 'Untitled',
			authorId: session?.user.id,
		});

		toast.promise(promise, {
			loading: 'Creating new document...',
			success: 'New note created!',
			error: 'Failed to create a new note.',
		});
	};

	return (
		<div className="h-full flex flex-col items-center justify-center space-y-4">
			<Image
				src="/empty.png"
				height="300"
				width="300"
				alt="Empty"
				className="dark:hidden"
			/>

			<Image
				src="/empty-dark.png"
				height="300"
				width="300"
				alt="Empty"
				className="hidden dark:block"
			/>

			<h2 className="text-lg font-medium">
				Welcome to {session?.user.firstName}&apos;s Notion
			</h2>

			<Button
				disabled={createDocumentMutation.isPending}
				onClick={onCreate}
			>
				<PlusCircle className="w-4 h-4 mr-2" /> Create a note
			</Button>
		</div>
	);
};

export default DocumentsPage;
