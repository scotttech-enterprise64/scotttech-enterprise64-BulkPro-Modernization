import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  }

  changeStep(showStep : number) {
    if (showStep == 1) {
      this.step1 = true;
    } else {
      this.step2 = false;
      this.step3 = false;
      this.step4 = false;
    }
  }

}
