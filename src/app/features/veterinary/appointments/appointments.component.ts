import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../../core/services/AppointmentService/appointment.service';
import { PetService } from '../../../core/services/PetService/pet.service';
import { Appointment } from '../../../core/models/appointment.model';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
    selector: 'app-appointments',
    standalone: true,
    imports: [FormsModule, CommonModule, DatePipe],
    templateUrl: './appointments.compenent.html',
    styleUrls: ['./appointments.component.css'],
})
export default class AppointmentsComponent implements OnInit { // Cambiar a export default
  appointments: Appointment[] = []; // Lista de citas
  showForm: boolean = false; // Controla la visibilidad del formulario
  isEditing: boolean = false; // Indica si se está editando una cita
  errorMessage: string = ''; // Mensaje de error
    currentAppointment: Appointment = {
        pet_id: '',
        date_time: '',
        reason: '',
        status: 'scheduled',
    }; // Cita actual para crear o editar

    constructor(private appointmentService: AppointmentService, private petService: PetService) {}
    pets: { [key: string]: string } = {};

    ngOnInit(): void {
        this.loadAppointments(); 
        this.loadPets();
    }

    // Método para cargar todas las citas
    loadAppointments(): void {
        this.appointmentService.list().subscribe({
        next: (response: any) => {
            this.appointments = response.data;
        },
        error: (err) => {
            console.error('Error loading appointments:', err);
            this.errorMessage = 'Error al cargar las citas';
        },
        });
    }

    loadPets(): void {
        this.petService.list().subscribe({
        next: (response: any) => {
            // Mapear IDs a nombres
            response.data.forEach((pet: any) => {
            this.pets[pet._id] = pet.name;
            });
        },
        error: (err) => {
            console.error('Error al cargar las mascotas:', err);
        },
        });
    }

    // Alternar el formulario para agregar/editar citas
    toggleForm(appointment: Appointment | null = null): void {
        if (appointment) {
        this.isEditing = true;
        this.currentAppointment = { ...appointment }; // Copiar datos de la cita para editar
        } else {
        this.isEditing = false;
        this.currentAppointment = {
            pet_id: '',
            date_time: '',
            reason: '',
            status: 'scheduled',
        };
        }
        this.showForm = !this.showForm;
    }

    // Resetear el formulario
    resetForm(): void {
        this.currentAppointment = {
        pet_id: '',
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
        this.updateAppointment(); // Llamar al método de actualización
        } else {
        this.createAppointment(); // Llamar al método de creación
        }
    }

    // Crear una nueva cita
    private createAppointment(): void {
        this.appointmentService.create(this.currentAppointment).subscribe({
        next: () => {
            console.log('Cita creada exitosamente');
            this.loadAppointments(); // Recargar la lista de citas
            this.resetForm(); // Limpiar el formulario
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
        },
        error: (err) => {
            this.errorMessage = 'Error al eliminar la cita';
        },
        });
    }
    
}
