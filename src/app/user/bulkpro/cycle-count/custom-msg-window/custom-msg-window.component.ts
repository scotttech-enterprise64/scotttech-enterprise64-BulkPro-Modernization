import { Component, OnInit, Input } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  }

}
