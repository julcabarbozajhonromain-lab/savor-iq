export interface PeruvianDish {
  id: string;
  name: string;
  region: 'Costa Criolla' | 'Andina' | 'Amazónica' | 'Chifa Peruano' | 'Marina' | 'Casera Diaria' | 'Fit Peruano';
  coreIngredients: string[];
  secondaryIngredients: string[];
  aderezoTechnique: string;
  fitAdaptation: string;
  prepTime: string;
  estimatedCalories: number;
}

/**
 * Diccionario de sinónimos culinarios para traducir términos neutros/extranjeros
 * al vocabulario gastronómico peruano real.
 */
export const PERUVIAN_SYNONYMS: Record<string, string> = {
  cilantro: 'culantro',
  coriandro: 'culantro',
  aguacate: 'palta',
  palta: 'palta',
  'salsa de soya': 'sillao',
  'salsa de soja': 'sillao',
  soya: 'sillao',
  soja: 'sillao',
  jengibre: 'kión',
  kion: 'kión',
  guisantes: 'alverjitas',
  guisante: 'alverjitas',
  arvejas: 'alverjitas',
  arveja: 'alverjitas',
  chicharos: 'alverjitas',
  alverjas: 'alverjitas',
  maiz: 'choclo',
  maíz: 'choclo',
  elote: 'choclo',
  batata: 'camote',
  boniato: 'camote',
  frijoles: 'frejoles',
  frijol: 'frejoles',
  habichuelas: 'frejoles',
  porotos: 'frejoles',
  patata: 'papa',
  patatas: 'papa',
  papas: 'papa',
  cebollin: 'cebolla china',
  cebollín: 'cebolla china',
  cebolleta: 'cebolla china',
  verdeo: 'cebolla china',
  calabaza: 'zapallo',
  auyama: 'zapallo',
  cacahuate: 'maní',
  cacahuates: 'maní',
  mani: 'maní',
  ejotes: 'vainitas',
  judias: 'vainitas',
  'habichuelas verdes': 'vainitas',
  pasta: 'tallarines',
  espagueti: 'tallarines',
  spaghetti: 'tallarines',
  fideo: 'fideos',
  bistec: 'carne de res',
  res: 'carne de res',
  ternera: 'carne de res',
  carne: 'carne de res',
  chancho: 'cerdo',
  puerco: 'cerdo',
  chile: 'ají amarillo',
  aji: 'ají amarillo',
  ají: 'ají amarillo',
  huevos: 'huevo',
  tomates: 'tomate',
  cebollas: 'cebolla',
  limones: 'limón',
  limon: 'limón',
  zanahorias: 'zanahoria',
  espinacas: 'espinaca',
  lenteja: 'lentejas',
  garbanzo: 'garbanzos',
  atun: 'atún'
};

/**
 * Catálogo estructurado de la gastronomía peruana (Criolla, Casera, Chifa, Marina, Andina y Fit)
 */
export const PERUVIAN_DISH_CATALOG: PeruvianDish[] = [
  {
    id: 'arroz-con-pollo',
    name: 'Arroz con Pollo Peruano',
    region: 'Costa Criolla',
    coreIngredients: ['arroz', 'pollo', 'culantro', 'espinaca'],
    secondaryIngredients: ['ají amarillo', 'alverjitas', 'zanahoria', 'pimiento', 'cebolla', 'ajo', 'cerveza negra', 'choclo'],
    aderezoTechnique: 'Sellar las presas de pollo, hacer aderezo de cebolla, ajo y pasta de ají amarillo bien dorado, incorporar el licuado de culantro con espinaca, caldo/cerveza negra y graneado con arroz, alverjitas, zanahoria y pimiento.',
    fitAdaptation: 'Usar pechuga de pollo sin piel, medir 1/2 taza de arroz en crudo por porción, duplicar la cantidad de espinaca, culantro, alverjitas y pimiento, y acompañar con zarza criolla en vez de papa a la huancaína.',
    prepTime: '35 min',
    estimatedCalories: 520
  },
  {
    id: 'aguadito-de-pollo',
    name: 'Aguadito de Pollo Casero',
    region: 'Costa Criolla',
    coreIngredients: ['arroz', 'pollo', 'culantro', 'espinaca'],
    secondaryIngredients: ['papa', 'choclo', 'alverjitas', 'zanahoria', 'ají amarillo', 'pimiento', 'cebolla', 'ajo', 'limón'],
    aderezoTechnique: 'Aderezo base de cebolla, ajo y ají amarillo con licuado concentrado de culantro y espinaca en abundante caldo sustancioso, cocinando el arroz hasta que reviente junto con papa amarilla, choclo y verduras.',
    fitAdaptation: 'Reducir la proporción de arroz a 1/3 de taza, usar pechuga de pollo en trozos y aumentar las verduras (alverjitas, zanahoria, pimiento y espinaca).',
    prepTime: '30 min',
    estimatedCalories: 390
  },
  {
    id: 'lomo-saltado',
    name: 'Lomo Saltado Tradicional',
    region: 'Costa Criolla',
    coreIngredients: ['carne de res', 'cebolla', 'tomate', 'papa'],
    secondaryIngredients: ['sillao', 'vinagre', 'ají amarillo', 'culantro', 'arroz', 'ajo', 'cebolla china'],
    aderezoTechnique: 'Saltear la carne a fuego muy alto en wok o sartén bien caliente para ahumar, incorporar cebolla roja en gajos gruesos, ají amarillo en tiras y tomate, desglasar con sillao y vinagre tinto, y terminar con culantro picado.',
    fitAdaptation: 'Hacer las papas en Air Fryer o al horno con mínima grasa, usar lomo fino magro y servir con media porción de arroz o quinua graneada.',
    prepTime: '20 min',
    estimatedCalories: 540
  },
  {
    id: 'pollo-saltado',
    name: 'Pollo Saltado al Wok',
    region: 'Casera Diaria',
    coreIngredients: ['pollo', 'cebolla', 'tomate', 'papa'],
    secondaryIngredients: ['sillao', 'vinagre', 'ají amarillo', 'culantro', 'arroz', 'ajo', 'brócoli', 'vainitas'],
    aderezoTechnique: 'Saltear tiras de pechuga de pollo a fuego vivo con ajo, agregar cebolla en gajos, ají amarillo y tomate firme, flamear con sillao y un toque de vinagre, finalizando con culantro fresco.',
    fitAdaptation: 'Papas doradas en Air Fryer y añadir bastones de brócoli o vainitas al salteado para mayor fibra y saciedad.',
    prepTime: '20 min',
    estimatedCalories: 460
  },
  {
    id: 'tallarines-verdes',
    name: 'Tallarines Verdes Peruanos con Pollo o Bistec',
    region: 'Costa Criolla',
    coreIngredients: ['tallarines', 'espinaca', 'albahaca', 'queso fresco'],
    secondaryIngredients: ['leche evaporada', 'pollo', 'carne de res', 'pecanas', 'ajo', 'cebolla', 'papa'],
    aderezoTechnique: 'Blanquear o saltear ligeramente hojas de espinaca y albahaca con cebolla y ajo dorados, licuar con queso fresco peruano, leche evaporada y pecanas/nueces hasta lograr una salsa cremosa para envolver los tallarines al dente.',
    fitAdaptation: 'Usar leche descremada o light, queso fresco bajo en grasa, abundante espinaca para aportar hierro y fibra, y acompañar con filete de pechuga a la plancha.',
    prepTime: '25 min',
    estimatedCalories: 550
  },
  {
    id: 'tallarin-saltado',
    name: 'Tallarín Saltado Criollo / Chifa',
    region: 'Chifa Peruano',
    coreIngredients: ['tallarines', 'pollo', 'cebolla', 'tomate'],
    secondaryIngredients: ['carne de res', 'cebolla china', 'sillao', 'vinagre', 'kión', 'ají amarillo', 'pimiento', 'col china'],
    aderezoTechnique: 'Saltear proteína con ajo y kión a fuego alto, añadir cebolla, ají amarillo, tomate y parte blanca de cebolla china, desglasar con sillao y mezclar con los fideos al dente y cebolla china verde al final.',
    fitAdaptation: 'Usar mitad de fideos y mitad de vegetales salteados (col china, brócoli, pimiento y cebolla).',
    prepTime: '20 min',
    estimatedCalories: 490
  },
  {
    id: 'arroz-chaufa',
    name: 'Arroz Chaufa Peruano',
    region: 'Chifa Peruano',
    coreIngredients: ['arroz', 'huevo', 'cebolla china', 'pollo'],
    secondaryIngredients: ['sillao', 'kión', 'pimiento', 'aceite de ajonjolí', 'carne de res', 'cerdo', 'hot dog'],
    aderezoTechnique: 'Saltear el pollo con kión y ajo en sartén bien caliente, hacer tortilla de huevo picada, incorporar el arroz graneado frío, rociar sillao para el color y aroma ahumado, y terminar con abundante cebolla china picada.',
    fitAdaptation: 'Usar claras + 1 huevo entero, pechuga de pollo en cubos, pimiento rojo picado y sillao bajo en sodio (o reemplazar el arroz por quinua para un Chaufa de Quinua).',
    prepTime: '15 min',
    estimatedCalories: 470
  },
  {
    id: 'chaufa-de-quinua',
    name: 'Chaufa de Quinua Fit',
    region: 'Fit Peruano',
    coreIngredients: ['quinua', 'huevo', 'pollo', 'cebolla china'],
    secondaryIngredients: ['sillao', 'kión', 'pimiento', 'brócoli', 'aceite de ajonjolí', 'ajo'],
    aderezoTechnique: 'Graneado de quinua perlada al dente salteada al wok con pechuga de pollo, tortilla de huevo en trozos, kión, pimiento en brunoise, sillao y cebolla china fresca.',
    fitAdaptation: 'Plato naturalmente alto en proteína completa y fibra, bajo índice glucémico e ideal para definición muscular.',
    prepTime: '20 min',
    estimatedCalories: 380
  },
  {
    id: 'aji-de-gallina',
    name: 'Ají de Gallina (o Pollo Deshilachado)',
    region: 'Costa Criolla',
    coreIngredients: ['pollo', 'ají amarillo', 'leche evaporada', 'papa'],
    secondaryIngredients: ['pan', 'galleta de soda', 'huevo', 'aceituna', 'queso parmesano', 'cebolla', 'ajo', 'pecanas', 'arroz'],
    aderezoTechnique: 'Sancochar la pechuga en caldo aromático y deshilachar. Sofreír cebolla, ajo y abundante pasta de ají amarillo, espesar con pan o galleta licuada en caldo y leche evaporada, integrar las hebras de pollo y servir sobre papa con huevo duro y aceituna.',
    fitAdaptation: 'Espesar licuando papa amarilla o quinua cocida con queso fresco light en lugar de pan/galletas y aceite excesivo.',
    prepTime: '35 min',
    estimatedCalories: 530
  },
  {
    id: 'seco-de-pollo-res',
    name: 'Seco de Pollo o Res a la Norteña',
    region: 'Costa Criolla',
    coreIngredients: ['pollo', 'carne de res', 'culantro', 'cebolla'],
    secondaryIngredients: ['ají amarillo', 'alverjitas', 'zanahoria', 'papa', 'frejoles', 'yuca', 'arroz', 'chicha de jora'],
    aderezoTechnique: 'Guiso profundo a base de aderezo de cebolla, ajo, ají amarillo y culantro licuado con un toque ácido de chicha de jora, limón o cerveza, cocinado a fuego lento con zanahoria en rodajas, papa y alverjitas.',
    fitAdaptation: 'Acompañar con una porción moderada de frejoles y ensalada criolla en lugar de doble carbohidrato (arroz + papa + yuca).',
    prepTime: '35 min',
    estimatedCalories: 490
  },
  {
    id: 'estofado-de-pollo',
    name: 'Estofado de Pollo Peruano',
    region: 'Casera Diaria',
    coreIngredients: ['pollo', 'papa', 'zanahoria', 'tomate'],
    secondaryIngredients: ['alverjitas', 'ají panca', 'cebolla', 'ajo', 'pasas', 'arroz', 'hongos', 'laurel'],
    aderezoTechnique: 'Aderezo rojo de cebolla, ajo, tomate licuado y ají panca especial, guisando el pollo con papas, rodajas de zanahoria y alverjitas hasta que la salsa tome cuerpo.',
    fitAdaptation: 'Cocinar el pollo sin piel y priorizar la papa en el guiso como único carbohidrato acompañado de ensalada fresca.',
    prepTime: '30 min',
    estimatedCalories: 450
  },
  {
    id: 'causa-limena',
    name: 'Causa Limeña de Pollo o Atún',
    region: 'Costa Criolla',
    coreIngredients: ['papa', 'limón', 'ají amarillo', 'pollo', 'atún'],
    secondaryIngredients: ['palta', 'huevo', 'zanahoria', 'alverjitas', 'mayonesa', 'cebolla'],
    aderezoTechnique: 'Prensar papa amarilla caliente y amasar con pasta de ají amarillo, jugo de limón sutil, sal y un hilo de aceite; armar capas rellenas de láminas de palta y pollo o atún.',
    fitAdaptation: 'Preparar el relleno de pollo o atún con yogurt griego natural, limón y mostaza en lugar de mayonesa comercial.',
    prepTime: '25 min',
    estimatedCalories: 390
  },
  {
    id: 'ceviche-peruano',
    name: 'Ceviche de Pescado Clásico',
    region: 'Marina',
    coreIngredients: ['pescado', 'limón', 'cebolla', 'culantro'],
    secondaryIngredients: ['ají limo', 'camote', 'choclo', 'ajo', 'kión', 'apio', 'lechuga'],
    aderezoTechnique: 'Cortar pescado blanco fresco en cubos, sazonar con sal, ajo, toque de kión, ají limo y culantro picado, exprimir limones peruanos al instante (sin sobrecocinar), mezclar con cebolla roja en pluma y acompañar con camote glaseado y choclo.',
    fitAdaptation: 'Plato naturalmente proteico y magro; excelente balance con camote (carbohidrato de absorción lenta) y choclo.',
    prepTime: '15 min',
    estimatedCalories: 360
  },
  {
    id: 'sudado-de-pescado',
    name: 'Sudado de Pescado con Yuca',
    region: 'Marina',
    coreIngredients: ['pescado', 'tomate', 'cebolla', 'culantro'],
    secondaryIngredients: ['ají amarillo', 'kión', 'ajo', 'yuca', 'arroz', 'limón', 'chicha de jora'],
    aderezoTechnique: 'Cocinar los filetes de pescado al vapor en su propio jugo sobre una cama de cebolla gruesa, tomate en gajos, tiras de ají amarillo, kión, ajo y culantro.',
    fitAdaptation: 'Uno de los platos más saludables y ligeros de la cocina peruana; acompañar con yuca sancochada o media porción de arroz.',
    prepTime: '20 min',
    estimatedCalories: 350
  },
  {
    id: 'lentejitas-con-pescado-huevo',
    name: 'Lentejitas Caseras con Pescado o Huevo Montado',
    region: 'Casera Diaria',
    coreIngredients: ['lentejas', 'cebolla', 'ajo', 'arroz'],
    secondaryIngredients: ['pescado', 'huevo', 'tomate', 'ají panca', 'papa', 'limón', 'culantro'],
    aderezoTechnique: 'Guisar las lentejas con aderezo criollo de cebolla, ajo, tomate picado y un toque de ají panca y orégano; servir con arroz graneado, proteína (pescado a la plancha o huevo) y zarza criolla de cebolla con limón (la vitamina C del limón triplica la absorción del hierro de la lenteja).',
    fitAdaptation: 'Dorar el pescado a la plancha y acompañar siempre con ensalada de cebolla y limón para absorber todo el hierro vegetal.',
    prepTime: '30 min',
    estimatedCalories: 480
  },
  {
    id: 'tacu-tacu',
    name: 'Tacu Tacu Criollo con Huevo o Bistec',
    region: 'Costa Criolla',
    coreIngredients: ['frejoles', 'lentejas', 'arroz', 'cebolla'],
    secondaryIngredients: ['ají amarillo', 'ajo', 'huevo', 'carne de res', 'plátano', 'culantro'],
    aderezoTechnique: 'Sofreír cebolla, ajo y ají amarillo, mezclar menestra del día anterior (frejoles o lentejas) con arroz cocido formando una tortilla ovalada dorada y crocante por fuera y cremosa por dentro.',
    fitAdaptation: 'Dorar en sartén antiadherente con apenas 1 cucharadita de aceite de oliva y servir con huevo a la plancha y zarza criolla.',
    prepTime: '15 min',
    estimatedCalories: 490
  },
  {
    id: 'locro-de-zapallo',
    name: 'Locro de Zapallo con Queso Fresco',
    region: 'Andina',
    coreIngredients: ['zapallo', 'papa', 'queso fresco'],
    secondaryIngredients: ['choclo', 'alverjitas', 'leche evaporada', 'huacatay', 'cebolla', 'ajo', 'ají amarillo', 'huevo', 'arroz'],
    aderezoTechnique: 'Aderezo de cebolla, ajo y ají amarillo, cocinando zapallo macre y papa hasta que se deshagan formando un puré rústico con rodajas de choclo, alverjitas, cubos de queso fresco, toque de leche y rama de huacatay.',
    fitAdaptation: 'Servir sin arroz adicional (ya tiene papa y choclo) y coronar con un huevo escalfado o filete de pollo para elevar la proteína.',
    prepTime: '25 min',
    estimatedCalories: 410
  },
  {
    id: 'olluquito-con-carne',
    name: 'Olluquito con Carne o Pollo',
    region: 'Andina',
    coreIngredients: ['olluco', 'carne de res', 'pollo', 'ají panca'],
    secondaryIngredients: ['cebolla', 'ajo', 'perejil', 'arroz', 'comino'],
    aderezoTechnique: 'Aderezo intenso de cebolla, ajo, comino y ají panca con carne picada en tiras finas y olluco en juliana cocinado en su propio vapor sin agregar agua, terminando con abundante perejil picado.',
    fitAdaptation: 'El olluco es muy bajo en calorías; con carne magra o pechuga de pollo resulta un almuerzo hipocalórico excelente.',
    prepTime: '25 min',
    estimatedCalories: 390
  },
  {
    id: 'sangrecita-criolla',
    name: 'Sangrecita Criolla con Yuca o Camote',
    region: 'Fit Peruano',
    coreIngredients: ['sangrecita', 'cebolla china', 'hierbabuena', 'cebolla'],
    secondaryIngredients: ['ají amarillo', 'ajo', 'yuca', 'camote', 'papa', 'pan'],
    aderezoTechnique: 'Saltear la sangrecita sancochada con aderezo de cebolla roja, ajo, ají amarillo picado, abundante hierbabuena y cebolla china hasta que quede jugosa y bien aromática.',
    fitAdaptation: 'Superalimento peruano número 1 contra la anemia: altísimo en proteína y hierro hemo con muy pocas calorías.',
    prepTime: '15 min',
    estimatedCalories: 320
  },
  {
    id: 'quinua-guisada',
    name: 'Quinua Atamalada / Guisada con Queso o Pollo',
    region: 'Andina',
    coreIngredients: ['quinua', 'queso fresco', 'cebolla', 'ajo'],
    secondaryIngredients: ['ají amarillo', 'leche evaporada', 'pollo', 'papa', 'habas', 'perejil'],
    aderezoTechnique: 'Lavar bien la quinua y cocinarla sobre un aderezo de cebolla, ajo y ají amarillo hasta que reviente, ligando al final con cubos de queso fresco y un chorrito de leche.',
    fitAdaptation: 'Excelente fuente de aminoácidos esenciales; acompañar con pechuga de pollo a la plancha.',
    prepTime: '25 min',
    estimatedCalories: 410
  },
  {
    id: 'cau-cau',
    name: 'Cau Cau de Pollo o Mondongo',
    region: 'Costa Criolla',
    coreIngredients: ['pollo', 'mondongo', 'papa', 'hierbabuena'],
    secondaryIngredients: ['ají amarillo', 'alverjitas', 'zanahoria', 'cebolla', 'ajo', 'palillo'],
    aderezoTechnique: 'Aderezo de cebolla, ajo, ají amarillo y palillo con papa en cubos, proteína, alverjitas, zanahoria y el aroma inconfundible de abundante hierbabuena fresca al apagar el fuego.',
    fitAdaptation: 'El Cau Cau de pechuga de pollo en cubos es ligero, digestivo gracias a la hierbabuena y alto en proteína.',
    prepTime: '30 min',
    estimatedCalories: 430
  },
  {
    id: 'papa-a-la-huancaina',
    name: 'Papa a la Huancaína',
    region: 'Costa Criolla',
    coreIngredients: ['papa', 'ají amarillo', 'queso fresco', 'leche evaporada'],
    secondaryIngredients: ['galleta de soda', 'huevo', 'aceituna', 'cebolla', 'ajo', 'lechuga'],
    aderezoTechnique: 'Saltear ají amarillo sin venas con cebolla y ajo para suavizar el picor, y licuar con abundante queso fresco, leche evaporada y galleta de soda hasta lograr una crema sedosa sobre papas sancochadas.',
    fitAdaptation: 'Licuar con requesón o queso fresco light, leche descremada y omitir la galleta usando más queso fresco.',
    prepTime: '15 min',
    estimatedCalories: 380
  },
  {
    id: 'palta-rellena',
    name: 'Palta Rellena con Pollo o Atún',
    region: 'Fit Peruano',
    coreIngredients: ['palta', 'pollo', 'atún', 'limón'],
    secondaryIngredients: ['zanahoria', 'alverjitas', 'vainitas', 'huevo', 'papa', 'apio'],
    aderezoTechnique: 'Rellenar mitades de palta fuerte con mezcla fresca de pollo deshilachado o atún, verduritas cocidas al dente (zanahoria, alverjitas, vainitas) y toque de limón.',
    fitAdaptation: 'Usar yogurt griego con gotas de limón en lugar de mayonesa: grasas saludables + proteína limpia.',
    prepTime: '15 min',
    estimatedCalories: 340
  },
  {
    id: 'solterito-arequipeno',
    name: 'Solterito Arequipeño de Queso y Habas',
    region: 'Andina',
    coreIngredients: ['queso fresco', 'choclo', 'tomate', 'cebolla'],
    secondaryIngredients: ['habas', 'aceituna', 'papa', 'limón', 'perejil', 'rocoto'],
    aderezoTechnique: 'Ensalada fresca andina combinando dados de queso fresco, choclo desgranado, habas tiernas, tomate, cebolla roja, aceitunas y perejil aliñados con limón, vinagre y aceite.',
    fitAdaptation: 'Ideal como cena ligera o almuerzo vegetariano rico en proteínas lácteas y vegetales.',
    prepTime: '15 min',
    estimatedCalories: 330
  },
  {
    id: 'caldo-de-pollo-gallina',
    name: 'Caldo de Gallina o Pollo Reconfortante',
    region: 'Casera Diaria',
    coreIngredients: ['pollo', 'papa', 'huevo', 'fideos'],
    secondaryIngredients: ['kión', 'cebolla china', 'apio', 'limón', 'zanahoria'],
    aderezoTechnique: 'Hervir el pollo con rodajas de kión, apio y poro para un caldo cristalino e intenso; agregar papa amarilla, fideos y servir caliente con huevo sancochado, cebolla china picada y limón.',
    fitAdaptation: 'Usar pechuga sin piel y moderar la cantidad de fideos.',
    prepTime: '30 min',
    estimatedCalories: 410
  },
  {
    id: 'sopa-a-la-minuta',
    name: 'Sopa a la Minuta / Sopa Criolla',
    region: 'Costa Criolla',
    coreIngredients: ['carne de res', 'fideos', 'huevo', 'leche evaporada'],
    secondaryIngredients: ['tomate', 'ají panca', 'cebolla', 'ajo', 'orégano', 'pan'],
    aderezoTechnique: 'Aderezo de cebolla, ajo, tomate y ají panca con carne picada finita, caldo caliente, fideo cabello de ángel, huevo escalfado, chorro de leche evaporada y orégano estrujado al servir.',
    fitAdaptation: 'Usar carne molida magra y leche evaporada light para una cena cálida y alta en proteínas.',
    prepTime: '20 min',
    estimatedCalories: 390
  },
  {
    id: 'saltado-de-verduras-pollo',
    name: 'Saltado de Vainitas o Brócoli con Pollo',
    region: 'Casera Diaria',
    coreIngredients: ['pollo', 'vainitas', 'brócoli', 'papa'],
    secondaryIngredients: ['cebolla', 'tomate', 'sillao', 'zanahoria', 'ajo', 'kión', 'arroz'],
    aderezoTechnique: 'Clásico almuerzo casero peruano salteando tiras de pollo con ajo, kión, cebolla, tomate y vainitas o brócoli al dente con un chorrito de sillao.',
    fitAdaptation: 'Excelente plato fit diario bajo en calorías y alto en micronutrientes.',
    prepTime: '20 min',
    estimatedCalories: 370
  },
  {
    id: 'huevos-criollos-perico',
    name: 'Huevos Revueltos a la Criolla con Tomate y Queso',
    region: 'Casera Diaria',
    coreIngredients: ['huevo', 'tomate', 'cebolla'],
    secondaryIngredients: ['queso fresco', 'culantro', 'espinaca', 'ají amarillo', 'palta', 'pan'],
    aderezoTechnique: 'Sofreír cebolla roja, tomate picado en cubitos y un toque de ají amarillo o culantro en sartén, incorporar los huevos batidos y dados de queso fresco peruano hasta que queden jugosos.',
    fitAdaptation: 'Acompañar con láminas de palta o camote al horno para un desayuno o cena proteica en 10 minutos.',
    prepTime: '10 min',
    estimatedCalories: 290
  }
];

export interface MatchedPeruvianDish {
  dish: PeruvianDish;
  score: number;
  matchedCore: string[];
  matchedSecondary: string[];
  missingCore: string[];
}

/**
 * Normaliza el texto de ingredientes del usuario convirtiendo sinónimos extranjeros
 * al vocabulario peruano y detectando los ingredientes presentes.
 */
export function normalizePeruvianIngredients(rawText: string): {
  normalizedText: string;
  detectedIngredients: string[];
  translationsApplied: string[];
} {
  let lower = rawText.toLowerCase();
  const translationsApplied: string[] = [];

  for (const [foreignTerm, peruvianTerm] of Object.entries(PERUVIAN_SYNONYMS)) {
    const regex = new RegExp(`\\b${foreignTerm}\\b`, 'gi');
    if (regex.test(lower)) {
      if (foreignTerm !== peruvianTerm && !foreignTerm.startsWith(peruvianTerm)) {
        translationsApplied.push(`${foreignTerm} → ${peruvianTerm}`);
      }
      lower = lower.replace(regex, peruvianTerm);
    }
  }

  const allCatalogIngredients = new Set<string>();
  for (const dish of PERUVIAN_DISH_CATALOG) {
    dish.coreIngredients.forEach((i) => allCatalogIngredients.add(i));
    dish.secondaryIngredients.forEach((i) => allCatalogIngredients.add(i));
  }

  const detectedIngredients: string[] = [];
  for (const ing of allCatalogIngredients) {
    if (lower.includes(ing)) {
      detectedIngredients.push(ing);
    }
  }

  return {
    normalizedText: lower,
    detectedIngredients: [...new Set(detectedIngredients)],
    translationsApplied: [...new Set(translationsApplied)]
  };
}

/**
 * Busca los platos peruanos que mejor coinciden con los ingredientes ingresados por el usuario.
 * Ejemplo: "arroz, cilantro, espinaca, pollo" -> Arroz con Pollo Peruano y Aguadito de Pollo.
 */
export function matchPeruvianDishes(ingredientsText: string, topN = 4): MatchedPeruvianDish[] {
  if (!ingredientsText || ingredientsText.trim().length < 2) {
    return [];
  }

  const { normalizedText, detectedIngredients } = normalizePeruvianIngredients(ingredientsText);

  const scored: MatchedPeruvianDish[] = PERUVIAN_DISH_CATALOG.map((dish) => {
    const matchedCore = dish.coreIngredients.filter(
      (ing) => detectedIngredients.includes(ing) || normalizedText.includes(ing)
    );
    const matchedSecondary = dish.secondaryIngredients.filter(
      (ing) => detectedIngredients.includes(ing) || normalizedText.includes(ing)
    );
    const missingCore = dish.coreIngredients.filter((ing) => !matchedCore.includes(ing));

    // Puntuación ponderada: ingredientes núcleo valen 3 puntos, secundarios valen 1 punto
    let score = matchedCore.length * 3 + matchedSecondary.length * 1;

    // Bonus cuando el usuario tiene al menos 2 ingredientes núcleo del plato
    if (matchedCore.length >= 2) {
      const coverageRatio = matchedCore.length / dish.coreIngredients.length;
      score += Math.round(coverageRatio * 6);
    }

    // Bonus especiales por combinaciones icónicas peruanas
    const has = (item: string) => matchedCore.includes(item) || matchedSecondary.includes(item) || normalizedText.includes(item);

    if (dish.id === 'arroz-con-pollo' && has('arroz') && has('pollo') && (has('culantro') || has('espinaca'))) {
      score += 10;
    }
    if (dish.id === 'aguadito-de-pollo' && has('arroz') && has('pollo') && (has('culantro') || has('espinaca'))) {
      score += 8;
    }
    if (dish.id === 'tallarines-verdes' && (has('tallarines') || has('fideos')) && (has('espinaca') || has('albahaca'))) {
      score += 10;
    }
    if (dish.id === 'lomo-saltado' && has('carne de res') && (has('cebolla') || has('tomate'))) {
      score += 8;
    }
    if (dish.id === 'pollo-saltado' && has('pollo') && has('cebolla') && has('tomate')) {
      score += 8;
    }
    if (dish.id === 'arroz-chaufa' && has('arroz') && has('huevo') && (has('pollo') || has('cebolla china') || has('sillao'))) {
      score += 9;
    }
    if (dish.id === 'causa-limena' && has('papa') && (has('pollo') || has('atún')) && (has('limón') || has('palta') || has('ají amarillo'))) {
      score += 9;
    }

    return {
      dish,
      score,
      matchedCore,
      matchedSecondary,
      missingCore
    };
  });

  return scored
    .filter((item) => item.score >= 3 && item.matchedCore.length >= 1)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}

/**
 * Construye el bloque de contexto gastronómico peruano (RAG Culinario) para inyectar en el prompt del Chef IA.
 */
export function buildPeruvianCulinaryContextForChef(ingredientsText: string): string {
  const { translationsApplied } = normalizePeruvianIngredients(ingredientsText);
  const matches = matchPeruvianDishes(ingredientsText, 4);

  let context = `\nCONTEXTO GEOGRÁFICO Y CULTURAL ACTIVO: PERÚ 🇵🇪
- Adapta las recetas al paladar, técnicas y despensa peruana (usa vocabulario peruano: culantro, ají amarillo, ají panca, sillao, kión, palta, choclo, camote, alverjitas, cebolla china, queso fresco, hierbabuena).
- Aplica la técnica del "aderezo base peruano" (sofreír bien cebolla, ajo y ají antes de incorporar líquidos o proteínas).`;

  if (translationsApplied.length > 0) {
    context += `\n- Términos normalizados al español peruano: ${translationsApplied.join(', ')}.`;
  }

  if (matches.length > 0) {
    context += `\n\nPLATOS DEL CATÁLOGO GASTRONÓMICO PERUANO IDENTIFICADOS CON ESTOS INGREDIENTES (Prioriza incluir al menos 1 o 2 de estos platos auténticos en tu respuesta):`;
    for (const m of matches) {
      context += `\n- **${m.dish.name}** (${m.dish.region}, ~${m.dish.prepTime}):
  • Ingredientes que el usuario ya tiene: ${[...m.matchedCore, ...m.matchedSecondary].join(', ')}.
  • Técnica peruana: ${m.dish.aderezoTechnique}
  • Versión saludable/Fit: ${m.dish.fitAdaptation}
  • Ingredientes opcionales para el aderezo/toque criollo (ponlos en missingIngredients si el usuario no los mencionó): ${m.dish.secondaryIngredients.slice(0, 5).join(', ')}.`;
    }
  }

  return context;
}
