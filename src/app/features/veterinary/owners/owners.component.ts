import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OwnerService } from '../../../core/services/OwnerService/owner.service';
import { Owner } from '../../../core/models/owner.model';
import { PetService } from '../../../core/services/PetService/pet.service';
import { Pet } from '../../../core/models/pet.model';

@Component({
  selector: 'app-owners',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './owners.component.html',
  styleUrls: ['./owners.component.css']
})
export default class OwnersComponent implements OnInit {
  showForm = false;
  owners: Owner[] = [];
  errorMessage: string = '';
  pets: Pet[] = [];
  currentOwner: Owner = {
    name: '',
    gender: '',
    phone: 0,
    email: '',
    pets: []
  };
  isEditing = false;
  petInput: string = '';

  constructor(
    private ownerService: OwnerService,
    private petService: PetService) {}

  ngOnInit(): void {
    this.loadOwners();
    this.loadAnimals();
  }

  loadOwners(): void {
    this.ownerService.list().subscribe(
      (response: any) => {
        this.owners = response.data;
        this.replacePetIdsWithNames(); // Reemplazar los IDs de mascotas con nombres
      },
      (error:any) => {
        console.error('Error loading owners:', error);
        this.errorMessage = 'Error al cargar los propietarios.';
      }
    );
  }

  loadAnimals(): void {
    this.petService.list().subscribe(
      (response: any) => {
        this.pets = response.data;
        this.replacePetIdsWithNames(); // Asegurar que se llama después de cargar las mascotas
      },
      (error) => {
        console.error('Error loading pets:', error);
        this.errorMessage = 'Error al cargar las mascotas.';
      }
    );
  }

  replacePetIdsWithNames(): void {
    if (this.owners.length > 0 && this.pets.length > 0) {
      this.owners.forEach((owner) => {
        const petNames: string[] = owner.pets.map(petId => {
          const pet = this.pets.find(p => p._id === petId); // Buscar la mascota por ID
          return pet ? pet.name : 'Desconocido'; // Reemplazar el ID por el nombre, o 'Desconocido' si no se encuentra
        });
        owner.pets = petNames; // Asignar los nombres de las mascotas
      });
    }
  }

  toggleForm(owner?: Owner): void {
    this.showForm = !this.showForm;
    this.errorMessage = '';
    if (owner) {
      this.currentOwner = { ...owner };
      this.petInput = owner.pets.join(', ');
      this.isEditing = true;
    } else {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.currentOwner = {
      name: '',
      gender: '',
      phone: 0,
      email: '',
      pets: []
    };
    this.petInput = '';
    this.isEditing = false;
  }

  saveOwner(): void {
    this.currentOwner.pets = this.petInput.split(',').map(pet => pet.trim()).filter(pet => pet !== '');

    if (this.isEditing && this.currentOwner._id) {
      this.updateOwner(this.currentOwner._id, this.currentOwner);
    } else {
      this.addOwner(this.currentOwner);
    }
  }

  addOwner(ownerData: Owner): void {
    this.ownerService.create(ownerData).subscribe(
      (response: any) => {
        console.log('Owner agregado:', response);
        this.loadOwners();
        this.toggleForm();
      },
      (error:any) => {
        console.error('Error al agregar el owner:', error);
        this.errorMessage = 'Error al agregar el propietario.';
      }
    );
  }

  updateOwner(id: string, ownerData: Owner): void {
    this.ownerService.update(id, ownerData).subscribe(
      (response: any) => {
        console.log('Owner actualizado:', response);
        this.loadOwners();
        this.toggleForm();
      },
      (error:any) => {
        console.error('Error al actualizar el owner:', error);
        this.errorMessage = 'Error al actualizar el propietario.';
      }
    );
  }

  editOwner(owner: Owner): void {
    if (owner._id) {
      this.toggleForm(owner);
    } else {
      console.error('Intento de editar un propietario sin ID');
      this.errorMessage = 'No se puede editar este propietario.';
    }
  }

  deleteOwner(id: string | undefined): void {
    if (!id) {
      console.error('Intento de eliminar un propietario sin ID');
      this.errorMessage = 'No se puede eliminar este propietario.';
      return;
    }

    if (confirm('¿Estás seguro de que quieres eliminar este propietario?')) {
      this.ownerService.delete(id).subscribe(
        () => {
          console.log('Owner eliminado');
          this.loadOwners();
        },
        (error:any) => {
          console.error('Error al eliminar el owner:', error);
          this.errorMessage = 'Error al eliminar el propietario.';
        }
      );
    }
  }
}