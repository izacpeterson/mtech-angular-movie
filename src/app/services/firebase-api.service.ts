import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Firebase modules
import { initializeApp, getApp, getApps } from 'firebase/app';
import {
  collection, getFirestore,
  doc, setDoc, updateDoc,
  getDoc, getDocs, query
} from 'firebase/firestore';

// custom interfaces
import { User } from 'src/app/interfaces/user';


@Injectable({
  providedIn: 'root'
})
export class FirebaseApiService {

  firebaseConfig = {
    apiKey: "AIzaSyA1RGOcLKmaeYwosNvyxXYVzlKLC7kV2k8",
    authDomain: "mtech-movie-2.firebaseapp.com",
    projectId: "mtech-movie-2",
    storageBucket: "mtech-movie-2.appspot.com",
    messagingSenderId: "514645146266",
    appId: "1:514645146266:web:2bfa7452c65c63d4387d23"
  };
  app: any;
  db: any;
  usersRef: any;
  moviesRef: any;
  commentsRef: any;

  constuctor() {}

  // initialize firebase app
  async init() {

    // only initialize app if app does not exist
    this.app = getApps().length ? getApp() : initializeApp(this.firebaseConfig);

    // database refrence
    this.db = getFirestore(this.app);

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

  calculateAverageRating(movieId: number) {

  }



}
