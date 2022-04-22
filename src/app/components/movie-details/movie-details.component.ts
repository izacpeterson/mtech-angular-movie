import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { concatMap, map, switchMap, tap } from 'rxjs';
import { MovieDetails } from 'src/app/interfaces/movie-details';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss']
})
export class MovieDetailsComponent implements OnInit {
  movieId: number = 0;
  movie: MovieDetails = {};
  imageURL: string = `https://image.tmdb.org/t/p/`;
  movieRating: string = '';

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => this.movieId = params['id'])
    ).subscribe();
    this.apiService.getMovieDetails(this.movieId).pipe(
      map((res: any) => {
        this.movie = res;
        console.log('movie info', this.movie);
      })
    ).subscribe();
    this.apiService.getExtendedMovieDetails(this.movieId, 'release_dates').pipe(
      map((res: any) => {
        // console.log('release dates', res);
        res.results.forEach((result: any) => {
          if (result.iso_3166_1 === 'US') {
            this.movieRating = result.release_dates[0].certification
          }
        })
        // console.log('rating', this.movieRating);
      })
    ).subscribe()
  }
  getImageUrl(imageType: 'backdrop' | 'poster') {
    if (imageType === 'backdrop') {
      return `url('${this.imageURL}w780/${this.movie.backdrop_path}`
    } else {
      return `url('${this.imageURL}w780/${this.movie.poster_path}`
    }
  }
}
