// menu.js - Menú interactivo usando readline (nativo de Node, sin librerías extra)
const readline = require('readline');
const funciones = require('./funciones');
const transacciones = require('./transacciones');

// Creamos la interfaz para leer desde la consola
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Función auxiliar para preguntar al usuario
function preguntar(texto) {
    return new Promise(resolve => rl.question(texto, respuesta => resolve(respuesta)));
}

async function iniciarMenu(pool) {
    let salir = false;

    while (!salir) {
        console.log('\n=================================');
        console.log('   FITTRACK - MENÚ PRINCIPAL');
        console.log('=================================');
        console.log('1. Gestión de clientes');
        console.log('2. Gestión de planes de entrenamiento');
        console.log('3. Seguimiento físico');
        console.log('4. Nutrición');
        console.log('5. Contratos');
        console.log('6. Gestión financiera');
        console.log('7. Salir');
        console.log('=================================');

        const opcion = await preguntar('Elige una opción: ');

        switch (opcion) {
            case '1': await menuClientes(pool); break;
            case '2': await menuPlanes(pool); break;
            case '3': await menuSeguimiento(pool); break;
            case '4': await menuNutricion(pool); break;
            case '5': await menuContratos(pool); break;
            case '6': await menuFinanzas(pool); break;
            case '7': salir = true; break;
            default: console.log('⚠️ Opción no válida');
        }
    }

    rl.close();
}

// ---------- SUBMENÚ: CLIENTES ----------
async function menuClientes(pool) {
    console.log('\n--- GESTIÓN DE CLIENTES ---');
    console.log('1. Crear cliente');
    console.log('2. Listar clientes');
    console.log('3. Actualizar cliente');
    console.log('4. Eliminar cliente');
    console.log('5. Asociar cliente a un plan (con contrato automático)');
    console.log('6. Volver');

    const op = await preguntar('Opción: ');

    switch (op) {
        case '1': {
            const nombre = await preguntar('Nombre: ');
            const edad = parseInt(await preguntar('Edad: '));
            const correo = await preguntar('Correo: ');
            const telefono = await preguntar('Teléfono: ');
            await funciones.crearCliente(pool, nombre, edad, correo, telefono);
            break;
        }
        case '2':
            await funciones.listarClientes(pool);
            break;
        case '3': {
            const id = parseInt(await preguntar('ID del cliente a actualizar: '));
            const nombre = await preguntar('Nuevo nombre: ');
            const edad = parseInt(await preguntar('Nueva edad: '));
            const correo = await preguntar('Nuevo correo: ');
            const telefono = await preguntar('Nuevo teléfono: ');
            await funciones.actualizarCliente(pool, id, nombre, edad, correo, telefono);
            break;
        }
        case '4': {
            const id = parseInt(await preguntar('ID del cliente a eliminar: '));
            await funciones.eliminarCliente(pool, id);
            break;
        }
        case '5': {
            const clienteId = parseInt(await preguntar('ID del cliente: '));
            const planId = parseInt(await preguntar('ID del plan: '));
            const fechaInicio = await preguntar('Fecha inicio (YYYY-MM-DD): ');
            const fechaFin = await preguntar('Fecha fin (YYYY-MM-DD): ');
            const condiciones = await preguntar('Condiciones del contrato: ');
            const precio = parseFloat(await preguntar('Precio: '));
            // ⚠️ ACCIÓN CRÍTICA: usa transacción
            await transacciones.asignarPlanConContrato(pool, clienteId, planId, fechaInicio, fechaFin, condiciones, precio);
            break;
        }
    }
}

// ---------- SUBMENÚ: PLANES ----------
async function menuPlanes(pool) {
    console.log('\n--- GESTIÓN DE PLANES ---');
    console.log('1. Crear plan');
    console.log('2. Listar planes');
    console.log('3. Renovar plan de un cliente');
    console.log('4. Cancelar plan (con rollback)');
    console.log('5. Finalizar plan');
    console.log('6. Volver');

    const op = await preguntar('Opción: ');

    switch (op) {
        case '1': {
            const nombre = await preguntar('Nombre del plan: ');
            const duracion = parseInt(await preguntar('Duración (días): '));
            const objetivo = await preguntar('Objetivo: ');
            const nivel = await preguntar('Nivel (principiante/intermedio/avanzado): ');
            await funciones.crearPlan(pool, nombre, duracion, objetivo, nivel);
            break;
        }
        case '2':
            await funciones.listarPlanes(pool);
            break;
        case '3': {
            const id = parseInt(await preguntar('ID de plan_cliente a renovar: '));
            const nuevaFechaFin = await preguntar('Nueva fecha fin (YYYY-MM-DD): ');
            await transacciones.renovarPlan(pool, id, nuevaFechaFin);
            break;
        }
        case '4': {
            const id = parseInt(await preguntar('ID de plan_cliente a cancelar: '));
            // ⚠️ ACCIÓN CRÍTICA: rollback de seguimiento y contrato
            await transacciones.cancelarPlanConRollback(pool, id);
            break;
        }
        case '5': {
            const id = parseInt(await preguntar('ID de plan_cliente a finalizar: '));
            await transacciones.finalizarPlan(pool, id);
            break;
        }
    }
}

// ---------- SUBMENÚ: SEGUIMIENTO ----------
async function menuSeguimiento(pool) {
    console.log('\n--- SEGUIMIENTO FÍSICO ---');
    console.log('1. Registrar avance');
    console.log('2. Ver progreso de un cliente');
    console.log('3. Eliminar registro');
    console.log('4. Volver');

    const op = await preguntar('Opción: ');

    switch (op) {
        case '1': {
            const clienteId = parseInt(await preguntar('ID cliente: '));
            const fecha = await preguntar('Fecha (YYYY-MM-DD): ');
            const peso = parseFloat(await preguntar('Peso (kg): '));
            const comentarios = await preguntar('Comentarios: ');
            await funciones.registrarSeguimiento(pool, clienteId, fecha, peso, comentarios);
            break;
        }
        case '2': {
            const clienteId = parseInt(await preguntar('ID cliente: '));
            await funciones.verSeguimiento(pool, clienteId);
            break;
        }
        case '3': {
            const id = parseInt(await preguntar('ID del registro a eliminar: '));
            await funciones.eliminarSeguimiento(pool, id);
            break;
        }
    }
}

// ---------- SUBMENÚ: NUTRICIÓN ----------
async function menuNutricion(pool) {
    console.log('\n--- NUTRICIÓN ---');
    console.log('1. Crear plan nutricional');
    console.log('2. Registrar alimento');
    console.log('3. Reporte nutricional semanal');
    console.log('4. Volver');

    const op = await preguntar('Opción: ');

    switch (op) {
        case '1': {
            const clienteId = parseInt(await preguntar('ID cliente: '));
            const planId = parseInt(await preguntar('ID plan entrenamiento: '));
            const descripcion = await preguntar('Descripción: ');
            await funciones.crearPlanNutricional(pool, clienteId, planId, descripcion);
            break;
        }
        case '2': {
            const planNutId = parseInt(await preguntar('ID plan nutricional: '));
            const fecha = await preguntar('Fecha (YYYY-MM-DD): ');
            const alimento = await preguntar('Nombre del alimento: ');
            const calorias = parseInt(await preguntar('Calorías: '));
            const tipo = await preguntar('Tipo (desayuno/almuerzo/cena/merienda): ');
            await funciones.registrarAlimento(pool, planNutId, fecha, alimento, calorias, tipo);
            break;
        }
        case '3': {
            const planNutId = parseInt(await preguntar('ID plan nutricional: '));
            await funciones.reporteNutricionalSemanal(pool, planNutId);
            break;
        }
    }
}

// ---------- SUBMENÚ: CONTRATOS ----------
async function menuContratos(pool) {
    console.log('\n--- CONTRATOS ---');
    console.log('1. Ver contrato por plan_cliente');
    console.log('2. Listar contratos activos');
    console.log('3. Volver');

    const op = await preguntar('Opción: ');

    switch (op) {
        case '1': {
            const id = parseInt(await preguntar('ID plan_cliente: '));
            await funciones.verContrato(pool, id);
            break;
        }
        case '2':
            await funciones.listarContratosActivos(pool);
            break;
    }
}

// ---------- SUBMENÚ: FINANZAS ----------
async function menuFinanzas(pool) {
    console.log('\n--- GESTIÓN FINANCIERA ---');
    console.log('1. Registrar ingreso');
    console.log('2. Registrar gasto');
    console.log('3. Balance por fechas');
    console.log('4. Balance por cliente');
    console.log('5. Volver');

    const op = await preguntar('Opción: ');

    switch (op) {
        case '1': {
            const clienteId = parseInt(await preguntar('ID cliente (0 si no aplica): '));
            const monto = parseFloat(await preguntar('Monto: '));
            const descripcion = await preguntar('Descripción: ');
            const fecha = await preguntar('Fecha (YYYY-MM-DD): ');
            const categoria = await preguntar('Categoría: ');
            // ⚠️ ACCIÓN CRÍTICA: transacción real
            await transacciones.registrarTransaccion(pool, clienteId || null, 'ingreso', monto, descripcion, fecha, categoria);
            break;
        }
        case '2': {
            const clienteId = parseInt(await preguntar('ID cliente (0 si no aplica): '));
            const monto = parseFloat(await preguntar('Monto: '));
            const descripcion = await preguntar('Descripción: ');
            const fecha = await preguntar('Fecha (YYYY-MM-DD): ');
            const categoria = await preguntar('Categoría: ');
            await transacciones.registrarTransaccion(pool, clienteId || null, 'gasto', monto, descripcion, fecha, categoria);
            break;
        }
        case '3': {
            const fechaInicio = await preguntar('Fecha inicio (YYYY-MM-DD): ');
            const fechaFin = await preguntar('Fecha fin (YYYY-MM-DD): ');
            await funciones.balancePorFechas(pool, fechaInicio, fechaFin);
            break;
        }
        case '4': {
            const clienteId = parseInt(await preguntar('ID cliente: '));
            await funciones.balancePorCliente(pool, clienteId);
            break;
        }
    }
}

module.exports = { iniciarMenu };