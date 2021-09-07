import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-add-actor',
  templateUrl: './add-actor.component.html',
  styleUrls: ['./add-actor.component.css']
})
export class AddActorComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private service: AdminService,
    private router: Router,
    private activateRoute: ActivatedRoute
  ) { }

  title!: string;
  btnTitle!: string;
  actorForm!: FormGroup;
  message!: string;
  id!: number;
  img!: File;
  urlImage!: string;

  messageValidate = {
    actorName: {
      required: 'The Name is required',
    },
    actorImage: {
      required: 'The Photo is required',
    },
  };

  ngOnInit(): void {
    this.title = 'New Actor';
    this.btnTitle = 'Add New Actor';
    this.id = 0;
    //this.img = '';
    this.urlImage = 'assets/images/User.png';

    this.actorForm = this.fb.group({
      actorName: ['', Validators.required],
      actorImage: [null]
    })

    this.activateRoute.paramMap.subscribe(param => {
      var id = Number(param.get('id'));
      if (id) {
        this.service.GetActor(id).subscribe(actor => {
          this.title = 'Edit Actor';
          this.btnTitle = 'Update and Save';
          this.id = id;
          this.actorForm.patchValue({
            actorName: actor.actorName
          });
          this.urlImage = 'assets/images/actors/' + actor.actorPicture;
          fetch(this.urlImage).then(res => res.blob()).then(blob => {
            var file = new File([blob], actor.actorPicture);
            this.img = file;
          })
        }, ex => {
          console.log(ex);
        })
      }
    })
  }

  AddActor() {
    if (this.actorForm.valid) {
      const fd = new FormData();
      fd.append('image', this.img);
      fd.append('actorName', this.actorForm.value.actorName);
      if (this.id > 0) {
        fd.append('id', this.id.toString());
        this.service.EditActor(fd).subscribe(actor => {
          this.GoToList();
        }, ex => {
          console.log(ex);
          this.message = '';
        })
      } else {
        this.service.AddActor(fd).subscribe(actor => {
          this.message = 'New Actor added successfully';
        }, ex => {
          console.log(ex);
          this.message = '';
        })
      }

    }
  }

  GoToList() {
    sessionStorage.setItem('actor', 'actor');
    this.router.navigate(['/controlpanel']);
  }

  HandleFiles(event: any) {
    if (event.target.files !== null && event.target.files.length > 0) {
      this.img = event.target.files[0];
      const reader = new FileReader();
      reader.onload = function (e:any) {
        $('#image').attr('src', e.target.result);
      }
      reader.readAsDataURL(this.img);
    } else {
      //this.img = null;
      $('#image').attr('src', 'assets/images/User.png');
    }
  }

}