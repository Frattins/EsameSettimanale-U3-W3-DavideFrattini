import { Component } from '@angular/core';
import { iAuthData } from '../../Models/i-auth-data';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  authdata:iAuthData = {
    email:'',
    password:''
  }

  constructor(
    private authSvc:AuthService,
    private router:Router,
  ) {}
  signIn(){
      this.authSvc.login(this.authdata)
      .subscribe(()=>{
      this.router.navigate(['/homepage'])
    })
  }

}
