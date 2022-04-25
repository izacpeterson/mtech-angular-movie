import { User } from "./user";

export interface Comment {
	id: number,
	userID: number,
	contents: string,
	displayName?: string | "anonymous",
	timestamp?: Date
}
