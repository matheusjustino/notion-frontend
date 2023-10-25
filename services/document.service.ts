import { AxiosRequestConfig } from 'axios';

// INTERFACES
import { IDocument } from '@/interfaces/document.interface';

// LIB
import { api } from '@/lib/axios';

export interface CreateDocumentPayload {
	authorId: string;
	title: string;
	content?: string;
	icon?: string;
	parentDocumentId?: string;
	isArchived?: boolean;
	isPublished?: boolean;
}

export interface ArchiveDocumentPayload {
	documentId: string;
	authorId?: string;
}

export interface RestoreDocumentPayload {
	documentId: string;
	authorId?: string;
}

export interface UpdateDocumentPayload {
	documentId: string;
	title?: string;
	content?: string;
	coverImage?: string;
	icon?: string;
	isPublished?: boolean;
}

const create = async (payload: CreateDocumentPayload): Promise<IDocument> => {
	const formData = new FormData();
	Object.entries(payload).forEach(([key, value]) => {
		if (key === 'parentDocumentId') {
			formData.append('parentDocument', value);
		} else {
			formData.append(key, value);
		}
	});
	return api.post<IDocument>(`/documents`, formData).then((res) => res.data);
};

const getById = async (documentId: string) => {
	return api
		.get<IDocument>(`/documents/${documentId}`)
		.then((res) => res.data);
};

const getPreviewById = async (documentId: string) => {
	return api
		.get<IDocument>(`/documents/${documentId}/preview`)
		.then((res) => res.data);
};

const list = async (parentDocumentId?: string) => {
	const config: AxiosRequestConfig = {
		params: {
			...(parentDocumentId && { parentDocumentId }),
		},
	};
	return api.get<IDocument[]>(`/documents`, config).then((res) => res.data);
};

const archive = async (payload: ArchiveDocumentPayload) => {
	return api
		.post<IDocument>(`/documents/archive`, payload)
		.then((res) => res.data);
};

const listArchiveDocuments = async () => {
	return api.get<IDocument[]>(`/documents/archive`).then((res) => res.data);
};

const restoreDocuments = async (payload: RestoreDocumentPayload) => {
	return api
		.post<IDocument>(`/documents/restore`, payload)
		.then((res) => res.data);
};

const deleteDocuments = async (documentId: string) => {
	return api
		.delete<IDocument>(`/documents/${documentId}`)
		.then((res) => res.data);
};

const updateDocument = async ({
	documentId,
	...payload
}: UpdateDocumentPayload) => {
	const formData = new FormData();
	Object.entries(payload).forEach(([key, value]) => {
		formData.append(key, value as string);
	});

	return api
		.patch<IDocument>(`/documents/${documentId}`, payload)
		.then((res) => res.data);
};

const removeDocumentIcon = async (documentId: string) => {
	return api
		.patch<IDocument>(`/documents/${documentId}/remove/icon`)
		.then((res) => res.data);
};

const removeDocumentCoverImage = async (documentId: string) => {
	return api
		.patch<IDocument>(`/documents/${documentId}/remove/image`)
		.then((res) => res.data);
};

export const DocumentService = {
	create,
	getById,
	getPreviewById,
	list,
	archive,
	listArchiveDocuments,
	restoreDocuments,
	deleteDocuments,
	updateDocument,
	removeDocumentIcon,
	removeDocumentCoverImage,
};
