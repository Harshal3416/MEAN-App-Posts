import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  showLoader: boolean = false
  private authStatusSub: Subscription

  constructor(public authservice: AuthService) { }

  ngOnInit() {
    this.authStatusSub = this.authservice.getAuthStatusListner().subscribe(authStatus => {
      this.showLoader = false
    })
  }

  onSignup(form: NgForm){

    if(form.invalid){
      return
    }
    this.showLoader=true

    this.authservice.createUser(form.value.email, form.value.password)
  }

  ngOnDestroy(){
    this.authStatusSub.unsubscribe()
  }


}
