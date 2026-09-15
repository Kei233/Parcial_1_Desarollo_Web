# Parcial 1 - Desarrollo Web

**Docente:** Néstor Vélez Vargas

**Materia:** Desarrollo Web

**Integrantes:**
- Johan Tavera
- Andrey Calle
- Jose Mesa

**Fecha:** Septiembre 14 de 2026

## Descripción

Programa de consola en Node.js que permite crear usuarios con autenticación (username, password, rol) y gestionar un catálogo de películas, con dos roles: `administrador` y `basico`. No usa base de datos, toda la información se guarda en memoria mientras el programa está corriendo.

## Requisitos

Solo Node.js (el programa usa módulos incluidos en Node: `readline` y `crypto`).

## Ejecución

```bash
node app.js
```

## Uso

Al ejecutarlo se muestra un menú:

```
1. Registrar usuario
2. Iniciar sesión
3. Cerrar sesión
4. Crear película (solo administrador)
5. Consultar todas las películas
6. Consultar películas filtradas por año y precio
7. Salir
```

1. **Registrar usuario:** pide username, password y rol (`administrador` o `basico`). El password se guarda con hash (`crypto.scrypt`), nunca en texto plano.
2. **Iniciar sesión:** valida el username y password contra el hash guardado.
3. **Crear película:** solo funciona si hay una sesión iniciada con rol `administrador`; si un usuario `basico` lo intenta, el programa responde con un mensaje de error indicando que no está autorizado.
4. **Consultar todas las películas:** requiere estar logueado (cualquier rol).
5. **Consultar películas filtradas:** pide un año y un precio; muestra las películas con año de lanzamiento mayor al ingresado y precio menor o igual al ingresado. Requiere estar logueado.

## Notas

- Los datos (usuarios y películas) se pierden al cerrar el programa, ya que se guardan en memoria y el ejercicio no pide persistencia en base de datos.
- Todo el programa está en un único archivo (`app.js`) para mantenerlo simple.
