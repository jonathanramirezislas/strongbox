import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import{ HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-movimientos',
  templateUrl: './movimientos.page.html',
  styleUrls: ['./movimientos.page.scss'],
})
export class MovimientosPage implements OnInit {
  result=[];

  variable1: string='';
  IDusuario: string='';
  variable:string;
  constructor(public toastController: ToastController,private http:HttpClient) { }
  itemsproductos:any;

  ngOnInit() {
  }


mostrarvariable(){
  var iduser=this.itemsproductos['0'].idusuario;
  this.presentToast(iduser);
}

  modoificarvalores(){


  }


  async presentToast(msg) {
     const toast = await this.toastController.create({
       message: msg,
       duration: 2000
     });
     toast.present();
   }



   loaddata(){

     var idusuario=1;
     var senData= JSON.stringify({});

console.log('datos a search',senData);
//PRUEBA
this.http.post('http://proyectosita.com/itahotelcaja/loaddata.php',senData)
.subscribe(data=>{
   console.log(data,'data');
var idusuario1:string=data[0]['idusuario'];
this.itemsproductos=data;
console.log(this.itemsproductos);
this.presentToast(data[0]['idusuario']);

 },
 error=>{
 this.presentToast(error);
});


   }

}
