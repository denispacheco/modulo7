window.onload=function(){
    //alert("OK");
    let botones=document.querySelectorAll("button");
    for (let i = 0; i < botones.length; i++) {
        botones[i].addEventListener("click",function(e){
            console.log(e.target.parentElement.parentElement.querySelector("td").innerText);
            let id= e.target.parentElement.parentElement.querySelector("td").innerText;
            eliminar(id);
        })
    }
};
//funcion para llamar al método DELETE del servidor.
async function eliminar(id){
    let respuesta=await fetch("http://localhost:3000/prestamos/"+id,{
        method:"DELETE"
    });

    if (respuesta.status<300){
        let datos=await respuesta.json();
        //alert("objeto eliminado");
        const fila=document.querySelector("#d"+id);
        fila.remove();
    }else{
        let datos=await respuesta.json();
        alert("error al eliminar datos");
    }
}

