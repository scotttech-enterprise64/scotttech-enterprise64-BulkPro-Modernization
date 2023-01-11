import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SessionHandlerService } from 'src/app/services/sessionHandler/session-handler.service';
import { ApiHandlerService } from 'src/app/services/apiHandler/api-handler.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-scan-ord-bat-tot',
  templateUrl: './scan-ord-bat-tot.component.html',
  styleUrls: ['./scan-ord-bat-tot.component.scss']
})
export class ScanOrdBatTotComponent implements OnInit {

  displayedColumns : string[] = ['ToteID', 'NumTrans', 'OrderNumber'];
  orderList = new MatTableDataSource();

  orderNum : string = "";

  @Input() zone : string = "";
  
  @Output() msg : EventEmitter<any> = new EventEmitter();
  @Output() next : EventEmitter<any> = new EventEmitter();
  // @Output() code : EventEmitter<any> = new EventEmitter();

  constructor(private _liveAnnouncer    : LiveAnnouncer, 
              private dialog            : MatDialog,
              private router            : Router,
              private session           : SessionHandlerService,
              private api               : ApiHandlerService) {}

  @ViewChild(MatSort) sort: MatSort = new MatSort;

  ngOnInit(): void {
    this.session.updateSession();
    this.updateOrdersTable();
  }

  scanOrder(event : KeyboardEvent) {
    if (event.key === 'Enter') {
      this.assignOrder();
    }
  }

  async assignOrder() {
    try {
      var get = undefined;
      const res = JSON.parse(
                    await this.api.post(environment.pick, 
                                        this.api.generatePayload("ASSIGN",
                                              this.session.UserID(get),
                                              this.session.Password(get),
                                              this.session.DeviceID(get),
                                              this.session.DSName(get),
                                              this.session.IsADLDS(get),
                                              `BulkPro${new Date().getTime()}`, 
                                              "BulkPro",
                                              {
                                                ScanValue: this.orderNum,
                                                UserName: this.session.UserID(get),
                                                Zone: this.zone
                                              }))
                  );
      const { Data, ResponseType, Status } = res.Response;

      if (ResponseType == "OK") {
        this.updateOrdersTable();
        this.msg.emit({
          msg : "Orders were assigned.",
          icon : "notification_important",
          type : "success"
        });
      } 
      // else if(ResponseType == "NO") {
      //   this.msg.emit({
      //     msg : "No matching orders were found for the user.",
      //     icon : "notification_important",
      //     type : "danger"
      //   });
      // } 
      else {
        this.msg.emit({
          msg : Data,
          icon : "notification_important",
          type : "danger"
        });
      }

      this.orderNum = "";
    } catch (error) {
      console.log(error);
    }
  }

  async updateOrdersTable() {
    try {
      var get = undefined;
      const res = JSON.parse(
                    await this.api.post(environment.pick, 
                                        this.api.generatePayload("ASSIGNEDLIST",
                                              this.session.UserID(get),
                                              this.session.Password(get),
                                              this.session.DeviceID(get),
                                              this.session.DSName(get),
                                              this.session.IsADLDS(get),
                                              `BulkPro${new Date().getTime()}`, 
                                              "BulkPro", 
                                              {
                                                UserName: this.session.UserID(get),
                                                Zone: this.zone
                                              }))
                  );
      const { Data, ResponseType, Status } = res.Response;

      if ((ResponseType == "OK") || (ResponseType == "MAX")) {
        this.orderList = new MatTableDataSource(Data);
      } else {
        this.orderList = new MatTableDataSource();
        this.msg.emit({
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
    this.orderList.sort = this.sort;
  }

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
        this.msg.emit({
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

  processPick() {
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

  exit() {
    this.router.navigate(['/dashboard/BulkPro']);
  }

}
