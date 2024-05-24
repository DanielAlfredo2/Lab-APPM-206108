import { Component, Inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { GoogleService } from 'src/app/service/google.service';
import { DOCUMENT } from '@angular/common';
import { ModalController } from '@ionic/angular';
declare var google: any;

@Component({
  selector: 'app-googlemaps',
  templateUrl: './googlemaps.component.html',
  styleUrls: ['./googlemaps.component.scss'],
})
export class GooglemapsComponent  implements OnInit {

  @Input() position : any = {
    lat:  25.7988334,
    lng:  -100.3253184
  }

  label: any = {
    titulo: 'Ubicación',
    subtitulo: 'Mi ubicación de envio'
  };

  map: any;
  marker: any;
  infowindow: any;
  positionSet: any;

  @ViewChild('map') divMap: any;

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: any,
    private googleMapsService: GoogleService,
    public modalController: ModalController
  ) { }

  ngOnInit() {
    this.inicializarGooglemaps();
  }

  async inicializarGooglemaps(){
    this.googleMapsService.init(this.renderer, this.document).
    then(()=>{
      this.initMap()
    })
    .catch((error: any)=>{
      console.error(error);
    });
  }
  initMap(){
    if(this.position.lng == 0 || this.position.lat == 0){
      this.position ={
        lat:  25.7988334,
        lng:  -100.3253184
      };
    }

    let latLng = new google.maps.LatLng(this.position.lat, this.position.lng);

    this.map = new google.maps.Map(this.divMap.nativeElement, {
      mapId: "map",
      zoom: 15,
      center: this.position
    });

    this.marker = new google.maps.marker.AdvancedMarkerView({
      map: this.map,
      position: this.position,
      gmpDraggable: true
    });

    this.infowindow = new google.maps.InfoWindow();
    this.setInfoWindow(this.marker, this.label.titulo, this.label.subtitulo);
    this.clickHandEvent();
  }
  clickHandEvent(){
    this.map.addListener('click', (event: any)=>{
      const position = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      this.addMarker(position);
    });
  }

  addMarker(position: any): void{
    let latLng = new google.maps.LatLng(position.lat, position.lng);
    this.marker.position = latLng;
    this.positionSet = position;
    this.map.panTo(position);
  }

  setInfoWindow(marker: any, titulo: string, subtitulo: string){
    const contentString = '<div id="contentInsideMap">' +
                          '<div>'+
                          '</div>'+
                          '<p style="font-weight: bold; margin-bottom:5px;">'+
                          '<div id="bodyContent">'+
                          '<p class="normal m-0">'+
                          subtitulo+'</p>'+
                          '</div>'+
                          '</div>';
    this.infowindow.setContent(contentString);
    this.infowindow.open(this.map, marker);
  }

  async mylocation(){
    Geolocation.getCurrentPosition().then((res: any)=>{
      console.log('mulocation() -> get', res);

      const position = {
        lat: res.coords.latitude,
        lng: res.coords.longitude
      };

      this.addMarker(position);
    });
  }

  aceptar(){
    console.log('click aceptar ->', this.positionSet);
    this.modalController.dismiss({pos: this.positionSet});
  }
}
