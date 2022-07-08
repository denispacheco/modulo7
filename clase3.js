//importar librerias o módulos---------------------------------------------
const {Client,Pool}=require('pg');
const express = require('express');
require('dotenv').config();

//crear configuracion------------------------------------------------------
const port = 3000

const configuracion={
    host:process.env.PGHOST,
    port:process.env.PGPORT,
    database:process.env.PGDATABASE,
    user:process.env.PGUSER,
    password:process.env.PGPASSWORD,
    max:20, //conexiones maximas del pool
    idleTimeoutMillis: 3000, //tiempo de espera
    connectionTimeoutMillis: 2000, //tiempo de desconexion
}

//inicializacion-----------------------------------------------------------
const pool=new Pool(configuracion);
const app = express()

//rutas--------------------------------------------------------------------
//obtener la lista de libros desde la bd
app.get('/libros', async (req, res) => {
    const consulta='SELECT l."Nombre" AS "Libro",a."Nombre" AS "Autor", l."Edicion" FROM "Libros" l JOIN "Autores" a ON l."IdAutor"=a."Id" '
    let resultado;
    try{
        resultado= await pool.query(consulta);
        let response={respuesta:resultado.rows};
        res.send(JSON.stringify(response));
    }catch(err){
        console.log(`Error al ejecutar consulta: ${err.message}`);//"Error al ejecutar consulta:" +err.message
        res.status(500);
        res.end('error al buscar datos');
    }
});
//ejecucion del server----------------------------------------------------
app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)    
})

//ejercicios:
//1.- crear rutas para evolver: autores
//2.- cantidad de libros por genero (lista)
//3.- datos de u libro en específico (a traves de la id)<--recibir codigo en la url, a traves de los params o query
//4.- cantidad de copias por libro
//5.- generar un nuevo prestamo (tabajar con postman)<---recibir un json por el body