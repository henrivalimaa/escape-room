import { Component, OnInit, AfterViewChecked, OnDestroy, ElementRef, ViewChild, HostListener, NgZone, Input } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";

import { MessageService } from '../services/message.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

import { Result, Game } from '../services/result';
import { ScoreService } from '../services/score.service';

import { ButtonClicker } from '../minigames/button-clicker/button-clicker.component';
import { LightPattern } from '../minigames/light-pattern/light-pattern.component';

import { fadeAnimation, slideAnimation, darkenAnimation } from '../animations/animations';

import { Subject, Observable, SubscriptionLike, timer } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

@Component({
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  animations: [fadeAnimation, slideAnimation, darkenAnimation]
})

export class GameComponent implements OnInit, AfterViewChecked, OnDestroy {

	private player: any = {};
	private gameInitialized: boolean = false;

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

  private game: any;
  private key: string;

  private result: Result = new Result();
  private results: any;
  private showResult: boolean = false;
  private points: number;
  private showPoints: boolean = false;
  private loadingLeaderboard: boolean = false;
  private hint: any = {};
  private showHint: boolean = false;

  @ViewChild('buttonClicker') buttonClicker: ButtonClicker;
  @ViewChild('lightPattern') lightPattern: LightPattern;

  slideConfig = {'slidesToShow': 1, 'dots': true};

  constructor(
  	private messageService: MessageService,
    private authService: AuthService,
    private userService: UserService,
    private scoreService: ScoreService,
    private route: ActivatedRoute,
    private zone: NgZone,
    private router: Router
	) {}

  ngOnInit() {
    this.player = this.userService.currentUser;

    this.result = new Result();
    this.time = {};
    this.messageService.reset();

    this.route
      .queryParams
      .subscribe(params => {
        if (params.id) this.startGame(params.id);
      });
  }

  ngOnDestroy() {
  }

  @HostListener('window:beforeunload', ['$event'])
  public onDestroy($event) {
    return $event.returnValue = true;
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

  startGame(key: string): void {
    this.messageService.getGameKey(key).subscribe(res => {
      this.key = res[0].$key;
    });

    this.messageService.getCurrentGame(key).subscribe(games => {
      if (games[0].gameState.state === 'inactive') {
        this.zone.run(() => {
          this.router.navigate(['start']);
        });
        return;
      }
      
      this.game = games[0];
      this.messageService.setGame(this.game);
      
      if (!this.gameInitialized) {
        this.gameInitialized = true;

        this.time.start = new Date();
        this.typing = true;
        this.result.score = 0;

        setTimeout(() => {
          this.typing = false;
          this.messages.push({ time: new Date().getHours() + '.' + new Date().getMinutes(), text: 'Hello ' + this.player.displayName, incoming: true });
        }, 2000)
      }
    });
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
    if (this.nextMessage === null) {
      this.typing = false;
      return;
    }

    if (this.nextMessage.type === 'Game') {
      if(this.nextMessage.game === 'button-clicker') {
        setTimeout(() => { this.buttonClicker.display(); }, this.nextMessage.delay)

        this.buttonClicker.result.subscribe(result => {
          if (result !== undefined) {
            let temp = this.player;
            temp.additionalData.activeGame.points = temp.additionalData.activeGame.points + result;
            temp.additionalData.activeGame.correctAnswers = temp.additionalData.activeGame.correctAnswers + 1;
            this.messageService.updateCurrentGameUser(this.key, temp);
            setTimeout(() => {
              setTimeout(() => {this.messages.push({ time: new Date().getHours() + '.' + new Date().getMinutes(), text: 'Button clicker score = ' + result + '!', incoming: true })});
              this.displayPoints(result);
              this.continueDialog(message);
            }, 6000);
          }
        });
      }

      if(this.nextMessage.game === 'light-pattern') {
        setTimeout(() => { this.lightPattern.display(); }, this.nextMessage.delay)

        this.lightPattern.result.subscribe(result => {
          if (result !== undefined) {
            let temp = this.player;
            temp.additionalData.activeGame.points = temp.additionalData.activeGame.points + result;
            temp.additionalData.activeGame.correctAnswers = temp.additionalData.activeGame.correctAnswers + 1;
            this.messageService.updateCurrentGameUser(this.key, temp);
            setTimeout(() => {
              setTimeout(() => {this.messages.push({ time: new Date().getHours() + '.' + new Date().getMinutes(), text: 'Light pattern game score = ' + result + '!', incoming: true })});
              this.displayPoints(result);
              this.continueDialog(message);
            }, 6000);
          }
        });
      }
    }

    if (this.nextMessage.points) {
      let temp = this.player;
      temp.additionalData.activeGame.points = temp.additionalData.activeGame.points + this.nextMessage.points;
      if (this.nextMessage.points < 0) temp.additionalData.activeGame.invalidAnswers = temp.additionalData.activeGame.invalidAnswers + 1;
      if (this.nextMessage.points > 0) temp.additionalData.activeGame.correctAnswers = temp.additionalData.activeGame.correctAnswers + 1;
      this.messageService.updateCurrentGameUser(this.key, temp);
      this.displayPoints(this.nextMessage.points);
    }

    if (this.nextMessage.type !== 'Game') {
      setTimeout(() => {
        this.messages.push(this.nextMessage);
        if (this.nextMessage.hint) {
          this.hint.isActive = true;
          this.hint.text = this.nextMessage.hint;
        }

        this.typing = false;

        if (this.nextMessage.final === true) this.endGame();
        if (this.nextMessage.continous) this.continueDialog(message);
       }, this.nextMessage.delay);
    }
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

  sortPlayers(order: string): void {
    this.game.gameState.users.sort((a, b) => {
        if (a['points'] < b['points'])
            return -1;
        if (a['points'] > b['points'])
            return 1;
        return 0;
    });

    if (order === "DESC") {
        this.game.gameState.users.reverse();
    }
  }

  endGame(): void {
    if (this.showResult === true) return;
    this.showResult = true;
    this.saveScore();
  }

  saveScore() {
    this.time.end = new Date();
    this.result.time =  Math.floor((this.time.end.getTime()/1000) - (this.time.start.getTime()/1000));
    this.time.minutes = Math.floor(this.result.time / 60);
    this.time.seconds = this.result.time - this.time.minutes * 60;
    this.result.timeStamp = new Date();
    this.result.gamerTag = this.player.gamerTag;
    this.result.game = this.game.key;
    this.result.score = this.result.score + this.getTimePoints(this.result.time);
    this.scoreService.createResult(this.result);

    let temp = this.player;
    temp.additionalData.activeGame.isFinished = true;
    temp.additionalData.activeGame.points = this.result.score;
    temp.additionalData.activeGame.time = this.result.time;
    this.messageService.updateCurrentGameUser(this.key, temp);

    this.sortPlayers('DESC');
  }

  getTimePoints(seconds:number): number {
    return Math.floor((120 - seconds/60) * 50);
  }

  displayPoints(points: number): void {
    this.result.score = this.result.score + points;
    this.showPoints = true;
    this.points = points;
    if (this.points > 0) {
      this.hint.text = undefined;
      this.showHint = false;
      this.hint.isActive = false;
    }
    setTimeout(() => {
      this.showPoints = false;
     }, 1500);
  }

  canDeactivate() {
    if (this.messageService.isUnfinished === true) {
      return window.confirm('Do you want to leave this game?');
    }

    return true;
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
