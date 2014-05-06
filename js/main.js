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


var connexion=0;
var fleche="false"; //Pour récuperer les infos de joyStick pour envoyer au server
var droite=-1;//Pour récuperer les infos de joyStick pour envoyer au server
var avant=-1;//Pour récuperer les infos de joyStick pour envoyer au server
var startedFonctionKey=0;
var startedFonctionMouse=0;
var VitesseRotation=55;
var vitesseAltitude=35;
var keyFIFO = new Array(0); //length = 0
var mouseFIFO = new Array(0); //length = 0

var flag1=false;
var flag2=false;
var flag3=false;
var flag4=false;
var socket;

/* RAPPEL
        document.getElementsByTagName("canvas")[0].getBoundingClientRect()    --> pour recuprerr toutes les infos sur l'objer canvas
*/
var leftCanvas = document.getElementsByTagName("canvas")[4].getBoundingClientRect().left;
var topCanvas = document.getElementsByTagName("canvas")[4].getBoundingClientRect().top;

socket = io.connect('http://localhost:4040');	

//----------------------------------------------------------------------------------------------------------------------------------------FIN DE LA RECUP'
 
    
//------------------------------------------------------------------------------------------------------------------------------FONCTIONS NECESSAIRES AUX LISTENERS

function keyUnpressed(event)
{
	while (keyFIFO.length != 0){
    keyFIFO.shift();
	}

if(event.keyCode == 90){
$('#canvasUp').removeClass('pressed');
fleche="false";
startedFonctionKey=0;
flag1=false;
}
if(event.keyCode == 81){
$('#canvasLeft').removeClass('pressed');
fleche="false";
startedFonctionKey=0;
flag2=false;
}
if(event.keyCode == 83){
$('#canvasDown').removeClass('pressed');
fleche="false";
startedFonctionKey=0;
flag3=false;
}
if(event.keyCode == 68){
$('#canvasRight').removeClass('pressed');
fleche="false";
startedFonctionKey=0;
flag4=false;
}

           /* switch(event.keyCode){
                case 90:
                    $('#canvasUp').removeClass('pressed');
					fleche="false";
					startedFonctionKey=0;
					flag1=false;
					alert('flag1 false');
                    break;
                case 81: //TOUCHE Q
                    $('#canvasLeft').removeClass('pressed');
					fleche="false";
					startedFonctionKey=0;
                    break;
                case 83: //TOUCHE S
                    $('#canvasDown').removeClass('pressed');
					fleche="false";
					startedFonctionKey=0;
                    break;
                case 68: //TOUCHE D
                    $('#canvasRight').removeClass('pressed');
					fleche="false";
					startedFonctionKey=0;
					flag2=false;
					alert('flag2 false');
                    break;
        }*/
}

function keyPressed(event)
{

if(event.keyCode == 90){ //TOUCHE Z
flag1=true;
$('#canvasUp').addClass('pressed');
$('#canvasDown').removeClass('pressed');
fleche="z";
}
else if(event.keyCode == 81){ //TOUCHE Q
flag2=true;
$('#canvasLeft').addClass('pressed');
$('#canvasRight').removeClass('pressed');
fleche="q";
}
else if(event.keyCode == 83){ //TOUCHE S
flag3=true;
$('#canvasDown').addClass('pressed');
$('#canvasUp').removeClass('pressed');
fleche="s";
}
else if(event.keyCode == 68){ //TOUCHE D
flag4=true;
$('#canvasRight').addClass('pressed');
$('#canvasLeft').removeClass('pressed');
fleche="d";
}

if(flag1 == true && flag2 == true){ // Z et Q
fleche="zq";
}
else if(flag1 == true && flag4 == true){ // Z et D
fleche="zd";
}
else if(flag3 == true && flag2 == true){ // S et Q
fleche="sq";
}
else if(flag3 == true && flag4 == true){ // S et D
fleche="sd";
}
 /*switch(event.keyCode){
            case 90 : //TOUCHE Z
                $('#canvasUp').addClass('pressed');
                $('#canvasDown').removeClass('pressed');
				fleche="z";
                break;
            case 81: //TOUCHE Q
                $('#canvasLeft').addClass('pressed');
                $('#canvasRight').removeClass('pressed');
				fleche="q";
                break;
            case 83: //TOUCHE S
                $('#canvasDown').addClass('pressed');
                $('#canvasUp').removeClass('pressed');
				fleche="s";
                break;
            case 68: //TOUCHE D
                $('#canvasRight').addClass('pressed');
                $('#canvasLeft').removeClass('pressed');
				fleche="d";
    }  */

	appelerFonctionKey(fleche);//Pour récuperer les infos de joyStick pour envoyer au server
}

function unclick(e)
{
    
    pressed=0;
	droite=-1;//Pour récuperer les infos de joyStick pour envoyer au server
	avant=-1;//Pour récuperer les infos de joyStick pour envoyer au server
	startedFonctionMouse=0;//Pour récuperer les infos de joyStick pour envoyer au server
	
	while (mouseFIFO.length != 0){
    mouseFIFO.shift();
	}
	
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
			droite=-1;//Pour récuperer les infos de joyStick pour envoyer au server
			avant=-1;//Pour récuperer les infos de joyStick pour envoyer au server
			startedFonctionMouse=0;//Pour récuperer les infos de joyStick pour envoyer au server
			
			while (mouseFIFO.length != 0){
				mouseFIFO.shift();
			}
			
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
			
			droite = (event.pageX-(leftCanvas+centreX+10))/2;//Pour récuperer les infos de joyStick pour envoyer au server
			avant = ((topCanvas+centreY+10)-event.pageY)/2;//Pour récuperer les infos de joyStick pour envoyer au server
			appelerFonctionMouse(avant, droite);//Pour récuperer les infos de joyStick pour envoyer au server
			
			//var socket = io.connect('http://localhost:4040');
			//socket.emit('message',"avant= "+avant+" - droite= "+droite);
        }
   }
   
   document.getElementById('zoneText1').innerHTML=event.pageX;
   document.getElementById('zoneText2').innerHTML="droite: "+droite;
   document.getElementById('zoneText3').innerHTML=event.pageY;
   document.getElementById('zoneText4').innerHTML="avant: "+avant;
   
   
       
}
//------------------------------------------------------------------------------------------------------------------------------------------FIN FONCTIONS LISTENERS

//------------------------------------------------------------------------------------------------------------------------------------------------FONCTIONS BOUTONS    
   
   /*Referrence: http://www.w3schools.com/jquery/jquery_events.asp*/
   
   //Button for TCP connections
   
    $("#buttonWeb").hover(function(){
    $("#buttonWeb").toggleClass("button-TCP-hover");
    });
   
   
   $("#buttonWeb").click(function(){
   if(connexion == 0){
		connexion=1;

		}
	else{
	connexion = 0;
		//socket.disconnect();
	}
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


//--------------------------------------------------------------------------------------------------------------------------------------
    
	
function appelerFonctionKey(fleche){
var cmd="";
	if(fleche == "z"){
		cmd=" "+vitesseAltitude+" 0";
	}
	else if(fleche == "zd" ){
		cmd=" "+vitesseAltitude+" "+VitesseRotation;
	}
	else if(fleche == "zq"){
		cmd=" "+vitesseAltitude+" "+VitesseRotation*(-1);
	}
	else if(fleche == "s"){
		cmd=" "+vitesseAltitude*(-1)+" 0";
	}
	else if(fleche == "sd"){
		cmd=" "+vitesseAltitude*(-1)+" "+VitesseRotation;
	}
	else if(fleche == "sq"){
		cmd=" "+vitesseAltitude*(-1)+" "+VitesseRotation*(-1);
	}	
	else if(fleche == "q"){
		cmd=" 0 "+VitesseRotation*(-1);
	}
	else if(fleche == "d"){
		cmd=" 0 "+VitesseRotation;
	}
	else if(fleche == "false"){
		cmd=" 0 0"; //espace + zero
	}

if(startedFonctionKey==0 && startedFonctionMouse==0){ // si c'est l'un des fleches qui est pressé premierement
startedFonctionKey=1;
}
if(startedFonctionKey==1 && startedFonctionMouse==0){ // si c'est l'un des fleches qui est pressé premierement
envoyerDonneesAuServer(startedFonctionKey,cmd);
}
//else{
	//keyFIFO.push(cmd);
//}

}

function appelerFonctionMouse(avant, droite){
var cmd="";

if(startedFonctionMouse==0 && startedFonctionKey==0){
startedFonctionMouse=2;
}
if(startedFonctionMouse==2 && startedFonctionKey==0){ // si c'est le rond de joystick est bougé premierement
cmd="SET CMD "+avant+" "+droite;
envoyerDonneesAuServer(startedFonctionMouse,cmd);
}
//else{
//mouseFIFO.push(cmd);
//}
}

function envoyerDonneesAuServer(startedFonction,cmd){
var commande="";
if(startedFonction == 1){ //startedFonctionKey
	if(avant != -1 && droite == -1){
		commande="SET CMD "+avant+" 0"+cmd;
	}
	else if(avant == -1 && droite != -1){
		commande="SET CMD 0 "+droite+cmd;
	}
	else if(avant != -1 && droite != -1){
		commande="SET CMD "+avant+" "+droite+cmd;
	}
	else{
		commande="SET CMD 0 0"+cmd;
	}
}
if(startedFonction == 2){ //startedFonctionMouse
	//if(startedFonctionKey == 0){
	//	commande=cmd+" 0 0";
	//}
	
	//flag1=z
	//flag2=a
	//flag3=s
	//flag4=d
	if(flag1 == true && flag2 == false && flag4 == false){
		commande=cmd+" "+vitesseAltitude+" 0";
	}
	else if(flag1 == true && flag2 == true && flag4 == false){
		commande=cmd+" "+vitesseAltitude+" "+VitesseRotation;
	}
	else if(flag1 == true && flag2 == false && flag4 == true){
		commande=cmd+" "+vitesseAltitude+" "+VitesseRotation*(-1);
	}
	else if(flag3 == true && flag2 == false && flag4 == false){
		commande=cmd+" "+vitesseAltitude*(-1)+" 0";
	}
	else if(flag3 == true && flag2 == true && flag4 == false){
		commande=cmd+" "+vitesseAltitude*(-1)+" "+VitesseRotation;
	}
	else if(flag3 == true && flag2 == false && flag4 == true){
		commande=cmd+" "+vitesseAltitude*(-1)+" "+VitesseRotation*(-1);
	}
	else if(flag2 == false && flag4 == true){
		commande=cmd+commande+" 0 "+VitesseRotation*(-1);
	}
	else if(flag2 == true && flag4 == false){
		commande=cmd+" 0 "+VitesseRotation;
	}
	else{
		commande=cmd+" 0 0";
	}
}

 socket.emit('message',commande);

}
	

});




