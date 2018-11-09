import { Component, OnInit } from '@angular/core';

import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { User } from '../services/result';

import { fadeAnimation } from '../animations/animations';

import { AngularFireStorage } from 'angularfire2/storage';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  animations: [fadeAnimation]
})
export class SettingsComponent implements OnInit {

	private user: User;
	private temp: Array<string> = [];

  private deletingUser: boolean = false;

  constructor(private userService: UserService, private authService: AuthService, private storage: AngularFireStorage) { }

  ngOnInit() {
  	this.user = this.userService.currenUser;
  }

  uploadFile(event) {
    const file = event.target.files[0];
    const filePath = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const task = this.storage.upload(filePath, file).then(() => {
      const ref = this.storage.ref(filePath);
        ref.getDownloadURL().subscribe(url => { 
        	this.user.photoURL = url;
        	this.user.uploads.push(url);
        	this.userService.updateUser(this.userService.currentUserKey, this.user);
      	});
    });
  }

  deleteAccount(): void {
    this.deletingUser = true;
    for (let upload of this.user.uploads) {
      this.deleteUpload(upload);
    }

    setTimeout(() => {
      this.userService.deleteUser(this.userService.currentUserKey);
      this.authService.logout();
    }, 7000)
  }

  toBeRemoved(index: any): void {
  	let picture = this.user.uploads[index];
  	if (this.temp.includes(picture)) {
  		for (let i = 0; i < this.temp.length; i++) {
  			if (this.temp[i] === picture) {
  				this.temp.splice(i, 1);
  				return;
  			}
  		}
  	} else {
  		this.temp.push(picture);
  	}
  }

  deleteUploads(): void {
  	for(let upload of this.temp) {
  		this.removeFromUserUploads(upload);
  		this.deleteUpload(upload);
  	}

  	this.userService.updateUser(this.userService.currentUserKey, this.user);
  }

  removeFromUserUploads(upload: string): void {
  	for (let i = 0; i < this.user.uploads.length; i++) {
  		if (this.user.uploads[i] === upload) {
 				this.user.uploads.splice(i, 1);
 				return;
 			}
  	}
  }

  deleteUpload(url: string): void {
  	let temp = url.split('/');
  	let result = temp[temp.length - 1].split('?')[0];

		var uploadRef = this.storage.ref(result);

		// Delete the file
		uploadRef.delete();
  }

}