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

	private messages: any[] = [];
	private message: string;

	private phase: number = 0;
	private typing: boolean = false;

	@ViewChild('chatContainer') private chatContainer: ElementRef;

  constructor(
  	private messageService: MessageService,
  	public dialog: MatDialog
	) { }

  ngOnInit() {
  	this.player = { name: 'Ville Utti' };
  	this.startGame();
  }

  ngAfterViewChecked() {
  	window.scrollTo(0,document.body.scrollHeight);       
  }

  startGame(): void {
  	this.messages.push({ time: new Date().getHours() + '.' + new Date().getMinutes(), text: 'Hello ' + this.player.name, incoming: true });
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
 		}, 0);
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

}
