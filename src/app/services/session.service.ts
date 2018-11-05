import { Injectable } from '@angular/core';
import { Session } from './result';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

	sessionsRef: AngularFireList<Session> = null;
	lastSessionRef: AngularFireList<Session> = null;

	currentSession: Session;

	games: Observable<any>;

	private basePath: string = '/sessions';

  constructor(private db: AngularFireDatabase) { 
  	this.sessionsRef = db.list(this.basePath);
  }

  createSession(session: Session): void {
  	this.currentSession = session;
    this.sessionsRef.push(session);
  }

  getLastSession(user:string): boolean {
  	let response = false;
  	this.lastSessionRef = this.db.list(this.basePath, ref => ref.orderByChild('user').equalTo(user));
  	this.lastSessionRef.snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(sessions => {
    	if (sessions.length > 0) response = true;
    	else this.currentSession = sessions[0];
    });
    return response;
  }

  get lastSession() {
  	return this.lastSessionRef.snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
  }

  storeGameSession(key: string, time: number, score: number): void {
  	this.lastSessionRef.snapshotChanges().pipe(
      map(changes => 
        changes.map(c => {
      	 	const $key = c.payload.key;
			    const data = { $key, ...c.payload.val() };
			    return data;
        })
      )
    ).subscribe(ref => {
    	this.currentSession.game = {
	    	key: key,
	    	time: time,
	    	score: score
	    }
	    this.updateResult(ref[0].$key, this.currentSession);
    });
  }
 
  updateResult(key: string, value: any): void {
    this.sessionsRef.update(key, value).catch(error => this.handleError(error));
  }
 
  deleteSession(key: string): void {
    this.sessionsRef.remove(key).catch(error => this.handleError(error));
  }
 
  getSessionList(): AngularFireList<Session> {
    return this.sessionsRef;
  }
 
  deleteAll(): void {
    this.sessionsRef.remove().catch(error => this.handleError(error));
  }
 
  private handleError(error) {
    console.log(error);
  }
}