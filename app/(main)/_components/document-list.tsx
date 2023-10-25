'use client';

import { memo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { FileIcon } from 'lucide-react';

// LIB
import { cn } from '@/lib/utils';

// INTERFACES
import { IDocument } from '@/interfaces/document.interface';

// SERVICES
import { DocumentService } from '@/services/document.service';

// COMPONENTS
import { Item } from './item';

interface DocumentListProps {
	parentDocumentId?: string;
	level?: number;
	data?: IDocument[];
}

const DocumentList: React.FC<DocumentListProps> = memo(
	({ parentDocumentId, level = 0, data }) => {
		const params = useParams();
		const router = useRouter();
		const [expanded, setExpanded] = useState<Record<string, boolean>>({});
		const listDocumentsQueryKey = parentDocumentId
			? `list-documents-${parentDocumentId}`
			: `list-documents`;

		const listDocumentsQuery = useQuery({
			queryKey: [listDocumentsQueryKey],
			queryFn: async () => {
				return DocumentService.list(parentDocumentId);
			},
		});

		const onExpand = (documentId: string) => {
			setExpanded((old) => ({
				...old,
				[documentId]: !old[documentId],
			}));
		};

		const onRedirect = (documentId: string) => {
			router.push(`/documents/${documentId}`);
		};

		if (listDocumentsQuery.isLoading || listDocumentsQuery.isPending) {
			return (
				<>
					<Item.Skeleton level={level} />
					{level === 0 && (
						<>
							<Item.Skeleton level={level} />
							<Item.Skeleton level={level} />
						</>
					)}
				</>
			);
		}

		return (
			<>
				<p
					style={{
						paddingLeft: level ? `${level * 12 + 25}px` : undefined,
					}}
					className={cn(
						'hidden text-[12px] font-medium text-muted-foreground/80',
						expanded && 'last:block',
						level === 0 && 'hidden',
					)}
				>
					No pages inside
				</p>

				{listDocumentsQuery.data?.map((document) => (
					<div key={document.id}>
						<Item
							id={document.id}
							onClick={() => onRedirect(document.id)}
							label={document.title}
							icon={FileIcon}
							documentIcon={document.icon}
							active={params.documentId === document.id}
							level={level}
							onExpand={() => onExpand(document.id)}
							expanded={expanded[document.id]}
						/>

						{expanded[document.id] && (
							<DocumentList
								parentDocumentId={document.id}
								level={level + 1}
							/>
						)}
					</div>
				))}
			</>
		);
	},
);

DocumentList.displayName = 'DocumentList';

export { DocumentList };
