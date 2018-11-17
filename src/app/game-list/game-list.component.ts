import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { MessageService } from '../services/message.service';

import { fadeAnimation } from '../animations/animations';

import { Game, User } from '../services/result';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css'],
  animations: [fadeAnimation]
})
export class GameListComponent implements OnInit {
	
	private player: any = {};
	private games: Observable<any>;
  private userGames: any;

  private activeGame: any = {};

  private room: string = '0001';

  private error: any = {};

  private carouselView: boolean = true;
  private joiningRoom: boolean = false;
  private gameStarted: boolean = false;
  private gameFinished: boolean = false;
  private showResults: boolean = false;

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
    if (!this.activeGame.game) {
      game.gameState = {};
      game.gameState.state = 'waiting';
      game.gameState.users = [];
      game.gameState.users.push({ owner: this.player.displayName });

      this.room = Math.floor(Math.random() * 100000).toString();
      game.room = this.room;
    }

    this.messageService.getGameKey(game.key).subscribe(key => {
      if (!this.activeGame.game) this.messageService.updateGame(key[0], game);

      this.activeGame.key = key[0];
      this.activeGame.game = game;

      this.messageService.getGameWithRoomKey(this.room).subscribe(res => {
        this.activeGame.game = res[0];

        if (this.playersFinished(res[0].gameState.users)) this.gameFinished = true;
      });
    });
  }

  playersFinished(users): boolean {
    for (let user in users) {
      if (users[user].isFinished === false) {
        return false;
      }
    } 
    return true;
  }

  startActiveGame(): void {
    this.activeGame.game.gameState.state = 'running';
    this.messageService.updateGame(this.activeGame.key, this.activeGame.game);

    setTimeout(() => {
      this.gameStarted = true;
    }, 4000)
  }

  displayGameResults(): void {
    let temp = this.activeGame.game;
    temp.gameState.state = 'finished';

    this.messageService.updateGame(this.activeGame.key, temp);

    this.showResults = true;
    this.sortResults('DESC');
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

}
