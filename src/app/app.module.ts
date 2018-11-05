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

import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { SettingsComponent } from './settings/settings.component';
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
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { SlickModule } from 'ngx-slick';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    LeaderboardComponent,
    SettingsComponent,
    MessengerContactComponent,
    MessengerMediaComponent,
    LoginComponent
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
    AngularFontAwesomeModule,
    PickerModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    SlickModule.forRoot()
  ],
  providers: [MessageService, AuthService, AuthGuard, WindowRefService, CanDeactivateGuard],
  bootstrap: [AppComponent],
  entryComponents: [MessengerContactComponent]
})
export class AppModule { }
