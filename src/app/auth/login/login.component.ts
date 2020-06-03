import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  showLoader: boolean = false

  private authStatusSub: Subscription

  constructor(public authservice: AuthService) { }

  ngOnInit() {
    this.authStatusSub = this.authservice.getAuthStatusListner().subscribe(authStatus => {
      this.showLoader = false
    })
  }
  onLogin(form: NgForm){

    this.showLoader=true
    this.authservice.login(form.value.email, form.value.password)
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe()
  }

}
