import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from '../services/auth.service';
import { ScoreService } from '../services/score.service';
import { UserService } from '../services/user.service';
import { fadeAnimation, slideAnimation } from '../animations/animations';
import { Result, User } from '../services/result';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { AngularFireStorage } from 'angularfire2/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [fadeAnimation]
})
export class LoginComponent implements OnInit {
  private showLeaderboard: boolean = false;
  private loadingLeaderboard: boolean = false;
  private results: any = {};

  private user: User;

  constructor(
    private authService: AuthService,
    private userService: UserService, 
    private router: Router,
    private zone: NgZone,
    private scoreService: ScoreService,
    private storage: AngularFireStorage) { }

  ngOnInit() {
    if (this.authService.authenticated) {
      this.afterSignIn();
    }
  }

  signInWithGoogle(): void {
    this.authService.googleLogin()
      .then(() => this.afterSignIn());
  }

  signInWithFacebook(): void {
    this.authService.facebookLogin()
      .then(() => this.afterSignIn());
  }

  private afterSignIn(): void {
    let player = this.authService.currentUser;
    this.userService.getCurrentUser(player.email)
      .subscribe(user => {
        if (user.length === 0) {
          this.zone.run(() => {
            this.router.navigate(['setup']);
          });
          return;
        } else {
          this.userService.setUser(user[0]);
          this.zone.run(() => {
            this.router.navigate(['start']);
          });
        }
      });
  }

}