import { ChangeDetectorRef, Component, EventEmitter, Output, OnDestroy, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';
import { GlobalFunctionsService } from 'src/app/services/globalFunctions/global-functions.service';
import { NavSideBarObserverService } from 'src/app/services/observers/nav-side-bar-observer/nav-side-bar-observer.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();

  loading: boolean = true
  username: string = "";
  pageName : string = "";

  sideBarOpen: boolean = false;

  panelOpenState = false;
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(private router          : Router,
              public spinnerService   : SpinnerService,
              private global          : GlobalFunctionsService,
              changeDetectorRef       : ChangeDetectorRef, 
              media                   : MediaMatcher,
              private navSideObs      : NavSideBarObserverService) {

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.username = this.global.getCookie("UserID");
    this.loading = false;

    let routeName = this.router.url;
    let curMenu = JSON.parse(localStorage.getItem('curMenu') || '');

    if (curMenu && routeName !== "/dashboard") {
      if ( routeName.split('/').length > 2 ) {
        this.pageName = routeName.split('/')[2];
      } else {
        this.pageName = curMenu.MenuDisplayName ? curMenu.MenuDisplayName : curMenu.AppDisplayName;
      }      
    } else {
      this.pageName = "Device Apps"; 
    }


    this.navSideObs.updateObserver.subscribe(res => {
      const value = this.navSideObs.updates;
      if (value.MenuDisplayName) 
      {
        this.pageName = value.MenuDisplayName;
      }
      else if (value.AppDisplayName) 
      {
        this.pageName = value.AppDisplayName;
      } 
      else 
      {
        let curMenu = JSON.parse(localStorage.getItem('curMenu') || '');
        if (curMenu) {
          this.pageName = curMenu.MenuDisplayName ? curMenu.MenuDisplayName : curMenu.AppDisplayName;
        } else {
          this.pageName = "Device Apps"; 
        }     
      }
    });
  }

  logout() {
    // localStorage.removeItem('user');
    this.global.deleteAllCookies();
    this.router.navigate(['/login']);
  }

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

}
