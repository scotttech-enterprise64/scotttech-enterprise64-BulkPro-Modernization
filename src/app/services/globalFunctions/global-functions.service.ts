import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalFunctionsService {

  constructor() { }

  getCookie(cname: string) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  setCookie(cname: string, cvalue: string, expMin: any) {
    var d = new Date();
    //d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000)); TBD
    d.setTime(d.getTime() + (expMin * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  deleteAllCookies() {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        
        if(name!=" DeviceID" && name!="DSName")
        {
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    }
  }

  getAttrMenuList() {
    return [
      // Device Apps
      { name: 'BulkPro', icon: 'settings_cell' },
      { name: 'Config', icon: 'room_preferences' },
      { name: 'Consolidation', icon: 'fact_check' },
      { name: 'DeviceConfig', icon: 'book_online' },
      { name: 'Exit', icon: 'exit_to_app' },
      // Bulk Pro
      { name: 'Cycle Count', icon: 'low_priority', route: '/bulkpro/cycle-count' },
      { name: 'Pick', icon: 'archive', route: '/bulkpro/pick' },
      { name: 'Case Pick', icon: 'medical_services', route: '/cyclecount' },
      { name: 'Put Away', icon: 'unarchive', route: '/cyclecount' },
      { name: 'Receive', icon: 'markunread_mailbox', route: '/cyclecount' },
      { name: 'Hot Pick', icon: 'outbox', route: '/cyclecount' },
      { name: 'Hot Put Away', icon: 'move_to_inbox', route: '/cyclecount' },
      { name: 'Hot Move', icon: 'control_camera', route: '/cyclecount' },
      { name: 'Item Location', icon: 'explore', route: 'bulkpro/item-location' },
      { name: 'Location Status', icon: 'not_listed_location', route: '/cyclecount' },
      { name: 'Location Move', icon: 'add_location_alt', route: '/cyclecount' },
      { name: 'About', icon: 'info', route: '/cyclecount' },
      { name: 'Back', icon: 'exit_to_app', route: '/cyclecount' }
      // Config
      // Consolidation
      // Device Config
    ];
  }

}
