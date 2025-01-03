import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/LoginService/login.service';
import { inject } from '@angular/core';

export const AuthicatedGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService)
  const router = inject(Router)
  if ( loginService.isAuthenticated() ){
    return router.navigate(['/'])
  }else{
    return true
  }
};
