const readline = require("readline/promises");
const crypto = require("crypto");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const usuarios = [];
const peliculas = [
  {
    titulo: "Interstellar",
    director: "Christopher Nolan",
    anioLanzamiento: 2014,
    productora: "Warner Bros.",
    precio: 25000,
  },
  {
    titulo: "The Matrix",
    director: "Lana y Lilly Wachowski",
    anioLanzamiento: 1999,
    productora: "Warner Bros.",
    precio: 18000,
  },
  {
    titulo: "Inception",
    director: "Christopher Nolan",
    anioLanzamiento: 2010,
    productora: "Warner Bros.",
    precio: 22000,
  },
  {
    titulo: "Parasite",
    director: "Bong Joon-ho",
    anioLanzamiento: 2019,
    productora: "CJ Entertainment",
    precio: 20000,
  },
];

let usuarioActual = null;

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verificarPassword(password, passwordGuardado) {
  const [salt, hashGuardado] = passwordGuardado.split(":");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return hash === hashGuardado;
}

async function registrarUsuario() {
  const username = await rl.question("Username: ");

  if (usuarios.some((u) => u.username === username)) {
    console.log("Ese username ya existe.\n");
    return;
  }

  const password = await rl.question("Password: ");
  const rolInput = await rl.question("Rol (administrador/basico): ");
  const rol =
    rolInput.trim().toLowerCase() === "administrador"
      ? "administrador"
      : "basico";

  usuarios.push({
    username,
    password: hashPassword(password),
    rol,
  });

  console.log(`Usuario "${username}" creado con rol "${rol}".\n`);
}

async function iniciarSesion() {
  const username = await rl.question("Username: ");
  const password = await rl.question("Password: ");

  const usuario = usuarios.find((u) => u.username === username);

  if (!usuario || !verificarPassword(password, usuario.password)) {
    console.log("Username o password incorrectos.\n");
    return;
  }

  usuarioActual = usuario;
  console.log(`Sesión iniciada como "${usuario.username}" (${usuario.rol}).\n`);
}

function cerrarSesion() {
  if (!usuarioActual) {
    console.log("No hay ninguna sesión activa.\n");
    return;
  }
  console.log(`Sesión cerrada para "${usuarioActual.username}".\n`);
  usuarioActual = null;
}

async function crearPelicula() {
  if (!usuarioActual) {
    console.log("Error: debes iniciar sesión primero.\n");
    return;
  }

  if (usuarioActual.rol !== "administrador") {
    console.log("Error: no estás autorizado para crear películas.\n");
    return;
  }

  const titulo = await rl.question("Título: ");
  const director = await rl.question("Director: ");
  const anioLanzamiento = Number(await rl.question("Año de lanzamiento: "));
  const productora = await rl.question("Productora: ");
  const precio = Number(await rl.question("Precio: "));

  peliculas.push({ titulo, director, anioLanzamiento, productora, precio });

  console.log(`Película "${titulo}" creada correctamente.\n`);
}

function consultarPeliculas() {
  if (!usuarioActual) {
    console.log("Error: debes iniciar sesión primero.\n");
    return;
  }

  if (peliculas.length === 0) {
    console.log("No hay películas registradas.\n");
    return;
  }

  console.table(peliculas);
}

async function consultarPeliculasFiltradas() {
  if (!usuarioActual) {
    console.log("Error: debes iniciar sesión primero.\n");
    return;
  }

  const anio = Number(await rl.question("Año mínimo (mayor a): "));
  const precio = Number(await rl.question("Precio máximo (menor o igual a): "));

  const resultado = peliculas.filter(
    (p) => p.anioLanzamiento > anio && p.precio <= precio,
  );

  if (resultado.length === 0) {
    console.log("No hay películas que cumplan ese criterio.\n");
    return;
  }

  console.table(resultado);
}

function mostrarMenu() {
  console.log("========== MENU ==========");
  console.log(
    `Sesión actual: ${usuarioActual ? `${usuarioActual.username} (${usuarioActual.rol})` : "ninguna"}`,
  );
  console.log("1. Registrar usuario");
  console.log("2. Iniciar sesión");
  console.log("3. Cerrar sesión");
  console.log("4. Crear película (solo administrador)");
  console.log("5. Consultar todas las películas");
  console.log("6. Consultar películas filtradas por año y precio");
  console.log("7. Salir");
}

async function main() {
  let salir = false;

  while (!salir) {
    mostrarMenu();
    const opcion = await rl.question("Elige una opción: ");
    console.log("");

    switch (opcion.trim()) {
      case "1":
        await registrarUsuario();
        break;
      case "2":
        await iniciarSesion();
        break;
      case "3":
        cerrarSesion();
        break;
      case "4":
        await crearPelicula();
        break;
      case "5":
        consultarPeliculas();
        break;
      case "6":
        await consultarPeliculasFiltradas();
        break;
      case "7":
        salir = true;
        break;
      default:
        console.log("Opción inválida.\n");
    }
  }

  console.log("Programa finalizado.");
  rl.close();
}

main();
