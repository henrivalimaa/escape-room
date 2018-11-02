import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessengerContactComponent } from '../messenger-contact/messenger-contact.component';

import { MessageService } from '../services/message.service';
import { AuthService } from '../services/auth.service';

import { Result } from '../services/result';
import { ScoreService } from '../services/score.service';

import { fadeAnimation, slideAnimation } from '../animations/animations';

import { map } from 'rxjs/operators';

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  animations: [fadeAnimation, slideAnimation]
})

export class GameComponent implements OnInit, AfterViewChecked {
	private player: any = {};
	private playerInitialized: boolean = false;

	private messages: any[] = [];
	private message: string;
  private nextMessage: any;
  private time: any = {};

	private phase: number = 0;
	private typing: boolean = false;

	private loaded: boolean = false;

	private showEmojiPicker: boolean = false; 

  private imageLoaded: boolean = false;
  private imageSrc: string = '';
  private images: any[] = [];
  private galleryImages: any[] = [];
  private showGallery: boolean = false;

  private result: Result = new Result();
  private results: any;
  private showResult: boolean = false;
  private points: number;
  private showPoints: boolean = false;
  private loadingLeaderboard: boolean = false;

  constructor(
  	private messageService: MessageService,
    private authService: AuthService,
    private scoreService: ScoreService,
  	public dialog: MatDialog
	) { }

  ngOnInit() {
  	this.loadGalleryImages();
    this.player = this.authService.currentUser;
    this.result = new Result();
    this.time = {};
    this.messageService.reset();
    this.startGame();
  }

  ngAfterViewChecked() {
  	window.scrollTo(0, document.body.scrollHeight);    
  }

  handleImageLoad() {
    this.imageLoaded = true;
  }

  handleInputChange(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

    var reader = new FileReader();

    this.loaded = false;

    reader.onload = this.handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  
  handleReaderLoaded(e) {
    var reader = e.target;
    this.imageSrc = reader.result;
    this.images.push(this.imageSrc);
    this.galleryImages.push({ src: this.imageSrc });
    this.loaded = true;
    this.messages.push({ time: new Date().getHours() + '.' + new Date().getMinutes(), image: this.images[this.images.length - 1] , incoming: false });
  }

  startGame(): void {
    this.time.start = new Date();
		this.typing = true;
		this.result.score = 0;
		setTimeout(() => {
			this.typing = false;
			this.messages.push({ time: new Date().getHours() + '.' + new Date().getMinutes(), text: 'Hello ' + this.player.displayName, incoming: true });
		}, 2000)
  }

  addEmoji(event): void {
  		if (this.message == null) this.message = event.emoji.native;
  		else this.message = this.message + event.emoji.native;

  		this.showEmojiPicker = false;
  } 

  sendMessage(): void {
  	if (this.message != null || this.message == '') {
  		this.messages.push({ time: new Date().getHours() + '.' + new Date().getMinutes(), text: this.message, incoming: false });
    	this.continueDialog(this.message);
    	this.message = '';
  	}
	}

	continueDialog(message: string): void {
		this.typing = true;
		this.nextMessage = this.messageService.getNextMessage(message);
    if (this.nextMessage.points) this.displayPoints(this.nextMessage.points);
		setTimeout(() => {
      this.messages.push(this.nextMessage);
      this.typing = false;
      if (this.nextMessage.continous) this.continueDialog(message);
      if (this.nextMessage.final) this.endGame();
 		}, this.nextMessage.delay);
	}

  sortResults<T>(propName: keyof Result, order: "ASC" | "DESC"): void {
    this.results.sort((a, b) => {
        if (a[propName] < b[propName])
            return -1;
        if (a[propName] > b[propName])
            return 1;
        return 0;
    });

    if (order === "DESC") {
        this.results.reverse();
    }
  }

  endGame(): void {
    if (this.showResult === true) return;
    this.showResult = true;
    this.time.end = new Date();
    this.result.time =  Math.floor((this.time.end.getTime()/1000) - (this.time.start.getTime()/1000));
    this.time.minutes = Math.floor(this.result.time / 60);
    this.time.seconds = this.result.time - this.time.minutes * 60;
    this.result.player = this.player.displayName;
    this.result.timeStamp = new Date();
    this.result.score = this.result.score + this.getTimePoints(this.result.time);
    this.scoreService.createResult(this.result);
    this.refreshLeaderboard();
  }

  getTimePoints(seconds:number): number {
    console.log(Math.floor((30 - seconds/60) * 50))
    return Math.floor((30 - seconds/60) * 50);
  }

  refreshLeaderboard(): void {
    this.loadingLeaderboard = true;
    setTimeout(() => {
      this.scoreService.getResultList().snapshotChanges().pipe(
        map(changes =>
          changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
        )
      ).subscribe(results => {
          this.results = results;
          this.sortResults('score', 'DESC');
          this.loadingLeaderboard = false;
      });
     }, 3000); 
  }

  displayPoints(points: number): void {
    this.result.score = this.result.score + points;
    this.showPoints = true;
    this.points = points;
    console.log(points);
    setTimeout(() => {
      this.showPoints = false;
     }, 1500);
  }

	openContact(): void {
    let dialogRef = this.dialog.open(MessengerContactComponent, {
      width: '60em',
      data: this.player.displayName
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The contact was closed');
    });
  }

  loadGalleryImages(): void {
  	this.galleryImages = [
  		{ src: 'https://images.unsplash.com/photo-1506361797048-46a149213205?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=493e200df17b54d1ef10eb61e1df148a&w=1000&q=80' },
  		{ src: 'https://images.unsplash.com/photo-1506361797048-46a149213205?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=493e200df17b54d1ef10eb61e1df148a&w=1000&q=80' },
  		{ src: 'https://images.unsplash.com/photo-1506361797048-46a149213205?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=493e200df17b54d1ef10eb61e1df148a&w=1000&q=80' }
  	];
  }

  attachImage(imagePath: string): void {
  	this.showGallery = false;
  	this.images.push(imagePath);
    this.messages.push({ time: new Date().getHours() + '.' + new Date().getMinutes(), image: imagePath , incoming: false });
  }

  convertTime(seconds: number): string {
    let m = Math.floor(seconds / 60);
    let s = seconds - m * 60;
    return `${m}min ${s}s`;
  }

}
