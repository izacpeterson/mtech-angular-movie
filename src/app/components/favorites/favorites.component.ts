import { trigger, transition, style, animate } from '@angular/animations';
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

  constructor(
    private userService: UserService,
    private firebaseService: FirebaseApiService,
    private scroll: ViewportScroller,
  ) { }

  ngOnInit(): void {

    this.userService.getUID.subscribe((user: any) => {
      this.currentUserId = user;
      this.firebaseService.getUserById(user).then((data: any) => {
        //this.userData = data;
        this.watchList = data.watchlist;
        this.favorites = data.favorites;
        //console.log("DATA", this.userData);
      })
    })

  }

  test() {
    console.log(this.userData);
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
