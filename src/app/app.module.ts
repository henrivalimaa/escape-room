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

import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { SettingsComponent } from './settings/settings.component';
import { MessengerContactComponent } from './messenger-contact/messenger-contact.component';
import { MessengerMediaComponent } from './messenger-media/messenger-media.component';

import { MessageService } from './services/message.service';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    LeaderboardComponent,
    SettingsComponent,
    MessengerContactComponent,
    MessengerMediaComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    RoutingModule,
    MatMenuModule,
    MatButtonModule,
    MatDialogModule,
    AngularFontAwesomeModule
  ],
  providers: [MessageService],
  bootstrap: [AppComponent],
  entryComponents: [MessengerContactComponent]
})
export class AppModule { }
