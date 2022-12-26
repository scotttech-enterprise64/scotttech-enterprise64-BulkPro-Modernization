import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { SpinnerService } from '../services/spinner/spinner.service';
import { ApiHandlerService } from 'src/app/services/apiHandler/api-handler.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm             : UntypedFormGroup;
  error_msg             : any;

  constructor(public spinnerService   : SpinnerService,
              public formBuilder      : UntypedFormBuilder,
              private api             : ApiHandlerService,
              private router          : Router) { 

    this.loginForm = this.formBuilder.group({
      username: new UntypedFormControl('', Validators.compose([
        Validators.required
      ])),
      password: new UntypedFormControl('', Validators.compose([
        Validators.required
      ]))
    });

  }

  ngOnInit(): void {
    this.error_msg = "";
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
