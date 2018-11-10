import { Component, OnInit, HostListener } from '@angular/core';

import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { User } from '../services/result';

import { fadeAnimation } from '../animations/animations';

import { AngularFireStorage } from 'angularfire2/storage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  animations: [fadeAnimation]
})
export class ProfileComponent implements OnInit {

	private user: User;
	private temp: any = {};
	private placeholders: Array<any> = []

	private key: any;

	private loadingImage: boolean = false;
	private deletingUser: boolean = false;
	private choosingProfilePicture: boolean = false;

  constructor(
  	private userService: UserService, 
  	private authService: AuthService,
  	private storage: AngularFireStorage) { }

  ngOnInit() {
  	this.user = this.userService.currentUser;
  	this.key = this.userService.currentUserKey;
  	this.temp.gamerTag = this.user.gamerTag;
  	this.temp.selectedUploads = [];
  	this.temp.toBeDeleted = [];
  	this.temp.uploads = [];
  	this.temp.userImage = null;
  	if (!this.user.uploads) this.user.uploads = [];
  	
  	this.placeholders = [
  		'./assets/images/placeholders/pexels-photo-1011334.jpeg',
  		'./assets/images/placeholders/pexels-photo-1245356.jpg',
  		'./assets/images/placeholders/pexels-photo-1249214.jpeg',
  		'./assets/images/placeholders/pexels-photo-136352.jpeg',
  		'./assets/images/placeholders/pexels-photo-220051.jpeg',
  		'./assets/images/placeholders/pexels-photo-226597.jpeg',
  		'./assets/images/placeholders/pexels-photo-279009.jpeg',
  		'./assets/images/placeholders/pexels-photo-459762.jpeg',
  		'./assets/images/placeholders/pexels-photo-569986.jpeg',
  		'./assets/images/placeholders/pexels-photo-707837.jpeg',
  		'./assets/images/placeholders/pexels-photo-735911.jpeg'
  	]
  }

  @HostListener('window:beforeunload', ['$event'])
  public onDestroy($event) {
    return $event.returnValue = true;
  }

  canDeactivate() {
    if (this.temp.uploads.length > 0 
    	|| this.temp.gamerTag != this.user.gamerTag 
    	|| this.temp.toBeDeleted.length > 0
    	|| this.temp.userImage != null) {

    	if (this.temp.uploads.length > 0) {
    		for (let upload in this.temp.uploads) {
    			this.deleteUpload(upload);
    		}
    	} 
      return window.confirm('You have unsaved changes. Do you want to discard them?');
    }

    return true;
  }

  setProfilePicture(url: string) {
  	this.user.photoURL = url;
  	this.choosingProfilePicture = false;
  	this.temp.userImage = this.user.photoURL;
  }

  uploadFile(event) {
  	this.loadingImage = true;
    const file = event.target.files[0];
    const filePath = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const task = this.storage.upload(filePath, file).then(() => {
      const ref = this.storage.ref(filePath);
      ref.getDownloadURL().subscribe(url => { 
      	this.user.photoURL = url;
      	this.user.uploads.push(url);
      	this.temp.uploads.push(url);
      	this.loadingImage = false;
      	this.temp.userImage = this.user.photoURL;
      	// this.userService.updateUser(this.key, this.user);
    	});
    });
  }

  toBeRemoved(index: any): void {
    let picture = this.user.uploads[index];
    if (this.temp.selectedUploads.includes(picture)) {
      for (let i = 0; i < this.temp.selectedUploads.length; i++) {
        if (this.temp.selectedUploads[i] === picture) {
          this.temp.selectedUploads.splice(i, 1);
          return;
        }
      }
    } else {
      this.temp.selectedUploads.push(picture);
    }
  }

  toBeDeleted() {
  	this.temp.toBeDeleted = this.temp.toBeDeleted.concat(this.temp.selectedUploads);
  	console.log(this.temp.toBeDeleted)
  	for (let i in this.temp.toBeDeleted) {
  		for (let j in this.user.uploads) {
	  		if (this.user.uploads[j] === this.temp.toBeDeleted[i]) {
	  			this.user.uploads.splice(j, 1);
	  		} 	
		 	}
  	}
  	this.temp.selectedUploads = [];
  }

  save(): void {
  	this.temp.uploads = [];
  	this.temp.gamerTag = this.user.gamerTag;
  	this.temp.userImage = null;
  	this.deleteUploads();
  }

  deleteUploads(): void {
  	for(let upload of this.temp.toBeDeleted) {
  		this.removeFromUserUploads(upload);
  		this.deleteUpload(upload);
  	}

  	this.temp.toBeDeleted = [];
  	this.userService.updateUser(this.key, this.user);
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

  deleteAccount(): void {
    this.deletingUser = true;
    for (let upload of this.user.uploads) {
      this.deleteUpload(upload);
    }

    setTimeout(() => {
      this.userService.deleteUser(this.key);
      this.authService.logout();      
     }, 7000);
  }

}
