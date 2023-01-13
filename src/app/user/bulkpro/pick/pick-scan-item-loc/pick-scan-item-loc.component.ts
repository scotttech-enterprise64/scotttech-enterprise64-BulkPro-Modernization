import { Component, OnInit, ViewChild, HostListener, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ApiHandlerService } from 'src/app/services/apiHandler/api-handler.service';
import { SessionHandlerService } from 'src/app/services/sessionHandler/session-handler.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pick-scan-item-loc',
  templateUrl: './pick-scan-item-loc.component.html',
  styleUrls: ['./pick-scan-item-loc.component.scss']
})
export class PickScanItemLocComponent implements OnInit {

  orderDetails : any = [];

  @Input() zone : string = "";

  @Output() msg: EventEmitter<any> = new EventEmitter();
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() skip: EventEmitter<any> = new EventEmitter();
  @Output() exit: EventEmitter<any> = new EventEmitter();

  location       : boolean = true;
  codeLocation   : string = "";

  item       : boolean = false;
  codeItem   : string = "";

  tote       : boolean = false;
  codeTote   : string = "";

  descriptionLength : number = 35;

  constructor(private api             : ApiHandlerService,
              private session         : SessionHandlerService,
              private route           : Router) { }

  ngOnInit(): void {
    this.nextPick();
  }

  scanItemLoc(event : KeyboardEvent) {

    if (this.tote) {
      if (event.key === 'Enter') {
        if( (`${this.orderDetails.ToteID.toString().toLowerCase()}${this.orderDetails.ToteNumber.toString().toLowerCase()}`) == this.codeTote.toLowerCase() ) {
          this.next.emit(this.orderDetails);
        } else {
          this.msg.emit({
            msg : "Tote scan verify failed. Please scan valid item.",
            icon : "notification_important",
            type : "danger"
          });
        }
        this.codeTote = "";
      }
    }
    
    if (this.item) {
      if (event.key === 'Enter') {
        if(this.orderDetails.ItemNumber.toLowerCase() == this.codeItem.toLowerCase()) {
          this.item = false;
          this.tote = true;
        } else {
          this.msg.emit({
            msg : "Item scan verify failed. Please scan valid item.",
            icon : "notification_important",
            type : "danger"
          });
        }
        this.codeItem = "";
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
      }
    }  

  }

  async nextPick() {
    try {
      var get = undefined;
      const res = JSON.parse(
                    await this.api.post(environment.pick, 
                                        this.api.generatePayload("NEXTPICK",
                                              this.session.UserID(get),
                                              this.session.Password(get),
                                              this.session.DeviceID(get),
                                              this.session.DSName(get),
                                              this.session.IsADLDS(get),
                                              `BulkPro${new Date().getTime()}`, 
                                              "BulkPro", 
                                              {
                                                Zone : this.zone,
                                                UserName : this.session.UserID(get)
                                              })));

      const { Data, ResponseType, Status } = res.Response;

      if (ResponseType == "OK") {
        if (Data) {
          // console.log(Data);
          Data.Description = Data.Description.substring(0, this.descriptionLength);
          this.orderDetails = Data; 
        } else {
          this.route.navigate(['/dashboard/BulkPro']);
        }
      } 
      else {
        this.route.navigate(['/dashboard/BulkPro']);
      }
    } catch (error) {
      console.log(error)
    }
  }

  skipTransaction() {
    var data = {
      icon : "help",
      text : "Are you sure you want to skip this transaction?",
      cancelBtnText : "No",
      okBtnText : "Yes",
      visible : true,
      type : 2,
      order : this.orderDetails
    }
    this.skip.emit(data);
  }

  exitClick() {
    this.exit.emit(this.orderDetails);
  }

}
