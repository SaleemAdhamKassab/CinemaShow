import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RegisterService } from 'src/app/services/register.service';
import { LoginModel } from 'src/app/models/login-model';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private service: RegisterService,
    private route: Router,
    private auth: AuthService
  ) { }

  message!: string;
  loginForm!: FormGroup;
  logModel!: LoginModel;
  messageValidate = {
    email: {
      required: 'The Email Address is required',
    },
    pass: {
      required: 'The password is required',
    },
  };

  ngOnInit() {
    this.message = '';

    this.logModel = {
      email: '',
      password: '',
      rememberMe: false
    };

    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: false
    });

  }

  Login() {
    if (this.loginForm.valid) {
      this.ValidateModel();
      this.service.UserLogin(this.logModel).subscribe(success => {
        const rem = !!this.loginForm.value.rememberMe;
        const email = this.loginForm.value.email;

        this.auth.installStorage(rem, email);
        this.route.navigate(['home']).then(x=> {window.location.reload()});
      }, err => {
        console.log(err);
        this.message = err.error;
      });
    }
  }

  ValidateModel() {
    this.logModel.email = this.loginForm.value.email;
    this.logModel.password = this.loginForm.value.password;
    this.logModel.rememberMe = this.loginForm.value.rememberMe;
  }
}