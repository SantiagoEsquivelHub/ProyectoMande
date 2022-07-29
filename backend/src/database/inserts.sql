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
('Pendiente'),
('Finalizada');



/* FUNCIONES */

CREATE OR REPLACE FUNCTION haversine(latitude1 numeric(10,6),longitude1 numeric(10,6), latitude2 numeric(10,6), longitude2 numeric(10,6))
RETURNS double precision AS
$BODY$
	SELECT 6371 * acos( cos( radians(latitude1) ) * cos( radians( latitude2 ) ) * cos( radians( longitude1 ) - radians(longitude2) ) + sin( radians(latitude1) ) * sin( radians( latitude2 ) ) ) AS distance
$BODY$
LANGUAGE sql;