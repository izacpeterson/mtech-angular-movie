import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { initializeApp } from 'firebase/app';
import { arrayUnion, doc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';

import { User } from 'src/app/interfaces/user';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FirebaseApiService {

  app = initializeApp(environment.firebaseConfig)
  db = getFirestore(this.app)
  apiKey: string = "";

  constructor() {
    console.log("firebase API running");
  }

  //
  // read queries
  //

  async getUserById(id: number, cb: (user: User) => void) {

  }

  async getCommentById(id: number, cb: (comment: Comment) => void) {

  }

  //
  // write queries
  //

  async addToWatchList(movieId: number, uid: string) {
    await updateDoc(doc(this.db, 'users', uid), {
      watchlist: arrayUnion(movieId)
    })
  }

  async addToFavorites(movieId: number, uid: string) {
    await updateDoc(doc(this.db, 'users', uid), {
      favorites: arrayUnion(movieId)
    })
  }

  calculateAverageRating(movieId: number) {

  }



}
