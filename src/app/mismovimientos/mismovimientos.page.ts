import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import{ HttpClient} from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { HTTP } from '@ionic-native/http/ngx';

@Component({
  selector: 'app-mismovimientos',
  templateUrl: './mismovimientos.page.html',
  styleUrls: ['./mismovimientos.page.scss'],
})
export class MismovimientosPage implements OnInit {

  constructor(private https: HTTP,public toastController: ToastController,public router:Router,private http:HttpClient){}

    ngOnInit() {
    }



      historia:any;

        ionViewWillEnter(){
        this.loaddata();
      }


      loaddata(){

var id=1;
            var senData= JSON.stringify({idusuario:id});

      console.log('datos a search',senData);
      //http://192.168.100.238/Strongbox/mismovimientos.php
      this.http.post('http://proyectosita.com/itahotelcaja/mismovimientos.php',senData)
      .subscribe(data=>{
          console.log(data,'data');

    this.historia=data;


        },
        error=>{
this.presentToast('error');
      });


      }


      async presentToast(msg) {
         const toast = await this.toastController.create({
           message: msg,
           duration: 2000
         });
         toast.present();
       }




}
