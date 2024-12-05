import { Component } from '@angular/core';
import { LoginService } from '../../../core/services/LoginService/login.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent {
  email: string = '';
  password: string = '';
  error: string='';
  constructor(private loginService: LoginService, private router: Router){

  }

  login(): void {
    this.loginService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/'])
      },
      error: (err) => {
        console.error('Login fallido', err);
        if (this.email !== 'admin@ejemplo.com'){
          this.error = 'Correo Electrónico incorrecto';
        }else{
          this.error = 'Contraseña incorrecta';
        }
      }
    })
  }
}
