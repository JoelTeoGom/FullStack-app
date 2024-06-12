# Práctica Full Stack con React, Node.js y Postgres en Docker

## Descripción

Este proyecto es una aplicación full stack que utiliza React para el frontend, Node.js y Express para el backend, y Postgres como base de datos, que se ejecuta en un contenedor Docker. Además, se ha integrado Stripe para el procesamiento de pagos.

## Requisitos

- Docker
- Node.js
- npm
- Stripe CLI

## Instalación y Ejecución

### Paso 1: Crear el contenedor y la base de datos

1. **Crear el contenedor de Postgres:**

   ```bash
   docker run -d --name boxeo-container -e POSTGRES_DB=boxing_ecommerce -e POSTGRES_USER=joel -e POSTGRES_PASSWORD=1234 -p 5432:5432 postgres
   ```

2. **Acceder al contenedor de Postgres:**

   ```bash
   docker exec -it boxeo-container bash
   ```

3. **Acceder a la base de datos desde el contenedor:**

   ```bash
   psql -U joel -d boxing_ecommerce
   ```

4. **Listar las tablas en la base de datos:**

   Una vez dentro de `psql`, usa el siguiente comando para listar todas las tablas:

   ```sql
   \dt
   ```

### Paso 2: Configurar y ejecutar el backend

1. **Clonar el repositorio del backend y navegar al directorio del proyecto:**

   ```bash
   git clone https://github.com/tu-usuario/tu-repositorio-backend.git
   cd tu-repositorio-backend
   ```

2. **Crear el archivo `.env` en la raíz del proyecto con el siguiente contenido:**

   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=joel
   DB_PASSWORD=1234
   DB_NAME=boxing_ecommerce
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=sk_test_51PPQmTDA0KQHbCtDP0R0edkpCk6ApBGm3kBVkEGgCOnWDwBMIBM2642fRKO4Kg4l3SlaDoCVnS003Mg4w3B7BI3w00Nujfm1Xu
   STRIPE_WEBHOOK_SECRET=whsec_3a1dd17b43aa4fe43c75a36b08a78a10e28808a5aa6b4d653e3421b919d2f80b
   CLIENT_URL=http://localhost:4000
   ```

3. **Instalar las dependencias del proyecto:**

   ```bash
   npm install
   ```

4. **Ejecutar el backend:**

   ```bash
   npm start
   ```

   El backend correrá en el puerto 3000.

5. **Crear las tablas en la base de datos:**

   Ejecuta la siguiente comanda para aplicar las migraciones y crear las tablas definidas:

   ```bash
   npm run migration:run
   ```

### Paso 3: Configurar y ejecutar el frontend

1. **Clonar el repositorio del frontend y navegar al directorio del proyecto:**

   ```bash
   git clone https://github.com/tu-usuario/tu-repositorio-frontend.git
   cd tu-repositorio-frontend
   ```

2. **Instalar las dependencias del proyecto:**

   ```bash
   npm install
   ```

3. **Ejecutar el frontend:**

   ```bash
   npm start
   ```

   El frontend correrá en el puerto 4000.

### Paso 4: Configurar Stripe

1. **Instalar Stripe CLI:**

   Descarga e instala Stripe CLI desde [aquí](https://stripe.com/docs/stripe-cli#install).

2. **Iniciar sesión en Stripe CLI:**

   Hay dos maneras de iniciar sesión:

   - **Con la cuenta de Stripe:**

     ```bash
     stripe login
     ```

   - **Con las API keys:**

     ```bash
     stripe login --api-key <tu_api_key>
     ```

3. **Configurar el webhook de Stripe:**

   Ejecuta la siguiente comanda para configurar el webhook y redirigirlo a tu backend:

   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/process-checkout
   ```

### Paso 5: Insertar datos iniciales

1. **Script para insertar datos:**

   Hay un script en el backend llamado `seed.sql` ubicado en la carpeta `sql` (`/sql/seed.sql`). Este script inserta 20 productos en la base de datos. Puedes ejecutar este script con la siguiente comanda:

   ```bash
   npm run seed
   ```

### Decisiones de Diseño

1. **Uso de Docker**: Se utiliza Docker para crear y gestionar un entorno consistente y reproducible para la base de datos.
2. **Integración de Stripe**: Se ha integrado Stripe para el procesamiento de pagos, incluyendo la configuración del webhook y la columna `stripePriceId` en la tabla de productos.
3. **Separación de responsabilidades**: Las migraciones, inserciones iniciales y configuración de Stripe se manejan a través de scripts separados para mantener una clara separación de responsabilidades.
4. **Configuración del proyecto**: Se sigue una estructura clara para la configuración y ejecución del proyecto, asegurando que cada paso esté documentado y sea fácil de seguir.

## Notas Adicionales

- Asegúrate de que los puertos necesarios no estén ocupados por otros servicios en tu máquina local.
- Si deseas realizar cambios en la estructura de la base de datos, puedes modificar los archivos de migración y reiniciar el proceso de migración.
- Verifica que las variables de entorno estén correctamente configuradas en el archivo `.env`.

## Intento de Crear Docker Compose y Dockerfiles

En el proceso de esta práctica, también intentamos crear un `docker-compose.yml` y dos `Dockerfile` para el backend y frontend. Aquí está un resumen de esos intentos:

### Dockerfile para el Backend

```dockerfile
# Utiliza una imagen base oficial de Node.js
FROM node:14

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias del backend
RUN npm install

# Copia el resto de los archivos del backend
COPY . .

# Expone el puerto en el que el backend correrá
EXPOSE 3000

# Comando para correr el backend
CMD ["npm", "start"]
```

### Dockerfile para el Frontend

```dockerfile
# Utiliza una imagen base oficial de Node.js
FROM node:14

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias del frontend
RUN npm install

# Copia el resto de los archivos del frontend
COPY . .

# Construye el frontend
RUN npm run build

# Instala el servidor estático http-server
RUN npm install -g http-server

# Expone el puerto en el que el frontend correrá
EXPOSE 4000

# Comando para correr el frontend
CMD ["http-server", "dist"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:latest
    container_name: postgres_container
    environment:
      POSTGRES_USER: joel
      POSTGRES_PASSWORD: 1234
      POSTGRES_DB: boxing_ecommerce
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    container_name: backend_container
    environment:
      - PORT=3000
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_USER=joel
      - DB_PASSWORD=1234
      - DB_NAME=boxing_ecommerce
      - JWT_SECRET=your_jwt_secret
      - STRIPE_SECRET_KEY=sk_test_51PPQmTDA0KQHbCtDP0R0edkpCk6ApBGm3kBVkEGgCOnWDwBMIBM2642fRKO4Kg4l3SlaDoCVnS003Mg4w3B7BI3w00Nujfm1Xu
      - STRIPE_WEBHOOK_SECRET=whsec_3a1dd17b43aa4fe43c75a36b08a78a10e28808a5aa6b4d653e3421b919d2f80b
      - CLIENT_URL=http://localhost:4000
    ports:
      - "3000:3000"
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    container_name: frontend_container
    ports:
      - "4000:4000"

volumes:
  postgres_data:
```

Estos archivos de configuración están diseñados para simplificar la gestión y despliegue del backend, frontend y la base de datos con Docker. Aunque se intentó, estos archivos pueden requerir ajustes adicionales dependiendo de las necesidades específicas del proyecto.

## Autores

- [Joel Teodoro](https://github.com/JoelTeoGom)
- [Jon Jordi Salvador](https://github.com/Yoyito3D1)
