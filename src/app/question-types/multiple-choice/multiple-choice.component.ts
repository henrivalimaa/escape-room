import { Component, OnInit, Input } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { fadeAnimation } from '../../animations/animations';

@Component({
  selector: 'multiple-choice',
  templateUrl: './multiple-choice.component.html',
  styleUrls: ['./multiple-choice.component.css'],
  animations: [fadeAnimation]
})
export class MultipleChoice implements OnInit {

	private state: string = 'inactive';
	private resultText: string;

  @Input() show: boolean;
  @Input() data: any;

  private resultSource = new Subject<number>();
  public result = this.resultSource.asObservable();

  constructor() { }

  ngOnInit() {
  }

  /**
  * Sets user's choice
  */
  selectChoice(choice: any) {
  	if (choice.isCorrect) {
  		this.resultText = 'That\'s correct!';
  		this.updateResult(100);
  	} else {
  		this.resultText = 'Damn it! That\'s not the answer!';
  		this.updateResult(-25);
  	}

  	setTimeout(() => {
  		this.show = false;
  		this.reset();
  	}, 4000);
  }

  /**
  * Updates subscribers
  */
  updateResult(clicks: number) {
    this.resultSource.next(clicks);
  }

  /**
  * Setter for data
  */
  setData(data: any): void {
  	this.data = data;
  }

  /**
  * Resets properties
  */
  reset(): void {
  	this.resultSource = new Subject<number>();
  	this.result = this.resultSource.asObservable();
  	this.resultText = undefined;
  	this.data = undefined;
  	this.state = 'inactive';
  }

  /**
  * Initialises view
  */
  display() {
  	this.show = true;
  }

}
