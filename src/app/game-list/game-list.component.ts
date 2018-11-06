import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/message.service';

import { Game } from '../services/result';

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

	slideConfig = {'slidesToShow': 1, 'dots': true};

  constructor(
  	private authService: AuthService, 
  	private messageService: MessageService,
  	private router: Router,
  	private zone: NgZone) { }

  ngOnInit() {
  	this.player = this.authService.currentUser;
  	this.messageService.reset();
    this.games = this.messageService.getGames();
  }

  startGame(game: Game): void {
  	this.zone.run(() => {
      this.router.navigate(['game'], { queryParams: { id: game.key } });
    });
  }

}
