import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userIsAuthenticated = false
  private authListnerSubs: Subscription
  constructor(private authService : AuthService) { }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth()
    this.authListnerSubs = this.authService
    .getAuthStatusListner()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated
    });
  }

  ngOnDestroy(){

  }

  onlogout(){
    this.authService.logout()
  }


}
