import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Game } from '../models/models';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class GameService {
	private user: any = {};
	private game: Game = null;

  private currentKey: string;

	gamesRef: AngularFireList<Game> = null;
	games: Observable<any>;

	private basePath: string = '/games';

  constructor(private db: AngularFireDatabase, private authService: AuthService) { 
  	this.gamesRef = db.list(this.basePath, ref => ref.orderByChild('owner').equalTo('default'));
  	this.user = authService.currentUser;

    this.games = this.gamesRef.snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );

  }

  getCurrentUserGames(email: string): any {
    return this.db.list(this.basePath, ref => ref.orderByChild('owner').equalTo(email)).snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
  }

  setGame(game: Game): void {
  	this.game = game;
  }

  getCurrentGame(key): any {
    return this.db.list(this.basePath, ref => ref.orderByChild('key').equalTo(key)).snapshotChanges().pipe(
        map(changes =>
          changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        )
      )
  }

  getGame(key: string): any {
    let game = this.db.list(this.basePath, ref => ref.orderByChild('key').equalTo(key));
    return game.snapshotChanges().pipe(
        map(changes =>
          changes.map(c => { 
              const $key = c.payload.key;
              const data = { $key, ...c.payload.val() };
              return data;
           })
      ));
  }

  getGameWithRoomKey(room): any {
    return this.db.list(this.basePath, ref => ref.orderByChild('room').equalTo(room)).snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
  }

  createGame(game: Game): void {
    this.gamesRef.push(game);
  }
 
  updateGame(key: string, value: any): void {
    this.gamesRef.update(key, value).catch(error => this.handleError(error));
  }
 
  deleteGame(key: string): void {
    this.gamesRef.remove(key).catch(error => this.handleError(error));
  }
 
  getGames(): Observable<any> {
    return this.games;
  }
 
  deleteAll(): void {
    this.gamesRef.remove().catch(error => this.handleError(error));
  }
 
  private handleError(error) {
    console.log(error);
  }

  get isUnfinished(): boolean {
    if (this.game === null) return false;
  	if (parseInt(localStorage.getItem('phase')) < this.game.messages.length) return true;
  	return false;
  }

  reset(): void {
  	localStorage.setItem('phase', '1');
  }

  getNextMessage(userResponse: string): any {
    if (parseInt(localStorage.getItem('phase')) >= this.game.messages.length) return null;
  	
    let phase = localStorage.getItem('phase');
  	localStorage.setItem('phase', (parseInt(phase) + 1).toString());

  	this.game.messages[parseInt(phase)].time = new Date().getHours() + '.' + new Date().getMinutes()
  	return this.game.messages[parseInt(phase)];
  }

  updateCurrentGameUser(key, user) {
    for (let gameUser in this.game.gameState.users) {
      if (user.email === this.game.gameState.users[gameUser].email) {
        this.game.gameState.users[gameUser] = user;
        this.updateGame(key, this.game);
      }
    }
  }
}
