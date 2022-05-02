import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
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
  movieId: number = 0;
  movie: MovieDetails = {};
  imageURL: string = `https://image.tmdb.org/t/p/`;
  movieRating: string = '';
  userRating: number = 0;
  cast: CastMember[] = [];
  writers: CrewMember[] = [];
  directors: CrewMember[] = [];
  currentScreenSize: string = '';
  XSmallScreen: boolean = false;
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
  chatList: any = []; //{ user: 'user1', message: 'hi' };
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
        } else {
          this.XSmallScreen = false;
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
          // console.log('movie info', this.movie);
        })
      )
      .subscribe();
    this.apiService
      .getExtendedMovieDetails(this.movieId, 'release_dates')
      .pipe(
        map((res: any) => {
          // console.log('release dates', res);
          res.results.forEach((result: any) => {
            if (result.iso_3166_1 === 'US') {
              this.movieRating = result.release_dates[0].certification;
            }
          });
          // console.log('rating', this.movieRating);
        })
      )
      .subscribe();

    this.apiService
      .getExtendedMovieDetails(this.movieId, 'credits')
      .pipe(
        map((res: any) => {
          this.cast = res.cast;
          // console.log('TEST', this.cast);
          // this.crew = res.crew;
          res.crew.forEach((crewMember: any) => {
            if (crewMember.job === 'Director') {
              this.directors.push(crewMember);
            } else if (crewMember.job === 'Writer') {
              this.writers.push(crewMember);
            }
          });
          // console.log('crew', res.crew);
          // console.log('directors', this.directors);
          // console.log('writers', this.writers);
        })
      )
      .subscribe();

    this.apiService
      .getExtendedMovieDetails(this.movieId, 'videos')
      .pipe(
        map((res: any) => {
          this.videos = res.results;
          //console.log('VIDEOS', this.videos);
          this.videos.forEach((video: any) => {
            if (
              this.trailerTitles.some((str: any) => video.name.includes(str))
            ) {
              //video.name.includes('Official Trailer')
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
      // alert(data);
      this.userRating = data;
      this.ratingValue = this.userRating * 20;
    });
    // console.log(this.movieRating);
    this.createMovieDoc();

    // initialize comments array
    this.firebaseService.getComments(this.movieId.toString()).then(comments => {
      this.comments = comments;
    });

  }


  async createMovieDoc() {
    const docRef = doc(this.db, 'movies', this.movieId.toString());
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      setDoc(
        doc(this.db, 'movies', this.movieId.toString()),
        {
          comments: [],
        },
        { merge: true }
      );
    }
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
      // this.chatList.push({ username: this.chatName, comment: filteredChat });
      this.comments.push({ username: this.chatName, comment: filteredChat });
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
    this.userService.getUID.subscribe((user: any) => {
      console.log('inside function', user);
      this.firebaseService.addToWatchList(movieId, user, posterPath, movieTitle)
    })
  }

  addToFavorites(movieId: number, posterPath: any, movieTitle: any) {
    this.userService.getUID.subscribe((user: any) => {
      console.log('inside function', user);
      this.firebaseService.addToFavorites(movieId, user, posterPath, movieTitle)
    })
  }

  backClicked() {
    this.location.back();
  }
}
