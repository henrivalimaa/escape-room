import { Component, OnInit, Input } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { fadeAnimation } from '../../animations/animations';

@Component({
  selector: 'button-clicker',
  templateUrl: './button-clicker.component.html',
  styleUrls: ['./button-clicker.component.css'],
  animations: [fadeAnimation]
})
export class ButtonClicker implements OnInit {

 	private timeLeft: number = 7;
  private interval;

  private clicks: number = 0;

  private state: string = 'inactive';

  @Input() show: boolean;

  private resultSource = new Subject<number>();
  public result = this.resultSource.asObservable();

  constructor() { }

  ngOnInit() {
  }

  /**
  * Starts game
  */
  startGame() {
  	this.state = 'started'
  	this.interval = setInterval(() => {
  		if (this.timeLeft === 0) {
  			this.state = 'finished';
  			this.updateResult(this.clicks);
  			clearInterval(this.interval);
  			setTimeout(() => {
  				this.show = false;
  			}, 5000)
  		}

      if(this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = 60;
      }
    }, 1000);
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
