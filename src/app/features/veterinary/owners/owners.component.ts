import { Component, inject, OnInit } from '@angular/core';
import { OwnerService } from '../../../core/services/OwnerService/owner.service';
import { Owner } from '../../../core/models/owner.model';

@Component({
  selector: 'app-owners',
  standalone: true,
  imports: [],
  templateUrl: './owners.component.html',
  styleUrl: './owners.component.css'
})
export default class OwnersComponent implements OnInit {
  
  private ownerService = inject(OwnerService)

  owners : Owner[] = []

  ngOnInit(): void {
      this.ownerService.list()
        .subscribe((owners: any) => {
          this.owners = owners.data
        })
  }
}
