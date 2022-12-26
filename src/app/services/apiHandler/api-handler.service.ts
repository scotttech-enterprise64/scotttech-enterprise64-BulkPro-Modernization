import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SessionHandlerService } from '../sessionHandler/session-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ApiHandlerService {

  constructor(private http : HttpClient, 
              private user : SessionHandlerService) { }

  public get(endPoint: string, reqPaylaod: any) {

    return new Promise((resolve, reject) => {

      let queryStringParameters='';
      if(reqPaylaod != '')
      {
        let counter = 1
        Object.keys(reqPaylaod).forEach(function(k){
          if (counter === 1) {
            queryStringParameters = `${queryStringParameters}?${k}=${reqPaylaod[k]}`;
            counter = 2;
          } else {
            queryStringParameters=  `${queryStringParameters}&${k}=${reqPaylaod[k]}`;
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

  public post(endPoint: string, reqPaylaod: any) : any 
  {
    return new Promise(async (resolve, reject) => {
      
      const headers = new HttpHeaders({
        'Content-Type'      : 'application/json',
        'Authorization'     : `Bearer `
      });
      let response = await this.http.post(`${environment.apiUrl}${endPoint}`, reqPaylaod, { headers: headers });

      response.subscribe((data) => {
        if(data) {
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
