'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

// SERVICES
import { DocumentService } from '@/services/document.service';

// COMPONENTS
import { Cover } from '@/components/ui/cover';
import { Toolbar } from '@/components/ui/toolbar';
import { Skeleton } from '@/components/ui/skeleton';

interface DocumentIdPageProps {
	params: {
		documentId: string;
	};
}

const DocumentIdPage = ({ params: { documentId } }: DocumentIdPageProps) => {
	const Editor = useMemo(
		() => dynamic(() => import('@/components/ui/editor'), { ssr: false }),
		[],
	);

	const documentQuery = useQuery({
		queryKey: [`document-${documentId}`],
		queryFn: async () => DocumentService.getPreviewById(documentId),
	});

	if (documentQuery.isLoading || documentQuery.isPending) {
		return (
			<div>
				<Cover.Skeleton />

				<div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
					<div className="space-y-4 pl-8 pt-4">
						<Skeleton className="h-14 w-[50%]" />
						<Skeleton className="h-4 w-[80%]" />
						<Skeleton className="h-4 w-[40%]" />
						<Skeleton className="h-4 w-[60%]" />
					</div>
				</div>
			</div>
		);
	}

	if (documentQuery.error || !documentQuery.data) {
		return notFound();
	}

	return (
		<div className="pb-40 h-screen">
			<Cover preview url={documentQuery.data.coverImage} />
			<div className="md:max-w-3xl lg:max-w-4xl mx-auto">
				<Toolbar preview initialData={documentQuery.data} />
				<Editor
					editable={false}
					onChange={() => {}}
					initialContent={documentQuery.data.content}
				/>
			</div>
		</div>
	);
};

export default DocumentIdPage;
