# 📚 Biblioteca API — Node.js + Express + Sequelize + JWT

API RESTful para la gestión de usuarios y libros, desarrollada con **Node.js**, **Express** y **Sequelize (SQLite)**.  
Incluye autenticación JWT, control de roles y rutas protegidas.

---

## 🚀 Características principales

- Registro e inicio de sesión con **bcrypt** y **JWT (HS256)**.
- Tokens con **expiración configurada en `.env`**.
- Middleware de autenticación y autorización por roles.
- Gestión de usuarios y libros.
- Base de datos **SQLite** autogenerada.
- Estructura modular y escalable.

---

## 🧩 Tecnologías utilizadas

| Tecnología | Descripción |
|-------------|--------------|
| Node.js | Entorno de ejecución |
| Express | Framework para construir la API |
| Sequelize | ORM para manejar la base de datos |
| SQLite | Base de datos ligera y embebida |
| bcrypt | Cifrado de contraseñas |
| jsonwebtoken | Generación y validación de JWT |
| dotenv | Manejo de variables de entorno |
| nodemon | Recarga automática en desarrollo |

---

## ⚙️ Instalación y configuración

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/tuusuario/biblioteca-api.git
cd biblioteca-api
2️⃣ Instalar dependencias
bash
Copiar código
npm install
3️⃣ Crear archivo .env
env
Copiar código
PORT=3000
SECRET_KEY=2025MEDELLINSOFTWARE
JWT_EXPIRES_IN=1h
DATABASE_STORAGE=./database.sqlite
4️⃣ Ejecutar el servidor
bash
Copiar código
npm run dev
```
🗂️ Estructura del proyecto
pgsql
Copiar código
BIBLIOTECA-API/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   └── booksController.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── roleMiddleware.js
│
├── models/
│   ├── book.js
│   ├── index.js
│   └── user.js
│
├── routes/
│   ├── auth.js
│   ├── books.js
│   └── users.js
│
├── server.js
├── .env
├── database.sqlite
├── package.json
└── package-lock.json
🔑 Autenticación JWT
Los tokens se generan con el algoritmo HS256 y contienen información del usuario:

{
  "id": 1,
  "email": "admin@biblioteca.local",
  "role": "admin",
  "iat": 1730001234,
  "exp": 1730004834
}
iat: fecha de creación

exp: fecha de expiración (definida en .env con JWT_EXPIRES_IN)

📮 Endpoints principales
🧍 Usuarios y autenticación
Método	Ruta	Descripción
POST	/auth/register	Registro de usuario
POST	/auth/login	Inicio de sesión (devuelve token)
PATCH	/users/:id/role	Cambiar rol de usuario (solo admin)

📚 Libros
Método	Ruta	Descripción	Autenticación
GET	/books	Listar libros	✅ Token requerido
POST	/books	Crear libro	✅ Solo admin
PUT	/books/:id	Editar libro	✅ Solo admin
DELETE	/books/:id	Eliminar libro	✅ Solo admin

🧠 Ejemplos de uso en Postman
1️⃣ Registro de usuario
POST → http://localhost:3000/auth/register

{
  "fullName": "Juan Pérez",
  "email": "juan@example.com",
  "password": "123456"
}
2️⃣ Inicio de sesión
POST → http://localhost:3000/auth/login

{
  "email": "juan@example.com",
  "password": "123456"
}
Respuesta esperada:

{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
3️⃣ Ruta protegida
GET → http://localhost:3000/books

Header:
Authorization: Bearer <TU_TOKEN>
4️⃣ Cambiar rol de usuario
PATCH → http://localhost:3000/users/2/role

{
  "role": "admin"
}
🧱 Middleware de autenticación
middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
  const header = req.headers['authorization'];
  const token = header && header.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido o expirado' });
    req.user = user;
    next();
  });
};
🧩 Middleware de roles
middleware/roleMiddleware.js

exports.isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado: solo administradores' });
  }
  next();
};
🧾 Pruebas funcionales (Postman)
✅ Registro de usuario: POST /auth/register
✅ Login: POST /auth/login devuelve token JWT
✅ Ruta protegida: GET /books con token válido
❌ Sin token: acceso rechazado con mensaje de error
✅ Crear libro (admin): permitido
❌ Crear libro (user): rechazado
✅ Editar y eliminar libro (admin): permitido

💬 Preguntas del informe
1️⃣ ¿Qué sucede si el token expira o es inválido?
➡️ El servidor responde:

{
  "message": "Token inválido o expirado"
}
2️⃣ ¿Por qué no se debe guardar la contraseña en texto plano?
➡️ Porque si la base de datos es vulnerada, las contraseñas serían visibles.
Se usa bcrypt.hash() para cifrarlas antes de guardarlas.

Ejemplo en código:

const hashedPassword = await bcrypt.hash(password, 10);
En la base de datos:

$2b$10$F7Q3nR1kH9p6Z8Zk7nC4MeXhWq93q...
3️⃣ ¿Qué información mínima debería tener un JWT?
➡️ El payload mínimo debería incluir:

{
  "id": 1,
  "email": "usuario@ejemplo.com",
  "role": "user"
}
En jwt.io, se puede ver decodificado el token.

4️⃣ ¿Cómo proteger las rutas para que solo usuarios autenticados las usen?
➡️ Usando el middleware authenticateToken y los roles definidos:

router.get('/books', authenticateToken, getAllBooks);
router.post('/books', authenticateToken, isAdmin, createBook);
Si no se envía token:

{ "message": "Token no proporcionado" }
5️⃣ ¿Qué ventaja tiene Express/Node.js frente a otros frameworks al manejar autenticación?
➡️ Flexibilidad y simplicidad.
Express permite implementar JWT, bcrypt y middlewares personalizados de forma modular, ligera y rápida, sin depender de librerías pesadas o estructuras rígidas.

👑 Roles de usuario
Rol	Permisos
admin	Crear, editar, eliminar y listar libros
user	Solo puede listar libros

🧠 Reflexión final
La autenticación con JWT y Node.js ofrece un flujo moderno, escalable y seguro.
Gracias a su arquitectura basada en middlewares, Express permite implementar autenticación y control de acceso de manera clara, simple y eficiente, ideal para APIs RESTful modernas.

👨‍💻 Autor
Juan Daniel Gómez Correa - Estudiante de Programación de Software en el SENA
