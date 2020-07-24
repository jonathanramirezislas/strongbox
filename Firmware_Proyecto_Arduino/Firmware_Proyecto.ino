
#include <Keypad.h> // Controla el teclado
#include <LiquidCrystal.h>  //controla el LCD
#include <Servo.h>  //Control del servomotor
#include <EEPROM.h>  //COntrola E/S EEPROM
#define CERRAR 90 //Calibrar a gusto la pos del servomotor cerrado
#define ABRIR 180 //Calibrar a gusto la pos del servomotor abierto
//*****************************************
//*** Declaracion de variables locales*****
//*****************************************

bool Puerta=false;


Servo seguro;   //servomotor
LiquidCrystal lcd(2, 3, 4, 5, 6, 7); //display LCD
const byte filas = 4;
const byte columnas = 4;
byte pinsFilas[filas] = {9, 10, 11, 12};
byte pinsColumnas[columnas] = {14, 15, 16, 17};
char teclas[filas][columnas] =  {
  {'1', '2', '3', 'A'},                       // Declaración del teclado
  {'4', '5', '6', 'B'},
  {'7', '8', '9', 'C'},
  {'*', '0', '#', 'D'},
};
Keypad teclado = Keypad(makeKeymap(teclas), pinsFilas, pinsColumnas, filas, columnas);
char password[5]; //almacena la contraseña en eeprom
char ingreso;  //ingreso del usuario
char passUser[4];
char confirmPass[4];  //confirmacion de la contraseña
//char ca[7] = {'3', '7', '1', '9', 'A'}; //clave admin establecida
//char cal[7];   // Clave admin leida
//int contador = 0; //Lleva la posicion del array
//int cursorr = 6; //Lleva la posicion del cursor
//int comp;  // comparacion entre 2 arrays
int i=0;
int a; //aux
int t=0;

#include <SoftwareSerial.h> 
SoftwareSerial ModBluetooth(1, 0); // RX | TX 
int ledPin=8;   // Led de bluetooth


void setup() {


      pinMode(ledPin,OUTPUT);
      ////=digitalWrite(ledPin,LOW);
    ModBluetooth.begin(9600); 
    Serial.begin(9600);  
    
    ModBluetooth.println("MODULO CONECTADO");  
    ModBluetooth.print("#");
  
  pinMode(19, OUTPUT); // LEDS QUE INDICAN ABIERTO(13) O CERRADO(19)
  pinMode(13, OUTPUT);
  pinMode(8, OUTPUT);
  digitalWrite(19, HIGH); //enciende el led de cerrado
  seguro.attach(18);  // Pin del servomotor
  seguro.write(CERRAR);
  lcd.begin(16, 2);   //Configuracion lcd 16X2 (columnas,fila)
  seguro.write(90);  //Cerrar puerta
  lcd.setCursor(0, 0);
  lcd.print("  **PASSWORD** ");
  lcd.setCursor(5, 1);
  lcd.print("____");
  //LEER CONTRASEÑA DE LA EEPROM 

//        error if(password[4]!='Z'){     
    //correción
    if(EEPROM.read(4)!='Z'){
    EEPROM.write(0,'1');
    EEPROM.write(1,'2');
    EEPROM.write(2,'3');
     EEPROM.write(3,'4');
    EEPROM.write(4,'Z'); 
  }
   for (int i = 0; i <= 4; i++) { 
    password[i] = EEPROM.read(i);
  }              
  
}//fin del setup

void loop() {

 bluet();
 

 
}



void bluet(){


     if (Serial.available())
  {

    char dato=Serial.read();
    Serial.println(dato);
 if(dato=='1'){
 
        ModBluetooth.print("LED ENCENDIDO"); 
        Serial.print("LED ENCENDIDO");
           seguro.write(ABRIR);
               digitalWrite(ledPin,HIGH);

  }else{       
        ModBluetooth.print("LED APAGADO"); 
         seguro.write(CERRAR);
      Serial.print("LED APAGADO");
       digitalWrite(ledPin,LOW);

    }

  }
  
}
 




////////////////////////////////////////////

void leerIngreso(int a) {





  
  if(t==3){
    lcd.setCursor(0, 0);
    lcd.print("Bloq. por 1 min");
    delay(60000);
    lcd.setCursor(0, 0);
    lcd.print("  **PASSWORD** ");
    t=0;
  }
    
  
  else{
  ingreso = teclado.getKey();
  if (ingreso != NO_KEY)
    switch (ingreso) {
      case 'A':    // es como el "enter" para introducir la password
        if(evaluar(1)==1){
         //  correcto();
         bluet();
        }
        
        else{
          t++;
        msgError();
        }
        reset();
        break;
        
      case 'B':
        informacion();  //muestra en el lcd las opcionesde la caja fuerte
        reset();
        break;
        
      case 'C':
        cambioPass();
        reset();
        break;
      case 'D':
        digitalWrite(13, LOW);
        digitalWrite(19, HIGH);
        seguro.write(CERRAR);
        lcd.setCursor(0, 0);
        lcd.print("Presionaste D");
        delay(2000);
        reset();
        break;
      case '*':
        lcd.setCursor(0, 0);
        lcd.print("Presionaste *");
        delay(2000);
        reset();
        break;
      case '#':
        lcd.setCursor(0, 0);
        lcd.print("Presionaste #");
        delay(2000);
        reset();
        break;
      default: //si es un numero debe imprimirlo en el LCD y ademas guardarlo en el arreglo passUser
        if(a==1){
        passUser[i] = ingreso;
        printPass(passUser[i], 5 + i, 1);
        }
        if(a==2){
        confirmPass[i] = ingreso;
        printPass(confirmPass[i], 5 + i, 1);
        }
        i++;
        if (i > 3)
          i = 0;
    } 
}







}

void cleanlcd() {
  lcd.setCursor(0, 0);
  lcd.print("                ");
  lcd.setCursor(0, 1);
  lcd.print("                ");
}


void printPass(char a, int columna, int fila ) {
  lcd.setCursor(columna, fila);
  lcd.print(a);
  delay(500);
  lcd.setCursor(columna, fila);
  lcd.print("*");
}

int evaluar(int a) {
  int j = 0;
  if (a==1){
  for (int i = 0; i <= 3; i++) {
    if (password[i] == passUser[i]) {
        j++;
    }
  }
  }
  if(a==2){
  for (int i = 0; i <= 3; i++) {
    if (passUser[i] == confirmPass[i]) {
        j++;
    }
  }
  }
  if (j == 4) {
    return j=1;
  }
  else {
    return j=0;
  }
}


void reset() {
  lcd.setCursor(0, 0);
  lcd.print("  **PASSWORD** ");
  lcd.setCursor(5, 1);
  lcd.print("____");
  for(int i =0;i<=3;i++){
  passUser[i]=NO_KEY;
  confirmPass[i]=NO_KEY;
  }
  i=0;
}

void msgError(){
  digitalWrite(13, LOW);
  digitalWrite(8, LOW);
  lcd.setCursor(0, 0);
        lcd.print("Pass Incorrecto");
  for(int i = 0; i <= 7; i++ )
{
  digitalWrite(19, HIGH);
  delay(200);
  digitalWrite(19, LOW);
  delay(100);
}
        delay(500);
    digitalWrite(19, HIGH);
  }

void correcto(){
        t=0;
        lcd.setCursor(0, 0);
        lcd.print("     CORRECTO      ");
        digitalWrite(19, LOW);
        digitalWrite(13, HIGH);
        //Abrir servomotor
        seguro.write(ABRIR);
        delay(500);
}

  
void informacion() {
  lcd.setCursor(0, 0);
  lcd.print("'A' para introdu");
  delay(2000);
  lcd.setCursor(0, 0);
  lcd.print("cir la pass        ");
  delay(2000);
  lcd.setCursor(0, 0);
  lcd.print("'C' para cambiar");
  delay(2000);
  lcd.setCursor(0, 0);
  lcd.print(" la pass             ");
  delay(2000);
}



void cambioPass() {
  digitalWrite(19, LOW);
  digitalWrite(13, LOW);
  digitalWrite(8, HIGH);
   lcd.setCursor(0, 0);
  lcd.print("Cambio de pass    ");
  delay(2000);
  lcd.setCursor(0, 0);
  lcd.print("Introduce pass     ");
  delay(2000);
  lcd.setCursor(0, 0);
  lcd.print("anterior        ");
  delay(2000);  
  reset();
   while(passUser[3]==NO_KEY){
    leerIngreso(1);}
  if (evaluar(1) == 1) {
    lcd.setCursor(0, 0);
    lcd.print("Introduce           ");
    delay(2000);
    lcd.setCursor(0, 0);
    lcd.print("la pass nueva            ");
    delay(2000);
    reset();
    while(passUser[3]==NO_KEY){
      leerIngreso(1);
  }
    lcd.setCursor(0, 0);
    lcd.print("Vuelve a intro     ");
    delay(2000);
    lcd.setCursor(0, 0);
    lcd.print("ducirla           ");
    delay(2000);    
    lcd.setCursor(0, 0);
    lcd.print("  **PASSWORD**      ");
    lcd.setCursor(5, 1);
    lcd.print("____");
    lcd.setCursor(0, 0);
    i=0;
    while(confirmPass[3]==NO_KEY){
      leerIngreso(2);
  }
    if(evaluar(2)==1){
      // funcion de EEPROM
      for (int i = 0; i <= 3; i++) { 
         EEPROM.write(i, passUser[i]);
    }
      for (int i = 0; i <= 3; i++) { 
         password[i] = EEPROM.read(i);
  }
  digitalWrite(19, LOW);
  digitalWrite(8, LOW);
  digitalWrite(13, HIGH);
      lcd.setCursor(0, 0);
      lcd.print("Password cam  ");
      delay(2000);
      lcd.setCursor(0, 0);
      lcd.print("biada           ");
      delay(2000);
    }
    else{
  digitalWrite(8, LOW);
  digitalWrite(13, LOW);
  digitalWrite(19, HIGH);
      lcd.setCursor(0, 0);
      lcd.print("Error las pass   ");
      delay(2000);
      lcd.setCursor(0, 0);
      lcd.print("no coinciden        ");
      delay(2000);
    }
    
  }
  else {
    msgError();
  }
  digitalWrite(8, LOW);
  digitalWrite(13, LOW);
  digitalWrite(19, HIGH);
  reset();
}

void passChange(){
 for(int i=0;i<=3;i++){
   password[i]=passUser[i];
 }
  
}
