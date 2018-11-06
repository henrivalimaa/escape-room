import { Component, OnInit, OnDestroy } from '@angular/core';
import { viewFadeAnimation } from './animations/animations';
import { NgcCookieConsentService } from 'ngx-cookieconsent';
import { Subscription }   from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [ viewFadeAnimation ]
})

export class AppComponent implements OnInit, OnDestroy {
	private popupOpenSubscription: Subscription;
  private popupCloseSubscription: Subscription;

  constructor(private ccService: NgcCookieConsentService){}

	ngOnInit() {
		localStorage.setItem('phase', '1');
		// subscribe to cookieconsent observables to react to main events
    this.popupOpenSubscription = this.ccService.popupOpen$.subscribe(
    () => {
      // you can use this.ccService.getConfig() to do stuff...
    });
 
    this.popupCloseSubscription = this.ccService.popupClose$.subscribe(
    () => {
      // you can use this.ccService.getConfig() to do stuff...
    });
	}

	ngOnDestroy() {
		this.popupOpenSubscription.unsubscribe();
    this.popupCloseSubscription.unsubscribe();
	}
}
