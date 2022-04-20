import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiKey: string = 'ad4c17b63f69186c73eb64bc2e5d9926'

  constructor(
    private _http: HttpClient
  ) { }

  discoverMovies(apiQuery: string) {
    let url: string = `https://api.themoviedb.org/3/discover/movie?api_key=${this.apiKey}&language=en-US&sort_by=popularity.desc&include_adult=false`
    return this._http.get(url)
  }

  getTrendingMovies() {
    let url: string = `https://api.themoviedb.org/3/trending/movie/week?api_key=${this.apiKey}`
    return this._http.get(url)
  }

  getMovieDetails(movieId: number) {
    let url: string = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${this.apiKey}&language=en-US`
    return this._http.get(url)
  }

  searchMovies(queryString: string) {
    let url: string = `https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&language=en-US&query=${queryString}page=1&include_adult=false`
    return this._http.get(url)
  }
}
