import { Component } from '@angular/core';
import { Products } from 'src/app/models/products';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  
  productos: any[] = [
    {
      url: 'http://localhost:4200/simulator',
      nombre: 'Aceite',
      imagen: 'https://static.vecteezy.com/system/resources/previews/012/831/850/large_2x/vegetable-oil-with-olive-oil-in-different-bottle-for-cooking-isolated-on-white-background-with-clipping-path-photo.jpg'
    },
    {
      url: 'http://localhost:4200/simulator',
      nombre: 'Cereal',
      imagen: 'https://st2.depositphotos.com/1028911/5837/i/450/depositphotos_58374203-stock-photo-3d-corn-flakes-paper-package.jpg'
    },
    {
      url: 'http://localhost:4200/simulator',
      nombre: 'Caja Galletas',
      imagen: 'https://img.freepik.com/psd-premium/maqueta-empaque-panaderia-galletas_23-2150654300.jpg'
    },
    {
      url: 'http://localhost:4200/simulator',
      nombre: 'Gaseosa',
      imagen: 'https://www.shutterstock.com/image-photo/cola-bottle-isolated-on-white-600nw-2380571987.jpg'
    },
    {
      url: 'http://localhost:4200/simulator',
      nombre: 'Leche',
      imagen: 'https://st2.depositphotos.com/1028911/5625/i/450/depositphotos_56257637-stock-photo-3d-milk-carton-box-isolated.jpg'
    },
    {
      url: 'http://localhost:4200/simulator',
      nombre: 'Avena',
      imagen: 'https://img.freepik.com/fotos-premium/caja-paquetes-copos-avena-aislada-sobre-fondo-blanco-transparente_771335-65578.jpg?size=338&ext=jpg&ga=GA1.1.44546679.1716681600&semt=ais_user'
    },
    {
      url: 'http://localhost:4200/simulator',
      nombre: 'Detergente',
      imagen: 'https://static4.depositphotos.com/1006820/302/i/450/depositphotos_3025519-stock-photo-detergent-bottle-isolated.jpg'
    },
    {
      url: 'http://localhost:4200/simulator',
      nombre: 'Chocolate',
      imagen: 'https://img.freepik.com/fotos-premium/caja-chocolates-chocolates-chocolates_206038-3857.jpg'
    },
    {
      url: 'http://localhost:4200/simulator',
      nombre: 'Harina',
      imagen: 'https://corporacionliderperu.com/49233-large_default/harina-blanca-flor-preparada-x-1-kg.jpg'
    },
    {
      url: 'http://localhost:4200/simulator',
      nombre: 'Pan',
      imagen: 'https://metroio.vtexassets.com/arquivos/ids/251368/141803-01-69799.jpg?v=638173958286230000'
    },
    {
      url: 'http://localhost:4200/simulator',
      nombre: 'Mermelada',
      imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwiBQRlckK5iKjkytYEB8FSxDR8-igjNxvrg&s'
    },
    {
      url: 'http://localhost:4200/simulator',
      nombre: 'Jugo de Naranja',
      imagen: 'https://jersey.com.mx/wp-content/uploads/2021/07/jugo-galon-1.png'
    },
    {
      url: 'http://localhost:4200/simulator',
      nombre: 'Yogurt',
      imagen: 'https://corporacionliderperu.com/48102-large_default/gloria-yogurt-bt-x-1-kg-fresa.jpg'
    },
    {
      url: 'http://localhost:4200/simulator',
      nombre: 'Queso',
      imagen: 'https://corporacionliderperu.com/48129-large_default/laive-queso-fundido-cheddar-usa-x-8-taj-170-gr.jpg'
    },
    {
      url: 'http://localhost:4200/simulator',
      nombre: 'Jabón',
      imagen: 'https://corporacionliderperu.com/49027-large_default/aval-jabon-liquido-antibacterial-fc-x-400-ml-eucalipto.jpg'
    },
    {
      url: 'http://localhost:4200/simulator',
      nombre: 'Shampoo',
      imagen: 'https://corporacionliderperu.com/48992-large_default/johnsons-shampoo-x-200-ml-original.jpg'
    },
    {
      url: 'http://localhost:4200/simulator',
      nombre: 'Arroz',
      imagen: 'https://www.tiendaperuonline.com/cdn/shop/products/Disenosintitulo_7f862ee8-8552-4ba7-8c69-4c8a3f9fccc8_1200x1200.png?v=1618327838'
    },
    {
      url: 'http://localhost:4200/simulator',
      nombre: 'Frijoles',
      imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkXt0I5PpfWz_sIgY5M2QnXWGhNJwlXBIhfQ&s'
    }
  ];


  currentPage: number = 1;
  productsPerPage: number = 8;

  get paginatedProducts() {
    const startIndex = (this.currentPage - 1) * this.productsPerPage;
    return this.productos.slice(startIndex, startIndex + this.productsPerPage);
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  get totalPages() {
    return Math.ceil(this.productos.length / this.productsPerPage);
  }
}
