import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OwnerService } from '../../../core/services/OwnerService/owner.service';
import { Owner } from '../../../core/models/owner.model';
import { PetService } from '../../../core/services/PetService/pet.service';
import { Pet } from '../../../core/models/pet.model';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { GET_OWNERS, GET_PETS } from '../../../graphql.operations';

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
  loading: boolean = false;

  private querySubscription : Subscription = new Subscription();

  constructor(
    private readonly apollo: Apollo,
    private ownerService: OwnerService,
    private petService: PetService) {}

  ngOnInit(): void {
    this.loadOwners();
    this.loadAnimals();
  }

  loadOwners(): void {
    const token = localStorage.getItem('authToken');

    if (!token) {
      console.error('Token no disponible');
      this.errorMessage = 'No se ha encontrado el token de autenticación de usuario.';
      return;
    }

    this.querySubscription = this.apollo
      .watchQuery<any>({
        query: GET_OWNERS,
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      })
      .valueChanges.subscribe(
        ({ data, loading }) => {
          this.loading = loading;
          this.owners = data.getOwners;
        },
        (error) => {
          console.error('Error al cargar propietarios desde GraphQL:', error);
          this.errorMessage = `Error al cargar los propietarios desde GraphQL.`;
        }
      );
  }

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
    const ownerToSave = {
        ...this.currentOwner,
        pets: this.currentOwner.pets.map(petId => petId), // Asegúrate de enviar solo los IDs
    };

    if (this.isEditing && this.currentOwner._id) {
        this.updateOwner(this.currentOwner._id, ownerToSave);
    } else {
        this.addOwner(ownerToSave);
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
          this.errorMessage = `Error al eliminar el propietario. ${error.error.message} ${error.error.stack}`;
        }
      );
    }
  }
}