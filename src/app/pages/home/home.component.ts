import { Component } from '@angular/core';
import { iUser } from '../../Models/i-user';
import { AuthService } from '../../auth/auth.service';
import { iMovies } from '../../Models/i-movies';
import { MoviesService } from '../movies.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  user!:iUser;
  movies: iMovies[] = [];
  favoriteIds: any[] = []; // To store the favorite IDs


  constructor(
    private authSvc:AuthService,
    private moviesSvc:MoviesService
  ){}

  ngOnInit(){

    this.authSvc.user$.subscribe(user =>{
      if(user) this.user = user;
      this.moviesSvc.$movie.subscribe(movies => {
        this.movies = movies;
      });
      if(user)
        this.loadFavorites(user.id);
        this.loadMovies();
      });
    }

    loadMovies(): void {
      this.moviesSvc.getAllMovies().subscribe(movies => {
        this.movies = movies;
        this.syncFavorites(); // Sincronizzare i preferiti dopo il caricamento dei film
      });
    }

    loadFavorites(userId: number): void {
      this.moviesSvc.getUserFavorites(userId).subscribe(favorites => {
        this.favoriteIds = favorites;
        this.syncFavorites(); // Sincronizzare i preferiti dopo il caricamento dei preferiti
      });
    }

    isFavorite(movieId: number): boolean {
      return this.favoriteIds.some(fav => fav.movieId === movieId);
    }

    toggleFavorite(movie: iMovies): void {
      if (this.isFavorite(movie.id)) {
        this.removeFromFavorites(movie.id);
      } else {
        this.addToFavorites(movie.id);
      }
    }

    addToFavorites(movieId: number): void {
      this.moviesSvc.addFavorite(movieId, this.user.id).subscribe(favorite => {
        this.favoriteIds.push(favorite);
      });
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
