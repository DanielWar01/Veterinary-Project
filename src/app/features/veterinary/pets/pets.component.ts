import { Component, inject, OnInit } from '@angular/core';
import { PetService } from '../../../core/services/PetService/pet.service';
import { Pet } from '../../../core/models/pet.model';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-pets',
  standalone: true,
  imports: [FormsModule, CommonModule, DatePipe],
  templateUrl: './pets.component.html',
  styleUrl: './pets.component.css',
})
export default class PetsComponent implements OnInit {
  private petService = inject(PetService);

  pets: Pet[] = [];
  showForm = false;
  isEditing = false;
  errorMessage = '';

  currentPet: Pet = {
    name: '',
    species: '',
    race: '',
    date_of_birth: new Date(),
  };

  ngOnInit(): void {
    this.loadAnimals();
  }

  loadAnimals(): void {
    this.petService.list().subscribe(
      (response: any) => {
        this.pets = response.data;
      },
      (error) => {
        console.error('Error loading pets:', error);
        this.errorMessage = 'Error al cargar las mascotas.';
      }
    );
  }

  toggleForm(pet?: Pet): void {
    this.showForm = !this.showForm;
    this.errorMessage = '';
    if (pet) {
      this.currentPet = { ...pet };
      this.isEditing = true;
    } else {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.currentPet = {
      name: '',
      species: '',
      race: '',
      date_of_birth: new Date(),
    };
    this.isEditing = false;
  }

  savePet(): void {
    if (this.isEditing && this.currentPet._id) {
      this.updatePet(this.currentPet._id, this.currentPet);
    } else {
      this.addPet(this.currentPet);
    }
  }

  addPet(petData: Pet): void {
    this.petService.create(petData).subscribe(
      (response: any) => {
        console.log('Pet added:', response);
        this.loadAnimals();
        this.toggleForm();
      },
      (error) => {
        console.error('Error adding pet:', error);
        this.errorMessage = 'Error al agregar la mascota.';
      }
    );
  }

  updatePet(id: string, petData: Pet): void {
    this.petService.update(id, petData).subscribe(
      (response: any) => {
        console.log('Pet updated:', response);
        this.loadAnimals();
        this.toggleForm();
      },
      (error) => {
        console.error('Error updating pet:', error);
        this.errorMessage = 'Error al actualizar la mascota.';
      }
    );
  }

  deletePet(id: string | undefined): void {
    if (!id) {
      console.error('Intento de eliminar una mascota sin ID');
      this.errorMessage = 'No se puede eliminar esta mascota.';
      return;
    }

    if (confirm('¿Estás seguro de que quieres eliminar esta mascota?')) {
      this.petService.delete(id).subscribe(
        () => {
          console.log('Mascota eliminada');
          this.loadAnimals();
        },
        (error) => {
          console.error('Error al eliminar la mascota:', error);
          this.errorMessage = 'Error al eliminar la mascota.';
        }
      );
    }
  }

  addAppointmentToPet(petId: string, appointmentId: string): void {
    this.petService.addAppointment(petId, appointmentId).subscribe({
      next: (updatedPet) => {
        // Actualizar la lista de mascotas o solo la mascota específica
        this.loadAnimals(); // Recarga las mascotas para reflejar los cambios
        console.log('Cita asignada correctamente:', updatedPet);
      },
      error: (err) => {
        console.error('Error al asignar la cita:', err);
        this.errorMessage = 'No se pudo asignar la cita a la mascota.';
      },
    });
  }
  

}