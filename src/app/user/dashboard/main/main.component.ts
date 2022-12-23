import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  tab_hover_color : string = '#cf9bff3d';

  mainMenu: any = [
    { name: 'BulkPro Menu', icon: 'dock' },
    { name: 'Config', icon: 'insert_drive_file' },
    { name: 'Consolidation', icon: 'playlist_add_check' },
    { name: 'Device Config', icon: 'phonelink_setup' },
    { name: 'Exit', icon: 'exit_to_app' }
  ];

  bulkProMenus: any = [
    { name: 'Cycle Count', icon: 'dock' },
    { name: 'Pick', icon: 'insert_drive_file' },
    { name: 'Put Away', icon: 'playlist_add_check' },
    { name: 'Recieve', icon: 'phonelink_setup' },
    { name: 'Hot Pick', icon: 'exit_to_app' },
    { name: 'Hot Put Away', icon: 'exit_to_app' },
    { name: 'Hot Move', icon: 'exit_to_app' },
    { name: 'Item Location', icon: 'exit_to_app' },
    { name: 'Location Status', icon: 'exit_to_app' },
    { name: 'About', icon: 'exit_to_app' },
    { name: 'Back', icon: 'exit_to_app' }
  ];

  isParentMenu: boolean = true;
  isChildMenu: boolean = false;
  childMenus: any;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loadMenus({name: 'Back'});
  }

  loadMenus(menu: any) {

    if (menu.name.includes('BulkPro')) {
      this.childMenus = this.bulkProMenus;
      this.isParentMenu = false;
      this.isChildMenu = true;
    }
    if (menu.name === 'Back') {
      this.isParentMenu = true;
      this.isChildMenu = false;
    }

  }

}
