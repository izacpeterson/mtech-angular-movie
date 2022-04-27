import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

import { User } from 'src/app/interfaces/user';


@Injectable({
  providedIn: 'root'
})
export class FirebaseApiService {

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

  calculateAverageRating(movieId: number) {

  }



}
