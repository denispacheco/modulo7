//1.- importar los módulos 
const {Sequelize,DataTypes,Op} =require('sequelize');
const chalk=require("chalk");

//2.- crear una conexión sequelize
const sequelize=new Sequelize("TestingSequelize","postgres","12345",{
    host:"localhost",
    dialect:"postgres"
});

//3.1- probar que sequelize funcione y se conecte correctamente
async function conectar(){
    try {
        await sequelize.authenticate();    
        console.log(chalk.green.inverse("-------------Conexión establecida!---------------"));
    } catch (error) {
        console.log(chalk.red.inverse("Error en la conexion: "  + error.message));
    }
}
//3.2.- ejecutar la función
conectar();

//4.1- crear un modelo básico
//**importante: agregar el objeto DataTypes de la librería sequelize, arriba en el require*/
//parametros: nombre del modelo y definicion del modelo (modelo=tabla)
const usuarioBasico=sequelize.define("UsuarioBasico",{
    //columnas
    nombre:{
        type:DataTypes.STRING,
        allowNull:false
    },
    apellido:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    //opciones
});
//4.2----otro modelo mas avanzado
const usuarioAvanzado=sequelize.define("UsuarioAvanzado",{
    rut:{
        type:DataTypes.STRING,
        allowNull:false,
        primaryKey:true //esto define la PK y ya no se creará la columna id automaticamente
    },
    nombre:{
        type:DataTypes.STRING,
        allowNull:false
    },
    apellido:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    //opciones
    timestamps:false, //previene la creacion de las columnas con fecha de creacion y actualizacion
    freezeTableName:true //obliga a la talba a tener el mismo nombre que el modelo
    //tableName: 'OtroNombre' //define el nombre de la tabla en la base de datos con otro distinto al modelo
})


//5.- sincronizar la base de datos
async function sincronizar(){
    try {
        await sequelize.sync({/*opcion*/});  //opcion: {force:true} para borrar la bd y crearla desde cero 
        console.log(chalk.green.inverse("-------------sincronización correcta!---------------"));    
    } catch (error) {
        console.log(chalk.red.inverse("Error al sincronizar: "  + error.message));
    }
}

sincronizar();

//---------------------------------------------------------------------------------------------------------------------------------------------
//6.1- crear objeto o instancias de un modelo y guardar en la bd, a traves de "build" y "save"
async function guardarUsuario1(){
    try {
        let usuario1=usuarioBasico.build({
            nombre:"denis",
            apellido:"pacheco"
        });        
        await usuario1.save();    
        console.log(chalk.green.inverse("datos guardados correctamente"));
    } catch (error) {
        console.log(chalk.red.inverse("Error al guardarUsuario1: "  + error.message));
    }    
};

//guardarUsuario1();
//6.2 crear y guardar al mismo tiempo, a traves de "create"
async function guardarUsuario2(){
    try {
        let usuario1= await usuarioBasico.create({ //crete hace le build y el save al mismo tiempo
            nombre:"alejandra",
            apellido:"ruiz"
        });                
        console.log(chalk.green.inverse("datos guardados correctamente"));
    } catch (error) {
        console.log(chalk.red.inverse("Error al guardarUsuario2: "  + error.message));
    }    
};

//guardarUsuario2();

//6.3 función de creación genérica
async function guardarUsuario3(nombre,apellido){
    try {
        let usuario= await usuarioBasico.create({ //crete hace le build y el save al mismo tiempo
            nombre:nombre,     //el dato de la izquierda, es el nombre de la propiedad y queda igual
            apellido:apellido   //el dato de la derecha, es el valor de la propiedad, y depende del parámetro de entrada de la función cuando se llame a ésta.
        });                
        console.log(chalk.green.inverse("datos guardados correctamente"));
    } catch (error) {
        console.log(chalk.red.inverse("Error al guardarUsuario3: "  + error.message));
    }    
};
//guardarUsuario3("bruno","fuenzalida");
//guardarUsuario3("clemente","arriegada");
//guardarUsuario3("sandra","valenzuela");

//7.1 SELECT * //SELECT * FROM UsuarioBasicos
async function buscarTodos(){
    try {
        const datos=await usuarioBasico.findAll();
        console.log(JSON.stringify(datos,null,2));
    } catch (error) {
        console.log(chalk.red.inverse("Error al buscarTodos: "  + error.message));
    }
}
buscarTodos();

//7.2 SELECT CAMPOS O COLUMNAS ESPECIFICOS //SELECT nombre , apellido AS "APELLIDO" FROM UsuarioBasicos
async function buscarColumnas(){
    try {
        const datos=await usuarioBasico.findAll({
            attributes:['nombre',
                        ['apellido','APELLIDO']//nombre de la columna, y su alias
                       ]
        });
        console.log(JSON.stringify(datos,null,2));
    } catch (error) {
        console.log(chalk.red.inverse("Error al buscarColumnas: "  + error.message));
    }
}
buscarColumnas();

//7.3 SELECT CON CONDICIÓN //SELECT * FROM UsuarioBasicos WHERE id=1
async function buscarCondicion(){
    try {
        const datos=await usuarioBasico.findAll({
           where:{
                "id":1
           }
        });
        console.log(JSON.stringify(datos,null,2));
    } catch (error) {
        console.log(chalk.red.inverse("Error al buscarCondicion: "  + error.message));
    }
}
buscarCondicion();

//7.4 SELECT CON OPERACIONES
//SELECT * FROM UsuarioBasicos WHERE nombre='denis' OR nombre='alejandra'
//recordar agregar Op a las librerias importadas en el require
async function buscarOperaciones(){
    try {
        const datos=await usuarioBasico.findAll({
           where:{
                [Op.or]:[
                    {nombre:"denis"},
                    {nombre:"alejandra"}
                ]
           }
        });
        console.log("*********OPERACIONMES*******");
        console.log(JSON.stringify(datos,null,2));
    } catch (error) {
        console.log(chalk.red.inverse("Error al buscarOperaciones: "  + error.message));
    }
}
buscarOperaciones();

//--------------------------------------------------------------------------------------
//8.- UPDATE (ACTUALIZACIONES)
//UPDATE "UsuariosBasicos" SET nombre='maximiliano' WHERE nombre='denis'
async function actualizar(){
    try {
        const datos=await usuarioBasico.update({nombre:"maximiliano"},{
           where:{
                nombre:"denis"
           }
        });        
        console.log(chalk.green.inverse("***UPDATE***"));
    } catch (error) {
        console.log(chalk.red.inverse("Error al actualizar: "  + error.message));
    }
}
actualizar();

//9.- DELETE
async function eliminar(){
    try {
        const datos=await usuarioBasico.destroy({
           where:{
                id:3
           }
        });        
        console.log(chalk.green.inverse("***DELETE***"));
    } catch (error) {
        console.log(chalk.red.inverse("Error al eliminar: "  + error.message));
    }
}
eliminar();

//--------------------------------------------------------------------
//FUNCIONES AVANZADAS
//10.-bulkCreate, ingresa usuarios por lote, los cuales deben estar en un arreglo
async function crearLotes(){
    try {
        const datos=await usuarioBasico.bulkCreate([
            {nombre:"alejandra",apellido:"ruiz"},
            {nombre:"alexis",apellido:"menco"},            
            {nombre:"Guillermo",apellido:"NN"}
        ]);        
        console.log(chalk.green.inverse("***BULK CREATE***"));
    } catch (error) {
        console.log(chalk.red.inverse("Error al crearLotes: "  + error.message));
    }
}
//crearLotes();

//11.-ORDENAR (ORDER BY))
async function buscarOrdenado(){
    try {
        const datos=await usuarioBasico.findAll({
          order:[
            ['id','DESC']
          ]
        });        
        console.log(JSON.stringify(datos,null,2));
    } catch (error) {
        console.log(chalk.red.inverse("Error al buscarOrdenado: "  + error.message));
    }
}
buscarOrdenado();

//12.- agrupar
async function buscarAgrupado(){
    try {
        const datos=await usuarioBasico.count({
          attributes:['nombre'],
          group:'nombre'
        });        
        console.log(JSON.stringify(datos,null,2));
    } catch (error) {
        console.log(chalk.red.inverse("Error al buscarOrdenado: "  + error.message));
    }
}
buscarAgrupado();