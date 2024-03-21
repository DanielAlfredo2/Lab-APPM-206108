import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthFirebaseService } from './auth-firebase.service';

@Injectable({
  providedIn: 'root'
})
export class GuardianGuard implements CanActivate {
  constructor(
    private authService: AuthFirebaseService,
    private router: Router
    ){

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.authService.isLoged){
        return true;
      }
      else{
        console.log("Acceso denegado!");
        this.router.navigate(['/login']);
        return false;
      }
  }

}