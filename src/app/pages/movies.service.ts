import { Injectable } from '@angular/core';
import { iMovies } from '../Models/i-movies';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MoviesService {


  moviesUrl:string = "http://localhost:3000/movies-popolar"
  movies: iMovies[] = []
  movieSubj = new BehaviorSubject<iMovies[]>([]);
  $movie = this.movieSubj.asObservable()

  favoriteUrl:string = "http://localhost:3000/favorite"
  favoriteSubj = new BehaviorSubject<iMovies[]>([]);
  $favorite = this.favoriteSubj.asObservable()


  constructor(
    private http:HttpClient
  ) {
    this.getAllMovies().subscribe(data=>{
      this.movieSubj.next(data)
      this.movies=data
    })
  }

  getAllMovies(): Observable<iMovies[]>{
    return this.http.get<iMovies[]>(this.moviesUrl)
  }

  addFavorite(movieId: number, userId: number): Observable<any> {
    const url = this.favoriteUrl;
    return this.http.post(url, { movieId, userId });
  }
  getUserFavorites(userId: number): Observable<any[]> {
    const url = `${this.favoriteUrl}?userId=${userId}`;
    return this.http.get<any[]>(url);
  }

  getMovieDetails(movieId: number): Observable<iMovies> {
    const url = `${this.moviesUrl}/${movieId}`;
    return this.http.get<iMovies>(url);
  }


  removeFavorite(favoriteId: number): Observable<any> {
    const url = `${this.favoriteUrl}/${favoriteId}`;
    return this.http.delete(url);
  }
}
