# Generador de Datos de Prueba - Roomatch Madrid

Este script genera datos de prueba para la aplicación Roomatch con perfiles realistas de Madrid.

## Datos Generados

- **100 Seekers** (buscadores de habitación)
  - Nombres españoles realistas
  - Ubicaciones en diferentes barrios de Madrid
  - Coordenadas geográficas reales
  - Bios en castellano
  - Preferencias variadas (presupuesto, mascotas, estilo de vida)
  - Radio de búsqueda configurado

- **20 Listings** (alojamientos)
  - Distribu idos por barrios de Madrid
  - Precios realistas (350€ - 750€)
  - Características variadas (WiFi, AC, amueblado, etc.)
  - Reglas de convivencia
  - Coordenadas exactas

## Uso

```bash
# Asegúrate de tener las variables de entorno configuradas en .env
node seed-data.js
```

## Credenciales

Todos los usuarios tienen la contraseña: `Test123!`

Ejemplos de emails generados:
- `carlos.garcia.lopez.0@roomatch.test`
- `maria.rodriguez.fernandez.1@roomatch.test`
- etc.

## Barrios de Madrid Incluidos

- Malasaña, Chueca, Lavapiés (Centro)
- Salamanca, Retiro (Este)
- Chamberí, Chamartín, Tetuán (Norte)
- Moncloa, Argüelles (Oeste)
- Usera, Vallecas, Carabanchel (Sur)
