import { MovieDetails } from "./movie-details";
import { Comment } from "./comment";
import { Rating } from "./rating";

export interface User {
	id: number,
	favoriteMovies?: MovieDetails['id'][],
	comments: Comment['id'][],
	ratings: Rating['id'][],
}