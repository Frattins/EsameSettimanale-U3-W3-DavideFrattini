import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuestGuard } from './auth/guest.guard';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
    {
    path: '', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    canActivate: [GuestGuard],
    canActivateChild: [GuestGuard]
  },
  {
    path: 'homepage', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule),
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard]
  },
    { path: 'profile', loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule),
      canActivate: [AuthGuard],
      canActivateChild: [AuthGuard]
    },
    { path: 'users', loadChildren: () => import('./pages/users/users.module').then(m => m.UsersModule) ,
      canActivate: [AuthGuard],
      canActivateChild: [AuthGuard]
    },
    {
      path: 'movies-popolar/:id', loadChildren: () => import('./pages/movie-detail/movie-detail.module').then(m => m.MovieDetailModule),
      canActivate: [AuthGuard],
      canActivateChild: [AuthGuard]
    },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
