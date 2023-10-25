'use client';

import { MouseEvent } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
	ChevronDown,
	ChevronRight,
	LucideIcon,
	MoreHorizontal,
	Plus,
	Trash,
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// LIB
import { cn } from '@/lib/utils';

// SERVICES
import { DocumentService } from '@/services/document.service';

// INTERFACES
import { IDocument } from '@/interfaces/document.interface';

// COMPONENTS
import { Skeleton } from '@/components/ui/skeleton';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ItemProps {
	id?: string;
	documentIcon?: string;
	active?: boolean;
	expanded?: boolean;
	isSearch?: boolean;
	level?: number;
	onExpand?: () => void;
	onClick?: () => void;
	label: string;
	icon: LucideIcon;
}

const Item = ({
	id,
	documentIcon,
	active,
	expanded,
	isSearch,
	level = 0,
	onExpand,
	label,
	onClick,
	icon: Icon,
}: ItemProps) => {
	const { data: session } = useSession();
	const router = useRouter();
	const ChevronIcon = expanded ? ChevronDown : ChevronRight;

	const queryClient = useQueryClient();
	const createDocumentMutation = useMutation({
		mutationKey: [`create-document`],
		mutationFn: DocumentService.create,
		onSuccess: (data) => {
			queryClient.setQueryData<IDocument[] | undefined>(
				[`list-documents-${id}`],
				(oldData) => {
					if (oldData) {
						oldData = oldData.concat(data);
					}

					return oldData;
				},
			);

			if (!expanded) {
				onExpand?.();
			}

			router.push(`/documents/${data.id}`);
		},
		onError: (error: any) => {
			console.error(error);
		},
	});
	const archiveDocumentMutation = useMutation({
		mutationKey: [`archive-document-${id}`],
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

			router.push(`/documents`);
		},
		onError: (error: any) => {
			console.error(error);
		},
	});

	const handleExpand = (e: MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		e.preventDefault();
		onExpand?.();
	};

	const handleCreate = (e: MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();

		if (!id) return;

		const promise = createDocumentMutation.mutateAsync({
			title: 'Untitled',
			authorId: session?.user.id,
			parentDocumentId: id,
		});

		toast.promise(promise, {
			loading: 'Creating new document...',
			success: 'New note created!',
			error: 'Failed to create a new note.',
		});
	};

	const handleArchive = (e: MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();

		if (!id) return;

		const promise = archiveDocumentMutation.mutateAsync({
			documentId: id,
		});

		toast.promise(promise, {
			loading: 'Moving to trash...',
			success: 'Note moved to trash!',
			error: 'Failed to archive note.',
		});
	};

	return (
		<div
			onClick={onClick}
			role="button"
			style={{ paddingLeft: level ? `${level * 12 + 12}px` : '12px' }}
			className={cn(
				`group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground`,
				active && 'bg-primary/5 text-primary font-semibold',
			)}
		>
			{!!id && (
				<div
					role="button"
					className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1"
					onClick={handleExpand}
				>
					<ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
				</div>
			)}

			{documentIcon ? (
				<div className="shrink-0 mr-2 text-[18px]">{documentIcon}</div>
			) : (
				<Icon className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground" />
			)}

			<span className="truncate">{label}</span>

			{isSearch && (
				<kbd
					className={`ml-auto pointer-events-none inline-flex h-5 select-none
					items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px]
					font-medium text-muted-foreground opacity-100`}
				>
					<span className="text-[14px]">⌘</span>
					<span className="text-[14px]">K</span>
				</kbd>
			)}

			{!!id && (
				<div className="ml-auto flex items-center gap-x-2">
					<DropdownMenu>
						<DropdownMenuTrigger
							asChild
							onClick={(e) => e.stopPropagation()}
						>
							<div
								role="button"
								className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:bg-neutral-600"
							>
								<MoreHorizontal className="h-4 w-4 text-muted-foreground" />
							</div>
						</DropdownMenuTrigger>

						<DropdownMenuContent
							className="w-60"
							align="start"
							side="right"
							forceMount
							onClick={(e) => e.stopPropagation()}
						>
							<DropdownMenuItem
								onClick={handleArchive}
								className="cursor-pointer hover:bg-red-100"
							>
								<Trash className="h-4 w-4 mr-2" /> Delete
							</DropdownMenuItem>

							<DropdownMenuSeparator />

							<div className="text-xs text-muted-foreground p-2">
								Last edited by: {session?.user.firstName}
							</div>
						</DropdownMenuContent>
					</DropdownMenu>

					<div className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:bg-neutral-600">
						<Plus
							onClick={handleCreate}
							className="h-4 w-4 text-muted-foreground"
						/>
					</div>
				</div>
			)}
		</div>
	);
};

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
	return (
		<div
			style={{
				paddingLeft: level ? `${level * 12 + 25}px` : '12px',
			}}
			className="flex gap-x-2 py-[3px]"
		>
			<Skeleton className="h-4 w-4" />
			<Skeleton className="h-4 w-[30$]" />
		</div>
	);
};

export { Item };
