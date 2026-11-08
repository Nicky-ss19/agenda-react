import { useEffect, useState } from 'react'
import ListaContactos from './components/ListaContactos.jsx'
import AgregarContacto from './components/AgregarContacto.jsx'

// El servicio web del profe: con GET me da los contactos y con POST guardo uno nuevo
const URL_AGENDA = 'https://www.raydelto.org/agenda.php'

// Este es el componente padre. Aquí vive el estado con los contactos
// y se lo paso a los dos componentes hijos.
function App() {
  const [contactos, setContactos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // Pide la lista de contactos al servidor y la guarda en el estado
  function pedirContactos() {
    fetch(URL_AGENDA)
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error('El servidor respondió con el código ' + respuesta.status)
        }
        return respuesta.json()
      })
      .then((datos) => {
        setContactos(datos)
        setError(null)
      })
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false))
  }

  // Esta es la del botón Recargar: pone el "Cargando..." y vuelve a pedir la lista
  function recargarContactos() {
    setCargando(true)
    pedirContactos()
  }

  // useEffect con el arreglo vacío hace que los contactos se carguen una sola vez, al abrir la página
  useEffect(() => {
    pedirContactos()
  }, [])

  // Esta función se la paso al componente del formulario.
  // Devuelve la promesa para que el formulario sepa si salió bien o mal.
  function agregarContacto(nuevoContacto) {
    // No le pongo Content-Type: application/json para que el navegador
    // no mande el preflight de CORS, que el servidor no acepta
    return fetch(URL_AGENDA, {
      method: 'POST',
      body: JSON.stringify(nuevoContacto),
    }).then((respuesta) => {
      if (!respuesta.ok) {
        throw new Error('El servidor respondió con el código ' + respuesta.status)
      }
      pedirContactos() // vuelvo a pedir la lista para que salga el nuevo
    })
  }

  return (
    <>
      <header className="cabecera">
        <p className="mi-nombre">la agenda de Nicky</p>
        <h1>Agenda de contactos</h1>
        <p className="subtitulo">Ahora hecha en React: un componente para agregar, otro para la lista y este que los une.</p>
      </header>

      <main className="contenedor">
        <AgregarContacto onAgregar={agregarContacto} />
        <ListaContactos
          contactos={contactos}
          cargando={cargando}
          error={error}
          onRecargar={recargarContactos}
        />
      </main>

      <footer className="pie">
        Tarea 4 de Programación Web | Nicole Alejandra Santana Sánchez (2025-1213) | ITLA 2026-C-3
      </footer>
    </>
  )
}

export default App
