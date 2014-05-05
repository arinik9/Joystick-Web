$(document).ready(function(){  
     $(document).scrollTop(0);
    
var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');
var pressed=0;
var click =0;
var a;
var b;
var c;
var d;
var rayonJoystick=200;
var rayonStick=35;
var centreX=200;
var centreY=200;

var socket;
/* RAPPEL
        document.getElementsByTagName("canvas")[0].getBoundingClientRect()    --> pour recuprerr toutes les infos sur l'objer canvas
*/
var leftCanvas = document.getElementsByTagName("canvas")[4].getBoundingClientRect().left;
var topCanvas = document.getElementsByTagName("canvas")[4].getBoundingClientRect().top;


//----------------------------------------------------------------------------------------------------------------------------------------FIN DE LA RECUP'
    
    
//------------------------------------------------------------------------------------------------------------------------------FONCTIONS NECESSAIRES AUX LISTENERS

function keyUnpressed(event)
{
            switch(event.keyCode){
                case 90:
                    $('#canvasUp').removeClass('pressed');
                    break;
                case 81: //TOUCHE Q
                    $('#canvasLeft').removeClass('pressed');
                    break;
                case 83: //TOUCHE S
                    $('#canvasDown').removeClass('pressed');
                    break;
                case 68: //TOUCHE D
                    $('#canvasRight').removeClass('pressed');
                    break;
        }
}

function keyPressed(event)
{
        switch(event.keyCode){
            case 90:
                $('#canvasUp').addClass('pressed');
                $('#canvasDown').removeClass('pressed');
                break;
            case 81: //TOUCHE Q
                $('#canvasLeft').addClass('pressed');
                $('#canvasRight').removeClass('pressed');
                break;
            case 83: //TOUCHE S
                $('#canvasDown').addClass('pressed');
                $('#canvasUp').removeClass('pressed');
                break;
            case 68: //TOUCHE D
                $('#canvasRight').addClass('pressed');
                $('#canvasLeft').removeClass('pressed');

                break;
    }  
}

function unclick(e)
{
    
    pressed=0;
   
    context.beginPath(); //On démarre un nouveau tracé.
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.closePath();
    
    // ON REDESSINE LA ZONE RONDE
    context.beginPath(); //On démarre un nouveau tracé.
    context.arc(centreX, centreY, rayonJoystick, 0, Math.PI*2); //On trace la courbe délimitant notre forme
    context.fillStyle = 'grey';
    context.fill(); //On utilise la méthode fill(); si l'on veut une forme pleine
    context.closePath();
    
    
    context.beginPath();
    context.moveTo(centreX,0);
    context.lineTo(centreX,2*centreX);
    context.strokeStyle = '#ff0000';
    context.stroke();
    context.moveTo(0,centreY);
    context.lineTo(2*centreY,centreY);
    context.strokeStyle = '#ff0000';
    context.stroke();
    context.closePath();
    
    context.beginPath();
    context.fillStyle = 'black';
    context.arc(centreX, centreY, rayonStick, 0, Math.PI*2);
    context.fill();
    context.closePath();
    // alert("HA " + pressed);
   
    
}

function clicked(event)
{
    leftCanvas = document.getElementsByTagName("canvas")[4].getBoundingClientRect().left+$(document).scrollLeft();
    topCanvas = document.getElementsByTagName("canvas")[4].getBoundingClientRect().top+$(document).scrollTop();
    if(Math.sqrt(Math.pow(event.pageX-(leftCanvas+centreX+10),2)+Math.pow(event.pageY-(topCanvas+centreY+10),2))<rayonStick){
        pressed=1;
    }
}

function updateRond(event) //A REVOIR
{
    
    if(pressed==1)
    {
        //ON CLEAR LE CANVAS
        context.beginPath(); //On démarre un nouveau tracé.
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.closePath();
        
       // ON REDESSINE LA ZONE RONDE
        context.beginPath(); //On démarre un nouveau tracé.
        context.arc(centreX, centreY, rayonJoystick, 0, Math.PI*2); //On trace la courbe délimitant notre forme
        context.fillStyle = 'grey';
        context.fill(); //On utilise la méthode fill(); si l'on veut une forme pleine
        context.closePath();
        
        // ON REDESSINE LES TRAITS ROUGE
        context.beginPath();  //pour grill rouge
        context.moveTo(centreX,0);
        context.lineTo(centreX,2*centreX);
        context.strokeStyle = '#ff0000';
        context.stroke();
        context.closePath();
        context.beginPath();  //pour grill rouge
        context.moveTo(0,centreY);
        context.lineTo(2*centreY,centreY);
        context.strokeStyle = '#ff0000';
        context.stroke();
        context.closePath();
        
        if(Math.sqrt(Math.pow(event.pageX-(leftCanvas+centreX+10),2)+Math.pow(event.pageY-(topCanvas+centreY+10),2))>rayonJoystick){ //QUAND LE JOYSTICK SORT
            pressed=0;
            context.beginPath(); //On démarre un nouveau tracé.
            context.fillStyle = 'black';
            context.arc(centreX, centreY, rayonStick, 0, Math.PI*2);
            context.fill(); //On utilise la méthode fill(); si l'on veut une forme pleine
            context.closePath();
        }else
        {
            context.beginPath(); //On démarre un nouveau tracé.
            context.fillStyle = 'black';
            context.arc(event.pageX-leftCanvas-10, event.pageY-topCanvas-10, rayonStick, 0, Math.PI*2); //On trace la courbe délimitant notre forme
            context.fill(); //On utilise la méthode fill(); si l'on veut une forme pleine
            context.closePath();
        }
   }
   
   document.getElementById('zoneText1').innerHTML=event.pageX;
   document.getElementById('zoneText2').innerHTML=leftCanvas;
   document.getElementById('zoneText3').innerHTML=event.pageY;
   document.getElementById('zoneText4').innerHTML=topCanvas;
       
}
//------------------------------------------------------------------------------------------------------------------------------------------FIN FONCTIONS LISTENERS

//------------------------------------------------------------------------------------------------------------------------------------------------FONCTIONS BOUTONS    
   
   /*Referrence: http://www.w3schools.com/jquery/jquery_events.asp*/
   
   //Button for TCP connections
   
    $("#buttonWeb").hover(function(){
    $("#buttonWeb").toggleClass("button-TCP-hover");
    });
   
   
   $("#buttonWeb").click(function(){
        var socket=io.connect('http://192.168.1.67:4040');
        socket.emit('message','a');
   });
   


   
   
   /*******************************************************************************/
   //Button Effect
//     $("#myButton1").hover(function(){ // quand le soruis est sur le bouton, on verifie si la variable click vaut 0 ou 1
//      if(click==0){ /*Connecté*/
//	  $("#myButton1").toggleClass("button-hover-clickZero"); // button-hover-clickZero  et  button-hover-clickUn sont 2 class dans le fichier .css
//      }
//      if(click==1){ /*Déconnecté*/
//	  $("#myButton1").toggleClass("button-hover-clickUn"); 
//      }
//    });
         /*   $('#myButton1').click(function () {
                socket.emit('message', 'Connard');
            });*/

    
   /* document.getElementById('myButton1').onclick=function(){*/
    $("#myButton1").click(function(){
       if(click==0)
       {
      /*      var ws = null;
  ws = new WebSocket('wss://127.0.0.1:4848');
  ws.onopen = function() {
    alert('onopen called');
  };*/
           
            $('body').addClass('connected');
            $('body').removeClass('disconnected');
            $("#myButton1").removeClass("button-deconnecte").addClass("button-connecte");
            document.getElementById('myButton1').value="Déconnexion";
            document.getElementById('zoneText1').innerHTML="Connecté";
            click=1;
       }else{
            $('body').addClass('disconnected');
            $('body').removeClass('connected');
            $("#myButton1").removeClass("button-connecte").addClass("button-deconnecte");
            document.getElementById('myButton1').value="Connexion";
            document.getElementById('zoneText1').innerHTML="Déconnecté";
            click=0;
       }
    });
    
//--------------------------------------------------------------------------------------------------------------------------------------------FIN FONCTIONS BOUTONS   
    
    
//-----------------------------------------------------------------------------------------------------------------------------INITIALISATION GRAPHIQUE DU DOCUMENT  
    
    
    //CREATION DU CERCLE DU JOYSTICK      --> Y'si 121den basliyo. X'si 8den basliyo => A tes souhaits
    context.beginPath(); //On démarre un nouveau tracé.
    context.arc(centreX, centreY, rayonJoystick, 0, Math.PI*2); //On trace la courbe délimitant notre forme
    context.fillStyle = 'grey';
    context.fill(); //On utilise la méthode fill(); si l'on veut une forme pleine
    context.closePath();
    
    //CREATION DES TRAITS
    context.beginPath();   //pour grill rouge
    context.moveTo(centreX,0);
    context.lineTo(centreX,2*centreX);
    context.strokeStyle = '#ff0000';
    context.stroke();
    context.closePath();
    context.beginPath();   //pour grill rouge
    context.moveTo(0,centreY);
    context.lineTo(2*centreY,centreY);
    context.strokeStyle = '#ff0000';
    context.stroke();
    context.closePath();

    document.getElementById('myCanvas').style.borderWidth="10px"; 
    document.getElementById('canvasUp').style.borderWidth="5px"; 
    document.getElementById('canvasDown').style.borderWidth="5px"; 
    document.getElementById('canvasLeft').style.borderWidth="5px"; 
    document.getElementById('canvasRight').style.borderWidth="5px"; 

    //CREATION DU STICK       --> cember 133 ile 183 arasinda, koordinati. Y'si 245den basliyp
    context.beginPath(); //On démarre un nouveau tracé.
    context.fillStyle = 'black';
    context.arc(centreX, centreY, rayonStick, 0, Math.PI*2); //On trace la courbe délimitant notre forme
    context.fill(); //On utilise la méthode fill(); si l'on veut une forme pleine
    context.closePath();

//-------------------------------------------------------------------------------------------------------------------------------FIN DE L'INITIALISATION GRAPHIQUE


document.addEventListener("mousemove", updateRond , false);
canvas.addEventListener("mousedown",clicked , false);


document.addEventListener("mouseup", unclick, false);

document.addEventListener("keydown",keyPressed ,false);
document.addEventListener("keyup",keyUnpressed,false);
    

    
});


