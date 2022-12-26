import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SpinnerService } from '../services/spinner/spinner.service';
import { SessionHandlerService } from '../services/sessionHandler/session-handler.service';
import { ApiHandlerService } from 'src/app/services/apiHandler/api-handler.service';
import { GlobalFunctionsService } from 'src/app/services/globalFunctions/global-functions.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

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
    private global: GlobalFunctionsService) {

    this.loginForm = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        Validators.required
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required
      ])),
      dsName: new FormControl('', Validators.compose([
        Validators.required
      ])),
      deviceID: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });

  }

  ngOnInit(): void {
    this.error_msg = "";
    if (this.global.getCookie("DeviceID") && this.global.getCookie("DSName")) {
      this.displayDropDowns = false;
    }
    else {
      this.displayDropDowns = true;
    }
    this.loadDSNameList();

    if (this.global.getCookie("DSName") != "") {
      this.loadDeviceIDList();
    }
  }


  changeDeviceID(e: any) {
    this.global.setCookie("DeviceID", e.target.value, 1000000);
  }


  changeDsName(e: any) {
    this.loginForm.patchValue({
      'dsName': e.target.value
    });
    this.global.setCookie("DSName", e.target.value, 1000000);
    this.loadDeviceIDList();
  }

  async loadDeviceIDList() {
    this.loginForm.patchValue({
      'deviceID': ""
    });
    if (this.global.getCookie("DSName")) {
      this.deviceIDDropDownValues = [];
      var payload = "\"{\\\"Request\\\":{\\\"SessionID\\\":\\\"\\\",\\\"Status\\\":\\\"\\\",\\\"RequestType\\\":\\\"GETIDLIST\\\",\\\"ResponseType\\\":\\\"\\\",\\\"LoggedInUserName\\\":\\\"\\\",\\\"PW\\\":\\\"\\\",\\\"PCName\\\":\\\"\\\",\\\"DSName\\\":\\\"PickPro_Development SQL Auth\\\",\\\"AppName\\\":\\\"\\\",\\\"isADLDS\\\":\\\"false\\\",\\\"Data\\\":\\\"\\\"}}\"}\"\r\n\r\n\r\n";
      var deviceIDNames = await this.api.post(environment.getDeviceInfo, payload);
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

    var payload = "\"{\\\"Request\\\":{\\\"SessionID\\\":\\\"\\\",\\\"Status\\\":\\\"\\\",\\\"RequestType\\\":\\\"GETDSNAMESLIST\\\",\\\"ResponseType\\\":\\\"\\\",\\\"LoggedInUserName\\\":\\\"\\\",\\\"PW\\\":\\\"\\\",\\\"PCName\\\":\\\"\\\",\\\"DSName\\\":\\\"PickPro_Development SQL Auth\\\",\\\"AppName\\\":\\\"\\\",\\\"isADLDS\\\":\\\"false\\\",\\\"Data\\\":\\\"\\\"}}\"}\"\r\n\r\n\r\n";

    var dsNames = await this.api.post(environment.getDeviceInfo, payload);
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
          //Set cookies
          this.global.setCookie("DeviceID", this.loginForm.get("deviceID")?.value.toString().trim(), 1000000);
          this.global.setCookie("DSName", this.loginForm.get("dsName")?.value.toString().trim(), 1000000);
          this.global.setCookie("UserID", this.loginForm.get("username")?.value.toString().trim(), 15);
          this.global.setCookie("PW", this.loginForm.get("password")?.value.toString().trim(), 15);
          //Hit Login API
          var payload = "\"{\\\"Request\\\":{\\\"SessionID\\\":\\\"\\\",\\\"Status\\\":\\\"\\\",\\\"RequestType\\\":\\\"LOGIN\\\",\\\"ResponseType\\\":\\\"\\\",\\\"LoggedInUserName\\\":\\\"(LOGGEDIN_USERNAME)\\\",\\\"PW\\\":\\\"(PW)\\\",\\\"PCName\\\":\\\"(PCNAME)\\\",\\\"DSName\\\":\\\"(DSName)\\\",\\\"AppName\\\":\\\"\\\",\\\"isADLDS\\\":\\\"false\\\",\\\"Data\\\":\\\"\\\"}}\"}\"\r\n\r\n\r\n";
          payload = payload.replace("(PCNAME)", this.loginForm.get("deviceID")?.value.split(":")[1].toString().trim());
          payload = payload.replace("(DSName)", this.loginForm.get("dsName")?.value.split(":")[1].toString().trim());
          payload = payload.replace("(LOGGEDIN_USERNAME)", this.loginForm.get("username")?.value);
          payload = payload.replace("(PW)", this.loginForm.get("password")?.value);

          var loginReponse = await this.api.post(environment.login, payload);
          loginReponse = JSON.parse(loginReponse);
          if (loginReponse.Response.ResponseType == "OK") {
            this.global.setCookie("UserID",this.loginForm.get("username")?.value.toString().trim(), 15);
            this.global.setCookie("LastNameFirstName", loginReponse.Response.Data, 15);
            this.global.setCookie("PW",this.loginForm.get("password")?.value.toString().trim(), 15);
            this.global.setCookie("isADLDS", loginReponse.Response.isADLDS.toString().trim(), 1000000);

            localStorage.setItem('user', JSON.stringify(loginReponse));

            this.router.navigate(['/dashboard']);
          }
          else {
            alert(loginReponse.Response.Data);
          }




        }


      }
    } catch (error) {
    }
  }

}
