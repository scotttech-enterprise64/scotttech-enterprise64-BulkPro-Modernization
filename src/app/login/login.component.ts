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
  displayDropDowns = true;
  userData = this.session.userData();
  dsNamesDropDownValues = [""];
  deviceIDDropDownValues = [""];
  elem :  any;
  hide = true;
  // disableDeviceID : boolean = true;

  error_messages = {
    'username': [
      { type: 'required', message: "Please enter user name." }
    ],
    'password': [
      { type: 'required', message: "Please enter password." }
    ],
    'dsName': [
      { type: 'required', message: "Please select dsName." }
    ],
    'deviceID': [
      { type: 'required', message: "Please select deviceID." }
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
        Validators.required
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
    if (this.session.DeviceID(undefined) != "" && this.session.DSName(undefined) != "") {
      this.displayDropDowns = false;
    }
    else {
      this.displayDropDowns = true;
    }
    this.loadDSNameList();

    if (this.global.getCookie("DSName") != "") {
      this.loginForm.controls['deviceID'].enable();      
      this.loadDeviceIDList();
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
    this.loginForm.patchValue({
      'dsName': e.value
    });
    var dsName = e.value
    this.session.setSession("", dsName, "", "", "", "");
    this.loadDeviceIDList();
    this.loginForm.controls['deviceID'].enable();
  }

  async loadDeviceIDList() {
    this.loginForm.patchValue({
      'deviceID': ""
    });
    if (this.global.getCookie("DSName")) {
      this.deviceIDDropDownValues = [];
      //var payload = "\"{\\\"Request\\\":{\\\"SessionID\\\":\\\"\\\",\\\"Status\\\":\\\"\\\",\\\"RequestType\\\":\\\"GETIDLIST\\\",\\\"ResponseType\\\":\\\"\\\",\\\"LoggedInUserName\\\":\\\"\\\",\\\"PW\\\":\\\"\\\",\\\"PCName\\\":\\\"\\\",\\\"DSName\\\":\\\"PickPro_Development SQL Auth\\\",\\\"AppName\\\":\\\"\\\",\\\"isADLDS\\\":\\\"false\\\",\\\"Data\\\":\\\"\\\"}}\"}\"\r\n\r\n\r\n";
      
      var deviceIDNames = await this.api.post(environment.getDeviceInfo, this.api.generatePayload("GETIDLIST","","","","PickPro_Development SQL Auth","false","","",""));
      deviceIDNames = JSON.parse(deviceIDNames);
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

    //var payload = "\"{\\\"Request\\\":{\\\"SessionID\\\":\\\"\\\",\\\"Status\\\":\\\"\\\",\\\"RequestType\\\":\\\"GETDSNAMESLIST\\\",\\\"ResponseType\\\":\\\"\\\",\\\"LoggedInUserName\\\":\\\"\\\",\\\"PW\\\":\\\"\\\",\\\"PCName\\\":\\\"\\\",\\\"DSName\\\":\\\"PickPro_Development SQL Auth\\\",\\\"AppName\\\":\\\"\\\",\\\"isADLDS\\\":\\\"false\\\",\\\"Data\\\":\\\"\\\"}}\"}\"\r\n\r\n\r\n";

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
          this.displayDropDowns = true;
        }
        else {
          //Set session
          var deviceID = this.loginForm.get("deviceID")?.value.toString().trim();
          var dsName = this.loginForm.get("dsName")?.value.toString().trim();
          var userName = this.loginForm.get("username")?.value.toString().trim();
          var password = this.loginForm.get("password")?.value.toString().trim();

          this.session.setSession(deviceID, dsName, userName, password, "", "");
          //Hit Login API
          // var payload = "\"{\\\"Request\\\":{\\\"SessionID\\\":\\\"\\\",\\\"Status\\\":\\\"\\\",\\\"RequestType\\\":\\\"LOGIN\\\",\\\"ResponseType\\\":\\\"\\\",\\\"LoggedInUserName\\\":\\\"(LOGGEDIN_USERNAME)\\\",\\\"PW\\\":\\\"(PW)\\\",\\\"PCName\\\":\\\"(PCNAME)\\\",\\\"DSName\\\":\\\"(DSName)\\\",\\\"AppName\\\":\\\"\\\",\\\"isADLDS\\\":\\\"false\\\",\\\"Data\\\":\\\"\\\"}}\"}\"\r\n\r\n\r\n";

          // payload = payload.replace("(PCNAME)", this.loginForm.get("deviceID")?.value);
          // payload = payload.replace("(DSName)", this.loginForm.get("dsName")?.value);
          // payload = payload.replace("(LOGGEDIN_USERNAME)", this.loginForm.get("username")?.value);
          // payload = payload.replace("(PW)", this.loginForm.get("password")?.value);

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
    } catch (error) {
      console.log(error);
    }
  }

}
