INSERT INTO labor(nombre_labor)
VALUES('Plomero'),
('Profesor de inglés'),
('Cerrajero'),
('Paseador de perros');

INSERT INTO estado_trabajador(nombre_estado)
VALUES
('Disponible'),
('Ocupado');

INSERT INTO estado_contratacion(nombre_estado_contratacion)
VALUES
('Trabajando'),
('Finalizada'),
('Pendiente de pago');

INSERT INTO contratacion(calificacion_contratacion, pago, id_cliente, id_trabajador, id_labor_trabajador, id_estado_contratacion)
VALUES
(5, 20000, 5, 8, 1, 2)

INSERT INTO tipo_tarjeta(nombre_tipo, marca_tipo, banco_tipo)
VALUES
('Débito', 'Visa', 'Bancolombia'),
('Crédito', 'Visa', 'Bancolombia'),
('Débito', 'MasterCard', 'Bancolombia'),
('Crédito', 'MasterCard', 'Bancolombia'),

('Débito', 'Visa', 'Banco Davivienda'),
('Crédito', 'Visa', 'Banco Davivienda'),
('Débito', 'MasterCard', 'Banco Davivienda'),
('Crédito', 'MasterCard', 'Banco Davivienda'),

('Débito', 'Visa', 'Banco de Bogotá'),
('Crédito', 'Visa', 'Banco de Bogotá'),
('Débito', 'MasterCard', 'Banco de Bogotá'),
('Crédito', 'MasterCard', 'Banco de Bogotá'),

('Débito', 'Visa', 'Banco Popular'),
('Crédito', 'Visa', 'Banco Popular'),
('Débito', 'MasterCard', 'Banco Popular'),
('Crédito', 'MasterCard', 'Banco Popular'),

('Débito', 'Visa', 'Banco de Occidente'),
('Crédito', 'Visa', 'Banco de Occidente'),
('Débito', 'MasterCard', 'Banco de Occidente'),
('Crédito', 'MasterCard', 'Banco de Occidente');

INSERT INTO tarjeta(numero_tarjeta, clave_tarjeta, id_tipo, fecha_caducidad)
VALUES
('1234567890123456', 12345, 1, '2024-03-01')

/* FUNCIONES */

CREATE OR REPLACE FUNCTION haversine(latitude1 numeric(10,6),longitude1 numeric(10,6), latitude2 numeric(10,6), longitude2 numeric(10,6))
RETURNS double precision AS
$BODY$
	SELECT 6371 * acos( cos( radians(latitude1) ) * cos( radians( latitude2 ) ) * cos( radians( longitude1 ) - radians(longitude2) ) + sin( radians(latitude1) ) * sin( radians( latitude2 ) ) ) AS distance
$BODY$
LANGUAGE sql;
