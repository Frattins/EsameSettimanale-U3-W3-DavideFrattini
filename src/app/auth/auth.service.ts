import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { iUser } from '../Models/i-user';
import { Router } from '@angular/router';
import { iAuthData } from '../Models/i-auth-data';
import { iAccessResponse } from '../Models/i-access-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  jwdHelper:JwtHelperService = new JwtHelperService();

  authSubject = new BehaviorSubject<null|iUser>(null);

  user$ = this.authSubject.asObservable();
  isLoggedIn$ = this.user$.pipe(map(user =>!!user),tap(user => this.syncIsLoggedIn = user));

  syncIsLoggedIn:boolean = false;

  constructor(
    private http:HttpClient,
    private router:Router
  ) {

    this.restoreUser()

  }
  userUrl:string = "http://localhost:3000/users"
  loginUrl:string = "http://localhost:3000/login"
  registerUrl:string = "http://localhost:3000/register"
  register(newUser:Partial<iUser>):Observable<iAccessResponse>{
    return this.http.post<iAccessResponse>(this.registerUrl,newUser);
  }

  login(authData:iAuthData):Observable<iAccessResponse>{
    return this.http.post<iAccessResponse>(this.loginUrl,authData)
    .pipe(tap(data =>{
      this.authSubject.next(data.user);

      localStorage.setItem("accessData", JSON.stringify(data));

      this.autoLogout()
    }))
  }

  logout():void{
    this.authSubject.next(null)

    localStorage.removeItem("accessData");

    this.router.navigate([""])
  }

  autoLogout():void{

    const accessData = this.getAccessData();

    if(!accessData) return;

    const dataDiScadenza = this.jwdHelper.getTokenExpirationDate(accessData.accessToken) as Date

    const tempoScadenza = dataDiScadenza.getTime() - new Date().getTime();

    setTimeout(()=>{
      this.logout
    },tempoScadenza)

  }

  getAccessData():iAccessResponse|null{

    const accessDataJson = localStorage.getItem("accessData");
    if(!accessDataJson) return null

    const accessData:iAccessResponse = JSON.parse(accessDataJson);

    return accessData;

  }

  restoreUser():void{

    const accessData = this.getAccessData();

    if(!accessData) return;

    if(this.jwdHelper.isTokenExpired(accessData.accessToken)) return

    this.authSubject.next(accessData.user)

    this.autoLogout()

  }


  getAllUser() {
    return this.http.get<iUser[]>(this.userUrl);
}
}
