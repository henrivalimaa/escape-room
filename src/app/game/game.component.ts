import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';

import { fadeAnimation } from "../animations/animations";

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessengerContactComponent } from '../messenger-contact/messenger-contact.component';

import { MessageService } from '../services/message.service';

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  animations: [
    fadeAnimation
  ]
})

export class GameComponent implements OnInit, AfterViewChecked {
	private player: any = {};
	private playerInitialized: boolean = false;

	private messages: any[] = [];
	private message: string;

	private phase: number = 0;
	private typing: boolean = false;

	private loaded: boolean = false;
  private imageLoaded: boolean = false;
  private imageSrc: string = '';
  private images: any[] = [];
  private galleryImages: any[] = [];

  private showGallery: boolean = false;

  constructor(
  	private messageService: MessageService,
  	public dialog: MatDialog
	) { }

  ngOnInit() {
  	this.loadGalleryImages();
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

  startGame(event): void {
		if (this.player.name != null) {
			this.typing = true;
			this.playerInitialized = true;
			
			setTimeout(() => {
				this.typing = false;
				this.messages.push({ time: new Date().getHours() + '.' + new Date().getMinutes(), text: 'Hello ' + this.player.name, incoming: true });
			}, 3000)
		}
  }

  sendMessage(event): void {
	  if (event.key === "Enter") {
	  	if (this.message != null || this.message == '') {
	  		this.messages.push({ time: new Date().getHours() + '.' + new Date().getMinutes(), text: this.message, incoming: false });
	    	this.continueDialog(this.message);
	    	this.message = null;
	  	}
	  }
	}

	continueDialog(message: string): void {
		this.typing = true;
		let nextMessage = this.messageService.getNextMessage(message);
		setTimeout(() => {
      this.messages.push(nextMessage);
      this.typing = false;
      if (nextMessage.continous) this.continueDialog(message);
 		}, nextMessage.delay);
	}

	openContact(): void {
    let dialogRef = this.dialog.open(MessengerContactComponent, {
      width: '60em',
      data: this.player.name
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

}
