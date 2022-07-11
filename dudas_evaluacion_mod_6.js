const express = require('express')
const app = express()
const port = 3000
const fs=require('fs');


function leerArchivo1(){
    let resultado=fs.readFileSync('datos1.txt').toString();        
        console.log(resultado);
        return resultado;    
}
function leerArchivo2(){
    let resultado=fs.readFileSync('datos2.txt').toString();        
        console.log(resultado);
        return resultado;    
}

app.get('/', (req, res) => {
    fs.readFile("html/dudas_evaluacion_mod_6.html",function(err,data){
        if(err){
            console.log("Error al leer archivo:" + err.message);
        }else{
            let html=data.toString();
            html=html.replace(" __primeraSeccion__",leerArchivo1());
            html=html.replace(" __segundaSeccion__",leerArchivo2());
            res.send(html);
        }  
    })
})
var bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));

app.post('/gasto',function(req,res){
    let gasto={
        id : new Date(),
        usuario : req.body.id,
        gasto:req.body.valor
    };
    fs.appendFile('gatos.txt',JSON.stringify(gasto)+"\n",function(err){
        if(err){
            console.log("Error al leer archivo:" + err.message);
        }
    })
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))