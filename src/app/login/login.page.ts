import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import{ HttpClient} from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  db:SQLiteObject=null;
  idusuario:any;
  result:any[]=[];

  ionViewWillEnter(){
  this.create();
  this.session();
  }

    constructor(public sqlite: SQLite,public toastController: ToastController,public router:Router,private http:HttpClient){}


    signupform: FormGroup;
    userData = {  "password": "", "email": "" };
  
  
  
    ngOnInit() {
      let EMAILPATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      this.signupform = new FormGroup({
        password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]),
        email: new FormControl('', [Validators.required, Validators.pattern(EMAILPATTERN)]),
      });
    }
  
  
  
  
    registro(){
  
  
       this.router.navigateByUrl('/registro');
  
   }
   recoverpas(){
  
  
      this.router.navigateByUrl('/recoverpass');
  
  }
  
  
  
  
  //sqllite
  
  login(){
  
      var email  =  (<HTMLInputElement>document.getElementById("email")).value;
      var password  =  (<HTMLInputElement>document.getElementById("password")).value;
      var senData= JSON.stringify({email:email,password:password});
      console.log('entro a login',senData);
      this.http.post('http://proyectosita.com/itahotelcaja/login.php',senData)
      .subscribe(data=>{
        console.log(data);
    this.presentToast(data['id_cliente']);
          if(data!=0){
          var id :number=data['id_cliente'];
          this.presentToast(id);
            this.check(id);
          }else{
            this.presentToast('email y/o contraseña incorrectos');
          }
        },
        error=>{
        this.presentToast('problemas de  conexion');
      });
    }
  
    gohome(){
    this.router.navigate(['/home']);//home
  
    }
  
  
  
  
  
  create(){
  
    this.sqlite.create({
      name: 'ntvslite.db',
      location:'default'
    })
    .then((db:SQLiteObject)=>{
      db.executeSql('CREATE TABLE usuarios (idusuario int(11) NOT NULL,email varchar(20) NOT NULL,password varchar(50) NOT NULL,log int(11) NOT NULL)',[])
      .then(()=>{
      })
      .catch(e =>console.log(e));
    })
    .catch(e => console.log(e));
  
  }
  
  insert(id:any){
    var email  =  (<HTMLInputElement>document.getElementById("email")).value;
    var password  =  (<HTMLInputElement>document.getElementById("password")).value;
  
    this.sqlite.create({
      name: 'ntvslite.db',
      location:'default'
    })
    .then((db:SQLiteObject)=>{
  
      db.executeSql('INSERT INTO usuarios (idusuario, email, password, log) VALUES (?,?,?,?);',[id,email,password,'1'])
      .then(()=>{
        console.log('Element Inserted');
  
        console.log('se creo ususario en sqlite');
  this.gohome();
      })
      .catch(e =>console.log(e));
    })
    .catch(e => console.log(e));
  }
  
  
  
  
  
  check(id:any){
    this.sqlite.create({
      name: 'ntvslite.db',
      location:'default'
    })
    .then((db:SQLiteObject)=>{
      db.executeSql('SELECT * FROM usuarios where idusuario=?',[id])
      .then((res)=>{
        this.result=[];
  
        if(res.rows.length>0){
  
          for(var i=0;i<res.rows.length;i++){
            this.result.push({email:res.rows.item(i).email,password:res.rows.item(i).password});
          }
          this.presentToast('se encuentra en bd ya');
          this.validar(id,this.result[0]['email'],this.result[0]['password']);
  
        }else{
         this.insert(id);
  
        }
        console.log(this.result);
  
  
  
  
      })
      .catch(e =>console.log(e));
    })
    .catch(e => console.log(e));
  }
  
  
  validar(id:any,email:any,password:any){
  
  
    var senData= JSON.stringify({email:email,password:password});
  
    this.http.post('http://proyectosita.com/itahotelcaja/login.php',senData)
    .subscribe(data=>{
        console.log(data,'data');
  
        if(data!=0){
         
          this.gohome();
        }else{
          this.presentToast('Se cambio contraseña contraseña ');
          this.eliminar(id);
        }
      },
      error=>{
      console.log(error);
    });
  
  }
  
  
  
  
  eliminar(id:any){
    this.sqlite.create({
      name: 'ntvslite.db',
      location:'default'
    })
    .then((db:SQLiteObject)=>{
      db.executeSql('delete  FROM usuarios where idusuario=?',[id])
      .then(()=>{
  
        this.presentToast('Se elimino');
        console.log('se elimino de sqlite');
  
      })
      .catch(e =>console.log(e));
    })
    .catch(e => console.log(e));
  }
  
  
  
  
  
  session(){
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
            this.result.push({idusuario:res.rows.item(i).idusuario,email:res.rows.item(i).email,password:res.rows.item(i).password});
          }
         this.validar(this.result[0]['idusuario'],this.result[0]['email'],this.result[0]['password']);
        }else{
  
        }
  
  
  
  
      })
      .catch(e =>console.log(e));
    })
    .catch(e => console.log(e));
  }
  
  async presentToast(msg) {
        const toast = await this.toastController.create({
          message: msg,
          duration: 2000
        });
        toast.present();
      }
  
  
  
     
  
  
        //ver constraseña
          isActiveToggleTextPassword: Boolean = true;
          public toggleTextPassword(): void{
              this.isActiveToggleTextPassword = (this.isActiveToggleTextPassword==true)?false:true;
          }
          public getType() {
              return this.isActiveToggleTextPassword ? 'password' : 'text';
          }
  
  
  
  }
  