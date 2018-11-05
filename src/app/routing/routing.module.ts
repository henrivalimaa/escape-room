import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GameComponent } from '../game/game.component';
import { LeaderboardComponent } from '../leaderboard/leaderboard.component';
import { SettingsComponent } from '../settings/settings.component';
import { LoginComponent } from '../login/login.component';

import { AuthGuard } from '../services/auth-guard.service';
import { CanDeactivateGuard } from '../services/can-deactivate-guard.service';

const routes: Routes = [
	{ path: 'login', component: LoginComponent },
	{ path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'game', component: GameComponent, canActivate: [AuthGuard], canDeactivate: [CanDeactivateGuard] },
  { path: 'leaderboard', component: LeaderboardComponent, canActivate: [AuthGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] }
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],
  declarations: []
})

export class RoutingModule { }
