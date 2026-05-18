import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class HeaderComponent implements OnInit {

  nickUsuario: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.nickUsuario = localStorage.getItem('nickUsuario') || '';
  }

  logout(): void {
    localStorage.removeItem('nickUsuario');
    localStorage.removeItem('contrasena');
    this.router.navigate(['/login']);
  }

}