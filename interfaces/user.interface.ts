export interface IUser {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	picture: string;
	documents: string[];
	createdAt: Date;
	updatedAt: Date;
}
