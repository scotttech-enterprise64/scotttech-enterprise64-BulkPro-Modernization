import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavSideBarObserverService {

  // updated           : boolean = false;
  updates           : any;
  updateObserver    : Subject<boolean> = new Subject<boolean>(); // observing that bool


  constructor() { }

  sendUpdate(value : any)
  {    
    this.updates = value;
    this.updateObserver.next(true);
  }
}
