import { Injectable } from '@angular/core';
import { Result } from '../models/models';
import { Observable } from 'rxjs';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class ScoreService {

	results: AngularFireList<Result> = null;

	private basePath: string = '/results';

  constructor(private db: AngularFireDatabase) { 
  	this.results = db.list(this.basePath);
  }

  createResult(result: Result): void {
    this.results.push(result);
  }
 
  updateResult(key: string, value: any): void {
    this.results.update(key, value).catch(error => this.handleError(error));
  }
 
  deleteResult(key: string): void {
    this.results.remove(key).catch(error => this.handleError(error));
  }
 
  getResultList(): AngularFireList<Result> {
    return this.results;
  }

  getGameResultList(key:string): AngularFireList<Result> {
    return this.db.list(this.basePath, ref => ref.orderByChild('game').equalTo(key));
  }
 
  deleteAll(): void {
    this.results.remove().catch(error => this.handleError(error));
  }
 
  private handleError(error) {
    console.log(error);
  }
}
