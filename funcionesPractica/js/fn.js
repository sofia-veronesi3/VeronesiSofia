


    //fetch ("./datos.json")
    //.then (response => response.json())
    //.then (data =>  {
    //    console.log(data)
    //}
    //) .catch(error =>{
    //    console.error('error al hacer el fetch', error);
    //}
    //);
    
    async function getPersonas() {
    try {
        const response = await fetch ('datos.json')
        const data = await response.json()
         console.log('Respuesta 1: cantidad de personas: ', data.results.length)
        
        console.log( 'Respuesta 2: cantidad de personas hombres : ', data.results.filter(h => h = h.gender == 'male').length)
        console.log( 'Respuesta 3: cantidad de personas mujeres : ', data.results.filter(m => m = m.gender == 'female').length)
        
       
        let total = 0

        for (i = 0; i < data.results.length; i++) {
            total += data.results[i].dob.age;
        }


        console.log( 'Respuesta 4:  edad promedio : ', total / data.results.length)


        console.log( 'Respuesta 5: cantidad de menroes de 28:', data.results.filter(n => n = n.dob.age < 28).length)


    } catch (error) {
        console.error('ocurrio un error', error)
        
    }
        
    }
    getPersonas();