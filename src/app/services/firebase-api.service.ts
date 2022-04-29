import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Firebase modules
import { initializeApp, getApp, getApps } from 'firebase/app';
import {
  collection, getFirestore, arrayUnion,
  doc, setDoc, updateDoc, getDoc, getDocs,
  query, where
} from 'firebase/firestore';

import { User } from 'src/app/interfaces/user';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FirebaseApiService {

  // app: any;
  // db: any;
  app = initializeApp(environment.firebaseConfig);
  db = getFirestore(this.app);

  usersRef: any;
  moviesRef: any;
  commentsRef: any;

  constuctor() { }


  // initialize firebase app
  async init() {

    // // only initialize app if app does not exist
    // this.app = getApps().length ? getApp() : initializeApp(this.firebaseConfig);

    // // database refrence
    // this.db = getFirestore(this.app);


    // collection refrences
    this.usersRef = collection(this.db, 'users');
    this.moviesRef = collection(this.db, 'movies');
    this.commentsRef = collection(this.db, 'comments');

    getDocs(this.usersRef).then(querySnapshot => {
      console.log(querySnapshot);
      querySnapshot.forEach(doc => {
        console.log(doc.id, " => ", doc.data());
      });
      console.log("---");
    });

    this.getUserById('uVxllDLwVVrBjKNIGfub').then(data => {
      console.log(data);
    });

    this.getUserByHandle('johndoe');

  }


  //
  // read queries
  //

  async getUserById(id: string) {
    const user = await getDoc(doc(this.db, 'users', id));
    return user.data();
  }

  async getCommentById(id: string) {
    const comment = await getDoc(doc(this.db, 'comments', id));
    return comment.data();
  }

  async getCommentsByMovieId(id: string) {
  }

  async getRatingsByMovieId(id: string) {
  }

  async getUserByHandle(handle: string) {
    const querySnapshot = await getDocs(
      query(this.usersRef, where('handle', '==', handle))
    );
    return querySnapshot.docs[0].data();
  }

  calculateAverageRating(movieId: number) {

  }

  //
  // write queries
  //

  async addToWatchList(movieId: number, uid: string, posterPath: string, movieTitle: string) {
    await updateDoc(doc(this.db, 'users', uid), {
      watchlist: arrayUnion({
        movieId: movieId,
        posterPath: posterPath,
        movieTitle: movieTitle
      })
    })
  }

  async addToFavorites(movieId: number, uid: string, posterPath: string, movieTitle: string) {
    await updateDoc(doc(this.db, 'users', uid), {
      favorites: arrayUnion({
        movieId: movieId,
        posterPath: posterPath,
        movieTitle: movieTitle
      })
    })
  }


  async setPublicRating(movieId: string, rating: number) {

  }

  async recalculatePublicRating(movieId: string) {

  }

  async addRating(movieId: string, userId: string, value: number) {

  }



}
