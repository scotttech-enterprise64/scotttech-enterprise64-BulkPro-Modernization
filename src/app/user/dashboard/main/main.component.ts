import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiHandlerService } from 'src/app/services/apiHandler/api-handler.service';
import { GlobalFunctionsService } from 'src/app/services/globalFunctions/global-functions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  tab_hover_color : string = '#cf9bff3d';

  selectedMenu : any = {
    icon : "",
    AppDisplayName : ""
  };

  attrMenuList : any = this.global.getAttrMenuList();

  parentMenu: any = [];
  childMenu : any = [];

  isParentMenu: boolean = true;
  isChildMenu: boolean = false;

  constructor(private router: Router,
              private api : ApiHandlerService,
              private global: GlobalFunctionsService,) { }

  ngOnInit(): void {
    this.deviceApps();
  }

  async deviceApps() {
    try {
      var payload = {
        Request : {
          "SessionID"         : "",
          "Status"            : "",
          "RequestType"       : "GETAPPLIST",
          "ResponseType"      : "",
          "LoggedInUserName"  : this.global.getCookie("UserID"),
          "PW"                : this.global.getCookie("PW"),
          "PCName"            : this.global.getCookie("DeviceID"),
          "DSName"            : this.global.getCookie("DSName"),
          "AppName"           : "",
          "isADLDS"           : this.global.getCookie("isADLDS"),
          "Data"              : ""
        }
      };      
      var convertPayload = JSON.stringify(JSON.stringify(payload));
      const res = JSON.parse(await this.api.post(environment.getDeviceInfo, convertPayload));
      const { Data, ResponseType, Status } = res.Response;

      if (ResponseType == "OK" && Status == "OK") {
        
        // this.parentMenu.push({ AppDisplayName : "Device Apps", AppName : "Device Apps", icon : "desktop_mac" });
        this.selectedMenu = { AppDisplayName : "Device Apps", AppName : "Device Apps", icon : "desktop_mac" };

        Data.forEach((i : any) => {
          let info = this.attrMenuList.filter((e : any) => e.name == i.AppName);
          this.parentMenu.push(
            {
              ...i, 
              icon  : info[0].icon
            }
          );
        });
      }
      
      this.parentMenu.push(
        {
          ...this.attrMenuList.filter((e : any) => e.name == "Exit")[0],
          AppDisplayName : "Exit",
          AppName : "Exit"
        }
      );

    } catch (error) {
      console.log(error);
    }
  }

  async loadMenus(menu: any) {

    try {

      // If User has clicked on Child Menu
      if (menu.MenuDisplayName) {                
        if (menu.MenuDisplayName == "Back") {
          this.selectedMenu = { AppDisplayName : "Device Apps", AppName : "Device Apps", icon : "desktop_mac" };
          this.showMenu("parent");
        } else {
          this.router.navigate([menu.route]);  
        }
        return;
      }

      if (menu.AppName == "Exit") {
        this.global.deleteAllCookies();
        this.router.navigate(['/login']);
      }

      var payload = {
        Request : {
          "SessionID"         : menu.AppName + new Date().getTime(),
          "Status"            : "",
          "RequestType"       : "GETUSERAPPMENU",
          "ResponseType"      : "",
          "LoggedInUserName"  : this.global.getCookie("UserID"),
          "PW"                : this.global.getCookie("PW"),
          "PCName"            : this.global.getCookie("DeviceID"),
          "DSName"            : this.global.getCookie("DSName"),
          "AppName"           : menu.AppName,
          "isADLDS"           : this.global.getCookie("isADLDS"),
          "Data"              : menu.AppName
        }
      };
      var convertPayload = JSON.stringify(JSON.stringify(payload));
      const res = JSON.parse(await this.api.post(environment.getDeviceInfo, convertPayload));
      const { Data, ResponseType, Status } = res.Response;

      if (ResponseType == "OK" && Status == "OK") {

        this.childMenu = [];
        this.selectedMenu = menu;

        Data.forEach((i : any) => {          
          let info = this.attrMenuList.filter((e : any) => e.name == i.MenuDisplayName);
          this.childMenu.push(
            {
              ...i, 
              icon  : info.length > 0 ? info[0].icon : "",
              route : info.length > 0 ? info[0].route : ""
            }
          );
        });
      }

      this.childMenu.push(
        {
          ...this.attrMenuList.filter((e : any) => e.name == "Back")[0],
          AppDisplayName : "Back", 
          AppName : "Back",
          MenuDisplayName : "Back"
        }
      );

      this.showMenu("child");
      
    } catch (error) {
      console.log(error);
    }

  }

  showMenu(name : string) {
    if (name == "parent") {
      this.isParentMenu = true;
      this.isChildMenu = false;
    } else {
      this.isParentMenu = false;
      this.isChildMenu = true;
    }
  }

}
