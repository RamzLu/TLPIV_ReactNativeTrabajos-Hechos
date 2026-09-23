class ColaEficiente {
    #items = []; //el simbolo # significa que la lista es privada, nadie de afuera puede verla ni modificarla
    #frenteIndex = 0; // aca se crea un numereo que arranca de 0, tambien es privada


    encolar(x) { //hacemos un metodo que recibe un dato cualquiera (x) 
        this.#items.push(x) //aqui lo q hace es agarrar la lista que se hizo arriba y empujar el dato que recibio encolar(x) al final del todo
    }
    desencolar(){ //otro metodo para sacar el primer dato de la lista
        if (this.vacia) return undefined; //primero se fija si la lista esta vacia, y si lo esta devuelve undefined y frena la accion
        const elemento = this.#items[this.#frenteIndex]; //aca hacemos que mire en la lista donde esta marcado nuestro #frenteIndex y guarde ese dato en la constante elemento
        this.#frenteIndex++; //el ++ odena que si el numero valia 0 ahora vale 1, entonces avanza la posicion sin borrar nada
        return elemento; //y finalmente entrega el dato que habiamos guardado en elemento
    }

    frente() {
        if (this.vacia) return undefined //antes de buscar un dato verifica que la lista no este vacia
        return this.#items[this.#frenteIndex] // si la lista no esta vacia va a la lista (this.#items) mira la posicion exacta que marca nuestro #frenteIndex y agarra el dato y lo devuelve para verlo
    }

    get vacia() { //el get seria como un sensor mas q una orden
        return this.#frenteIndex >= this.#items.length //se hace una comparacion entre #frenteIndex contra la cantidad de cosas guardadas
    } //por ejemplo, si guarde dos cosas en la lista, pero la posisicion ya avanzo a la dos avisa que ya recorrio todo entonces expulsa un true (que la lista SI esta vacia)
    //o si se guardo dos cosas pero la posicion es 0, entonces 0 >= 2 = false, entonces la lista NO esta vacia

    get tamanio() {
        return this.#items.length - this.#frenteIndex //aca hace una resta matematica, agarra la cantidad de elemento que en algun momento entraron en la lista y le resta el numero de posiciones que se avanzo y devuelve la respuesta
    }
}


//console logs 
console.log("Se abrio la cocina")
const pedidos = new ColaEficiente()

console.log("Tres alumnos piden comida")
pedidos.encolar("Hamburgesa para Stella")
pedidos.encolar("Ensalada para Vivi")
pedidos.encolar("Milanesa para Kiara")

console.log(`Pedidos en espera: ${pedidos.tamanio}`)
console.log(`El cocinero mira el ticker al frente: "${pedidos.frente()}"`);


console.log("Se empieza a trabajar")
console.log(`Sale el pedido: ${pedidos.desencolar()}`) //stella
console.log(`Sale el pedido: ${pedidos.desencolar()}`) //Sale vivi

console.log("Estado actual")
console.log(`Pedidos restantes en espera ${pedidos.tamanio}`)
console.log(`El cocinero mira el siguiente ticket: "${pedidos.frente()}"`)


console.log("Sale el ultimo pedido: ",pedidos.desencolar())
console.log("La cocina esta sin pedidos?", pedidos.vacia)
