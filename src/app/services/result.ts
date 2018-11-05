export class Result {
  player: string;
  score: number;
  game: string;
  timeStamp: Date;
  time: number;
}

export class Game {
	title: string;
	key: string;
	maxTime: 120;
  duration: string;
  questions: number;
  sender: any;
	images: any;
	messages: Array<any>;
}

export class Session {
	user: string;
	loggedIn: string;
	game: any;
}

import { Injectable } from '@angular/core';

// This interface is optional, showing how you can add strong typings for custom globals.
// Just use "Window" as the type if you don't have custom global stuff
export interface ICustomWindow extends Window {
    __custom_global_stuff: string;
}

function getWindow (): any {
    return window;
}

@Injectable()
export class WindowRefService {
    get nativeWindow (): ICustomWindow {
        return getWindow();
    }
}