# SUGO - Sistema Unificado de Gestión Operativa

Control operativo de transporte para la Red de Transporte de Pasajeros (RTP).

## Módulos Integrados
* **Control de Acceso (Auth):** Gestión de usuarios y validación perimetral mediante JWT.
* **Despacho:** Control de salidas de Económicos validados con el Rol diario.
* **Recepción:** Cierre de jornada operativa y retorno de unidades.
* **Hora de Presentación / Roles:** Gestión de asistencia y planeación de rutas.

## Arquitectura del Proyecto
* **Frontend:** React + TypeScript + PrimeReact (Estructura Feature-Driven).
* **Backend:** Node.js + Express + Sequelize + PostgreSQL 17.

## Cómo levantar el entorno de desarrollo local

docker compose up --build





services:
  sugo-back:
    build:
      context: ./SUGO-BACK
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    volumes:
      - ./SUGO-BACK:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development

  sugo-front:
    build:
      context: ./SUGO-FRONT
      dockerfile: Dockerfile
    ports:
      - "5173:5173"
    volumes:
      - ./SUGO-FRONT:/app
      - /app/node_modules
    environment:
      - CHOKIDAR_USEPOLLING=true
    depends_on:
      - sugo-back

