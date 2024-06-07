import { Component } from '@angular/core';
import { iUser } from '../../Models/i-user';
import { AuthService } from '../auth.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  newUser:Partial<iUser> = {}

  constructor(
    private authSvc:AuthService,
    private router:Router
  ){}

  register(){
    this.authSvc.register(this.newUser).subscribe()
    this.router.navigate(['/login'])

    }

}
