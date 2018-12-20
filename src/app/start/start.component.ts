import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";

import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { GameService } from '../services/game.service';

import { fadeAnimation } from '../animations/animations';

import { Game, User } from '../models/models';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { Subscription }   from 'rxjs';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css'],
  animations: [fadeAnimation]
})
export class StartComponent implements OnInit, OnDestroy {
	private player: any = {};
  private activeGame: any = {};

  private room: string = '0001';

  private error: any = {};

  private joiningRoom: boolean = false;

  private gameSubscription: Subscription;
  private keySubscription: Subscription;

	slideConfig = {'slidesToShow': 1, 'dots': true};

  constructor(
  	private authService: AuthService, 
  	private gameService: GameService,
    private userService: UserService,
  	private router: Router,
  	private zone: NgZone) { }

  ngOnInit() {
  	this.player = this.userService.currentUser;
  	this.gameService.reset();
  }

  ngOnDestroy() {
  }

  /**
  * Joins room with pin and redirects player to the game if it's activated
  */
  joinRoom(key:string): void {
    this.joiningRoom = true;
    this.error.showError = false;
    this.activeGame = {};

    this.gameSubscription = this.gameService.getGameWithRoomKey(this.room).subscribe(game => {
      
      // Display error
      if (game.length === 0) {
        this.displayError('Check game pin!');
	    	this.joiningRoom = false;      
        return;
      }

      // Display error
      if (game[0].room != this.room) {
        this.activeGame = {};
        this.displayError('Game was closed by admin!');
        return;
      }

      if (game[0].gameState.state === 'running' && this.activeGame.joined) {
        this.activeGame.game = game[0];
        setTimeout(() => {
          this.gameSubscription.unsubscribe();
          this.keySubscription.unsubscribe();
          this.zone.run(() => {
            this.router.navigate(['game'], { queryParams: { id: game[0].key } });
          });
        }, 4000)
      }

      // Display error
      if (game[0].gameState.state === 'running' && !this.containsPlayer(game[0].gameState.users, this.player)) {
        this.displayError('Game has been started already!');
        return;
      }

      // Display error
      if (game[0].gameState.state === 'finished' || game[0].gameState.state === 'inactive') {
        this.displayError('Game is inactive at the moment');
        return;
      }

      // Redirect player to game view
      if (game[0].gameState.state === 'running' && this.containsPlayer(game[0].gameState.users, this.player)) {
        this.activeGame.game = game[0];
        setTimeout(() => {
          this.zone.run(() => {
            this.router.navigate(['game'], { queryParams: { id: game[0].key } });
          });
        }, 4000)
      }

      if (!this.activeGame.joined && game[0].gameState.state === 'waiting') {
        this.keySubscription = this.gameService.getGame(game[0].key).subscribe(response => {

          if (this.containsPlayer(game[0].gameState.users, this.player)) {
            
            // Active game is updated if player has joined already
            this.activeGame = {}
            this.activeGame.joined = true;
            this.activeGame.game = response[0];
            this.activeGame.key = response[0].$key;
          } else {

            // User will be updated with session properties
            let temp = this.player;
            temp.additionalData.activeGame = {};
            temp.additionalData.activeGame.points = 0;
            temp.additionalData.activeGame.correctAnswers = 0;
            temp.additionalData.activeGame.invalidAnswers = 0;
            temp.additionalData.activeGame.isFinished = false;
            
            // Current user is updated
            this.userService.setUser(temp);

            // Active game is updated
            game[0].gameState.users.push(temp);
            this.gameService.updateGame(response[0].$key, game[0]);

            this.activeGame = {}
            this.activeGame.joined = true;
            this.activeGame.game = game [0];
            this.activeGame.key = response[0].$key;
          }
        });
      }
    });
  }

  /**
  * Checks if user has already joined to the room
  */
  containsPlayer(players, player): boolean {
    for (let i in players) {
      if (players[i].email === this.player.email) return true;
    }
    return false;
  }

  /**
  * Displays error
  */
  displayError(message: string): void {
    this.error.showError = true;
    this.error.errorMessage = message;
  }
}
