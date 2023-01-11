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

  constructor(private api             : ApiHandlerService,
              private session         : SessionHandlerService,
              private route           : Router) { }

  ngOnInit(): void {
    this.nextPick();
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
    this.skip.emit(this.orderDetails);
  }

  exitClick() {
    this.exit.emit(this.orderDetails);
  }

}
