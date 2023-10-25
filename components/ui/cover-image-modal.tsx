'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// LIB
import { useEdgeStore } from '@/lib/edgestore';

// HOOKS
import { useCoverImage } from '@/hooks/use-cover-image';

// SERVICES
import { DocumentService } from '@/services/document.service';

// COMPONENTS
import { SingleImageDropzone } from './single-image-dropzone';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';

const CoverImageModal: React.FC = () => {
	const coverImage = useCoverImage();
	const { edgestore } = useEdgeStore();
	const params = useParams();
	const [file, setFile] = useState<File>();
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const queryClient = useQueryClient();
	const uploadDocumentCoverImageMutation = useMutation({
		mutationKey: [`update-document-${params.documentId}`],
		mutationFn: DocumentService.updateDocument,
		onSuccess: async (data) => {
			queryClient.setQueryData(
				[`document-${params.documentId}`],
				() => data,
			);
		},
		onError: (error) => {
			console.error(error);
		},
	});

	const onClose = () => {
		setFile(undefined);
		setIsSubmitting(false);
		coverImage.onClose();
	};

	const onChange = async (newFile?: File) => {
		if (newFile) {
			setIsSubmitting(true);
			setFile(newFile);

			const res = await edgestore.publicFiles.upload({
				file: newFile,
				options: {
					replaceTargetUrl: coverImage.url,
				},
			});

			const promise = uploadDocumentCoverImageMutation.mutateAsync({
				documentId: params.documentId as string,
				coverImage: res.url,
			});

			toast.promise(promise, {
				loading: 'Uploading cover image...',
				success: 'Cover image uploaded successfully!',
				error: () => {
					setIsSubmitting(false);
					return 'Failed to upload cover image';
				},
				finally: onClose,
			});
		}
	};

	return (
		<Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
			<DialogContent>
				<DialogHeader>
					<h2 className="text-center text-lg font-semibold">
						Cover Image
					</h2>
				</DialogHeader>

				<SingleImageDropzone
					className="w-full outline-none"
					disabled={isSubmitting}
					value={file}
					onChange={onChange}
				/>
			</DialogContent>
		</Dialog>
	);
};

export { CoverImageModal };
