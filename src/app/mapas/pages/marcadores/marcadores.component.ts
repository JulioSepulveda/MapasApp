import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

/* Los atributos marker y center los ponemos con interrogación ya que van a ser opcionales */
interface MarcadorColor {
  color: string;
  marker?: mapboxgl.Marker;
  center?: [number, number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    ` 
      .mapa-container { 
        height: 100%;
        width: 100%; 
      }

      .list-group {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 99;
      }

      li {
        cursor: pointer;
      }

    `
  ]
})
export class MarcadoresComponent implements AfterViewInit {

  /* Para llamar a la referenia #mapa del HTML */
  @ViewChild('mapa') divMapa!: ElementRef;

  /* Propiedad de tipo mapa para poder trabajar con el en otras clases diferentes a onInit */
  mapa!: mapboxgl.Map;
  zoomLevel: number = 15;
  center: [number, number] = [ -3.4751795679964994, 40.398847303205 ];

  //Array de marcadores
  marcadores: MarcadorColor[] = [];

  constructor() { }

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

    /* Leemos los marcadores guardados en el local Storage */
    this.leerLocalStorage();

    /* Si creamos un elemento de HTML (puede ser un texto, un icono, una imagen, etc) y se lo metemos dentro del 
       parentesis del marker, en vez de sacarnos la imagen predeterminada nos sacaria ese elemento */
    const markerHtml: HTMLElement = document.createElement('div');
    markerHtml.innerHTML = 'HOLA MUNDO';

    /* Para crear un marcador */
    /* new mapboxgl.Marker( {element: markerHtml} )
      .setLngLat( this.center )
      .addTo( this.mapa );*/
  } 

  agregarMarcador() {

    //Genera el codigo de un color hexadecimal aleatorio
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));


    /* Si ponemos el atributo draggable en true permitimos que el marcador se pueda desplazar por el mapa */
    /* el atributo color establece el color del marcador */
    const nuevoMarcador = new mapboxgl.Marker( { draggable: true, color } )
      .setLngLat( this.center )
      .addTo ( this.mapa )

    this.marcadores.push( {
      color, 
      marker:nuevoMarcador
    });

    /* LLamamos al método de guardar en el local Storage */
    this.guardarLocalStorage();

    /* Subscripcion para controlar cuando se termina de arrastran un marcador y así actualizarlo en el local Storage */
    nuevoMarcador.on('dragend', () => {
      this.guardarLocalStorage();
    });

  }

  irMarcador( marcador: mapboxgl.Marker ) {
    /* Con el metodo flyTo hacemos que cuando se pulse el botón de un marcador, el centro del mapa se vaya a ese marcador  */
    this.mapa.flyTo({
      center: marcador.getLngLat()
    })
  }

  guardarLocalStorage() {
    const lngLatArr: MarcadorColor[] = [];
    this.marcadores.forEach( m => {
      const color = m.color;
      /* Desestructuramos el atributo lngLat ya que es un objeto y contiene mucha informacion y a nosotros solo nos hace
      falta la longitud y latitud */
      const {lng, lat} = m.marker!.getLngLat();

      lngLatArr.push({
        color: color,
        center: [ lng, lat ]
      });
    })

    /* Como en el local Storage solo se pueden guardar Strings, pasamos el objeto lngLatArr a string */
    localStorage.setItem( 'marcadores', JSON.stringify(lngLatArr));
  }

  leerLocalStorage() {
    if ( !localStorage.getItem('marcadores') ){
      return;
    }
    
    /* EL método JSON.parse es el opuesto al stringify que hicimos en el guardar */
    const lngLatArr: MarcadorColor[] = JSON.parse( localStorage.getItem('marcadores')! );

    /* Volvemos a reconstruir los marcadores con los datos del local Storage */
    lngLatArr.forEach( m => {
      const newMarker = new mapboxgl.Marker({
        color: m.color,
        draggable: true
      })
      .setLngLat( m.center! )
      .addTo( this.mapa );

      /* Cada vez que leemos tenemos que recargar tambien el array de marcadores ya que si no cuando guardemos uno nuevo
         perderemos todos los anteriores */
      this.marcadores.push({
        color: m.color,
        marker: newMarker
      });
      
      /* Subscripcion para controlar cuando se termina de arrastran un marcador y así actualizarlo en el local Storage */
      newMarker.on('dragend', () => {
        this.guardarLocalStorage();
      });

    });
  }

  borrarMarcador ( i: number ) {

    console.log('borrar marcador');
    /* Para borrar el marcador del mapa */
    this.marcadores[i].marker?.remove();

    /* Para borrar el marcador del array de marcadores */
    this.marcadores.splice(i, 1);

    /* Al volver a enviar a guardar, como ya no existe en el array se borra del local Storage */
    this.guardarLocalStorage();

  }

}
