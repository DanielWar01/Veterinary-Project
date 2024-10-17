
import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { LoginService } from './core/services/LoginService/login.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']  // Corrected to 'styleUrls'
})
export class AppComponent {  // Changed to named export
  title = 'Veterinary-Project';
  constructor(
    private loginService: LoginService, 
    private router: Router
  ) {}
  log_out(): void {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}
