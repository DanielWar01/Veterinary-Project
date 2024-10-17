import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { LoginService } from '../../core/services/LoginService/login.service';
import { OwnerService } from '../../core/services/OwnerService/owner.service';
import { Owner } from '../../core/models/owner.model';
import { Pet } from '../../core/models/pet.model';
import { PetService } from '../../core/services/PetService/pet.service';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, RouterLinkActive, RouterOutlet, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export default class HomeComponent implements OnInit {
  
  owners: Owner[] = [];
  pets: Pet[] = [];
  errorMessage: string = '';
  petTypeDistributionChart: any;
  ageDistributionChart: any; // Nuevo gráfico para la distribución de edad

  constructor(
    private loginService: LoginService, 
    private router: Router, 
    private ownerService: OwnerService, 
    private petService: PetService
  ) {}

  ngOnInit(): void {
    this.loadOwners();
    this.loadPets();
  }

  loadOwners(): void {
    this.ownerService.list().subscribe(
      (response: any) => {
        this.owners = response.data;
      },
      (error: any) => {
        console.error('Error loading owners:', error);
        this.errorMessage = 'Error al cargar los propietarios.';
      }
    );
  }

  loadPets(): void {
    this.petService.list().subscribe(
      (response: any) => {
        this.pets = response.data;
        this.createPetTypeDistributionChart(); // Crear el gráfico de tipo de mascotas
        this.createAgeDistributionChart(); // Crear el gráfico de distribución de edades
      },
      (error: any) => {
        console.error('Error loading pets:', error);
        this.errorMessage = 'Error al cargar las mascotas.';
      }
    );
  }

  getLengthOwner() {
    return this.owners.length;
  }

  getLengthPets(): number {
    return this.pets.length;
  }

  getAvgPetsForOwner(): number {
    const avgPets = this.owners.reduce((acc, owner) => acc + owner.pets.length, 0) / this.getLengthOwner();
    return Math.round(avgPets * 100) / 100; // Redondea a 2 decimales
  }  

  isLogin(): boolean {
    return this.loginService.isAuthenticated();
  }

  calculateAge(dateOfBirth: Date): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    // Ajustar si el cumpleaños aún no ha ocurrido este año
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  getAgeDistribution(): { ageGroup: string; count: number }[] {
    const ageGroups: { [key: string]: number } = {
      '0-2 años': 0,
      '3-5 años': 0,
      '6+ años': 0
    };

    this.pets.forEach(pet => {
      const age = this.calculateAge(pet.date_of_birth);
      if (age <= 2) {
        ageGroups['0-2 años']++;
      } else if (age <= 5) {
        ageGroups['3-5 años']++;
      } else {
        ageGroups['6+ años']++;
      }
    });

    return Object.entries(ageGroups).map(([ageGroup, count]) => ({ ageGroup, count }));
  }

  createAgeDistributionChart(): void {
    const ageDistribution = this.getAgeDistribution();
    const ctx = document.getElementById('ageDistributionChart') as HTMLCanvasElement;

    if (this.ageDistributionChart) {
      this.ageDistributionChart.destroy(); // Destruir gráfico previo
    }

    this.ageDistributionChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ageDistribution.map(group => group.ageGroup),
        datasets: [{
          label: 'Número de Mascotas por Edad',
          data: ageDistribution.map(group => group.count),
          backgroundColor: 'rgba(153, 102, 255, 0.9)',
          borderColor: 'rgba(123, 82, 204, 1)',
          borderWidth: 1,
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Número de Mascotas'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Rango de Edad'
            }
          }
        },
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          }
        }
      }
    });
  }

  createPetTypeDistributionChart(): void {
    // Contar la cantidad de mascotas por tipo
    const petTypeCount: { [key: string]: number } = {};

    this.pets.forEach(pet => {
      petTypeCount[pet.species] = (petTypeCount[pet.species] || 0) + 1;
    });

    const petTypes = Object.keys(petTypeCount);
    const petCounts = Object.values(petTypeCount);

    // Crear el gráfico de barras usando Chart.js
    const ctx = document.getElementById('petTypeChart') as HTMLCanvasElement;
    if (this.petTypeDistributionChart) {
      this.petTypeDistributionChart.destroy(); // Destruir gráfico previo
    }
    this.petTypeDistributionChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: petTypes,
        datasets: [{
          label: 'Distribución de Mascotas por Tipo',
          data: petCounts,
          backgroundColor: 'rgba(75, 192, 192, 0.9)',
          borderColor: 'rgba(55, 152, 152, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
