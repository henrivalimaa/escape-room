import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


import { Game } from './result';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
	private user: any = {};
	private game: Game = null;

	gamesRef: AngularFireList<Game> = null;
	games: Observable<any>;

	private basePath: string = '/games';

  constructor(private db: AngularFireDatabase, private authService: AuthService) { 
  	this.gamesRef = db.list(this.basePath);
  	this.user = authService.currentUser;

    this.games = this.gamesRef.snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );

  }

  setGame(game: Game): void {
  	this.game = game;
  }

  getCurrentGame(key) {
    return this.db.list(this.basePath, ref => ref.orderByChild('key').equalTo(key))
  }

  createGame(game: Game): void {
    this.gamesRef.push(game);
  }
 
  updateGame(key: string, value: any): void {
    this.gamesRef.update(key, value).catch(error => this.handleError(error));
  }
 
  deleteGame(key: string): void {
    this.gamesRef.remove(key).catch(error => this.handleError(error));
  }
 
  getGames(): Observable<any> {
    return this.games;
  }
 
  deleteAll(): void {
    this.gamesRef.remove().catch(error => this.handleError(error));
  }
 
  private handleError(error) {
    console.log(error);
  }

  get isUnfinished(): boolean {
    if (this.game === null) return false;
  	if (parseInt(localStorage.getItem('phase')) < this.game.messages.length) return true;
  	return false;
  }

  reset(): void {
  	localStorage.setItem('phase', '1');
  }

  getNextMessage(userResponse: string): any {
    if (parseInt(localStorage.getItem('phase')) >= this.game.messages.length) return null;
  	let phase = localStorage.getItem('phase');
  	if (this.game.messages[parseInt(phase) - 1].responseRequired) {
  		if (this.game.messages[parseInt(phase) - 1].answer.toLowerCase() != userResponse.toLowerCase()) return this.getFailureMessage();
  	}

  	localStorage.setItem('phase', (parseInt(phase) + 1).toString());
  	if (this.game.messages[parseInt(phase)].image != null) {
  		if (this.game.messages[parseInt(phase)].image === 'user.image') this.game.messages[parseInt(phase)].image = this.user.photoURL;
  	}
  	this.game.messages[parseInt(phase)].time = new Date().getHours() + '.' + new Date().getMinutes()
  	return this.game.messages[parseInt(phase)];
  }

  getFailureMessage(): any {
  	return { time: new Date().getHours() + '.' + new Date().getMinutes(), text: 'That is a wrong answer...', continous: false, incoming: true, delay: 2000, points: -25 };
  }
}

/*
let newGame = new Game();
newGame.title = 'Halloween';
newGame.key = 'halloween-2018';
newGame.duration = '30-60min';
newGame.questions = 10;
newGame.sender = {
  name: 'UNKOWN',
  photo: './assets/images/unknown.jpg',
  gallery: {
    { url: 'https://images.unsplash.com/photo-1506361797048-46a149213205?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=493e200df17b54d1ef10eb61e1df148a&w=1000&q=80' },
    { url: 'https://images.unsplash.com/photo-1506361797048-46a149213205?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=493e200df17b54d1ef10eb61e1df148a&w=1000&q=80' },
    { url: 'https://images.unsplash.com/photo-1506361797048-46a149213205?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=493e200df17b54d1ef10eb61e1df148a&w=1000&q=80' }
  }
};
newGame.images = {};
newGame.images.background = 'https://www.sopapeldeparede.com.br/wp-content/uploads/2014/10/lead-image-halloween.jpg';
newGame.maxTime = 120;
newGame.messages = [
	{ time: '', continous: true },
	{ time: '', image: 'user.image', continous: true, incoming: true, delay: 3000 },
	{ time: '', text: 'That is you, right? You might be wondering what the hell is going on. Well, let me tell you.', continous: true, incoming: true, delay: 3000 },
	{ time: '', text: 'I know you, but you don’t know me. I stole all of your personal information (bank account, pictures, etc.) when you registered to this game. You fool...', continous: true, incoming: true, delay: 5000 },
	{ time: '', text: 'You have two options. Either you play my game or I will share all of your information into the deepest dark web..', continous: true, incoming: true, delay: 5000 },
	{ time: '', text: 'Do you want to start playing? YES or NO!', continous: false, incoming: true, delay: 5000, responseRequired: true, answer: 'YES' },
	{ time: '', text: 'Okey, this will be a lot of fun!!', continous: true, incoming: true, delay: 2000, points: 100 },
	{ time: '', text: 'I go quickly thru the rules of my game.', continous: true, incoming: true, delay: 2000 },
	{ time: '', text: 'Every correct answer will give you 100 points and wrong one will take -25 points. Be careful when you answer to my questions.', continous: true, incoming: true, delay: 4000 },
	{ time: '', text: 'Your mission is to be as fast as possible. As soon as you type in the right answer for each individual game, I will let you move on to the next one.', continous: true, incoming: true, delay: 7000 },
	{ time: '', text: 'If you are clever enough, I will give you your information back and you won\'t be hearing from me anymore.', continous: true, incoming: true, delay: 7000 },
	{ time: '', text: 'Let’s have a quick test, if you understood the rules.', continous: true, incoming: true, delay: 4000 },
	{ time: '', text: '5 x 2 - 1 = ???', continous: true, incoming: true, delay: 4000 },
	{ time: '', text: 'What’s the number? Type in the right answer.', continous: false, responseRequired: true, answer: '9', incoming: true, delay: 3000 },
	{ time: '', text: 'Excellent.', continous: true, incoming: true, points: 100, delay: 1000 },
	{ time: '', text: 'First proper question.. There is a new halloween movie coming out. Who is the main character/killer?', continous: false, responseRequired: true, answer: 'Michael Myers', incoming: true, delay: 5000 },
	{ time: '', text: 'You are getting a hang on this. Next one ain\'t going to be this easy...' , image: 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/aa68-d023-01113-r-1539890493.jpg?crop=1.00xw:0.668xh;0,0.215xh&resize=480:*', continous: true, incoming: true, points: 100, delay: 3000 },
	{ time: '', text: 'I have hidden clues and answers around you. You just need to find them..', continous: true, incoming: true, delay: 5000 },
	{ time: '', image: 'assets/images/halloween/chalkboard.jpg', continous: true, incoming: true, delay: 4000 },
	{ time: '', text: 'What is the word on the note?', continous: false, responseRequired: true, answer: 'Bloodthirst', incoming: true, delay: 2000 },
	{ time: '', text: 'Ah.. You found it!', continous: true, incoming: true, points: 100, delay: 2000 },
	{ time: '', text: 'Next one.. Before people used pumpkins, what were Jack O\' Lanterns made out of?', continous: true, incoming: true, delay: 6000 },
	{ time: '', text: 'Answer with a number..', continous: true, incoming: true, delay: 3000 },
	{ time: '', text: '1. Potatoes', continous: true, incoming: true, delay: 1000 },
	{ time: '', text: '2. Turnips', continous: true, incoming: true, delay: 1000 },
	{ time: '', text: '3. Gabbage', continous: true, incoming: true, delay: 1000 },
	{ time: '', text: '4. Onions', continous: false, responseRequired: true, answer: '2', incoming: true, delay: 1000 },
	{ time: '', text: 'Turnips!', continous: true, incoming: true, points: 100, delay: 2000 },
	{ time: '', text: 'There are cups on the table.. Drink it up to get your next answer...', continous: true, incoming: true, delay: 1000 },
	{ time: '', text: 'What is the answer? ', continous: false, responseRequired: true, answer: 'graveyard', incoming: true, delay: 1000 },
	{ time: '', text: 'Were you brave enough to drink it up?', continous: true, incoming: true, points: 100, delay: 2000 },
	{ time: '', text: 'Oh shit.. You need to hussle again. Next hidden mission for you....', continous: true, incoming: true, delay: 6000 },
	{ time: '', image: 'assets/images/halloween/basement.jpg', continous: true, incoming: true, delay: 3000 },
	{ time: '', text: 'What\'s the answer?', continous: false, responseRequired: true, answer: 'Delight', incoming: true, delay: 2000 },
	{ time: '', text: 'You are so clever but I\'m not sure if you can handle the next one..', continous: true, incoming: true, points: 100, delay: 3000 },
	{ time: '', text: 'What is my phone number? Can you find it?', continous: false, responseRequired: true, answer: '040 666 0666', incoming: true, delay: 4000 },
	{ time: '', text: 'Well... That\'s a fun phone number, isn\'t it?', continous: true, incoming: true, points: 100, delay: 3000 },
	{ time: '', text: 'Now... You need to participate. There are stickers on the table. All you need to do is to stick the sticker to someone\'s clothes without them realizing it. Show the victim to Henri because he needs to witness this action happen. He has the answer...', continous: true, incoming: true, delay: 3000 },
	{ time: '', text: 'What is the answer?', continous: false, incoming: true, responseRequired: true, answer: 'Spooky Poo', delay: 10000 },
	{ time: '', text: 'Humiliation! Let\'s go!', continous: true, incoming: true, points: 100, delay: 5000 },
	{ time: '', text: 'Alright.. Last one...', continous: true, incoming: true, delay: 3000 },
	{ time: '', image: 'assets/images/halloween/attic.jpg', continous: true, incoming: true, delay: 3000 },
	{ time: '', text: 'Aaaaaaaaaaaand the answer is?', continous: false, responseRequired: true, answer: 'Henri on paras!', incoming: true, delay: 2000 },
	{ time: '', text: 'Gongratulations. Your personal information is no longer in my posession... Bye...', continous: true, incoming: true, points: 100, delay: 5000 },
	{ time: '', text: 'Bye', continous: true, incoming: true, delay: 5000 },
];
this.createGame(newGame);
*/
