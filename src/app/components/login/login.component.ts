import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/services/user.service';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  googleLogin: boolean = true;
  currentScreenSize: string = '';
  XSmallScreen: boolean = false

  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge'],
  ]);

  constructor(
    private userService: UserService,
    private breakpointObserver: BreakpointObserver
  ) {
    breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .pipe()
      .subscribe(result => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            this.currentScreenSize = this.displayNameMap.get(query) ?? 'Unknown';
          }
        }
        if (this.currentScreenSize === 'XSmall') {
          this.XSmallScreen = true
        } else {
          this.XSmallScreen = false
        }
      });
  }

  ngOnInit(): void {
    this.userService.getUserEmail.subscribe((email) => {
      console.log(email);
    });
  }

  email = new FormControl('', [Validators.required, Validators.email]);
  hide = true;

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  app = initializeApp(environment.firebaseConfig);

  loginUser(): void {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential!.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log(result.user);
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }
  setGoogleLogin() {
    this.googleLogin = true
  }
  setEmailLogin() {
    this.googleLogin = false
  }

}
