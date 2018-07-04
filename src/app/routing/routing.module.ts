import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GameComponent } from '../game/game.component';
import { LeaderboardComponent } from '../leaderboard/leaderboard.component';
import { SettingsComponent } from '../settings/settings.component';

const routes: Routes = [
  { path: 'game', component: GameComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: 'settings', component: SettingsComponent }
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  declarations: []
})

export class RoutingModule { }
