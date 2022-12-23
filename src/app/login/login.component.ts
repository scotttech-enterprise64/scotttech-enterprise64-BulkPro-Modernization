import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SpinnerService } from '../services/spinner/spinner.service';
import { SessionHandlerService } from '../services/sessionHandler/session-handler.service';
import { ApiHandlerService } from 'src/app/services/apiHandler/api-handler.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm             : FormGroup;
  error_msg             : any;
  displayDropDowns      = true;
  userData              = this.session.userData();

  constructor(public spinnerService   : SpinnerService,
              public formBuilder      : FormBuilder,
              private api             : ApiHandlerService,
              private router          : Router,
              private session         : SessionHandlerService ) { 

    this.loginForm = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        Validators.required
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });

  }

  ngOnInit(): void {
    this.error_msg = "";
    if(this.userData.DeviceID&&this.userData.DSName)
    {
      this.displayDropDowns = false; 
    }
    else 
    {
      this.displayDropDowns = true; 
    }
    this.loadDSNameList();
  }

  loadDSNameList()
  {
    alert("TRIGGERED");
    var test = this.api.post("/device/DeviceAPI","{\"Request\":{\"SessionID\":\"\",\"Status\":\"\",\"RequestType\":\"GETDSNAMESLIST\",\"ResponseType\":\"\",\"LoggedInUserName\":\"\",\"PW\":\"\",\"PCName\":\"DEV\",\"DSName\":\"\",\"AppName\":\"\",\"isADLDS\":\"false\",\"Data\":\"\"}}");
    console.log(test);
  }

  async OnLogin() {
    try {
      this.error_msg = "";
      if (this.loginForm.valid) {
        const { username, password } = this.loginForm.value;
        const response : any = await this.api.get(environment.apiUrl, {username, password});
        if (response.status == 200) {
          // const { username, role, Id, name, emailAddress1 } = response.result
          localStorage.setItem('user', JSON.stringify(response));
          this.router.navigate(['/dashboard']);          
        } else {
          this.error_msg = "Incorrect username or password";
        }
      } else {
        this.error_msg = "Fill Required Fields"
      }
    } catch (error) {
      console.log(error);
    }
  }

}
