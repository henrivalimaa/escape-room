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

  private carouselView: boolean = true;
  private joiningRoom: boolean = false;

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

  joinRoom(key:string): void {
    this.joiningRoom = true;

    this.messageService.getGameWithRoomKey(this.room).subscribe(game => {
      if (game[0].gameState.state === 'running') {
        this.activeGame.game = game[0];
        setTimeout(() => {
          this.zone.run(() => {
            this.router.navigate(['game'], { queryParams: { id: game[0].key } });
          });
        }, 4000)
      }

      if (!this.activeGame.joined) {
        this.messageService.getGameKey(game[0].key).subscribe(key => {
          if (game[0].gameState.users.length === 1) {
            game[0].gameState.users.push(this.player);
            this.messageService.updateGame(key[0], game[0]);
            this.activeGame = {}
            this.activeGame.joined = true;
            this.activeGame.game = game [0];
            this.activeGame.key = key[0];
          } else {
            if (this.containsPlayer(game[0].gameState.users, this.player)) console.log('Player joined already');
            else { game[0].gameState.users.push(this.player) }
          }
        });
      }
    });

    setTimeout(() => {
      this.joiningRoom = false;     
     }, 7000);
  }

  containsPlayer(players, player):boolean {
    for (let i in players) {
      if (players[i] === player) return true;
    }
    return false;
  }

  startGame(game: Game): void {
  	this.zone.run(() => {
      this.router.navigate(['game'], { queryParams: { id: game.key } });
    });
  }

  setGameReady(game: Game) {
    game.gameState = {};
    game.gameState.state = 'waiting';
    game.gameState.users = [];
    game.gameState.users.push({ owner: this.player.displayName });

    this.room = Math.floor(Math.random() * 100000).toString();
    game.room = this.room;

    this.messageService.getGameKey(game.key).subscribe(key => {
      if (!this.activeGame.game) this.messageService.updateGame(key[0], game);

      this.activeGame.key = key[0];
      this.activeGame.game = game;

      this.messageService.getGameWithRoomKey(this.room).subscribe(res => {
        this.activeGame.game = res[0];
      });
    });
  }

  startActiveGame(): void {
    this.activeGame.game.gameState.state = 'running';
    this.messageService.updateGame(this.activeGame.key, this.activeGame.game);
  }

}
