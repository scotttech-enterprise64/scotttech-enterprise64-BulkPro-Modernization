import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgControlStatus, UntypedFormControl, Validators } from '@angular/forms';
import { SpinnerService } from '../services/spinner/spinner.service';
import { SessionHandlerService } from '../services/sessionHandler/session-handler.service';
import { ApiHandlerService } from 'src/app/services/apiHandler/api-handler.service';
import { GlobalFunctionsService } from 'src/app/services/globalFunctions/global-functions.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  error_msg: any;
  error_msg_username:any;
  error_msg_password:any;

  displayDropDownDsName = true;
  displayDropDownDeviceID = true;
  userData = this.session.userData();
  dsNamesDropDownValues = [""];
  deviceIDDropDownValues = [""];
  elem :  any;
  hide = true;
  // disableDeviceID : boolean = true;

  error_messages = {
    'username': [
      { type: 'required', message: "Username is required." }
    ],
    'password': [
      { type: 'required', message: "Password is required." }
    ],
    'dsName': [
      { type: 'required', message: "Data source is required." }
    ],
    'deviceID': [
      { type: 'required', message: "Device id is required." }
    ]


  }


  constructor(public spinnerService: SpinnerService,
    public formBuilder: FormBuilder,
    private api: ApiHandlerService,
    private router: Router,
    private session: SessionHandlerService,
    private global: GlobalFunctionsService,
    @Inject(DOCUMENT) private document: any) {

    this.loginForm = this.formBuilder.group({
      username: new UntypedFormControl('', Validators.compose([
        Validators.required,
      ])),
      password: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      dsName: new FormControl('', Validators.compose([
        Validators.required
      ])),
      deviceID: new FormControl({ value : '', disabled : true }, Validators.compose([
        Validators.required
      ]))
    });

  }

  ngOnInit(): void {
    this.session.getSession();
    if(this.session.UserID(undefined)!="")
    {
      this.router.navigate(['/dashboard']);
    }
    this.elem = document.documentElement;
    // this.openFullscreen();
    this.error_msg = "";
    if (this.session.DeviceID(undefined) != "") {
      this.displayDropDownDeviceID = false;
    }
    else {
      this.displayDropDownDeviceID = true;
    }

    if (this.session.DSName(undefined) != "") {
      this.displayDropDownDsName = false;
    }
    else {
      this.displayDropDownDsName = true;
    }

    

    this.loadDSNameList();

    if (this.global.getCookie("DSName") != "") {
      this.loginForm.controls['deviceID'].enable();      
      this.loadDeviceIDList();
    }
  }

  showErrorMessages(controlName:any)
  {
    const controls = this.loginForm.controls;
    if(controlName=='username')
    {
      this.error_msg_username=controls[controlName].invalid?"1":"";
    }
    else 
    {
      this.error_msg_password=controls[controlName].invalid?"1":"";
    }
    
  }

  openFullscreen() {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
  }

  closeFullscreen() {
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
  }

  changeDeviceID(e: any) {
    var deviceID = e.value.trim();
    this.session.setSession(deviceID, "", "", "", "", "");
  }

  changeDsName(e: any) {
    console.log(e.value)
    this.loginForm.patchValue({
      'dsName': e.value
    });
    var dsName = e.value;
    if(dsName == "") {  
      this.global.deleteAllCookies(); 
      this.loginForm.controls['deviceID'].disable();  
    } else {
      this.loginForm.controls['deviceID'].enable();
    }
    
    this.session.setSession("", dsName, "", "", "", "");
    this.loadDeviceIDList();    
  }

  async loadDeviceIDList() {
    this.loginForm.patchValue({
      'deviceID': ""
    });
    this.deviceIDDropDownValues = [];

    if (this.global.getCookie("DSName")) {      
      var deviceIDNames = await this.api.post(environment.getDeviceInfo, this.api.generatePayload("GETIDLIST","","","","PickPro_Development SQL Auth","false","","",""));
      deviceIDNames = JSON.parse(deviceIDNames);
      console.log(deviceIDNames);
      if (deviceIDNames.Response.ResponseType == "OK") {
        var deviceID = this.global.getCookie("DeviceID")
        this.loginForm.patchValue({
          'deviceID': ""
        });
        for (var i = 0; i <= deviceIDNames.Response.Data.length - 1; i++) {
          this.deviceIDDropDownValues.push(deviceIDNames.Response.Data[i].PCName);
        }
        if (deviceID) {
          this.loginForm.patchValue({
            'deviceID': deviceID
          });
        }
      }
      else {
        alert(deviceIDNames.Response.Data);
      }
    }
  }

  async loadDSNameList() {
    var dsNames = await this.api.post(environment.getDeviceInfo,this.api.generatePayload("GETDSNAMESLIST","","","","PickPro_Development SQL Auth","false","","",""));
    dsNames = JSON.parse(dsNames);
    if (dsNames.Response.ResponseType == "OK") {
      for (var i = 0; i <= dsNames.Response.Data.length - 1; i++) {
        this.dsNamesDropDownValues.push(dsNames.Response.Data[i].ConnectionName);
      }
      var dsName = this.global.getCookie("DSName");
      if (dsName) {
        this.loginForm.patchValue({
          'dsName': dsName
        });
      }

    }
    else {
      alert(dsNames.Response.Data);
    }


  }

  async OnLogin() {
    try {
      this.error_msg = "";
      if (this.loginForm.valid) {
        if (this.loginForm.get("username")?.value == "resetconnection") {
          //Show dsName and deviceID dropdowns
          this.displayDropDownDeviceID = true;
          this.displayDropDownDsName = true;
        }
        else {
          //Set session
          var deviceID = this.loginForm.get("deviceID")?.value.toString().trim();
          var dsName = this.loginForm.get("dsName")?.value.toString().trim();
          var userName = this.loginForm.get("username")?.value.toString().trim();
          var password = this.loginForm.get("password")?.value.toString().trim();

          this.session.setSession(deviceID, dsName, "", "", "", "");
          
          //Hit Login API

          var loginReponse = await this.api.post(environment.login, this.api.generatePayload("LOGIN",this.loginForm.get("username")?.value,this.loginForm.get("password")?.value,this.loginForm.get("deviceID")?.value,this.loginForm.get("dsName")?.value,"false","","",""));
          loginReponse = JSON.parse(loginReponse);
          if (loginReponse.Response.ResponseType == "OK") {
            var lastNameFirstName = loginReponse.Response.Data;
            var isADLDS = loginReponse.Response.isADLDS.toString().trim();

            this.session.setSession("", "", userName, password, lastNameFirstName, isADLDS);

            localStorage.setItem('user', JSON.stringify(loginReponse));
            this.router.navigate(['/dashboard']);
          }
          else {
            alert(loginReponse.Response.Data);
          }




        }


      }
      else {
        this.error_msg = "1";
        this.showErrorMessages('password');
        this.showErrorMessages('username');

      }
    } catch (error) {
      console.log("Unknown User");
    }
  }

}
