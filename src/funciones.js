// funciones.js - Funciones CRUD básicas (sin transacciones)
// Aquí están las operaciones simples: crear, leer, actualizar, eliminar

// ---------- CLIENTES ----------
async function crearCliente(pool, nombre, edad, correo, telefono) {
    try {
        const [resultado] = await pool.query(
            'INSERT INTO clientes (nombre, edad, correo, telefono) VALUES (?, ?, ?, ?)',
            [nombre, edad, correo, telefono]
        );
        console.log(`✅ Cliente creado con ID: ${resultado.insertId}`);
    } catch (error) {
        console.error('❌ Error al crear cliente:', error.message);
    }
}

async function listarClientes(pool) {
    try {
        const [filas] = await pool.query('SELECT * FROM clientes');
        console.log('\n📋 Lista de clientes:');
        console.table(filas);
    } catch (error) {
        console.error('❌ Error al listar clientes:', error.message);
    }
}

async function actualizarCliente(pool, id, nombre, edad, correo, telefono) {
    try {
        const [resultado] = await pool.query(
            'UPDATE clientes SET nombre=?, edad=?, correo=?, telefono=? WHERE id=?',
            [nombre, edad, correo, telefono, id]
        );
        console.log(`✅ Cliente actualizado. Filas afectadas: ${resultado.affectedRows}`);
    } catch (error) {
        console.error('❌ Error al actualizar:', error.message);
    }
}

async function eliminarCliente(pool, id) {
    try {
        const [resultado] = await pool.query('DELETE FROM clientes WHERE id=?', [id]);
        console.log(`✅ Cliente eliminado. Filas afectadas: ${resultado.affectedRows}`);
    } catch (error) {
        console.error('❌ Error al eliminar (puede tener relaciones):', error.message);
    }
}

// ---------- PLANES ----------
async function crearPlan(pool, nombre, duracion, objetivo, nivel) {
    try {
        const [resultado] = await pool.query(
            'INSERT INTO planes (nombre, duracion_dias, objetivo, nivel) VALUES (?, ?, ?, ?)',
            [nombre, duracion, objetivo, nivel]
        );
        console.log(`✅ Plan creado con ID: ${resultado.insertId}`);
    } catch (error) {
        console.error('❌ Error al crear plan:', error.message);
    }
}

async function listarPlanes(pool) {
    try {
        const [filas] = await pool.query('SELECT * FROM planes');
        console.log('\n📋 Lista de planes:');
        console.table(filas);
    } catch (error) {
        console.error('❌ Error al listar planes:', error.message);
    }
}

// ---------- SEGUIMIENTO FÍSICO ----------
async function registrarSeguimiento(pool, clienteId, fecha, peso, comentarios) {
    try {
        const [resultado] = await pool.query(
            'INSERT INTO seguimiento_fisico (cliente_id, fecha_registro, peso, comentarios) VALUES (?, ?, ?, ?)',
            [clienteId, fecha, peso, comentarios]
        );
        console.log(`✅ Registro de seguimiento creado con ID: ${resultado.insertId}`);
    } catch (error) {
        console.error('❌ Error al registrar seguimiento:', error.message);
    }
}

async function verSeguimiento(pool, clienteId) {
    try {
        const [filas] = await pool.query(
            'SELECT * FROM seguimiento_fisico WHERE cliente_id=? ORDER BY fecha_registro ASC',
            [clienteId]
        );
        console.log('\n📈 Progreso del cliente:');
        console.table(filas);
    } catch (error) {
        console.error('❌ Error al consultar seguimiento:', error.message);
    }
}

async function eliminarSeguimiento(pool, id) {
    try {
        const [resultado] = await pool.query('DELETE FROM seguimiento_fisico WHERE id=?', [id]);
        console.log(`✅ Registro eliminado. Filas afectadas: ${resultado.affectedRows}`);
    } catch (error) {
        console.error('❌ Error al eliminar:', error.message);
    }
}

// ---------- NUTRICIÓN ----------
async function crearPlanNutricional(pool, clienteId, planId, descripcion) {
    try {
        const [resultado] = await pool.query(
            'INSERT INTO planes_nutricionales (cliente_id, plan_id, descripcion) VALUES (?, ?, ?)',
            [clienteId, planId, descripcion]
        );
        console.log(`✅ Plan nutricional creado con ID: ${resultado.insertId}`);
    } catch (error) {
        console.error('❌ Error al crear plan nutricional:', error.message);
    }
}

async function registrarAlimento(pool, planNutId, fecha, alimento, calorias, tipo) {
    try {
        const [resultado] = await pool.query(
            'INSERT INTO registros_alimentacion (plan_nutricional_id, fecha_registro, nombre_alimento, calorias, tipo_comida) VALUES (?, ?, ?, ?, ?)',
            [planNutId, fecha, alimento, calorias, tipo]
        );
        console.log(`✅ Alimento registrado con ID: ${resultado.insertId}`);
    } catch (error) {
        console.error('❌ Error al registrar alimento:', error.message);
    }
}

async function reporteNutricionalSemanal(pool, planNutId) {
    try {
        const [filas] = await pool.query(
            `SELECT tipo_comida, 
                    COUNT(*) as cantidad, 
                    SUM(calorias) as total_calorias
             FROM registros_alimentacion
             WHERE plan_nutricional_id = ?
               AND fecha_registro >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
             GROUP BY tipo_comida`,
            [planNutId]
        );
        console.log('\n🥗 Reporte nutricional semanal:');
        console.table(filas);
    } catch (error) {
        console.error('❌ Error al generar reporte:', error.message);
    }
}

// ---------- CONTRATOS ----------
async function verContrato(pool, planClienteId) {
    try {
        const [filas] = await pool.query(
            'SELECT * FROM contratos WHERE plan_cliente_id=?',
            [planClienteId]
        );
        if (filas.length === 0) {
            console.log('⚠️ No se encontró contrato para ese plan_cliente');
        } else {
            console.table(filas);
        }
    } catch (error) {
        console.error('❌ Error al consultar contrato:', error.message);
    }
}

async function listarContratosActivos(pool) {
    try {
        const [filas] = await pool.query(
            `SELECT c.*, pc.cliente_id, pc.plan_id 
             FROM contratos c
             JOIN planes_clientes pc ON c.plan_cliente_id = pc.id
             WHERE c.estado = 'activo'`
        );
        console.log('\n📄 Contratos activos:');
        console.table(filas);
    } catch (error) {
        console.error('❌ Error al listar contratos:', error.message);
    }
}

// ---------- FINANZAS (consultas) ----------
async function balancePorFechas(pool, fechaInicio, fechaFin) {
    try {
        const [filas] = await pool.query(
            `SELECT 
                SUM(CASE WHEN tipo_transaccion='ingreso' THEN monto ELSE 0 END) as total_ingresos,
                SUM(CASE WHEN tipo_transaccion='gasto' THEN monto ELSE 0 END) as total_gastos,
                SUM(CASE WHEN tipo_transaccion='ingreso' THEN monto ELSE -monto END) as balance
             FROM transacciones_financieras
             WHERE fecha_transaccion BETWEEN ? AND ?`,
            [fechaInicio, fechaFin]
        );
        console.log('\n💰 Balance por fechas:');
        console.table(filas);
    } catch (error) {
        console.error('❌ Error al calcular balance:', error.message);
    }
}

async function balancePorCliente(pool, clienteId) {
    try {
        const [filas] = await pool.query(
            `SELECT 
                SUM(CASE WHEN tipo_transaccion='ingreso' THEN monto ELSE 0 END) as total_ingresos,
                SUM(CASE WHEN tipo_transaccion='gasto' THEN monto ELSE 0 END) as total_gastos,
                SUM(CASE WHEN tipo_transaccion='ingreso' THEN monto ELSE -monto END) as balance
             FROM transacciones_financieras
             WHERE cliente_id = ?`,
            [clienteId]
        );
        console.log('\n💰 Balance del cliente:');
        console.table(filas);
    } catch (error) {
        console.error('❌ Error al calcular balance:', error.message);
    }
}

module.exports = {
    crearCliente, listarClientes, actualizarCliente, eliminarCliente,
    crearPlan, listarPlanes,
    registrarSeguimiento, verSeguimiento, eliminarSeguimiento,
    crearPlanNutricional, registrarAlimento, reporteNutricionalSemanal,
    verContrato, listarContratosActivos,
    balancePorFechas, balancePorCliente
};