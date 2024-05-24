import { Component, OnInit } from '@angular/core';
import { Lugar } from '../interface/lugar';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthFirebaseService } from '../service/auth-firebase.service';
import { GooglemapsComponent } from '../componentes/googlemaps/googlemaps.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-destinos',
  templateUrl: './destinos.page.html',
  styleUrls: ['./destinos.page.scss'],
})

export class DestinosPage implements OnInit {
  lugar: Lugar = new Lugar();
  destinos: any[] = [];
  ionicForm: any;
  estado: string ="Alta destino";
  editando: boolean= false;
  latitud: number =0;
  longitud: number = 0;

  constructor(
    private authService: AuthFirebaseService,
    private formBuilder: FormBuilder,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.buildForm();
    this.authService.getLugares(this.destinos);
    this.getPosition();
  }
  buildForm(){
    this.ionicForm = this.formBuilder.group({
      nombre: new FormControl('',{validators: [Validators.required]})
    });
  }  
  ionViewWillEnter(){
    this.authService.getLugares(this.destinos);
  }
  altaLugar(){
    this.lugar.latitud = this.latitud;
    this.lugar.longitud = this.longitud;
    this.authService.altaLugar(this.lugar);
    this.authService.getLugares(this.destinos);
    this.ionicForm.reset();
  }
  submitForm(){
    this.lugar.latitud = this.latitud;
    this.lugar.longitud = this.longitud;
    if(this.ionicForm.valid){
      this.lugar.nombre = this.ionicForm.get('nombre').value;
      if(!this.editando){
        this.authService.altaLugar(this.lugar).then((e:any)=>{
          this.ionicForm.reset();
          this.authService.getLugares(this.destinos);
        }).catch(e=>{
          console.error(e);
        });        
      } else{
        this.authService.updateLugares(this.lugar.id, this.lugar).then(e=>{
          this.editando= false;
          this.estado = "Alta destino";
          this.lugar = new Lugar();
          this.ionicForm.reset();
          this.authService.getLugares(this.destinos);
        }).catch(e=>{
          console.error(e);
        });
      } 
    }
  }
  hasError: any = (controlName: string, errorName: string) => {
    return !this.ionicForm.controls[controlName].valid &&
      this.ionicForm.controls[controlName].hasError(errorName) &&
      this.ionicForm.controls[controlName].touched;
  }  

  editarLugar(id: any, lugar: any) {
    this.lugar.latitud = this.latitud;
    this.lugar.longitud = this.longitud;
    this.editando = true;
    this.lugar = lugar;
    this.estado = "Editar el lugar";
    this.ionicForm.get('nombre').setValue(lugar.nombre);
  }
  eliminarLugar(id: any) {
    this.estado = "Alta destino";
    this.editando = false;
    this.ionicForm.reset();
    this.authService.deleteLugar(id).then(response=>{
      this.authService.getLugares(this.destinos);     
    }).catch(error=>{});
  }
  cancelarEdicion(){
    this.estado = "Alta destino";
    this.editando = false;
    this.ionicForm.reset();
    this.lugar = new Lugar();
    this.latitud = 0;
    this.longitud = 0;
  }

  getPosition(): Promise<any> {
		return new Promise((resolve: any, reject: any): any => {
			navigator.geolocation.getCurrentPosition((resp: any) => {
				this.latitud = resp.coords.latitude;
				this.longitud = resp.coords.longitude;
			},
			(err: any) => {
				if ( err.code === 1 ) {
					alert('Favor de activar la geolocalización en tu navegador y recargar la pantalla.');
				}
				this.latitud = 0;
				this.longitud = 0;
			}, {timeout: 5000, enableHighAccuracy: true });
		});
	}

  async addDirection(){
    let positionInput: any = {
      lat: this.editando? this.latitud:0,
      lng: this.editando? this.longitud :0
    };

    const modalAdd = await this.modalController.create({
      component: GooglemapsComponent,
      mode: 'ios',
      //swipeToClose: true,
      componentProps: {position: positionInput} 
    });

    await modalAdd.present();

    const {data} = await modalAdd.onWillDismiss();

    if(data){
      console.log('data->', data);
      //this.cli
      this.longitud = data.pos.lng;
      this.latitud = data.pos.lat;
      console.log('datos de ubiciacion actualizados, latitud: '+this.latitud+' \nlongitud:'+this.longitud);
    }
  } 
}
