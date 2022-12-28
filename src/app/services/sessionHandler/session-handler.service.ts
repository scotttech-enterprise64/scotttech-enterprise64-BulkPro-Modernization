import { Injectable } from '@angular/core';
import { GlobalFunctionsService } from '../globalFunctions/global-functions.service';

@Injectable({
  providedIn: 'root'
})
export class SessionHandlerService {


  private deviceID = "";
  private dSName = "";
  private userID = "";
  private password = "";
  private lastNameFirstName:any;
  private isADLDS:any;

  constructor(private global: GlobalFunctionsService) 
  {

  }

  // Setter getter methods for session variables
  public DeviceID(id: any): any { if (id==undefined) { return this.deviceID; } else { this.deviceID = id; return id; } }
  public DSName(name: any): any { if (name==undefined) { return this.dSName; } else { this.dSName = name; return name; } }
  public UserID(userId: any): any { if (userId==undefined) { return this.userID; } else { this.userID = userId; return userId; } }
  public Password(password: any): any { if (password==undefined) { return this.password; } else { this.password = password; return password; } }
  public LastNameFirstName(lastNameFirstName: any): any { if (lastNameFirstName==undefined) { return this.lastNameFirstName; } else { this.lastNameFirstName = lastNameFirstName; return lastNameFirstName; } }
  public IsADLDS(isADLDS: any): any { if (isADLDS==undefined) { return this.isADLDS; } else { this.isADLDS = isADLDS; return isADLDS; } }


  public setSession(deviceID: any, dsName: any, userID: any, password: any,lastNameFirstName:any,isADLDS:any) {
    if (deviceID!="") {
      this.global.setCookie("DeviceID",deviceID, 1000000);
    }
    if (dsName!="") {
      this.global.setCookie("DSName",dsName, 1000000);
    }
    if (userID!="") {
      this.global.setCookie("UserID",userID, 1000000);//change to 15
    }
    if (password!="") {
      this.global.setCookie("PW",password, 1000000);//change to 15
    }
    if(lastNameFirstName!="")
    {
      this.global.setCookie("LastNameFirstName",lastNameFirstName, 1000000);//change to 15
    }
    if(isADLDS!="")
    {
      this.global.setCookie("isADLDS",isADLDS, 1000000);
    }

    this.getSession();
  }

  public getSession() {
  this.DeviceID(this.global.getCookie("DeviceID"));
  this.DSName(this.global.getCookie("DSName"));
  this.UserID(this.global.getCookie("UserID"));
  this.Password(this.global.getCookie("PW"));
  this.LastNameFirstName(this.global.getCookie("LastNameFirstName"));
  this.IsADLDS(this.global.getCookie("isADLDS"));
  }

  IsloggedIn() {
  this.getSession();
  return this.UserID(undefined)!="";
  }

  userData() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
}
