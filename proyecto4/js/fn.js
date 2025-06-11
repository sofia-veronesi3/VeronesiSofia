async function getpersonaje() {
    const response = await fetch (
        "https://pokeapi.co/api/v2/pokemon?limit=1303&offset=0"
    );
    const data= await response.json();

    const resultados= data.results;
    
    const equipoA = array.from ({length: 3},
     ()=> Math.floor(Math.random()* data.results.length + 1)
    );
    const equipoB = array.from ({length: 3}, 
    ()=> Math.floor(Math.random()* data.results.length + 1)
    );
   
    console.log(equipoA);


}

getpersonaje();