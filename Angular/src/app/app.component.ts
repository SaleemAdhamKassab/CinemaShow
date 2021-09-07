import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Cinema Show';

  public response!:{dbpath:''}
  uploadfinish=(event:any) =>{
    this.response=event;
  }


}