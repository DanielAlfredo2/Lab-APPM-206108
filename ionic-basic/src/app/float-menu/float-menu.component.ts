import { Component, OnDestroy, OnInit } from '@angular/core';
import { Menu } from 'src/app/interface/menu';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthFirebaseService } from '../service/auth-firebase.service';
import { MenuService } from '../service/menu.service';
import { onAuthStateChanged } from 'firebase/auth';

@Component({
  selector: 'app-float-menu',
  templateUrl: './float-menu.component.html',
  styleUrls: ['./float-menu.component.scss'],
})
export class FloatMenuComponent  implements OnInit, OnDestroy  {
  
  titleMenu: string='home';
  public isLoged : any = false;

  public subscription : Subscription | undefined ;

  datosMenu: Menu[] =[
    {nombre: 'login',enlace:'/login',
    icono:'log-in-outline'},
    {nombre: 'logout',enlace:'/home',
    icono:'log-out-outline'}
  ];

  constructor(
    private autService: AuthFirebaseService,
    private menuService: MenuService,
    private router: Router
  ) { 
    onAuthStateChanged(this.autService.getStateAuth(), user=>{
      if(user!=null && user != undefined){
        this.isLoged = true;
      }
    });

    this.subscription = this.menuService.$getTitleMenu.subscribe(data=>{
      console.log(data);
      this.titleMenu =data;
    });

  }

  ngOnDestroy(): void {
    if(this.subscription != null || this.subscription!= undefined){
      this.subscription.unsubscribe();
    }
  }

  ngOnInit() {}

  navegar(link: string, titleMenu: string){
    this.titleMenu =titleMenu;
    this.menuService.setTitle(titleMenu);
    this.router.navigate([link]);
  }

  onMenuOpen(){
    onAuthStateChanged(this.autService.getStateAuth(), user=>{
      if(user!=null && user != undefined){
        this.datosMenu =[
          {nombre: 'Alumnos',enlace:'/main/alumnos',
    icono:'school-outline'},
      {nombre: 'Receteas',enlace:'/main/receta',
      icono:'restaurant-outline'},
      {nombre: 'inicio',enlace:'/main/inicio',
      icono:'navigate-outline'},
      {nombre: 'Turismo-firestore',enlace:'/main/destinos',
      icono:'airplane'},
      {nombre: 'Turismo-api',enlace:'main/destinos-api',
      icono:'airplane'},
      {nombre: 'Tabs',enlace:'/main/tabs',
      icono:'folder-outline'},
      {nombre: 'login',enlace:'/login',
      icono:'log-in-outline'},
          {nombre: 'logout',enlace:'/logout',
          icono:'log-out-outline'}
        ];

      }       
     else{
        this.datosMenu =[
          {nombre: 'login',enlace:'/login',
          icono:'log-in-outline'},
          {nombre: 'logout',enlace:'/logout',
          icono:'log-out-outline'}
        ];
      }
    });
  }

}