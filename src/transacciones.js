async function asignarPlanConContrato(pool, clienteId, planId, fechaInicio, fechaFin, condiciones, precio) {
    const conexion = await pool.getConnection();
    try {
        await conexion.beginTransaction();
        console.log(' Iniciando transacción: asignar plan + crear contrato...');
        const [resultadoPlan] = await conexion.query(
            'INSERT INTO planes_clientes (cliente_id, plan_id, fecha_inicio, fecha_fin, estado) VALUES (?, ?, ?, ?, ?)',
            [clienteId, planId, fechaInicio, fechaFin, 'activo']
        );
        const planClienteId = resultadoPlan.insertId;
        console.log(`    Plan_cliente creado con ID: ${planClienteId}`);
        await conexion.query(
            'INSERT INTO contratos (plan_cliente_id, condiciones, precio, fecha_inicio, fecha_fin, estado) VALUES (?, ?, ?, ?, ?, ?)',
            [planClienteId, condiciones, precio, fechaInicio, fechaFin, 'activo']
        );
        console.log('    Contrato creado automáticamente');
        await conexion.commit();
        console.log(' Transacción completada con éxito (COMMIT)');
    } catch (error) {
        await conexion.rollback();
        console.error(' Error en la transacción. Se hizo ROLLBACK:', error.message);
    } finally {
        conexion.release();
    }
}

async function cancelarPlanConRollback(pool, planClienteId) {
    const conexion = await pool.getConnection();
    try {
        await conexion.beginTransaction();
        console.log(' Iniciando transacción: cancelar plan + rollback de seguimiento y contrato...');
        const [filas] = await conexion.query(
            'SELECT cliente_id FROM planes_clientes WHERE id=?',
            [planClienteId]
        );
        if (filas.length === 0) throw new Error('No existe ese plan_cliente');
        const clienteId = filas[0].cliente_id;
        await conexion.query(
            "UPDATE planes_clientes SET estado='cancelado' WHERE id=?",
            [planClienteId]
        );
        console.log('    Plan_cliente marcado como cancelado');
        await conexion.query(
            "UPDATE contratos SET estado='cancelado' WHERE plan_cliente_id=?",
            [planClienteId]
        );
        console.log('    Contrato cancelado');
        const [resultadoSeg] = await conexion.query(
            'DELETE FROM seguimiento_fisico WHERE cliente_id=?',
            [clienteId]
        );
        console.log(`    Registros de seguimiento eliminados: ${resultadoSeg.affectedRows}`);
        await conexion.commit();
        console.log(' Transacción completada: plan cancelado con rollback de seguimiento (COMMIT)');
    } catch (error) {
        await conexion.rollback();
        console.error(' Error al cancelar plan. Se hizo ROLLBACK:', error.message);
    } finally {
        conexion.release();
    }
}

async function renovarPlan(pool, planClienteId, nuevaFechaFin) {
    const conexion = await pool.getConnection();
    try {
        await conexion.beginTransaction();
        console.log(' Renovando plan y contrato...');
        await conexion.query(
            "UPDATE planes_clientes SET estado='renovado', fecha_fin=? WHERE id=?",
            [nuevaFechaFin, planClienteId]
        );
        await conexion.query(
            "UPDATE contratos SET estado='activo', fecha_fin=? WHERE plan_cliente_id=?",
            [nuevaFechaFin, planClienteId]
        );
        await conexion.commit();
        console.log(' Plan y contrato renovados (COMMIT)');
    } catch (error) {
        await conexion.rollback();
        console.error(' Error al renovar. ROLLBACK:', error.message);
    } finally {
        conexion.release();
    }
}

async function finalizarPlan(pool, planClienteId) {
    const conexion = await pool.getConnection();
    try {
        await conexion.beginTransaction();
        await conexion.query(
            "UPDATE planes_clientes SET estado='finalizado' WHERE id=?",
            [planClienteId]
        );
        await conexion.query(
            "UPDATE contratos SET estado='finalizado' WHERE plan_cliente_id=?",
            [planClienteId]
        );
        await conexion.commit();
        console.log(' Plan y contrato finalizados (COMMIT)');
    } catch (error) {
        await conexion.rollback();
        console.error(' Error al finalizar. ROLLBACK:', error.message);
    } finally {
        conexion.release();
    }
}

async function registrarTransaccion(pool, clienteId, tipo, monto, descripcion, fecha, categoria) {
    const conexion = await pool.getConnection();
    try {
        await conexion.beginTransaction();
        console.log(` Registrando ${tipo} de $${monto}...`);
        await conexion.query(
            `INSERT INTO transacciones_financieras 
             (cliente_id, tipo_transaccion, monto, descripcion, fecha_transaccion, categoria)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [clienteId, tipo, monto, descripcion, fecha, categoria]
        );
        await conexion.commit();
        console.log(` ${tipo} registrado correctamente (COMMIT)`);
    } catch (error) {
        await conexion.rollback();
        console.error(` Error al registrar ${tipo}. ROLLBACK:`, error.message);
    } finally {
        conexion.release();
    }
}
module.exports = {
    asignarPlanConContrato,
    cancelarPlanConRollback,
    renovarPlan,
    finalizarPlan,
    registrarTransaccion
};