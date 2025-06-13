// declaro estos arrays para guardar pokemones y tiradas.
const equipo1 = [];
const equipo2= [];
const tiradasEquipo1= [];
const tiradasEquipo2=[];
const maxTiradas = 3;

// en estta funcion obtengo pokemon aleatorio.
async function getPokemon() {
    const maxId= 1040;
    const id = Math.floor (Math.random ()* maxId)+1;
    const response = await fetch (`https://pokeapi.co/api/v2/pokemon/${id}`);
    const pokemon = await response.json();
    return pokemon; 
}

//Con el push voy cargando el equipo , con 3 pokemons cada uno y muestro.
async function getEquipos() {
    for (let i = 0; i< 3 ; i ++) {
        equipo1.push( await getPokemon());
        equipo2.push(await getPokemon());
    }
  mostrarEquipos();
    
}

// muestro como esta compuesto cada equipo, uso el forEach para recorrer el array e ir mostrando cada pokemon.
// pongo el contenedor "" para que este vacio y se llene por cada vez que haga la batalla.
function mostrarEquipos(){
    const contenedor1 = document.getElementById("pokemonesEquipo1");
    const contenedor2 = document.getElementById("pokemonesEquipo2");
    contenedor1.innerHTML="";
    contenedor2.innerHTML="";

    equipo1.forEach(pokemon => contenedor1.innerHTML += mostrarPokemon(pokemon));
    equipo2.forEach(pokemon => contenedor2.innerHTML += mostrarPokemon(pokemon));
}

//creo el html para cada pokemon con su ataque y defensa.
function mostrarPokemon(pokemon){

    // este metodo .find lo uso para buscar en stats el objeto que el stat.name es igual a "attack" y "defense"
    const ataque= pokemon.stats.find(s=> s.stat.name === "attack").base_stat;
    const defensa= pokemon.stats.find(s=> s.stat.name === "defense").base_stat;

    //pido que me devuelva el bloque html que quiero mostrar.

    return `
    <div class="pokemonClase">
        <img src="${pokemon.sprites.front_default}" >
        <strong> ${pokemon.name.toUpperCase()}</strong><br>
        Ataque: ${ataque} | Defensa: ${defensa}
    </div>`;
}

function tirarDados(equipo, tiradas, idTiradasEquipo, idBotonDados){
    if (tiradas.length < maxTiradas){
        const dado1 = Math.floor(Math.random()*6)+1;
        const dado2= Math.floor(Math.random()*6)+1;
        const suma= dado1 + dado2;

        tiradas.push(suma); // cargo un array con el resultado de cada tirada, uso el .join para que cada resultado este separado por una ",".
        document.getElementById(idTiradasEquipo).innerHTML= tiradas.join(",");

    }
    //Deshabilito el boton de tirar dados cuando se llegue a las 3 tiradas.
    if (tiradas.length === maxTiradas){
        document.getElementById(idBotonDados).disabled = true;
    }
     
    // Y aca habilito el boton de batalla una vez que los dos equipos llegan a las 3 tiradas.
    if(tiradasEquipo1.length === maxTiradas && tiradasEquipo2.length === maxTiradas){
        document.getElementById("inicioBatalla").disabled = false;
    }
}
 
// sumo los totales de la defensa y ataque de cada equipo.
function calcularTotales(equipo){
    let sumaAtaque = 0;
    let sumaDefensa = 0;

    equipo.forEach( pokemon => { 
        sumaAtaque += pokemon.stats.find( s => s.stat.name === "attack").base_stat;
        sumaDefensa += pokemon.stats.find( s => s.stat.name === "defense").base_stat;
        
    });

    return {
        totalAtaque: sumaAtaque,
        totalDefensa: sumaDefensa
    };
}

// busco el ganador, calculando los totales de cada uno, y restando el ataque de uno menos la defensa del otro.
function iniciarBatalla (){
    const totalEquipo1 = calcularTotales(equipo1);
    const totalEquipo2 = calcularTotales(equipo2);

    const diferencia1 = totalEquipo1.totalAtaque - totalEquipo2.totalDefensa;
    const diferencia2 = totalEquipo2.totalAtaque - totalEquipo1.totalDefensa;

    let equipoGanador = "";

    if (diferencia1 > diferencia2 ) {
        equipoGanador = "Equipo1"

    }else if (diferencia2> diferencia1){
        equipoGanador = "Equipo2"
    }else{
        // si empatan en la diferencia de defensa y ataque , vamos a desempatar con las tiradas de los dados, busco el mayor valor del array tiradas de cada equipo.
         const maxTirada1 = Math.max (...tiradasEquipo1);
         const maxTiradas2= Math.max(...tiradasEquipo2);

         if ( maxTirada1 > maxTiradas2 ){
            equipoGanador= "Equipo1 (desempado por dados)";

         }else if ( maxTiradas2 > maxTirada1){
            equipoGanador= "Equipo2 ( desempatado por dados)";
         }else{
            equipoGanador=" EMPATE TOTAL";
         }
    }

    conocerResultados( totalEquipo1, totalEquipo2, diferencia1, diferencia2, equipoGanador);

}


function conocerResultados(totalEquipo1, totalEquipo2, diferencia1, diferencia2, equipoGanador){
    const maxTirada1= Math.max (...tiradasEquipo1);
    const maxTirada2= Math.max(...tiradasEquipo2);
    const posicionMaxTirada1 = tiradasEquipo1.indexOf (maxTirada1);//uso el indexOf para buscar en que ubicacion del array se encuentra la mayor tirada.
    const posicionMaxTirada2= tiradasEquipo2.indexOf (maxTirada2);

    document.getElementById("resultado").innerHTML= `
    <h2> <b>Resultado final </b></h2>
    <p> GANADOR : <strong> ${equipoGanador}</strong></p>
    <p> Equipo 1 -> Ataque : ${totalEquipo1.totalAtaque} , Defensa : ${totalEquipo1.totalDefensa}</p>
    <p> Equipo 2 -> Ataque : ${totalEquipo2.totalAtaque} , Defensa : ${totalEquipo2.totalDefensa}</p>
    <p>Diferencia Equipo1 vs Equipo2 : ${diferencia1}</p>
    <p>Diferencia Equipo2 vs Equipo1 : ${diferencia2}</p>
    <p> Mayor suma en los dados del Equipo1 : ${maxTirada1} en la tirada ${posicionMaxTirada1} </p>
    <p>Mayor suma en los dados del Equipo2 : ${maxTirada2} en la tirada ${posicionMaxTirada2}</p>
    `;


}


getEquipos();