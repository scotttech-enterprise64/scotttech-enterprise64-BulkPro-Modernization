import { Component, OnInit, Input,HostListener } from '@angular/core';

@Component({
  selector: 'app-scan-location',
  templateUrl: './scan-location.component.html',
  styleUrls: ['./scan-location.component.scss']
})
export class ScanLocationComponent implements OnInit {

  @Input() data : any;

  code              : string = "";

  constructor() { }

  ngOnInit(): void {
  }

  /* Scanner Start */
  @HostListener('window:keypress', ['$event'])
  keyEvent(event: KeyboardEvent): void {
    if(event.key != 'Enter'){
      this.code += event.key;
    }
    event.preventDefault();
    // if (event.key === 'Enter') {
    //   // The QR/Bar code is ready here
    //   // Do something here with the scanned code
    //   this.code = event.key // JSON.stringify(event.key);
    //   // alert(event.key);
    // } else {
    //   this.code += event.key;
    // }
  }
  /* Scanner End */  

}
