import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SessionHandlerService } from 'src/app/services/sessionHandler/session-handler.service';

@Component({
  selector: 'app-pick-cus-win',
  templateUrl: './pick-cus-win.component.html',
  styleUrls: ['./pick-cus-win.component.scss']
})
export class PickCusWinComponent implements OnInit {

  @Input() cancelBtnText : string = "";
  @Input() okBtnText : string = "";
  @Input() actionBtnText : string = "";
  
  @Input() icon : any;
  @Input() text : string = "";
  @Input() list : any = [];

  @Input() type : number = 0;

  @Output() action: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() ok: EventEmitter<any> = new EventEmitter();

  constructor(private session: SessionHandlerService) { }

  ngOnInit(): void {
    this.session.updateSession();
  }

  cancelClicked() {
    this.cancel.emit(this.type);
  }

  okClicked() {
    this.ok.emit(this.type);
  }

  actionClicked() {
    this.action.emit(this.type);
  }

}
