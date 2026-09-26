#  Análisis del Problema — FitTrack CLI

> **Proyecto:** FitTrack CLI — Sistema de Gestión Integral para Entrenadores Personales y Gimnasios  
> **Fecha de elaboración:** 23 de septiembre de 2026  
> **Metodología:** SCRUM  
> **Stack técnico:** Node.js + MySQL (mysql2) + POO + SOLID + Patrones de Diseño

---

##  1. Identificación del Problema Principal

### Descripción del Problema

Los **entrenadores personales y dueños de gimnasios** enfrentan una gestión fragmentada e ineficiente de la información de sus clientes. Actualmente, la información crítica del negocio se encuentra dispersa en múltiples herramientas no integradas:

-  **Hojas de cálculo (Excel/Google Sheets)** para el control de pagos y contratos.

-  **Galerías de fotos y notas en el celular** para registrar el progreso físico.
-  **Documentos físicos o archivos Word** para los contratos firmados.
-  **Memoria del entrenador** para recordar fechas de renovación, metas y compromisos.


##  2. Identificación de Usuarios

### Actores del Sistema

| Actor | Descripción | Nivel de acceso |
|-------|-------------|-----------------|
|  **Entrenador Personal (Usuario Primario)** | Profesional independiente que entrena clientes de forma presencial o remota. Necesita llevar control de sus clientes, rutinas, alimentación y pagos. | **Total**: CRUD completo de todas las entidades. |
|  **Dueño/Administrador de Gimnasio (Usuario Primario)** | Persona responsable de la gestión administrativa de un gimnasio pequeño o mediano. | **Total**: CRUD completo + reportes financieros. |
| 🧑 **Desarrollador/Mantenedor (Usuario Técnico)** | Persona encargada de mantener, extender o modificar el sistema. | **Técnico**: Acceso al código fuente, base de datos y configuración. |


### Perfil del Usuario Primario (Persona)

**Nombre:** Carlos "El Profe"  
**Edad:** 32 años  
**Ocupación:** Entrenador personal independiente  
**Clientes activos:** 15-25 personas  
**Habilidades técnicas:** Básicas (usa WhatsApp, Excel, Instagram)  
**Dolor principal:** *"Se me olvida cobrarle a un cliente cada mes y pierdo dinero. Además, no tengo forma de mostrarle a mis clientes cuánto han avanzado."*  
**Objetivo:** Profesionalizar su servicio y liberar tiempo para enfocarse en entrenar.

##  3. Identificación de Necesidades

### 3.1 Necesidades Funcionales (¿Qué debe hacer el sistema?)

#### 🔹 Módulo de Clientes
- [ ] Crear, listar, actualizar y eliminar clientes.
- [ ] Asociar clientes a uno o varios planes de entrenamiento.
- [ ] Consultar el historial completo de un cliente.

#### 🔹 Módulo de Planes de Entrenamiento
- [ ] Crear planes con nombre, duración, metas físicas y nivel (principiante, intermedio, avanzado).
- [ ] Asociar un plan a uno o varios clientes.
- [ ] Renovar, cancelar o finalizar un plan.

#### 🔹 Módulo de Contratos
- [ ] Generar **automáticamente** un contrato al asignar un plan a un cliente.
- [ ] Incluir condiciones, duración, precio, fecha de inicio y fin.
- [ ] Asociar el contrato al cliente y plan correspondientes.

#### 🔹 Módulo de Seguimiento Físico
- [ ] Registrar avances semanales: peso, grasa corporal, medidas, fotos y comentarios.
- [ ] Visualizar el progreso cronológico del cliente.
- [ ] Permitir eliminar registros (con rollback si afecta la consistencia del plan).

#### 🔹 Módulo de Nutrición
- [ ] Crear planes de alimentación asociados al cliente y al plan de entrenamiento.
- [ ] Registrar alimentos por día con calorías estimadas.
- [ ] Consultar reporte nutricional semanal.

#### 🔹 Módulo Financiero
- [ ] Registrar ingresos (mensualidades, sesiones individuales).
- [ ] Registrar egresos (servicios, suplementos, gastos operativos).
- [ ] Consultar balance financiero por fecha o por cliente.
- [ ] Implementar transacciones reales para evitar inconsistencias en pagos.
