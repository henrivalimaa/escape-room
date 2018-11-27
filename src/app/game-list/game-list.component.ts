import { Component, OnInit, NgZone } from '@angular/core';
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
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css'],
  animations: [fadeAnimation]
})
export class GameListComponent implements OnInit {
	private session: any = {};

	private player: any = {};
	private games: Observable<any>;
  private userGames: any = [];

  private temp: any = undefined;
  private activeGame: any = {};

  private room: string = '0001';
  private error: any = {};
  private queryString: string = '';

  private carouselView: boolean = true;
  private joiningRoom: boolean = false;
  private showResults: boolean = false;

  private gameSubscription: Subscription;

	slideConfig = { 'slidesToShow': 1, 'dots': true };

  constructor(
  	private authService: AuthService, 
  	private gameService: GameService,
    private userService: UserService,
  	private router: Router,
  	private zone: NgZone) { }

  ngOnInit() {
  	this.player = this.userService.currentUser;
  	this.gameService.reset();
    this.games = this.gameService.getGames();

    // Fetches user's games
    this.gameService.getCurrentUserGames(this.player.email).subscribe(response => {
      this.userGames = response;
    });
  }

  /**
  * Sets game ready (room key/pin created)
  */
  setGameReady(game: Game) {
    this.showResults = false;
    
    this.session.started = false;
    this.session.state = 'inactive';
    
    this.activeGame = {};
    game.gameState = {};
    game.gameState.state = 'waiting';
    game.gameState.users = [];
    game.gameState.sessionState = 1;
    game.gameState.users.push({ owner: this.player.displayName });

    // Random number between 0-100000
    this.room = Math.floor(Math.random() * 100000).toString();
    game.room = this.room;

    this.temp = game;

    this.gameSubscription = this.gameService.getGame(game.key).subscribe(response => {
      this.gameService.updateGame(response[0].$key, game);
      this.gameSubscription.unsubscribe();
      return;
    });
  }

  /**
  * Sets game public so that users can join the game with pin
  */
  setGamePublic(): void {
    this.gameSubscription = this.gameService.getGame(this.temp.key).subscribe(response => {
      this.temp = undefined;
      if (this.session.state === undefined) return;

      this.activeGame.key = response[0].$key;
      this.activeGame.game = response[0];
      
      if (this.session.count) {
        this.session.count = 0;
        this.session.count++;
      } else {
        this.session.count++;
        this.room = response[0].room;
      }

      if (response[0].gameState.users) {
        if (this.playersFinished(response[0].gameState.users)) this.session.finished = true;
      }
    });
  }

  /**
  * Checks if all users have finished the game
  */
  playersFinished(users: any): boolean {
    if (users.length === 1) return false;
    for (let user in users) {
      if (users[user].owner) continue;
      if (users[user].additionalData.activeGame.isFinished === false) return false;
    }

    return true;
  }

  /**
  * Starts active game
  */
  startActiveGame(): void {
    this.session.state = 'running';
    this.activeGame.game.gameState.state = this.session.state;
    delete this.activeGame.game.$key;
    this.gameService.updateGame(this.activeGame.key, this.activeGame.game);

    setTimeout(() => { this.session.started = true; }, 4000)
  }

  /**
  * Deactivates game
  */
  deactivateGame() {
    let temp = this.activeGame.game;
    let key = this.activeGame.key;
    
    this.session.state = undefined;
    this.activeGame = {};

    delete temp.$key;
    temp.gameState = {};
    temp.gameState.state = 'inactive';

    this.gameSubscription.unsubscribe();

    setTimeout(() => { this.gameService.updateGame(key, temp); }, 1000)
  }

  /**
  * Displays user's session results
  */
  displayGameResults(): void {
    let temp = this.activeGame.game;
    temp.gameState.state = 'finished';

    delete temp.$key;
    this.sortResults('DESC');
    this.gameService.updateGame(this.activeGame.key, temp);

    this.showResults = true;
  }

  /**
  * Sorts players
  */
  sortResults(order: string): void {
    this.activeGame.game.gameState.users.sort((a, b) => {
        if (a['points'] < b['points'])
            return -1;
        if (a['points'] > b['points'])
            return 1;
        return 0;
    });

    if (order === "DESC") {
        this.activeGame.game.gameState.users.reverse();
    }
  }

  /**
  * Validates if user is in the game
  */
  containsPlayer(players, player):boolean {
    for (let i in players) {
      if (players[i] === player) return true;
    }
    return false;
  }

  /**
  * Displays error message
  */
  displayError(message: string): void {
    this.error.showError = true;
    this.error.errorMessage = message;
  }

  /**
  * Activates game editor view with selected params
  */
  editGame(game: any) {
    this.zone.run(() => {
      this.router.navigate(['game-editor'], { queryParams: { id: game.key } });
    });
  }

  /**
  * Removes user's selected game
  */
  removeGame(game: any): void {
    this.gameService.getGame(game.key).subscribe(key => {
      this.gameService.deleteGame(key[0].$key);
    });
  }

}
