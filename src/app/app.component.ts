import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";
import { LoginService } from './core/services/auth.service';

@Component({
  selector: "app-root",
  styleUrls: ['./app.component.css'],
  templateUrl: "./app.component.html",
  imports: [
    RouterOutlet,
  ],
  providers: [
    LoginService
  ],
  standalone: true,

})
export class AppComponent {

}