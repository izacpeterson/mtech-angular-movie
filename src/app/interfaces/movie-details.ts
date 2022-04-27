import { Genre } from './genre';
import { Comment } from './comment';
import { Rating } from './rating';

export interface MovieDetails {
    id?: number,        // consider making id a required property
    adult?: boolean,
    backdrop_path?: string,
    belongs_to_collection?: { backdrop_path?: string, id?: number, name?: string, poster_path?: string }
    budget?: number,
    comments?: Comment[],
    genres?: Genre[],
    homepage?: string,
    imdb_id?: string,
    original_language?: string,
    original_title?: string,
    overview?: string,
    popularity?: number,
    poster_path?: string,
    production_companies?: { id?: number, logo_path?: string, name?: string, origin_country?: string }[],
    production_countries?: { iso_3166_1?: string, name?: string }[],
    ratings?: Rating[],
    release_date?: string,
    revenue?: number,
    runtime?: number,
    spoken_languages?: { english_name?: string, iso_639_1?: string, name?: string }[],
    status?: string
    tagline?: string,
    title?: string,
    video?: boolean,
    has_playable_media?: boolean,   // replace MovieDetails.video variable
                                    // "video" is undescriptive
    vote_average?: number,
    vote_count?: number
}
