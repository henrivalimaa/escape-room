import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { RoutingModule } from './routing/routing.module';
import { GameComponent } from './game/game.component';

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRadioModule } from '@angular/material/radio';

import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { MessengerContactComponent } from './messenger-contact/messenger-contact.component';
import { MessengerMediaComponent } from './messenger-media/messenger-media.component';
import { LoginComponent } from './login/login.component';

import { MessageService } from './services/message.service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth-guard.service';
import { CanDeactivateGuard } from './services/can-deactivate-guard.service';
import { WindowRefService } from './services/result';

import { PickerModule } from '@ctrl/ngx-emoji-mart';

import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { SlickModule } from 'ngx-slick';
import { NgcCookieConsentModule, NgcCookieConsentConfig } from 'ngx-cookieconsent';
import { GameListComponent } from './game-list/game-list.component';
import { SetupComponent } from './setup/setup.component';
import { ProfileComponent } from './profile/profile.component';
import { GameEditorComponent } from './game-editor/game-editor.component';
import { StartComponent } from './start/start.component';

const cookieConfig:NgcCookieConsentConfig = {
  "cookie": {
    "domain": "henrivalimaa.com"
  },
  "position": "bottom",
  "theme": "edgeless",
  "palette": {
    "popup": {
      "background": "#215e53",
      "text": "#ffffff",
      "link": "#ffffff"
    },
    "button": {
      "background": "#2a9887",
      "text": "#fff",
      "border": "transparent"
    }
  },
  "type": "info",
  "content": {
    "message": "This website uses cookies to ensure you get the best experience on our website.",
    "dismiss": "I Accept",
    "deny": "Refuse cookies",
    "link": "Learn more",
    "href": "https://cookiesandyou.com"
  }
};


@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    LeaderboardComponent,
    MessengerContactComponent,
    MessengerMediaComponent,
    LoginComponent,
    GameListComponent,
    SetupComponent,
    ProfileComponent,
    GameEditorComponent,
    StartComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    RoutingModule,
    MatMenuModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatStepperModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatRadioModule,
    AngularFontAwesomeModule,
    PickerModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    SlickModule.forRoot(),
    NgcCookieConsentModule.forRoot(cookieConfig)
  ],
  providers: [MessageService, AuthService, AuthGuard, WindowRefService, CanDeactivateGuard],
  bootstrap: [AppComponent],
  entryComponents: [MessengerContactComponent]
})
export class AppModule { }
