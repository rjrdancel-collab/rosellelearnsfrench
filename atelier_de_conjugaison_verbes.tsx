import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  Settings, 
  BarChart3, 
  Search, 
  Sparkles,
  Lightbulb,
  GraduationCap,
  X,
  ChevronRight,
  LayoutGrid,
  CreditCard,
  Volume2
} from 'lucide-react';

const VERB_CATEGORIES = [
  { id: 'most_common', label: 'Most Common (50)' },
  { id: 'all', label: 'All Verbs (300+)' },
  { id: 'er', label: 'Regular -er' },
  { id: 'ir', label: 'Regular -ir' },
  { id: 're', label: 'Regular -re' },
  { id: 'stem', label: 'Stem-changing -er' },
  { id: 'irregular', label: 'Irregular' },
  { id: 'pronominal', label: 'Pronominal (Reflexive)' },
  { id: 'etre_verbs', label: 'Être Auxiliary Verbs' }
];

const LEVEL_FILTERS = [
  { id: 'all', label: 'Tous les niveaux' },
  { id: 'A1-A2', label: 'A1-A2' },
  { id: 'B1-B2', label: 'B1-B2' },
  { id: 'C1-C2', label: 'C1-C2' }
];

const VERB_TYPE_LABELS = {
  'er': '-ER',
  'ir': '-IR',
  're': '-RE',
  'irregular': 'Irrégulier',
  'pronominal': 'Pronominal',
  'stem': 'Stem-changing'
};

const PRONOUNS = [
  { id: 'je', label: 'je / j\'' },
  { id: 'tu', label: 'tu' },
  { id: 'il', label: 'il / elle / on' },
  { id: 'nous', label: 'nous' },
  { id: 'vous', label: 'vous' },
  { id: 'ils', label: 'ils / elles' }
];

const SEED_VERBS = [
  { verb: 'être', english: 'to be', cat: ['most_common', 'irregular', 'etre_verbs'], type: 'irregular', level: 'A1-A2' },
  { verb: 'avoir', english: 'to have', cat: ['most_common', 'irregular'], type: 'irregular', level: 'A1-A2' },
  { verb: 'aller', english: 'to go', cat: ['most_common', 'irregular', 'etre_verbs'], type: 'irregular', level: 'A1-A2' },
  { verb: 'faire', english: 'to do / to make', cat: ['most_common', 'irregular'], type: 'irregular', level: 'A1-A2' },
  { verb: 'pouvoir', english: 'to be able to (can)', cat: ['most_common', 'irregular'], type: 'irregular', level: 'A1-A2' },
  { verb: 'vouloir', english: 'to want', cat: ['most_common', 'irregular'], type: 'irregular', level: 'A1-A2' },
  { verb: 'devoir', english: 'must / to have to', cat: ['most_common', 'irregular'], type: 'irregular', level: 'A1-A2' },
  { verb: 'savoir', english: 'to know (fact/skill)', cat: ['most_common', 'irregular'], type: 'irregular', level: 'A1-A2' },
  { verb: 'voir', english: 'to see', cat: ['most_common', 'irregular'], type: 'irregular', level: 'A1-A2' },
  { verb: 'venir', english: 'to come', cat: ['most_common', 'irregular', 'etre_verbs'], type: 'irregular', level: 'A1-A2' },
  { verb: 'prendre', english: 'to take', cat: ['most_common', 'irregular'], type: 'irregular', level: 'A1-A2' },
  { verb: 'dire', english: 'to say / tell', cat: ['most_common', 'irregular'], type: 'irregular', level: 'A1-A2' },
  { verb: 'mettre', english: 'to put / place', cat: ['most_common', 'irregular'], type: 'irregular', level: 'A1-A2' },
  { verb: 'parler', english: 'to speak / talk', cat: ['most_common', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 'aimer', english: 'to like / love', cat: ['most_common', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 'finir', english: 'to finish', cat: ['most_common', 'ir'], type: 'ir', level: 'A1-A2' },
  { verb: 'choisir', english: 'to choose', cat: ['most_common', 'ir'], type: 'ir', level: 'A1-A2' },
  { verb: 'attendre', english: 'to wait for', cat: ['most_common', 're'], type: 're', level: 'A1-A2' },
  { verb: 'vendre', english: 'to sell', cat: ['most_common', 're'], type: 're', level: 'A1-A2' },
  { verb: 'se lever', english: 'to get up', cat: ['most_common', 'pronominal'], type: 'pronominal', level: 'A1-A2' },
  { verb: 's\'appeler', english: 'to be named', cat: ['most_common', 'pronominal', 'stem'], type: 'pronominal', level: 'A1-A2' },
  { verb: 'manger', english: 'to eat', cat: ['most_common', 'stem'], type: 'stem', level: 'A1-A2' },
  { verb: 'commencer', english: 'to begin / start', cat: ['most_common', 'stem'], type: 'stem', level: 'A1-A2' },
  { verb: 'acheter', english: 'to buy', cat: ['most_common', 'stem'], type: 'stem', level: 'A1-A2' },
  { verb: 'préférer', english: 'to prefer', cat: ['most_common', 'stem'], type: 'stem', level: 'A1-A2' },
  { verb: 'apprendre', english: 'to learn', cat: ['most_common', 'irregular'], type: 'irregular', level: 'B1-B2' },
  { verb: 'comprendre', english: 'to understand', cat: ['most_common', 'irregular'], type: 'irregular', level: 'A1-A2' },
  { verb: 'connaître', english: 'to know (person/place)', cat: ['most_common', 'irregular'], type: 'irregular', level: 'A1-A2' },
  { verb: 'croire', english: 'to believe', cat: ['most_common', 'irregular'], type: 'irregular', level: 'B1-B2' },
  { verb: 'demander', english: 'to ask', cat: ['most_common', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 'donner', english: 'to give', cat: ['most_common', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 'écrire', english: 'to write', cat: ['most_common', 'irregular'], type: 'irregular', level: 'A1-A2' },
  { verb: 'lire', english: 'to read', cat: ['most_common', 'irregular'], type: 'irregular', level: 'A1-A2' },
  { verb: 'partir', english: 'to leave', cat: ['most_common', 'irregular', 'etre_verbs'], type: 'irregular', level: 'A1-A2' },
  { verb: 'sortir', english: 'to go out', cat: ['most_common', 'irregular', 'etre_verbs'], type: 'irregular', level: 'A1-A2' },
  { verb: 'passer', english: 'to pass / spend time', cat: ['most_common', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 'penser', english: 'to think', cat: ['most_common', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 'rester', english: 'to stay', cat: ['most_common', 'er', 'etre_verbs'], type: 'er', level: 'A1-A2' },
  { verb: 'trouver', english: 'to find', cat: ['most_common', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 'travailler', english: 'to work', cat: ['most_common', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 'vivre', english: 'to live', cat: ['most_common', 'irregular'], type: 'irregular', level: 'B1-B2' },
  { verb: 'devenir', english: 'to become', cat: ['most_common', 'irregular', 'etre_verbs'], type: 'irregular', level: 'B1-B2' },
  { verb: 'revenir', english: 'to come back', cat: ['most_common', 'irregular', 'etre_verbs'], type: 'irregular', level: 'B1-B2' },
  { verb: 'tomber', english: 'to fall', cat: ['most_common', 'er', 'etre_verbs'], type: 'er', level: 'A1-A2' },
  { verb: 'arriver', english: 'to arrive', cat: ['most_common', 'er', 'etre_verbs'], type: 'er', level: 'A1-A2' },
  { verb: 'entrer', english: 'to enter', cat: ['most_common', 'er', 'etre_verbs'], type: 'er', level: 'A1-A2' },
  { verb: 'monter', english: 'to go up / climb', cat: ['most_common', 'er', 'etre_verbs'], type: 'er', level: 'A1-A2' },
  { verb: 'descendre', english: 'to go down', cat: ['most_common', 're', 'etre_verbs'], type: 're', level: 'A1-A2' },
  { verb: 'naître', english: 'to be born', cat: ['most_common', 'irregular', 'etre_verbs'], type: 'irregular', level: 'B1-B2' },
  { verb: 'mourir', english: 'to die', cat: ['most_common', 'irregular', 'etre_verbs'], type: 'irregular', level: 'B1-B2' }
];

const generateFullVerbList = () => {
  let list = [...SEED_VERBS];
  const EXPANSION_ER = [['habiter', 'to live'], ['jouer', 'to play'], ['écouter', 'to listen'], ['regarder', 'to watch'], ['étudier', 'to study']];
  const EXPANSION_IR = [['réussir', 'to succeed'], ['grandir', 'to grow'], ['réfléchir', 'to reflect/think'], ['bâtir', 'to build']];
  const EXPANSION_RE = [['répondre', 'to answer'], ['entendre', 'to hear'], ['rendre', 'to return/render']];

  const addEntries = (arr, cat, type) => {
    arr.forEach(([verb, english], idx) => {
      if (!list.some(v => v.verb === verb)) {
        list.push({ verb, english, cat: ['all', cat], type, level: idx % 2 === 0 ? 'A1-A2' : 'B1-B2' });
      }
    });
  };

  addEntries(EXPANSION_ER, 'er', 'er');
  addEntries(EXPANSION_IR, 'ir', 'ir');
  addEntries(EXPANSION_RE, 're', 're');
  return list.sort((a, b) => a.verb.localeCompare(b.verb));
};

const ALL_VERBS = generateFullVerbList();

const TENSES = [
  // INDICATIF (7)
  { id: 'present', name: 'Présent', mood: 'Indicatif', level: 'A1-A2',
    note: 'Used for present facts, habitual actions, and current events.',
    formation: 'Verb stem + standard endings (-e, -es, -e, -ons, -ez, -ent)'
  },
  { id: 'passe_compose', name: 'Passé composé', mood: 'Indicatif', level: 'A1-A2',
    note: 'Used for completed past actions at a specific time.',
    formation: 'Auxiliary (avoir or être in Présent) + Past Participle'
  },
  { id: 'imparfait', name: 'Imparfait', mood: 'Indicatif', level: 'A1-A2',
    note: 'Used for past habits, ongoing descriptions & background context.',
    formation: 'NOUS form of Present tense (drop -ons) + endings (-ais, -ais, -ait, -ions, -iez, -aient)'
  },
  { id: 'plus_que_parfait', name: 'Plus-que-parfait', mood: 'Indicatif', level: 'B1-B2',
    note: 'Used for an action completed before another past action.',
    formation: 'Auxiliary (avoir/être in Imparfait) + Past Participle'
  },
  { id: 'futur_simple', name: 'Futur simple', mood: 'Indicatif', level: 'A1-A2',
    note: 'Used for future events, promises, and predictions.',
    formation: 'Infinitive verb + endings (-ai, -as, -a, -ons, -ez, -ont)'
  },
  { id: 'futur_anterieur', name: 'Futur antérieur', mood: 'Indicatif', level: 'B1-B2',
    note: 'Used for an action that will be completed prior to a future moment.',
    formation: 'Auxiliary (avoir/être in Futur simple) + Past Participle'
  },
  { id: 'passe_simple', name: 'Passé simple', mood: 'Indicatif', level: 'C1-C2',
    note: 'Literary historical past tense used in formal text & stories.',
    formation: 'Stem + specific endings depending on verb group (e.g. -ai, -as, -a...)'
  },

  // CONDITIONNEL (2)
  { id: 'cond_present', name: 'Conditionnel présent', mood: 'Conditionnel', level: 'B1-B2',
    note: 'Used for hypothetical actions, polite requests & conditional desires.',
    formation: 'Future stem (Infinitive) + Imparfait endings (-ais, -ais, -ait...)'
  },
  { id: 'cond_passe', name: 'Conditionnel passé', mood: 'Conditionnel', level: 'B1-B2',
    note: 'Used for past regrets, unfulfilled conditions & hypothetical past.',
    formation: 'Auxiliary (avoir/être in Conditionnel présent) + Past Participle'
  },

  // SUBJONCTIF (2)
  { id: 'subj_present', name: 'Subjonctif présent', mood: 'Subjonctif', level: 'B1-B2',
    note: 'Used for doubts, desires, necessity, feelings & subjective thoughts.',
    formation: 'Stem from 3rd person plural (ILS) of Present + endings (-e, -es, -e, -ions, -iez, -ent)'
  },
  { id: 'subj_passe', name: 'Subjonctif passé', mood: 'Subjonctif', level: 'B1-B2',
    note: 'Used for past subjective emotions/doubts completed before main clause.',
    formation: 'Auxiliary (avoir/être in Subjonctif présent) + Past Participle'
  },

  // IMPÉRATIF (1)
  { id: 'imperatif', name: 'Impératif', mood: 'Impératif', level: 'A1-A2',
    note: 'Used for direct commands, instructions & requests.',
    formation: 'Tu, Nous, Vous forms of the present tense without pronouns.'
  }
];

const getSampleSentence = (verbObj, tenseId, conjugatedForms) => {
  const cleanEng = verbObj.english.replace(/^to\s+/i, '');
  const jeForm = conjugatedForms[0] || '';
  const tuForm = conjugatedForms[1] || '';
  const ilForm = conjugatedForms[2] || '';
  const nousForm = conjugatedForms[3] || '';
  const ilsForm = conjugatedForms[5] || '';
  const impForm = conjugatedForms[3] || ''; // Nous form for imperatif

  switch (tenseId) {
    case 'present': return { fr: `Aujourd'hui, il ${ilForm} avec ses amis.`, en: `Today, he is ${cleanEng}ing with his friends.` };
    case 'passe_compose': return { fr: `Hier, nous ${nousForm} après le dîner.`, en: `Yesterday, we ${cleanEng}ed after dinner.` };
    case 'imparfait': return { fr: `Quand j'étais jeune, je ${jeForm} souvent.`, en: `When I was young, I used to ${cleanEng} often.` };
    case 'plus_que_parfait': return { fr: `Ils ${ilsForm} avant mon arrivée.`, en: `They had (already) ${cleanEng}ed before my arrival.` };
    case 'futur_simple': return { fr: `Demain, tu ${tuForm} sans problème.`, en: `Tomorrow, you will ${cleanEng} without a problem.` };
    case 'futur_anterieur': return { fr: `Bientôt, j'${jeForm} complètement.`, en: `Soon, I will have ${cleanEng}ed completely.` };
    case 'passe_simple': return { fr: `Soudainement, il ${ilForm}.`, en: `Suddenly, he ${cleanEng}ed.` };
    case 'cond_present': return { fr: `Si j'avais le temps, je ${jeForm}.`, en: `If I had time, I would ${cleanEng}.` };
    case 'cond_passe': return { fr: `Dans ce cas, nous ${nousForm}.`, en: `In that case, we would have ${cleanEng}ed.` };
    case 'subj_present': return { fr: `Il est important que tu ${tuForm}.`, en: `It is important that you ${cleanEng}.` };
    case 'subj_passe': return { fr: `Je suis heureux qu'il ${ilForm}.`, en: `I am happy that he (has) ${cleanEng}ed.` };
    case 'imperatif': return { fr: `${impForm} maintenant !`, en: `Let's ${cleanEng} now!` };
    default: return { fr: `Je ${jeForm}.`, en: `I ${cleanEng}.` };
  }
};

const conjugateVerb = (verbObj, tenseId) => {
  const rawVerb = verbObj.verb.toLowerCase().trim();
  const isPronominal = rawVerb.startsWith('se ') || rawVerb.startsWith('s\'');
  const cleanVerb = rawVerb.replace(/^se\s+|^s\'/, '');

  // 1. Determine Past Participle
  const getPastParticiple = (v) => {
      if (['être'].includes(v)) return 'été';
      if (['avoir'].includes(v)) return 'eu';
      if (v === 'naître') return 'né';
      if (v === 'mourir') return 'mort';
      if (v.endsWith('dire')) return v.slice(0, -4) + 'dit';
      if (v.endsWith('faire')) return v.slice(0, -5) + 'fait';
      if (v === 'voir' || v === 'revoir') return v.slice(0, -4) + 'vu';
      if (v === 'pouvoir') return 'pu';
      if (v === 'vouloir') return 'voulu';
      if (v === 'devoir') return 'dû';
      if (v === 'savoir') return 'su';
      if (v.endsWith('lire')) return v.slice(0, -4) + 'lu';
      if (v === 'croire') return 'cru';
      if (v === 'boire') return 'bu';
      if (v === 'vivre' || v === 'survivre') return v.slice(0, -5) + 'vécu';
      if (v.endsWith('connaître') || v.endsWith('paraître')) return v.slice(0, -6) + 'u'; 
      if (v === 'pleuvoir') return 'plu';
      if (v === 'falloir') return 'fallu';
      if (v === 'asseoir') return 'assis';
      if (v === 'rire' || v === 'sourire') return v.slice(0, -4) + 'ri';
      if (v.endsWith('suivre')) return v.slice(0, -6) + 'suivi';
      if (v.endsWith('cevoir')) return v.slice(0, -6) + 'çu'; 
      if (v === 'résoudre') return 'résolu';
      if (v === 'vaincre' || v === 'convaincre') return v.slice(0, -6) + 'vaincu';
      if (v === 'plaire') return 'plu';
      if (v === 'fuir' || v === 's\'enfuir') return 'fui';
      if (v === 'courir' || v === 'parcourir') return v.slice(0, -6) + 'couru';
      if (v.endsWith('prendre')) return v.slice(0, -7) + 'pris';
      if (v.endsWith('mettre')) return v.slice(0, -6) + 'mis';
      if (v.endsWith('venir')) return v.slice(0, -5) + 'venu';
      if (v.endsWith('tenir')) return v.slice(0, -5) + 'tenu';
      if (v.endsWith('écrire')) return v.slice(0, -6) + 'écrit';
      if (v.endsWith('uire')) return v.slice(0, -4) + 'uit';
      if (v.match(/[aeo]indre$/)) return v.slice(0, -2) + 't';
      if (v.endsWith('ndre')) return v.slice(0, -2) + 'u'; 
      if (['offrir', 'ouvrir', 'souffrir', 'couvrir', 'découvrir'].includes(v)) return v.slice(0, -3) + 'ert';
      if (v.endsWith('er')) return v.slice(0, -2) + 'é';
      if (v.endsWith('ir')) return v.slice(0, -2) + 'i';
      if (v.endsWith('re')) return v.slice(0, -2) + 'u';
      return v;
  };

  const pp = getPastParticiple(cleanVerb);
  
  // 2. Determine Auxiliary (Avoir vs Être)
  const etreVerbsList = ['aller', 'arriver', 'descendre', 'devenir', 'entrer', 'monter', 'mourir', 'naître', 'partir', 'passer', 'rentrer', 'rester', 'retourner', 'revenir', 'sortir', 'tomber', 'venir'];
  const isEtre = etreVerbsList.includes(cleanVerb) || isPronominal || verbObj.cat?.includes('etre_verbs');

  const auxPC = isEtre ? ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'] : ['ai', 'as', 'a', 'avons', 'avez', 'ont'];
  const auxPQP = isEtre ? ['étais', 'étais', 'était', 'étions', 'étiez', 'étaient'] : ['avais', 'avais', 'avait', 'avions', 'aviez', 'avaient'];
  const auxFutAnt = isEtre ? ['serai', 'seras', 'sera', 'serons', 'serez', 'seront'] : ['aurai', 'auras', 'aura', 'aurons', 'aurez', 'auront'];
  const auxCondPasse = isEtre ? ['serais', 'serais', 'serait', 'serions', 'seriez', 'seraient'] : ['aurais', 'aurais', 'aurait', 'aurions', 'auriez', 'auraient'];
  const auxSubjPasse = isEtre ? ['sois', 'sois', 'soit', 'soyons', 'soyez', 'soient'] : ['aie', 'aies', 'ait', 'ayons', 'ayez', 'aient'];

  const generateCompound = (auxArray) => auxArray.map((aux, idx) => {
    let agreement = '';
    if (isEtre) {
      if (idx >= 3) agreement = '(e)s';
      else agreement = '(e)';
    }
    return `${aux} ${pp}${agreement}`;
  });

  // 3. Root Extraction for compound irregularities (e.g. comprendre -> prendre)
  const getRootVerb = (v) => {
    if (v.endsWith('prendre')) return ['prendre', v.slice(0, -7)];
    if (v.endsWith('mettre')) return ['mettre', v.slice(0, -6)];
    if (v.endsWith('venir')) return ['venir', v.slice(0, -5)];
    if (v.endsWith('tenir')) return ['tenir', v.slice(0, -5)];
    if (v.endsWith('écrire')) return ['écrire', v.slice(0, -6)];
    if (v.endsWith('cevoir')) return ['cevoir', v.slice(0, -6)];
    if (v.endsWith('aître')) return ['aître', v.slice(0, -5)];
    if (v.endsWith('aindre')) return ['aindre', v.slice(0, -6)];
    if (v.endsWith('eindre')) return ['eindre', v.slice(0, -6)];
    if (v.endsWith('oindre')) return ['oindre', v.slice(0, -6)];
    if (v.endsWith('battre')) return ['battre', v.slice(0, -6)];
    if (v.endsWith('suivre')) return ['suivre', v.slice(0, -6)];
    if (v.endsWith('uire') && !v.endsWith('fuir')) return ['uire', v.slice(0, -4)]; 
    if (v.endsWith('rire')) return ['rire', v.slice(0, -4)];
    if (v.endsWith('courir')) return ['courir', v.slice(0, -6)];
    if (v.endsWith('quérir')) return ['quérir', v.slice(0, -6)];
    if (v.endsWith('frir')) return ['frir', v.slice(0, -4)];
    if (v.endsWith('vrir')) return ['vrir', v.slice(0, -4)];
    if (['partir', 'repartir', 'sortir', 'ressortir', 'mentir', 'démentir', 'sentir', 'ressentir', 'pressentir'].includes(v)) return ['tir', v.slice(0, -3)];
    if (v.endsWith('dormir')) return ['dormir', v.slice(0, -6)];
    if (v.endsWith('servir')) return ['servir', v.slice(0, -6)];
    if (v === 'haïr') return ['haïr', ''];
    if (v === 'asseoir') return ['asseoir', ''];
    if (v === 'résoudre') return ['résoudre', ''];
    if (v === 'vaincre' || v === 'convaincre') return ['vaincre', v.slice(0, -7)];
    if (v === 'plaire') return ['plaire', ''];
    if (v === 'fuir' || v === 's\'enfuir') return ['fuir', v.endsWith('fuir') ? v.slice(0, -4) : ''];
    return [v, ''];
  };

  const [rootVerb, prefix] = getRootVerb(cleanVerb);

  // 4. Irregular Roots Dictionary
  const IRR = {
    'être': { pres: ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'], fut: 'ser', imp: 'ét', subj: ['sois', 'sois', 'soit', 'soyons', 'soyez', 'soient'] },
    'avoir': { pres: ['ai', 'as', 'a', 'avons', 'avez', 'ont'], fut: 'aur', imp: 'av', subj: ['aie', 'aies', 'ait', 'ayons', 'ayez', 'aient'] },
    'aller': { pres: ['vais', 'vas', 'va', 'allons', 'allez', 'vont'], fut: 'ir', imp: 'all', subj: ['aille', 'ailles', 'aille', 'allions', 'alliez', 'aillent'] },
    'faire': { pres: ['fais', 'fais', 'fait', 'faisons', 'faites', 'font'], fut: 'fer', imp: 'fais', subj: ['fasse', 'fasses', 'fasse', 'fassions', 'fassiez', 'fassent'] },
    'pouvoir': { pres: ['peux', 'peux', 'peut', 'pouvons', 'pouvez', 'peuvent'], fut: 'pourr', imp: 'pouv', subj: ['puisse', 'puisses', 'puisse', 'puissions', 'puissiez', 'puissent'] },
    'vouloir': { pres: ['veux', 'veux', 'veut', 'voulons', 'voulez', 'veulent'], fut: 'voudr', imp: 'voul', subj: ['veuille', 'veuilles', 'veuille', 'voulions', 'vouliez', 'veuillent'] },
    'devoir': { pres: ['dois', 'dois', 'doit', 'devons', 'devez', 'doivent'], fut: 'devr', imp: 'dev', subj: ['doive', 'doives', 'doive', 'devions', 'deviez', 'doivent'] },
    'savoir': { pres: ['sais', 'sais', 'sait', 'savons', 'savez', 'savent'], fut: 'saur', imp: 'sav', subj: ['sache', 'saches', 'sache', 'sachions', 'sachiez', 'sachent'] },
    'venir': { pres: ['viens', 'viens', 'vient', 'venons', 'venez', 'viennent'], fut: 'viendr', imp: 'ven', subj: ['vienne', 'viennes', 'vienne', 'venions', 'veniez', 'viennent'] },
    'tenir': { pres: ['tiens', 'tiens', 'tient', 'tenons', 'tenez', 'tiennent'], fut: 'tiendr', imp: 'ten', subj: ['tienne', 'tiennes', 'tienne', 'tenions', 'teniez', 'tiennent'] },
    'prendre': { pres: ['prends', 'prends', 'prend', 'prenons', 'prenez', 'prennent'], fut: 'prendr', imp: 'pren', subj: ['prenne', 'prennes', 'prenne', 'prenions', 'preniez', 'prennent'] },
    'dire': { pres: ['dis', 'dis', 'dit', 'disons', 'dites', 'disent'], fut: 'dir', imp: 'dis', subj: 'dis' },
    'mettre': { pres: ['mets', 'mets', 'met', 'mettons', 'mettez', 'mettent'], fut: 'mettr', imp: 'mett', subj: 'mett' },
    'voir': { pres: ['vois', 'vois', 'voit', 'voyons', 'voyez', 'voient'], fut: 'verr', imp: 'voy', subj: ['voie', 'voies', 'voie', 'voyions', 'voyiez', 'voient'] },
    'partir': { pres: ['pars', 'pars', 'part', 'partons', 'partez', 'partent'], fut: 'partir', imp: 'part', subj: 'part' },
    'sortir': { pres: ['sors', 'sors', 'sort', 'sortons', 'sortez', 'sortent'], fut: 'sortir', imp: 'sort', subj: 'sort' },
    'dormir': { pres: ['dors', 'dors', 'dort', 'dormons', 'dormez', 'dorment'], fut: 'dormir', imp: 'dorm', subj: 'dorm' },
    'lire': { pres: ['lis', 'lis', 'lit', 'lisons', 'lisez', 'lisent'], fut: 'lir', imp: 'lis', subj: 'lis' },
    'écrire': { pres: ['écris', 'écris', 'écrit', 'écrivons', 'écrivez', 'écrivent'], fut: 'écrir', imp: 'écriv', subj: 'écriv' },
    'boire': { pres: ['bois', 'bois', 'boit', 'buvons', 'buvez', 'boivent'], fut: 'boir', imp: 'buv', subj: ['boive', 'boives', 'boive', 'buvions', 'buviez', 'boivent'] },
    'croire': { pres: ['crois', 'crois', 'croit', 'croyons', 'croyez', 'croient'], fut: 'croir', imp: 'croy', subj: ['croie', 'croies', 'croie', 'croyions', 'croyiez', 'croient'] },
    'vivre': { pres: ['vis', 'vis', 'vit', 'vivons', 'vivez', 'vivent'], fut: 'vivr', imp: 'viv', subj: 'viv' },
    'mourir': { pres: ['meurs', 'meurs', 'meurt', 'mourons', 'mourez', 'meurent'], fut: 'mourr', imp: 'mour', subj: ['meure', 'meures', 'meure', 'mourions', 'mouriez', 'meurent'] },
    'cevoir': { pres: ['çois', 'çois', 'çoit', 'cevons', 'cevez', 'çoivent'], fut: 'cevr', imp: 'cev', subj: ['çoive', 'çoives', 'çoive', 'cevions', 'ceviez', 'çoivent'] },
    'aître': { pres: ['ais', 'ais', 'aît', 'aissons', 'aissez', 'aissent'], fut: 'aîtr', imp: 'aiss', subj: 'aiss' },
    'aindre': { pres: ['ains', 'ains', 'aint', 'aignons', 'aignez', 'aignent'], fut: 'aindr', imp: 'aign', subj: 'aign' },
    'eindre': { pres: ['eins', 'eins', 'eint', 'eignons', 'eignez', 'eignent'], fut: 'eindr', imp: 'eign', subj: 'eign' },
    'oindre': { pres: ['oins', 'oins', 'oint', 'oignons', 'oignez', 'oignent'], fut: 'oindr', imp: 'oign', subj: 'oign' },
    'battre': { pres: ['bats', 'bats', 'bat', 'battons', 'battez', 'battent'], fut: 'battr', imp: 'batt', subj: 'batt' },
    'suivre': { pres: ['suis', 'suis', 'suit', 'suivons', 'suivez', 'suivent'], fut: 'suivr', imp: 'suiv', subj: 'suiv' },
    'rire': { pres: ['ris', 'ris', 'rit', 'rions', 'riez', 'rient'], fut: 'rir', imp: 'ri', subj: 'ri' },
    'uire': { pres: ['uis', 'uis', 'uit', 'uisons', 'uisez', 'uisent'], fut: 'uir', imp: 'uis', subj: 'uis' },
    'courir': { pres: ['cours', 'cours', 'court', 'courons', 'courez', 'courent'], fut: 'courr', imp: 'cour', subj: 'cour' },
    'quérir': { pres: ['quiers', 'quiers', 'quiert', 'quérons', 'quérez', 'quièrent'], fut: 'querr', imp: 'quér', subj: ['quière', 'quières', 'quière', 'quérions', 'quériez', 'quièrent'] },
    'frir': { pres: ['fre', 'fres', 'fre', 'frons', 'frez', 'frent'], fut: 'frir', imp: 'fr', subj: 'fr' },
    'vrir': { pres: ['vre', 'vres', 'vre', 'vrons', 'vrez', 'vrent'], fut: 'vrir', imp: 'vr', subj: 'vr' },
    'tir': { pres: ['s', 's', 't', 'tons', 'tez', 'tent'], fut: 'tir', imp: 't', subj: 't' },
    'servir': { pres: ['sers', 'sers', 'sert', 'servons', 'servez', 'servent'], fut: 'servir', imp: 'serv', subj: 'serv' },
    'haïr': { pres: ['hais', 'hais', 'hait', 'haïssons', 'haïssez', 'haïssent'], fut: 'haïr', imp: 'haïss', subj: 'haïss' },
    'asseoir': { pres: ['assieds', 'assieds', 'assied', 'asseyons', 'asseyez', 'asseyent'], fut: 'assiér', imp: 'assey', subj: ['asseye', 'asseyes', 'asseye', 'asseyions', 'asseyiez', 'asseyent'] },
    'résoudre': { pres: ['résous', 'résous', 'résout', 'résolvons', 'résolvez', 'résolvent'], fut: 'résoudr', imp: 'résolv', subj: 'résolv' },
    'vaincre': { pres: ['vaincs', 'vaincs', 'vainc', 'vainquons', 'vainquez', 'vainquent'], fut: 'vaincr', imp: 'vainqu', subj: 'vainqu' },
    'plaire': { pres: ['plais', 'plais', 'plaît', 'plaisons', 'plaisez', 'plaisent'], fut: 'plair', imp: 'plais', subj: 'plais' },
    'fuir': { pres: ['fuis', 'fuis', 'fuit', 'fuyons', 'fuyez', 'fuient'], fut: 'fuir', imp: 'fuy', subj: ['fuie', 'fuies', 'fuie', 'fuyions', 'fuyiez', 'fuient'] },
    'falloir': { pres: ['-', '-', 'faut', '-', '-', '-'], fut: 'faudr', imp: 'fall', subj: ['-', '-', 'faille', '-', '-', '-'] },
    'pleuvoir': { pres: ['-', '-', 'pleut', '-', '-', '-'], fut: 'pleuvr', imp: 'pleuv', subj: ['-', '-', 'pleuve', '-', '-', '-'] }
  };

  let pres = [], imp = [], fut = [], subj = [];
  const rootData = IRR[rootVerb];

  if (rootData) {
    pres = rootData.pres.map(f => f === '-' ? '-' : prefix + f);
    const impStem = rootData.imp === '-' ? '-' : prefix + rootData.imp;
    imp = impStem === '-' ? ['-', '-', '-', '-', '-', '-'] : [impStem+'ais', impStem+'ais', impStem+'ait', impStem+'ions', impStem+'iez', impStem+'aient'];
    const futStem = rootData.fut === '-' ? '-' : prefix + rootData.fut;
    fut = futStem === '-' ? ['-', '-', '-', '-', '-', '-'] : [futStem+'ai', futStem+'as', futStem+'a', futStem+'ons', futStem+'ez', futStem+'ont'];
    if (Array.isArray(rootData.subj)) {
      subj = rootData.subj.map(f => f === '-' ? '-' : prefix + f);
    } else {
      const subjStem = rootData.subj === '-' ? '-' : prefix + rootData.subj;
      subj = subjStem === '-' ? ['-', '-', '-', '-', '-', '-'] : [subjStem+'e', subjStem+'es', subjStem+'e', subjStem+'ions', subjStem+'iez', subjStem+'ent'];
    }
  } else {
    // Standard Regular Generation
    let stem = cleanVerb;
    let ending = 'er';
    if (cleanVerb.endsWith('er')) { stem = cleanVerb.slice(0, -2); ending = 'er'; }
    else if (cleanVerb.endsWith('ir')) { stem = cleanVerb.slice(0, -2); ending = 'ir'; }
    else if (cleanVerb.endsWith('re')) { stem = cleanVerb.slice(0, -2); ending = 're'; }

    const needsGrave = cleanVerb.match(/[eé][^aeiouy]er$/); // Matches lever, peser, acheter, préférer

    if (ending === 'er') {
      if (cleanVerb === 'appeler') { pres = ['appelle', 'appelles', 'appelle', 'appelons', 'appelez', 'appellent']; }
      else if (cleanVerb.endsWith('jeter')) { 
          const jStem = stem + 't';
          pres = [jStem+'e', jStem+'es', jStem+'e', stem+'ons', stem+'ez', jStem+'ent'];
      }
      else if (cleanVerb.endsWith('yer')) {
          const yStem = stem.slice(0, -1) + 'i';
          pres = [yStem+'e', yStem+'es', yStem+'e', stem+'ons', stem+'ez', yStem+'ent'];
      }
      else if (needsGrave) { 
          const eStem = stem.slice(0, -2) + 'è' + stem.slice(-1);
          pres = [eStem+'e', eStem+'es', eStem+'e', stem+'ons', stem+'ez', eStem+'ent'];
      }
      else if (cleanVerb.endsWith('ger')) { pres = [stem+'e', stem+'es', stem+'e', stem+'eons', stem+'ez', stem+'ent']; }
      else if (cleanVerb.endsWith('cer')) { const cStem = stem.slice(0,-1)+'ç'; pres = [stem+'e', stem+'es', stem+'e', cStem+'ons', stem+'ez', stem+'ent']; }
      else { pres = [stem+'e', stem+'es', stem+'e', stem+'ons', stem+'ez', stem+'ent']; }

      if (cleanVerb.endsWith('ger')) { imp = [stem+'eais', stem+'eais', stem+'eait', stem+'ions', stem+'iez', stem+'eaient']; }
      else if (cleanVerb.endsWith('cer')) { const cStem = stem.slice(0,-1)+'ç'; imp = [cStem+'ais', cStem+'ais', cStem+'ait', stem+'ions', stem+'iez', cStem+'aient']; }
      else { imp = [stem+'ais', stem+'ais', stem+'ait', stem+'ions', stem+'iez', stem+'aient']; }

      if (cleanVerb === 'appeler') fut = ['appellerai', 'appelleras', 'appellera', 'appellerons', 'appellerez', 'appelleront'];
      else if (cleanVerb.endsWith('jeter')) {
          const fStem = cleanVerb.slice(0, -2) + 'tter'; 
          fut = [fStem+'ai', fStem+'as', fStem+'a', fStem+'ons', fStem+'ez', fStem+'ont'];
      } else if (cleanVerb.endsWith('envoyer')) {
          const fStem = cleanVerb.slice(0, -7) + 'enverr';
          fut = [fStem+'ai', fStem+'as', fStem+'a', fStem+'ons', fStem+'ez', fStem+'ont'];
      } else if (cleanVerb.endsWith('yer')) {
          const fStem = cleanVerb.slice(0, -3) + 'ier'; 
          fut = [fStem+'ai', fStem+'as', fStem+'a', fStem+'ons', fStem+'ez', fStem+'ont'];
      } else if (cleanVerb.match(/e[^aeiouy]er$/) && !cleanVerb.match(/é[^aeiouy]er$/)) { 
          // Only for e_er (like lever, acheter), NOT é_er (like espérer -> espérerai)
          const fStem = cleanVerb.slice(0, -3) + 'è' + cleanVerb.slice(-2, -1) + 'er'; 
          fut = [fStem+'ai', fStem+'as', fStem+'a', fStem+'ons', fStem+'ez', fStem+'ont'];
      } else fut = [cleanVerb+'ai', cleanVerb+'as', cleanVerb+'a', cleanVerb+'ons', cleanVerb+'ez', cleanVerb+'ont'];

      if (cleanVerb === 'appeler') subj = ['appelle', 'appelles', 'appelle', 'appelions', 'appeliez', 'appellent'];
      else if (cleanVerb.endsWith('jeter')) {
          const jStem = stem + 't';
          subj = [jStem+'e', jStem+'es', jStem+'e', stem+'ions', stem+'iez', jStem+'ent'];
      } else if (cleanVerb.endsWith('yer')) {
          const yStem = stem.slice(0, -1) + 'i';
          subj = [yStem+'e', yStem+'es', yStem+'e', stem+'ions', stem+'iez', yStem+'ent'];
      } else if (needsGrave) {
          const eStem = stem.slice(0, -2) + 'è' + stem.slice(-1);
          subj = [eStem+'e', eStem+'es', eStem+'e', stem+'ions', stem+'iez', eStem+'ent'];
      } else if (cleanVerb.endsWith('ger')) {
          subj = [stem+'e', stem+'es', stem+'e', stem+'ions', stem+'iez', stem+'ent'];
      } else if (cleanVerb.endsWith('cer')) {
          subj = [stem+'e', stem+'es', stem+'e', stem+'ions', stem+'iez', stem+'ent'];
      } else subj = [stem+'e', stem+'es', stem+'e', stem+'ions', stem+'iez', stem+'ent'];
    } else if (ending === 'ir') {
      pres = [stem+'is', stem+'is', stem+'it', stem+'issons', stem+'issez', stem+'issent'];
      imp = [stem+'issais', stem+'issais', stem+'issait', stem+'issions', stem+'issiez', stem+'issaient'];
      fut = [cleanVerb+'ai', cleanVerb+'as', cleanVerb+'a', cleanVerb+'ons', cleanVerb+'ez', cleanVerb+'ont'];
      subj = [stem+'isse', stem+'isses', stem+'isse', stem+'issions', stem+'issiez', stem+'issent'];
    } else {
      pres = [stem+'s', stem+'s', stem, stem+'ons', stem+'ez', stem+'ent'];
      imp = [stem+'ais', stem+'ais', stem+'ait', stem+'ions', stem+'iez', stem+'aient'];
      const futBase = cleanVerb.slice(0, -1);
      fut = [futBase+'ai', futBase+'as', futBase+'a', futBase+'ons', futBase+'ez', futBase+'ont'];
      subj = [stem+'e', stem+'es', stem+'e', stem+'ions', stem+'iez', stem+'ent'];
    }
  }

  const condBase = fut[0] === '-' ? '-' : fut[0].slice(0, -2);
  const cond = condBase === '-' ? ['-', '-', '-', '-', '-', '-'] : [condBase+'ais', condBase+'ais', condBase+'ait', condBase+'ions', condBase+'iez', condBase+'aient'];

  const getPasseSimple = () => {
    if (rootVerb === 'être') return ['fus', 'fus', 'fut', 'fûmes', 'fûtes', 'furent'];
    if (rootVerb === 'avoir') return ['eus', 'eus', 'eut', 'eûmes', 'eûtes', 'eurent'];
    if (rootVerb === 'aller') return ['allai', 'allas', 'alla', 'allâmes', 'allâtes', 'allèrent'];
    if (rootVerb === 'faire') return ['fis', 'fis', 'fit', 'fîmes', 'fîtes', 'firent'];
    if (rootVerb === 'venir' || rootVerb === 'tenir') {
      const b = prefix + (rootVerb === 'venir' ? 'v' : 't');
      return [b+'ins', b+'ins', b+'int', b+'înmes', b+'întes', b+'inrent'];
    }
    if (['pouvoir', 'vouloir', 'devoir', 'savoir', 'boire', 'croire', 'lire', 'vivre', 'connaître', 'aître', 'pleuvoir', 'falloir', 'mourir', 'cevoir', 'courir', 'plaire', 'résoudre'].includes(rootVerb)) {
       let uStem = pp.slice(0, -1);
       if (rootVerb === 'mourir') uStem = prefix + 'mour';
       if (rootVerb === 'aître' && pp.endsWith('é')) uStem = prefix + 'naqu'; 
       else if (rootVerb === 'aître') uStem = prefix + 'conn';
       if (rootVerb === 'vivre') uStem = prefix + 'véc';
       return [uStem+'us', uStem+'us', uStem+'ut', uStem+'ûmes', uStem+'ûtes', uStem+'urent'];
    }
    if (['prendre', 'mettre', 'dire', 'voir', 'écrire', 'asseoir', 'faire', 'rire', 'suivre', 'vaincre', 'uire', 'aindre', 'eindre', 'oindre', 'battre', 'quérir', 'frir', 'vrir', 'tir', 'dormir', 'servir', 'fuir'].includes(rootVerb)) {
       let iStem = cleanVerb; 
       if (cleanVerb.endsWith('re') || cleanVerb.endsWith('ir') || cleanVerb.endsWith('er')) {
           iStem = cleanVerb.slice(0, -2);
       }
       if (rootVerb === 'prendre') iStem = prefix + 'pr';
       if (rootVerb === 'mettre') iStem = prefix + 'm';
       if (rootVerb === 'dire') iStem = prefix + 'd';
       if (rootVerb === 'voir') iStem = prefix + 'v';
       if (rootVerb === 'écrire') iStem = prefix + 'écriv';
       if (rootVerb === 'asseoir') iStem = prefix + 'ass';
       if (rootVerb === 'faire') iStem = prefix + 'f';
       if (rootVerb === 'rire') iStem = prefix + 'r';
       if (rootVerb === 'suivre') iStem = prefix + 'suiv';
       if (rootVerb === 'vaincre') iStem = prefix + 'vainqu';
       if (rootVerb === 'uire') iStem = prefix + rootVerb.slice(0, -4) + 'uis'; 
       if (rootVerb === 'aindre' || rootVerb === 'eindre' || rootVerb === 'oindre') iStem = prefix + rootVerb.slice(0, -6) + rootVerb[0] + 'ign';
       if (rootVerb === 'battre') iStem = prefix + 'batt';
       if (rootVerb === 'quérir') iStem = prefix + 'qu';
       if (rootVerb === 'frir') iStem = prefix + 'fr';
       if (rootVerb === 'vrir') iStem = prefix + 'vr';
       if (rootVerb === 'tir') iStem = prefix + 't';
       if (rootVerb === 'dormir') iStem = prefix + 'dorm';
       if (rootVerb === 'servir') iStem = prefix + 'serv';
       if (rootVerb === 'fuir') iStem = prefix + 'fuy'; 
       return [iStem+'is', iStem+'is', iStem+'it', iStem+'îmes', iStem+'îtes', iStem+'irent'];
    }
    
    // Standard Regular Verb Fallbacks
    let stemEnd = cleanVerb;
    let ending = 'er';
    if (cleanVerb.endsWith('er')) { stemEnd = cleanVerb.slice(0, -2); ending = 'er'; }
    else if (cleanVerb.endsWith('ir')) { stemEnd = cleanVerb.slice(0, -2); ending = 'ir'; }
    else if (cleanVerb.endsWith('re')) { stemEnd = cleanVerb.slice(0, -2); ending = 're'; }

    if (ending === 'er') {
        let eStem = stemEnd;
        if (cleanVerb.endsWith('ger')) eStem = stemEnd + 'e';
        else if (cleanVerb.endsWith('cer')) eStem = stemEnd.slice(0, -1) + 'ç';
        return [eStem+'ai', eStem+'as', eStem+'a', eStem+'âmes', eStem+'âtes', eStem+'èrent'];
    }
    if (ending === 're' && cleanVerb.endsWith('ndre')) return [stemEnd+'is', stemEnd+'is', stemEnd+'it', stemEnd+'îmes', stemEnd+'îtes', stemEnd+'irent']; 
    return [stemEnd+'is', stemEnd+'is', stemEnd+'it', stemEnd+'îmes', stemEnd+'îtes', stemEnd+'irent'];
  };

  let impForm1 = pres[0];
  if (cleanVerb.endsWith('er') && impForm1.endsWith('s')) impForm1 = impForm1.slice(0,-1);
  let imperatif = [impForm1, '-', '-', pres[3], pres[4], '-'];
  
  // Specific Imperative Overrides
  if (rootVerb === 'être') imperatif = ['sois', '-', '-', 'soyons', 'soyez', '-'];
  else if (rootVerb === 'avoir') imperatif = ['aie', '-', '-', 'ayons', 'ayez', '-'];
  else if (rootVerb === 'savoir') imperatif = ['sache', '-', '-', 'sachons', 'sachez', '-'];
  else if (rootVerb === 'vouloir') imperatif = ['veuille', '-', '-', 'veuillons', 'veuillez', '-'];
  else if (rootVerb === 'aller') imperatif = ['va', '-', '-', 'allons', 'allez', '-'];
  else if (rootVerb === 'falloir' || rootVerb === 'pleuvoir') imperatif = ['-', '-', '-', '-', '-', '-'];

  let forms = [];
  switch (tenseId) {
    case 'present': forms = pres; break;
    case 'passe_compose': forms = generateCompound(auxPC); break;
    case 'imparfait': forms = imp; break;
    case 'plus_que_parfait': forms = generateCompound(auxPQP); break;
    case 'futur_simple': forms = fut; break;
    case 'futur_anterieur': forms = generateCompound(auxFutAnt); break;
    case 'passe_simple': forms = getPasseSimple(); break;
    case 'cond_present': forms = cond; break;
    case 'cond_passe': forms = generateCompound(auxCondPasse); break;
    case 'subj_present': forms = subj; break;
    case 'subj_passe': forms = generateCompound(auxSubjPasse); break;
    case 'imperatif': forms = imperatif; break;
    default: forms = pres;
  }

  // 5. Apply Pronominal Elisions
  if (isPronominal) {
    const refs = ['me ', 'te ', 'se ', 'nous ', 'vous ', 'se '];
    forms = forms.map((f, idx) => {
      if (f === '-') return '-';
      let ref = refs[idx];
      const firstWord = f.split(' ')[0];
      const vowels = ['a', 'e', 'i', 'o', 'u', 'y', 'h', 'é', 'è', 'ê', 'â', 'î', 'ô', 'û'];
      if (['me ', 'te ', 'se '].includes(ref) && vowels.includes(firstWord.charAt(0).toLowerCase())) {
        return ref.charAt(0) + "'" + f;
      }
      return ref + f;
    });
  }

  return forms;
};

const highlightConjugation = (verbObj, conjugatedForm, tenseId) => {
  if (!conjugatedForm || conjugatedForm === '-') return <span className="text-[#2c2623]">-</span>;

  // For compound tenses, make the auxiliary red and past participle black
  if (['passe_compose', 'plus_que_parfait', 'futur_anterieur', 'cond_passe', 'subj_passe'].includes(tenseId)) {
    const parts = conjugatedForm.split(' ');
    if (parts.length >= 2) {
      const aux = parts.slice(0, -1).join(' ');
      const pp = parts[parts.length - 1];
      return (
        <span>
          <span className="text-[#b84a39] font-bold">{aux}</span> <span className="text-[#2c2623]">{pp}</span>
        </span>
      );
    }
  }

  // For simple tenses, find the matching stem and color the ending red
  const inf = verbObj.verb.replace(/^se\s+|^s\'/, '');
  let stem = '';
  for (let i = 0; i < inf.length; i++) {
    if (inf[i].toLowerCase() === conjugatedForm[i]?.toLowerCase()) {
      stem += conjugatedForm[i];
    } else {
      break;
    }
  }

  // Exception for total stem changes (e.g. être -> suis) - color everything red
  if (stem.length < 2) {
     return <span className="text-[#b84a39] font-bold">{conjugatedForm}</span>;
  }

  const ending = conjugatedForm.slice(stem.length);
  return (
    <span>
      <span className="text-[#2c2623]">{stem}</span>
      <span className="text-[#b84a39] font-bold">{ending}</span>
    </span>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('verbs');

  // Exercise Filters
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('most_common');
  const [selectedTenses, setSelectedTenses] = useState(['present', 'passe_compose', 'imparfait', 'futur_simple']);
  
  // Practice Settings
  const [mode, setMode] = useState('single'); 
  const [sessionLength, setSessionLength] = useState(20);
  const [strictAccents, setStrictAccents] = useState(true);
  const [showEnglish, setShowEnglish] = useState(true);

  // Session State
  const [questionCount, setQuestionCount] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [tableInputs, setTableInputs] = useState(['', '', '', '', '', '']);
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);

  // Active Question
  const [currentQuestion, setCurrentQuestion] = useState(null);

  // Tables Reference State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTableVerb, setSelectedTableVerb] = useState(ALL_VERBS[0]);
  const [tablesCategoryFilter, setTablesCategoryFilter] = useState('all');
  const [tablesViewMode, setTablesViewMode] = useState('tables'); 
  const [flashcardTenseIndex, setFlashcardTenseIndex] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);

  // Stats
  const [stats, setStats] = useState({ totalAnswered: 0, totalCorrect: 0, tenseStats: {} });

  const availableVerbs = useMemo(() => {
    let list = ALL_VERBS;
    if (selectedCategory !== 'all') list = list.filter(v => v.cat.includes(selectedCategory));
    if (selectedLevel !== 'all') list = list.filter(v => v.level === selectedLevel);
    return list.length > 0 ? list : ALL_VERBS;
  }, [selectedCategory, selectedLevel]);

  const generateNewQuestion = () => {
    if (availableVerbs.length === 0 || selectedTenses.length === 0) return;
    setShowHint(false);

    const randomVerb = availableVerbs[Math.floor(Math.random() * availableVerbs.length)];
    const randomTenseId = selectedTenses[Math.floor(Math.random() * selectedTenses.length)];
    const tenseObj = TENSES.find(t => t.id === randomTenseId);
    const fullConj = conjugateVerb(randomVerb, randomTenseId);

    const randomPersonIdx = Math.floor(Math.random() * 6);
    const person = PRONOUNS[randomPersonIdx];
    const correctAnswer = fullConj[randomPersonIdx];

    let options = [];
    if (mode === 'choose') {
      options.push(correctAnswer);
      while (options.length < 4) {
        const randOtherPerson = Math.floor(Math.random() * 6);
        const wrongOpt = fullConj[randOtherPerson];
        if (!options.includes(wrongOpt) && wrongOpt !== '-') options.push(wrongOpt);
        else {
          const altVerb = availableVerbs[Math.floor(Math.random() * availableVerbs.length)];
          const altConj = conjugateVerb(altVerb, randomTenseId)[randomPersonIdx];
          if (!options.includes(altConj) && altConj !== '-') options.push(altConj);
        }
      }
      options = options.sort(() => Math.random() - 0.5);
    }

    setCurrentQuestion({
      verb: randomVerb,
      tense: tenseObj,
      personIdx: randomPersonIdx,
      person: person,
      correctAnswer: correctAnswer,
      fullConjugations: fullConj,
      options: options
    });

    setUserInput('');
    setTableInputs(['', '', '', '', '', '']);
    setFeedback(null);
  };

  useEffect(() => {
    generateNewQuestion();
  }, [mode, selectedCategory, selectedLevel, selectedTenses]);

  const addAccent = (char) => setUserInput(prev => prev + char);

  const normalize = (str) => {
    if (!str) return '';
    let res = str.trim().toLowerCase().replace(/^(que\s+|qu\')/i, '');
    if (!strictAccents) res = res.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return res;
  };

  const checkAnswer = (customAnswer) => {
    if (feedback || !currentQuestion) return;
    let isCorrect = false;
    let expected = currentQuestion.correctAnswer;
    const normalizedExpected = normalize(expected);

    if (mode === 'single') {
      const val = customAnswer !== undefined ? customAnswer : userInput;
      isCorrect = normalize(val) === normalizedExpected;
    } else if (mode === 'choose') {
      isCorrect = normalize(customAnswer) === normalizedExpected;
    } else if (mode === 'table') {
      isCorrect = tableInputs.every((val, idx) => {
        if (currentQuestion.fullConjugations[idx] === '-') return true;
        return normalize(val) === normalize(currentQuestion.fullConjugations[idx]);
      });
      expected = currentQuestion.fullConjugations.join(' | ');
    }

    if (isCorrect) {
      setScore(s => s + 1);
      setStreak(s => { const next = s + 1; if (next > bestStreak) setBestStreak(next); return next; });
    } else setStreak(0);

    setStats(prev => {
      const tId = currentQuestion.tense.id;
      const tStat = prev.tenseStats[tId] || { answered: 0, correct: 0 };
      return {
        ...prev,
        totalAnswered: prev.totalAnswered + 1,
        totalCorrect: prev.totalCorrect + (isCorrect ? 1 : 0),
        tenseStats: { ...prev.tenseStats, [tId]: { answered: tStat.answered + 1, correct: tStat.correct + (isCorrect ? 1 : 0) } }
      };
    });

    setFeedback({ isCorrect, answer: expected, note: currentQuestion.tense.note, formation: currentQuestion.tense.formation });
  };

  const handleNextQuestion = () => {
    if (sessionLength !== Infinity && questionCount >= sessionLength) {
      setQuestionCount(1);
      setScore(0);
    } else setQuestionCount(q => q + 1);
    generateNewQuestion();
  };

  const toggleTense = (id) => {
    if (selectedTenses.includes(id)) {
      if (selectedTenses.length > 1) setSelectedTenses(selectedTenses.filter(t => t !== id));
    } else setSelectedTenses([...selectedTenses, id]);
  };

  const filteredTableVerbs = useMemo(() => {
    return ALL_VERBS.filter(v => {
      const matchesSearch = v.verb.toLowerCase().includes(searchQuery.toLowerCase()) || v.english.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLevel = selectedLevel === 'all' || v.level === selectedLevel;
      const matchesCat = tablesCategoryFilter === 'all' || v.type === tablesCategoryFilter;
      return matchesSearch && matchesLevel && matchesCat;
    });
  }, [searchQuery, selectedLevel, tablesCategoryFilter]);

  // Display grid exactly as requested: Je/Nous, Tu/Vous, Il/Ils
  const gridOrder = [0, 3, 1, 4, 2, 5];

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#2c2623] font-serif pb-16 antialiased">
      {/* HEADER SECTION */}
      <header className="sticky top-0 z-30 bg-[#fbf9f5]/90 backdrop-blur-md border-b border-[#e8e2d8] shadow-xs">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg">🇫🇷</span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#b84a39] font-sans">
                Atelier de Conjugaison & Verbes
              </span>
            </div>
            <h1 className="text-2xl font-normal text-[#2c2623] font-serif tracking-tight mt-0.5">
              Roselle Learns French
            </h1>
          </div>
        </div>

        {/* TABS BAR (Updated Order) */}
        <div className="max-w-5xl mx-auto px-4 pb-3 flex items-center justify-start overflow-x-auto">
          <nav className="flex items-center space-x-1.5 font-sans">
            {[
              { id: 'verbs', label: 'Verbes' },
              { id: 'guide', label: 'Guide Grammaire' },
              { id: 'pronunciation', label: 'Prononciation' },
              { id: 'practice', label: 'Exercices' },
              { id: 'progress', label: 'Progression' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#b84a39] text-white shadow-xs'
                    : 'bg-white/80 text-[#5c524c] hover:bg-white border border-[#e8e2d8]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-5xl mx-auto px-4 mt-8 flex flex-col lg:flex-row gap-6 items-start">
        
        {/* LEFT/MAIN CONTENT */}
        <div className="flex-1 w-full space-y-6">

          {/* TAB 1: VERBES (Tables & Flashcards) */}
          {activeTab === 'verbs' && (
            <div className="space-y-6 font-sans">
              <div className="bg-white rounded-3xl p-6 border border-[#e8e2d8] shadow-xs space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex flex-col sm:flex-row gap-3 flex-1">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-4 top-3.5 text-[#a09488]" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search 300+ verbs..."
                        className="w-full pl-11 pr-4 py-3 bg-[#fbf9f5] border border-[#e8e2d8] rounded-2xl text-[#2c2623] font-medium outline-none focus:border-[#b84a39] transition-all text-xs"
                      />
                    </div>
                    <select
                      value={tablesCategoryFilter}
                      onChange={(e) => setTablesCategoryFilter(e.target.value)}
                      className="px-4 py-3 bg-[#fbf9f5] border border-[#e8e2d8] rounded-2xl text-[#2c2623] text-xs font-semibold outline-none focus:border-[#b84a39]"
                    >
                      <option value="all">Tous les types</option>
                      <option value="er">-ER régulier</option>
                      <option value="ir">-IR régulier</option>
                      <option value="re">-RE régulier</option>
                      <option value="irregular">Irréguliers</option>
                      <option value="pronominal">Pronominal</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2 bg-[#fbf9f5] p-1.5 rounded-2xl border border-[#e8e2d8]">
                    <button
                      onClick={() => setTablesViewMode('tables')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                        tablesViewMode === 'tables' ? 'bg-[#b84a39] text-white shadow-xs' : 'text-[#5c524c] hover:bg-[#f6eee3]'
                      }`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                      <span className="hidden sm:inline">Tables</span>
                    </button>
                    <button
                      onClick={() => {
                        setTablesViewMode('flashcards');
                        setFlashcardFlipped(false);
                        setFlashcardTenseIndex(0);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                        tablesViewMode === 'flashcards' ? 'bg-[#b84a39] text-white shadow-xs' : 'text-[#5c524c] hover:bg-[#f6eee3]'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span className="hidden sm:inline">Flashcards</span>
                    </button>
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 border-t border-[#f0ebe1] pt-4">
                  {filteredTableVerbs.map((v, i) => {
                    const isSelected = selectedTableVerb && selectedTableVerb.verb === v.verb;
                    return (
                      <button
                        key={`${v.verb}-${i}`}
                        onClick={() => {
                          setSelectedTableVerb(v);
                          setFlashcardFlipped(false);
                          setFlashcardTenseIndex(0);
                        }}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected ? 'bg-[#b84a39] text-white border-[#b84a39] shadow-xs' : 'bg-[#fbf9f5] hover:bg-[#f6eee3] text-[#2c2623] border-[#e8e2d8]'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <div className="font-serif text-base font-normal truncate">{v.verb}</div>
                          <div className={`text-[11px] truncate ${isSelected ? 'text-white/80' : 'text-[#8c8075]'}`}>
                            {v.english}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 items-end shrink-0">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${isSelected ? 'bg-white/20 text-white border-white/30' : 'bg-white text-[#b84a39] border-[#e8dac8]'}`}>
                            {v.level}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${isSelected ? 'bg-white/20 text-white border-white/30' : 'bg-white text-[#5c524c] border-[#e8e2d8]'}`}>
                            {VERB_TYPE_LABELS[v.type] || v.type}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                  {filteredTableVerbs.length === 0 && <div className="col-span-full text-center py-8 text-[#8c8075] text-xs">Aucun verbe trouvé.</div>}
                </div>
              </div>

              {/* TABLES VIEW */}
              {tablesViewMode === 'tables' && selectedTableVerb && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8e2d8] shadow-xs space-y-6 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#f0ebe1] gap-2">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f6eee3] text-[#b84a39] border border-[#e8dac8]">{selectedTableVerb.level}</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-[#5c524c] border border-[#e8e2d8]">{VERB_TYPE_LABELS[selectedTableVerb.type] || selectedTableVerb.type}</span>
                      </div>
                      <h2 className="text-3xl font-serif text-[#2c2623] capitalize">{selectedTableVerb.verb}</h2>
                      <p className="text-xs text-[#8c8075] italic">"{selectedTableVerb.english}"</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {TENSES.map((tense) => {
                      const conjs = conjugateVerb(selectedTableVerb, tense.id);
                      const sample = getSampleSentence(selectedTableVerb, tense.id, conjs);
                      return (
                        <div key={tense.id} className="bg-[#fbf9f5] p-5 rounded-2xl border border-[#e8e2d8]">
                          <div className="flex justify-between items-center mb-3 pb-1.5 border-b border-[#e8e2d8]">
                            <h5 className="font-bold text-sm text-[#b84a39]">{tense.name}</h5>
                            <span className="text-[10px] text-[#a09488] font-medium">{tense.mood}</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 font-serif text-sm mb-4">
                            {gridOrder.map(idx => (
                              <div key={idx} className="flex justify-between items-center bg-white p-1.5 px-2 rounded-lg border border-[#f0ebe1]">
                                <span className="text-[#8c8075] font-sans text-[10px] uppercase font-bold">{PRONOUNS[idx].label}</span>
                                <span className="text-[#2c2623]">{highlightConjugation(selectedTableVerb, conjs[idx], tense.id)}</span>
                              </div>
                            ))}
                          </div>

                          <div className="pt-3 border-t border-[#f0ebe1]">
                            <p className="text-xs text-[#2c2623] font-serif font-bold">"{sample.fr}"</p>
                            <p className="text-[11px] text-[#8c8075] italic mt-0.5">"{sample.en}"</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* FLASHCARDS VIEW */}
              {tablesViewMode === 'flashcards' && selectedTableVerb && (() => {
                const currentCardTense = TENSES[flashcardTenseIndex] || TENSES[0];
                const cardConjugations = conjugateVerb(selectedTableVerb, currentCardTense.id);
                const sample = getSampleSentence(selectedTableVerb, currentCardTense.id, cardConjugations);

                return (
                  <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
                    <div className="flex items-center justify-between px-2 text-xs font-bold text-[#8c8075]">
                      <span>Verbe: <strong className="text-[#2c2623]">{selectedTableVerb.verb}</strong></span>
                      <span>Temps {flashcardTenseIndex + 1} / {TENSES.length}: <strong className="text-[#b84a39]">{currentCardTense.name}</strong></span>
                    </div>

                    <div
                      onClick={() => setFlashcardFlipped(!flashcardFlipped)}
                      className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-[#e8e2d8] shadow-md min-h-[420px] flex flex-col justify-between cursor-pointer transition-all hover:border-[#b84a39] relative"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-2">
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#f6eee3] text-[#b84a39] border border-[#e8dac8]">{selectedTableVerb.level}</span>
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-[#5c524c] border border-[#e8e2d8]">{VERB_TYPE_LABELS[selectedTableVerb.type] || selectedTableVerb.type}</span>
                        </div>
                        <span className="text-xs font-sans text-[#a09488]">
                          {flashcardFlipped ? "Verso (Conjugaison)" : "Recto (Temps)"}
                        </span>
                      </div>

                      <div className="text-center my-auto py-4 w-full flex-1 flex items-center justify-center">
                        {!flashcardFlipped ? (
                          <div className="space-y-4">
                            <h2 className="text-5xl font-serif text-[#2c2623] capitalize">{selectedTableVerb.verb}</h2>
                            <p className="text-lg text-[#8c8075] font-sans italic">"{selectedTableVerb.english}"</p>
                            <div className="pt-6">
                              <span className="inline-block px-5 py-2.5 bg-[#b84a39] text-white text-sm font-bold rounded-xl shadow-2xs">
                                {currentCardTense.name} ({currentCardTense.mood})
                              </span>
                            </div>
                            <p className="text-[11px] text-[#a09488] font-sans pt-8">Cliquez pour voir la conjugaison complète</p>
                          </div>
                        ) : (
                          <div className="space-y-6 w-full">
                            <div className="border-b border-[#f0ebe1] pb-3 text-center">
                              <h3 className="text-xl font-serif text-[#2c2623] capitalize">
                                {selectedTableVerb.verb} <span className="mx-2 text-[#a09488] font-sans font-light">|</span> <span className="text-[#b84a39]">{currentCardTense.name}</span>
                              </h3>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-x-6 gap-y-3 font-serif text-base">
                              {gridOrder.map(idx => (
                                <div key={idx} className="flex justify-between items-center bg-[#fbf9f5] p-2.5 px-4 rounded-xl border border-[#e8e2d8]">
                                  <span className="text-[#8c8075] font-sans text-[11px] uppercase font-bold">{PRONOUNS[idx].label}</span>
                                  <span className="text-[#2c2623] font-medium text-lg">{highlightConjugation(selectedTableVerb, cardConjugations[idx], currentCardTense.id)}</span>
                                </div>
                              ))}
                            </div>

                            <div className="pt-4 text-xs italic text-center font-sans bg-[#fbf9f5] p-4 rounded-2xl border border-[#e8e2d8]">
                              <p className="font-serif font-bold text-[#2c2623] text-sm mb-1">"{sample.fr}"</p>
                              <p className="text-[#8c8075]">"{sample.en}"</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-center items-center gap-3 font-sans w-full">
                      <button
                        onClick={() => { setFlashcardTenseIndex(prev => prev > 0 ? prev - 1 : TENSES.length - 1); setFlashcardFlipped(false); }}
                        className="flex-1 py-3 bg-white border border-[#e8e2d8] rounded-2xl font-bold text-xs hover:bg-[#f6eee3] cursor-pointer"
                      >
                        ← Temps Précédent
                      </button>
                      <button
                        onClick={() => { setFlashcardTenseIndex(prev => prev < TENSES.length - 1 ? prev + 1 : 0); setFlashcardFlipped(false); }}
                        className="flex-1 py-3 bg-[#2c2623] text-white rounded-2xl font-bold text-xs hover:bg-[#1a1715] cursor-pointer"
                      >
                        Temps Suivant →
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 2: GUIDE GRAMMAIRE */}
          {activeTab === 'guide' && (
            <div className="space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e8e2d8] shadow-xs">
                <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-[#f0ebe1]">
                  <div className="p-3 bg-[#f6eee3] text-[#b84a39] rounded-2xl border border-[#e8dac8]">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-normal font-serif text-[#2c2623]">Guide de Grammaire</h2>
                    <p className="text-xs font-sans text-[#8c8075]">Morphological formulas and usage rules for all 11 tenses.</p>
                  </div>
                </div>

                <div className="space-y-6 font-sans">
                  {TENSES.map((tense) => (
                    <div key={tense.id} className="p-5 bg-[#fbf9f5] rounded-2xl border border-[#e8e2d8] space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-[#e8e2d8]">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-[#2c2623] text-sm">{tense.name}</h3>
                          <span className="px-2 py-0.5 bg-[#f6eee3] text-[#b84a39] rounded-full text-[10px] font-bold border border-[#e8dac8]">{tense.level}</span>
                        </div>
                        <span className="text-xs text-[#8c8075] font-medium">{tense.mood}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="text-[11px] font-bold uppercase text-[#8c8075] tracking-wider">Formation Formula</h4>
                          <div className="bg-white p-3 rounded-xl border border-[#e8e2d8] text-xs font-medium text-[#b84a39] font-mono leading-relaxed">
                            {tense.formation}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-[11px] font-bold uppercase text-[#8c8075] tracking-wider">When to Use</h4>
                          <ul className="text-xs text-[#5c524c] list-disc list-inside space-y-1">
                            {tense.note.split(', ').map((point, i) => (
                              <li key={i}>{point.charAt(0).toUpperCase() + point.slice(1)}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PRONONCIATION */}
          {activeTab === 'pronunciation' && (
            <div className="space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e8e2d8] shadow-xs">
                <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-[#f0ebe1]">
                  <div className="p-3 bg-[#f6eee3] text-[#b84a39] rounded-2xl border border-[#e8dac8]">
                    <Volume2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-normal font-serif text-[#2c2623]">Règles de Prononciation</h2>
                    <p className="text-xs font-sans text-[#8c8075]">Master the tricky rules of spoken French verbs.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans text-sm text-[#2c2623]">
                  <div className="p-5 bg-[#fbf9f5] rounded-2xl border border-[#e8e2d8] space-y-2">
                    <h3 className="font-bold text-[#b84a39]">1. The Silent "-ent"</h3>
                    <p className="text-xs text-[#5c524c] leading-relaxed">
                      In the 3rd person plural (ils/elles) of many tenses, the ending <strong>-ent</strong> is completely silent.
                    </p>
                    <p className="text-xs bg-white p-2 rounded-lg border font-mono">
                      Ils parlent → "parl"<br/>Elles mangent → "manj"
                    </p>
                  </div>
                  
                  <div className="p-5 bg-[#fbf9f5] rounded-2xl border border-[#e8e2d8] space-y-2">
                    <h3 className="font-bold text-[#b84a39]">2. The "-er" Infinitive</h3>
                    <p className="text-xs text-[#5c524c] leading-relaxed">
                      The ending of 1st group verbs (like <em>parler</em>) is pronounced exactly like the <em>-é</em> in <em>café</em>.
                    </p>
                    <p className="text-xs bg-white p-2 rounded-lg border font-mono">
                      Parler = Parlé<br/>Manger = Mangé
                    </p>
                  </div>

                  <div className="p-5 bg-[#fbf9f5] rounded-2xl border border-[#e8e2d8] space-y-2">
                    <h3 className="font-bold text-[#b84a39]">3. Final Consonants (CaReFuL)</h3>
                    <p className="text-xs text-[#5c524c] leading-relaxed">
                      Most final consonants are silent (like the <em>s</em> in <em>tu parles</em> or <em>d</em> in <em>il vend</em>). Consonants C, R, F, L are usually pronounced.
                    </p>
                    <p className="text-xs bg-white p-2 rounded-lg border font-mono">
                      Tu finis → "fini"<br/>Il prend → "pren"
                    </p>
                  </div>

                  <div className="p-5 bg-[#fbf9f5] rounded-2xl border border-[#e8e2d8] space-y-2">
                    <h3 className="font-bold text-[#b84a39]">4. La Liaison</h3>
                    <p className="text-xs text-[#5c524c] leading-relaxed">
                      When a pronoun ends in a consonant and the verb starts with a vowel, the consonant is pronounced, connecting the words.
                    </p>
                    <p className="text-xs bg-white p-2 rounded-lg border font-mono">
                      Nous avons → "Nou zavon"<br/>Ils aiment → "Il zaime"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EXERCICES */}
          {activeTab === 'practice' && currentQuestion && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-[#e8e2d8] shadow-2xs font-sans">
                <div className="text-xs font-semibold text-[#5c524c]">
                  Question <span className="text-[#b84a39] font-bold">{questionCount}</span>
                  {sessionLength !== Infinity && <span className="text-[#a09488]"> / {sessionLength}</span>}
                </div>
                <div className="flex items-center space-x-5 text-xs font-medium">
                  <div className="flex items-center space-x-1.5 text-[#2c2623]"><BarChart3 className="w-3.5 h-3.5 text-[#b84a39]" /><span>Score: {score}/{stats.totalAnswered}</span></div>
                  <div className="flex items-center space-x-1.5 text-[#2c2623]"><Sparkles className="w-3.5 h-3.5 text-amber-600" /><span>Série: {streak}</span></div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8e2d8] shadow-xs relative">
                <div className="flex items-start justify-between pb-4 border-b border-[#f0ebe1]">
                  <div>
                    <div className="flex items-center space-x-2 font-sans mb-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f6eee3] text-[#b84a39] uppercase border border-[#e8dac8]">{currentQuestion.verb.level}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white text-[#5c524c] uppercase border border-[#e8e2d8]">{VERB_TYPE_LABELS[currentQuestion.verb.type] || currentQuestion.verb.type}</span>
                    </div>
                    <h2 className="text-3xl font-normal text-[#2c2623] tracking-tight capitalize">{currentQuestion.verb.verb}</h2>
                    {showEnglish && <p className="text-xs font-sans text-[#8c8075] mt-0.5 italic">"{currentQuestion.verb.english}"</p>}
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-sans font-semibold text-[#b84a39] block">{currentQuestion.tense.name}</span>
                    <span className="text-[11px] font-sans text-[#a09488]">{currentQuestion.tense.mood}</span>
                  </div>
                </div>

                <div className="py-8 space-y-6">
                  {mode === 'single' && (
                    <div className="space-y-5 text-center">
                      <div className="flex flex-wrap items-center justify-center gap-3 font-sans">
                        <span className="bg-[#f6eee3] text-[#2c2623] px-4 py-2 rounded-xl border border-[#e8dac8] font-bold text-base uppercase tracking-wider">{currentQuestion.person.label}</span>
                        <input
                          type="text"
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                          placeholder="..."
                          disabled={feedback !== null}
                          className="w-56 sm:w-64 px-4 py-2 border-2 border-[#e8e2d8] focus:border-[#b84a39] focus:ring-0 rounded-xl outline-none transition-all text-center text-lg font-serif text-[#2c2623] bg-[#fbf9f5]"
                          autoFocus
                        />
                      </div>
                      {!feedback && (
                        <div className="flex flex-wrap justify-center gap-1.5 pt-1 font-sans">
                          {['é', 'è', 'ê', 'ë', 'à', 'â', 'ç', 'î', 'ï', 'ô', 'ù', 'û', 'œ'].map(char => (
                            <button key={char} onClick={() => addAccent(char)} className="w-8 h-8 bg-[#f6eee3] hover:bg-[#ede3d3] border border-[#e8dac8] text-[#2c2623] rounded-lg text-xs font-bold transition-colors active:scale-95 cursor-pointer">{char}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {mode === 'table' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 font-sans">
                      {gridOrder.map(idx => {
                        const pronoun = PRONOUNS[idx];
                        return (
                          <div key={pronoun.id} className="flex items-center space-x-2 bg-[#fbf9f5] p-2.5 rounded-xl border border-[#e8e2d8]">
                            <span className="w-24 text-[11px] uppercase tracking-wider font-bold text-[#5c524c]">{pronoun.label}</span>
                            <input
                              type="text"
                              value={tableInputs[idx]}
                              onChange={(e) => { const val = e.target.value; setTableInputs(prev => { const copy = [...prev]; copy[idx] = val; return copy; }); }}
                              disabled={feedback !== null || currentQuestion.fullConjugations[idx] === '-'}
                              placeholder={currentQuestion.fullConjugations[idx] === '-' ? 'N/A' : '...'}
                              className="w-full px-3 py-1.5 border border-[#e8e2d8] focus:border-[#b84a39] rounded-lg text-sm outline-none bg-white font-serif"
                            />
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {mode === 'choose' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-serif">
                      {currentQuestion.options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => checkAnswer(opt)}
                          disabled={feedback !== null}
                          className={`p-4 rounded-2xl text-center font-normal text-lg transition-all border cursor-pointer ${feedback ? opt === currentQuestion.correctAnswer ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold' : 'bg-[#fbf9f5] border-[#e8e2d8] text-[#a09488]' : 'bg-white hover:bg-[#f6eee3] border-[#e8e2d8] text-[#2c2623] active:scale-[0.99]'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {!feedback && (
                  <div className="flex justify-center mb-3 font-sans">
                    <button onClick={() => setShowHint(!showHint)} className="flex items-center space-x-1.5 text-xs text-[#8c8075] font-semibold hover:text-[#b84a39] transition-colors cursor-pointer">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600" /><span>{showHint ? "Cacher l'indice" : "Besoin d'un indice?"}</span>
                    </button>
                  </div>
                )}
                {showHint && !feedback && (
                  <div className="p-3 mb-4 bg-amber-50/80 rounded-xl border border-amber-200 text-xs font-sans text-amber-900 text-center animate-fadeIn">
                    La première lettre est: <strong className="text-base text-[#b84a39] font-serif">{currentQuestion.correctAnswer.charAt(0)}</strong>
                  </div>
                )}

                {!feedback ? (
                  <div className="flex justify-center pt-2 font-sans">
                    <button onClick={() => checkAnswer()} className="w-full sm:w-auto px-10 py-3 bg-[#b84a39] hover:bg-[#a03d2e] text-white font-bold text-sm rounded-2xl shadow-xs transition-all active:scale-95 cursor-pointer">
                      Vérifier
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 pt-2 font-sans animate-fadeIn">
                    <div className={`p-4 rounded-2xl border flex items-start space-x-3 ${feedback.isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-950'}`}>
                      {feedback.isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />}
                      <div>
                        <h4 className="font-bold text-sm">{feedback.isCorrect ? 'Excellente réponse!' : 'Pas tout à fait...'}</h4>
                        {!feedback.isCorrect && <p className="text-xs mt-1 font-serif">Réponse correcte: <span className="font-bold text-[#b84a39] underline">{feedback.answer}</span></p>}
                      </div>
                    </div>
                    <button onClick={handleNextQuestion} className="w-full py-3 bg-[#2c2623] hover:bg-[#1a1715] text-white font-bold text-sm rounded-2xl shadow-xs transition-all active:scale-95 cursor-pointer">
                      Question Suivante
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: PROGRESSION */}
          {activeTab === 'progress' && (
            <div className="space-y-6 font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-[#e8e2d8] text-center shadow-2xs">
                  <div className="w-10 h-10 bg-[#f6eee3] rounded-2xl flex items-center justify-center mx-auto mb-2 text-[#b84a39]"><BarChart3 className="w-5 h-5" /></div>
                  <div className="text-2xl font-serif text-[#2c2623]">{stats.totalAnswered ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100) : 0}%</div>
                  <div className="text-xs text-[#8c8075] font-semibold mt-1">Précision</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-[#e8e2d8] text-center shadow-2xs">
                  <div className="w-10 h-10 bg-[#f6eee3] rounded-2xl flex items-center justify-center mx-auto mb-2 text-amber-600"><Sparkles className="w-5 h-5" /></div>
                  <div className="text-2xl font-serif text-[#2c2623]">{bestStreak}</div>
                  <div className="text-xs text-[#8c8075] font-semibold mt-1">Meilleure Série</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-[#e8e2d8] text-center shadow-2xs">
                  <div className="w-10 h-10 bg-[#f6eee3] rounded-2xl flex items-center justify-center mx-auto mb-2 text-[#2c2623]"><BookOpen className="w-5 h-5" /></div>
                  <div className="text-2xl font-serif text-[#2c2623]">{stats.totalAnswered}</div>
                  <div className="text-xs text-[#8c8075] font-semibold mt-1">Questions Complétées</div>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-[#e8e2d8] shadow-2xs space-y-4">
                <h3 className="font-serif text-lg text-[#2c2623]">Performance par Temps</h3>
                <div className="space-y-3">
                  {TENSES.map((t) => {
                    const tStat = stats.tenseStats[t.id] || { answered: 0, correct: 0 };
                    const pct = tStat.answered ? Math.round((tStat.correct / tStat.answered) * 100) : 0;
                    return (
                      <div key={t.id} className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-[#2c2623]">{t.name} ({t.mood})</span>
                          <span className="text-[#b84a39] font-bold">{pct}% ({tStat.correct}/{tStat.answered})</span>
                        </div>
                        <div className="w-full bg-[#f6eee3] h-2 rounded-full overflow-hidden"><div className="bg-[#b84a39] h-full transition-all duration-500 rounded-full" style={{ width: `${pct}%` }}></div></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR (Only visible on Exercices tab) */}
        {activeTab === 'practice' && (
          <div className="w-full lg:w-80 shrink-0 font-sans space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#e8e2d8] shadow-xs space-y-6">
              <div className="flex items-center space-x-2 border-b border-[#f0ebe1] pb-3">
                <Settings className="w-5 h-5 text-[#b84a39]" />
                <h3 className="font-serif text-lg text-[#2c2623]">Réglages</h3>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#a09488]">Mode d'Exercice</label>
                <div className="flex flex-col gap-2">
                  {[{ id: 'single', label: 'Une Personne' }, { id: 'table', label: 'Table Complete' }, { id: 'choose', label: 'Choix Multiple' }].map((m) => (
                    <button key={m.id} onClick={() => setMode(m.id)} className={`p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer text-left ${mode === m.id ? 'bg-[#b84a39] border-[#b84a39] text-white shadow-xs' : 'bg-[#fbf9f5] border-[#e8e2d8] text-[#5c524c] hover:bg-[#f6eee3]'}`}>{m.label}</button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#a09488]">Groupe de Verbes</label>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full p-2.5 bg-[#fbf9f5] border border-[#e8e2d8] rounded-xl text-xs font-semibold text-[#2c2623] outline-none focus:border-[#b84a39] cursor-pointer">
                  {VERB_CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#a09488]">Temps Actifs</label>
                  <button onClick={() => setSelectedTenses(TENSES.map(t => t.id))} className="text-[10px] text-[#b84a39] hover:underline font-bold cursor-pointer">Tout</button>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-2 bg-[#fbf9f5] rounded-xl border border-[#e8e2d8]">
                  {TENSES.map(t => {
                    const active = selectedTenses.includes(t.id);
                    return (
                      <button key={t.id} onClick={() => toggleTense(t.id)} className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${active ? 'bg-[#b84a39] border-[#b84a39] text-white' : 'bg-white border-[#e8e2d8] text-[#5c524c] hover:bg-[#f6eee3]'}`}>
                        {t.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-[#f0ebe1]">
                <label className="flex items-center justify-between text-xs font-semibold text-[#5c524c] cursor-pointer">
                  <span>Accents Stricts</span>
                  <input type="checkbox" checked={strictAccents} onChange={(e) => setStrictAccents(e.target.checked)} className="w-4 h-4 accent-[#b84a39] rounded" />
                </label>
                <label className="flex items-center justify-between text-xs font-semibold text-[#5c524c] cursor-pointer">
                  <span>Afficher l'Anglais</span>
                  <input type="checkbox" checked={showEnglish} onChange={(e) => setShowEnglish(e.target.checked)} className="w-4 h-4 accent-[#b84a39] rounded" />
                </label>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}