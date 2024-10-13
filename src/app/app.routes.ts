import { Routes } from '@angular/router';
import HomeComponent from './features/veterinary/home.component';
import PetsComponent from './features/veterinary/pets/pets.component';
import { AuthGuard } from './core/guards/auth.guard';
import { AuthicatedGuard } from './core/guards/authicated.guard';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'pets',
                title: 'Pets',
                component: PetsComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'owners',
                title: 'Owners',
                component: PetsComponent,
                canActivate: [AuthGuard]
            },
            {
                path: '',
                redirectTo: '',
                pathMatch: 'full'
            }
        ]
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
