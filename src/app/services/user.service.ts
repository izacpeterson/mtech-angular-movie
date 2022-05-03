import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { environment } from 'src/environments/environment';
import { Observable, of, Subscriber } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private router: Router
  ) { }

  app = initializeApp(environment.firebaseConfig);
  auth = getAuth(this.app);

  getUID = new Observable((subscriber) => {
    let uid = '';
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        uid = user.uid;
        subscriber.next(uid);
        localStorage.setItem('loggedIn', 'true')
      } else {
        // User is signed out
        subscriber.next('NO USER');
        localStorage.setItem('loggedIn', 'false')
      }
    });
  });
  getUserName = new Observable((subscriber) => {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        subscriber.next(user.displayName);
      } else {
        // User is signed out
        subscriber.next('NO USER');
      }
    });
  });
  getUserEmail = new Observable((subscriber) => {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        subscriber.next(user.email);
      } else {
        // User is signed out
        subscriber.next('NO USER');
      }
    });
  });
  get isLoggedIn(): boolean {
    const loggedIn = JSON.parse(localStorage.getItem('loggedIn')!);
    return loggedIn
  }
  logOutUser() {
    signOut(this.auth).then(() => {
      // Sign-out successful.
      localStorage.setItem('loggedIn', 'false')
      this.router.navigate(['login'])
    }).catch((error) => {
      // An error happened.
    });
  }
}
