import { Component, OnInit } from '@angular/core';

import { UserService } from '../services/user.service';
import { User } from '../services/result';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

	private user: User;

  constructor(private userService: UserService) { }

  ngOnInit() {
  	this.user = this.userService.currenUser;
  }

}
