import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor() { }

  getNextMessage(userResponse: string): any {
  	let phase = localStorage.getItem('phase');

  	if (GAME_MESSAGES[parseInt(phase) - 1].responseRequired) {
  		if (GAME_MESSAGES[parseInt(phase) - 1].answer != userResponse) return this.getFailureMessage();
  	}

  	localStorage.setItem('phase', (parseInt(phase) + 1).toString());
  	return GAME_MESSAGES[parseInt(phase)];
  }

  getFailureMessage(): any {
  	return { time: new Date().getHours() + '.' + new Date().getMinutes(), text: 'That is a wrong answer...', continous: false, incoming: true, delay: 2000 };
  }
}

const GAME_MESSAGES: any = [
	{},
	{ time: new Date().getHours() + '.' + new Date().getMinutes(), text: 'I see you found that phone, but I think you also noticed that you can’t use it to call help or do anything else.', continous: true, incoming: true, delay: 3000 },
	{ time: new Date().getHours() + '.' + new Date().getMinutes(), text: 'You might be wondering where are you and what is going on. Well, let me tell you.', continous: true, incoming: true, delay: 3000 },
	{ time: new Date().getHours() + '.' + new Date().getMinutes(), text: 'I know you, but you don’t know me. I have been following you and I have seen the things you have done in the past. That’s why I locked you inside that room.', continous: true, incoming: true, delay: 5000 },
	{ time: new Date().getHours() + '.' + new Date().getMinutes(), text: 'You have two options. Either you play my game or then you will die.', continous: true, incoming: true, delay: 5000 },
	{ time: new Date().getHours() + '.' + new Date().getMinutes(), text: 'Do you want to start playing? YES or NO!', continous: false, incoming: true, delay: 5000, responseRequired: true, answer: 'YES' },
	{ time: new Date().getHours() + '.' + new Date().getMinutes(), text: 'Okey, this will be a lot of fun!!', continous: true, incoming: true, delay: 2000 },
	{ time: new Date().getHours() + '.' + new Date().getMinutes(), text: 'I go quickly thru the rules of my game.', continous: true, incoming: true, delay: 2000 },
	{ time: new Date().getHours() + '.' + new Date().getMinutes(), text: 'There is bomb in the corner of the room. You are playing against time.', continous: true, incoming: true, delay: 4000 },
	{ time: new Date().getHours() + '.' + new Date().getMinutes(), text: 'Or against explosion :D', continous: true, incoming: true, delay: 7000 },
	{ time: new Date().getHours() + '.' + new Date().getMinutes(), text: 'Your mission is to be as fast as possible. As soon as you type in the right answer for each individual game, I will let you move on to the next one.', continous: true, incoming: true, delay: 7000 },
	{ time: new Date().getHours() + '.' + new Date().getMinutes(), text: 'If you are clever enough, I will give you the key to defuse the bomb.', continous: true, incoming: true, delay: 3000 },
	{ time: new Date().getHours() + '.' + new Date().getMinutes(), text: 'Let’s have a quickly test, if you understood the rules.', continous: true, incoming: true, delay: 2000 },
	{ time: new Date().getHours() + '.' + new Date().getMinutes(), text: '5 x 2 - 1 = ???', continous: true, incoming: true, delay: 4000 },
	{ time: new Date().getHours() + '.' + new Date().getMinutes(), text: 'What’s the number? Type in the right answer.', continous: false, responseRequired: true, answer: '9', incoming: true, delay: 3000 },
	{ time: new Date().getHours() + '.' + new Date().getMinutes(), text: 'Excellent.', continous: true, incoming: true, delay: 1000 },
	{ time: new Date().getHours() + '.' + new Date().getMinutes(), text: 'First game is all about your attitude towards your workers. You treat your employees like shit. You don’t pay enough and they work way too much... You are like a wolf chasing your lambs.', continous: true, incoming: true, delay: 5000 },
	{ time: new Date().getHours() + '.' + new Date().getMinutes(), text: 'That why I give you this puzzle. ', continous: true, incoming: true, delay: 2000 },
	{ time: new Date().getHours() + '.' + new Date().getMinutes(), text: 'Six wolves catch six lambs in six minutes. How many wolves will be needed to catch sixty lambs in sixty minutes?', continous: false, responseRequired: true, answer: '6', incoming: true, delay: 3000 },
	{ time: new Date().getHours() + '.' + new Date().getMinutes(), text: 'The right answer was SIX WOLVES.', continous: true, incoming: true, delay: 4000 },
	{ time: new Date().getHours() + '.' + new Date().getMinutes(), text: 'Let\'s see why. In the original amount of time: 6 wolves catch 6 lambs in 6 minutes. With 10 times as long: The same 6 wolves catch 60 lambs in 60 minutes. But let’s move on.', continous: true, incoming: true, delay: 5000 },
	{ time: new Date().getHours() + '.' + new Date().getMinutes(), text: 'Next puzzle is about you family. I have seen how you talk to your wife, yell to you kids. Now it’s your time to think you family. You are looking through the family photograph album, which has a photo of each of your parent, each of your grandparents, all the way up to each of your great-great-great-grandparents.', continous: true, incoming: true, delay: 5000 },
	{ time: new Date().getHours() + '.' + new Date().getMinutes(), text: 'How many photos is that? Give my number, like 1 or 15.', continous: false, responseRequired: true, answer: '62', incoming: true, delay: 5000 },
	{ time: new Date().getHours() + '.' + new Date().getMinutes(), text: 'Gongratulations. You finished before the explosion. Your time was TIME.', continous: true, incoming: true, delay: 3000 },
	{ time: new Date().getHours() + '.' + new Date().getMinutes(), text: 'Here is your key: 6969. You can use this to unlock the next room.', continous: true, incoming: true, delay: 5000 },
	{ time: new Date().getHours() + '.' + new Date().getMinutes(), text: 'Bye.', continous: false, incoming: true, delay: 5000 },
	{ time: new Date().getHours() + '.' + new Date().getMinutes(), text: '', continous: true, incoming: true, delay: 5000 },
	{ time: new Date().getHours() + '.' + new Date().getMinutes(), text: '', continous: true, incoming: true, delay: 5000 },
];
