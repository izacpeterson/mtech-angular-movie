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
  arrayRemove,
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
  async init() {  // note that some values may be uninitialized when referenced (async init)
    // collection refrences
    this.usersRef = collection(this.db, 'users');
    this.moviesRef = collection(this.db, 'movies');
    this.commentsRef = collection(this.db, 'comments');

    this.getComments('438631').then(comments => {
      console.log(comments);
    });

    this.recalculatePublicRating('414906');
  }


  // async createMovieDoc(movieId: string) {
  //   const docRef = doc(this.db, 'movies', movieId);
  //   const docSnap = await getDoc(docRef);
  //   if (!docSnap.exists()) {
  //     setDoc(
  //       docRef,
  //       {
  //         comments: [],
  //         rating: undefined,
  //         ratings: [],
  //       },
  //       { merge: true }
  //     );
  //   }
  // }

  async onMovieIfExists(id: string, cb: (movie: any) => void) {
    const movie = await getDoc(doc(this.db, 'movies', id));
    if (movie.exists()) {
      cb(movie.data());
    }
  }

  async getMovie(id: string) {
    const movie = await getDoc(doc(this.db, 'movies', id));
    if (movie.exists())
      return movie.data();
    return undefined;
  }

  //
  // user search queries
  //

  async getUserById(id: string) {
    const user = await getDoc(doc(this.db, 'users', id));
    if (user.exists())
      return user.data();
    return undefined;
  }

  async getUserByHandle(handle: string) {
    const querySnapshot = await getDocs(
      query(this.usersRef, where('handle', '==', handle))
    );
    if (querySnapshot.docs[0])
      return querySnapshot.docs[0].data();
    return undefined;
  }


  //
  // watchlist/favorites
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

  async deleteFromWatchlist(
    uid: any,
    movieId: number,
    movieTitle: string,
    posterPath: string
  ) {
    await updateDoc(doc(this.db, 'users', uid), {
      watchlist: arrayRemove({
        movieId: movieId,
        movieTitle: movieTitle,
        posterPath: posterPath,
      }),
    });
  }

  async deleteFromFavorites(
    uid: any,
    movieId: number,
    movieTitle: string,
    posterPath: string
  ) {
    await updateDoc(doc(this.db, 'users', uid), {
      favorites: arrayRemove({
        movieId: movieId,
        movieTitle: movieTitle,
        posterPath: posterPath,
      }),
    });
  }


  //
  // comments
  //

  // return movie.comments array
  async getComments(movieId: string) {
    // return this.onMovieIfExists(movieId, movie => {
    //   console.log(movie.comments);
    //   return movie.comments;
    // });
    const movie = await this.getMovie(movieId);
    if (movie)
      return movie.comments;
    return undefined;
  }

  // append comment to movies.comments array
  async addToComments(movieId: string, username: any, comment: any) {
    await updateDoc(doc(this.db, 'movies', movieId), {
      comments: arrayUnion({
        username: username,
        comment: comment,
      }),
    });
  }

  //
  // ratings
  //

  // return movie.rating
  async getPublicRating(movieId: string) {
    const movie = await getDoc(doc(this.db, 'movies', movieId));
    if (movie.exists())
      return movie.data().ratings;
    return undefined;
  }

  // return movie.ratings array
  async getRatings(movieId: string) {
    const movie = await getDoc(doc(this.db, 'movies', movieId));
    if (movie.exists())
      return movie.data().ratings;
    return undefined;
  }

  // set avg movie rating to custom value
  async setPublicRating(movieId: string, rating: number) {
    await setDoc(
      doc(this.db, 'movies', movieId),
      {
        rating: rating,
      },
      { merge: true }
    );
  }

  // fetch all movie reviews and automatically set average movie rating
  async recalculatePublicRating(movieId: string) {
    this.getRatings(movieId).then(ratings => {
      let sum = 0;
      ratings.forEach((rating: number) => {
        sum += rating;
      });
      const avgRating = sum / ratings.length;
      this.setPublicRating(movieId, avgRating);
    });
  }

  // append rating value to movie.ratings, update movie.rating
  async addRating(movieId: string, value: number) {
    await updateDoc(doc(this.db, 'movies', movieId), {
      ratings: arrayUnion(value),
    });
    this.recalculatePublicRating(movieId);
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
