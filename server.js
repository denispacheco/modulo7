const express = require('express')
const bodyparser=require('body-parser');
const app=express();

app.use(express.json()); //aplication-json
app.use(express.urlencoded({extended:true}));

const db=require("./app/models")
db.sequelize.sync({ force: false }).then(() => {
    console.log("Sincronizacion correcta");
}).catch((err) => {
    console.log("Error al sincronizar");
});

app.get("/",(req,res)=>{
    res.send("OK");
})

const PORT=3000;
app.listen(PORT,()=>{console.log("Servidor iniciado en el puerto"+PORT)});



