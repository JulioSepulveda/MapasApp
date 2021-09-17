import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

/* Componente que se encarga de mostrar un mapa a través de una longitud y latitud que se le envia */
@Component({
  selector: 'app-mini-mapa',
  templateUrl: './mini-mapa.component.html',
  styles: [
    `
    div{
      width: 100%;
      height: 150px;
      margin: 0px;
    }
    `
  ]
})
export class MiniMapaComponent implements AfterViewInit {

  @Input() lngLat: [ number, number ] = [0,0];
  @ViewChild('mapa') divMapa!: ElementRef;

  constructor() { }

  ngAfterViewInit(): void {
    var mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      /* Indicamos la longitud y latitud donde queremos que esté el centro del mapa */
      /* Google map es exactametne igual pero al reves (latitud y longitud) */
      center: this.lngLat,
      /* Zoom que queremos que se aplique por defecto */
      zoom: 15,
      /* Con el atributo interactive a false impedimos que puedan mover el mapa, etc */
      interactive: false
    });

    new mapboxgl.Marker()
      .setLngLat(this.lngLat)
      .addTo(mapa)
  }

}
