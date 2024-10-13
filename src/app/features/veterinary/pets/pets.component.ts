import { Component, inject } from '@angular/core';
import { PetService } from '../../../core/services/PetService/pet.service';
import { Pet } from '../../../core/models/pet.model';

@Component({
  selector: 'app-pets',
  standalone: true,
  imports: [],
  templateUrl: './pets.component.html',
  styleUrl: './pets.component.css'
})
export default class PetsComponent {
  private petService = inject(PetService)

  pets : Pet[] = []

  ngOnInit(): void {
      this.petService.list()
        .subscribe((pets: any) => {
          this.pets = pets.data
        })
  }
}
