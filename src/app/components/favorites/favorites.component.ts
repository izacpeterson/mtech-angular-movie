import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { FirebaseApiService } from 'src/app/services/firebase-api.service';
import { UserService } from 'src/app/services/user.service'

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {

  currentUserId: string = '';
  userData: any

  watchList: any;
  favorites: any;

  constructor(
    private userService: UserService,
    private firebaseService: FirebaseApiService,
    private apiService: ApiService,
  ) { }

  ngOnInit(): void {

    this.userService.getUID.subscribe((user: any) => {
      this.currentUserId = user;
      this.firebaseService.getUserById(user).then((data: any) => {
        this.userData = data;
        this.watchList = data.watchlist;
        this.favorites = data.favorites;
        //console.log("DATA", this.userData);
      })
    })

    //this.apiService.getMovieDetails()

  }

  test() {
    console.log(this.userData);

  }



}
