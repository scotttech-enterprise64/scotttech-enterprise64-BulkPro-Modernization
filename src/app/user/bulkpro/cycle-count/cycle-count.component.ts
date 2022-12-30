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

  order : any;

  constructor(private router: Router,
              private api : ApiHandlerService,
              private global: GlobalFunctionsService,
              private session: SessionHandlerService) { }

  ngOnInit(): void {
    this.session.updateSession();
    this.checkAssigned();
  }

  // Checks if user has any assigned orders to count.
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

  // Used to show screens with in the steps
  customWindow(instructions : any = { visible : false }) {
    this.dataCusWin = instructions;
  }

  // Navigate between components
  changeStep(showStep : number = 0) {
    if (showStep == 0) 
    {
      this.step1 = false;
      this.step2 = false;
      this.step3 = false;
    }
    else if (showStep == 1) 
    {
      this.step1 = true;
      this.step2 = false;
      this.step3 = false;
    } 
    else if (showStep == 2) 
    {
      this.step1 = false;
      this.step2 = true;
      this.step3 = false;
    }
    else if (showStep == 3) 
    {
      this.step1 = false;
      this.step2 = false;
      this.step3 = true;
    }
  }

  // Dynamic Alert Box
  alertMsg(msg : string = "", icon : string = "", type : string = "") {
    this.msgText = msg;
    this.msgIcon = icon;
    this.msgType = type;
  }

  // Shows Alert msgs with in specified timeout
  showMsg(data : any) {
    this.alertMsg(data.msg, data.icon, data.type);
    setTimeout(() => {
      this.alertMsg("");
    }, 2000);
  }

  unAssignedCompleted(res : any) {
    if (res.type == 1 && res.res) {
      this.customWindow();
      this.changeStep(1);
    } else if (res.type == 3 && res.res) {
      this.router.navigate(['/dashboard']);
    } 
    else {
      this.alertMsg("No assigned orders were found.", "notification_important", "danger");
      setTimeout(() => {
        this.alertMsg("");
      }, 2000);
    }
  }

  // Triggers on ok button click in custom window
  cancelClicked(type : number) {
    if (type == 1) 
    {
      this.router.navigate(['/dashboard']);
    } 
    else if(type == 2)
    {
      sessionStorage.removeItem("order");
      this.customWindow();
      this.changeStep(2);
    }
    else if(type == 3) 
    {
      this.customWindow();
      this.changeStep(2);
    }
    else if(type == 4) 
    {
      this.customWindow();
      this.changeStep(3);
    }
  }

  // Triggers on ok button click in custom window
  okClicked(type : number) {
    if (type == 1) 
    {
      this.customWindow();
      this.changeStep(2);
    } 
    else if(type == 2) 
    {
      this.skipTransaction();      
    }
    else if(type == 3) 
    {
      this.router.navigate(['/dashboard']);
    }
  }

  // Triggers when user clicks on Skip Transaction in Verify Location or Item
  skip(order : any) {
    sessionStorage.setItem("order", JSON.stringify(order));
    var data = {
      icon : "help",
      text : "Are you sure you want to skip this transaction?",
      cancelBtnText : "No",
      okBtnText : "Yes",
      visible : true,
      type : 2
    }
    this.customWindow(data);
    this.changeStep();
  }

  exit(order : any) {
    var data = {
      icon : "help",
      text : "These are uncompleted assigned transactions. Select one of the following options.",
      cancelBtnText : "Cancel",
      okBtnText : "Exit but Keep Assignments",
      unAssignTransBtnText : "Unassign and Exit",
      visible : true,
      type : 3
    }
    this.customWindow(data);
    this.changeStep();
  }

  async skipTransaction() {
    try {
      let order = JSON.parse(sessionStorage.getItem("order") || "{}");
      var get=undefined;
      const res = JSON.parse(
                    await this.api.post(environment.count, 
                                        this.api.generatePayload("SKIP",
                                              this.session.UserID(get),
                                              this.session.Password(get),
                                              this.session.DeviceID(get),
                                              this.session.DSName(get),
                                              this.session.IsADLDS(get),
                                              `BulkPro${new Date().getTime()}`, 
                                              "BulkPro",
                                              order.ID ? order.ID : ""))
                  );
      const { Data, ResponseType, Status } = res.Response;

      if (ResponseType == "OK" && Status == "OK") {        
        this.customWindow();
        this.changeStep(2);
      } else {
        this.showMsg({ 
          msg : "Something went wrong.",
          icon : "notification_important",
          type : "danger"
         }
        )
      }
    } catch (error) {
      console.log(error);
    }
  }

  sendDetailsToCount(data : any) {
    this.order = data;
  }

  showUserFields(order : any) {    
    console.log(order)
    var data = {
      icon : "help",
      list : [ order.UserField1, order.UserField2, order.UserField3],
      cancelBtnText : "Close",
      visible : true,
      type : 4
    }
    this.customWindow(data);
    this.changeStep();
  }

}
