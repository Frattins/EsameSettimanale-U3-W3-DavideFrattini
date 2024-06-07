import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { iUser } from '../../Models/i-user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  users: iUser[] = [];


  constructor(
    private authService: AuthService,

  ) { }

  ngOnInit(): void {
    this.authService.getAllUser().subscribe(users => {
      this.users = users;
    });
  }


}
