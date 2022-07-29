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

INSERT INTO contratacion(calificacion_contratacion, pago, id_cliente, id_trabajador, id_labor_trabajador, id_estado_contratacion)
VALUES
(5, 20000, 5, 8, 1, 2)