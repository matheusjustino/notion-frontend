'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ImageIcon, X } from 'lucide-react';
import { toast } from 'sonner';

// LIB
import { cn } from '@/lib/utils';
import { useEdgeStore } from '@/lib/edgestore';

// HOOKS
import { useCoverImage } from '@/hooks/use-cover-image';

// INTERFACES
import { IDocument } from '@/interfaces/document.interface';

// SERVICES
import { DocumentService } from '@/services/document.service';

// COMPONENTS
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface CoverImageProps {
	url?: string;
	preview?: boolean;
}

const Cover = ({ url, preview }: CoverImageProps) => {
	const { edgestore } = useEdgeStore();
	const coverImage = useCoverImage();
	const params = useParams();

	const queryClient = useQueryClient();
	const removeCoverImageMutation = useMutation({
		mutationKey: [`remove-image-document-${params.documentId}`],
		mutationFn: DocumentService.removeDocumentCoverImage,
	});

	const onRemove = async () => {
		const promises: any = [
			removeCoverImageMutation.mutateAsync(params.documentId as string),
		];
		if (url) {
			promises.push(
				edgestore.publicFiles.delete({
					url,
				}),
			);
		}

		toast.promise(Promise.all(promises), {
			loading: 'Removing cover image...',
			success: (res: IDocument[]) => {
				queryClient.setQueryData(
					[`document-${params.documentId}`],
					() => res[0],
				);
				return 'Cover image removed successfully!';
			},
			error: 'Failed to remove cover image',
		});
	};

	return (
		<div
			className={cn(
				'relative w-full h-[35vh] group',
				!url && 'h-[12vh]',
				url && 'bg-muted',
			)}
		>
			{!!url && (
				<Image src={url} fill alt="Cover" className="object-cover" />
			)}
			{url && !preview && (
				<div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2">
					<Button
						onClick={() => coverImage.onReplace(url)}
						className="text-muted-foreground text-xs"
						variant="outline"
						size="sm"
					>
						<ImageIcon className="h-4 w-4 mr-2" />
						Change cover
					</Button>
					<Button
						onClick={onRemove}
						className="text-muted-foreground text-xs"
						variant="outline"
						size="sm"
					>
						<X className="h-4 w-4 mr-2" />
						Remove
					</Button>
				</div>
			)}
		</div>
	);
};

Cover.Skeleton = function CoverSkeleton() {
	return <Skeleton className="w-full h-[12vh]" />;
};

export { Cover };
