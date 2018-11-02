import { Component } from '@angular/core';
import { viewFadeAnimation } from './animations/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [ viewFadeAnimation ]
})

export class AppComponent {
	ngOnInit() {
		localStorage.setItem('phase', '1');
	}
}
