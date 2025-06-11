class Animal{
    nombre ;
    raza;

    constructor(nombre,raza){
        this.nombre=nombre;
        this.raza=raza;
    }
    

}

let perro1= new Animal('Roma', 'Perro');
let gato1= new Animal('Loky', 'gato');
console.log(gato1.raza, gato1.nombre);
console.log(perro1.raza, perro1.nombre);


