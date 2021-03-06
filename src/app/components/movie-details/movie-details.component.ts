import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap, take } from 'rxjs';
import { CastMember } from 'src/app/interfaces/cast-member';
import { CrewMember } from 'src/app/interfaces/crew-member';
import { MovieDetails } from 'src/app/interfaces/movie-details';
import { ApiService } from 'src/app/services/api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ChatPipe } from 'src/app/pipes/chat.pipe';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { setDoc, doc, getFirestore, getDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { FirebaseApiService } from 'src/app/services/firebase-api.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
})
export class MovieDetailsComponent implements OnInit {
  userId: string = '';
  movieId: number = 0;
  movie: MovieDetails = {};
  imageURL: string = `https://image.tmdb.org/t/p/`;
  movieRating: string = '';
  userRating: number = 0;
  userRatingString: string = "";
  cast: CastMember[] = [];
  writers: CrewMember[] = [];
  directors: CrewMember[] = [];
  currentScreenSize: string = '';
  XSmallScreen: boolean = false;
  smallScreen: boolean = false;
  videos: any;
  officialTrailers: any = [];
  trailerTitles: any = [
    'Official Trailer',
    'Official IMAX® Trailer',
    'Trailer (Official)',
    'Theatrical Trailer',
    'Main Trailer',
  ];
  chatBar: string = '';
  chatName: string = '';
  // chatList: any = []; //{ user: 'user1', message: 'hi' };
  comments: any = [];
  ratingValue: number = 0;

  app = initializeApp(environment.firebaseConfig);
  db = getFirestore(this.app);

  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private breakpointObserver: BreakpointObserver,
    private sanitizer: DomSanitizer,
    private userService: UserService,
    private firebaseService: FirebaseApiService,
    private location: Location,
  ) {
    breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe()
      .subscribe((result) => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            this.currentScreenSize =
              this.displayNameMap.get(query) ?? 'Unknown';
          }
        }
        if (this.currentScreenSize === 'XSmall') {
          this.XSmallScreen = true;
        } else if (this.currentScreenSize === 'Small') {
          this.XSmallScreen = false;
          this.smallScreen = true
        } else {
          this.XSmallScreen = false;
          this.smallScreen = false;
        }
      });
  }

  ngOnInit(): void {

    this.route.params
      .pipe(switchMap((params) => (this.movieId = params['id'])))
      .subscribe();
    this.apiService
      .getMovieDetails(this.movieId)
      .pipe(
        map((res: any) => {
          this.movie = res;
        })
      )
      .subscribe();
    this.apiService
      .getExtendedMovieDetails(this.movieId, 'release_dates')
      .pipe(
        map((res: any) => {
          res.results.forEach((result: any) => {
            if (result.iso_3166_1 === 'US') {
              this.movieRating = result.release_dates[0].certification;
            }
          });
        })
      )
      .subscribe();

    this.apiService
      .getExtendedMovieDetails(this.movieId, 'credits')
      .pipe(
        map((res: any) => {
          this.cast = res.cast;
          res.crew.forEach((crewMember: any) => {
            if (crewMember.job === 'Director') {
              this.directors.push(crewMember);
            } else if (crewMember.job === 'Writer') {
              this.writers.push(crewMember);
            }
          });
        })
      )
      .subscribe();

    this.apiService
      .getExtendedMovieDetails(this.movieId, 'videos')
      .pipe(
        map((res: any) => {
          this.videos = res.results;
          this.videos.forEach((video: any) => {
            if (
              this.trailerTitles.some((str: any) => video.name.includes(str))
            ) {
              this.officialTrailers.push(
                this.sanitizer.bypassSecurityTrustResourceUrl(
                  `https://www.youtube.com/embed/${video.key}`
                )
              );
            }
          });
        })
      )
      .subscribe();

    this.userService.getUserName.subscribe((name: any) => {
      this.chatName = name;
    });

    this.firebaseService.getRating(this.movieId.toString(), (data: number) => {
      this.userRating = data;
      this.userRatingString = !isNaN(this.userRating) ?
        `${this.userRating}/5` :
        "No ratings yet";
      this.ratingValue = this.userRating * 20;
    });
    setDoc(
      doc(this.db, 'movies', this.movieId.toString()),
      {},
      { merge: true }
    );

    // initialize comments array
    this.firebaseService.getComments(this.movieId.toString()).then(comments => {
      if (comments) {
        this.comments = comments;
      }
    });

  }

  getImageUrl() {
    if (this.XSmallScreen === false) {
      return `url('${this.imageURL}w780/${this.movie.backdrop_path}`;
    } else {
      return `url('${this.imageURL}w342/${this.movie.poster_path}`;
    }
  }

  sendChat() {
    let filteredChat = new ChatPipe().transform(this.chatBar);
    if (filteredChat) {
      this.comments.unshift({ username: this.chatName, comment: filteredChat });
      this.chatBar = '';
      //send 'filteredChat' through firebase
      //link the firebase observable to 'chatList' to keep an updated list of chats
    }

    this.userService.getUserName.subscribe((user) => {
      this.firebaseService.addToComments(
        this.movieId.toString(),
        user,
        filteredChat
      );
    });
  }
  addRating(value: number) {
    this.firebaseService.addRating(this.movieId.toString(), value);
  }
  getRating() { }

  addToWatchList(movieId: number, posterPath: any, movieTitle: any) {
    this.userService.getUID.pipe(take(1), map((user: any) => {
      this.firebaseService.addToWatchList(movieId, user, posterPath, movieTitle)
    })).subscribe()
  }

  addToFavorites(movieId: number, posterPath: any, movieTitle: any) {
    this.userService.getUID.pipe(take(1), map((user: any) => {
      this.firebaseService.addToFavorites(movieId, user, posterPath, movieTitle)
    })).subscribe()
  }

  // backClicked() {
  //   this.location.back();
  // }
}
