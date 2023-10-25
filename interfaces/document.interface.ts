// INTERFACES
import { IUser } from './user.interface';

export interface IDocument {
	id: string;
	title: string;
	authorId: string;
	author: IUser;
	parentDocumentId: string;
	parentDocument: string;
	content: string;
	coverImage: string;
	icon: string;
	isPublished: boolean;
	isArchived: boolean;
	createdAt: Date;
}
