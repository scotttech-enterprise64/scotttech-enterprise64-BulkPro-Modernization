import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ApiHandlerService } from 'src/app/services/apiHandler/api-handler.service';
import { GlobalFunctionsService } from 'src/app/services/globalFunctions/global-functions.service';
import { SessionHandlerService } from 'src/app/services/sessionHandler/session-handler.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-custom-msg-window',
  templateUrl: './custom-msg-window.component.html',
  styleUrls: ['./custom-msg-window.component.scss']
})
export class CustomMsgWindowComponent implements OnInit {

  @Input() cancelBtnText : string = "";
  @Input() okBtnText : string = "";
  @Input() unAssignTransBtnText : string = "";
  
  @Input() icon : any;
  @Input() text : string = "";
  @Input() list : any = [];

  @Input() type : number = 0;

  @Output() unAssigned: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() ok: EventEmitter<any> = new EventEmitter();

  constructor(private router: Router,
              private api : ApiHandlerService,
              private global: GlobalFunctionsService,
              private session: SessionHandlerService) { }

  ngOnInit(): void {
    this.session.updateSession();
  }

  async unAssignTransactions() {
    try {
      var get=undefined;
      const res = JSON.parse(
                    await this.api.post(environment.getDeviceInfo, 
                                        this.api.generatePayload("UNASSIGNALL",
                                              this.session.UserID(get),
                                              this.session.Password(get),
                                              this.session.DeviceID(get),
                                              this.session.DSName(get),
                                              this.session.IsADLDS(get),
                                              `BulkPro${new Date().getTime()}`, 
                                              "BulkPro", this.session.UserID(get)))
                  );
      const { Data, ResponseType, Status } = res.Response;

      if (ResponseType == "OK" && Status == "OK") {
        this.unAssigned.emit(true);
      } else {
        this.unAssigned.emit(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  cancelClicked() {
    this.cancel.emit(this.type);
  }

  okClicked() {
    this.ok.emit(this.type);
  }

}
