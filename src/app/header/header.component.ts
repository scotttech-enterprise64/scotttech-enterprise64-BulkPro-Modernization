import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SpinnerService } from '../../app/services/spinner/spinner.service';
import { GlobalFunctionsService } from '../services/globalFunctions/global-functions.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() toggleSidebarForMe: EventEmitter<any> = new EventEmitter();
  
  loading:boolean = true
  username : string = "";
  
  constructor(private router        : Router,
              public spinnerService : SpinnerService,
              private global : GlobalFunctionsService) { }

  ngOnInit(): void {
    this.username = this.global.getCookie("UserID");
    this.loading = false;
  }

  toggleSidebar() {
    this.toggleSidebarForMe.emit();
  }

  logout(){
    // localStorage.removeItem('user');
    this.global.deleteAllCookies();
    this.router.navigate(['/login']);
  }

}
