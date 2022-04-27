import { User } from './user';

export interface Rating {
	id: number,
	userID: User['id'],
	value: number
}
