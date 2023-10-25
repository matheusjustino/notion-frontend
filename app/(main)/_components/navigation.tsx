/* eslint-disable no-extra-boolean-cast */
import { ElementRef, MouseEvent, useEffect, useRef, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
	ChevronsLeft,
	Menu,
	Plus,
	PlusCircle,
	Search,
	Settings,
	Trash,
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMediaQuery } from 'usehooks-ts';
import { toast } from 'sonner';

// LIB
import { cn } from '@/lib/utils';

// HOOKS
import { useSearch } from '@/hooks/use-search';
import { useSettings } from '@/hooks/use-settings';

// INTERFACES
import { IDocument } from '@/interfaces/document.interface';

// SERVICES
import { DocumentService } from '@/services/document.service';

// COMPONENTS
import { Item } from './item';
import { UserItem } from './user-item';
import { DocumentList } from './document-list';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Navbar } from './navbar';
import { TrashBox } from './trash-box';

const Navigation: React.FC = () => {
	const { data: session } = useSession();
	const router = useRouter();
	const pathname = usePathname();
	const search = useSearch();
	const params = useParams();
	const settings = useSettings();
	const isMobile = useMediaQuery('(max-width: 768px)');
	const isResizingRef = useRef(false);
	const sidebarRef = useRef<ElementRef<'aside'>>(null);
	const navbarRef = useRef<ElementRef<'div'>>(null);
	const [isResetting, setIsResetting] = useState<boolean>(false);
	const [isCollapsed, setIsCollapsed] = useState<boolean>(isMobile);

	const queryClient = useQueryClient();
	const createDocumentMutation = useMutation({
		mutationKey: [`create-document`],
		mutationFn: DocumentService.create,
		onSuccess: (data) => {
			queryClient.setQueryData<IDocument[] | undefined>(
				[`list-documents`],
				(oldData) => {
					if (oldData) {
						oldData = oldData.concat(data);
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

	const handleCreate = (e?: MouseEvent) => {
		e?.stopPropagation();
		e?.preventDefault();

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

	useEffect(() => {
		if (isMobile) {
			collapse();
		} else {
			resetWidth();
		}
	}, [isMobile]);

	useEffect(() => {
		if (isMobile) {
			collapse();
		}
	}, [pathname, isMobile]);

	const handleMouseMove = (e: any) => {
		if (!isResizingRef.current) return;

		let newWidth = e.clientX;

		if (newWidth < 240) newWidth = 240;
		if (newWidth > 480) newWidth = 480;

		if (sidebarRef.current && navbarRef.current) {
			sidebarRef.current.style.width = `${newWidth}px`;
			navbarRef.current.style.setProperty('left', `${newWidth}px`);
			navbarRef.current.style.setProperty(
				'width',
				`calc(100% - ${newWidth}px)`,
			);
		}
	};

	const handleMouseUp = () => {
		isResizingRef.current = false;
		document.removeEventListener('mousemove', handleMouseMove);
		document.removeEventListener('mouseup', handleMouseUp);
	};

	const handleMouseDown = (e: MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		isResizingRef.current = true;
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
	};

	const resetWidth = () => {
		if (sidebarRef.current && navbarRef.current) {
			setIsCollapsed(false);
			setIsResetting(true);

			sidebarRef.current.style.width = isMobile ? '100%' : '240px';
			navbarRef.current.style.setProperty(
				'width',
				isMobile ? '0' : 'calc(100% - 240px)',
			);
			navbarRef.current.style.setProperty(
				'left',
				isMobile ? '100%' : '240px',
			);

			setTimeout(() => setIsResetting(false), 300);
		}
	};

	const collapse = () => {
		if (sidebarRef.current && navbarRef.current) {
			setIsCollapsed(true);
			setIsResetting(true);

			sidebarRef.current.style.width = '0';
			navbarRef.current.style.setProperty('width', '100%');
			navbarRef.current.style.setProperty('left', '0');

			setTimeout(() => setIsResetting(false), 300);
		}
	};

	return (
		<>
			<aside
				ref={sidebarRef}
				className={cn(
					'group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]',
					isResetting && 'transition-all ease-in-out duration-300',
					isMobile && 'w-0',
				)}
			>
				<div
					role="button"
					onClick={collapse}
					className={cn(
						`h-6 w-6 text-muted-foreground rounded-sm
						hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute
						top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition`,
						isMobile && 'opacity-100',
					)}
				>
					<ChevronsLeft className="h-6 w-6" />
				</div>

				<div>
					<UserItem />
					<Item
						label="Search"
						icon={Search}
						isSearch
						onClick={search.onOpen}
					/>
					<Item
						label="Settings"
						icon={Settings}
						onClick={settings.onOpen}
					/>
					<Item
						onClick={handleCreate}
						label="New Page"
						icon={PlusCircle}
					/>
					<Popover>
						<PopoverTrigger className="w-full mt-4">
							<Item label="Trash" icon={Trash} />
						</PopoverTrigger>

						<PopoverContent
							side={isMobile ? 'bottom' : 'left'}
							className="p-0 w-72"
						>
							<TrashBox />
						</PopoverContent>
					</Popover>
				</div>

				<div className="mt-4">
					<DocumentList />
					<Item
						onClick={handleCreate}
						icon={Plus}
						label="Add a page"
					/>
				</div>

				<div
					onMouseDown={handleMouseDown}
					onClick={resetWidth}
					className={`opacity-0 group-hover/sidebar:opacity-100 transition
					cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0`}
				></div>
			</aside>

			<div
				ref={navbarRef}
				className={cn(
					'absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]',
					isResetting && 'transition-all ease-in-out duration-300',
					isMobile && 'left-0 w-full',
				)}
			>
				{!!params.documentId ? (
					<Navbar
						isCollapsed={isCollapsed}
						onResetWidth={resetWidth}
					/>
				) : (
					<nav className="bg-transparent px-3 py-2 w-full">
						{isCollapsed && (
							<Menu
								role="button"
								onClick={resetWidth}
								className="h-6 w-6 text-muted-foreground"
							/>
						)}
					</nav>
				)}
			</div>
		</>
	);
};

export { Navigation };
