import { Injectable } from '@angular/core';
import { Result } from './result';
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
 
  deleteAll(): void {
    this.results.remove().catch(error => this.handleError(error));
  }
 
  private handleError(error) {
    console.log(error);
  }
}
