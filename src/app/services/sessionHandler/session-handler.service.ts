import { Injectable } from '@angular/core';
import { GlobalFunctionsService } from '../globalFunctions/global-functions.service';

@Injectable({
  providedIn: 'root'
})
export class SessionHandlerService {

  constructor(private global : GlobalFunctionsService) { }

  IsloggedIn(){    
    let user = this.global.getCookie("UserID"); // JSON.parse(localStorage.getItem('user') || '{}');
    if (user) {
      return true;
    } else {
      return false;
    }
    // return !!user // !!user._token;
  }

  userData(){
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
}
