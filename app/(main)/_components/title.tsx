'use client';

import { ChangeEvent, KeyboardEvent, useRef, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// INTERFACES
import { IDocument } from '@/interfaces/document.interface';

// SERVICES
import { DocumentService } from '@/services/document.service';

// COMPONENTS
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface TitleProps {
	initialData: IDocument;
}

const Title = ({ initialData }: TitleProps) => {
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [title, setTitle] = useState<string>(
		initialData?.title ?? 'Untitled',
	);
	const inputRef = useRef<HTMLInputElement>(null);

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

	const enableInput = () => {
		setTitle(initialData.title);
		setIsEditing(true);
		setTimeout(() => {
			inputRef.current?.focus();
			inputRef.current?.setSelectionRange(
				0,
				inputRef.current?.value?.length,
			);
		}, 0);
	};

	const disableInput = () => {
		setIsEditing(false);
	};

	const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
		setTitle(e.target.value);

		await updateDocumentMutation.mutateAsync({
			documentId: initialData.id,
			title: e.target.value,
		});
	};

	const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			disableInput();
		}
	};

	return (
		<div className="flex items-center gap-x-1">
			{!!initialData.icon && <p>{initialData.icon}</p>}

			{isEditing ? (
				<Input
					ref={inputRef}
					onClick={enableInput}
					onBlur={disableInput}
					onChange={onChange}
					onKeyDown={onKeyDown}
					value={title}
					className="h-7 px-2 focus-visible:ring-transparent"
				/>
			) : (
				<Button
					variant="ghost"
					size="sm"
					className="font-normal h-auto p-1"
					onClick={enableInput}
				>
					<span className="truncate">{initialData?.title}</span>
				</Button>
			)}
		</div>
	);
};

Title.Skeleton = function TitleSkeleton() {
	return <Skeleton className="h-6 w-20 rounded-md" />;
};

export { Title };
