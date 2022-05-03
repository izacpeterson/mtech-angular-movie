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

  constuctor() { }

  // initialize firebase app
  async init() {

  }

  async getMovie(id: string) {
    const movie = await getDoc(doc(this.db, 'movies', id));
    return movie?.data();
  }

  //
  // user search queries
  //

  async getUserById(id: string) {
    const user = await getDoc(doc(this.db, 'users', id));
    return user?.data();
  }

  async getUserByHandle(handle: string) {
    const querySnapshot = await getDocs(
      query(this.usersRef, where('handle', '==', handle))
    );
    return querySnapshot.docs[0]?.data();
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
    const movie = await this.getMovie(movieId);
    return movie?.comments;
  }

  // append comment to movies.comments array
  // will not append duplicate comments
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
    const movie = await this.getMovie(movieId);
    return movie?.rating;
  }

  // return movie.ratings array
  async getRatings(movieId: string) {
    const movie = await this.getMovie(movieId);
    return movie?.ratings;
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
    const docRef = doc(this.db, 'movies', movieId);
    const docSnap = await getDoc(docRef);

    if (docSnap.data()?.ratings) {
      let data = docSnap.data()?.ratings;
      data.push(value);
      console.log(data);
      await setDoc(doc(this.db, 'movies', movieId), {
        ratings: data,
      });
    } else {
      let newArr = [];
      newArr.push(value);
      await setDoc(docRef, {
        ratings: newArr,
      });
    }
  }

  async getRating(movieId: string, callback: Function) {
    let average: number = 0;
    const docRef = doc(this.db, 'movies', movieId);

    // const docSnap = await getDoc(docRef);

    // if (docSnap.exists()) {
    //   let data = docSnap.data().ratings;
    //   let total = 0;
    //   data.forEach((value: number) => {
    //     total += value;
    //   });
    //   average = total / data.length;
    //   callback(average);
    // }

    onSnapshot(docRef, (doc) => {
      let data = doc.data()?.ratings || [];
      let total = 0;
      data.forEach((value: number) => {
        total += value;
      });
      average = Math.round(total / data.length);
      callback(average);
    });
  }
}
