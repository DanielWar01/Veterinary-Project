import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { Apollo } from 'apollo-angular';
import { Appointment } from '../../../core/models/appointment.model';
import {
    GET_APPOINTMENTS,
    CREATE_APPOINTMENT,
    UPDATE_APPOINTMENT,
    DELETE_APPOINTMENT_BY_ID,
    GET_PETS,
} from '../../../graphql.operations';
import { AppointmentService } from '../../../core/services/AppointmentService/appointment.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
    selector: 'app-appointments',
    standalone: true,
    imports: [FormsModule, CommonModule, DatePipe],
    templateUrl: './appointments.compenent.html',
    styleUrls: ['./appointments.component.css'],
})
export default class AppointmentsComponent implements OnInit {
    appointments: Appointment[] = []; // Lista de citas
    pets: { [key: string]: string } = {}; // Relación de ID a nombre de mascotas
    showForm = false; // Controla la visibilidad del formulario
    isEditing = false; // Indica si se está editando una cita
    errorMessage = ''; // Mensaje de error

    currentAppointment: Appointment = {
        pet_id: {
            name: ''
        },
        date_time: '',
        reason: '',
        status: 'scheduled',
    }; // Cita actual para crear o editar
    querySubscription: Subscription = new Subscription();
    loading = false;

    constructor(private apollo: Apollo,
        private appointmentService: AppointmentService
    ) {}

    private router = inject(Router);

    ngOnInit(): void {
        this.loadAppointments();
        this.loadAnimals();
    }

    // Método para cargar todas las citas
    loadAppointments(): void {
        const token = localStorage.getItem('authToken'); // O el método que uses para obtener el token

        if (!token) {
            console.error('Token no disponible');
            this.errorMessage = 'No se ha encontrado el token de autenticación.';
            return;
        }

        this.apollo
        .watchQuery<any>({ 
            query: GET_APPOINTMENTS,
            context: {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        })
        .valueChanges.subscribe({
            next: (result) => {
                this.appointments = result.data.getAppointments;
                
                console.log(this.appointments)
            },
            error: (err) => {
            console.error('Error loading appointments:', err);
            this.errorMessage = 'Error al cargar las citas';
            },
        });
    }

    // Método para cargar todas las mascotas
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
                data.getPets.forEach((pet: any) => {
                    this.pets[pet._id] = pet.name;
                    });
                },
                (error) => {
                console.log(error)
                console.error('Error loading pets from GraphQL:', error);
                this.errorMessage = 'Error al cargar las mascotas desde GraphQL.';
                }
        );
    }

    // Alternar el formulario para agregar/editar citas
    toggleForm(appointment: Appointment | null = null): void {
        if (appointment) {
        this.isEditing = true;
        this.currentAppointment = { ...appointment }; // Copiar datos de la cita para editar
        } else {
        this.isEditing = false;
        this.resetForm();
        }
        this.showForm = !this.showForm;
    }

    // Resetear el formulario
    resetForm(): void {
        this.currentAppointment = {
        pet_id: {
            name: '',
        },
        date_time: '',
        reason: '',
        status: 'scheduled',
        };
        this.showForm = false;
        this.isEditing = false;
    }

    // Guardar la cita actual (crear o actualizar según el estado)
    saveAppointment(): void {
        if (this.isEditing) {
        this.updateAppointment();
        } else {
        this.createAppointment();
        }
    }

    // Crear una nueva cita
    private createAppointment(): void {
        this.appointmentService.create(this.currentAppointment).subscribe({
        next: () => {
            console.log('Cita creada exitosamente');
            this.loadAppointments(); // Recargar la lista de citas
            this.resetForm(); // Limpiar el formulario
            this.router.navigate(['/appointments'])
        },
        error: (err) => {
            console.error('Error al crear la cita:', err);
            this.errorMessage = 'Error al guardar la cita';
        },
        });
    }

    // Actualizar una cita existente
    private updateAppointment(): void {
        if (!this.currentAppointment._id) {
        console.error('Error: El ID de la cita es inválido.');
        this.errorMessage = 'No se puede actualizar una cita sin un ID válido.';
        return;
        }
    
        this.appointmentService
        .update(this.currentAppointment._id, this.currentAppointment)
        .subscribe({
            next: () => {
            console.log('Cita actualizada exitosamente');
            this.loadAppointments(); // Recargar la lista de citas
            this.resetForm(); // Limpiar el formulario
            this.router.navigate(['/appointments'])
            },
            error: (err) => {
            console.error('Error al actualizar la cita:', err);
            this.errorMessage = 'Error al actualizar la cita';
            },
        });
    }

    // Eliminar una cita
    deleteAppointment(id: string | undefined): void {
        if (!id) {
        this.errorMessage = 'ID de cita inválido';
        return;
        }
        this.appointmentService.delete(id).subscribe({
        next: () => {
            this.loadAppointments();
            this.router.navigate(['/appointments'])
        },
        error: (err) => {
            this.errorMessage = 'Error al eliminar la cita';
        },
        });
    }
}
