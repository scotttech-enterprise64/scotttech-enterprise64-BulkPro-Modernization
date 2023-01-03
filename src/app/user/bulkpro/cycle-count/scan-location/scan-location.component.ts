import { Component, OnInit, ViewChild, HostListener, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ApiHandlerService } from 'src/app/services/apiHandler/api-handler.service';
import { SessionHandlerService } from 'src/app/services/sessionHandler/session-handler.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-scan-location',
  templateUrl: './scan-location.component.html',
  styleUrls: ['./scan-location.component.scss']
})
export class ScanLocationComponent implements OnInit {

  orderDetails : any = [];

  @Output() msg: EventEmitter<any> = new EventEmitter();
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() skip: EventEmitter<any> = new EventEmitter();
  @Output() exit: EventEmitter<any> = new EventEmitter();

  // code   : string = "";

  location : boolean = true;
  codeLocation   : string = "";

  item : boolean = false;
  codeItem   : string = "";

  constructor(private api             : ApiHandlerService,
              private session         : SessionHandlerService,
              private route           : Router) { }

  ngOnInit(): void {
    this.nextPick()
  }

  /* Scanner Start */
  @HostListener('window:keypress', ['$event'])
  keyEvent(event: KeyboardEvent): void {

    // The QR/Bar code is ready here
    // Do something here with the scanned code

    if (this.item) {
      if (event.key === 'Enter') {
        if(this.orderDetails.ItemNumber.toLowerCase() == this.codeItem.toLowerCase()) {
          this.next.emit(this.orderDetails);
        } else {
          this.msg.emit({
            msg : "Item scan verify failed. Please scan valid item.",
            icon : "notification_important",
            type : "danger"
          });
        }
        this.codeItem = "";
      } else {
        this.codeItem += event.key;
      }
    }
    
    if (this.location) {
      if (event.key === 'Enter') {
        if(this.orderDetails.LocationScan.toLowerCase() == this.codeLocation.toLowerCase()) {
          this.location = false;
          this.item = true;
        } else {
          this.msg.emit({
            msg : "Location scan verify failed. Please scan valid location.",
            icon : "notification_important",
            type : "danger"
          });
        }
        this.codeLocation = "";
      } else {
        this.codeLocation += event.key;
      }
    }    

    event.preventDefault();
  }
  /* Scanner End */

  async nextPick() {
    try {
      var get = undefined;
      const res = JSON.parse(
                    await this.api.post(environment.count, 
                                        this.api.generatePayload("NEXTPICK",
                                              this.session.UserID(get),
                                              this.session.Password(get),
                                              this.session.DeviceID(get),
                                              this.session.DSName(get),
                                              this.session.IsADLDS(get),
                                              `BulkPro${new Date().getTime()}`, 
                                              "BulkPro", 
                                              this.session.UserID(get)))
                  );
      const { Data, ResponseType, Status } = res.Response;

      if (ResponseType == "OK" && Status == "OK") {
        // this.updateOrdersTable();
        if (Data) {
          this.orderDetails = Data; 
        } else {
          this.route.navigate(['/dashboard/BulkPro']);
        }
      } 
      // else if(ResponseType == "NO") {
      //   this.msg.emit({
      //     msg : "No order was found for the user.",
      //     icon : "notification_important",
      //     type : "danger"
      //   });
      // } 
      else {
        this.route.navigate(['/dashboard/BulkPro']);
      }
    } catch (error) {
      console.log(error)
    }
  }

  skipTransaction() {
    this.skip.emit(this.orderDetails);
  }

  exitClick() {
    this.exit.emit(this.orderDetails);
  }

}
