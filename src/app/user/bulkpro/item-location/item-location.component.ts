import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-location',
  templateUrl: './item-location.component.html',
  styleUrls: ['./item-location.component.scss']
})
export class ItemLocationComponent implements OnInit {

  step1 : boolean = true;
  step2 : boolean = false;

  msgText : string = "";
  msgIcon : string = "";
  msgType : string = "";

  itemNumber : string = "";
  locList : any = [];

  constructor() { }

  ngOnInit(): void {
  }

  // Navigate between components
  changeStep(showStep : number = 0) {
    if (showStep == 0) 
    {
      this.step1 = false;
      this.step2 = false;
    }
    else if (showStep == 1) 
    {
      this.step1 = true;
      this.step2 = false;
    } 
    else if (showStep == 2) 
    {
      this.step1 = false;
      this.step2 = true;
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

  updateList(data : any) {
    console.log(data);
    // this.itemNumber = data.itemNumber;
    // this.locList = data.Data;
    // this.changeStep(2);
  }
}
