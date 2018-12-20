import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from "@angular/router";

import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { FileUploadService } from '../services/file-upload.service';

import { fadeAnimation, slideAnimation } from '../animations/animations';
import { User, FileUpload } from '../models/models';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { AngularFireStorage } from 'angularfire2/storage';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css'],
  animations: [fadeAnimation]
})
export class SetupComponent implements OnInit {

	private invalid: boolean = false;
	
	private uploadPercent: Observable<number>;
  private downloadURL: any;
  private url: string;

  private isEditable: boolean = true;

  private user: User = new User();

  private loadingImage: boolean = false;
  private creatingUser: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private fileUploadService: FileUploadService, 
    private router: Router,
    private zone: NgZone,
    private storage: AngularFireStorage) { }

  ngOnInit() {
  	const auth = this.authService.currentUser;

    this.user = new User();
    this.user.displayName = auth.displayName;
    this.user.email = auth.email;
    this.user.additionalData = {};
    this.user.gamerTag = '';
    this.user.photoURL = auth.photoURL;
    this.user.additionalData.provider = auth.providerData[0].providerId;

  	this.userService.getCurrentUser(auth.email)
      .subscribe(user => {
        if (user.length === 0) {
          //console.log(this.user);
        } else {
          this.userService.setUser(user[0]);
          this.zone.run(() => {
            this.router.navigate(['start']);
          });
        }
      });
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

        const upload = new FileUpload();
        upload.name = filePath;
        upload.owner = this.user.email;
        upload.url = url;

        this.fileUploadService.saveFileData(upload);

        this.loadingImage = false;
      });
    });
  }

  /**
  * Creates user
  */
  createUser(): void {
    if (this.user.gamerTag.trim() === '' || this.user.gamerTag.length < 3) {
      this.invalid = true;
      return;
    }
    
    this.creatingUser = true;
    setTimeout(() => {
      this.userService.createUser(this.user);
      this.zone.run(() => {
        this.router.navigate(['start']);
      });
    }, 7000)
  }

}
