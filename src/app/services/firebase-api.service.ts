import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Firebase modules
import { initializeApp, getApp, getApps } from 'firebase/app';
import {
  collection, getFirestore, arrayUnion,
  doc, setDoc, updateDoc, getDoc, getDocs, query
} from 'firebase/firestore';

// import { arrayUnion, doc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';

import { User } from 'src/app/interfaces/user';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FirebaseApiService {

  app = initializeApp(environment.firebaseConfig);
  db = getFirestore(this.app);

  usersRef: any;
  moviesRef: any;
  commentsRef: any;

  constuctor() { }


  // initialize firebase app
  async init() {

    // collection refrences
    this.usersRef = collection(this.db, 'users');
    this.moviesRef = collection(this.db, 'movies');
    this.commentsRef = collection(this.db, 'comments');

    getDocs(this.usersRef).then(querySnapshot => {
      console.log(querySnapshot);
      querySnapshot.forEach(doc => {
        console.log(doc.id, " => ", doc.data());
      });
    });

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

  async addToComments(movieId: string, username: any, comment: any) {
    await updateDoc(doc(this.db, 'movies', movieId), {
      comments: arrayUnion({
        username: username,
        comment: comment
      })
    })
  }

  calculateAverageRating(movieId: number) {

  }



}
