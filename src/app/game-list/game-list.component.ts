import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { MessageService } from '../services/message.service';

import { fadeAnimation } from '../animations/animations';

import { Game, User } from '../services/result';

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

  private activeGame: any = {};

  private room: string = '0001';
  private error: any = {};
  private queryString: string = '';

  private carouselView: boolean = true;
  private joiningRoom: boolean = false;
  private showResults: boolean = false;

  private gameSubscription: Subscription;

	slideConfig = {'slidesToShow': 1, 'dots': true};

  constructor(
  	private authService: AuthService, 
  	private messageService: MessageService,
    private userService: UserService,
  	private router: Router,
  	private zone: NgZone) { }

  ngOnInit() {
  	this.player = this.userService.currentUser;
  	this.messageService.reset();
    this.games = this.messageService.getGames();
    this.messageService.getCurrentUserGames(this.player.email).subscribe(response => {
      this.userGames = response;
    });
  }

  setGameReady(game: Game) {
    this.showResults = false;
    
    this.session.started = false;
    this.session.state = 'inactive';
    
    this.activeGame = {};
    game.gameState = {};
    game.gameState.state = 'waiting';
    game.gameState.users = [];
    game.gameState.users.push({ owner: this.player.displayName });

    this.room = Math.floor(Math.random() * 100000).toString();
    game.room = this.room;

    this.gameSubscription = this.messageService.getGameKey(game.key).subscribe(response => {
      if (this.session.state === undefined) return;

      if (this.session.state === 'inactive') {
        this.session.state = 'waiting';
        this.messageService.updateGame(response[0].$key, game);
      } else {
        this.activeGame.key = response[0].$key;
        this.activeGame.game = response[0];
        
        if (this.session.count) {
          this.session.count = 0;
          this.session.count++;
        } else {
          this.session.count++;
          this.room = response[0].room;
        }
      }

      if (response[0].gameState.users) {
        if (this.playersFinished(response[0].gameState.users)) this.session.finished = true;
      }
    });
  }

  playersFinished(users: any): boolean {
    if (users.length === 1) return false;
    for (let user in users) {
      if (users[user].owner) continue;
      if (users[user].additionalData.activeGame.isFinished === false) return false;
    }

    return true;
  }

  startActiveGame(): void {
    this.session.state = 'running';
    this.activeGame.game.gameState.state = this.session.state;
    delete this.activeGame.game.$key;
    this.messageService.updateGame(this.activeGame.key, this.activeGame.game);

    setTimeout(() => { this.session.started = true; }, 4000)
  }

  deactivateGame() {
    let temp = this.activeGame.game;
    let key = this.activeGame.key;
    
    this.session.state = undefined;
    this.activeGame = {};

    delete temp.$key;
    temp.gameState = {};
    temp.gameState.state = 'inactive';

    this.gameSubscription.unsubscribe();

    setTimeout(() => { this.messageService.updateGame(key, temp); }, 1000)
  }

  displayGameResults(): void {
    let temp = this.activeGame.game;
    temp.gameState.state = 'finished';

    delete temp.$key;
    this.sortResults('DESC');
    this.messageService.updateGame(this.activeGame.key, temp);

    this.showResults = true;
  }

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

  containsPlayer(players, player):boolean {
    for (let i in players) {
      if (players[i] === player) return true;
    }
    return false;
  }

  displayError(message: string): void {
    this.error.showError = true;
    this.error.errorMessage = message;
  }

  editGame(game: any) {
    this.zone.run(() => {
      this.router.navigate(['game-editor'], { queryParams: { id: game.key } });
    });
  }

  removeGame(game: any): void {
    this.messageService.getGameKey(game.key).subscribe(key => {
      this.messageService.deleteGame(key[0].$key);
    });
  }

}
