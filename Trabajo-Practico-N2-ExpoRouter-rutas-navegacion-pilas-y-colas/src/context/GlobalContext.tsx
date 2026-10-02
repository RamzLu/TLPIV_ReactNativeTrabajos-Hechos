import { createContext, useContext, useState, useRef, ReactNode } from 'react';
import { Pila } from '../estructuras/Pila';
import { Cola } from '../estructuras/Cola';

export type Plato = { id: number; nombre: string; precio: number; categoria: string; descripcion: string };
export type Pedido = { idTurno: number; items: Plato[]; nota: string };

type GlobalContextType = {
  usuario: string | null;
  iniciarSesion: (user: string) => void;
  cerrarSesion: () => void;

  carrito: Plato[];
  agregarAlCarrito: (plato: Plato) => void;
  deshacerUltimo: () => void;
  vaciarCarrito: () => void;

  pedidosEnCola: Pedido[];
  pedidosAtendidos: Pedido[];
  confirmarPedido: (nota: string) => number;
  atenderSiguiente: () => void;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<string | null>(null);
  const [carrito, setCarrito] = useState<Plato[]>([]);
  const [pedidosEnCola, setPedidosEnCola] = useState<Pedido[]>([]);
  const [pedidosAtendidos, setPedidosAtendidos] = useState<Pedido[]>([]);
  const [contadorTurnos, setContadorTurnos] = useState(1);

  const pilaDeshacer = useRef(new Pila<Plato[]>());
  const colaPedidos = useRef(new Cola<Pedido>());
  const pilaAtendidos = useRef(new Pila<Pedido>());

  const iniciarSesion = (user: string) => setUsuario(user);
  const cerrarSesion = () => setUsuario(null);

  const agregarAlCarrito = (plato: Plato) => {
    pilaDeshacer.current.push([...carrito]);
    setCarrito([...carrito, plato]);
  };

  const deshacerUltimo = () => {
    if (!pilaDeshacer.current.vacia) {
      const carritoAnterior = pilaDeshacer.current.pop();
      if (carritoAnterior) setCarrito(carritoAnterior);
    }
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    pilaDeshacer.current = new Pila<Plato[]>();
  };

  const confirmarPedido = (nota: string) => {
    const nuevoPedido: Pedido = {
      idTurno: contadorTurnos,
      items: [...carrito],
      nota,
    };
    colaPedidos.current.encolar(nuevoPedido);
    setPedidosEnCola(colaPedidos.current.aArray());
    setContadorTurnos((prev) => prev + 1);
    vaciarCarrito();
    return nuevoPedido.idTurno;
  };

  const atenderSiguiente = () => {
    const pedidoAtendido = colaPedidos.current.desencolar();
    if (pedidoAtendido) {
      pilaAtendidos.current.push(pedidoAtendido);
      setPedidosEnCola(colaPedidos.current.aArray());
      setPedidosAtendidos(pilaAtendidos.current.aArray().reverse());
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        usuario,
        iniciarSesion,
        cerrarSesion,
        carrito,
        agregarAlCarrito,
        deshacerUltimo,
        vaciarCarrito,
        pedidosEnCola,
        pedidosAtendidos,
        confirmarPedido,
        atenderSiguiente,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error('useGlobalContext debe usarse dentro de un GlobalProvider');
  return context;
};