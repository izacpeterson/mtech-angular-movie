import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  app = initializeApp(environment.firebaseConfig);
  auth = getAuth(this.app);

  getUser = new Observable((subscriber) => {
    let uid = '';
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        uid = user.uid;
        subscriber.next(uid);
      } else {
        // User is signed out
        subscriber.next('NO USER');
      }
    });
  });
}
