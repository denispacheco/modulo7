//1.- cargar módulos o librerias
const {Pool} = require("pg");
require('dotenv').config();

//2.- crear la configuracion
const configuracion={
    user: process.env.PGUSER,
    host:process.env.PGHOST,
    database:process.env.PGDATABASE,
    password:process.env.PGPASSWORD
}

//3.- crear la conexion pool
const pool=new Pool(configuracion);

//4.-declarar consultas
const consulta1='INSERT INTO "Autores" VALUES (22,\'Frank Herbert\',\'1920-10-19\',\'EEUU\')';
const consulta2='INSERT INTO "Libros" VALUES (34,\'Dune\',400,1965,22,5,1,1)';

//5.- ejecutar consultas
(async function(){
    try {
        await pool.query("BEGIN");
        await pool.query(consulta1);
        console.log("Autor  insertado existosamente");
        await pool.query(consulta2);
        console.log("Libro  insertado existosamente");
        await pool.query("COMMIT");
    } catch (error) {
        await pool.query("ROLLBACK");
        console.log("Error al ejecutar consultas");
        console.log("Error:"  + error.message);
    }
})();

//ejercicios
//1.-crear un formulario donde se ingrese:
/*
Nombre del libro
Año de Edicion
Nombre del autor
Numero de Páginas
Fecha Nacimiento Autor
Nacionalidad Autor

--para el genero e idioma, usar 1
--para el id, consultar por el MAX(Id) de la tabla correspondiente.
--usar POST para el formulario
SELECT COALESCE(MAX("Id"),0)+1 FROM "Libros"
*/

const express = require('express')
var bodyParser=require('body-parser');

const app = express()
const port = 3000

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:false}));

app.post("/transaccion/insert",async function(req,res){
   
    //query para buscar los id
    const queryIDAutor='SELECT COALESCE(MAX("Id"),0)+1 AS "Id" FROM "Autores"'
    const queryIDLibro='SELECT COALESCE(MAX("Id"),0)+1 AS "Id" FROM "Libros"'
    //ejecucion querys
    const respuestaIdAutor=await pool.query(queryIDAutor);
    const respuestaIdLibro=await pool.query(queryIDLibro);
    //verificacion de datos
    console.log(respuestaIdAutor.rows[0].Id);
    console.log(respuestaIdLibro.rows[0].Id);
    console.log(req.body);
    //query para insertar datos
    const query1='INSERT INTO "Autores" VALUES ($1,$2,$3,$4)';
    const query2='INSERT INTO "Libros" VALUES ($1,$2,$3,$4,$5,1,1,1)';
    //ejecucion insert
    try {
        await pool.query("BEGIN")
        await pool.query(query1,[respuestaIdAutor.rows[0].Id,req.body.autor,req.body.nacimiento,req.body.nacionalidad])
        await pool.query(query2,[respuestaIdLibro.rows[0].Id,req.body.libro,req.body.paginas,req.body.edicion,respuestaIdAutor.rows[0].Id])
        await pool.query("COMMIT")
        res.send("Datos ingresados correctamente");
    } catch (error) {
        await pool.query("ROLLBACK");
        console.log("Error al ejecutar consultas");
        console.log("Error:"  + error.message);
        res.send("error al ingresar los datos");
    }
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))

