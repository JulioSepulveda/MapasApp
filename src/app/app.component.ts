import { Component, OnInit } from '@angular/core';
/* Este import se realiza en vez de la línea var mapboxgl = require('mapbox-gl/dist/mapbox-gl.js'); 
   de la documentacion de mapBox */
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    /* En vez de como viene en la documentación se tiene que instanciar el mapa de la siguiente manera */
    /* Lo ponemos en el app.component ya que así nos sirve para todas las pantallas que van después */
    (mapboxgl as any).accessToken = environment.mapboxToken;
  }
  
}
