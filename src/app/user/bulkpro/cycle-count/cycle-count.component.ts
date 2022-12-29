import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiHandlerService } from 'src/app/services/apiHandler/api-handler.service';
import { GlobalFunctionsService } from 'src/app/services/globalFunctions/global-functions.service';
import { SessionHandlerService } from 'src/app/services/sessionHandler/session-handler.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cycle-count',
  templateUrl: './cycle-count.component.html',
  styleUrls: ['./cycle-count.component.scss']
})
export class CycleCountComponent implements OnInit {

  step1 : boolean = true;
  step2 : boolean = false;
  step3 : boolean = false;
  step4 : boolean = false;

  dataCusWin : any = {
    visible : false
  };

  msgText : string = "";
  msgIcon : string = "";
  msgType : string = "";

  constructor(private router: Router,
              private api : ApiHandlerService,
              private global: GlobalFunctionsService,
              private session: SessionHandlerService) { }

  ngOnInit(): void {
    this.session.updateSession();
    this.checkAssigned();
  }

  async checkAssigned() {
    try {
      var get=undefined;
      const res = JSON.parse(
                    await this.api.post(environment.count, 
                                        this.api.generatePayload("ANYASSIGNED",
                                              this.session.UserID(get),
                                              this.session.Password(get),
                                              this.session.DeviceID(get),
                                              this.session.DSName(get),
                                              this.session.IsADLDS(get),
                                              `BulkPro${new Date().getTime()}`, 
                                              "BulkPro", this.session.UserID(get)))
                  );
      const { Data, ResponseType, Status } = res.Response;

      if (ResponseType == "YES" && Status == "OK") {
        var data = {
          icon : "help",
          text : "You have cycle count transaction assigned to you. Select the either unassign or count transactions.",
          cancelBtnText : "Cancel",
          okBtnText : "Count Transactions",
          unAssignTransBtnText : "Unassign Transactions",
          visible : true,
          type : 1
        }
        this.customWindow(data);
        this.changeStep();
      }
    } catch (error) {
      console.log(error);
    }
  }

  customWindow(instructions : any = { visible : false }) {
    this.dataCusWin = instructions;
  }

  changeStep(showStep : number = 0) {
    if (showStep == 0) 
    {
      this.step1 = false;
      this.step2 = false;
      this.step3 = false;
      this.step4 = false;
    }
    else if (showStep == 1) 
    {
      this.step1 = true;
      this.step2 = false;
      this.step3 = false;
      this.step4 = false;
    } 
    else if (showStep == 2) 
    {
      this.step1 = false;
      this.step2 = true;
      this.step3 = false;
      this.step4 = false;
    }
    else 
    {
      this.step1 = true;
      this.step2 = false;
      this.step3 = false;
      this.step4 = false;
    }
  }

  alertMsg(msg : string = "", icon : string = "", type : string = "") {
    this.msgText = msg;
    this.msgIcon = icon;
    this.msgType = type;
  }

  showMsg(data : any) {
    this.alertMsg(data.msg, data.icon, data.type);
    setTimeout(() => {
      this.alertMsg("");
    }, 2000);
  }

  unAssignedCompleted(res : any) {
    if (res) {
      this.customWindow();
      this.changeStep(1);
    } else {
      this.alertMsg("No assigned orders were found.", "notification_important", "danger");
      setTimeout(() => {
        this.alertMsg("");
      }, 2000);
    }
  }

  cancelClicked(type : number) {
    if (type == 1) {
      this.router.navigate(['/dashboard']);
    } else {
      
    }
  }
  okClicked(type : number) {}

}
