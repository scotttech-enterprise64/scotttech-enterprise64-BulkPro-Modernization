import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  menus: any = [
    { icon: 'desktop_mac', title: 'Device Apps', route: '/dashboard' },
    { icon: 'dock', title: 'BulkPro Menu', route: '#' },
    { icon: 'insert_drive_file', title: 'Config', route: '#' },
    { icon: 'playlist_add_check', title: 'Consolidation', route: '/admin' },
    { icon: 'phonelink_setup', title: 'Device Config', route: '#' },
    { icon: 'exit_to_app', title: 'Exit', route: '#' }
  ];
  
  bulkProMenus: any = [
    { icon: 'arrow_back', title: 'Admin', route: '/dashboard', class: 'back-class' },
    { icon: 'assignment_ind', title: 'Employee', route: '/admin/employees' },
    { icon: 'tune', title: 'Preferences', route: '#' },
    { icon: 'published_with_changes', title: 'System Replenishment', route: '#' },
    { icon: 'directions_alt', title: 'Inventery Map', route: '/admin/inventoryMap' },
    { icon: 'list_alt', title: 'Batch Manager', route: '/admin/batchManager' },
    { icon: 'analytics', title: 'Reports', route: '#' },
    { icon: 'my_location', title: 'Location Assignment', route: '#' },
    { icon: 'low_priority', title: 'Cycle Count', route: '#' },
    { icon: 'trolley', title: 'Move Item', route: '#' },
    { icon: 'dvr', title: 'Transactions', route: '#' },
    { icon: 'ads_click', title: 'manual Transactions', route: '#' },
    { icon: 'event_note', title: 'Event Logs', route: '#' },
    { icon: 'airline_stops', title: 'De-allocate Orders', route: '#' },
    { icon: 'dashboard', title: 'Inventory', route: '/admin/inventoryMaster' }
  ];

  isParentMenu: boolean = true;
  isChildMenu: boolean = false;
  childMenus: any;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loadMenus({route: this.router.url});
  }

  loadMenus(menu: any) {

    if (menu.route.includes('/admin')) {
      this.childMenus = this.bulkProMenus;
      this.isParentMenu = false;
      this.isChildMenu = true;
    }
    if (menu.route === '/dashboard') {
      this.isParentMenu = true;
      this.isChildMenu = false;
    }

  }

}
