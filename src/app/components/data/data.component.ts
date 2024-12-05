import { Component, ViewChild } from '@angular/core';
import { Data } from 'src/app/models/data';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent {

  historyData: Data;
  data: Data[] = [];
  displayedColumns: string[] = ['nombreRegistro', 'numero', 'moneda', 'precioCompra', 'cuotaInicial', 'tasaEfectiva', 'numeroCuotas', 'periodoGraciaTotal', 'periodoGraciaParcial', 'cuota', 'diasRetraso', 'interesCompensatorio', 'interesMoratorio'];

  dataSource = new MatTableDataSource<Data>(this.data);
  clickedRows = new Set<Data>();

  constructor(private authService: AuthService, private dataService: DataService, private liveAnnouncer: LiveAnnouncer) { 
    this.historyData = {} as Data;
  }

  @ViewChild(MatPaginator, {static: true})
  paginator!: MatPaginator

  ngOnInit(): void {
    this.getHistory();
    this.dataSource.paginator = this.paginator;
  }

  getHistory(): void {
    this.dataService.getList().subscribe((datos: Data[]) => {
      console.log(datos);
      this.dataSource.data = datos.filter((dato: Data) => dato.userId ===  this.authService.getUser()?.id);
    },
    (error) => {
      console.log('Error al obtener los datos:', error);
    }
    )
  }
}
