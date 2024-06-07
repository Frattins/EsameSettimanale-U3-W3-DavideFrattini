import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { iMovies } from '../../Models/i-movies';
import { MoviesService } from '../movies.service';
import { iUser } from '../../Models/i-user';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.scss'
})
export class MovieDetailComponent implements OnInit {
  user!:iUser;
  movies: iMovies[] = [];
  favoriteIds: any[] = []; // To store the favorite IDs
  movie!: iMovies;

  constructor(
    private route: ActivatedRoute,
    private moviesSvc: MoviesService,
    private authSvc: AuthService
  ) { }

  ngOnInit(){

    this.authSvc.user$.subscribe(user =>{
      if(user) this.user = user;
      this.moviesSvc.$movie.subscribe(movies => {
        this.movies = movies;
      });
      if(user)
        this.loadFavorites(user.id);
      const movieId = this.route.snapshot.paramMap.get('id');
      if (movieId) {
        this.moviesSvc.getMovieDetails(+movieId).subscribe(movie => {
          this.movie = movie;
        });
      }});
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
