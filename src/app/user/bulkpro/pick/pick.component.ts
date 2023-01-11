import { Component, OnInit, ViewChild } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SessionHandlerService } from 'src/app/services/sessionHandler/session-handler.service';
import { ApiHandlerService } from 'src/app/services/apiHandler/api-handler.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pick',
  templateUrl: './pick.component.html',
  styleUrls: ['./pick.component.scss']
})
export class PickComponent implements OnInit {

  step1 : boolean = true;
  step2 : boolean = false;
  step3 : boolean = false;
  step4 : boolean = false;
  step5 : boolean = false;

  msgText : string = "";
  msgIcon : string = "";
  msgType : string = "";

  dataCusWin : any = {
    visible : false
  };

  zone : string = "";

  displayedColumns : string[] = ['tote', 'tr', 'order'];
  dataSource = new MatTableDataSource();


  constructor(private _liveAnnouncer    : LiveAnnouncer, 
              private dialog            : MatDialog,
              private router            : Router,
              private session           : SessionHandlerService,
              private api               : ApiHandlerService) {}

  @ViewChild(MatSort) sort: MatSort = new MatSort;

  ngOnInit(): void {
    this.checkAssigned();
  }

  // Checks if user has any assigned orders to count.
  async checkAssigned() {
    try {
      var get=undefined;
      const res = JSON.parse(
                    await this.api.post(environment.pick, 
                                        this.api.generatePayload("ANYASSIGNED",
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
                                              }))
                  );
      const { Data, ResponseType, Status } = res.Response;

      if (ResponseType == "YES") {
        
        let text = this.zone 
          ? "You have Pick transactions assigned to you in zone " + this.zone + ". Select to either unassign or pick it." 
          : "You have Pick transactions assigned to you. Select to either unassign or pick it.";

        var data = {
          icon : "help",
          text : text,
          cancelBtnText : "Exit",
          okBtnText : "Unassign Transactions",
          actionBtnText : "Pick Transactions",
          visible : true, 
          type : 1
        }

        this.customWindow(data);
        this.changeStep();
      } else {
        this.showMsg({ 
          msg : Data,
          icon : "notification_important",
          type : "danger"
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  // Used to show screens with in the steps
  customWindow(instructions : any = { visible : false }) {
    this.dataCusWin = instructions;
  }

  // Triggers on ok button click in custom window
  cancelClicked(type : number) {
    if (type == 1) 
    {
      this.router.navigate(['/dashboard/BulkPro']);
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
    else if(type == 4 || type == 5) 
    {
      this.customWindow();
      this.changeStep(3);
    }
  }

  // Triggers on ok button click in custom window
  okClicked(type : number) {
    if (type == 1) 
    {
      this.unAssignPicks();
    } 
    else if(type == 2) 
    {
      //this.skipTransaction();      
    }
    else if(type == 3) 
    {
      this.router.navigate(['/dashboard/BulkPro']);
    }
    else if(type == 5) {
      // this.completeCount({ count : this.count});
    }
  }

  // Triggers on extra button click in custom window
  actionClicked(type : number) {
    if (type == 1) {
      this.customWindow();
      this.changeStep(2);
    } else if (type == 2) {
      
    }
  }

  // Navigate between components
  changeStep(showStep : number = 0) {
    if (showStep == 0) 
    {
      this.step1 = false;
      this.step2 = false;
      this.step3 = false;
      this.step4 = false;
      this.step5 = false;
    }
    else if (showStep == 1) 
    {
      this.step1 = true;
      this.step2 = false;
      this.step3 = false;
      this.step4 = false;
      this.step5 = false;
    }
    else if (showStep == 2) 
    {
      this.step1 = false;
      this.step2 = true;
      this.step3 = false;
      this.step4 = false;
      this.step5 = false;
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
    }, 3000);
  }

  // Checking if something has dynamic visibility controlled for DB
  async checkPARAMS(value : any) {
    try {
      var get = undefined;
      const res = JSON.parse(
                    await this.api.post(environment.pick, 
                                        this.api.generatePayload("GETPARAM",
                                              this.session.UserID(get),
                                              this.session.Password(get),
                                              this.session.DeviceID(get),
                                              this.session.DSName(get),
                                              this.session.IsADLDS(get),
                                              `BulkPro${new Date().getTime()}`, 
                                              "BulkPro",
                                              value))
                  );
      const { Data, ResponseType, Status } = res.Response;

      if (ResponseType == "YES") {
        return Data ? parseInt(Data) : 0;
      } else {
        this.showMsg({
          msg : Data,
          icon : "notification_important",
          type : "danger"
        });
        return -1;
      }
      
    } catch (error) {
      console.log(error);
      return -1;
    }
  }

  async unAssignPicks() {
    try {
      var get=undefined;
      const res = JSON.parse(await this.api.post(environment.pick, 
                                      this.api.generatePayload("UNASSIGNALL",
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
        this.showMsg({ 
          msg : "Assigned orders were unassigned.",
          icon : "notification_important",
          type : "success"
        });
        this.changeStep(1); this.customWindow();
      } 
      else if (ResponseType == "NO") {
        this.showMsg({ 
          msg : "No assigned orders were found.",
          icon : "notification_important",
          type : "danger"
        });
      }
      else {
        this.showMsg({ 
          msg : Data,
          icon : "notification_important",
          type : "danger"
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

}
