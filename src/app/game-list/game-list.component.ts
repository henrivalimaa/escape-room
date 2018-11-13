import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { MessageService } from '../services/message.service';

import { Game, User } from '../services/result';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.css']
})
export class GameListComponent implements OnInit {
	
	private player: any = {};
	private games: Observable<any>;
  private userGames: any;

  private room: string = '0001';

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

    setTimeout(() => {
      this.joiningRoom = false;     
     }, 7000);
  }

  startGame(game: Game): void {
  	this.zone.run(() => {
      this.router.navigate(['game'], { queryParams: { id: game.key } });
    });
  }

}
