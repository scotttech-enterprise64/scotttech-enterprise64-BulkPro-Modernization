import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BatchCompletedComponent } from 'src/app/dialogs/batch-completed/batch-completed.component';
import { MatDialog } from '@angular/material/dialog';

export interface IPickData {
  tr: string;
  order: number;
}
const PickData: IPickData[] = [
  {tr: 'Hydrogen', order: 1.0079 },
  {tr: 'Helium', order: 4.0026 },
  {tr: 'Lithium', order: 6.941 },
  {tr: 'Beryllium', order: 9.0122 },
  {tr: 'Boron', order: 10.811 },
  {tr: 'Carbon', order: 12.0107 },
  {tr: 'Nitrogen', order: 14.0067 },
  {tr: 'Oxygen', order: 15.9994 },
  {tr: 'Fluorine', order: 18.9984 },
  {tr: 'Neon', order: 20.1797 },
];

@Component({
  selector: 'app-design-cycle-count',
  templateUrl: './cycle-count.component.html',
  styleUrls: ['./cycle-count.component.scss']
})
export class DesignCycleCountComponent implements OnInit {

  displayedColumns  : string[] = ['tr', 'order'];
  dataSource        = new MatTableDataSource(PickData);
  code              : string = "";

  constructor(private _liveAnnouncer: LiveAnnouncer, private dialog: MatDialog) { }

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

  @ViewChild(MatSort) sort: MatSort = new MatSort;

  ngOnInit(): void {
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


}
