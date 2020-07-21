import { Component } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import{ HttpClient} from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  public id_cliente:any;
  public datos:any;
  public IDusuario:any;
  public idcajafuerte:any;
  public passwordbt:any;
  public passOpen:any;
  public passClose:any;
  public idbluetooth:any;
  public result=[];
  lists:any;

  constructor(private https: HTTP,public sqlite: SQLite,public router:Router,private http:HttpClient,private bluetoothSerial: BluetoothSerial,public toastController: ToastController) {
  }

  ionViewWillEnter(){
  this.cliente();
  //this.select();
  }


  getAllBluetoothDevices(){
    // async so keep everything in this method
    this.bluetoothSerial.isEnabled().then((data)=> {
        // not sure of returning value, probably a boolean
        console.log("dont know what it returns"+data);

        // returns all the available devices, not just the unpaired ones
        this.bluetoothSerial.list().then((allDevices) => {
            // set the list to returned value
            this.lists = allDevices;
            let msg="Dispositivos emparejados";
            this.presentToast(msg);

        });
    });
   }




desconnect(){

  this.bluetoothSerial.disconnect().then(res => {
       let msg="Dispositivo desconectado";
      this.presentToast(msg);
    },error =>{
      this.presentToast(error);

          });
}


   findBluetoothDevices(){
     this.bluetoothSerial.isEnabled().then((data)=> {
this.bluetoothSerial.discoverUnpaired().then((success) => {
         this.lists = success;
         let msg="Dispositivos sin emparejar";
         this.presentToast(msg);
     });
      });
    }


    connect() {
this.bluetoothSerial.isEnabled().then((data)=> {
		this.bluetoothSerial.connect(this.idbluetooth).subscribe(res => {
         let msg="Dispositivo conectado";
        this.presentToast(msg);
      },error =>{
        this.presentToast(error);

            });

              });
	}




  async presentToast(msg) {
     const toast = await this.toastController.create({
       message: msg,
       duration: 2000
     });
     toast.present();
   }

   OpenDoor(){
     this.bluetoothSerial.write('1').then((success)=>{

      this.presentToast('Se abrio caja fuerte')
    

       let msg="Puerta abierta";
     }, (failure)=>{
       let msg="error";
      this.presentToast(msg);
     });


var idusuarios=this.datos[0]['idcliente'];
var idcaja=this.datos[0]['idcajafuerte'];

console.log("send data idusuarios-->",idusuarios);

console.log("send data idcaja-->",idcaja);

var senData= JSON.stringify({idusuario:idusuarios,idcaja:idcaja,operacion:'1'});
console.log("send data-->",senData);

     this.http.post('http://proyectosita.com/itahotelcaja/operacion.php',senData)
     .subscribe(data=>{
      

       //this.presentToast('Se abrio caja fuerte')

       },
       error=>{
        console.log("ocurrio un error abriendo la caja");
       console.log(error);
     });
   }


CloseClose(){

  console.log("Codigo para cerrar la caja fuerte",this.passClose);
  this.bluetoothSerial.write('0').then((success)=>{
   
    this.presentToast('Se cerro la caja')


  }, (failure)=>{
    let msg="error";
   this.presentToast(msg);
  });

 

  
  var idusuarios=this.datos[0]['idcliente'];
  var idcaja=this.datos[0]['idcajafuerte'];

       var senData= JSON.stringify({idusuario:idusuarios,idcaja:idcaja,operacion:'0'});

       this.http.post('http://proyectosita.com/itahotelcaja/operacion.php',senData)
       .subscribe(data=>{

        
           console.log(data,'operacion');
      //     this.presentToast('se cerro caja fuerte');
         },
         error=>{
           console.log("ocurrio un error cerrando la caja");
         console.log(error);
       });
}


loaddata(idusuario){
  
  var senData= JSON.stringify({idusuario:idusuario});

  this.http.post('http://proyectosita.com/itahotelcaja/loaddata.php',senData)
  .subscribe(data=>{

      this.datos=data;

      console.log("datos -->",this.datos)
      this.IDusuario=data[0]['idcliente'];
      this.idcajafuerte=data[0]['idcajafuerte'];
      this.passOpen=data[0]['passOpen'];
      this.passClose=data[0]['passClose'];
      this.passwordbt=data[0]['passwordbt'];
      this.idbluetooth=data[0]['idbluetooth'];
      console.log('idcajafuerte',this.idcajafuerte);
      console.log('passwordbt',this.passwordbt);
      console.log('passOpen',this.passOpen);
      console.log('passClose',this.passClose);
      console.log('IDusuario',this.IDusuario);
      console.log('idbluetooth',this.idbluetooth);


    },
    error=>{
    console.log(error);
  });

}




cliente(){
  this.sqlite.create({
    name: 'ntvslite.db',
    location:'default'
  })
  .then((db:SQLiteObject)=>{
    db.executeSql('SELECT * FROM usuarios where log=1',[])
    .then((res)=>{
      this.result=[];

      if(res.rows.length>0){

        for(var i=0;i<res.rows.length;i++){
          this.result.push({idusuario:res.rows.item(i).idusuario});
        }
        console.log('usuario logeado',this.result[0]['idusuario']);
this.loaddata(this.result[0]['idusuario']);

      }else{
       console.log('no logedo');
       this.goiniciarsession();

      }
    console.log(this.result);
    })
    .catch(e =>console.log(e));
  })
  .catch(e => console.log(e));
}
goiniciarsession(){

this.router.navigate(['/iniciarsession']);

}







gomovimientos(){
  this.router.navigate(['mismovimientos']);
}

select(){
  this.sqlite.create({
    name: 'ntvslite.db',
    location:'default'
  })
  .then((db:SQLiteObject)=>{
    db.executeSql('SELECT idusuario,usuario,log FROM usuarios where log=?',['1'])
    .then((res)=>{
      this.result=[];

      if(res.rows.length>0){

        for(var i=0;i<res.rows.length;i++){
          this.result.push({idusuario:res.rows.item(i).idusuario});
        }
        this.presentToast(this.result[0]['idusuario']);

      }else{
        let msg='sql vacio';
       this.presentToast(msg);
      }
      console.log(this.result);




    })
    .catch(e =>console.log(e));
  })
  .catch(e => console.log(e));
}

Cerrarsesion(){
    this.sqlite.create({
      name: 'ntvslite.db',
      location:'default'
    })
    .then((db:SQLiteObject)=>{
      db.executeSql('delete  FROM usuarios where log=1',[])
      .then(()=>{

        this.presentToast('Se cerro sesion');
        this.gologin();

      })
      .catch(e =>console.log(e));
    })
    .catch(e => console.log(e));

}

gologin(){
this.router.navigate(['login']);
}

}
