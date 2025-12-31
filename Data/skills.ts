
import { Ability, Skill } from '../types';

export const ABILITY_NAMES: Record<Ability, string> = {
  STR: 'Strength', DEX: 'Dexterity', CON: 'Constitution',
  INT: 'Intelligence', WIS: 'Wisdom', CHA: 'Charisma'
};

export const SKILL_LIST: Skill[] = [
  'Acrobatics', 'Animal Handling', 'Arcana', 'Athletics', 'Deception', 
  'History', 'Insight', 'Intimidation', 'Investigation', 'Medicine', 
  'Nature', 'Perception', 'Performance', 'Persuasion', 'Religion', 
  'Sleight of Hand', 'Stealth', 'Survival'
];

export const SKILL_ABILITY_MAP: Record<Skill, Ability> = {
  'Acrobatics': 'DEX', 'Animal Handling': 'WIS', 'Arcana': 'INT', 
  'Athletics': 'STR', 'Deception': 'CHA', 'History': 'INT', 
  'Insight': 'WIS', 'Intimidation': 'CHA', 'Investigation': 'INT', 
  'Medicine': 'WIS', 'Nature': 'INT', 'Perception': 'WIS', 
  'Performance': 'CHA', 'Persuasion': 'CHA', 'Religion': 'INT', 
  'Sleight of Hand': 'DEX', 'Stealth': 'DEX', 'Survival': 'WIS'
};

export const SKILL_DESCRIPTIONS: Record<Skill, string> = {
  'Acrobatics': 'Mantiene el equilibrio en situaciones difíciles, como correr sobre una cuerda o una cornisa estrecha. También cubre acrobacias como zambullidas, volteretas y saltos mortales, así como escapar de agarres.',
  'Animal Handling': 'Permite calmar a animales domésticos, evitar que una montura se asuste, o intuir las intenciones de un animal. También se usa para controlar monturas en maniobras arriesgadas.',
  'Arcana': 'Mide tu capacidad para recordar conocimientos sobre hechizos, objetos mágicos, símbolos arcanos, tradiciones mágicas, los planos de existencia y sus habitantes.',
  'Athletics': 'Cubre situaciones físicas difíciles como escalar paredes empinadas, saltar distancias inusuales, nadar en aguas turbulentas, o romper ataduras. Se usa para agarrar (Grapple) o empujar (Shove) en combate.',
  'Deception': 'Determina si puedes ocultar la verdad de forma convincente, ya sea verbalmente o con acciones. Incluye mentir, disfrazarse, timar o fingir.',
  'History': 'Mide tu capacidad para recordar conocimientos sobre eventos históricos, personajes legendarios, reinos antiguos, disputas pasadas, guerras recientes y civilizaciones perdidas.',
  'Insight': 'Te permite determinar las verdaderas intenciones de una criatura, como detectar una mentira o predecir el próximo movimiento de alguien observando su lenguaje corporal.',
  'Intimidation': 'Se usa para influir en alguien mediante amenazas abiertas, acciones hostiles y violencia física. Incluye sacar información por la fuerza o disuadir peleas.',
  'Investigation': 'Usada para buscar pistas y hacer deducciones basadas en ellas. Puedes deducir la ubicación de un objeto oculto, discernir qué arma causó una herida o encontrar el punto débil en una estructura.',
  'Medicine': 'Te permite estabilizar a un compañero moribundo o diagnosticar una enfermedad.',
  'Nature': 'Mide tu capacidad para recordar conocimientos sobre terreno, plantas y animales, el clima y los ciclos naturales.',
  'Perception': 'Te permite detectar la presencia de algo o alguien mediante la vista, el oído u otros sentidos. Es tu conciencia general del entorno. Se usa para detectar enemigos ocultos o puertas secretas.',
  'Performance': 'Determina qué tan bien puedes deleitar a una audiencia con música, baile, actuación, narración de historias u otra forma de entretenimiento.',
  'Persuasion': 'Se usa para influir en alguien o en un grupo de personas con tacto, gracia social o buena naturaleza. Se utiliza para actuar de buena fe, fomentar amistades o negociar acuerdos.',
  'Religion': 'Mide tu capacidad para recordar conocimientos sobre deidades, ritos y oraciones, jerarquías religiosas, símbolos sagrados y prácticas de cultos secretos.',
  'Sleight of Hand': 'Trucos manuales, como plantar un objeto en alguien más u ocultar un objeto en tu persona. También se usa para robar carteras o realizar trucos de magia.',
  'Stealth': 'Te permite ocultarte de los enemigos, escabullirte de los guardias, deslizarte sin ser notado o acercarte sigilosamente a alguien sin ser visto ni oído.',
  'Survival': 'Se usa para seguir rastros, cazar, guiar a tu grupo a través de tierras baldías, identificar signos de monstruos cercanos, predecir el clima o evitar peligros naturales como arenas movedizas.'
};
