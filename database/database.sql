CREATE DATABASE IF NOT EXISTS fittrack_db;
USE fittrack_db;

-- ============================================
-- TABLA: clientes
-- ============================================
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    edad INT NOT NULL CHECK (edad >= 14 AND edad <= 99),
    correo VARCHAR(150) NOT NULL ,
    telefono VARCHAR(20)
) ENGINE=InnoDB;

-- ============================================
-- TABLA: planes

CREATE TABLE planes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    duracion_dias INT NOT NULL CHECK (duracion_dias > 0),
    objetivo TEXT NOT NULL,
    nivel ENUM('principiante','intermedio','avanzado') NOT NULL
) ENGINE=InnoDB;

-- ============================================
-- TABLA: planes_clientes
-- Relación N:M entre clientes y planes

CREATE TABLE planes_clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    plan_id INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estado ENUM('activo', 'renovado', 'cancelado','finalizado') NOT NULL DEFAULT 'activo',

    FOREIGN KEY (cliente_id)
        REFERENCES clientes(id),

    FOREIGN KEY (plan_id)
        REFERENCES planes(id)
) ENGINE=InnoDB;

-- ============================================
-- TABLA: contratos
-- Relación 1:1 con planes_clientes

CREATE TABLE contratos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plan_cliente_id INT NOT NULL UNIQUE,
    condiciones TEXT NOT NULL,
    precio DECIMAL(10, 2) NOT NULL CHECK (precio > 0),
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estado ENUM('activo','cancelado','finalizado') NOT NULL DEFAULT 'activo',
    FOREIGN KEY (plan_cliente_id)
        REFERENCES planes_clientes(id)
) ENGINE=InnoDB;

-- ============================================
-- TABLA: seguimiento_fisico

CREATE TABLE seguimiento_fisico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    fecha_registro DATE NOT NULL,
    peso DECIMAL(5, 2) CHECK (peso > 0),
    comentarios TEXT,
    FOREIGN KEY (cliente_id)
        REFERENCES clientes(id)
) ENGINE=InnoDB;

-- ============================================
-- TABLA: planes_nutricionales

CREATE TABLE planes_nutricionales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    plan_id INT NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id)
        REFERENCES clientes(id),
    FOREIGN KEY (plan_id)
        REFERENCES planes(id)

) ENGINE=InnoDB;

-- ============================================
-- TABLA: registros_alimentacion
-- ============================================
CREATE TABLE registros_alimentacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plan_nutricional_id INT NOT NULL,
    fecha_registro DATE NOT NULL,
    nombre_alimento VARCHAR(150) NOT NULL,
    calorias INT NOT NULL CHECK (calorias > 0),
    tipo_comida ENUM('desayuno','almuerzo','cena','merienda') NOT NULL,

    FOREIGN KEY (plan_nutricional_id)
        REFERENCES planes_nutricionales(id)
) ENGINE=InnoDB;

-- ============================================
-- TABLA: transacciones_financieras

CREATE TABLE transacciones_financieras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NULL,
    tipo_transaccion ENUM('ingreso','gasto') NOT NULL,
    monto DECIMAL(10, 2) NOT NULL CHECK (monto > 0),
    descripcion VARCHAR(255) NOT NULL,
    fecha_transaccion DATE NOT NULL,
    categoria VARCHAR(50),

    FOREIGN KEY (cliente_id)
        REFERENCES clientes(id)
) ENGINE=InnoDB;