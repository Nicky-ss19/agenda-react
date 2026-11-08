import { useState } from 'react'

// Le quita los acentos y lo pone en minúscula, así "lopez" encuentra a "López"
function normalizar(texto) {
  return String(texto || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

// Muestra la lista de contactos que le pasa el componente padre (App)
function ListaContactos({ contactos, cargando, error, onRecargar }) {
  const [busqueda, setBusqueda] = useState('')

  const texto = normalizar(busqueda.trim())
  const encontrados = contactos.filter((c) =>
    normalizar(c.nombre + ' ' + c.apellido + ' ' + c.telefono).includes(texto)
  )

  // Los pongo al revés para que los más nuevos salgan arriba
  const ordenados = [...encontrados].reverse()

  let contenido
  if (cargando) {
    contenido = <p className="aviso">Cargando contactos...</p>
  } else if (error) {
    contenido = <p className="aviso error">No se pudieron cargar los contactos. Revisa tu internet y dale a Recargar.</p>
  } else if (ordenados.length === 0) {
    contenido = <p className="aviso">No encontré ningún contacto con esa búsqueda.</p>
  } else {
    contenido = ordenados.map((c, i) => (
      // React pide un key único para cada elemento de la lista
      <div className="contacto" key={i}>
        <div className="inicial">{(String(c.nombre || '').trim().charAt(0) || '?').toUpperCase()}</div>
        <div className="datos">
          <p className="nombre-contacto">{c.nombre} {c.apellido}</p>
          <p className="telefono">{c.telefono}</p>
        </div>
      </div>
    ))
  }

  return (
    <section className="tarjeta lista">
      <div className="lista-cabecera">
        <h2>
          Mis contactos{' '}
          {!cargando && !error && (
            <span className="contador">({encontrados.length} de {contactos.length})</span>
          )}
        </h2>
        <button className="boton-recargar" onClick={onRecargar}>Recargar</button>
      </div>
      <input
        type="search"
        className="buscador"
        placeholder="Buscar por nombre, apellido o teléfono..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      <div className="contenido">{contenido}</div>
    </section>
  )
}

export default ListaContactos
