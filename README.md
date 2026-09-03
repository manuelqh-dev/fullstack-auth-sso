# Proyecto Login & SSO - Econocom

Aplicación Full-Stack de autenticación desarrollada con **Spring Boot 2.7 (Java 1.8)** en el backend y **Angular 16** en el frontend, que incluye inicio de sesión tradicional mediante JWT y flujo SSO simulado (Decathlon).

---

## Requisitos Previos

* **Java JDK 1.8**
* **Maven 3.x**
* **Node.js** (v16) y **npm**
* **Angular CLI** (`npm install -g @angular/cli@16`)

---

## 1. Ejecución del Backend (Spring Boot)

1. Navega a la carpeta raíz del backend:
```bash
cd backend
```

2. Compila e inicia la aplicación:
```bash
./mvnw spring-boot:run
```

3. El servidor se iniciará en http://localhost:8080.

Endpoints principales:

 - POST /api/auth/login - Autenticación tradicional JWT

 - GET /api/auth/sso - Generación de URL para inicio de flujo SSO

 - POST /api/auth/sso/callback - Validación de código y emisión de JWT SSO

## 2. Ejecución del Frontend (Angular 16)

1. Navega a la carpeta raíz del frontend:
```bash
cd frontend
```

2. Arranca el servidor de desarrollo:
```bash
ng serve
```

3. Accede a la aplicación en el navegador desde http://localhost:4200.

4. Pruebas
```bash
cd backend
./mvnw clean test   
```

## Arquitectura y Decisiones Técnicas

 - Separación de responsabilidades: Cliente Angular desacoplado del servidor Spring Boot.

 - Seguridad y CORS: Configuración explícita en backend para permitir peticiones desde http://localhost:4200.

 - Persistencia: Almacenamiento seguro del token JWT en sessionStorage.

 - Flujo SSO: Integración de redirección y captura de callback para canje de código por token JWT.
