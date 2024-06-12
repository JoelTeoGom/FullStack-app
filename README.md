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

0.**Descargar una imagen de docker con postgres:**

   ```bash
   docker pull postgres
   ```

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

1. **Clonar el repositorio del  y navegar al directorio del proyecto:**

   ```bash
   git clone git@github.com:JoelTeoGom/SCE-Practica-FullStack.git
   cd SCE-BackEnd-Definitiu
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
   También disponemos de dos comandos opcionales para generar y revertir las migraciones:
   ```bash
   npm run migration:generate
   ```
   ```bash
   npm run migration:revert
   ```

### Paso 3: Configurar y ejecutar el frontend

1. **Navegar al directorio del frontend:**

   ```bash
  
   cd SCE-FrontEnd-Definitiu
   ```

2. **Crear el archivo `.env` en la raíz del proyecto con el siguiente contenido:**

   ```env
   PORT=4000
   ```

3. **Instalar las dependencias del proyecto:**

   ```bash
   npm install
   ```

4. **Ejecutar el frontend:**

   ```bash
   npm start
   ```

   El frontend correrá en el puerto 4000.

5. **Descripción del componente Navbar:**

   Este proyecto es una aplicación web que utiliza una barra de navegación (Navbar) para facilitar el acceso a diferentes secciones de la tienda en línea de productos de boxeo. Esta barra de navegación está creada con React y la biblioteca de componentes de Material-UI. Contiene el componente `Navbar` que es responsable de la barra de navegación de la aplicación.

   Enlaces:
   - **Logo de boxeador**: Lleva a la página de productos (`/products`).
   - **Ruedecita**: Lleva a la página del historial de pedidos (`/order-history`).
   - **Carrito**: Lleva a la página del carrito de compras (`/cart`).
   - **Logout**: Borra las cookies de sesión haciendo un set-cookies age: 0 en el backend y redirige a la página de inicio de sesión.

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

4. **Acciones**

   Al hacer clic en el botón de checkout en el carrito, se redirige a la página de Stripe donde se pueden tomar dos acciones:

   - **Cancelar**: Si el usuario cancela el pago, será redirigido a una página de cancelación con un botón que lo llevará de vuelta al carrito.
   - **Completar el pago**: Si el usuario completa el pago, será redirigido a una página de éxito. En esta página, habrá un botón que redirigirá de vuelta al carrito. En caso de que el pago sea aceptado, el carrito se vaciará en el backend y se generará una orden.

### Paso 5: Insertar datos iniciales

1. **Script para insertar datos:**

   Hay un script en el backend llamado `seed.sql` ubicado en la carpeta `sql` (`/sql/seed.sql`). Este script inserta 20 productos en la base de datos. Puedes ejecutar este script con la siguiente comanda:

   ```sql
   INSERT INTO products (name, description, image, price, brand, type, stock, stripePriceId) VALUES
   ('Bota Blanca', 'Bota blanca de alta calidad', 'bota1.jpg', 120.00, 'Venum', 'Botas', 10, 'price_1PQ9E1DA0KQHbCtDm0c12nmM'),
   ('Bota Negra', 'Bota negra de alta calidad', 'bota2.jpg', 130.00, 'Nike', 'Botas', 15, 'price_1PQ9GSDA0KQHbCtDGTU7Pzyl'),
   ('Bota Azul', 'Bota azul de alta calidad', 'bota3.jpg', 110.00, 'Everlast', 'Botas', 8, 'price_1PQ9GqDA0KQHbCtDt9avesJ3'),
   ('Bota Roja', 'Bota roja de alta calidad', 'bota4.jpg', 125.00, 'Venum', 'Botas', 12, 'price_1PQ9HcDA0KQHbCtDkldtduXK'),
   ('Casc Blau', 'Casc blau de alta protecció', 'casc1.jpg', 75.00, 'Leone', 'Cascs', 20, 'price_1PQ9I5DA0KQHbCtDAjpLM8d7'),
   ('Casc Negre', 'Casc negre de alta protecció', 'casc2.jpg', 80.00, 'Leone', 'Cascs', 18, 'price_1PQ9JQDA0KQHbCtDXsEz9E6i'),
   ('Casc Vermell', 'Casc vermell de alta protecció', 'casc3.jpg', 78.00, 'Leone', 'Cascs', 22, 'price_1PQ9JsDA0KQHbCtDRK6nQo2y'),
   ('Casc Verd', 'Casc verd de alta protecció', 'casc4.jpg', 85.00, 'Venum', 'Cascs', 16, 'price_1PQ9KIDA0KQHbCtDVNIYkrda'),
   ('Guants Negre', 'Guants negres de boxa', 'guants1.jpg', 60.00, 'Everlast', 'Guants', 25, 'price_1PQ9KzDA0KQHbCtDwsqHnzM5'),
   ('Guants Blanc i Negre', 'Guants blanc i negre de boxa', 'guants2.jpg', 65.00, 'Leone', 'Guants', 30, 'price_1PQ9LgDA0KQHbCtDu60gGgY1'),
   ('Guants Negre i Groc', 'Guants negres i grocs de boxa', 'guants3.jpg', 70.00, 'Evo', 'Guants', 20, 'price_1PQ9M5DA0KQHbCtDMAZsScZd'),
   ('Guants Negre i Blanc', 'Guants negres i blancs de boxa', 'guants4.jpg', 68.00, 'Leone', 'Guants', 25, 'price_1PQ9MdDA0KQHbCtDM8qPYkAm'),
   ('Mano Negre i Blanc', 'Mano negre i blanc de boxa', 'mano1.jpg', 50.00, 'Langray', 'Mano', 30, 'price_1PQ9N1DA0KQHbCtDmnWn2XBc'),
   ('Mano Negre i Groc', 'Mano negre i groc de boxa', 'mano2.jpg', 55.00, 'Everlast', 'Mano', 28, 'price_1PQ9NMDA0KQHbCtDOQzTFR2e'),
   ('Mano Vermell i Negre', 'Mano vermell i negre de boxa', 'mano3.jpg', 53.00, 'Everlast', 'Mano', 26, 'price_1PQ9NzDA0KQHbCtD4nqyHrhT'),
   ('Mano Marró', 'Mano marró de boxa', 'mano4.jpg', 60.00, 'Everlast', 'Mano', 24, 'price_1PQ9OZDA0KQHbCtD6bRyWanS'),
   ('Sac Vermell', 'Sac vermell de boxa', 'sac1.jpg', 90.00, 'Everlast', 'Sac', 15, 'price_1PQ9PKDA0KQHbCtD1FgjXhtj'),
   ('Sac Negre i Groc', 'Sac negre i groc de boxa', 'sac2.jpg', 95.00, 'Leone', 'Sac', 12, 'price_1PQ9PfDA0KQHbCtD1PB17jdn'),
   ('Sac Negre i Blanc', 'Sac negre i blanc de boxa', 'sac3.jpg', 100.00, 'Venum', 'Sac', 10, 'price_1PQ9PxDA0KQHbCtDlDE26UY7'),
   ('Sac Negre i Lletra Blanca', 'Sac negre i lletra blanca de boxa', 'sac4.jpg', 110.00, 'Leone', 'Sac', 8, 'price_1PQ9QKDA0KQHbCtDQSRy7ITQ');
   ```

### Decisiones de Diseño

1. **Uso de Docker**: Se utiliza Docker para crear y gestionar un entorno consistente y reproducible para la base de datos.
2. **Integración de Stripe**: Se ha integrado Stripe para el procesamiento de pagos, incluyendo la configuración del webhook y la columna `stripePriceId` en la tabla de productos. También se usa el correo del propio user en la sesión de stripe para evitar que user escriba un correo aleatorio, ya que este junto a line_items nos servira para hacer el checkout.
3. **Separación de responsabilidades**: Las migraciones, inserciones iniciales y configuración de Stripe se manejan a través de scripts separados para mantener una clara separación de responsabilidades.
4. **Configuración del proyecto**: Se sigue una estructura clara para la configuración y ejecución del proyecto, asegurando que cada paso esté documentado y sea fácil de seguir.
5. **Uso de UUID**: Se usa el UUID en todas las tablas tal y como se especifica en la práctica.
6. **Email único**: Solo hay una cuenta por email. Una vez creada esa cuenta no se puede volver a usar el email a no ser que se elimine la fila en la tabla de users.

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
