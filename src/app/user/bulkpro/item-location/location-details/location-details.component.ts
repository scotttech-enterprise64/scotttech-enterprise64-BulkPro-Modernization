import { Input, Output, Component, OnInit, ViewChild, EventEmitter, SimpleChanges } from '@angular/core';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { BatchCompletedComponent } from 'src/app/dialogs/batch-completed/batch-completed.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-location-details',
  templateUrl: './location-details.component.html',
  styleUrls: ['./location-details.component.scss']
})
export class LocationDetailsComponent implements OnInit {

  displayedColumns: string[] = ['', 'ItemQuantity', 'QuantityAllocatedPick'];
  
  @Input() dataSource = new MatTableDataSource();
  @Input() itemNumber : any;
  @Input() check : any;

  @ViewChild(MatSort) sort: MatSort = new MatSort;  

  @Output() checkAgain : EventEmitter<any> = new EventEmitter();

  constructor(private router            : Router,
              private _liveAnnouncer    : LiveAnnouncer) {}

  ngOnInit(): void {
    if (this.check) {
      this.displayedColumns[0] = 'LocationDisplay';
    } else {
      this.displayedColumns[0] = 'ItemNumber';
    }
  }  

  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes);
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

  checkNext() {
    this.checkAgain.emit(true);
  }

  exit() {
    this.router.navigate(['/dashboard/BulkPro']);
  }

}
