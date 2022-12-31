import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiHandlerService } from 'src/app/services/apiHandler/api-handler.service';
import { GlobalFunctionsService } from 'src/app/services/globalFunctions/global-functions.service';
import { environment } from 'src/environments/environment';
import { SessionHandlerService } from 'src/app/services/sessionHandler/session-handler.service';

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
              private global: GlobalFunctionsService,
              private session: SessionHandlerService) { }

  ngOnInit(): void {
    this.deviceApps();
  }

  async deviceApps() {
    try {
      var get=undefined;
      const res = JSON.parse(await this.api.post(environment.getDeviceInfo, this.api.generatePayload("GETAPPLIST",this.session.UserID(get),this.session.Password(get),this.session.DeviceID(get),this.session.DSName(get),this.session.IsADLDS(get),"","","")));
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

      var get = undefined;
      const res = JSON.parse(await this.api.post(environment.getDeviceInfo, this.api.generatePayload("GETUSERAPPMENU",this.session.UserID(get),this.session.Password(get),this.session.DeviceID(get),this.session.DSName(get),this.session.IsADLDS(get),menu.AppName + new Date().getTime(),menu.AppName,menu.AppName)));
      const { Data, ResponseType, Status } = res.Response;

      this.childMenu = [];
      
      if (ResponseType == "OK" && Status == "OK") {        
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
      } else {
        alert(Data);
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
