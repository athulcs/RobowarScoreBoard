
#include <Stepper.h>

const int stepsPerRevolution = 500;  // change this to fit the number of steps per revolution
// for your motor

// initialize the stepper library on pins 8 through 11:
Stepper myStepper(stepsPerRevolution, 8, 9, 10, 11);
int a=0,b=0;
void setup() {
  pinMode(7,INPUT);
  pinMode(6,OUTPUT);
  // set the speed at 60 rpm:
  myStepper.setSpeed(80);
  // initialize the serial port:
  Serial.begin(9600);
}

void loop() {
  // step one revolution  in one direction:
//a=digitalRead(7);
//if (a==1)
//{
  //Serial.println("clockwise");
  //myStepper.step(stepsPerRevolution);
 // delay(500);
//}
//if (a==0)
//{ 
//   step one revolution in the other direction:
  Serial.println("counterclockwise");
  myStepper.step(-stepsPerRevolution);
 // delay(500);
//}
}
