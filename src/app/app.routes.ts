import { Routes } from '@angular/router';
import HomeComponent from './features/veterinary/home.component';
import PetsComponent from './features/veterinary/pets/pets.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AuthicatedGuard } from './core/guards/authicated.guard';
import OwnersComponent from './features/veterinary/owners/owners.component';
import AppointmentComponent from './features/veterinary/appointments/appointments.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'pets',
        title: 'Pets',
        component: PetsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'owners',
        title: 'Owners',
        component: OwnersComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'appointments',
        title: 'Appointments' ,
        component: AppointmentComponent,
        canActivate: [AuthGuard]
    },
    {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./features/veterinary/authentication/login.component'),
        canActivate: [AuthicatedGuard]
    },
    {
        path: '**',
        redirectTo: 'login'
    }
];
