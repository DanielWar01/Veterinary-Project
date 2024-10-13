import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { LoginService } from '../../core/services/LoginService/login.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, RouterLinkActive, RouterOutlet, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export default class HomeComponent {
  constructor(private loginService: LoginService, private router: Router){

  }

  log_out(): void{
    this.loginService.logout()
    this.router.navigate(['/login']);
  }
}
