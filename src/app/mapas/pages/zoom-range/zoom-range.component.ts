import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  /* Se utiliza este estilo (#mapa) para que coja lo declarado en el archivo styles.css */
  styles: [
    ` 
      .mapa-container { 
        height: 100%;
        width: 100%; 
      }
      .row {
        background-color: white;
        border-radius: 5px;
        bottom: 50px;
        left: 50px;
        padding: 10px;
        position: fixed;
        z-index: 999;
        width: 400px;
      } 
    `
  ]
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {

  /* Para llamar a la referenia #mapa del HTML */
  @ViewChild('mapa') divMapa!: ElementRef;
  /* Propiedad de tipo mapa para poder trabajar con el en otras clases diferentes a onInit */
  mapa!: mapboxgl.Map;
  zoomLevel: number = 10;
  center: [number, number] = [ -3.4751795679964994, 40.398847303205 ];

  constructor() { }

  /* Implementamos el OnDestroy ya que siempre que nos subscribimos a algo con el metodo on, tenemos que destruir
     esa escucha cuando se destruye la página. Esto lo hacemos con el método off */
  ngOnDestroy(): void {
    this.mapa.off('zoom', () => {});
    this.mapa.off('zoomend', () => {});
    this.mapa.off('move', () => {});
  }

  /* Usamos el AfterViewInit en vez del onInit ya que en el onInit no est'a controido el divMapa */
  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      /* usamos la propiedad nativeElement para que no nos de error */
      container: this.divMapa.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      /* Indicamos la longitud y latitud donde queremos que esté el centro del mapa */
      /* Google map es exactametne igual pero al reves (latitud y longitud) */
      center: this.center,
      /* Zoom que queremos que se aplique por defecto */
      zoom: this.zoomLevel
    });

    /* con el metodo on creamos un listener del mapa para poder establecer el valor del zoom correctamente */
    this.mapa.on('zoom', (ev) => {
      this.zoomLevel = this.mapa.getZoom();
    });

    /* con el metodo on creamos un listener del mapa para poder establecer el valor del zoom correctamente */
    this.mapa.on('zoomend', (ev) => {
      if ( this.mapa.getZoom() > 18 ) {
        this.mapa.zoomTo( 18 );
      }
    });

    /* Movimiento del mapa con el raton */
    this.mapa.on('move', (event) => {
      const target = event.target;
      const { lng, lat } = target.getCenter();
      this.center = [ lng, lat ];
    });
  }

  zoomOut() {
    this.mapa.zoomOut();
  }

  zoomIn() {
    this.mapa.zoomIn();
  }

  zoomCambio( valor: string ) {
    this.mapa.zoomTo( Number( valor ) );
  }

}
