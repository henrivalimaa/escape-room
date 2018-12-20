import { Component, OnInit, Input } from '@angular/core';

import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { fadeAnimation } from '../../animations/animations';

@Component({
  selector: 'organize-order',
  templateUrl: './organize-order.component.html',
  styleUrls: ['./organize-order.component.css'],
  animations: [fadeAnimation]
})
export class OrganizeOrder implements OnInit {
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

  movies = [
    'Episode I - The Phantom Menace',
    'Episode II - Attack of the Clones',
    'Episode III - Revenge of the Sith',
    'Episode IV - A New Hope',
    'Episode V - The Empire Strikes Back',
    'Episode VI - Return of the Jedi',
    'Episode VII - The Force Awakens',
    'Episode VIII - The Last Jedi'
  ];

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
  }
}
