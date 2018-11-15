import { Injectable, NgZone } from '@angular/core';
import { Router } from "@angular/router";
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

import { UserService } from "./user.service";

import { Observable } from 'rxjs';

@Injectable()
export class AuthService {
  private user: Observable<firebase.User>;
  private userDetails: firebase.User = null;
  
  constructor(
    private _firebaseAuth: AngularFireAuth, 
    private router: Router, 
    private zone: NgZone,
    private userService: UserService) { 
    this.user = _firebaseAuth.authState;
    this.user.subscribe(
      (user) => {
        if (user) {
          this.userDetails = user;
          this.userService.getCurrentUser(user.email)
            .subscribe(user => {
              if (user.length === 0) {
                this.zone.run(() => {
                  this.router.navigate(['setup']);
                });  
              } else {
                this.userService.setUser(user[0]);
                this.zone.run(() => {
                  this.router.navigate(['start']);
                });
              }
            });
        }
        else {
          this.userDetails = null;
        }
      }
    );
  }

  googleLogin() {
    return this._firebaseAuth.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    )
  }

  facebookLogin() {
    return this._firebaseAuth.auth.signInWithPopup(
      new firebase.auth.FacebookAuthProvider()
    )
  }

  get isNewUser(): boolean {
    return false;
  }

  get authenticated(): boolean {
    if (this.userDetails == null ) {
      return false;
    }
    else return true;
  }

  logout() {
    this._firebaseAuth.auth.signOut()
    .then((res) => this.router.navigate(['/']));
  }

  get currentUser(): any {
    return this._firebaseAuth.auth.currentUser;
  }
}