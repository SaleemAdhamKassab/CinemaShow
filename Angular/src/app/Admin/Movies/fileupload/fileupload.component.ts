import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css']
})
export class FileuploadComponent implements OnInit {

  public pageTitle = 'Welcome to fileupload component';
  fileForm = new FormGroup({
    altText: new FormControl(''),
    description: new FormControl('')
  });
  fileToUpload: any;
  constructor(private http:  HttpClient) {
  }

  ngOnInit() {
  }

  handleFileInput(e: any) {
    this.fileToUpload = e?.target?.files[0];
  }
  saveFileInfo()
  {
    const headers = new HttpHeaders().set('Content-Type', 'multipart/form-data');
    const formData: FormData = new FormData();
    formData.append('myFile', this.fileToUpload);
    formData.append('altText', this.fileForm.value.altText);
    formData.append('description', this.fileForm.value.description);
    return this.http.post('http://localhost:54504/api/FileManager', formData, 
    {
      headers : new HttpHeaders()})
    .subscribe(() => alert("File uploaded"));
  }

}
