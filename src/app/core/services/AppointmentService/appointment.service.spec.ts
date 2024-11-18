import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppointmentService } from './appointment.service';
import { Appointment } from '../../models/appointment.model';

describe('AppointmentService', () => {
    
    let service: AppointmentService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [AppointmentService],
        });
        service = TestBed.inject(AppointmentService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should retrieve all appointments', () => {
        const mockAppointments: Appointment[] = [
        { _id: '1', pet_id: '101', date_time: '2024-11-20T10:00:00Z', reason: 'Consulta general', status: 'scheduled' },
        { _id: '2', pet_id: '102', date_time: '2024-11-21T12:00:00Z', reason: 'Vacunación', status: 'completed' },
        ];

        service.list().subscribe((appointments) => {
        expect(appointments.length).toBe(2);
        expect(appointments).toEqual(mockAppointments);
        });

        const req = httpMock.expectOne('https://earnest-dream-production.up.railway.app/appointments');
        expect(req.request.method).toBe('GET');
        req.flush(mockAppointments);
    });

    it('should create a new appointment', () => {
        const newAppointment: Appointment = {
        pet_id: '103',
        date_time: '2024-11-22T14:00:00Z',
        reason: 'Chequeo',
        status: 'scheduled',
        };

        service.create(newAppointment).subscribe((appointment) => {
        expect(appointment).toEqual({ ...newAppointment, _id: '3' });
        });

        const req = httpMock.expectOne('https://earnest-dream-production.up.railway.app/appointments');
        expect(req.request.method).toBe('POST');
        req.flush({ ...newAppointment, _id: '3' });
    });

    it('should delete an appointment by ID', () => {
        service.delete('1').subscribe((response) => {
        expect(response).toBeUndefined();
        });

        const req = httpMock.expectOne('https://earnest-dream-production.up.railway.app/appointments/1');
        expect(req.request.method).toBe('DELETE');
        req.flush(null);
    });
});
