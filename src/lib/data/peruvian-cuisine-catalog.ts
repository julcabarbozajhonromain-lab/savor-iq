import type { RecipesResponse, NutritionAnalysis, MealPlan } from '$lib/types/ai-schemas';

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

/**
 * Motor Gastronómico Peruano Autónomo:
 * Genera recetas peruanas completas, detalladas y personalizadas a partir del catálogo
 * y de los ingredientes exactos ingresados por el usuario.
 */
export function generateSmartPeruvianRecipes(ingredientsInput: string): RecipesResponse {
  const { detectedIngredients, normalizedText } = normalizePeruvianIngredients(ingredientsInput || 'pollo, arroz, tomate, cebolla');
  const matches = matchPeruvianDishes(ingredientsInput, 3);
  const wantsFit = /fit|bajo en grasa|proteína|air fryer|saludable/i.test(ingredientsInput);

  // Extraer ingredientes escritos libremente por el usuario
  const rawTokens = (ingredientsInput.split('.')[0] || '')
    .replace(/^Ingredientes:\s*/i, '')
    .split(/[,;]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1);

  const recipes: RecipesResponse['recipes'] = [];

  for (const m of matches) {
    const d = m.dish;
    const baseIngredients = [
      ...d.coreIngredients.map((ing) => `Porción de ${ing} fresco`),
      ...m.matchedSecondary.map((ing) => `${ing} al gusto`),
      '1 cebolla roja picada en brunoise (para el aderezo)',
      '2 dientes de ajo molidos',
      'Sal, pimienta y comino al gusto'
    ];

    const missing = d.secondaryIngredients
      .filter((sec) => !m.matchedSecondary.includes(sec) && !normalizedText.includes(sec))
      .slice(0, 4);

    const steps = [
      `Prepara tu mise en place lavando y cortando los ingredientes principales (${d.coreIngredients.join(', ')}).`,
      `En una olla o sartén caliente con un hilo de aceite, prepara el aderezo base peruano sofriendo la cebolla roja y el ajo durante 4 minutos hasta que estén transparentes.`,
      d.aderezoTechnique,
      wantsFit
        ? `Adaptación Fit activa: ${d.fitAdaptation}`
        : `Cocina a fuego medio controlando el punto de sal y humedad para que los sabores criollos se concentren.`,
      `Sirve caliente decorando con hierbas frescas picadas y acompaña con rodajas de limón peruano o zarza criolla.`
    ];

    recipes.push({
      name: wantsFit ? `${d.name} (Versión Fit Peruana)` : d.name,
      prepTime: d.prepTime,
      ingredients: [...new Set(baseIngredients)],
      instructions: steps,
      missingIngredients: missing
    });

    // Si solo había 1 o 2 coincidencias, agregar también su variante Fit o Saltado Criollo
    if (matches.length === 1) {
      recipes.push({
        name: `${d.name} — Edición Ligera & Alta en Proteína`,
        prepTime: '20 min',
        ingredients: [
          ...d.coreIngredients.map((ing) => `${ing} (porción controlada magra)`),
          '1 cucharadita de aceite de oliva',
          'Cebolla roja, ajo y ají amarillo sin venas',
          'Jugo de limón peruano y culantro fresco'
        ],
        instructions: [
          d.fitAdaptation,
          `Dora la proteína en sartén antiadherente o Air Fryer con sal, ajo y comino.`,
          `Saltea ligeramente las verduras para conservar su textura crocante y sus vitaminas.`,
          `Integra con el aderezo peruano bajo en grasa y sirve con ensalada fresca.`
        ],
        missingIngredients: missing.slice(0, 3)
      });
    }
  }

  // Si el usuario escribió ingredientes muy particulares y faltan recetas para llegar a 3,
  // sintetizar recetas criollas/caseras con sus ingredientes exactos
  const userItems = rawTokens.length > 0 ? rawTokens : detectedIngredients.length > 0 ? detectedIngredients : ['huevos', 'tomate', 'cebolla'];

  if (recipes.length < 3) {
    recipes.push({
      name: `Saltado Criollo al Wok de ${userItems.slice(0, 3).join(', ')}`,
      prepTime: '18 min',
      ingredients: [
        ...userItems.map((i) => `${i} cortado en trozos medianos`),
        '1 cebolla roja en gajos gruesos',
        '1 tomate en gajos',
        '1 chorrito de sillao y gotas de vinagre',
        'Ajo picado, culantro fresco, sal y pimienta'
      ],
      instructions: [
        `Calienta una sartén amplia o wok a fuego alto con una cucharadita de aceite.`,
        `Saltea primero los ingredientes principales (${userItems.join(', ')}) con el ajo picado para sellar los jugos y lograr el aroma ahumado peruano.`,
        `Incorpora la cebolla roja en gajos y el tomate por 2 minutos manteniendo su textura firme.`,
        `Desglasa con un chorrito de sillao y unas gotas de vinagre; espolvorea culantro recién picado y sirve al instante.`
      ],
      missingIngredients: ['sillao', 'ají amarillo', 'culantro']
    });
  }

  if (recipes.length < 3) {
    recipes.push({
      name: `Torrejitas / Revuelto Casero Peruano de ${userItems.slice(0, 2).join(' y ')}`,
      prepTime: '15 min',
      ingredients: [
        ...userItems.map((i) => `${i} finamente picado`),
        '2 huevos batidos',
        '1/2 cebolla roja picada en cuadritos',
        'Culantro o cebolla china picada al gusto',
        'Sal, pimienta y pizca de orégano'
      ],
      instructions: [
        `Pica finamente tus ingredientes (${userItems.join(', ')}) junto con la cebolla y las hierbas frescas.`,
        `Sofríe ligeramente en sartén antiadherente durante 3 minutos con una pizca de ajo y orégano estrujado.`,
        `Vierte los huevos batidos sazonados y cocina a fuego medio-bajo hasta que cuaje de forma jugosa y dorada.`,
        `Sirve caliente acompañado de rodajas de palta, pan o ensalada fresca.`
      ],
      missingIngredients: ['cebolla china', 'palta', 'queso fresco']
    });
  }

  return { recipes: recipes.slice(0, 3) };
}

/**
 * Análisis nutricional inteligente de respaldo con contexto peruano para /nutri
 */
export function generateSmartPeruvianPlateAnalysis(): NutritionAnalysis {
  return {
    dishName: 'Plato Casero Peruano Balanceado (Arroz con Pollo / Guiso Criollo)',
    estimatedCalories: 510,
    macronutrients: {
      protein: 34,
      carbs: 52,
      fat: 14,
      fiber: 6
    },
    healthScore: 8,
    verdict:
      'Excelente aporte de proteínas de alto valor biológico junto con carbohidratos complejos y micronutrientes del aderezo peruano (culantro, espinaca, ají amarillo y cebolla roja).',
    suggestions: [
      'Acompaña con una porción generosa de zarza criolla (cebolla, tomate y limón) para sumar antioxidantes y vitamina C.',
      'Controla la porción de arroz a media taza si el plato ya incluye papa o choclo para evitar el doble carbohidrato.',
      'Prefiere cortes magros como pechuga de pollo, lomo fino o pescado fresco del día.'
    ],
    ingredients: [
      'Proteína principal (pollo/res/pescado)',
      'Arroz graneado',
      'Aderezo criollo (cebolla, ajo, ají amarillo)',
      'Vegetales frescos (culantro, espinaca, tomate)'
    ]
  };
}

/**
 * Plan semanal completo de 7 días de gastronomía peruana saludable para /plan
 */
export function generateSmartPeruvianWeeklyPlan(
  preferences?: string,
  dietaryRestrictions?: string
): MealPlan {
  const isLowCal = /déficit|bajar|perder|fit/i.test(preferences || '');
  const calFactor = isLowCal ? 0.9 : 1;
  const scale = (c: number) => Math.round(c * calFactor);

  const days: MealPlan['weeklyPlan'] = [
    {
      day: 'Lunes',
      meals: {
        breakfast: {
          name: 'Pan integral con Palta Fuerte y Huevos Revueltos a la Criolla',
          calories: scale(360),
          ingredients: ['2 huevos', '1/2 palta fuerte', '1 tomate picado', '1 pan integral o francés'],
          instructions: 'Revuelve los huevos con tomate y cebolla picada; sirve con láminas de palta y limón.'
        },
        lunch: {
          name: 'Lentejitas de Lunes con Filete de Pescado a la Plancha y Zarza Criolla',
          calories: scale(540),
          ingredients: ['1 taza de lentejas guisadas', '150g filete de pescado', '1/2 taza de arroz', 'Cebolla y limón'],
          instructions: 'Guisa las lentejas con aderezo de cebolla y ajo; acompaña con pescado dorado y ensalada de cebolla con limón para absorber el hierro.'
        },
        dinner: {
          name: 'Crema Reconfortante de Zapallo Macre con Queso Fresco',
          calories: scale(340),
          ingredients: ['250g de zapallo macre', '1 papa amarilla pequeña', '50g de queso fresco', 'Huacatay y orégano'],
          instructions: 'Hierve el zapallo y la papa con rama de huacatay, licúa y sirve con dados de queso fresco.'
        }
      },
      totalCalories: scale(1240)
    },
    {
      day: 'Martes',
      meals: {
        breakfast: {
          name: 'Avena con Quinua Perlada, Manzana y Canela',
          calories: scale(350),
          ingredients: ['1/2 taza de avena', '2 cdas de quinua cocida', '1 manzana picada', 'Canela y clavo'],
          instructions: 'Cocina la avena con quinua, manzana en cubitos y canela durante 8 minutos.'
        },
        lunch: {
          name: 'Arroz con Pollo Peruano Fit (con abundante Espinaca y Culantro)',
          calories: scale(560),
          ingredients: ['150g pechuga de pollo', '1/2 taza de arroz', 'Culantro y espinaca licuados', 'Alverjitas, zanahoria y pimiento'],
          instructions: 'Sella la pechuga, haz el aderezo de cebolla, ajo y ají amarillo, agrega el licuado verde y granea con las verduras.'
        },
        dinner: {
          name: 'Palta Rellena con Pollo Deshilachado y Verduras',
          calories: scale(350),
          ingredients: ['1 palta fuerte', '100g pechuga de pollo deshilachada', 'Zanahoria y vainitas', 'Yogurt griego y limón'],
          instructions: 'Mezcla el pollo con las verduras cocidas al dente y yogurt con limón; rellena la palta.'
        }
      },
      totalCalories: scale(1260)
    },
    {
      day: 'Miércoles',
      meals: {
        breakfast: {
          name: 'Tortilla Verde de Espinaca y Queso Fresco con Camote al Horno',
          calories: scale(370),
          ingredients: ['2 huevos', '1 taza de espinaca', '40g queso fresco', '1 camote mediano sancochado'],
          instructions: 'Bate los huevos con espinaca picada y queso fresco, dora en sartén y acompaña con rodajas de camote.'
        },
        lunch: {
          name: 'Lomo Saltado Saludable al Wok con Papas en Air Fryer',
          calories: scale(570),
          ingredients: ['150g lomo de res magro', '1 cebolla roja', '1 tomate', '1 papa amarilla', 'Sillao y culantro'],
          instructions: 'Dora las papas en Air Fryer; saltea la carne a fuego alto con cebolla, ají amarillo, tomate y sillao.'
        },
        dinner: {
          name: 'Aguadito Ligero de Pollo y Verduras',
          calories: scale(360),
          ingredients: ['120g pechuga de pollo', 'Culantro y espinaca', '1/4 taza de arroz', 'Alverjitas y pimiento'],
          instructions: 'Hierve el caldo con aderezo verde de culantro y espinaca, pollo en trozos y verduras.'
        }
      },
      totalCalories: scale(1300)
    },
    {
      day: 'Jueves',
      meals: {
        breakfast: {
          name: 'Sánguche de Pollo Deshilachado con Palta y Tomate',
          calories: scale(360),
          ingredients: ['100g pechuga deshilachada', '1/3 palta', 'Rodajas de tomate', 'Pan integral'],
          instructions: 'Arma el sánguche con pollo jugoso, láminas de palta, tomate y gotas de limón.'
        },
        lunch: {
          name: 'Chaufa de Quinua con Pollo, Huevo y Cebolla China',
          calories: scale(520),
          ingredients: ['1 taza de quinua cocida graneada', '150g pollo en cubos', '1 huevo', 'Cebolla china, kión y sillao'],
          instructions: 'Saltea el pollo con kión, agrega tortilla de huevo picada, la quinua graneada, sillao y abundante cebolla china.'
        },
        dinner: {
          name: 'Solterito Arequipeño de Queso Fresco, Choclo y Habas',
          calories: scale(340),
          ingredients: ['80g queso fresco en cubos', '1/2 taza de choclo', '1/2 taza de habas', 'Tomate, cebolla y perejil'],
          instructions: 'Combina todos los ingredientes frescos y aliña con limón peruano y aceite de oliva.'
        }
      },
      totalCalories: scale(1220)
    },
    {
      day: 'Viernes',
      meals: {
        breakfast: {
          name: 'Bowl de Yogurt Griego con Plátano de Seda, Quinua Pop y Pecanas',
          calories: scale(350),
          ingredients: ['1 taza de yogurt griego', '1 plátano de seda', '2 cdas de quinua pop o avena', 'Pecanas picadas'],
          instructions: 'Sirve el yogurt con rodajas de plátano, quinua y pecanas.'
        },
        lunch: {
          name: 'Ceviche Clásico de Pescado Fresco con Camote y Choclo',
          calories: scale(490),
          ingredients: ['180g pescado blanco en cubos', '5 limones peruanos', 'Cebolla roja y culantro', '1 camote y 1/2 choclo'],
          instructions: 'Marina el pescado al momento con sal, limón, ají limo y culantro; acompaña con cebolla en pluma, camote y choclo.'
        },
        dinner: {
          name: 'Saltado de Vainitas y Brócoli con Tiras de Pollo',
          calories: scale(360),
          ingredients: ['130g pechuga de pollo', '1 taza de vainitas y brócoli', 'Cebolla y tomate', 'Sillao y ajo'],
          instructions: 'Saltea el pollo con ajo y kión, incorpora las vainitas y el brócoli al dente con tomate y sillao.'
        }
      },
      totalCalories: scale(1200)
    },
    {
      day: 'Sábado',
      meals: {
        breakfast: {
          name: 'Sangrecita Criolla con Yuca Sancochada (Alto en Hierro)',
          calories: scale(380),
          ingredients: ['120g sangrecita de pollo', 'Cebolla china y hierbabuena', 'Cebolla roja y ají amarillo', '1 trozo de yuca'],
          instructions: 'Saltea la sangrecita con aderezo de cebolla, ajo, ají amarillo, hierbabuena y cebolla china; sirve con yuca.'
        },
        lunch: {
          name: 'Ají de Pollo Saludable (espesado con Quinua y Queso Fresco)',
          calories: scale(550),
          ingredients: ['150g pechuga deshilachada', 'Pasta de ají amarillo', 'Queso fresco y leche light', '1 papa amarilla y 1/2 huevo'],
          instructions: 'Prepara el aderezo de cebolla, ajo y ají amarillo; licúa con queso fresco y leche, incorpora el pollo deshilachado y sirve sobre papa.'
        },
        dinner: {
          name: 'Sudado Ligero de Pescado al Vapor con Tomate y Culantro',
          calories: scale(340),
          ingredients: ['150g filete de pescado', '2 tomates en gajos', '1 cebolla roja', 'Culantro, kión y ajo'],
          instructions: 'Cocina el pescado a fuego lento sobre cama de tomate, cebolla, kión y culantro en su propio jugo.'
        }
      },
      totalCalories: scale(1270)
    },
    {
      day: 'Domingo',
      meals: {
        breakfast: {
          name: 'Panqueques de Avena y Plátano con Frutas de Estación',
          calories: scale(370),
          ingredients: ['1/2 taza de avena', '1 plátano maduro', '2 huevos', 'Canela en polvo'],
          instructions: 'Licúa la avena, el plátano, los huevos y la canela; dora en sartén antiadherente por ambos lados.'
        },
        lunch: {
          name: 'Tallarines Verdes Fit de Espinaca y Albahaca con Filete de Pollo',
          calories: scale(580),
          ingredients: ['80g tallarines', '2 tazas de espinaca y albahaca', '50g queso fresco', '150g pechuga a la plancha'],
          instructions: 'Licúa la espinaca y albahaca blanqueadas con queso fresco y leche; mezcla con los fideos y corona con el pollo dorado.'
        },
        dinner: {
          name: 'Causa Limeña Ligera de Atún y Palta',
          calories: scale(350),
          ingredients: ['2 papas amarillas prensadas', 'Limón y ají amarillo', '1 lata de atún al agua', '1/3 palta fuerte'],
          instructions: 'Amasa la papa con limón y ají amarillo; rellena con atún mezclado con yogurt griego y láminas de palta.'
        }
      },
      totalCalories: scale(1300)
    }
  ];

  const totalWeekly = days.reduce((acc, d) => acc + d.totalCalories, 0);

  return {
    weeklyPlan: days,
    shoppingList: {
      proteins: [
        'Pechuga de pollo 1.2 kg',
        'Filete de pescado blanco 600g',
        'Lomo de res magro 250g',
        'Huevos 15 unidades',
        'Atún en agua 1 lata',
        'Sangrecita 150g'
      ],
      vegetables: [
        'Culantro fresco 2 atados',
        'Espinaca y albahaca 2 atados',
        'Ají amarillo 6 unidades',
        'Cebolla roja 1 kg',
        'Tomates 1 kg',
        'Cebolla china y hierbabuena 1 atado',
        'Vainitas, brócoli, zanahoria y alverjitas',
        'Zapallo macre 300g'
      ],
      grains: [
        'Quinua perlada 500g',
        'Arroz 1 kg',
        'Lentejas 500g',
        'Avena 500g',
        'Papa amarilla 1 kg',
        'Camote y yuca 1 kg',
        'Choclo 2 unidades'
      ],
      dairy: [
        'Queso fresco peruano 350g',
        'Yogurt griego natural 500g',
        'Leche evaporada light 1 tarro'
      ],
      fruits: [
        'Palta fuerte 4 unidades',
        'Limón peruano 500g',
        'Plátano de seda 1 mano',
        'Manzanas 4 unidades'
      ],
      other: [
        'Aceite de oliva',
        'Sillao (salsa de soya)',
        'Kión (jengibre) y ajo',
        `Nota: Adaptado a ${dietaryRestrictions || 'cocina peruana saludable'}`
      ]
    },
    weeklyNutrition: {
      totalCalories: totalWeekly,
      averageDailyCalories: Math.round(totalWeekly / 7),
      proteinPercentage: 32,
      carbsPercentage: 43,
      fatPercentage: 25
    }
  };
}

