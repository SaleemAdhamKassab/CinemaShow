import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { UserModel } from 'src/app/models/UserModel';
import { Users } from 'src/app/models/user';
import { ActivatedRoute } from '@angular/router';
import { EditUserModel } from 'src/app/models/EditUserModel';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private service: AdminService,
    private activateRoute: ActivatedRoute
  ) { }

  message!: string;
  errorMsg!: string;
  userForm!: FormGroup;
  user!: UserModel;
  users!: Users[];
  userData!: Users;
  regex!: RegExp;
  isbusy!: boolean;
  title!: string;
  btnTitle!: string;
  isEditMode!: boolean;
  editUserData!: EditUserModel;
  id!: string;

  messageValidate = {
    userName: {
      required: 'The User Name is required',
      matchUserName: 'The User Name is used',
    },
    email: {
      required: 'The Email is required',
      notValid: 'Invalid Email',
      matchEmail: 'The Email is Used'
    },
    pass: {
      required: 'The Password is required',
      minLength: 'Minimum password is 6 syllables',
      notMatch: 'Password must contain: number - uppercase letter - lowercase letter - special character',
    },
    passConfirm: {
      required: 'Confirm Password is required',
      minLength: 'Minimum password is 6 syllables',
      isMatch: 'The two passwords do not match'
    },
  };

  ngOnInit(): void {
    this.id = '';
    this.isbusy = false;
    this.users = [];
    this.message = '';
    this.errorMsg = '';
    this.title = 'Add New User';
    this.btnTitle = 'Add User';
    //this.userData ;
    this.isEditMode = false;
    this.user = {
      userName: '',
      email: '',
      password: '',
      emailConfirmed: false,
      phoneNumber: '',
      country: ''
    };

    this.userForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(6)]],
      emailConfirmed: false,
      country: '',
      phone: ''
    });

    this.editUserData = {
      id: '',
      userName: '',
      email: '',
      emailConfirmed: false,
      password: '',
      phoneNumber: '',
      country: '',
    }

    this.userForm.valueChanges.subscribe(x => {
      if (this.userForm.status == 'VALID') {
        this.isbusy = true;
      }
    }, ex => console.log(ex))

    this.GetAllUsers();

    this.activateRoute.paramMap.subscribe(param => {
      var id = param.get('id');
      if (id) {
        this.service.GetUser(id).subscribe(x => {
          this.userData = x;
          this.title = 'Edit User';
          this.btnTitle = 'Update and Save';
          this.isEditMode = true;
          this.AddUserData();
          this.id = id as any;
        }, ex => console.log(ex));
      }
    })
  }

  AddUserData() {
    if (this.userData !== null) {
      this.userForm.setValue({
        userName: this.userData.userName,
        email: this.userData.email,
        password: this.userData.passwordHash,
        passwordConfirm: this.userData.passwordHash,
        emailConfirmed: this.userData.emailConfirmed,
        country: this.userData.country,
        phone: this.userData.phoneNumber
      });
    }
  }

  AddUser() {
    if (this.userForm.valid) {
      if (!this.isEditMode) {
        this.user.country = this.userForm.value.country;
        this.user.emailConfirmed = this.userForm.value.emailConfirmed;
        this.user.phoneNumber = this.userForm.value.phone;
        this.user.password = this.userForm.value.password;
        this.user.userName = this.userForm.value.userName;
        this.user.email = this.userForm.value.email;

        this.service.AddUser(this.user).subscribe(s => {
          this.ngOnInit();
          this.message = 'New user added successfully';
        }, ex => this.errorMsg = ex);
      } else {
        this.editUserData.id = this.id;
        this.editUserData.email = this.userForm.value.email;
        this.editUserData.emailConfirmed = this.userForm.value.emailConfirmed;
        this.editUserData.password = this.userForm.value.password;
        this.editUserData.country = this.userForm.value.country;
        this.editUserData.phoneNumber = this.userForm.value.phone;
        this.editUserData.userName = this.userForm.value.userName;

        this.service.EditUser(this.editUserData).subscribe(x => {
          this.message = 'The User has been modified successfully';
        }, ex => console.log(ex));
      }
    }
  }

  isUserNameExist() {
    var name = this.userForm.value.userName;
    if (name !== null && name !== '') {
      for (const user of this.users.values()) {
        if (user.userName === name && !this.isEditMode) {
          return true;
        }
        else if (this.isEditMode && user.userName === name && user.id !== this.userData.id) {
          return true;
        }
      }
    }
    return false;
  }

  isEmailExist() {
    var email = this.userForm.value.email;
    if (email !== null && email !== '') {
      for (const item of this.users.values()) {
        if (item.email === email && !this.isEditMode) {
          return true;
        }
        else if (this.isEditMode && item.email === email && item.id !== this.userData.id) {
          return true;
        }
      }
    }
    return false;
  }

  isPasswordValid() {
    const pass = this.userForm.value.password;
    if (pass !== '' && pass.length > 5) {
      this.regex = new RegExp('[a-z]');
      if (!this.regex.test(pass)) {
        this.messageValidate.pass.notMatch = 'The Password must contain at least a lowercase letter';
        return false;
      }
      this.regex = new RegExp('[A-Z]');
      if (!this.regex.test(pass)) {
        this.messageValidate.pass.notMatch = 'The Password must contain at least an uppercase letter';
        return false;
      }
      this.regex = new RegExp('[~!@#$%^&*()+<>{}]');
      if (!this.regex.test(pass)) {
        this.messageValidate.pass.notMatch = 'The Password must contain at least a special character';
        return false;
      }
      this.regex = new RegExp('[0-9]');
      if (!this.regex.test(pass)) {
        this.messageValidate.pass.notMatch = 'The Password must contain at least one number';
        return false;
      }
    }
    return true;
  }

  isPasswordMatch() {
    if (this.userForm.value.password !== '' && this.userForm.value.passwordConfirm !== '') {
      if ((this.userForm.value.password !== this.userForm.value.passwordConfirm) &&
        this.userForm.value.password.length > 5 && this.userForm.value.passwordConfirm.length > 5) {
        return true;
      }
    }
    return false;
  }

  GetAllUsers() {
    this.service.GetAllUsers().subscribe((list) => {
      this.users = list;
    }, ex => console.log(ex));
  }
}