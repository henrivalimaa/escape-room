import { Injectable } from '@angular/core';
import { User } from '../models/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class UserService {

	currUser: any = null;
	users: AngularFireList<User> = null;

  private key: any;

	private basePath: string = '/user';

  constructor(private db: AngularFireDatabase) { 
  	this.users = db.list(this.basePath);
  }

  createUser(user: any): void {
  	this.currUser = user;
    this.users.push(user);
  }

  getCurrentUser(email: string): any {
  	let user = this.db.list(this.basePath, ref => ref.orderByChild('email').equalTo(email));
  	return user.snapshotChanges().pipe(
        map(changes =>
          changes.map(c => { 
            this.key = c.payload.key;
            return { key: c.payload.key, ...c.payload.val() }
           })
      ));
  }

  setUser(user: any): void {
    this.currUser = user;
  }

  get currentUser(): any {
    return this.currUser;
  }

  get currentUserKey(): any {
    return this.key;
  }
 
  updateUser(key: string, value: any): void {
    this.users.update(key, value).catch(error => this.handleError(error));
  }
 
  deleteUser(key: string): void {
    this.users.remove(key).catch(error => this.handleError(error));
  }
 
  getUsersList(): AngularFireList<User> {
    return this.users;
  }
 
  private handleError(error) {
    console.log(error);
  }
}
