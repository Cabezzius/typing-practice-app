const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Text = require('../models/textModel');

// Configuración
dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/typingapp';

// Colección de textos para cargar
const textsToLoad = [
  // Lecciones de iniciación
  {
    title: "Fila central - asdf jklñ",
    content: "asdf asdf jklñ jklñ asdf jklñ fjdk slañ fdsa ñlkj fads ñkjl",
    category: "iniciación",
    difficulty: 1,
    idioma: "castellano",
    isPublic: true
  },
  {
    title: "Fila superior - qwer uiop",
    content: "qwer uiop qwer uiop qwui erpo qwru eiop qwue iopr ewrq poiu",
    category: "iniciación",
    difficulty: 1,
    idioma: "castellano",
    isPublic: true
  },
  {
    title: "Fila inferior - zxcv bnm",
    content: "zxcv bnm zxcv bnm zxbn cvm zcvb nm zxvb nmcx zbcv nmzx bnmc",
    category: "iniciación",
    difficulty: 1,
    idioma: "castellano",
    isPublic: true
  },
  {
    title: "Letras completas",
    content: "el rápido zorro marrón saltó sobre el perro perezoso. El RÁPIDO ZORRO MARRÓN SALTÓ SOBRE EL PERRO PEREZOSO.",
    category: "iniciación",
    difficulty: 2,
    idioma: "castellano",
    isPublic: true
  },
  
  // Textos fáciles
  {
    title: "El cielo azul",
    content: "El cielo es azul y las nubes son blancas. El sol brilla intensamente durante el día. Las estrellas aparecen por la noche junto con la luna. El clima cambia según la estación del año.",
    category: "fácil",
    difficulty: 2,
    idioma: "castellano",
    isPublic: true
  },
  {
    title: "Los animales",
    content: "El perro ladra y el gato maúlla. Los pájaros cantan por la mañana. Los peces nadan en el agua clara. Las jirafas tienen cuellos largos para alcanzar las hojas altas.",
    category: "fácil",
    difficulty: 2,
    idioma: "castellano",
    isPublic: true
  },
  {
    title: "La comida",
    content: "Me gusta comer frutas y verduras. El pan se hace con harina y agua. La pizza es un plato de origen italiano. El chocolate es dulce y delicioso. Bebo agua para mantenerme hidratado.",
    category: "fácil",
    difficulty: 2,
    idioma: "castellano",
    isPublic: true
  },
  
  // Textos intermedios
  {
    title: "El sistema solar",
    content: "El sistema solar está formado por el Sol y todos los objetos que orbitan a su alrededor, incluyendo los planetas, lunas, asteroides y cometas. El planeta más grande es Júpiter, y el más cercano al Sol es Mercurio. La Tierra es el único planeta conocido que alberga vida hasta el momento.",
    category: "intermedio",
    difficulty: 4,
    idioma: "castellano",
    isPublic: true
  },
  {
    title: "Historia de Internet",
    content: "Internet surgió de un proyecto del Departamento de Defensa de Estados Unidos en la década de 1960. La World Wide Web fue inventada por Tim Berners-Lee en 1989 mientras trabajaba en el CERN. Hoy en día, Internet conecta a miles de millones de dispositivos en todo el mundo y ha transformado la manera en que vivimos, trabajamos y nos comunicamos.",
    category: "intermedio",
    difficulty: 5,
    idioma: "castellano",
    isPublic: true
  },
  {
    title: "Beneficios del ejercicio",
    content: "El ejercicio regular fortalece el corazón, mejora la circulación sanguínea y reduce el riesgo de enfermedades crónicas. Además, libera endorfinas que producen sensación de bienestar y ayuda a mantener un peso saludable. Los expertos recomiendan al menos 150 minutos de actividad física moderada a la semana para obtener beneficios para la salud.",
    category: "intermedio",
    difficulty: 4,
    idioma: "castellano",
    isPublic: true
  },
  
  // Textos difíciles
  {
    title: "Inteligencia Artificial",
    content: "La inteligencia artificial (IA) es la simulación de procesos de inteligencia humana por sistemas informáticos. Estos procesos incluyen el aprendizaje (la adquisición de información y reglas para usar la información), el razonamiento (usar las reglas para llegar a conclusiones aproximadas o definitivas) y la autocorrección. Las aplicaciones particulares de la IA incluyen sistemas expertos, procesamiento del lenguaje natural, reconocimiento de voz y visión artificial.",
    category: "difícil",
    difficulty: 7,
    idioma: "castellano",
    isPublic: true
  },
  {
    title: "La teoría de la relatividad",
    content: "La teoría de la relatividad especial de Einstein, publicada en 1905, establece que las leyes de la física son iguales para todos los observadores que no estén acelerando, y que la velocidad de la luz en el vacío es la misma para todos los observadores, independientemente de su movimiento relativo o del movimiento de la fuente de luz. Esto llevó a la famosa ecuación E=mc², que demuestra la equivalencia entre masa y energía.",
    category: "difícil",
    difficulty: 8,
    idioma: "castellano",
    isPublic: true
  },
  {
    title: "El cerebro humano",
    content: "El cerebro humano es el órgano más complejo del cuerpo, con aproximadamente 86.000 millones de neuronas conectadas por trillones de sinapsis. A pesar de representar solo alrededor del 2% del peso corporal, consume aproximadamente el 20% de la energía total del cuerpo. Las diferentes regiones del cerebro se especializan en diversas funciones, desde el procesamiento sensorial y el movimiento hasta el pensamiento abstracto y la formación de memorias complejas.",
    category: "difícil",
    difficulty: 7,
    idioma: "castellano",
    isPublic: true
  },
  
  // Programación
  {
    title: "Función JavaScript",
    content: "function calcularPromedio(numeros) {\n  if (numeros.length === 0) return 0;\n  \n  const suma = numeros.reduce((total, num) => total + num, 0);\n  return suma / numeros.length;\n}\n\nconst valores = [10, 15, 20, 25, 30];\nconsole.log(`El promedio es: ${calcularPromedio(valores)}`);\n",
    category: "programación",
    difficulty: 6,
    idioma: "castellano",
    isPublic: true
  },
  {
    title: "Método Python",
    content: "def fibonacci(n):\n    if n <= 0:\n        return []\n    elif n == 1:\n        return [0]\n    elif n == 2:\n        return [0, 1]\n    \n    fib = [0, 1]\n    for i in range(2, n):\n        fib.append(fib[i-1] + fib[i-2])\n    \n    return fib\n\nprint(fibonacci(10))  # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]",
    category: "programación",
    difficulty: 6,
    idioma: "castellano",
    isPublic: true
  },
  {
    title: "Consulta SQL",
    content: "SELECT\n    c.customer_name,\n    COUNT(o.order_id) AS total_orders,\n    SUM(oi.quantity * p.price) AS total_spent\nFROM\n    customers c\nJOIN\n    orders o ON c.customer_id = o.customer_id\nJOIN\n    order_items oi ON o.order_id = oi.order_id\nJOIN\n    products p ON oi.product_id = p.product_id\nWHERE\n    o.order_date BETWEEN '2023-01-01' AND '2023-12-31'\nGROUP BY\n    c.customer_id\nHAVING\n    COUNT(o.order_id) > 5\nORDER BY\n    total_spent DESC\nLIMIT 10;",
    category: "programación",
    difficulty: 7,
    idioma: "castellano",
    isPublic: true
  },
  
  // Ciencia y tecnología
  {
    title: "Cambio climático",
    content: "El cambio climático se refiere a alteraciones significativas y duraderas en los patrones meteorológicos a lo largo del tiempo. Está principalmente impulsado por actividades humanas, especialmente la quema de combustibles fósiles, que aumenta los niveles de gases de efecto invernadero en la atmósfera terrestre. Las consecuencias incluyen el aumento de las temperaturas globales, el derretimiento de los casquetes polares, la elevación del nivel del mar y el incremento de fenómenos meteorológicos extremos.",
    category: "ciencia",
    difficulty: 6,
    idioma: "castellano",
    isPublic: true
  },
  {
    title: "Computación cuántica",
    content: "La computación cuántica aprovecha los principios de la mecánica cuántica para realizar cálculos mediante qubits en lugar de bits convencionales. A diferencia de los bits, que solo pueden ser 0 o 1, los qubits pueden existir en múltiples estados simultáneamente gracias al fenómeno de superposición. Esto permite que las computadoras cuánticas aborden problemas de optimización complejos, criptografía y simulaciones moleculares que serían prácticamente imposibles para las computadoras tradicionales.",
    category: "ciencia",
    difficulty: 8,
    idioma: "castellano",
    isPublic: true
  },
  
  // Literatura
  {
    title: "Don Quijote - Miguel de Cervantes",
    content: "En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y galgo corredor. Una olla de algo más vaca que carnero, salpicón las más noches, duelos y quebrantos los sábados, lentejas los viernes, algún palomino de añadidura los domingos, consumían las tres partes de su hacienda.",
    category: "literatura",
    difficulty: 7,
    idioma: "castellano",
    isPublic: true
  },
  {
    title: "Cien años de soledad - Gabriel García Márquez",
    content: "Muchos años después, frente al pelotón de fusilamiento, el coronel Aureliano Buendía había de recordar aquella tarde remota en que su padre lo llevó a conocer el hielo. Macondo era entonces una aldea de veinte casas de barro y cañabrava construidas a la orilla de un río de aguas diáfanas que se precipitaban por un lecho de piedras pulidas, blancas y enormes como huevos prehistóricos.",
    category: "literatura",
    difficulty: 8,
    idioma: "castellano",
    isPublic: true
  },
  
  // Negocios y profesional
  {
    title: "Correo de seguimiento",
    content: "Estimado Sr. Martínez:\n\nLe escribo para dar seguimiento a nuestra reunión del pasado martes respecto al proyecto de implementación del nuevo sistema de gestión. Según lo acordado, adjunto encontrará la propuesta detallada con los plazos y costes estimados.\n\nQuedo a su disposición para resolver cualquier duda o aclaración adicional.\n\nSaludos cordiales,\nAna López\nDirectora de Proyectos",
    category: "profesional",
    difficulty: 5,
    idioma: "castellano",
    isPublic: true
  },
  
  // Números y símbolos
  {
    title: "Práctica de números",
    content: "12345 67890 54321 09876 13579 24680 98765 43210 55555 99999 11111 22222 33333 44444 98123 45678 10293 84756",
    category: "números",
    difficulty: 4,
    idioma: "castellano",
    isPublic: true
  },
  {
    title: "Práctica de símbolos",
    content: "!@#$ %^&* ()_+ []{}\\|;:'\",.<>/? ¡¿áéíóúÁÉÍÓÚüÜñÑ €£¥$¢ ®©™ °±≠≈≤≥×÷ →←↑↓",
    category: "símbolos",
    difficulty: 7,
    idioma: "castellano",
    isPublic: true
  }
];

// Función para cargar los textos
const loadTexts = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB conectado exitosamente');

    // Verificar si ya existen textos con los mismos títulos
    const existingTitles = await Text.find({
      title: { $in: textsToLoad.map(text => text.title) }
    }).select('title');
    
    const existingTitleSet = new Set(existingTitles.map(text => text.title));
    
    // Filtrar solo los textos que no existen
    const textsToInsert = textsToLoad.filter(text => !existingTitleSet.has(text.title));
    
    if (textsToInsert.length === 0) {
      console.log('Todos los textos ya existen en la base de datos.');
      process.exit(0);
    }

    // Crear los textos
    const createdTexts = await Text.insertMany(textsToInsert);
    console.log(`${createdTexts.length} nuevos textos creados:`);
    createdTexts.forEach(text => console.log(`- ${text.title}`));

    process.exit(0);
  } catch (error) {
    console.error('Error al cargar textos:', error);
    process.exit(1);
  }
};

// Ejecutar la función
loadTexts();