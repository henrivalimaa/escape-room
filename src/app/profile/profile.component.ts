import { Component, OnInit, HostListener } from '@angular/core';

import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { FileUploadService } from '../services/file-upload.service';
import { User, FileUpload } from '../models/models';

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

	private userFileUploads: Array<any> = [];

	private loadingImage: boolean = false;
	private deletingUser: boolean = false;
	private choosingProfilePicture: boolean = false;

  constructor(
  	private userService: UserService, 
  	private authService: AuthService,
  	private fileUploadService: FileUploadService,
  	private storage: AngularFireStorage) { }

  ngOnInit() {
  	this.user = this.userService.currentUser;
  	this.key = this.userService.currentUserKey;
  	this.temp.gamerTag = this.user.gamerTag;
  	this.temp.selectedUploads = [];
  	this.temp.userImage = null;

  	this.placeholders = [
      './assets/images/placeholders/pexels-photo-255379.jpeg',
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

  	this.fileUploadService.getUserFileUploads(this.user.email).subscribe(res => {
  		this.userFileUploads = res;
  	});
  }

  /**
  * Prevents user to unactive route if changes detected
  */
  @HostListener('window:beforeunload', ['$event'])
  public onDestroy($event) {
    return $event.returnValue = true;
  }

  /**
  * Prevents user to unactive route if changes detected
  */
  canDeactivate() {
    if (this.temp.gamerTag != this.user.gamerTag) {
      return window.confirm('You have unsaved changes. Do you want to discard them?');
    }

    return true;
  }

  /**
  * Sets new profile image
  */
  setProfilePicture(url: string) {
  	this.user.photoURL = url;
  	this.choosingProfilePicture = false;
  	this.temp.userImage = this.user.photoURL;
    this.save();
  }

  /**
  * Uploads file (accepts: .png, .jpg)
  */
  uploadFile(event) {
  	this.loadingImage = true;
    const file = event.target.files[0];
    const filePath = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const task = this.storage.upload(filePath, file).then(() => {
      const ref = this.storage.ref(filePath);

      var metadata = {
			  customMetadata: {
			    'owner': this.user.email
			  }
			}

      ref.updateMetatdata(metadata).subscribe(response => {});

      ref.getDownloadURL().subscribe(url => { 
      	this.user.photoURL = url;
      	this.temp.userImage = this.user.photoURL;

      	let upload = new FileUpload();
      	upload.name = filePath;
      	upload.owner = this.user.email;
      	upload.url = url;

      	this.fileUploadService.saveFileData(upload);

      	this.loadingImage = false;
    	});
    });
  }

  /**
  * Sets upload as removed
  */
  toBeRemoved(upload): void {
    let picture = upload;
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

  /**
  * Deletes selected uploads
  */
  toBeDeleted() {
  	for (let i in this.temp.selectedUploads) {
  		this.fileUploadService.deleteUserFileUpload(this.temp.selectedUploads[i]);
  	}
  	this.temp.selectedUploads = [];
  }

  /**
  * Saves profile changes
  */
  save(): void {
  	this.temp.gamerTag = this.user.gamerTag;
  	this.temp.userImage = null;
  	this.userService.updateUser(this.key, this.user);
  }

  /**
  * Deletes account and all it's data (uploads, games, etc.) - GDPR
  */
  deleteAccount(): void {
  	this.deletingUser = true;

    for (let upload in this.userFileUploads) {
      this.fileUploadService.deleteUserFileUpload(this.userFileUploads[upload]);
    }

    setTimeout(() => {
    	this.userService.deleteUser(this.key);
      this.authService.logout();      
     }, 7000);
  }

}
