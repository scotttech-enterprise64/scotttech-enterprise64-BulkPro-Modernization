import { Component, OnInit, ViewChild, HostListener, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ApiHandlerService } from 'src/app/services/apiHandler/api-handler.service';
import { GlobalFunctionsService } from 'src/app/services/globalFunctions/global-functions.service';
import { SessionHandlerService } from 'src/app/services/sessionHandler/session-handler.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-set-count',
  templateUrl: './set-count.component.html',
  styleUrls: ['./set-count.component.scss']
})
export class SetCountComponent implements OnInit {

  @Input() orderDetails : any;
  // orderDetails : any = [];

  @Output() msg: EventEmitter<any> = new EventEmitter();
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() skip: EventEmitter<any> = new EventEmitter();
  @Output() exit: EventEmitter<any> = new EventEmitter();
  @Output() userFields: EventEmitter<any> = new EventEmitter();

  count : number = 0;

  constructor(private router: Router,
              private api : ApiHandlerService,
              private global: GlobalFunctionsService,
              private session: SessionHandlerService) { }

  ngOnInit(): void {
  }

  /* Scanner Start */
  @HostListener('window:keypress', ['$event'])
  keyEvent(event: KeyboardEvent): void {

    // The QR/Bar code is ready here
    // Do something here with the scanned code
    if (event.key === 'Enter') {

    }
    event.preventDefault();
  }
  /* Scanner End */

  submit() {
    if (this.orderDetails.TransactionQuantity != this.count) {
      this.next.emit();
    }
  }

  getUserFields() {
    this.userFields.emit(this.orderDetails);
  }

  skipTransaction() {
    this.skip.emit(this.orderDetails);
  }

  exitClick() {
    this.exit.emit(this.orderDetails);
  }

}
