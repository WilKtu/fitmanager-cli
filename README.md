# FitTrack DB - Sistema de Gestión para Gimnasio

Proyecto en **Node.js + MySQL2** que implementa un sistema de gestión integral para un gimnasio, con manejo de clientes, planes de entrenamiento, seguimiento físico, nutrición, contratos y finanzas.

##  ¿Qué se realizó?

Se desarrolló una aplicación de consola que permite administrar todas las áreas de un gimnasio, garantizando la **consistencia de los datos** mediante el uso de **transacciones SQL** en las operaciones críticas.

### Estructura del proyecto

```
fittrack/
├── database/
│   └── database.sql
├── docs/
│   └── requerimientos.md
└── src/
│   ├── funciones.js
│   ├── main.js
│   ├── menu.js
│   └── transacciones.js
├── .git/
├── .gitignore
├── node_modules/
├── package.json
├── package-lock.json
├── README.md

```

##  Requisitos

- Node.js instalado
- MySQL instalado y corriendo
- Paquete `mysql2`:
  ```bash
  npm install mysql2
  ```

##  Cómo ejecutar

1. Crea la base de datos ejecutando el script SQL en MySQL.
2. Ajusta las credenciales en `main.js` (usuario y contraseña).
3. Ejecuta:
   ```bash
   node src/main.js
   ```

##  Acciones críticas y consistencia de datos

El archivo `transacciones.js` contiene las operaciones donde la consistencia es fundamental. Todas usan `beginTransaction()`, `commit()` y `rollback()`:

| Acción crítica | Descripción |
|----------------|-------------|
| **Asignar plan con contrato** | Al asignar un plan a un cliente, se crea **automáticamente** el contrato. Si falla cualquiera de los dos inserts, se hace rollback. |
| **Cancelar plan con rollback** | Al cancelar un plan, se cancela también el contrato y se **eliminan los registros de seguimiento físico** del cliente. Todo en una sola transacción. |
| **Renovar plan** | Actualiza fechas del plan y del contrato simultáneamente. |
| **Finalizar plan** | Cambia el estado del plan y del contrato a "finalizado". |
| **Registrar pagos/gastos** | Las transacciones financieras se insertan dentro de una transacción SQL para evitar inconsistencias. |

##  Funcionalidades implementadas

1. **Gestión de clientes**: crear, listar, actualizar, eliminar y asociar a planes.
2. **Planes de entrenamiento**: crear, listar, renovar, cancelar (con rollback) y finalizar.
3. **Seguimiento físico**: registrar avances semanales, ver progreso cronológico y eliminar registros.
4. **Nutrición**: crear planes de alimentación, registrar alimentos y generar reportes semanales.
5. **Contratos**: generados automáticamente al asignar un plan, con condiciones, precio y fechas.
6. **Finanzas**: registro de ingresos/gastos y consultas de balance por fechas o por cliente.

