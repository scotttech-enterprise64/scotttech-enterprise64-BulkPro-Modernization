import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';


export interface IPickData {
  tote: number;
  tr: string;
  order: number;
}
const PickData: IPickData[] = [
  {tote: 1, tr: 'Hydrogen', order: 1.0079},
  {tote: 2, tr: 'Helium', order: 4.0026},
  {tote: 3, tr: 'Lithium', order: 6.941},
  {tote: 4, tr: 'Beryllium', order: 9.0122},
  {tote: 5, tr: 'Boron', order: 10.811},
  {tote: 6, tr: 'Carbon', order: 12.0107},
  {tote: 7, tr: 'Nitrogen', order: 14.0067},
  {tote: 8, tr: 'Oxygen', order: 15.9994},
  {tote: 9, tr: 'Fluorine', order: 18.9984},
  {tote: 10, tr: 'Neon', order: 20.1797},
];

@Component({
  selector: 'app-pick',
  templateUrl: './pick.component.html',
  styleUrls: ['./pick.component.scss']
})
export class PickComponent implements AfterViewInit {

  displayedColumns: string[] = ['tote', 'tr', 'order'];
  dataSource = new MatTableDataSource(PickData);

  constructor(private _liveAnnouncer: LiveAnnouncer) {}

  @ViewChild(MatSort)
  sort: MatSort = new MatSort;

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

}
