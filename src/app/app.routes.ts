import { Routes } from '@angular/router';
import { PetsComponent } from './features/pets/pets.component';
import { OwnersComponent } from './features/owners/owners.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
    {path: 'pets', component: PetsComponent},
    {path: 'owners', component: OwnersComponent}
];
