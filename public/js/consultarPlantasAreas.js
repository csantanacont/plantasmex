var tabla = document.getElementById('tabla');
var titulo = document.getElementById('titulo')
var idUsuario = sessionStorage.getItem('idUsuario');
var id;
var cont = 0;
//Creamos la instancia
const valores = window.location.search;
const urlParams = new URLSearchParams(valores);
//Accedemos a los valores
var nombreArea = urlParams.get('id');
// const db = firebase.firestore();
/*###########################################################################*/
/*Consultar tabla de plantas*/
document.onload = muestraRegistros();

function muestraRegistros(){
    var imagenes = document.getElementById("imagenesInfo");
    titulo.innerHTML=`
    <h1 class="animate__animated animate__pulse" style="color: #278650">
        Plantas en ${nombreArea}
      </h1>
      <p>
        A continuación podras consultar todas las plantas que se encuentran en ${nombreArea}
      </p>
    `
    db.collection('plantas').where("ubicacion", "==",nombreArea).get().then((querySnapshot)=>{
        tabla.innerHTML = ''
        querySnapshot.forEach((doc)=> {
            cont++;
            console.log(`${doc.id} => ${doc.data().tipo}`);
            doc.id = id;
            tabla.innerHTML+=`
                <tr>  
                        <td>${cont}</td>
                        <td>${doc.data().especie}</td>
                        <td>${doc.data().tipo}</td>
                        <td><a href="verPlanta.html?id=${doc.id}"><img src="img/ver.svg" class="iconos-tam"></a></td>
                        <td><a onclick="editarPlanta('${doc.id}')" data-bs-toggle="modal" data-bs-target="#modificarPlantaModal"><img src="img/editar.svg" class="iconos-tam"></a></td>
                        <td><a><img src="img/eliminar.svg" class="iconos-tam" onclick="eliminar('${doc.id}')"></a></td>
                </tr>
            `
        })
    })
}

/*################# MOSTRAR DETALLES DEL REGISTRO #################### */

function muestraDetalles(id){
     
    console.log(id);
    var planta = db.collection("plantas").doc(id);
    var modalInfo = document.getElementById("modalInfo");
    var imagenes = document.getElementById("imagenesInfo");
    


    planta.get().then((doc) => {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            modalInfo.innerHTML = ''
            modalInfo.innerHTML+=`
                    <h2>${doc.data().tipo}</h2>
                    <p style=" font-weight: bold;">Especie:</p><p>${doc.data().especie}</p>
                    <div><p style="font-weight:bold ">Descripcion de la planta:</p> <p style="font-size: small;">${doc.data().descripcion}</p></div>
                    <div><p style="font-weight:bold ">Lugar de plantación: </p><p style="font-size: small;">${doc.data().lugar}</p></div>
                    <div><p style="font-weight:bold ">Temporada: </p><p style="font-size: small;">${doc.data().temp}</p></div>
                    <div><p style="font-weight:bold ">Usos: </p><p style="font-size: small;">${doc.data().usos}</p></div>
                    <div><p style="font-weight:bold ">Ubicación en casa:</p> <p style="font-size: small;">${doc.data().ubicacion}</p></div>
                    <div><p style="font-weight:bold ">Fecha en que fue plantada:</p><p style="font-size: small;"> ${doc.data().fechaPlantacion}</p></div>
                    <div><p style="font-weight:bold ">Notas sobre el cuidado de la planta:</p> <p style="font-size: small;"> ${doc.data().notas}</p></div>
            `
            imagenes.innerHTML='';
            imagenes.innerHTML+=`
                <img class="img-fluid d-block small-preview" src="${doc.data().img1}">
            `
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
        }).catch((error) => {
        console.log("Error getting document:", error);
        });
}

/*#######################  EDITAR PLANTAS #####################################*/

function editarPlanta(id){
    console.log(id);
    var modalE = document.getElementById("modificarPlantaModal");
    var planta = db.collection("plantas").doc(id);
    var formEditar = document.getElementById("modalEditarInfo");
    var btnEditar = document.getElementById("btnEditarPlanta")
    var tipo = document.getElementById('tipo');
    var especie = document.getElementById('especie');
    var lugar = document.getElementById('lugar');
    var temporada = document.getElementById('temporada');
    var usos = document.getElementById('usos');
    var ubicacion = document.getElementById('ubicacion');
    var fecha = document.getElementById('fecha');
    var descripcion = document.getElementById('descripcion');
    var notas = document.getElementById('notas');
    var img1;


    planta.get().then((doc) => {
        if (doc.exists) {
            console.log("Document data:", doc.data());
            tipo.value = doc.data().tipo;
            especie.value = doc.data().especie;
            lugar.value = doc.data().lugar;
            temporada.value = doc.data().temp;
            usos.value = doc.data().usos;
            ubicacion.value = doc.data().ubicacion;
            fecha.value = doc.data().fechaPlantacion;
            descripcion.value = doc.data().descripcion;
            notas.value = doc.data().notas;
            db.collection('areas').where("idUsuarioRef", "==",idUsuario).get().then((querySnapshot)=>{
                ubicacion.innerHTML = ''
                ubicacion.innerHTML =`
                <option value="">Selecciona el area donde se encuentra la planta</option>
                `
                querySnapshot.forEach((doc)=> {
                    doc.id = id;
                    ubicacion.innerHTML+=`
                    <option>${doc.data().nombre}</option>
                    `
                })
            })
            formEditar.addEventListener('submit', async(e) =>
            {
                e.preventDefault();
                return planta.update({
                    tipo: tipo.value,
                    especie: especie.value,
                    lugar: lugar.value,
                    temp:temporada.value,
                    usos: usos.value,
                    ubicacion: ubicacion.value,
                    fechaPlantacion: fecha.value,
                    descripcion: descripcion.value,
                    notas: notas.value,
                }).then(() => {
                    console.log("Document successfully updated!");
                    mensajeExito('Datos de la planta actualizados');
                   
                })
                .catch((error) => {
                    // The document probably doesn't exist.
                    console.error("Error updating document: ", error);
                });
            })
                
            

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
        }).catch((error) => {
        console.log("Error getting document:", error);
        });

}


/*########################### BORRRAR REGISTRO ############# */
function borrarPlanta(id){    
    db.collection("plantas").doc(id).delete().then(() => {
        console.log("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
}