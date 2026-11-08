import { useState } from 'react'

// Formulario para agregar un contacto nuevo.
// La función onAgregar me la pasa el componente padre (App).
function AgregarContacto({ onAgregar }) {
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [telefono, setTelefono] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' })

  function guardar(evento) {
    evento.preventDefault() // para que no se recargue la página

    const contacto = {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      telefono: telefono.trim(),
    }

    if (!contacto.nombre || !contacto.apellido || !contacto.telefono) {
      setMensaje({ texto: 'Llena los tres campos, por favor.', tipo: 'error' })
      return
    }

    // El teléfono solo puede tener números, espacios, guiones, paréntesis o un +
    if (!/^[0-9+\-\s()]{7,20}$/.test(contacto.telefono)) {
      setMensaje({ texto: 'Ese teléfono no se ve bien. Usa solo números y guiones.', tipo: 'error' })
      return
    }

    setGuardando(true)
    onAgregar(contacto)
      .then(() => {
        setMensaje({ texto: '¡Listo! ' + contacto.nombre + ' se guardó en la agenda.', tipo: 'exito' })
        setNombre('')
        setApellido('')
        setTelefono('')
      })
      .catch(() => {
        setMensaje({ texto: 'No se pudo guardar el contacto. Intenta otra vez.', tipo: 'error' })
      })
      .finally(() => setGuardando(false))
  }

  return (
    <section className="tarjeta formulario">
      <h2>Nuevo contacto</h2>
      <form onSubmit={guardar} noValidate>
        <label htmlFor="nombre">Nombre</label>
        <input
          id="nombre"
          type="text"
          maxLength={40}
          placeholder="Ej: María"
          autoComplete="off"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <label htmlFor="apellido">Apellido</label>
        <input
          id="apellido"
          type="text"
          maxLength={40}
          placeholder="Ej: López"
          autoComplete="off"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
        />

        <label htmlFor="telefono">Teléfono</label>
        <input
          id="telefono"
          type="tel"
          maxLength={20}
          placeholder="Ej: 809-555-1234"
          autoComplete="off"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />

        <button type="submit" className="boton-guardar" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar contacto'}
        </button>
        <p className={'mensaje ' + mensaje.tipo} role="status">{mensaje.texto}</p>
      </form>
    </section>
  )
}

export default AgregarContacto
