import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-full-screen',
  templateUrl: './full-screen.component.html',
  /* Se utiliza este estilo (#mapa) para que coja lo declarado en el archivo styles.css */
  styles: [
    ` 
      #mapa { 
        height: 100%;
        width: 100%; 
      } 
    `
  ]
})
export class FullScreenComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    var map = new mapboxgl.Map({
      container: 'mapa',
      style: 'mapbox://styles/mapbox/streets-v11',
      /* Indicamos la longitud y latitud donde queremos que esté el centro del mapa */
      /* Google map es exactametne igual pero al reves (latitud y longitud) */
      center: [ -3.4751795679964994, 40.398847303205 ],
      /* Zoom que queremos que se aplique por defecto */
      zoom: 16
    });
  }

}
