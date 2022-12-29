import { Component, OnInit, ViewChild, HostListener, Output, EventEmitter } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { BatchCompletedComponent } from 'src/app/dialogs/batch-completed/batch-completed.component';
import { Router } from '@angular/router';
import { ApiHandlerService } from 'src/app/services/apiHandler/api-handler.service';
import { GlobalFunctionsService } from 'src/app/services/globalFunctions/global-functions.service';
import { SessionHandlerService } from 'src/app/services/sessionHandler/session-handler.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-scan-order',
  templateUrl: './scan-order.component.html',
  styleUrls: ['./scan-order.component.scss']
})
export class ScanOrderComponent implements OnInit {

  displayedColumns  : string[] = ['OrderNumber', 'NumTrans'];
  orderList        = new MatTableDataSource();
  code              : string = "";
  lastCodeScan      : string = "";

  @ViewChild(MatSort) sort: MatSort = new MatSort;

  @Output() msg: EventEmitter<any> = new EventEmitter();
  @Output() next: EventEmitter<any> = new EventEmitter();

  constructor(private _liveAnnouncer  : LiveAnnouncer, 
              private dialog          : MatDialog,
              private router          : Router,
              private api             : ApiHandlerService,
              private global          : GlobalFunctionsService,
              private session         : SessionHandlerService) { }

  /* Scanner Start */
  @HostListener('window:keypress', ['$event'])
  keyEvent(event: KeyboardEvent): void {
    // if(event.key != 'Enter'){
    //   this.code += event.key;
    // }
    
    if (event.key === 'Enter') {
      // The QR/Bar code is ready here
      // Do something here with the scanned code
      if (this.code) {     
        this.lastCodeScan = this.code;   
        this.assignOrder();
        this.code = "";
      }      
    } else {
      this.code += event.key;
    }

    event.preventDefault();
  }
  /* Scanner End */  

  ngOnInit(): void {
    this.session.updateSession();
    this.updateOrdersTable();
  }

  async assignOrder() {
    try {
      var get = undefined;
      const res = JSON.parse(
                    await this.api.post(environment.count, 
                                        this.api.generatePayload("ASSIGN",
                                              this.session.UserID(get),
                                              this.session.Password(get),
                                              this.session.DeviceID(get),
                                              this.session.DSName(get),
                                              this.session.IsADLDS(get),
                                              `BulkPro${new Date().getTime()}`, 
                                              "BulkPro", 
                                              {
                                                ScanValue: this.code,
                                                UserName: this.session.UserID(get)
                                              }))
                  );
      const { Data, ResponseType, Status } = res.Response;

      if (ResponseType == "OK" && Status == "OK") {
        this.updateOrdersTable();
      } 
      else if(ResponseType == "NO") {
        this.msg.emit({
          msg : "No matching orders were found for the user.",
          icon : "notification_important",
          type : "danger"
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async updateOrdersTable() {
    try {
      var get = undefined;
      const res = JSON.parse(
                    await this.api.post(environment.count, 
                                        this.api.generatePayload("ASSIGNEDLIST",
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
        this.orderList = new MatTableDataSource(Data);
      } else {
        // this.msg.emit({
        //   msg : "Assigned orders were not found.",
        //   icon : "notification_important",
        //   type : "danger"
        // });
      }
    } catch (error) {
      console.log(error);
    }
  }

  ngAfterViewInit() {
    this.orderList.sort = this.sort;
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

  openAlertDialog() {
    const dialogRef = this.dialog.open(BatchCompletedComponent,{
      data:{
        message: 'HelloWorld',
        buttonText: {
          cancel: 'Done'
        }
      },
    });
  }

  processCount() {
    if (this.orderList.data.length > 0) {
      this.next.emit(this.orderList); 
    } else {
      this.msg.emit({
        msg : "Order was not found.",
        icon : "notification_important",
        type : "danger"
      });
    }
  }

  async deleteLast() {
    try {
      if (this.lastCodeScan) {
        var get = undefined;
        const res = JSON.parse(
                      await this.api.post(environment.count, 
                                          this.api.generatePayload("UNASSIGN",
                                                this.session.UserID(get),
                                                this.session.Password(get),
                                                this.session.DeviceID(get),
                                                this.session.DSName(get),
                                                this.session.IsADLDS(get),
                                                `BulkPro${new Date().getTime()}`, 
                                                "BulkPro", 
                                                {
                                                  ScanValue: this.lastCodeScan,
                                                  UserName: this.session.UserID(get)
                                                }))
                    );
        const { Data, ResponseType, Status } = res.Response;
  
        if (ResponseType == "OK" && Status == "OK") {
          this.updateOrdersTable();
        } 
        else if(ResponseType == "NO") {
          this.msg.emit({
            msg : "Last order was not found.",
            icon : "notification_important",
            type : "danger"
          });
        } 
      } else {
        this.msg.emit({
          msg : "Last order was not found.",
          icon : "notification_important",
          type : "danger"
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  exit() {
    this.router.navigate(['/dashboard']);
  }

}
