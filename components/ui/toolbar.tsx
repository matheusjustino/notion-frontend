'use client';

import { ElementRef, KeyboardEvent, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ReactTextareaAutosize from 'react-textarea-autosize';
import { ImageIcon, Smile, X } from 'lucide-react';

// INTERFACES
import { IDocument } from '@/interfaces/document.interface';

// HOOKS
import { useCoverImage } from '@/hooks/use-cover-image';

// SERVICES
import { DocumentService } from '@/services/document.service';

// COMPONENTS
import { Button } from './button';
import { IconPicker } from './icon-picker';

interface ToolbarProps {
	initialData: IDocument;
	preview?: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ initialData, preview }) => {
	const coverImage = useCoverImage();
	const inputRef = useRef<ElementRef<'textarea'>>(null);
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [value, setValue] = useState<string>(initialData.title);

	const queryClient = useQueryClient();
	const updateDocumentMutation = useMutation({
		mutationKey: [`update-document-${initialData.id}`],
		mutationFn: DocumentService.updateDocument,
		onSuccess: async (data) => {
			const promises = [
				new Promise((resolve) => {
					resolve(
						queryClient.setQueryData(
							[`document-${initialData.id}`],
							() => data,
						),
					);
				}),
				new Promise((resolve) => {
					resolve(
						queryClient.setQueryData<IDocument[] | undefined>(
							['list-documents'],
							(oldData) => {
								if (oldData) {
									oldData = oldData.map((doc) => {
										if (doc.id === data.id) return data;
										return doc;
									});
								}

								return oldData;
							},
						),
					);
				}),
				new Promise((resolve) => {
					resolve(
						queryClient.setQueryData<IDocument[] | undefined>(
							['list-archive-documents'],
							(oldData) => {
								if (oldData) {
									oldData = oldData.map((doc) => {
										if (doc.id === data.id) return data;
										return doc;
									});
								}

								return oldData;
							},
						),
					);
				}),
			];

			if (data.parentDocumentId) {
				promises.push(
					new Promise((resolve) => {
						resolve(
							queryClient.setQueryData<IDocument[] | undefined>(
								[`list-documents-${data.parentDocumentId}`],
								(oldData) => {
									if (oldData) {
										oldData = oldData.map((doc) => {
											if (doc.id === data.id) return data;
											return doc;
										});
									}

									return oldData;
								},
							),
						);
					}),
				);
			}

			await Promise.all(promises);
		},
		onError: (error) => {
			console.error(error);
		},
	});
	const removeDocumentIconMutation = useMutation({
		mutationKey: [`update-document-${initialData.id}`],
		mutationFn: DocumentService.removeDocumentIcon,
		onSuccess: async (data) => {
			const promises = [
				new Promise((resolve) => {
					resolve(
						queryClient.setQueryData(
							[`document-${initialData.id}`],
							() => data,
						),
					);
				}),
				new Promise((resolve) => {
					resolve(
						queryClient.setQueryData<IDocument[] | undefined>(
							['list-documents'],
							(oldData) => {
								if (oldData) {
									oldData = oldData.map((doc) => {
										if (doc.id === data.id) return data;
										return doc;
									});
								}

								return oldData;
							},
						),
					);
				}),
				new Promise((resolve) => {
					resolve(
						queryClient.setQueryData<IDocument[] | undefined>(
							['list-archive-documents'],
							(oldData) => {
								if (oldData) {
									oldData = oldData.map((doc) => {
										if (doc.id === data.id) return data;
										return doc;
									});
								}

								return oldData;
							},
						),
					);
				}),
			];

			if (data.parentDocumentId) {
				promises.push(
					new Promise((resolve) => {
						resolve(
							queryClient.setQueryData<IDocument[] | undefined>(
								[`list-documents-${data.parentDocumentId}`],
								(oldData) => {
									if (oldData) {
										oldData = oldData.map((doc) => {
											if (doc.id === data.id) return data;
											return doc;
										});
									}

									return oldData;
								},
							),
						);
					}),
				);
			}

			await Promise.all(promises);
		},
		onError: (error) => {
			console.error(error);
		},
	});

	const enableInput = () => {
		if (preview) return;

		setIsEditing(true);
		setTimeout(() => {
			setValue(initialData.title);
			inputRef.current?.focus();
		}, 0);
	};

	const disableInput = () => {
		setIsEditing(false);
	};

	const onInput = async (newValue: string) => {
		setValue(newValue);

		await updateDocumentMutation.mutateAsync({
			documentId: initialData.id,
			title: newValue || 'Untitled',
		});
	};

	const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			disableInput();
		}
	};

	const onIconSelect = async (icon: string) => {
		await updateDocumentMutation.mutateAsync({
			documentId: initialData.id,
			icon,
		});
	};

	const onRemoveIcon = async () => {
		await removeDocumentIconMutation.mutateAsync(initialData.id);
	};

	return (
		<div className="pl-[54px] group relative">
			{!!initialData.icon && !preview && (
				<div className="flex items-center gap-x-2 group/icon pt-6">
					<IconPicker onChange={() => {}}>
						<p className="text-6xl hover:opacity-75 transition">
							{initialData.icon}
						</p>
					</IconPicker>

					<Button
						onClick={onRemoveIcon}
						variant="outline"
						size="icon"
						className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs"
					>
						<X className="w-4 h-4" />
					</Button>
				</div>
			)}

			{!!initialData.icon && preview && (
				<p className="text-6xl pt-6">{initialData.icon}</p>
			)}

			<div className="opacity-0 group-hover:opacity-100 flex items-center gap-x-1 py-4">
				{!initialData.icon && !preview && (
					<IconPicker asChild onChange={onIconSelect}>
						<Button
							className="text-muted-foreground text-xs"
							variant="outline"
							size="sm"
						>
							<Smile className="w-4 h-4 mr-2" />
							Add icon
						</Button>
					</IconPicker>
				)}

				{!initialData.coverImage && !preview && (
					<Button
						className="text-muted-foreground text-xs"
						variant="outline"
						size="sm"
						onClick={coverImage.onOpen}
					>
						<ImageIcon className="w-4 h-4 mr-2" />
						Add cover
					</Button>
				)}
			</div>

			{isEditing && !preview ? (
				<ReactTextareaAutosize
					ref={inputRef}
					onBlur={disableInput}
					onKeyDown={onKeyDown}
					value={value}
					onChange={(e) => onInput(e.target.value)}
					className="text-5xl bg-transparent font-bold break-words outline-none text-[#3f3f3f] dark:text-[#cfcfcf] resize-none"
				/>
			) : (
				<div
					onClick={enableInput}
					className="pb-[11.5px] text-5xl font-bold break-words outline-none text-[#3f3f3f] dark:text-[#cfcfcf]"
				>
					{initialData.title}
				</div>
			)}
		</div>
	);
};

export { Toolbar };
