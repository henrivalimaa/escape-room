import { Component, OnInit, Input } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { fadeAnimation, slideAnimation } from '../../animations/animations';

@Component({
  selector: 'light-pattern',
  templateUrl: './light-pattern.component.html',
  styleUrls: ['./light-pattern.component.css'],
  animations: [fadeAnimation, slideAnimation]
})
export class LightPattern implements OnInit {

  private points: number = 0;
  private visiblePoints: string = undefined;
  private resultText = 'Press start';

  private state: string = 'inactive';
  private gameState: number = 0;

  private grid: any;

  private playerSelection: Array<number> = [];

  private games: any;
  private showingInstructions: boolean = true;

  @Input() show: boolean;

  private resultSource = new Subject<number>();
  result = this.resultSource.asObservable();

  constructor() { }

  ngOnInit() {
  	this.grid = [
  		{ isLighted: false },
  		{ isLighted: false },
  		{ isLighted: false },
  		{ isLighted: false },
  		{ isLighted: false },
  		{ isLighted: false },
  		{ isLighted: false },
  		{ isLighted: false },
  		{ isLighted: false }
  	];

  	this.games = [
  		[0, 2, 6, 8], 
  		[1, 4, 7, 5, 3], 
  		[6, 4, 0, 8, 2], 
  		[4, 3, 1, 7, 0, 5, 8],
  		[8, 0, 4, 1, 2, 5, 6, 3]
  	];
  }

  startGame() {
  	this.state = 'started'
  	this.showInstructions();
  }

  showLight(index: number) {
  	setTimeout(() => {
  		this.grid[index].isLighted = true;
  		setTimeout(() => { 
  			this.grid[index].isLighted = false;
  		}, 500)
  	}, 500);
  }

  showInstructions() {
  	this.resultText = 'Please wait..'
  	let delay = this.gameState === 0 ? 1000 : 1000;

  	setTimeout(() => {
  		for (let i = 0; i < this.games[this.gameState].length; i++) {
  			setTimeout(() => {
	  			this.showLight(this.games[this.gameState][i]);
	  			if (i === this.games[this.gameState].length - 1) {
	  				setTimeout(() => {
	  					this.resultText = 'Now it\'s your turn!';
	  					this.showingInstructions = false;
	  				}, 2000)
	  			}
	  		}, 700 * i)
  		}
  	}, delay)
  }

  lightSelected(index: number) {
  	this.grid[index].isLighted = true;
  	this.playerSelection.push(index);
  	if (this.playerSelection.length === this.games[this.gameState].length) {
  		if (this.playerSelection.join() === this.games[this.gameState].join()) {
  			this.points = this.points + 50;
  			this.resultText = 'Well done!'
  			this.displayPoints('+ 50p');
  		} else {
  			this.points = this.points - 20;
  			this.resultText = 'Damn it! That\'s not the pattern..';
  			this.displayPoints('- 20p');
  		}

  		this.playerSelection = [];
  		this.gameState++;
  		this.showingInstructions = true;

  		if (this.gameState === this.games.length) {
  			this.updateResult(this.points);
  			this.resultText = 'Game over! You got ' + this.points + ' points!';
  			setTimeout(() => {
  				this.show = false;
  				return;
  			}, 5000)
  		} else {
  			setTimeout(() => {
	  			this.resultText = 'Next one..'
	  			this.turnLightsOff();
	  			setTimeout(() => {
	  				this.showInstructions();
	  			}, 3000)
	  		}, 6000)
  		}
  	}
  }

  turnLightsOff(): void {
  	for (let i in this.grid) this.grid[i].isLighted = false;
  }

  updateResult(points: number) {
    this.resultSource.next(points);
  }

  display() {
  	this.show = true;
  }
  displayPoints(points: string): void {
  	this.visiblePoints = points;
  	setTimeout(() => {
  		this.visiblePoints = undefined;
  	}, 3000)
  }
}
