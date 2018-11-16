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
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css'],
  animations: [fadeAnimation]
})
export class StartComponent implements OnInit {
	private player: any = {};
  private activeGame: any = {};

  private room: string = '0001';

  private error: any = {};

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
  }

  joinRoom(key:string): void {
    this.joiningRoom = true;
    this.error.showError = false;

    this.messageService.getGameWithRoomKey(this.room).subscribe(game => {
      if (game.length === 0) {
        this.displayError('Check game pin!');
		    	this.joiningRoom = false;      
        return;
      }

      if (game[0].gameState.state === 'running' && this.activeGame.joined) {
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

            let temp = this.player;
            temp.additionalData.activeGame = {};
            temp.additionalData.activeGame.points = 0;
            temp.additionalData.activeGame.correctAnswers = 0;
            temp.additionalData.activeGame.invalidAnswers = 0;
            game[0].gameState.users.push(temp);

            this.messageService.updateGame(key[0], game[0]);

            this.activeGame = {}
            this.activeGame.joined = true;
            this.activeGame.game = game [0];
            this.activeGame.key = key[0];
          } else {
            console.log(game[0]);
            if (this.containsPlayer(game[0].gameState.users, this.player)) {
              this.activeGame = {}
              this.activeGame.joined = true;
              this.activeGame.game = game [0];
              this.activeGame.key = key[0];
            } else { game[0].gameState.users.push(this.player) }
          }
        });
      } else {
        //this.joiningRoom = false;
        this.displayError('Game has been started already');
      }
    });
  }

  containsPlayer(players, player): boolean {
    for (let i in players) {
      if (players[i].email === this.player.email) return true;
    }
    return false;
  }

  displayError(message: string): void {
    this.error.showError = true;
    this.error.errorMessage = message;
  }
}
