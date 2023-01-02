import { ChangeDetectorRef, Component, EventEmitter, Output, OnDestroy, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { SpinnerService } from 'src/app/services/spinner/spinner.service';
import { GlobalFunctionsService } from 'src/app/services/globalFunctions/global-functions.service';
import { SessionHandlerService } from 'src/app/services/sessionHandler/session-handler.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();

  loading: boolean = true
  username: string = "";

  sideBarOpen: boolean = false;

  panelOpenState = false;
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(private router: Router,
    public spinnerService: SpinnerService,
    private global: GlobalFunctionsService,
    private session: SessionHandlerService,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
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
