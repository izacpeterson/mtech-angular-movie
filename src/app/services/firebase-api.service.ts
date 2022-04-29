import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Firebase modules
import { initializeApp, getApp, getApps } from 'firebase/app';
import {
  collection,
  getFirestore,
  arrayUnion,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';

import { User } from 'src/app/interfaces/user';
import { environment } from 'src/environments/environment';
import { Observable, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseApiService {
  app = initializeApp(environment.firebaseConfig);
  db = getFirestore(this.app);

  usersRef: any;
  moviesRef: any;
  commentsRef: any;

  constuctor() {}

  // initialize firebase app
  async init() {
    // collection refrences
    this.usersRef = collection(this.db, 'users');
    this.moviesRef = collection(this.db, 'movies');
    this.commentsRef = collection(this.db, 'comments');

    getDocs(this.usersRef).then((querySnapshot) => {
      console.log(querySnapshot);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, ' => ', doc.data());
      });
      console.log('---');
    });

    this.getUserById('uVxllDLwVVrBjKNIGfub').then((data) => {
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

  async getCommentsByMovieId(id: string) {}

  async getRatingsByMovieId(id: string) {}

  async getUserByHandle(handle: string) {
    const querySnapshot = await getDocs(
      query(this.usersRef, where('handle', '==', handle))
    );
    return querySnapshot.docs[0].data();
  }

  calculateAverageRating(movieId: number) {}

  //
  // write queries
  //

  async addToWatchList(
    movieId: number,
    uid: string,
    posterPath: string,
    movieTitle: string
  ) {
    await updateDoc(doc(this.db, 'users', uid), {
      watchlist: arrayUnion({
        movieId: movieId,
        posterPath: posterPath,
        movieTitle: movieTitle,
      }),
    });
  }

  async addToFavorites(
    movieId: number,
    uid: string,
    posterPath: string,
    movieTitle: string
  ) {
    await updateDoc(doc(this.db, 'users', uid), {
      favorites: arrayUnion({
        movieId: movieId,
        posterPath: posterPath,
        movieTitle: movieTitle,
      }),
    });
  }

  async addToComments(movieId: string, username: any, comment: any) {
    await updateDoc(doc(this.db, 'movies', movieId), {
      comments: arrayUnion({
        username: username,
        comment: comment,
      }),
    });
  }

  async setPublicRating(movieId: string, rating: number) {}

  async recalculatePublicRating(movieId: string) {}

  async addRating(movieId: string, value: number) {
    await updateDoc(doc(this.db, 'movies', movieId), {
      ratings: arrayUnion(value),
    });
  }
  async getRating(movieId: string, callback: Function) {
    let average: number = 0;
    const docRef = doc(this.db, 'movies', movieId);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      let data = docSnap.data().ratings;
      let total = 0;
      data.forEach((value: number) => {
        total += value;
      });
      average = total / data.length;
      callback(average);
    }
  }
}
