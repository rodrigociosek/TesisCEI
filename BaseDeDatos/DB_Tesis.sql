CREATE TYPE codigo_verificacion_proposito AS ENUM (
  'activacion_cuenta',
  'recuperacion_password'
);

CREATE TABLE usuario (
  id SERIAL PRIMARY KEY,
  nombre_completo VARCHAR NOT NULL,
  telefono VARCHAR UNIQUE NOT NULL,
  contrasena_hash VARCHAR NOT NULL,
  modo_distribuidor_activo BOOLEAN NOT NULL DEFAULT FALSE,
  cuenta_verificada BOOLEAN NOT NULL DEFAULT FALSE,
  consentimiento_datos_otorgado BOOLEAN NOT NULL DEFAULT FALSE,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE codigo_verificacion (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL REFERENCES usuario(id),
  codigo VARCHAR NOT NULL,
  proposito codigo_verificacion_proposito NOT NULL,
  fecha_expiracion TIMESTAMP NOT NULL,
  usado BOOLEAN NOT NULL DEFAULT FALSE,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW()
);

