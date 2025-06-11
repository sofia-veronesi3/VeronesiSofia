const link = "https://pokeapi.co/api/v2/pokemon/";
const grandeEquipos = 6; // Cantidad de pokemones que queremos traer en total
const cantidadPokemons = 1040; //Cantidadf máxima de pokemones que pueden llamarse con este método sin que de error
var ataqueEquipo1 = 0;
var ataqueEquipo2 = 0;
var defensaEquipo1 = 0;
var defensaEquipo2 = 0;
var limiteTiradas = 3;
var tiradasA = [];
var tiradasB = [];


async function buscarPokemon() {
    //constante que contiene una función asíncrona (porque dentro trabaja con un fetch) La 
    // usamos porque esperamos a las respuestas de la api y a que se termine de consumir. 
    // En este caso, esperamos a que se terminen de concatenar al data la info de cada pokemon.
    const getPokemones = async () => {

        //Array.from se usa para crear un array de un largo determinado (lo que
        // va entre corchetes) y cumpliendo una condición (lo que va en el segundo
        // paréntesis después de la coma) ej: 
        // const arr = Array.from({ length: 5 }, (_, i) => i + 1);
        // resultado: arr = [1, 2, 3, 4, 5]
        const pokemons = Array.from({ length: grandeEquipos }, () =>
            Math.floor(Math.random() * cantidadPokemons) + 1
        );
        //try que verifica si lo que se intenta llevar a cabo se hace correctamente 
        // en caso de que no, con "catch" (lo cual se usa en conjunto) se devuelve 
        // el error específico que ocurre a la hora de intentar correr la porción de codigo
         try {

            //se vuelve a declarar una constante con un await porque dentro se emplea 
            // un fetch, con una serie de respuestas que debemos esperar por parte de la api
            //Tarea: Preguntarle a chat para qué sirve el Promise.all en este caso
            const data = await Promise.all(
                //Tarea: Preguntarle al chat para qué sirve array.map copiando y pegando esta 
                // porción de código.
                //Empleamos la cosntante declarada anteriormente (pokemons) y la recorremos 
                // al mismo tiempo que ejecutamos la función que llama a la api 
                pokemons.map(async id => {
                    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
                    // Variable.ok :Verifica que la variable esté bien y no contenga errores, 
                    // en este caso al tener un ! delante, vendríamos a corroborar lo contrario
                    // Si la variable res NO está bien y contiene algún error, entonces se 
                    // cumple la acción del if
                    if (!res.ok) {
                        throw new Error(`No se pudo obtener el Pokémon con ID ${id}`);
                    }
                    //Al finalizar cada iteración, acumulamos (o concatenamos) la respuesta en versión .json 
                    return res.json();
                })
            );
            //Se verifica que las respuestas llegan correctamente
            console.log("Pokemones:", data);
            //Finalmente, cuando llamemos a nuestra constante data, nos devolverá todo lo acumulado anteriormente
            return data;

            //catch que "atrapa" los errores y los devuelve
        } catch (error) {
            console.error("Error al obtener pokemones:", error);
            return [];
        }
    };

    //usamos una función asíncrona porque dentro esperamos la respuesta de OTRA función asíncrona
    //Usaremos una función asíncrona siempre que esperemos el resultado de un fetch o que 
    //usemos una función asíncrona dentro
    (async () => {
        //Esperamos la respuesta de la constante asíncrona declarada anteriormente
        const pokemones = await getPokemones();

        //Comenzamos con la declaración y envío de datos al html
        var contadorPokemones = 0;

        //forEach recorre los elementos del array mencionado uno a uno y realiza
        //determinada acción (declarada entre los corchetes) con cada una
        pokemones.forEach((pokemon, i) => {

            //Nos adentramos en el array de pokemon.stats de cada pokemon y 
            //buscamos el objeto que "stat" que tenga el nombre "attack"
            //Se renombra cada elemento de este array a "s" para evitar que la 
            // declaración de la búsqueda sea muy larga
            let statataque = pokemon.stats.find(s => s.stat.name === "attack");
            let statdefensa = pokemon.stats.find(s => s.stat.name === "defense");

            //Tarea: si no recuerdas para qué sirve el siguiente renglón de código
            //Enviaselo al chat y pídele que te la explique paso a paso junto con
            //la función de cada elemento
            let ataque = statataque ? statataque.base_stat : 0;
            let defensa = statdefensa ? statdefensa.base_stat : 0;

            //Declaramos una variable que sirve como "plantilla" para mostrar datos
            var mostrar = ` <div>
                        <p>${pokemon.name}</p>
                        <img src ="${pokemon.sprites.front_default}">
                        <p class="defensa">Defensa:${defensa}</p>
                        <p class="ataque">Ataque:${ataque}</p>
                        </div>`;
            

        
            //declaramos el límite de la cantidad de pokemones que serán parte del 
            //primer grupo. el "3" está "hardcodeado"
            //tarea: pensar una manera de transformar este hard-codding en un código
            //escalable (es decir, que siga funcionando en caso de que la variable
            // que contiene el grande de los pokemon sea de un valor más alto)
            if(i < 3)
            {
                ataqueEquipo1 += ataque;
                defensaEquipo1 += defensa;
            
                document.getElementById("equipo1").innerHTML +=`${mostrar}`

                if(i==2){
                     document.getElementById("stats_equipo1").innerHTML +=`<div>
                                            <p class="ataque_grupal">Ataque grupal: ${ataqueEquipo1}</p>
                                            <p class="defensa_grupal">Defensa Grupal: ${defensaEquipo1}</p>
                                        </div>`;
                }
                
            }else{
                ataqueEquipo2 += ataque;
                defensaEquipo2 += defensa;

                document.getElementById("equipo2").innerHTML +=`${mostrar}`

                if(i==5){
                     document.getElementById("stats_equipo2").innerHTML +=`<div>
                                            <p class="ataque_grupal" >Ataque grupal: ${ataqueEquipo2}</p>
                                            <p class="defensa_grupal" >Defensa Grupal: ${defensaEquipo2}</p>
                                        </div>`;
                }
            }

            contadorPokemones=contadorPokemones++;
            
        });
    })();
    
    document.getElementById("vs").innerHTML += `<button id='comenzarBatalla' 
    disabled value='${ataqueEquipo1},${ataqueEquipo2},${defensaEquipo1},${defensaEquipo2}' 
    onClick="iniciarBatalla(this.value)">Iniciar Batalla</button>`;

    document.getElementById("tirarDadosA").innerHTML = `
    <button id="dadosA" onClick="tirarDadosA()">Tirar dados</button>`;

    document.getElementById("tirarDadosB").innerHTML = `
    <button id="dadosB" onClick="tirarDadosB()">Tirar dados</button>`;
}   

//llamamos a la función automáticamente al cargar la página 
buscarPokemon();

/*Cómo tenemos que llamar los valores del botón de batalla: 
    const [ataque1, ataque2, defensa1, defensa2] = value.split(',').map(Number);
    
    // Ahora podés usar las variables
    console.log("Ataques:", ataque1, ataque2);
    console.log("Defensas:", defensa1, defensa2);

*/

function tirarDadosA()
{
    let dado1 = Math.floor(Math.random () *6 ) + 1 ;
    let dado2 = Math.floor(Math.random () *6 ) + 1 ;
    tiradasA.push(dado1+dado2);
    console.log(tiradasA);
    if(tiradasA.length==3)
        {
            document.getElementById('dadosA').disabled = true;
            corroborarTiradas();
        }
}

function tirarDadosB()
{
    let dado1 = Math.floor(Math.random () *6 ) + 1 ;
    let dado2 = Math.floor(Math.random () *6 ) + 1 ;
    tiradasB.push(dado1+dado2);
    console.log(tiradasB);
    if(tiradasB.length==3)
        {
            document.getElementById('dadosB').disabled = true;
            corroborarTiradas();
        }
}

function corroborarTiradas(){
    if (tiradasB.length==3 && tiradasA.length==3)
    {
        document.getElementById('comenzarBatalla').disabled = false; 
    }
}

function iniciarBatalla(){
    ataqueFinalEquipoA = ataqueEquipo1 - defensaEquipo2;
    ataqueFinalEquipoB = ataqueEquipo2 - defensaEquipo1;

    if(ataqueFinalEquipoA>ataqueFinalEquipoB)
    {
        document.getElementById("").innerHTML += `<h2 class=" ganador" >Ganador Equipo 1</h2>`;

    }else if (ataqueFinalEquipoA<ataqueFinalEquipoB)
    {
        document.getElementById("").innerHTML += `<h2 class ="ganador">Ganador Equipo 2</h2>`;
    }else{
       desempate();
    }
} iniciarBatalla();

function desempate(){

}