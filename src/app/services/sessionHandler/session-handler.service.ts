import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionHandlerService {

  constructor() { }

  IsloggedIn(){
    let user = JSON.parse(localStorage.getItem('user') || '{}');
    return !!user._token;
  }

  userData(){
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
}
