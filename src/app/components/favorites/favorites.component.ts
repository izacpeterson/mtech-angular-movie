import { trigger, transition, style, animate } from '@angular/animations';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ViewportScroller } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FirebaseApiService } from 'src/app/services/firebase-api.service';
import { UserService } from 'src/app/services/user.service'

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ opacity: 0 }),
            animate('.2s ease-out',
              style({ opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({ opacity: 1 }),
            animate('.2s ease-in',
              style({ opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class FavoritesComponent implements OnInit {

  currentUserId: string = '';
  userData: any

  watchList: any;
  favorites: any;
  showScrollBtn: boolean = false;

  currentScreenSize: string = '';
  XSmallScreen: boolean = false;

  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);

  constructor(
    private userService: UserService,
    private firebaseService: FirebaseApiService,
    private scroll: ViewportScroller,
    private breakpointObserver: BreakpointObserver
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

    this.userService.getUID.subscribe((user: any) => {
      this.currentUserId = user;
      this.firebaseService.getUserById(user).then((data: any) => {
        //this.userData = data;
        if (data) {
          this.favorites = data.favorites;
          this.watchList = data.watchlist;
        }

        //console.log("DATA", this.userData);
      })
    })

  }


  deleteFromList(listName: 'watchlist' | 'favorites', movieId: number, movieTitle: string, posterPath: string) {
    if (listName === 'watchlist') {
      this.firebaseService.deleteFromWatchlist(this.currentUserId, movieId, movieTitle, posterPath)

      this.watchList.forEach((movie: any, index: any) => {
        if (movie.movieId == movieId) {
          this.watchList.splice(index, 1)
        }

      })
    } else {
      this.firebaseService.deleteFromFavorites(this.currentUserId, movieId, movieTitle, posterPath)

      this.favorites.forEach((movie: any, index: any) => {
        if (movie.movieId == movieId) {
          this.favorites.splice(index, 1)
        }

      })

    }
  }


  @HostListener('window:scroll', ['$event'])
  getScrollHeight() {
    if (window.scrollY > 100) {
      this.showScrollBtn = true;
    }
    else {
      this.showScrollBtn = false;
    }
  }

  scrollToTop() {
    this.scroll.scrollToPosition([0, 0]);

  }
}
