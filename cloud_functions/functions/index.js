const functions = require('firebase-functions');
const admin = require('firebase-admin');


//Inicia la configuración de la base de datos.
admin.initializeApp(functions.config().firebase);



exports.createToken = functions.https.onRequest((request,response)=>{
    //Para aceptar las peticiones 
    response.header('Access-Control-Allow-Origin','*');
    response.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    response.header('Access-Control-Allow-Methods','GET, POST, OPTIONS, PUT, DELETE');
    response.header('Allow','GET, POST, OPTIONS, PUT, DELETE');

    
    var body = request.body;

    let {correo,token_id} = body;

    if(!request.header("authorization")){
        response.status(500).send({error:true,msg:"Token id requerido."});
    }else{
        if(!correo){
            response.status(500).send({error:true,msg:"Correo requerido."});
        }else{
            admin.auth().verifyIdToken(request.header.authorization).then((decode)=>{
                //Crea un random de 6 números
                //Si deseas uno de 5
                //Math.floor(Math.random()*90000) + 10000;
                var random = Math.floor(Math.random()*900000) + 100000;

                //Guarda la información en la base de firebase
                admin.database().ref(`/token/${correo}`).set({token:random}).then(()=>{
                    res.status(200).send({error:false,token:random});
                }).catch((error)=>{
                    res.status(403).send({error:true,msg:"Ocurrio algo inesperado vuelve a intentarlo."});
                })
                
            }).catch((error)=>{
                res.status(403).send({error:true,msg:"Sin autorizacion"});
            });
        }
    }

});


exports.validateToken = functions.https.onRequest((request,response)=>{

    //PAra aceptar las peticiones 
    response.header('Access-Control-Allow-Origin','*');
    response.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    response.header('Access-Control-Allow-Methods','GET, POST, OPTIONS, PUT, DELETE');
    response.header('Allow','GET, POST, OPTIONS, PUT, DELETE');

    var body = request.body;

    let {token,correo} = body;

    if(!request.header("authorization")){
        response.status(500).send({error:true,msg:"Token id requerido."});
    }else{
        if(!correo){
            response.status(500).send({error:true,msg:"Correo requerido."});
        }else{
            admin.auth().verifyIdToken(token_id).then((decode)=>{

                let ref =  admin.database().ref(`/token/${correo}/${token}`);
                //Lee la informacion
                ref.once('value').then((snapshot)=>{
                    if(snapshot.val()){
                        //Eliminamos la información de la base de datos.
                        ref.remove().then(()=>{
                            res.status(200).send({error:false});
                        }).catch((error)=>{
                            res.status(403).send({error:true,msg:"Ocurrio algo inesperado vuelve a intentarlo."});
                        });

                    }else{
                        res.status(404).send({error:true,msg:"Token Incorrecto."});
                    }
                    
                }).catch((error)=>{
                    res.status(403).send({error:true,msg:"Ocurrio algo inesperado vuelve a intentarlo."});
                });
                
            }).catch((error)=>{
                res.status(403).send({error:true,msg:"Sin autorizacion"});
            });
        }
    }


})