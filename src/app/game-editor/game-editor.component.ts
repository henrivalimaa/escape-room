import { Component, OnInit, HostListener, NgZone } from '@angular/core';

import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";

import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/message.service';
import { FileUploadService } from '../services/file-upload.service';
import { User, FileUpload, Game } from '../services/result';

import { fadeAnimation } from '../animations/animations';

import { AngularFireStorage } from 'angularfire2/storage';

@Component({
  selector: 'app-game-editor',
  templateUrl: './game-editor.component.html',
  styleUrls: ['./game-editor.component.css'],
  animations: [fadeAnimation]
})
export class GameEditorComponent implements OnInit {
	private user: User;
	private game: any;

  private key: string;

  private queryString: string = '';

	private temp: any = {};
	private userFileUploads: any;
	private placeholders: any;

  private templates: any;
  private template: any;

  private miniGame: any;

	private loadingImage: boolean = false;
	private isQuestion: boolean = false;
  private choosingImage: boolean = false;
  private choosingTemplate: boolean = false;
  private showTemplate: boolean = false;

  private editMode: boolean = false;

  private imagePosition: string;

  slideConfig = {'slidesToShow': 3, 'dots': true};

  constructor(
  	private zone: NgZone,
  	private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
  	private userService: UserService,
  	private storage: AngularFireStorage,
  	private messageService: MessageService,
  	private fileUploadService: FileUploadService) { }

  ngOnInit() {

    this.route
      .queryParams
      .subscribe(params => {
        if (params.id) {
          this.editMode = true;
          this.messageService.getGameKey(params.id).subscribe( key => {
            this.key = key[0].$key;
          })

          this.messageService.getCurrentGame(params.id).subscribe(game => {
            this.game = game[0];
            this.game.messages.splice(this.game.messages.length - 1, 1);
          })
        } else {
          this.choosingTemplate = true;
          this.messageService.getGames().subscribe(templates => {
            this.templates = templates;  
          });
        }
      });

  	this.user = this.userService.currentUser;

  	this.fileUploadService.getUserFileUploads(this.user.email).subscribe(res => {
  		this.userFileUploads = res;
  	});

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
  	];
  }

  pickTemplate(): void {
    this.choosingTemplate = false;
    this.showTemplate = false;
    this.game = this.template;
    this.game.owner = this.user.email;
  }

  setBlankGame(): void {
    this.choosingTemplate = false;
    this.game = new Game();
    this.game.owner = this.user.email;
    this.game.sender = {};
    this.game.images = {};
    this.game.themeColor = '#fff';
    this.game.sender.name = this.user.displayName;
    this.game.sender.photo = this.user.photoURL;
    this.game.questions = 0;
    this.game.messages = [
      { continous: true, start: true, text: '', time: '' }
    ];
    this.game.images.background = this.placeholders[0];
    this.temp.points = 100;
  }

  uploadFile(event, property) {
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
      	if (property === 'background') this.game.images.background = url;
      	else if (property === 'sender-photo') this.game.sender.photo = url;
      	else if (property === 'message') this.temp.image = url;

      	let upload = new FileUpload();
      	upload.name = filePath;
      	upload.owner = this.user.email;
      	upload.url = url;

      	this.fileUploadService.saveFileData(upload);

      	this.loadingImage = false;
    	});
    });
  }

  save() {
  	this.game.key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  	this.game.messages.push({ continous: false, text: 'Bye...', time: '', final: true, delay: 7000 });
  	this.messageService.createGame(this.game);

  	this.zone.run(() => {
      this.router.navigate(['game-list']);
    });
  }

  saveChanges(): void {
    delete this.game.$key;
    this.game.messages.push({ continous: false, text: 'Bye...', time: '', final: true, delay: 7000 });
    this.messageService.updateGame(this.key, this.game);
    this.zone.run(() => {
      this.router.navigate(['game-list']);
    }); 
  }

  saveQuestion(): void {
  	let question = {
  		continous: false,
      type: 'Question',
  		responseRequired: true,
  		incoming: true,
      hint: this.temp.hint !== undefined ? this.temp.hint : '',
  		delay: this.temp.delay !== undefined ? this.temp.delay : 3000,
  		text: this.temp.text !== undefined ? this.temp.text : '',
  		image: this.temp.image !== undefined ? this.temp.image : '',
  		answer: this.temp.answer !== undefined ? this.temp.answer : ''
  	}

  	let message = {
  		continous: true,
      type: 'Message',
  		responseRequired: false,
  		incoming: true,
  		delay: this.temp.delay !== undefined ? this.temp.delay : 3000,
  		text: this.temp.text !== undefined ? this.temp.text : '',
  		image: this.temp.image !== undefined ? this.temp.image : '',
  	};

  	let feedback = { 
  		time: '',
      type: 'Feedback', 
  		text: this.temp.feedback !== undefined ? this.temp.feedback : 'Well done...', 
  		continous: true, 
  		incoming: true, 
  		delay: 2000, 
  		points: this.temp.points
  	};

    let game = {
      continous: false,
      type: 'Game',
      game: this.miniGame,
      responseRequired: false,
      incoming: true,
      delay: this.temp.delay !== undefined ? this.temp.delay : 3000
    }

    if (this.miniGame != undefined) {
      this.miniGame = undefined;
      this.game.messages.push(game);
    } else {
      if (this.isQuestion) {
        this.isQuestion = false;
        this.game.messages.push(question);
        this.game.messages.push(feedback);
        this.game.questions = this.game.questions + 1;
      } else {
        this.game.messages.push(message);
      }

      this.temp = {};
      this.temp.points = 100;
    }
  }

  setImage(url: string): void {
    if (this.imagePosition === 'background') this.game.images.background = url;
    if (this.imagePosition === 'sender') this.game.sender.photo = url;
    if (this.imagePosition === 'message') this.temp.image = url;
    this.choosingImage = false;
  }

  previewTemplate(template: any): void {
    this.showTemplate = true;
    this.template = template;
  }

}
