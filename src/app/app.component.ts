
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']  // Corrected to 'styleUrls'
})
export class AppComponent {  // Changed to named export
  title = 'Veterinary-Project';
}
