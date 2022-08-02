CREATE DATABASE mande;

CREATE TYPE GeoCoord AS
(Latitude DECIMAL,
 Longitude DECIMAL);

CREATE TYPE rol_type AS ENUM ('Cliente', 'Trabajador');

/* CLIENTE */
/*Creamos la tabla Tipo de Tarjeta */
CREATE TABLE tipo_tarjeta(
    id_tipo SERIAL,
    nombre_tipo VARCHAR NULL, 
    marca_tipo VARCHAR NULL, 
    banco_tipo VARCHAR NULL, 
    PRIMARY KEY (id_tipo)
);

/*Creamos la tabla Tarjeta */
CREATE TABLE tarjeta(
    id_tarjeta SERIAL,
    numero_tarjeta VARCHAR NULL, 
    clave_tarjeta VARCHAR NULL, 
    fecha_caducidad DATE NULL,
    id_tipo INT NULL, 
    PRIMARY KEY (id_tarjeta),
    FOREIGN KEY (id_tipo) REFERENCES tipo(id_tipo)
);

/*Creamos la tabla Cliente */
CREATE TABLE cliente(
    id_cliente SERIAL,
    nombre_cliente VARCHAR NULL, 
    direccion_residencia_cliente GeoCoord NULL,
    numero_celular_cliente INT NULL,
    email_cliente VARCHAR NULL,
    contraseña_cliente VARCHAR,
    url_recibo_publico VARCHAR NULL,
    rol_cliente rol_type NULL,
    PRIMARY KEY (id_cliente)
);

/*Creamos la tabla Tarjeta de Usuarios */
CREATE TABLE tarjeta_cliente(
    id_tarjeta_cliente SERIAL,
    id_cliente INT NULL, 
    id_tarjeta INT NULL, 
    PRIMARY KEY (id_tarjeta_cliente),
    FOREIGN KEY (id_tarjeta) REFERENCES tarjeta(id_tarjeta),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente)
);
/* FIN CLIENTE */



/* TRABAJADOR */
/*Creamos la tabla de Estado del trabajador*/
CREATE TABLE estado_trabajador(
    id_estado SERIAL,
    nombre_estado VARCHAR NULL, 
    PRIMARY KEY (id_estado)
);

/*Creamos la tabla Cliente */
CREATE TABLE trabajador(
    id_trabajador SERIAL,
    nombre_trabajador VARCHAR NULL, 
    direccion_residencia_trabajador GeoCoord NULL,
    numero_celular_trabajador INT NULL,
    email_trabajador VARCHAR NULL,
    contraseña_trabajador VARCHAR,
    url_foto_perfil VARCHAR NULL,
    url_documento VARCHAR NULL,
    id_estado INT NULL,
    rol_trabajador rol_type,
    PRIMARY KEY (id_trabajador),
    FOREIGN KEY (id_estado) REFERENCES estado_trabajador(id_estado)
);

/*Creamos la tabla Labor*/
CREATE TABLE labor(
    id_labor SERIAL,
    nombre_labor VARCHAR NULL, 
    PRIMARY KEY (id_labor)
);

/*Creamos la tabla de Labores de los trabajadores*/
CREATE TABLE labor_trabajador(
    id_labor_trabajador SERIAL,
    precio_hora_labor INT NULL, 
    id_trabajador INT NULL,
    id_labor INT NULL,
    PRIMARY KEY (id_labor_trabajador),
    FOREIGN KEY (id_trabajador) REFERENCES trabajador(id_trabajador),
    FOREIGN KEY (id_labor) REFERENCES labor(id_labor)
);
/* FIN TRABAJADOR */



/* CONTRATACIÓN */
/*Creamos la tabla de Estado de la contratacion*/
CREATE TABLE estado_contratacion(
    id_estado_contratacion SERIAL,
    nombre_estado_contratacion VARCHAR NULL, 
    PRIMARY KEY (id_estado_contratacion)
);

/*Creamos la tabla contratacion*/
CREATE TABLE contratacion(
    id_contratacion SERIAL,
    calificacion_contratacion INT NULL, 
    pago INT NULL,
    horas_laboradas INT NULL,
    id_cliente INT NULL,
    id_trabajador INT NULL,
    id_labor_trabajador INT NULL,
    id_estado_contratacion INT NULL,
    PRIMARY KEY (id_contratacion),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    FOREIGN KEY (id_trabajador) REFERENCES trabajador(id_trabajador),
    FOREIGN KEY (id_labor_trabajador) REFERENCES labor_trabajador(id_labor_trabajador),
    FOREIGN KEY (id_estado_contratacion) REFERENCES estado_contratacion(id_estado_contratacion)
);
/* FIN CONTRATACIÓN */

