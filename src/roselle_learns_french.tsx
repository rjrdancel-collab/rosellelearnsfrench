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
  RotateCw,
  LayoutGrid,
  CreditCard
} from 'lucide-react';

const VERB_CATEGORIES = [
  { id: 'most_common', label: 'Most Common (50)' },
  { id: 'all', label: 'All Verbs (500 Moreau)' },
  { id: 'prepositions', label: 'Prepositional Verbs (à / de)' },
  { id: 'er', label: 'Regular -er' },
  { id: 'ir', label: 'Regular -ir' },
  { id: 're', label: 'Regular -re / 3rd Group' },
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

const PRONOUNS = [
  { id: 'je', label: 'je / j\'' },
  { id: 'tu', label: 'tu' },
  { id: 'il', label: 'il / elle / on' },
  { id: 'nous', label: 'nous' },
  { id: 'vous', label: 'vous' },
  { id: 'ils', label: 'ils / elles' }
];

const MOREAU_VERBS = [
  { verb: 'être', english: 'to be', cat: ['most_common', 'irregular', 'etre_verbs'], type: 'irregular', level: 'A1-A2' },
  { verb: 'avoir', english: 'to have', cat: ['most_common', 'irregular'], type: 'irregular', level: 'A1-A2' },
  { verb: 'aller', english: 'to go', cat: ['most_common', 'irregular', 'etre_verbs'], type: 'irregular', level: 'A1-A2' },
  { verb: 'faire', english: 'to do / to make', cat: ['most_common', 'irregular'], type: 'irregular', level: 'A1-A2' },
  { verb: 'dire', english: 'to say / tell', cat: ['most_common', 'irregular'], type: 'irregular', level: 'A1-A2' },
  { verb: 'pouvoir', english: 'can / to be able to', cat: ['most_common', 'irregular'], type: 'irregular', level: 'A1-A2' },
  { verb: 'vouloir', english: 'to want', cat: ['most_common', 'irregular'], type: 'irregular', level: 'A1-A2' },
  { verb: 'savoir', english: 'to know', cat: ['most_common', 'irregular'], type: 'irregular', level: 'A1-A2' },
  { verb: 'voir', english: 'to see', cat: ['most_common', 'irregular'], type: 'irregular', level: 'A1-A2' },
  { verb: 'venir', english: 'to come', cat: ['most_common', 'irregular', 'etre_verbs'], type: 'irregular', level: 'A1-A2' },
  { verb: 'prendre', english: 'to take', cat: ['most_common', 'irregular'], type: 'irregular', level: 'A1-A2' },
  { verb: 'donner', english: 'to give', cat: ['most_common', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 'parler', english: 'to speak / talk', cat: ['most_common', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 'aimer', english: 'to like / love', cat: ['most_common', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 'penser', english: 'to think', cat: ['most_common', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 'trouver', english: 'to find', cat: ['most_common', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 'laisser', english: 'to leave', cat: ['most_common', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 'arriver', english: 'to arrive', cat: ['most_common', 'er', 'etre_verbs'], type: 'er', level: 'A1-A2' },
  { verb: 'croire', english: 'to believe', cat: ['most_common', 'irregular'], type: 'irregular', level: 'B1-B2' },
  { verb: 'demander', english: 'to ask', cat: ['most_common', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 'passer', english: 'to pass / spend time', cat: ['most_common', 'er', 'etre_verbs'], type: 'er', level: 'A1-A2' },
  { verb: 'devoir', english: 'to have to / must', cat: ['most_common', 'irregular'], type: 'irregular', level: 'A1-A2' },
  { verb: 'mettre', english: 'to put', cat: ['most_common', 'irregular'], type: 'irregular', level: 'A1-A2' },
  { verb: 'rester', english: 'to stay', cat: ['most_common', 'er', 'etre_verbs'], type: 'er', level: 'A1-A2' },
  { verb: 'regarder', english: 'to watch / look at', cat: ['most_common', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 'connaître', english: 'to know (person/place)', cat: ['most_common', 'irregular'], type: 'irregular', level: 'A1-A2' },
  { verb: 'sentir', english: 'to feel / smell', cat: ['most_common', 'irregular'], type: 'irregular', level: 'B1-B2' },
  { verb: 'servir', english: 'to serve', cat: ['most_common', 'irregular'], type: 'irregular', level: 'B1-B2' },
  { verb: 'sortir', english: 'to go out', cat: ['most_common', 'irregular', 'etre_verbs'], type: 'irregular', level: 'A1-A2' },
  { verb: 'partir', english: 'to leave', cat: ['most_common', 'irregular', 'etre_verbs'], type: 'irregular', level: 'A1-A2' },
  { verb: 'comprendre', english: 'to understand', cat: ['most_common', 'irregular'], type: 'irregular', level: 'A1-A2' },
  { verb: 'attendre', english: 'to wait for', cat: ['most_common', 're'], type: 're', level: 'A1-A2' },
  { verb: 'répondre', english: 'to answer', cat: ['most_common', 're'], type: 're', level: 'A1-A2' },
  { verb: 'entendre', english: 'to hear', cat: ['most_common', 're'], type: 're', level: 'A1-A2' },
  { verb: 'perdre', english: 'to lose', cat: ['most_common', 're'], type: 're', level: 'A1-A2' },
  { verb: 'rendre', english: 'to return / give back', cat: ['most_common', 're'], type: 're', level: 'A1-A2' },
  { verb: 'finir', english: 'to finish', cat: ['most_common', 'ir'], type: 'ir', level: 'A1-A2' },
  { verb: 'choisir', english: 'to choose', cat: ['most_common', 'ir'], type: 'ir', level: 'A1-A2' },
  { verb: 'réfléchir', english: 'to think / reflect', cat: ['most_common', 'ir'], type: 'ir', level: 'A1-A2' },
  { verb: 'réussir', english: 'to succeed', cat: ['most_common', 'ir'], type: 'ir', level: 'A1-A2' },
  { verb: 'grandir', english: 'to grow up', cat: ['most_common', 'ir'], type: 'ir', level: 'A1-A2' },
  { verb: 'obéir', english: 'to obey', cat: ['most_common', 'ir'], type: 'ir', level: 'A1-A2' },
  { verb: 'dormir', english: 'to sleep', cat: ['most_common', 'irregular'], type: 'irregular', level: 'A1-A2' },
  { verb: 'vivre', english: 'to live', cat: ['most_common', 'irregular'], type: 'irregular', level: 'B1-B2' },
  { verb: 'suivre', english: 'to follow', cat: ['most_common', 'irregular'], type: 'irregular', level: 'B1-B2' },
  { verb: 'écrire', english: 'to write', cat: ['most_common', 'irregular'], type: 'irregular', level: 'A1-A2' },
  { verb: 'lire', english: 'to read', cat: ['most_common', 'irregular'], type: 'irregular', level: 'A1-A2' },
  { verb: 'ouvrir', english: 'to open', cat: ['most_common', 'irregular'], type: 'irregular', level: 'A1-A2' },
  { verb: 'offrir', english: 'to offer', cat: ['most_common', 'irregular'], type: 'irregular', level: 'A1-A2' },

  // Prepositional Verbs (à / de)
  { verb: 'penser à', english: 'to think about / of', cat: ['all', 'prepositions', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 'réfléchir à', english: 'to reflect on / consider', cat: ['all', 'prepositions', 'ir'], type: 'ir', level: 'B1-B2' },
  { verb: 'commencer à', english: 'to begin / start to', cat: ['all', 'prepositions', 'stem'], type: 'stem', level: 'A1-A2' },
  { verb: 'aider à', english: 'to help to', cat: ['all', 'prepositions', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 'apprendre à', english: 'to learn to', cat: ['all', 'prepositions', 'irregular'], type: 'irregular', level: 'A1-A2' },
  { verb: 'arriver à', english: 'to manage to / succeed in', cat: ['all', 'prepositions', 'er', 'etre_verbs'], type: 'er', level: 'B1-B2' },
  { verb: 'continuer à', english: 'to continue to', cat: ['all', 'prepositions', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 'hésiter à', english: 'to hesitate to', cat: ['all', 'prepositions', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 'réussir à', english: 'to succeed in', cat: ['all', 'prepositions', 'ir'], type: 'ir', level: 'B1-B2' },
  { verb: 'servir à', english: 'to be used for', cat: ['all', 'prepositions', 'irregular'], type: 'irregular', level: 'B1-B2' },
  { verb: 'parler à', english: 'to speak to / talk to', cat: ['all', 'prepositions', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 'dire à', english: 'to tell / say to', cat: ['all', 'prepositions', 'irregular'], type: 'irregular', level: 'A1-A2' },
  { verb: 'demander à', english: 'to ask (someone)', cat: ['all', 'prepositions', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 'discuter à', english: 'to chat / discuss with', cat: ['all', 'prepositions', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 'donner à', english: 'to give to', cat: ['all', 'prepositions', 'er'], type: 'er', level: 'A1-A2' },

  // Additional Moreau Verbs
  { verb: 'accepter', english: 'to accept', cat: ['all', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 'acheter', english: 'to buy', cat: ['all', 'stem'], type: 'stem', level: 'A1-A2' },
  { verb: 'agir', english: 'to act', cat: ['all', 'ir'], type: 'ir', level: 'A1-A2' },
  { verb: 'ajouter', english: 'to add', cat: ['all', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 'amuser', english: 'to amuse', cat: ['all', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 'annoncer', english: 'to announce', cat: ['all', 'stem'], type: 'stem', level: 'A1-A2' },
  { verb: 'appeler', english: 'to call', cat: ['all', 'stem'], type: 'stem', level: 'A1-A2' },
  { verb: 'apporter', english: 'to bring', cat: ['all', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 'arrêter', english: 'to stop', cat: ['all', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 's\'asseoir', english: 'to sit down', cat: ['all', 'pronominal', 'irregular'], type: 'pronominal', level: 'A1-A2' },
  { verb: 'boire', english: 'to drink', cat: ['all', 'irregular'], type: 'irregular', level: 'A1-A2' },
  { verb: 'changer', english: 'to change', cat: ['all', 'stem'], type: 'stem', level: 'A1-A2' },
  { verb: 'chanter', english: 'to sing', cat: ['all', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 'chercher', english: 'to look for', cat: ['all', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 'conduire', english: 'to drive', cat: ['all', 'irregular'], type: 'irregular', level: 'A1-A2' },
  { verb: 'construire', english: 'to build', cat: ['all', 'irregular'], type: 'irregular', level: 'B1-B2' },
  { verb: 'courir', english: 'to run', cat: ['all', 'irregular'], type: 'irregular', level: 'A1-A2' },
  { verb: 'coûter', english: 'to cost', cat: ['all', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 'décider', english: 'to decide', cat: ['all', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 'descendre', english: 'to go down', cat: ['all', 're', 'etre_verbs'], type: 're', level: 'A1-A2' },
  { verb: 'détester', english: 'to hate', cat: ['all', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 'devenir', english: 'to become', cat: ['all', 'irregular', 'etre_verbs'], type: 'irregular', level: 'B1-B2' },
  { verb: 'écouter', english: 'to listen', cat: ['all', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 'espérer', english: 'to hope', cat: ['all', 'stem'], type: 'stem', level: 'A1-A2' },
  { verb: 'essayer', english: 'to try', cat: ['all', 'stem'], type: 'stem', level: 'A1-A2' },
  { verb: 'fermer', english: 'to close', cat: ['all', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 'gagner', english: 'to win / earn', cat: ['all', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 'habiter', english: 'to live', cat: ['all', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 'jouer', english: 'to play', cat: ['all', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 'manger', english: 'to eat', cat: ['all', 'stem'], type: 'stem', level: 'A1-A2' },
  { verb: 'monter', english: 'to go up', cat: ['all', 'er', 'etre_verbs'], type: 'er', level: 'A1-A2' },
  { verb: 'mourir', english: 'to die', cat: ['all', 'irregular', 'etre_verbs'], type: 'irregular', level: 'B1-B2' },
  { verb: 'naître', english: 'to be born', cat: ['all', 'irregular', 'etre_verbs'], type: 'irregular', level: 'B1-B2' },
  { verb: 'oublier', english: 'to forget', cat: ['all', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 'payer', english: 'to pay', cat: ['all', 'stem'], type: 'stem', level: 'A1-A2' },
  { verb: 'peindre', english: 'to paint', cat: ['all', 'irregular'], type: 'irregular', level: 'B1-B2' },
  { verb: 'porter', english: 'to wear / carry', cat: ['all', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 'préférer', english: 'to prefer', cat: ['all', 'stem'], type: 'stem', level: 'A1-A2' },
  { verb: 'préparer', english: 'to prepare', cat: ['all', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 'promettre', english: 'to promise', cat: ['all', 'irregular'], type: 'irregular', level: 'B1-B2' },
  { verb: 'recevoir', english: 'to receive', cat: ['all', 'irregular'], type: 'irregular', level: 'A1-A2' },
  { verb: 'revenir', english: 'to come back', cat: ['all', 'irregular', 'etre_verbs'], type: 'irregular', level: 'A1-A2' },
  { verb: 'rire', english: 'to laugh', cat: ['all', 'irregular'], type: 'irregular', level: 'A1-A2' },
  { verb: 'tomber', english: 'to fall', cat: ['all', 'er', 'etre_verbs'], type: 'er', level: 'A1-A2' },
  { verb: 'vendre', english: 'to sell', cat: ['all', 're'], type: 're', level: 'A1-A2' },
  { verb: 'visiter', english: 'to visit', cat: ['all', 'er'], type: 'er', level: 'A1-A2' },
  { verb: 'voyager', english: 'to travel', cat: ['all', 'stem'], type: 'stem', level: 'A1-A2' }
];

const TENSES = [
  { 
    id: 'present', 
    name: 'Présent', 
    mood: 'Indicatif', 
    level: 'A1-A2',
    summary: 'Expresses current actions, general truths, and ongoing habits.',
    uses: [
      'Current actions happening right now',
      'Habitual routines and recurring events',
      'General truths and permanent facts'
    ],
    endingsChart: [
      { group: '-er verbs', je: '-e', tu: '-es', il: '-e', nous: '-ons', vous: '-ez', ils: '-ent' },
      { group: '-ir verbs (2nd)', je: '-is', tu: '-is', il: '-it', nous: '-issons', vous: '-issez', ils: '-issent' },
      { group: '-re verbs (3rd)', je: '-s', tu: '-s', il: '—', nous: '-ons', vous: '-ez', ils: '-ent' }
    ],
    sampleFr: 'Je parle français tous les jours avec mes collègues.',
    sampleEn: 'I speak French every day with my colleagues.'
  },
  { 
    id: 'passe_compose', 
    name: 'Passé composé', 
    mood: 'Indicatif', 
    level: 'A1-A2',
    summary: 'Completed past actions with specific boundaries or consequences.',
    uses: [
      'Actions completed at a definite moment in the past',
      'A sequence of finished events in a narrative'
    ],
    endingsChart: [
      { group: 'Auxiliary (avoir/être)', je: 'ai / suis', tu: 'as / es', il: 'a / est', nous: 'avons / sommes', vous: 'avez / êtes', ils: 'ont / sont' },
      { group: '+ Past Participle', je: '-é / -i / -u', tu: '-é / -i / -u', il: '-é / -i / -u', nous: '-é / -i / -u', vous: '-é / -i / -u', ils: '-é / -i / -u' }
    ],
    sampleFr: 'Hier, nous avons visité un musée magnifique à Paris.',
    sampleEn: 'Yesterday, we visited a magnificent museum in Paris.'
  },
  { 
    id: 'imparfait', 
    name: 'Imparfait', 
    mood: 'Indicatif', 
    level: 'A1-A2',
    summary: 'Ongoing background descriptions and past habits.',
    uses: [
      'Describing past weather, physical states, or emotions',
      'Repeated or habitual past actions ("used to do")'
    ],
    endingsChart: [
      { group: 'Stem: Nous form minus -ons', je: '-ais', tu: '-ais', il: '-ait', nous: '-ions', vous: '-iez', ils: '-aient' }
    ],
    sampleFr: 'Quand j’étais enfant, je lisais des livres chaque soir.',
    sampleEn: 'When I was a child, I used to read books every evening.'
  },
  { 
    id: 'plus_que_parfait', 
    name: 'Plus-que-parfait', 
    mood: 'Indicatif', 
    level: 'B1-B2',
    summary: 'An action completed before another past action.',
    uses: [
      'An action that occurred further in the past than another past event'
    ],
    endingsChart: [
      { group: 'Auxiliary (Imparfait: avais/étais)', je: 'avais / étais', tu: 'avais / étais', il: 'avait / était', nous: 'avions / étions', vous: 'aviez / étiez', ils: 'avaient / étaient' },
      { group: '+ Past Participle', je: 'participes', tu: 'participes', il: 'participes', nous: 'participes', vous: 'participes', ils: 'participes' }
    ],
    sampleFr: 'J’avais déjà mangé quand tu es arrivé à la maison.',
    sampleEn: 'I had already eaten when you arrived at the house.'
  },
  { 
    id: 'futur_simple', 
    name: 'Futur simple', 
    mood: 'Indicatif', 
    level: 'A1-A2',
    summary: 'Future events, promises, and predictions.',
    uses: [
      'Upcoming events and plans',
      'Predictions about what will happen'
    ],
    endingsChart: [
      { group: 'Infinitive Stem + Endings', je: '-ai', tu: '-as', il: '-a', nous: '-ons', vous: '-ez', ils: '-ont' }
    ],
    sampleFr: 'Demain, nous partirons en voyage pour le Canada.',
    sampleEn: 'Tomorrow, we will leave on a trip to Canada.'
  },
  { 
    id: 'futur_anterieur', 
    name: 'Futur antérieur', 
    mood: 'Indicatif', 
    level: 'B1-B2',
    summary: 'Action completed prior to a future point in time.',
    uses: [
      'Expressing an action that will be completed before another future action'
    ],
    endingsChart: [
      { group: 'Auxiliary (Futur simple: aurai/serai)', je: 'aurai / serai', tu: 'auras / seras', il: 'aura / sera', nous: 'aurons / serons', vous: 'aurez / serez', ils: 'auront / seront' },
      { group: '+ Past Participle', je: 'participes', tu: 'participes', il: 'participes', nous: 'participes', vous: 'participes', ils: 'participes' }
    ],
    sampleFr: 'Quand tu arriveras, j’aurai fini mon travail.',
    sampleEn: 'When you arrive, I will have finished my work.'
  },
  { 
    id: 'passe_simple', 
    name: 'Passé simple', 
    mood: 'Indicatif', 
    level: 'C1-C2',
    summary: 'Literary historical past tense.',
    uses: [
      'Historical narratives and literature (written past)'
    ],
    endingsChart: [
      { group: '-er verbs', je: '-ai', tu: '-as', il: '-a', nous: '-âmes', vous: '-âtes', ils: '-èrent' },
      { group: '-ir / -re verbs', je: '-is', tu: '-is', il: '-it', nous: '-îmes', vous: '-îtes', ils: '-irent' }
    ],
    sampleFr: 'Il entra dans la pièce et ferma la porte.',
    sampleEn: 'He entered the room and closed the door.'
  },
  { 
    id: 'cond_present', 
    name: 'Conditionnel présent', 
    mood: 'Conditionnel', 
    level: 'B1-B2',
    summary: 'Hypothetical situations and polite requests.',
    uses: [
      'Polite desires and requests (*je voudrais*)',
      'Hypothetical outcomes in conditional clauses'
    ],
    endingsChart: [
      { group: 'Future Stem + Imparfait Endings', je: '-ais', tu: '-ais', il: '-ait', nous: '-ions', vous: '-iez', ils: '-aient' }
    ],
    sampleFr: 'Si j’avais le temps, je voyagerais autour du monde.',
    sampleEn: 'If I had time, I would travel around the world.'
  },
  { 
    id: 'cond_passe', 
    name: 'Conditionnel passé', 
    mood: 'Conditionnel', 
    level: 'B1-B2',
    summary: 'Past regrets and unfulfilled counterfactuals.',
    uses: [
      'Expressing regret about something that didn’t happen in the past'
    ],
    endingsChart: [
      { group: 'Auxiliary (Conditionnel: aurais/serais)', je: 'aurais / serais', tu: 'aurais / serais', il: 'aurait / serait', nous: 'aurions / serions', vous: 'auriez / seriez', ils: 'auraient / seraient' },
      { group: '+ Past Participle', je: 'participes', tu: 'participes', il: 'participes', nous: 'participes', vous: 'participes', ils: 'participes' }
    ],
    sampleFr: 'J’aurais aimé venir à votre fête hier.',
    sampleEn: 'I would have liked to come to your party yesterday.'
  },
  { 
    id: 'subj_present', 
    name: 'Subjonctif présent', 
    mood: 'Subjonctif', 
    level: 'B1-B2',
    summary: 'Subjective attitudes, doubts, and necessity.',
    uses: [
      'Expressing necessity (*il faut que*)',
      'Doubt, uncertainty, and emotional reactions'
    ],
    endingsChart: [
      { group: 'Ils stem minus -ent + Endings', je: '-e', tu: '-es', il: '-e', nous: '-ions', vous: '-iez', ils: '-ent' }
    ],
    sampleFr: 'Il est important que tu étudies pour ton examen.',
    sampleEn: 'It is important that you study for your exam.'
  },
  { 
    id: 'subj_passe', 
    name: 'Subjonctif passé', 
    mood: 'Subjonctif', 
    level: 'C1-C2',
    summary: 'Past subjective emotions or doubts.',
    uses: [
      'Doubt or emotion regarding a completed past action'
    ],
    endingsChart: [
      { group: 'Auxiliary (Subjonctif: aie/sois)', je: 'aie / sois', tu: 'aies / sois', il: 'ait / soit', nous: 'ayons / soyons', vous: 'ayez / soyez', ils: 'aient / soient' },
      { group: '+ Past Participle', je: 'participes', tu: 'participes', il: 'participes', nous: 'participes', vous: 'participes', ils: 'participes' }
    ],
    sampleFr: 'Je suis heureux qu’il ait réussi son examen.',
    sampleEn: 'I am happy that he passed his exam.'
  },
  { 
    id: 'imperatif', 
    name: 'Impératif présent', 
    mood: 'Impératif', 
    level: 'A1-A2',
    summary: 'Direct commands and suggestions.',
    uses: [
      'Giving instructions or direct orders (tu, nous, vous)'
    ],
    endingsChart: [
      { group: 'Present form (no subject pronoun)', je: '—', tu: 'Base form', il: '—', nous: 'Base form', vous: 'Base form', ils: '—' }
    ],
    sampleFr: 'Écoute bien la consigne et commence ton exercice!',
    sampleEn: 'Listen carefully to the instruction and start your exercise!'
  }
];

const SENTENCE_TEMPLATES = [
  { sentence: "Chaque jour, je {blank} à ce projet important.", verb: "penser à", tense: "present", personIdx: 0, english: "Every day, I think about this important project." },
  { sentence: "Tu {blank} toujours aux mêmes questions.", verb: "réfléchir à", tense: "present", personIdx: 1, english: "You always think about the same questions." },
  { sentence: "Nous {blank} à apprendre le français.", verb: "commencer à", tense: "present", personIdx: 3, english: "We are beginning to learn French." },
  { sentence: "Elle {blank} à son examen final hier.", verb: "réussir à", tense: "passe_compose", personIdx: 2, english: "She succeeded in her final exam yesterday." },
  { sentence: "Demain, ils {blank} à parler couramment.", verb: "arriver à", tense: "futur_simple", personIdx: 5, english: "Tomorrow, they will manage to speak fluently." },
  { sentence: "Aujourd'hui, je {blank} la vérité.", verb: "dire", tense: "present", personIdx: 0, english: "Today, I am telling the truth." },
  { sentence: "Chaque matin, tu {blank} un bon café chaud.", verb: "prendre", tense: "present", personIdx: 1, english: "Every morning, you have a nice hot coffee." },
  { sentence: "Nous {blank} au parc chaque dimanche.", verb: "aller", tense: "present", personIdx: 3, english: "We go to the park every Sunday." }
];

const conjugateVerb = (verbObj, tenseId) => {
  const rawVerb = verbObj.verb.toLowerCase().trim();
  const isPronominal = rawVerb.startsWith('se ') || rawVerb.startsWith('s\'');
  let cleanVerb = rawVerb.replace(/^se\s+|^s\'/, '');
  
  let prep = '';
  if (cleanVerb.includes(' à')) {
    const parts = cleanVerb.split(' à');
    cleanVerb = parts[0].trim();
    prep = ' à';
  } else if (cleanVerb.includes(' de')) {
    const parts = cleanVerb.split(' de');
    cleanVerb = parts[0].trim();
    prep = ' de';
  }

  const irregulars = {
    'être': {
      present: ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'],
      passe_compose: ['ai été', 'as été', 'a été', 'avons été', 'avez été', 'ont été'],
      imparfait: ['étais', 'étais', 'était', 'étions', 'étiez', 'étaient'],
      plus_que_parfait: ['avais été', 'avais été', 'avait été', 'avions été', 'aviez été', 'avaient été'],
      futur_simple: ['serai', 'seras', 'sera', 'serons', 'serez', 'seront'],
      futur_anterieur: ['aurai été', 'auras été', 'aura été', 'aurons été', 'aurez été', 'auront été'],
      passe_simple: ['fus', 'fus', 'fut', 'fûmes', 'fûtes', 'furent'],
      cond_present: ['serais', 'serais', 'serait', 'serions', 'seriez', 'seraient'],
      cond_passe: ['aurais été', 'aurais été', 'aurait été', 'aurions été', 'auriez été', 'auraient été'],
      subj_present: ['sois', 'sois', 'soit', 'soyons', 'soyez', 'soient'],
      subj_passe: ['aie été', 'aies été', 'ait été', 'ayons été', 'ayez été', 'aient été'],
      imperatif: ['sois', '-', '-', 'soyons', 'soyez', '-']
    },
    'avoir': {
      present: ['ai', 'as', 'a', 'avons', 'avez', 'ont'],
      passe_compose: ['ai eu', 'as eu', 'a eu', 'avons eu', 'avez eu', 'ont eu'],
      imparfait: ['avais', 'avais', 'avait', 'avions', 'aviez', 'avaient'],
      plus_que_parfait: ['avais eu', 'avais eu', 'avait eu', 'avions eu', 'aviez eu', 'avaient eu'],
      futur_simple: ['aurai', 'auras', 'aura', 'aurons', 'aurez', 'auront'],
      futur_anterieur: ['aurai eu', 'auras eu', 'aura eu', 'aurons eu', 'aurez eu', 'auront eu'],
      passe_simple: ['eus', 'eus', 'eut', 'eûmes', 'eûtes', 'eurent'],
      cond_present: ['aurais', 'aurais', 'aurait', 'aurions', 'auriez', 'auraient'],
      cond_passe: ['aurais eu', 'aurais eu', 'aurait eu', 'aurions eu', 'auriez eu', 'auraient eu'],
      subj_present: ['aie', 'aies', 'ait', 'ayons', 'ayez', 'aient'],
      subj_passe: ['aie eu', 'aies eu', 'ait eu', 'ayons eu', 'ayez eu', 'aient eu'],
      imperatif: ['aie', '-', '-', 'ayons', 'ayez', '-']
    },
    'aller': {
      present: ['vais', 'vas', 'va', 'allons', 'allez', 'vont'],
      passe_compose: ['suis allé(e)', 'es allé(e)', 'est allé(e)', 'sommes allé(e)s', 'êtes allé(e)s', 'sont allé(e)s'],
      imparfait: ['allais', 'allais', 'allait', 'allions', 'alliez', 'allaient'],
      plus_que_parfait: ['étais allé(e)', 'étais allé(e)', 'était allé(e)', 'étions allé(e)s', 'étiez allé(e)s', 'étaient allé(e)s'],
      futur_simple: ['irai', 'iras', 'ira', 'irons', 'irez', 'iront'],
      futur_anterieur: ['serai allé(e)', 'seras allé(e)', 'sera allé(e)', 'serons allé(e)s', 'serez allé(e)s', 'seront allé(e)s'],
      passe_simple: ['allai', 'allas', 'alla', 'allâmes', 'allâtes', 'allèrent'],
      cond_present: ['irais', 'irais', 'irait', 'irions', 'iriez', 'iraient'],
      cond_passe: ['serais allé(e)', 'serais allé(e)', 'serait allé(e)', 'serions allé(e)s', 'seriez allé(e)s', 'seraient allé(e)s'],
      subj_present: ['aille', 'ailles', 'aille', 'allions', 'alliez', 'aillent'],
      subj_passe: ['sois allé(e)', 'sois allé(e)', 'soit allé(e)', 'soyons allé(e)s', 'soyez allé(e)s', 'soient allé(e)s'],
      imperatif: ['va', '-', '-', 'allons', 'allez', '-']
    },
    'faire': {
      present: ['fais', 'fais', 'fait', 'faisons', 'faites', 'font'],
      passe_compose: ['ai fait', 'as fait', 'a fait', 'avons fait', 'avez fait', 'ont fait'],
      imparfait: ['faisais', 'faisais', 'faisait', 'faisions', 'faisiez', 'faisaient'],
      plus_que_parfait: ['avais fait', 'avais fait', 'avait fait', 'avions fait', 'aviez fait', 'avaient fait'],
      futur_simple: ['ferai', 'feras', 'fera', 'ferons', 'ferez', 'feront'],
      futur_anterieur: ['aurai fait', 'auras fait', 'aura fait', 'aurons fait', 'aurez fait', 'auront fait'],
      passe_simple: ['fis', 'fis', 'fit', 'fîmes', 'fîtes', 'firent'],
      cond_present: ['ferais', 'ferais', 'ferait', 'ferions', 'feriez', 'feraient'],
      cond_passe: ['aurais fait', 'aurais fait', 'aurait fait', 'aurions fait', 'auriez fait', 'auraient fait'],
      subj_present: ['fasse', 'fasses', 'fasse', 'fassions', 'fassiez', 'fassent'],
      subj_passe: ['aie fait', 'aies fait', 'ait fait', 'ayons fait', 'ayez fait', 'aient fait'],
      imperatif: ['fais', '-', '-', 'faisons', 'faites', '-']
    }
  };

  if (irregulars[cleanVerb] && irregulars[cleanVerb][tenseId]) {
    return irregulars[cleanVerb][tenseId].map(f => f + prep);
  }

  let stem = cleanVerb;
  let ending = 'er';
  if (cleanVerb.endsWith('er')) {
    stem = cleanVerb.slice(0, -2);
    ending = 'er';
  } else if (cleanVerb.endsWith('ir')) {
    stem = cleanVerb.slice(0, -2);
    ending = 'ir';
  } else if (cleanVerb.endsWith('re')) {
    stem = cleanVerb.slice(0, -2);
    ending = 're';
  }

  const pp = stem + (ending === 'er' ? 'é' : ending === 'ir' ? 'i' : 'u');
  const isEtre = verbObj.cat?.includes('etre_verbs');
  const auxPC = isEtre ? ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'] : ['ai', 'as', 'a', 'avons', 'avez', 'ont'];
  const auxPQP = isEtre ? ['étais', 'étais', 'était', 'étions', 'étiez', 'étaient'] : ['avais', 'avais', 'avait', 'avions', 'aviez', 'avaient'];
  const auxFutAnt = isEtre ? ['serai', 'seras', 'sera', 'serons', 'serez', 'seront'] : ['aurai', 'auras', 'aura', 'aurons', 'aurez', 'auront'];
  const auxCondPasse = isEtre ? ['serais', 'serais', 'serait', 'serions', 'seriez', 'seraient'] : ['aurais', 'aurais', 'aurait', 'aurions', 'auriez', 'auraient'];
  const auxSubjPasse = isEtre ? ['sois', 'sois', 'soit', 'soyons', 'soyez', 'soient'] : ['aie', 'aies', 'ait', 'ayons', 'ayez', 'aient'];

  let forms = [];
  switch (tenseId) {
    case 'present':
      if (ending === 'er') {
        forms = [stem + 'e', stem + 'es', stem + 'e', stem + 'ons', stem + 'ez', stem + 'ent'];
      } else if (ending === 'ir') {
        forms = [stem + 'is', stem + 'is', stem + 'it', stem + 'issons', stem + 'issez', stem + 'issent'];
      } else {
        forms = [stem + 's', stem + 's', stem + '', stem + 'dons', stem + 'dez', stem + 'dent'];
      }
      break;
    case 'passe_compose':
      forms = auxPC.map(a => `${a} ${pp}`);
      break;
    case 'imparfait':
      let impStem = ending === 'ir' ? stem + 'iss' : stem;
      forms = [impStem + 'ais', impStem + 'ais', impStem + 'ait', impStem + 'ions', impStem + 'iez', impStem + 'aient'];
      break;
    case 'plus_que_parfait':
      forms = auxPQP.map(a => `${a} ${pp}`);
      break;
    case 'futur_simple':
      let futBase = ending === 're' ? cleanVerb.slice(0, -1) : cleanVerb;
      forms = [futBase + 'ai', futBase + 'as', futBase + 'a', futBase + 'ons', futBase + 'ez', futBase + 'ont'];
      break;
    case 'futur_anterieur':
      forms = auxFutAnt.map(a => `${a} ${pp}`);
      break;
    case 'passe_simple':
      if (ending === 'er') {
        forms = [stem + 'ai', stem + 'as', stem + 'a', stem + 'âmes', stem + 'âtes', stem + 'èrent'];
      } else {
        forms = [stem + 'is', stem + 'is', stem + 'it', stem + 'îmes', stem + 'îtes', stem + 'irent'];
      }
      break;
    case 'cond_present':
      let condBase = ending === 're' ? cleanVerb.slice(0, -1) : cleanVerb;
      forms = [condBase + 'ais', condBase + 'ais', condBase + 'ait', condBase + 'ions', condBase + 'iez', condBase + 'aient'];
      break;
    case 'cond_passe':
      forms = auxCondPasse.map(a => `${a} ${pp}`);
      break;
    case 'subj_present':
      forms = ['que ' + stem + 'e', 'que ' + stem + 'es', 'qu\'' + stem + 'e', 'que ' + stem + 'ions', 'que ' + stem + 'iez', 'qu\'' + stem + 'ent'];
      break;
    case 'subj_passe':
      forms = auxSubjPasse.map(a => `${a} ${pp}`);
      break;
    case 'imperatif':
      let impForm1 = ending === 'er' ? stem + 'e' : stem + 's';
      forms = [impForm1, '-', '-', stem + 'ons', stem + 'ez', '-'];
      break;
    default:
      forms = [stem + 'e', stem + 'es', stem + 'e', stem + 'ons', stem + 'ez', stem + 'ent'];
  }

  if (prep) {
    forms = forms.map(f => f === '-' ? '-' : f + prep);
  }

  if (isPronominal) {
    const refs = ['me ', 'te ', 'se ', 'nous ', 'vous ', 'se '];
    forms = forms.map((f, idx) => f === '-' ? '-' : refs[idx] + f);
  }

  return forms;
};

export default function App() {
  const [activeTab, setActiveTab] = useState('practice');
  const [showMobileSettings, setShowMobileSettings] = useState(false);

  // Filters & State
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('most_common');
  const [selectedTenses, setSelectedTenses] = useState(['present', 'passe_compose', 'imparfait', 'futur_simple']);
  
  const [mode, setMode] = useState('single');
  const [sessionLength, setSessionLength] = useState(20);
  const [strictAccents, setStrictAccents] = useState(true);
  const [showEnglish, setShowEnglish] = useState(true);

  // Question Session
  const [questionCount, setQuestionCount] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [tableInputs, setTableInputs] = useState(['', '', '', '', '', '']);
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);

  // Verbs Tab State ("Verbes")
  const [tablesViewMode, setTablesViewMode] = useState('tables'); // 'tables' or 'flashcards'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTableVerb, setSelectedTableVerb] = useState(MOREAU_VERBS[0]);
  
  // Flashcard specific state: 1 card per verb tense
  const [flashcardVerbIndex, setFlashcardVerbIndex] = useState(0);
  const [flashcardTenseIndex, setFlashcardTenseIndex] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    totalAnswered: 0,
    totalCorrect: 0,
    tenseStats: {}
  });

  const availableVerbs = useMemo(() => {
    let list = MOREAU_VERBS;
    if (selectedCategory !== 'all') {
      list = list.filter(v => v.cat.includes(selectedCategory));
    }
    if (selectedLevel !== 'all') {
      list = list.filter(v => v.level === selectedLevel);
    }
    return list.length > 0 ? list : MOREAU_VERBS;
  }, [selectedCategory, selectedLevel]);

  const generateNewQuestion = () => {
    if (availableVerbs.length === 0 || selectedTenses.length === 0) return;
    setShowHint(false);

    if (mode === 'sentence') {
      const matchingSentences = SENTENCE_TEMPLATES.filter(s => selectedTenses.includes(s.tense));
      const chosenTemplate = matchingSentences.length > 0 
        ? matchingSentences[Math.floor(Math.random() * matchingSentences.length)]
        : SENTENCE_TEMPLATES[Math.floor(Math.random() * SENTENCE_TEMPLATES.length)];

      const verbObj = MOREAU_VERBS.find(v => v.verb === chosenTemplate.verb) || { verb: chosenTemplate.verb, english: 'to verb', cat: ['er'], type: 'er', level: 'A1-A2' };
      const tenseObj = TENSES.find(t => t.id === chosenTemplate.tense) || TENSES[0];
      const fullConj = conjugateVerb(verbObj, chosenTemplate.tense);
      const correctAnswer = fullConj[chosenTemplate.personIdx];

      setCurrentQuestion({
        verb: verbObj,
        tense: tenseObj,
        personIdx: chosenTemplate.personIdx,
        person: PRONOUNS[chosenTemplate.personIdx],
        correctAnswer: correctAnswer,
        fullConjugations: fullConj,
        sentenceTemplate: chosenTemplate,
        options: []
      });
    } else {
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
          if (!options.includes(wrongOpt) && wrongOpt !== '-') {
            options.push(wrongOpt);
          } else {
            const altVerb = availableVerbs[Math.floor(Math.random() * availableVerbs.length)];
            const altConj = conjugateVerb(altVerb, randomTenseId)[randomPersonIdx];
            if (!options.includes(altConj) && altConj !== '-') {
              options.push(altConj);
            }
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
        sentenceTemplate: null,
        options: options
      });
    }

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
    let res = str.trim().toLowerCase();
    res = res.replace(/^(que\s+|qu\')/i, '');
    if (!strictAccents) {
      res = res.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
    return res;
  };

  const checkAnswer = (customAnswer) => {
    if (feedback || !currentQuestion) return;

    let isCorrect = false;
    let expected = currentQuestion.correctAnswer;
    const normalizedExpected = normalize(expected);

    if (mode === 'single' || mode === 'sentence') {
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
      setStreak(s => {
        const next = s + 1;
        if (next > bestStreak) setBestStreak(next);
        return next;
      });
    } else {
      setStreak(0);
    }

    setStats(prev => {
      const tId = currentQuestion.tense.id;
      const tStat = prev.tenseStats[tId] || { answered: 0, correct: 0 };
      return {
        ...prev,
        totalAnswered: prev.totalAnswered + 1,
        totalCorrect: prev.totalCorrect + (isCorrect ? 1 : 0),
        tenseStats: {
          ...prev.tenseStats,
          [tId]: { answered: tStat.answered + 1, correct: tStat.correct + (isCorrect ? 1 : 0) }
        }
      };
    });

    setFeedback({
      isCorrect,
      answer: expected,
      summary: currentQuestion.tense.summary,
      sampleFr: currentQuestion.tense.sampleFr,
      sampleEn: currentQuestion.tense.sampleEn
    });
  };

  const handleNextQuestion = () => {
    if (sessionLength !== Infinity && questionCount >= sessionLength) {
      setQuestionCount(1);
      setScore(0);
    } else {
      setQuestionCount(q => q + 1);
    }
    generateNewQuestion();
  };

  const toggleTense = (id) => {
    if (selectedTenses.includes(id)) {
      if (selectedTenses.length > 1) setSelectedTenses(selectedTenses.filter(t => t !== id));
    } else {
      setSelectedTenses([...selectedTenses, id]);
    }
  };

  const filteredTableVerbs = useMemo(() => {
    return MOREAU_VERBS.filter(v => {
      const matchesSearch = v.verb.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            v.english.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLevel = selectedLevel === 'all' || v.level === selectedLevel;
      return matchesSearch && matchesLevel;
    });
  }, [searchQuery, selectedLevel]);

  const renderSettingsForm = () => (
    <div className="space-y-6 font-sans">
      <div className="space-y-2">
        <label className="text-[11px] font-bold uppercase tracking-wider text-[#b84a39]">Mode d'Exercice</label>
        <div className="grid grid-cols-1 gap-2">
          {[
            { id: 'single', label: '1. Une Personne' },
            { id: 'table', label: '2. Table Complete' },
            { id: 'choose', label: '3. Choix Multiple' },
            { id: 'sentence', label: '4. En Contexte (Prepositions)' }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`p-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-left ${
                mode === m.id
                  ? 'bg-[#b84a39] border-[#b84a39] text-white shadow-xs'
                  : 'bg-white border-[#e8e2d8] text-[#5c524c] hover:bg-[#f6eee3]'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[11px] font-bold uppercase tracking-wider text-[#b84a39]">Niveau CECRL</label>
        <div className="grid grid-cols-2 gap-2">
          {LEVEL_FILTERS.map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => setSelectedLevel(lvl.id)}
              className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                selectedLevel === lvl.id
                  ? 'bg-[#b84a39] border-[#b84a39] text-white'
                  : 'bg-white border-[#e8e2d8] text-[#5c524c] hover:bg-[#f6eee3]'
              }`}
            >
              {lvl.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[11px] font-bold uppercase tracking-wider text-[#b84a39]">Groupe de Verbes (Moreau)</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2.5 bg-[#fbf9f5] border border-[#e8e2d8] rounded-xl text-xs font-semibold text-[#2c2623] outline-none focus:border-[#b84a39]"
        >
          {VERB_CATEGORIES.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#b84a39]">Temps Actifs (11)</label>
          <button
            onClick={() => setSelectedTenses(TENSES.map(t => t.id))}
            className="text-[10px] text-[#b84a39] hover:underline font-semibold cursor-pointer"
          >
            Tout Sélect.
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto p-2 bg-[#fbf9f5] rounded-xl border border-[#e8e2d8]">
          {TENSES.map(t => {
            const active = selectedTenses.includes(t.id);
            return (
              <button
                key={t.id}
                onClick={() => toggleTense(t.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all cursor-pointer ${
                  active
                    ? 'bg-[#b84a39] border-[#b84a39] text-white font-bold'
                    : 'bg-white border-[#e8e2d8] text-[#5c524c] hover:bg-[#f6eee3]'
                }`}
              >
                {t.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-[#f0ebe1]">
        <label className="flex items-center justify-between text-xs font-semibold text-[#2c2623] cursor-pointer">
          <span>Correction Stricte</span>
          <input type="checkbox" checked={strictAccents} onChange={(e) => setStrictAccents(e.target.checked)} className="w-4 h-4 accent-[#b84a39] rounded" />
        </label>
        <label className="flex items-center justify-between text-xs font-semibold text-[#2c2623] cursor-pointer">
          <span>Afficher Traduction</span>
          <input type="checkbox" checked={showEnglish} onChange={(e) => setShowEnglish(e.target.checked)} className="w-4 h-4 accent-[#b84a39] rounded" />
        </label>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#2c2623] font-serif pb-16 antialiased">
      {/* HEADER WITH TITLE: Roselle Learns French */}
      <header className="sticky top-0 z-30 bg-[#fbf9f5]/90 backdrop-blur-md border-b border-[#e8e2d8] shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 font-sans">
              <span className="text-lg">🇫🇷</span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#b84a39]">
                Roselle Learns French
              </span>
            </div>
            <h1 className="text-2xl font-normal text-[#2c2623] tracking-tight mt-0.5">
              Atelier de Conjugaison & Verbes
            </h1>
          </div>

          <button
            onClick={() => setShowMobileSettings(true)}
            className="lg:hidden p-2.5 rounded-2xl bg-white border border-[#e8e2d8] text-[#5c524c] hover:bg-[#f4efe6] transition-colors shadow-2xs font-sans text-xs font-medium flex items-center space-x-1.5 cursor-pointer"
          >
            <Settings className="w-4 h-4 text-[#b84a39]" />
            <span>Options</span>
          </button>
        </div>

        <div className="max-w-6xl mx-auto px-4 pb-3 flex items-center justify-between overflow-x-auto">
          <nav className="flex items-center space-x-1.5 font-sans">
            {[
              { id: 'practice', label: 'Exercices' },
              { id: 'tables', label: 'Verbes' },
              { id: 'guide', label: 'Guide Grammaire' },
              { id: 'progress', label: 'Progression' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
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

      {/* MAIN CONTAINER WITH DESKTOP SIDEBAR */}
      <div className="max-w-6xl mx-auto px-4 mt-8 flex flex-col lg:flex-row gap-8 items-start">
        <main className="flex-1 w-full min-w-0">
        
          {/* TAB 1: PRACTICE */}
          {activeTab === 'practice' && currentQuestion && (
            <div className="space-y-6">
              
              {/* Session Top Bar */}
              <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-[#e8e2d8] shadow-2xs font-sans">
                <div className="text-xs font-semibold text-[#5c524c]">
                  Question <span className="text-[#b84a39] font-bold">{questionCount}</span>
                </div>
                <div className="flex items-center space-x-5 text-xs font-medium">
                  <div className="flex items-center space-x-1.5 text-[#2c2623]">
                    <BarChart3 className="w-3.5 h-3.5 text-[#b84a39]" />
                    <span>Score: {score}/{stats.totalAnswered}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-[#2c2623]">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Série: {streak}</span>
                  </div>
                </div>
              </div>

              {/* Main Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8e2d8] shadow-xs relative">
                
                <div className="flex items-start justify-between pb-4 border-b border-[#f0ebe1]">
                  <div>
                    <div className="flex items-center space-x-2 font-sans mb-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f6eee3] text-[#b84a39] uppercase border border-[#e8dac8]">
                        {currentQuestion.verb.level}
                      </span>
                      <span className="text-xs text-[#8c8075] font-medium">• {currentQuestion.verb.type}</span>
                    </div>
                    <h2 className="text-3xl font-normal text-[#2c2623] tracking-tight">
                      {currentQuestion.verb.verb}
                    </h2>
                    {showEnglish && (
                      <p className="text-xs font-sans text-[#8c8075] mt-0.5 italic">
                        "{currentQuestion.verb.english}"
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-sans font-semibold text-[#b84a39] block">
                      {currentQuestion.tense.name}
                    </span>
                    <span className="text-[11px] font-sans text-[#a09488]">
                      {currentQuestion.tense.mood}
                    </span>
                  </div>
                </div>

                {/* PRACTICE MODES */}
                <div className="py-6 space-y-6">
                  
                  {/* MODE 1: SINGLE PERSON */}
                  {mode === 'single' && (
                    <div className="space-y-5 text-center">
                      <div className="flex flex-wrap items-center justify-center gap-3 font-sans">
                        <span className="bg-[#f6eee3] text-[#2c2623] px-4 py-2 rounded-xl border border-[#e8dac8] font-bold text-base">
                          {currentQuestion.person.label}
                        </span>
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
                            <button
                              key={char}
                              onClick={() => addAccent(char)}
                              className="w-8 h-8 bg-[#f6eee3] hover:bg-[#ede3d3] border border-[#e8dac8] text-[#2c2623] rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            >
                              {char}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* MODE 2: TABLE COMPLETE */}
                  {mode === 'table' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans">
                      {PRONOUNS.map((pronoun, idx) => (
                        <div key={pronoun.id} className="flex items-center space-x-2 bg-[#fbf9f5] p-2.5 rounded-xl border border-[#e8e2d8]">
                          <span className="w-24 text-xs font-bold text-[#5c524c]">{pronoun.label}</span>
                          <input
                            type="text"
                            value={tableInputs[idx]}
                            onChange={(e) => {
                              const val = e.target.value;
                              setTableInputs(prev => {
                                const copy = [...prev];
                                copy[idx] = val;
                                return copy;
                              });
                            }}
                            disabled={feedback !== null || currentQuestion.fullConjugations[idx] === '-'}
                            placeholder={currentQuestion.fullConjugations[idx] === '-' ? 'N/A' : '...'}
                            className="w-full px-3 py-1.5 border border-[#e8e2d8] focus:border-[#b84a39] rounded-lg text-sm outline-none bg-white font-serif"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* MODE 3: MULTIPLE CHOICE */}
                  {mode === 'choose' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-serif">
                      {currentQuestion.options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => checkAnswer(opt)}
                          disabled={feedback !== null}
                          className={`p-4 rounded-2xl text-center font-normal text-lg transition-all border cursor-pointer ${
                            feedback
                              ? opt === currentQuestion.correctAnswer
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                                : 'bg-[#fbf9f5] border-[#e8e2d8] text-[#a09488]'
                              : 'bg-white hover:bg-[#f6eee3] border-[#e8e2d8] text-[#2c2623] active:scale-[0.99]'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* MODE 4: SENTENCE CONTEXT */}
                  {mode === 'sentence' && currentQuestion.sentenceTemplate && (
                    <div className="space-y-4 text-center font-sans">
                      <div className="p-5 bg-[#fbf9f5] rounded-2xl border border-[#e8e2d8] space-y-2">
                        <p className="text-xl font-serif text-[#2c2623] leading-relaxed">
                          {currentQuestion.sentenceTemplate.sentence.split('{blank}').map((part, idx, arr) => (
                            <React.Fragment key={idx}>
                              {part}
                              {idx < arr.length - 1 && (
                                <input
                                  type="text"
                                  value={userInput}
                                  onChange={(e) => setUserInput(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                                  placeholder={`(${currentQuestion.sentenceTemplate.verb})`}
                                  disabled={feedback !== null}
                                  className="mx-1 px-3 py-1 border-b-2 border-[#b84a39] focus:border-[#2c2623] bg-white rounded-t-md text-[#b84a39] font-bold font-serif outline-none text-center inline-block w-48"
                                  autoFocus
                                />
                              )}
                            </React.Fragment>
                          ))}
                        </p>
                        
                        {showEnglish && (
                          <p className="text-xs font-sans text-[#8c8075] italic pt-1">
                            🇬🇧 "{currentQuestion.sentenceTemplate.english}"
                          </p>
                        )}
                      </div>

                      {!feedback && (
                        <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                          {['é', 'è', 'ê', 'ë', 'à', 'â', 'ç', 'î', 'ï', 'ô', 'ù', 'û', 'œ'].map(char => (
                            <button
                              key={char}
                              onClick={() => addAccent(char)}
                              className="w-8 h-8 bg-[#f6eee3] hover:bg-[#ede3d3] border border-[#e8dac8] text-[#2c2623] rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            >
                              {char}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* HINT */}
                {!feedback && (
                  <div className="flex justify-center mb-3 font-sans">
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="flex items-center space-x-1.5 text-xs text-[#8c8075] font-semibold hover:text-[#b84a39] transition-colors cursor-pointer"
                    >
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                      <span>{showHint ? "Cacher l'indice" : "Besoin d'un indice?"}</span>
                    </button>
                  </div>
                )}

                {showHint && !feedback && (
                  <div className="p-3 mb-4 bg-amber-50/80 rounded-xl border border-amber-200 text-xs font-sans text-amber-900 text-center animate-fadeIn">
                    La première lettre est: <strong className="text-base text-[#b84a39] font-serif">{currentQuestion.correctAnswer.charAt(0)}</strong>
                  </div>
                )}

                {/* SUBMIT / NEXT */}
                {!feedback ? (
                  <div className="flex justify-center pt-2 font-sans">
                    <button
                      onClick={() => checkAnswer()}
                      className="w-full sm:w-auto px-10 py-3 bg-[#b84a39] hover:bg-[#a03d2e] text-white font-bold text-sm rounded-2xl shadow-xs transition-all active:scale-95 cursor-pointer"
                    >
                      Vérifier
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 pt-2 font-sans animate-fadeIn">
                    <div className={`p-4 rounded-2xl border flex items-start space-x-3 ${
                      feedback.isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-950'
                    }`}>
                      {feedback.isCorrect ? <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />}
                      <div>
                        <h4 className="font-bold text-sm">{feedback.isCorrect ? 'Excellente réponse!' : 'Pas tout à fait...'}</h4>
                        {!feedback.isCorrect && (
                          <p className="text-xs mt-1 font-serif">
                            Réponse correcte: <span className="font-bold text-[#b84a39] underline">{feedback.answer}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-[#fbf9f5] rounded-2xl border border-[#e8e2d8] space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#b84a39] block">Exemple d'utilisation en contexte</span>
                      <p className="font-serif text-sm text-[#2c2623]">🇫🇷 "{feedback.sampleFr}"</p>
                      <p className="text-xs font-sans text-[#8c8075] italic">🇬🇧 "{feedback.sampleEn}"</p>
                    </div>

                    <button
                      onClick={handleNextQuestion}
                      className="w-full py-3 bg-[#2c2623] hover:bg-[#1a1715] text-white font-bold text-sm rounded-2xl shadow-xs transition-all active:scale-95 cursor-pointer"
                    >
                      Question Suivante
                    </button>
                  </div>
                )}

                {/* TENSE USAGE AT THE BOTTOM */}
                <div className="mt-8 pt-4 border-t border-[#f0ebe1] text-xs font-sans bg-[#fbf9f5] p-4 rounded-2xl border border-[#e8e2d8] text-[#5c524c] space-y-1">
                  <p>💡 <strong>Usage ({currentQuestion.tense.name}):</strong> {currentQuestion.tense.summary}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: VERBES (TABLES & FLASHCARDS) */}
          {activeTab === 'tables' && (
            <div className="space-y-8 font-sans">
              
              {/* VIEW SWITCHER & SEARCH BAR */}
              <div className="bg-white rounded-3xl p-6 border border-[#e8e2d8] shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-4 top-3.5 text-[#a09488]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search Dylane Moreau's 500 verbs..."
                      className="w-full pl-11 pr-4 py-3 bg-[#fbf9f5] border border-[#e8e2d8] rounded-2xl text-[#2c2623] font-medium outline-none focus:border-[#b84a39] text-xs"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setTablesViewMode('tables')}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                        tablesViewMode === 'tables'
                          ? 'bg-[#b84a39] text-white shadow-xs'
                          : 'bg-[#fbf9f5] text-[#5c524c] border border-[#e8e2d8] hover:bg-[#f6eee3]'
                      }`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                      <span>Vue Tables</span>
                    </button>
                    <button
                      onClick={() => {
                        setTablesViewMode('flashcards');
                        setFlashcardFlipped(false);
                      }}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                        tablesViewMode === 'flashcards'
                          ? 'bg-[#b84a39] text-white shadow-xs'
                          : 'bg-[#fbf9f5] text-[#5c524c] border border-[#e8e2d8] hover:bg-[#f6eee3]'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Vue Flashcards</span>
                    </button>
                  </div>
                </div>

                {/* VERB PICKER LIST */}
                <div className="max-h-48 overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 border-t border-[#f0ebe1] pt-4">
                  {filteredTableVerbs.map((v, i) => {
                    const isSelected = selectedTableVerb && selectedTableVerb.verb === v.verb;
                    return (
                      <button
                        key={`${v.verb}-${i}`}
                        onClick={() => {
                          setSelectedTableVerb(v);
                          const verbIdx = filteredTableVerbs.findIndex(fv => fv.verb === v.verb);
                          if (verbIdx !== -1) setFlashcardVerbIndex(verbIdx);
                          setFlashcardFlipped(false);
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected ? 'bg-[#b84a39] text-white border-[#b84a39] shadow-xs' : 'bg-[#fbf9f5] hover:bg-[#f6eee3] text-[#2c2623] border-[#e8e2d8]'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <div className="font-serif text-sm font-normal truncate">{v.verb}</div>
                          <div className={`text-[10px] truncate ${isSelected ? 'text-white/80' : 'text-[#8c8075]'}`}>{v.english}</div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${isSelected ? 'bg-white/20 text-white border-white/30' : 'bg-white text-[#b84a39] border-[#e8dac8]'}`}>
                          {v.level}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* VIEW MODE 1: TABLES */}
              {tablesViewMode === 'tables' && selectedTableVerb && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e8e2d8] shadow-xs space-y-6 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#f0ebe1] gap-2">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f6eee3] text-[#b84a39] border border-[#e8dac8]">{selectedTableVerb.level}</span>
                        <span className="text-xs text-[#8c8075] font-medium">• {selectedTableVerb.type}</span>
                      </div>
                      <h2 className="text-3xl font-serif text-[#2c2623] capitalize">{selectedTableVerb.verb}</h2>
                      <p className="text-xs text-[#8c8075] italic">"{selectedTableVerb.english}"</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {TENSES.map((tense) => {
                      const conjs = conjugateVerb(selectedTableVerb, tense.id);
                      return (
                        <div key={tense.id} className="bg-[#fbf9f5] p-4 rounded-2xl border border-[#e8e2d8] space-y-3">
                          <div className="flex justify-between items-center pb-1.5 border-b border-[#e8e2d8]">
                            <h5 className="font-bold text-xs text-[#b84a39]">{tense.name}</h5>
                            <span className="text-[10px] text-[#a09488] font-medium">{tense.mood}</span>
                          </div>
                          
                          <div className="space-y-1 font-serif">
                            {PRONOUNS.map((p, idx) => (
                              <div key={p.id} className="flex justify-between text-xs">
                                <span className="text-[#8c8075] font-sans text-[11px]">{p.label}</span>
                                <span className="text-[#2c2623] font-normal">{conjs[idx]}</span>
                              </div>
                            ))}
                          </div>

                          <div className="pt-2 border-t border-[#e8e2d8]/60 text-[11px] text-[#5c524c] italic">
                            💬 "{tense.sampleFr}"
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* VIEW MODE 2: FLASHCARDS (1 card = 1 verb tense) */}
              {tablesViewMode === 'flashcards' && filteredTableVerbs.length > 0 && (() => {
                const currentCardVerb = filteredTableVerbs[flashcardVerbIndex] || filteredTableVerbs[0];
                const currentCardTense = TENSES[flashcardTenseIndex] || TENSES[0];
                const cardConjugations = conjugateVerb(currentCardVerb, currentCardTense.id);

                return (
                  <div className="max-w-xl mx-auto space-y-6 animate-fadeIn">
                    
                    <div className="flex items-center justify-between px-2 text-xs font-bold text-[#8c8075]">
                      <span>Verbe {flashcardVerbIndex + 1} / {filteredTableVerbs.length}: <strong className="text-[#2c2623]">{currentCardVerb.verb}</strong></span>
                      <span>Temps {flashcardTenseIndex + 1} / {TENSES.length}: <strong className="text-[#b84a39]">{currentCardTense.name}</strong></span>
                    </div>

                    <div
                      onClick={() => setFlashcardFlipped(!flashcardFlipped)}
                      className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-[#e8e2d8] shadow-md min-h-[340px] flex flex-col justify-between cursor-pointer transition-all hover:border-[#b84a39] relative"
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#f6eee3] text-[#b84a39] border border-[#e8dac8]">
                          {currentCardVerb.level}
                        </span>
                        <span className="text-xs font-sans text-[#a09488]">
                          {flashcardFlipped ? "Verso (Conjugaison)" : "Recto (Verbe & Temps)"}
                        </span>
                      </div>

                      <div className="text-center my-auto py-4">
                        {!flashcardFlipped ? (
                          <div className="space-y-3">
                            <h2 className="text-4xl font-serif text-[#2c2623] capitalize">{currentCardVerb.verb}</h2>
                            <p className="text-base text-[#8c8075] font-sans italic">"{currentCardVerb.english}"</p>
                            <div className="pt-4">
                              <span className="inline-block px-4 py-2 bg-[#b84a39] text-white text-xs font-bold rounded-xl shadow-2xs">
                                Temps: {currentCardTense.name} ({currentCardTense.mood})
                              </span>
                            </div>
                            <p className="text-[11px] text-[#a09488] font-sans pt-6">Cliquez pour voir la conjugaison complète de ce temps</p>
                          </div>
                        ) : (
                          <div className="space-y-4 w-full">
                            <div className="border-b border-[#f0ebe1] pb-2">
                              <h3 className="text-xl font-serif text-[#2c2623] capitalize">{currentCardVerb.verb} — <span className="text-[#b84a39]">{currentCardTense.name}</span></h3>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-left font-serif text-xs">
                              {PRONOUNS.map((p, idx) => (
                                <div key={p.id} className="p-2.5 bg-[#fbf9f5] rounded-xl border border-[#e8e2d8] flex justify-between items-center">
                                  <span className="text-[#8c8075] font-sans text-[11px]">{p.label}</span>
                                  <span className="text-[#2c2623] font-bold">{cardConjugations[idx]}</span>
                                </div>
                              ))}
                            </div>
                            <div className="pt-2 text-[11px] text-[#5c524c] italic text-center">
                              💬 "{currentCardTense.sampleFr}"
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="text-center text-[10px] text-[#a09488] font-sans">
                        Cliquez n'importe où sur la carte pour retourner
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-sans">
                      <button
                        onClick={() => {
                          if (flashcardTenseIndex > 0) {
                            setFlashcardTenseIndex(prev => prev - 1);
                          } else if (flashcardVerbIndex > 0) {
                            setFlashcardVerbIndex(prev => prev - 1);
                            setFlashcardTenseIndex(TENSES.length - 1);
                          }
                          setFlashcardFlipped(false);
                        }}
                        className="py-3 bg-white border border-[#e8e2d8] rounded-2xl font-bold text-xs hover:bg-[#f6eee3] cursor-pointer"
                      >
                        ← Temps Précédent
                      </button>
                      <button
                        onClick={() => setFlashcardFlipped(!flashcardFlipped)}
                        className="py-3 bg-[#b84a39] text-white rounded-2xl font-bold text-xs hover:bg-[#a03d2e] shadow-xs cursor-pointer flex items-center justify-center space-x-1.5"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Retourner</span>
                      </button>
                      <button
                        onClick={() => {
                          if (flashcardTenseIndex < TENSES.length - 1) {
                            setFlashcardTenseIndex(prev => prev + 1);
                          } else if (flashcardVerbIndex < filteredTableVerbs.length - 1) {
                            setFlashcardVerbIndex(prev => prev + 1);
                            setFlashcardTenseIndex(0);
                          }
                          setFlashcardFlipped(false);
                        }}
                        className="py-3 bg-white border border-[#e8e2d8] rounded-2xl font-bold text-xs hover:bg-[#f6eee3] cursor-pointer"
                      >
                        Temps Suivant →
                      </button>
                      <button
                        onClick={() => {
                          if (flashcardVerbIndex < filteredTableVerbs.length - 1) {
                            setFlashcardVerbIndex(prev => prev + 1);
                          } else {
                            setFlashcardVerbIndex(0);
                          }
                          setFlashcardTenseIndex(0);
                          setFlashcardFlipped(false);
                        }}
                        className="py-3 bg-[#2c2623] text-white rounded-2xl font-bold text-xs hover:bg-[#1a1715] cursor-pointer"
                      >
                        Verbe Suivant ⏭
                      </button>
                    </div>

                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 3: GUIDE DE GRAMMAIRE */}
          {activeTab === 'guide' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#e8e2d8] shadow-xs">
                <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-[#f0ebe1]">
                  <div className="p-3 bg-[#f6eee3] text-[#b84a39] rounded-2xl border border-[#e8dac8]">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-normal font-serif text-[#2c2623]">Guide de Grammaire Avancé</h2>
                    <p className="text-xs font-sans text-[#8c8075]">Dylane Moreau morphological breakdown charts, precise usage rules & samples.</p>
                  </div>
                </div>

                <div className="space-y-6 font-sans">
                  {TENSES.map((tense) => (
                    <div key={tense.id} className="p-6 bg-[#fbf9f5] rounded-2xl border border-[#e8e2d8] space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b border-[#e8e2d8]">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-[#2c2623] text-base">{tense.name}</h3>
                          <span className="px-2.5 py-0.5 bg-[#f6eee3] text-[#b84a39] rounded-full text-[10px] font-bold border border-[#e8dac8]">
                            {tense.level}
                          </span>
                        </div>
                        <span className="text-xs text-[#8c8075] font-semibold">{tense.mood}</span>
                      </div>

                      <p className="text-xs text-[#5c524c]">
                        <strong>Résumé:</strong> {tense.summary}
                      </p>

                      <div className="space-y-1.5">
                        <strong className="text-xs text-[#b84a39] block uppercase tracking-wider">Quand l'utiliser:</strong>
                        <ul className="list-disc list-inside text-xs text-[#5c524c] space-y-1 pl-1">
                          {tense.uses.map((u, i) => (
                            <li key={i}>{u}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Morphological Chart */}
                      <div className="space-y-2 pt-2">
                        <strong className="text-xs text-[#b84a39] block uppercase tracking-wider">Tableau des Terminaisons & Formules:</strong>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs bg-white rounded-xl border border-[#e8e2d8] overflow-hidden">
                            <thead>
                              <tr className="bg-[#f6eee3] text-[#b84a39]">
                                <th className="p-2 border-b border-[#e8e2d8]">Groupe / Formule</th>
                                <th className="p-2 border-b border-[#e8e2d8]">je</th>
                                <th className="p-2 border-b border-[#e8e2d8]">tu</th>
                                <th className="p-2 border-b border-[#e8e2d8]">il</th>
                                <th className="p-2 border-b border-[#e8e2d8]">nous</th>
                                <th className="p-2 border-b border-[#e8e2d8]">vous</th>
                                <th className="p-2 border-b border-[#e8e2d8]">ils</th>
                              </tr>
                            </thead>
                            <tbody>
                              {tense.endingsChart.map((row, rIdx) => (
                                <tr key={rIdx} className="border-b border-[#f0ebe1] last:border-none font-serif">
                                  <td className="p-2 font-sans font-semibold text-[#5c524c]">{row.group}</td>
                                  <td className="p-2">{row.je}</td>
                                  <td className="p-2">{row.tu}</td>
                                  <td className="p-2">{row.il}</td>
                                  <td className="p-2">{row.nous}</td>
                                  <td className="p-2">{row.vous}</td>
                                  <td className="p-2">{row.ils}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-[#e8e2d8] space-y-1">
                        <p className="text-xs text-[#2c2623] font-serif font-semibold">🇫🇷 "{tense.sampleFr}"</p>
                        <p className="text-xs text-[#8c8075] italic">🇬🇧 "{tense.sampleEn}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PROGRESS */}
          {activeTab === 'progress' && (
            <div className="max-w-3xl mx-auto space-y-6 font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-[#e8e2d8] text-center shadow-2xs">
                  <div className="text-2xl font-serif text-[#2c2623]">{stats.totalAnswered ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100) : 0}%</div>
                  <div className="text-xs text-[#8c8075] font-semibold mt-1">Précision</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-[#e8e2d8] text-center shadow-2xs">
                  <div className="text-2xl font-serif text-[#2c2623]">{bestStreak}</div>
                  <div className="text-xs text-[#8c8075] font-semibold mt-1">Meilleure Série</div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-[#e8e2d8] text-center shadow-2xs">
                  <div className="text-2xl font-serif text-[#2c2623]">{stats.totalAnswered}</div>
                  <div className="text-xs text-[#8c8075] font-semibold mt-1">Total Répondu</div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* PERSISTENT DESKTOP RIGHT SIDEBAR FOR OPTIONS */}
        <aside className="hidden lg:block w-[300px] xl:w-[320px] shrink-0 bg-white rounded-3xl p-6 border border-[#e8e2d8] shadow-sm sticky top-28 space-y-6">
          <div className="flex items-center space-x-2 border-b border-[#f0ebe1] pb-4 font-sans">
            <Settings className="w-5 h-5 text-[#b84a39]" />
            <h3 className="font-serif text-lg text-[#2c2623]">Options & Réglages</h3>
          </div>
          {renderSettingsForm()}
        </aside>
      </div>

      {/* MOBILE SETTINGS MODAL */}
      {showMobileSettings && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#2c2623]/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl border border-[#e8e2d8] space-y-6">
            <div className="flex items-center justify-between border-b border-[#f0ebe1] pb-4">
              <h3 className="font-serif text-xl text-[#2c2623]">Options & Réglages</h3>
              <button onClick={() => setShowMobileSettings(false)} className="p-1 rounded-full hover:bg-[#f6eee3] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            {renderSettingsForm()}
            <button
              onClick={() => setShowMobileSettings(false)}
              className="w-full py-3 bg-[#b84a39] text-white font-bold text-xs rounded-2xl cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
