import './AvisoCodigoDesarrollo.css'

// Solo aparece cuando el backend está en modo desarrollo de SMS y devolvió el código.
function AvisoCodigoDesarrollo({ codigo }) {
  if (!codigo) return null
  return (
    <div className="aviso-codigo-dev">
      Modo desarrollo: no se envió el SMS. Tu código es <strong>{codigo}</strong>
    </div>
  )
}

export default AvisoCodigoDesarrollo
