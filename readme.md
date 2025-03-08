# TypeMaster - Aplicación de Práctica de Mecanografía

TypeMaster es una aplicación web interactiva que permite a los usuarios mejorar sus habilidades de mecanografía mediante prácticas personalizadas con diferentes tipos de textos, análisis de rendimiento y seguimiento de progreso.

![Logo de TypeMaster](https://via.placeholder.com/150?text=TypeMaster)

## Características principales

- **Práctica de mecanografía personalizada**: Ejercita tu velocidad y precisión con textos de diferentes categorías.
- **Múltiples categorías de textos**: Desde lecciones básicas hasta textos literarios, código de programación y más.
- **Sistema de usuarios**: Regístrate para guardar tu progreso y acceder a todas las funcionalidades.
- **Estadísticas detalladas**: Analiza tu rendimiento con métricas como PPM (palabras por minuto), precisión y tiempo.
- **Gestión de textos**: Añade, edita y elimina tus propios textos para practicar.
- **Tabla de clasificación**: Compite con otros usuarios y ve quién es el más rápido.
- **Arquitectura moderna**: Backend en Node.js/Express y frontend en React con Tailwind CSS.

## Tecnologías utilizadas

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT para autenticación
- bcrypt para encriptación

### Frontend
- React
- React Router
- Context API para gestión de estado
- Tailwind CSS para estilos
- Axios para peticiones HTTP
- Chart.js para visualización de datos

### Infraestructura
- Docker
- Docker Compose para orquestación de contenedores
- Nginx como servidor web para el frontend

## Instalación y ejecución

### Requisitos previos
- Docker y Docker Compose
- Git

### Pasos para ejecutar la aplicación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/typing-practice-app.git
cd typing-practice-app
```

2. Crear archivo de variables de entorno:
```bash
# Crear .env en la raíz del proyecto
echo "NODE_ENV=production
MONGO_URI=mongodb://mongo:27017/typingapp
JWT_SECRET=tu_secreto_seguro_para_jwt" > .env
```

3. Ejecutar con Docker Compose:
```bash
docker-compose up -d
```

4. Cargar datos iniciales:
```bash
docker-compose exec backend npm run seed
docker-compose exec backend npm run load-texts
```

5. Acceder a la aplicación:
- Frontend: http://localhost:3000
- API: http://localhost:4000/api

## Estructura del proyecto

```
typing-practice-app/
├── frontend/                # Aplicación React
│   ├── public/              # Archivos estáticos
│   ├── src/                 # Código fuente
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/           # Páginas principales
│   │   ├── contexts/        # Context API para estado global
│   │   ├── services/        # Servicios para API
│   │   ├── utils/           # Utilidades
│   │   └── ...
│   ├── Dockerfile
│   └── ...
├── backend/                 # Servidor Node.js/Express
│   ├── controllers/         # Controladores para rutas
│   ├── models/              # Modelos de MongoDB
│   ├── routes/              # Definición de rutas API
│   ├── middleware/          # Middleware personalizado
│   ├── utils/               # Utilidades
│   ├── Dockerfile
│   └── ...
├── docker-compose.yml       # Configuración de Docker Compose
└── README.md                # Este archivo
```

## Uso de la aplicación

### Registro y acceso
1. Regístrate con un nombre de usuario, email y contraseña
2. Inicia sesión con tus credenciales

### Práctica de mecanografía
1. Selecciona una categoría de texto
2. Comienza a escribir cuando estés listo
3. Al finalizar, revisa tus estadísticas
4. Intenta mejorar tu puntuación anterior

### Gestión de textos
1. Accede a la sección de textos
2. Explora los textos disponibles
3. Añade nuevos textos con diferentes categorías y niveles de dificultad
4. Selecciona cualquier texto para practicar

## Desarrollo

### Modo desarrollo
Para ejecutar la aplicación en modo desarrollo con recarga en caliente:

```bash
# Crear docker-compose.dev.yml con configuración de desarrollo
docker-compose -f docker-compose.dev.yml up
```

### Ejecutar pruebas
```bash
docker-compose exec frontend npm test
docker-compose exec backend npm test
```

## Contribuciones

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Haz fork del repositorio
2. Crea una rama para tu característica (`git checkout -b feature/amazing-feature`)
3. Realiza tus cambios y haz commit (`git commit -m 'Add some amazing feature'`)
4. Sube tus cambios (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la licencia MIT - ver el archivo LICENSE para más detalles.

## Contacto

Tu Nombre - [tu-email@example.com](mailto:tu-email@example.com)

Link del proyecto: [https://github.com/tu-usuario/typing-practice-app](https://github.com/tu-usuario/typing-practice-app)

---

# Futuras mejoras

- Modo competitivo en tiempo real con otros usuarios
- Ejercicios específicos para ciertas teclas problemáticas
- Sistema de logros y gamificación
- Más idiomas para practicar
- Modo oscuro
- App móvil

¡Disfruta mejorando tu velocidad de mecanografía con TypeMaster!