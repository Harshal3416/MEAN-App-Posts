import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment} from '../../environments/environment'

import { Post } from '../posts/post.model'

const BACKEND_URL = `${environment.apiUrl}/user`

@Injectable({ providedIn: "root"})
export class AuthService{

  private tokenTimer: any
  private token : string
  private authStatusListner = new Subject<boolean>()
  private isAuthenticated: boolean;

  private userId: string

  constructor( private http: HttpClient , private route: Router ){}

  getToken(){
    return this.token
  }

  getIsAuth(){
    return this.isAuthenticated
  }

  getAuthStatusListner(){
    return this.authStatusListner.asObservable()
  }

  getUserId(){
    return this.userId
  }

  createUser(email: string, password: string){
    const authData: AuthData = {email: email, password: password}

    console.log("AuthData", authData)

    this.http.post(`${BACKEND_URL}/signup`, authData)
      .subscribe(response => {
        this.route.navigate(['/'])
      }, error => {
        this.authStatusListner.next(false)
      })
  }


  login(email: string, password: string){
    const authData: AuthData = {email: email, password: password}

    this.http.post<{token: string, expiresIn: number, userId: string}>(`${BACKEND_URL}/login`, authData)
    .subscribe(response => {
      this.token = response.token

      if(this.token){
        const expiresInDuration = response.expiresIn
        this.setAuthTimer(expiresInDuration)
        this.isAuthenticated = true
        this.userId = response.userId
        this.authStatusListner.next(true)

        const now = new Date();
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
        console.log(expirationDate);
        this.saveAuthData(this.token, expirationDate, this.userId);

        this.route.navigate(['/'])
      }
    }, error => {
      this.authStatusListner.next(false)
    } )
  }

  logout(){
    this.token=null
    this.isAuthenticated = false
    this.userId = null
    this.authStatusListner.next(false)
    clearTimeout(this.tokenTimer)
    this.clearAuthData();
    this.route.navigate(['/'])
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListner.next(true);
    }
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }



}
