import { Component, OnInit } from '@angular/core';
import { iUser } from '../../Models/i-user';
import { AuthService } from '../../auth/auth.service';
import { MoviesService } from '../movies.service';
import { iMovies } from '../../Models/i-movies';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit  {

  user!:iUser;
  userFavorites: iMovies[] = [];
  movies: iMovies[] = [];
  favoriteIds: any[] = [];
  constructor(
    private authSvc:AuthService,
    private moviesSvc: MoviesService
  ){}

  ngOnInit(){

    this.authSvc.user$.subscribe(user =>{
      if(user) this.user = user;
      if (user) {
    this.loadFavorites(user.id);
}
    });
  }

  loadFavorites(userId: number): void {
    this.moviesSvc.getUserFavorites(userId).subscribe(favoriteIds => {
      const movieDetailsRequests = favoriteIds.map(fav =>
        this.moviesSvc.getMovieDetails(fav.movieId)
      );

      forkJoin(movieDetailsRequests).subscribe(movies => {
        this.userFavorites = movies;
      });
    });
  }
  isFavorite(movieId: number): boolean {
    return this.favoriteIds.some(fav => fav.movieId === movieId);
  }


  removeFromFavorites(movieId: number): void {
    const favorite = this.favoriteIds.find(fav => fav.movieId === movieId);
    if (favorite) {
      this.moviesSvc.removeFavorite(favorite.id).subscribe(() => {
        this.favoriteIds = this.favoriteIds.filter(fav => fav.id !== favorite.id);
      });
    }
  }

  syncFavorites(): void {
    if (this.movies && this.favoriteIds) {
      this.movies.forEach(movie => {
        movie.isFavorite = this.isFavorite(movie.id);
      });
    }
  }
}

