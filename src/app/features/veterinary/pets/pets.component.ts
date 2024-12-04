import { Component, inject, OnInit } from '@angular/core';
import { PetService } from '../../../core/services/PetService/pet.service';
import { Pet } from '../../../core/models/pet.model';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { CREATE_APPOINTMENT, CREATE_PET, DELETE_PET_BY_ID, GET_PETS, UPDATE_PET } from '../../../graphql.operations';
import { Router } from '@angular/router';
import { Appointment } from '../../../core/models/appointment.model';

@Component({
  selector: 'app-pets',
  standalone: true,
  imports: [FormsModule, CommonModule, DatePipe],
  templateUrl: './pets.component.html',
  styleUrl: './pets.component.css',
})
export default class PetsComponent implements OnInit {
  private petService = inject(PetService);
  private router = inject(Router);

  pets: Pet[] = [];
  showForm = false;
  showFormAppoinment = false;
  isEditing = false;
  errorMessage = '';
  loading: boolean = false;

  currentPet: Pet = {
    name: '',
    species: '',
    race: '',
    date_of_birth: new Date(),
  };

  currentAppointment: Appointment = {
    _id: '',
    pet_id: {
      name: '',
    },
    date_time: '',
    reason: '',
    status: 'scheduled',
    notes: ''
  }

  ngOnInit(): void {
    this.loadAnimals();
  }

  private querySubscription: Subscription = new Subscription;

  constructor(private readonly apollo: Apollo) {}

  loadAnimals(): void {
    const token = localStorage.getItem('authToken'); // O el método que uses para obtener el token

    if (!token) {
      console.error('Token no disponible');
      this.errorMessage = 'No se ha encontrado el token de autenticación.';
      return;
    }

    this.querySubscription = this.apollo
      .watchQuery<any>({
        query: GET_PETS,
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      })
      .valueChanges.subscribe(
        ({ data, loading }) => {
          this.loading = loading;
          this.pets = data.getPets;
        },
        (error) => {
          console.log(error)
          console.error('Error loading pets from GraphQL:', error);
          this.errorMessage = 'Error al cargar las mascotas desde GraphQL.';
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

  toggleFormAppointment(pet?: Pet): void {
    this.showFormAppoinment = !this.showFormAppoinment;
    if (pet) {
      this.currentPet = { ...pet };
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
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.error('Token no disponible');
      this.errorMessage = 'No se ha encontrado el token de autenticación.';
      return;
    }
  
    this.apollo
      .mutate({
        mutation: CREATE_PET,
        variables: {
          name: petData.name,
          species: petData.species,
          race: petData.race,
          date_of_birth: petData.date_of_birth, // Si el formato es necesario
        },
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      })
      .subscribe(
        (response: any) => {
          console.log('Pet added:', response);
          this.loadAnimals();
          this.toggleForm();
          this.router.navigate(['/pets']);
        },
        (error) => {
          console.error('Error adding pet:', error);
          this.errorMessage = 'Error al agregar la mascota.';
        }
      );
  }

  updatePet(id: string, petData: Pet): void {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.error('Token no disponible');
      this.errorMessage = 'No se ha encontrado el token de autenticación.';
      return;
    }
  
    this.apollo
      .mutate({
        mutation: UPDATE_PET,
        variables: {
          id,
          name: petData.name,
          species: petData.species,
          race: petData.race,
          date_of_birth: petData.date_of_birth,
        },
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      })
      .subscribe(
        (response: any) => {
          console.log('Pet updated:', response);
          this.loadAnimals();
          this.toggleForm();
          this.router.navigate(['/pets']);
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
  
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.error('Token no disponible');
      this.errorMessage = 'No se ha encontrado el token de autenticación.';
      return;
    }
  
    if (confirm('¿Estás seguro de que quieres eliminar esta mascota?')) {
      this.apollo
        .mutate({
          mutation: DELETE_PET_BY_ID,
          variables: {
            id,
          },
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        })
        .subscribe(
          () => {
            console.log('Mascota eliminada');
            this.loadAnimals();
            this.router.navigate(['/pets'])
          },
          (error) => {
            console.error('Error al eliminar la mascota:', error);
            this.errorMessage = 'Error al eliminar la mascota.';
          }
        );
    }
  }

  addAppointmentToPet(petId: string | undefined, appointment: Appointment): void {
    if (!petId) {
      console.error("El ID de la mascota no está definido.");
      this.errorMessage = "El ID de la mascota es necesario para asignar una cita.";
      return;
    }
  
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('Token no disponible');
      this.errorMessage = 'No se ha encontrado el token de autenticación.';
      return;
    }
  
    this.apollo
      .mutate({
        mutation: CREATE_APPOINTMENT,
        variables: {
          pet_id: petId,
          date_time: appointment.date_time,
          reason: appointment.reason
        },
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      })
      .subscribe({
        next: (updatedPet) => {
          this.loadAnimals();
          console.log('Cita asignada correctamente:', updatedPet);
        },
        error: (err) => {
          console.error('Error al asignar la cita:', err);
          this.errorMessage = 'No se pudo asignar la cita a la mascota.';
        },
      });
  }
  
}
