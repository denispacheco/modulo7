//imprtar librerias o módulos
const {Client,Pool}=require('pg');
require('dotenv').config();

//crear configuracion
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

//inicializacion
const pool=new Pool(configuracion);

//1.- consulta de prueba con CALLLBACK
const sql='SELECT * FROM "Libros"'
pool.query(sql,function(err,res){
    if(err){
        console.log("Error:"+err.message);
    }else{
        console.log("count 1 :" + res.rowCount);
        console.log("-------------------------------------");
    }
})

//2.- consulta SIN CALLBACK -- usar try-catch para capturar errores
async function ejecutarConsulta(){
    let respuesta= await pool.query('SELECT * FROM "Libros"');
    console.log("count 2 :"+respuesta.rowCount);
    console.log("-------------------------------------");
}
ejecutarConsulta();

///3.- consulta con parámetros
pool.query('SELECT * FROM "Libros" WHERE "Paginas">$1',[500],function(err,res){
    if(err){
        console.log("Error:"+err.message);
    }else{
        console.log("count 3 :" + res.rowCount);
        console.log("-------------------------------------");
    }
})
//4.-función asíncrona con parámetros
const query4='SELECT * FROM "Libros" WHERE "Paginas">$1 AND "Edicion">$2';
const parametros=[500,2000]
async function ejecutarConsulta4(){
    let respuesta= await pool.query(query4,parametros);
    console.log("count 4 :"+respuesta.rowCount);
    console.log("-------------------------------------");
}
ejecutarConsulta4();

//5.- query con objeto
const query5={
    text:'SELECT * FROM "Libros" WHERE "Paginas">$1 AND "Edicion">$2',
    values:[500,2000]
}
pool.query(query5,function(err,res){
    if(err){
        console.log("Error:"+err.message);
    }else{
        console.log("count 5 :" + res.rowCount);
        console.log("-------------------------------------");
    }
})

//ejercicios

//ejercicio 2
//obtener una lista donde se indique la cantidad de libros por género
const query_ej2='SELECT g."Nombre", COUNT(l."Id") FROM "Genero" g LEFT JOIN "Libros" l ON l."IdGenero"=g."Id" GROUP BY g."Nombre"'
pool.query(query_ej2,function(err,res){
    if(err){
        console.log("Error:"+ err.message);
    }else{
        console.table(res.rows);
    }
})


//ejercicio 1.- 
//agregar un nuevo autor y 2 libros de su autoría.
//solucion alexis
async function agregarAutor(id,Nombre,FechaNacimiento,Nacionalidad){
    const query='INSERT INTO "Autores" VALUES ($1,$2,$3,$4)';
    const parametros=[id,Nombre,FechaNacimiento,Nacionalidad];
    let respuesta=await pool.query(query,parametros);
    console.log("respuesta insert autor:" + respuesta);
    console.log("----------------------------");
}

//const parametrose = [33,'Love Poems',700,1952,1,2,1,1];
async function agregarLibro(id,nombre,paginas,edicion,idAutor,idEditorial,idGenero,idIdioma){
    const query = 'INSERT INTO "Libros" VALUES($1,$2,$3,$4,$5,$6,$7,$8)';
    const parametros = [id,nombre,paginas,edicion,idAutor,idEditorial,idGenero,idIdioma];
    let respuesta = await pool.query(query,parametros);
    console.log("respuesta Insert Libro : "+ respuesta);
    console.log("----------------------------");
}

async function ejecutar(){
    try{
        await agregarAutor(21,'Baldomero lillo','1867-01-06',"Chileno");
        await agregarLibro(32,"Sub Terra",300,1904,21,5,4,1);
        await agregarLibro(33,"Sub Sole",400,1907,21,5,4,1);
    }catch(err){
        console.log("error al insetar datos:" + err.message);
    }    
}

ejecutar();