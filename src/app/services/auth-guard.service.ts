import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) { }

  /**
  * Validates if user is authenticated (JWT)
  * @returns returns a boolean value if user is authenticated
  */
  canActivate(): Observable<boolean> | boolean {
    if ( this.authService.authenticated ) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
