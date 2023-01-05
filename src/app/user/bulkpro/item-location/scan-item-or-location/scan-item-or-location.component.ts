import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ApiHandlerService } from 'src/app/services/apiHandler/api-handler.service';
import { SessionHandlerService } from 'src/app/services/sessionHandler/session-handler.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-scan-item-or-location',
  templateUrl: './scan-item-or-location.component.html',
  styleUrls: ['./scan-item-or-location.component.scss']
})
export class ScanItemOrLocationComponent implements OnInit {

  itemNumber : string = "";

  @Output() msg : EventEmitter<any> = new EventEmitter();
  @Output() code : EventEmitter<any> = new EventEmitter();

  constructor(private router     : Router,
              private session    : SessionHandlerService,
              private api        : ApiHandlerService) { }

  ngOnInit(): void {
    this.session.updateSession();
  }

  scanItem(event : KeyboardEvent) {
    if (event.key === 'Enter') {
      this.scanItemLoc();
    }
  }

  async scanItemLoc() {
    try {

      if (!this.itemNumber) {
        this.msg.emit({
          msg  : "Please enter/scan valid Item or Location",
          icon : "notification_important",
          type : "danger"
        });
        return;
      }

      var get = undefined;
      const res = JSON.parse(await this.api.post(environment.itemLoc, 
                                          this.api.generatePayload("INVBYITEMORLOC",
                                          this.session.UserID(get),
                                          this.session.Password(get),
                                          this.session.DeviceID(get),
                                          this.session.DSName(get),
                                          this.session.IsADLDS(get),
                                          `BulkPro${new Date().getTime()}`, 
                                          "BulkPro", 
                                          this.itemNumber)
                  ));
      const { Data, ResponseType, ResponseSubType } = res.Response;

      if (ResponseType == "OK") {
        this.code.emit({ 
          itemNumber : this.itemNumber, 
          Data,
          ResponseSubType
        }); 
      } else {
        this.msg.emit({
          msg  : Data,
          icon : "notification_important",
          type : "danger"
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  exit() {
    this.router.navigate(['/dashboard/BulkPro']);
  }

}
