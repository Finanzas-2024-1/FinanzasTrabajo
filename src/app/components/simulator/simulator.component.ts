import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Data, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-simulator',
  templateUrl: './simulator.component.html',
  styleUrls: ['./simulator.component.css']
})
export class SimulatorComponent{

  currentDate: string;
  opcionSeleccionada: string = 'sostenible';

  precioCompra: number = 2500;
  saldo: number = 0;
  tasaEfectivaAnual: number = 8;
  tasaEfectivaMensual: number = 0;
  numeroCuotas: number = 18;
  cuota: number = 0.0;
  periodoGracia: number = 0.0;
  cuotaInicial: number = 187.5;
  periodoGraciaNumerico: number = 0;
  tipoCambio: number = 3.5;
  SeguroDregravamen: number = 0.0280;
  valorSeguroDregravamen: number = 0.00;

  tasaFinal: number = 0.0;
  degravamenMensual: number = 0.0;
  numeroCuotasTemp: number = this.numeroCuotas;

  tasaEfectivaInvalid: boolean = false;
  cuotaInicialInvalid: boolean = false;
  numeroCuotasInvalid: boolean = false;
  precioCompraInvalid: boolean = false;
  mostrarTabla: boolean = false;
  periodoGraciaTotal: boolean = false;
  periodoGraciaParcial: boolean = false;
  Sostenible: boolean = true;
  NoSostenible: boolean = false;
  enDolares: boolean = false;

  cronograma: number[] = [];
  cuotaArr: number[] = [];
  saldoFinal: number[] = [];
  saldoInicial: number[] = [];
  interes: number[] = [];
  amortizacion: number[] = [];  
  inmueble: number[] = [];
  degravamen: number[] = [];

  nombreRegistro: string = ''; 

  //Mora
  diasRetraso: number = 0.0;
  //comisionPagoTardio: number = 10.00;
  //protesto: number = 15.00;
  tnaCompensatoria: number = 7.5;
  teaMora: number = 10.5;
  resultadoMora?: { interesCompensatorio: number, interesMoratorio: number };

  constructor(private dataService: DataService, private authService: AuthService) {
    this.currentDate = new Date().toLocaleDateString();
    this.resetArrays();
  }

  resetArrays(): void {
    this.cronograma = Array.from({ length: this.numeroCuotas }, (_, i) => i + 1);
    this.saldoFinal = [];
    this.saldoInicial = [];
    this.interes = [];
    this.amortizacion = [];
    this.cuotaArr = [];
  }

  convertirASoles(valor: number): number {
    return valor * this.tipoCambio;    
  }

  convertirADolares(valor: number): number {
    return valor / this.tipoCambio;  
  }

  obtenerFecha(index: number): string {
    const fechaActual = new Date(); 
    const fecha = new Date(fechaActual.getFullYear(), fechaActual.getMonth() + index, fechaActual.getDate()); 
    const dia = fecha.getDate().toString().padStart(2, '0'); 
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); 
    const anio = fecha.getFullYear();
    return `${dia}-${mes}-${anio}`;
  }

  togglePeriodoGracia(opcion: string): void {
    this.periodoGraciaTotal = opcion === 'total';
    this.periodoGraciaParcial = opcion === 'parcial';
  }

  calcularCuotaInicial(): void {
    if (this.enDolares) {
      this.cuotaInicial = this.convertirADolares(this.precioCompra * 0.075);
    } else {
      this.cuotaInicial = this.precioCompra * 0.075;
    }
    this.resetArrays();
  }

  validarPreciocompra(): void {
    this.precioCompraInvalid = this.precioCompra < 2500 || this.precioCompra > 10000;
    this.calcularCuotaInicial();
    this.resetArrays();
  }

  validarNumeroCuotas(): void {
    this.numeroCuotasInvalid = this.numeroCuotas < 12 || this.numeroCuotas > 60;
    this.resetArrays();
  }
  
  validarTasaEfectiva(): void {
    this.tasaEfectivaInvalid = this.tasaEfectivaAnual < 6.9 || this.tasaEfectivaAnual > 13.9;
    this.resetArrays();
  }

  validarCuotaInicial(): void {
    this.cuotaInicialInvalid = this.cuotaInicial < 0.075 * this.precioCompra;
    this.resetArrays();
  }

  CambioTasa(): void {
    this.tasaEfectivaMensual = Math.pow(1 + (this.tasaEfectivaAnual / 100), (1 / 12)) - 1;
  }

  GenerarCuota(): void {
    this.CambioTasa();
    this.cuotaArr = [];
    this.saldo = this.precioCompra - this.cuotaInicial;
    this.tasaFinal = this.tasaEfectivaMensual + (this.SeguroDregravamen / 100);
    console.log(this.tasaFinal);
    if (this.enDolares) {
      this.saldo = this.convertirADolares(this.saldo);
    }
    if (this.periodoGraciaTotal || this.periodoGraciaParcial) {
      this.numeroCuotasTemp = this.numeroCuotas - this.periodoGraciaNumerico;
    } else {
      this.numeroCuotasTemp = this.numeroCuotas;
    }
    this.cuota = (this.saldo * ((this.tasaFinal * Math.pow(1 + this.tasaFinal, this.numeroCuotasTemp)) / (Math.pow(1 + this.tasaFinal, this.numeroCuotasTemp) - 1)));
    this.cuota = Number(this.cuota.toFixed(2));
    for (let i = 0; i < this.numeroCuotas; i++) {
      if (i < this.periodoGraciaNumerico && this.periodoGraciaTotal) {
        this.cuotaArr.push(0);
      } else if (i < this.periodoGraciaNumerico && this.periodoGraciaParcial) {
        this.cuotaArr.push(0);
      } else {
        this.cuotaArr.push(Number(this.cuota.toFixed(2)));
      }
    }
  }

  calcularSaldoFinal(): void {
    this.saldoFinal = [];
    this.interes = [];
    this.amortizacion = [];
    this.inmueble = [];
    this.degravamen = [];
    switch (true) {
      case this.periodoGraciaParcial:
        this.GenerarCuota();
        for (let i = 0; i < this.numeroCuotas; i++) {
          if (i < this.periodoGraciaNumerico) {
            this.saldoInicial.push(Number(this.saldo.toFixed(2)));
            const interes = this.saldoInicial[i] * (this.tasaEfectivaMensual);
            this.interes.push(Number(interes.toFixed(2)));
            this.cuotaArr[i] = Number(interes.toFixed(2));
            this.saldoFinal.push(Number(this.saldo.toFixed(2)));
            this.amortizacion.push(0);
            this.degravamen.push(0);
            this.inmueble.push(0);
          } else {
            this.saldoInicial.push(Number(this.saldo.toFixed(2)));
            const interes = this.saldoInicial[i] * (this.tasaEfectivaMensual);
            this.interes.push(Number(interes.toFixed(2)));
            const degravamenTemp = this.saldoInicial[i] * (this.SeguroDregravamen / 100);
            this.degravamen.push(Number(degravamenTemp.toFixed(2)));
            const amortizacion = this.cuota - this.interes[i] - degravamenTemp;
            this.amortizacion.push(Number(amortizacion.toFixed(2)));
            this.saldo -= this.amortizacion[i];
            this.saldoFinal.push(Number(this.saldo.toFixed(2)));
          }
        }
        this.amortizacion[this.numeroCuotas - 1] = this.saldoFinal[this.numeroCuotas - 2];
        this.saldoFinal[this.numeroCuotas - 1] = 0.00;
        break;

      case this.periodoGraciaTotal:
        this.GenerarCuota();
        for (let i = 0; i < this.periodoGraciaNumerico; i++) {
          this.saldoInicial.push(Number(this.saldo.toFixed(2)));
          const interes = this.saldoInicial[i] * (this.tasaEfectivaMensual);
          this.interes.push(Number(interes.toFixed(2)));
          this.cuotaArr[i] = Number(interes.toFixed(2));
          this.saldoFinal.push(Number(this.saldo.toFixed(2)));
          this.amortizacion.push(0);
          this.degravamen.push(0);
          this.inmueble.push(0);
        }
        this.saldo += this.interes.reduce((a, b) => a + b, 0);
        for (let i = this.periodoGraciaNumerico; i < this.numeroCuotas; i++) {
          this.saldoInicial.push(Number(this.saldo.toFixed(2)));
          const interes = this.saldoInicial[i] * (this.tasaEfectivaMensual);
          this.interes.push(Number(interes.toFixed(2)));
          const degravamenTemp = this.saldoInicial[i] * (this.SeguroDregravamen / 100);
          this.degravamen.push(Number(degravamenTemp.toFixed(2)));
          const amortizacion = this.cuota - this.interes[i] - degravamenTemp;
          this.amortizacion.push(Number(amortizacion.toFixed(2)));
          this.saldo -= this.amortizacion[i];
          this.saldoFinal.push(Number(this.saldo.toFixed(2)));
        }
        this.amortizacion[this.numeroCuotas - 1] = this.saldoFinal[this.numeroCuotas - 2];
        this.saldoFinal[this.numeroCuotas - 1] = 0.00;
        break;

      default:
        this.GenerarCuota();
        for (let i = 0; i < this.numeroCuotas; i++) {
          this.saldoInicial.push(Number(this.saldo.toFixed(2)));
          const interes = this.saldoInicial[i] * (this.tasaEfectivaMensual);
          this.interes.push(Number(interes.toFixed(2)));
          const degravamenTemp = this.saldoInicial[i] * (this.SeguroDregravamen / 100);
          this.degravamen.push(Number(degravamenTemp.toFixed(2)));
          const amortizacion = this.cuota - this.interes[i] - degravamenTemp;
          this.amortizacion.push(Number(amortizacion.toFixed(2)));
          this.saldo -= this.amortizacion[i];
          this.saldoFinal.push(Number(this.saldo.toFixed(2)));
        }
        this.amortizacion[this.numeroCuotas - 1] = this.saldoFinal[this.numeroCuotas - 2];
        this.saldoFinal[this.numeroCuotas - 1] = 0.00;
        break;
    }
  }

  obtenerGraciaTotal(): number {
    return this.periodoGraciaTotal ? this.periodoGraciaNumerico : 0;
  }

  obtenerGraciaParcial(): number {
    return this.periodoGraciaParcial ? this.periodoGraciaNumerico : 0;
  }

  ontenerMoneda(): string {
    return this.enDolares ? "Dólares" : "Soles";
  }

  generarCronograma(): void {
    this.cronograma = [];
    for (let i = 1; i <= this.numeroCuotas; i++) {
      this.cronograma.push(i);
    }
  }

  calcularMora() {
    const m = 360;
    const tna = this.tnaCompensatoria / 100;
    const tea = this.teaMora / 100;

    // Calcular Interés Compensatorio
    const interesCompensatorio = this.cuota * (Math.pow(1 + tna / m, this.diasRetraso) - 1);

    // Calcular Interés Moratorio
    const interesMoratorio = this.cuota * (Math.pow(1 + tea, this.diasRetraso / 360) - 1);

    this.resultadoMora = {
      interesCompensatorio: Number(interesCompensatorio.toFixed(2)), // Redondear a 2 decimales
      interesMoratorio: Number(interesMoratorio.toFixed(2))         // Redondear a 2 decimales
    };
  }

  Operacion() {
    if (!this.precioCompraInvalid && !this.tasaEfectivaInvalid && !this.cuotaInicialInvalid && !this.numeroCuotasInvalid) {

      this.calcularSaldoFinal();
      this.calcularMora();  // Asegúrate de calcular la mora antes de crear el objeto `newItem`
      this.generarCronograma();
      this.mostrarTabla = true;
      console.log(this.periodoGraciaParcial);
      console.log(this.periodoGraciaTotal);

      const monedaN = this.ontenerMoneda();
      const precioCompraN = Number(this.precioCompra.toFixed(2));
      const cuotaInicialN = Number(this.cuotaInicial.toFixed(2));
      const tasaEfectivaN = Number(this.tasaEfectivaAnual.toFixed(2));
      const numeroCuotasN = Number(this.numeroCuotas.toFixed(2));
      const periodoGraciaN = Number(this.periodoGraciaNumerico.toFixed(2));
      const periodoGraciaParcialN = this.obtenerGraciaParcial();
      const periodoGraciaTotalN = this.obtenerGraciaTotal();
      const cuotaN = Number(this.cuota.toFixed(2));
      const userIdN = this.authService.getUser()?.id;

      const newItem = {
        moneda: monedaN,
        precioCompra: precioCompraN,
        cuotaInicial: cuotaInicialN,
        tasaEfectiva: tasaEfectivaN,
        numeroCuotas: numeroCuotasN,
        periodoGracia: periodoGraciaN,
        periodoGraciaParcial: periodoGraciaParcialN,
        periodoGraciaTotal: periodoGraciaTotalN,
        cuota: cuotaN,
        userId: userIdN,
        nombreRegistro: this.nombreRegistro, // Incluyendo el nuevo campo
        diasRetraso: this.diasRetraso,
        interesCompensatorio: this.resultadoMora?.interesCompensatorio,
        interesMoratorio: this.resultadoMora?.interesMoratorio
      } as Data;

      this.dataService.createItem(newItem).subscribe(
        res => {
          console.log("Usuario agregado exitosamente");
        },
        error => {
          console.log("Ocurrió un error al agregar el usuario");
          console.log(error);
        }
      );
    } else {
      this.cuota = 0;
      this.resetArrays();
      this.cronograma = [];

      this.mostrarTabla = false;
    }
  }
}
