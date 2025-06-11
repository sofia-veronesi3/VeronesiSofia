
async function getPersonajes() {
  try {

    document.getElementById("mostrar").innerHTML= ""

    var numero= document.getElementById('num').value;
    if (!numero || numero < 2 || numero > 5) {
        alert("NUMERO NO ACEPTADO. Se debe ingresar un numero entre 2 y 5 inclusive. Vuelve a ingresar.");
        return;
    }

    const response= await fetch ("api10.json")
    const data= await response.json();
     
    const resultados= data.results;
    //console.log(resultados);
    
    var mayorEdad= 0;
    var mayorEdadI ;
    //busca el id de la persona con mas edad para 
    //despues mostrarla distinta.

    for (let i = 0; i< resultados.length; i++) {
        if (mayorEdad < resultados[i].dob.age) {
            mayorEdad= resultados[i].dob.age;
            mayorEdadI= i;

        } 
    };
    

    for (let i=0 ; i< resultados.length; i++ ){
      var mostrar=
        `<p> Nombre: ${resultados[i].name.first}</p>
        <p> Apellido:${resultados[i].name.last} </p>
        <p> Nacimiento :${resultados[i].dob.date.slice}</p>
        <p> Edad: ${resultados[i].dob.age}</p> <br>
          <img src = "${resultados[i].picture.large}"> `;

        //buscamos verificar si i es iguala a 0 para limpiar la etiqueta html
        //y que no se concatenen con los resultados anteriores(si seguimos ingresando numeros en la pag)

        // if (i==0 && i == mayorEdadI) {
        //   document.getElementById("mostrar").innerHTML= `
        //                                             <div class="box-mayor">
        //                                                 ${mostrar}
        //                                             </div>`;                                          
        // } else if (i==0) {
        //   document.getElementById("mostrar").innerHTML= `
        //                                                 <div class="box">
        //                                                     ${mostrar}

        //                                                 </div>`;
        // } 
         if (i== mayorEdadI) {
          document.getElementById("mostrar").innerHTML +=`
                                                          <div class="box-mayor">
                                                            ${mostrar}
                                                          </div>`;
        } else {
          document.getElementById("mostrar").innerHTML += `
                                                          <div class= "box">
                                                            ${mostrar}
                                                          </div>`;                                                  
        }
    }
    
            
}catch (error){
    console.error("Ocurrio un error", error);
    alert("No se pudieron obtener los datos, vueva a intentarlo mas tarde:"+ error);

 };
 
};