import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private LOGIN_URL = 'https://earnest-dream-production.up.railway.app/api/login'
  private tokenKey = 'authToken'

  constructor(private httpClient: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any>{
    return this.httpClient.post<any>(this.LOGIN_URL, {email, password}).pipe(
      tap(response => {
        if(response.token){
          this.setToken(response.token);
        }
      })
    )
  }

  private setToken(token: string): void{
    localStorage.setItem(this.tokenKey, token)
    console.warn('Token almacenado sin cifrado:', token)
  }

  public getToken(): string | null {
    if (typeof window !== 'undefined'){
      return localStorage.getItem(this.tokenKey)
    }else{
      return null;
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if(!token){
      return false;
    }
    const payload = JSON.parse(atob(token.split('.')[1]))
    const expiration = payload.exp * 1000
    return Date.now() < expiration
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey)
  }
}
