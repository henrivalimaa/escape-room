import { Component, OnInit, Input } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { fadeAnimation } from '../../animations/animations';

@Component({
  selector: 'hit-the-buttons',
  templateUrl: './hit-the-buttons.component.html',
  styleUrls: ['./hit-the-buttons.component.css'],
  animations: [fadeAnimation]
})
export class HitTheButtons implements OnInit {
	
	private timeLeft: number = 20;
  private interval;

  private clicks: number = 0;

  private state: string = 'inactive';

  @Input() show: boolean;

  private gameArea: any = {};

  private resultSource = new Subject<number>();
  public result = this.resultSource.asObservable();

  constructor() { }

  ngOnInit() {
  	this.gameArea.height = window.innerHeight;
  	this.gameArea.width = window.innerWidth;
  	this.gameArea.buttons = [];

  	for(let i = 0; i < 20; i++) {
  		this.gameArea.buttons.push({ 
  			top: getRandomPosition(80, window.innerHeight).toString() + 'px', 
  			left: getRandomPosition(0, window.innerWidth - 80).toString() + 'px', 
  			isVisible: false });
  	}

  	function getRandomPosition(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }

  /**
  * Starts game
  */
  startGame() {
  	this.state = 'started'

  	for(let i = 0; i < this.gameArea.buttons.length; i++) {
			setTimeout(() => {
				if (i === this.gameArea.buttons.length - 1) {
					this.updateResult(this.clicks);
					this.state = 'finished';
					setTimeout(() => {
						this.state = 'inactive';
						this.show = false;
					}, 6000);
				}			
  			this.gameArea.buttons[i].isVisible = true;
	  		this.timeLeft--;
	  		setTimeout(() => {
	  			 this.gameArea.buttons[i].isVisible = false;
	  		}, 1500);
  		}, 1000 * i);
  	}
  }

  /**
  * Updates subscribers
  */
  updateResult(clicks: number) {
    this.resultSource.next(clicks);
  }

  /**
  * Initialises view
  */
  display() {
  	this.show = true;
  }

}
