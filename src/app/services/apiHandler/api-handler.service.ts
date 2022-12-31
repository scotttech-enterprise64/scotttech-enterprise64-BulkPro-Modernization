import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SessionHandlerService } from '../sessionHandler/session-handler.service';
import { GlobalFunctionsService } from '../globalFunctions/global-functions.service';

@Injectable({
  providedIn: 'root'
})
export class ApiHandlerService {


  constructor(private http      : HttpClient,
              private session   : SessionHandlerService,
              private global    : GlobalFunctionsService) {

  }

  public generatePayload(requestType  : any, 
                          userID      : any, 
                          password    : any, 
                          deviceID    : any, 
                          dsName      : any, 
                          isADLDS     : any, 
                          sessionID   : any,
                          appName     : any,
                          data        : any) : string {

    var payload = {
      Request: {
        "SessionID"         : sessionID,
        "Status"            : "",
        "RequestType"       : requestType,
        "ResponseType"      : "",
        "LoggedInUserName"  : userID,
        "PW"                : password,
        "PCName"            : deviceID,
        "DSName"            : dsName,
        "AppName"           : appName,
        "isADLDS"           : isADLDS,
        "Data"              : data
      }
    };    

    if (appName) {
        if (this.global.getCookie(appName + "SessionID") != "") {
            payload.Request.SessionID = this.global.getCookie(appName + "SessionID");
        }
        else {
            // set session to AppName + Number of milliseconds since 1970
            payload.Request.SessionID = appName + new Date().getTime();
        }
    }

    if (this.global.getCookie(appName + "SessionTimeout") == "") {
      this.global.setCookie("UserID", this.global.getCookie("UserID"), 15);
      this.global.setCookie("LastNameFirstName", this.global.getCookie("LastNameFirstName"), 15);
      this.global.setCookie("PW", this.global.getCookie("PW"), 15);
      if (appName != "") {
          this.global.setCookie(appName + "SessionID", payload.Request.SessionID, 15);
      }
    }
    else {
        this.global.setCookie("UserID", this.global.getCookie("UserID"), this.global.getCookie(appName + "SessionTimeout"));
        this.global.setCookie("LastNameFirstName", this.global.getCookie("LastNameFirstName"), this.global.getCookie(appName + "SessionTimeout"));
        this.global.setCookie("PW", this.global.getCookie("PW"), this.global.getCookie(appName + "SessionTimeout"));
        if (appName != "") {
            this.global.setCookie(appName + "SessionID", payload.Request.SessionID, this.global.getCookie(appName + "SessionTimeout"));
        }
    }

    console.log(payload);

    return JSON.stringify(JSON.stringify(payload));
  }


  public get(endPoint: string, reqPaylaod: any) {

    return new Promise((resolve, reject) => {

      let queryStringParameters = '';
      if (reqPaylaod != '') {
        let counter = 1
        Object.keys(reqPaylaod).forEach(function (k) {
          if (counter === 1) {
            queryStringParameters = `${queryStringParameters}?${k}=${reqPaylaod[k]}`;
            counter = 2;
          } else {
            queryStringParameters = `${queryStringParameters}&${k}=${reqPaylaod[k]}`;
          }

        });
      }

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '
        })
      };

      this.http.get<any>(`${environment.apiUrl}${endPoint}${queryStringParameters}`, httpOptions)
        .subscribe({
          next: data => {
            resolve(data);
          },
          error: error => {
            resolve(error);
          }
        });

    });
  }

  public post(endPoint: string, reqPaylaod: any): any {
    return new Promise(async (resolve, reject) => {

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer `
      });
      let response = await this.http.post(`${environment.apiUrl}${endPoint}`, reqPaylaod, { headers: headers });

      response.subscribe((data) => {
        if (data) {
          resolve(data);
        }
      });

    });
  }

  public create(reqPaylaod: any, endPoint: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Basic '
      })
    };
    return this.http.post<any>(`${environment.apiUrl}${endPoint}`, reqPaylaod, httpOptions);
  }

  public update(reqPaylaod: any, endPoint: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Basic '
      })
    };
    return this.http.put<any>(`${environment.apiUrl}${endPoint}`, reqPaylaod, httpOptions);
  }

  public delete(reqPaylaod: any, endPoint: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Basic '
      })
    };
    return this.http.delete<any>(`${environment.apiUrl}${endPoint}${reqPaylaod}`, httpOptions);
  }
}
