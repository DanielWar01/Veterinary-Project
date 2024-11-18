import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { LoginService } from '../LoginService/login.service';
import { Appointment } from '../../models/appointment.model';

@Injectable({
    providedIn: 'root',
})
export class AppointmentService {
    private http = inject(HttpClient);
    private loginService = inject(LoginService);

    private baseUrl = 'https://earnest-dream-production.up.railway.app/appointments';

  // Método para generar los headers con el token
    private getHeaders(): HttpHeaders {
        const token = this.loginService.getToken();
        let headers = new HttpHeaders();

        if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
        }

        headers = headers.set('Content-Type', 'application/json');
        return headers;
    }

    // Listar todas las citas
    list() {
        return this.http.get(this.baseUrl, { headers: this.getHeaders() });
    }

    // Obtener una cita por ID
    get(id: string) {
        return this.http.get(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
    }

    // Crear una nueva cita
    create(appointment: Appointment) {
        return this.http.post(this.baseUrl, appointment, { headers: this.getHeaders() });
    }

    // Actualizar una cita existente
    update(id: string, appointment: Appointment) {
        return this.http.put(`${this.baseUrl}/${id}`, appointment, { headers: this.getHeaders() });
    }

    // Eliminar una cita
    delete(id: string) {
        return this.http.delete(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
    }

    constructor() {}
}
