import { Component } from '@angular/core';
import {Router, RouterOutlet} from "@angular/router";
import { LoginService } from './core/services/auth.service';
import { HeaderComponent } from './components/layout/header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: "app-root",
  styleUrls: ['./app.component.css'],
  templateUrl: "./app.component.html",
  imports: [
    RouterOutlet,
    HeaderComponent,
    CommonModule
  ],
  providers: [
    LoginService
  ],
  standalone: true,

})
export class AppComponent {
 constructor(public router: Router) {}
}