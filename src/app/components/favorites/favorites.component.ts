import { Component, OnInit } from '@angular/core';
import { FirebaseApiService } from 'src/app/services/firebase-api.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {

  constructor(
    private userService: UserService,
    private firebaseService: FirebaseApiService
  ) { }

  ngOnInit(): void {
  }

  deleteFromList(listName: 'watchlist' | 'favorites', movieId: number, movieTitle: string, posterPath: string) {
    this.userService.getUID.subscribe((user) => {
      if (listName === 'watchlist') {
        this.firebaseService.deleteFromWatchlist(user, movieId, movieTitle, posterPath)
      } else {
        this.firebaseService.deleteFromFavorites(user, movieId, movieTitle, posterPath)
      }
    })
  }
}
