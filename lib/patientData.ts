// =========================================================================
// GH CLINIC — PATIENT PORTAL & CLINICAL HISTORY DATA DEFINITIONS
// =========================================================================

export interface PatientTreatmentHistoryItem {
  id: string;
  patientPhone: string;
  treatmentId: string;
  treatmentName: string;
  category: 'laser' | 'injectables' | 'facial' | 'body' | 'regeneration';
  categoryLabel: string;
  date: string;
  timeSlot?: string;
  doctorName: string;
  zoneTreated: string;
  productOrDevice: string;
  batchNumber?: string;
  totalPriceDZD: number;
  status: 'completed' | 'followup_pending' | 'in_progress';
  clinicalNotes: string;
  doctorObservations?: string;
  postCareSummary: string[];
  nextRecommendedSessionDate?: string;
  patientSatisfactionRating?: number; // 1 to 5
  healingStatus?: 'normal' | 'slight_redness' | 'swelling' | 'healed';
}

export interface PostProcedureCareProtocol {
  id: string;
  treatmentId: string;
  category: 'laser' | 'injectables' | 'facial' | 'body' | 'regeneration';
  title: string;
  subtitle: string;
  description: string;
  immediateCare: {
    hours: string;
    instructions: string[];
  };
  shortTermCare: {
    days: string;
    instructions: string[];
  };
  forbiddenActions: string[];
  recommendedProducts: {
    name: string;
    category: string;
    description: string;
  }[];
  warningSigns: string[];
  doctorAdviceQuote: string;
  checklistItems: string[];
}

export interface PatientProfile {
  id: string;
  pinCode: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  dateOfBirth?: string;
  phototype?: string;
  knownAllergies?: string[];
  memberSince: string;
  status: 'Privilège' | 'VIP' | 'Régulier';
  doctorNotes: string;
  emergencyContact?: string;
}

// -------------------------------------------------------------------------
// CLINICALLY AUTHENTIC POST-PROCEDURE CARE PROTOCOLS (DR. GHAOUAT SARRA)
// -------------------------------------------------------------------------

export const POST_PROCEDURE_CARE_PROTOCOLS: Record<string, PostProcedureCareProtocol> = {
  'botox': {
    id: 'care-botox',
    treatmentId: 'botox-injections',
    category: 'injectables',
    title: 'Soins Post-Injections de Toxine Botulique (Botox)',
    subtitle: 'Consignes cliniques pour un résultat optimal et symétrique',
    description: 'La toxine botulique nécessite quelques heures pour se fixer précisément au niveau des jonctions neuromusculaires ciblées. Le respect scrupuleux de ces consignes garantit un résultat naturel et évite toute diffusion indésirable.',
    immediateCare: {
      hours: '0 à 6 Heures Post-Acte',
      instructions: [
        'Rester impérativement en position assise ou debout (ne pas s’allonger, ne pas faire de sieste la tête à plat)',
        'Ne pas baisser la tête de manière prolongée (éviter de ramasser des objets lourds au sol ou de nouer ses lacets tête vers le bas)',
        'Mobiliser doucement les muscles traités (sourire, froncer légèrement les sourcils) pour favoriser la fixation du produit',
        'Ne pas toucher, presser, masser ou frictionner les zones d’injection',
        'Ne pas appliquer de crème ni de maquillage sur le visage durant les 6 premières heures'
      ]
    },
    shortTermCare: {
      days: '24 à 48 Heures Post-Acte',
      instructions: [
        'Nettoyer le visage avec un nettoyant physiologique très doux sans frotter',
        'Dormir sur le dos avec la tête légèrement surélevée par deux oreillers la première nuit',
        'Éviter toute prise d’anti-inflammatoires (Ibuprofène, Kétoprofène) ou d’Aspirine sans avis médical pour minimiser les ecchymoses',
        'Hydrater la peau avec une crème barrière neutre sans acides ni rétinol'
      ]
    },
    forbiddenActions: [
      'AUCUN sport intensif, cardio ou musculation pendant 48 heures',
      'AUCUN hammam, sauna, bain brûlant ou exposition au soleil / UV pendant 3 jours',
      'PAS de port de casque de moto serré, bandeau ou chapeau compressif sur le front',
      'PAS de soins du visage en institut, peeling, massage facial ou radiofréquence pendant 14 jours',
      'Éviter la consommation d’alcool dans les 24h (favorise la vasodilatation et les petits hématomes)'
    ],
    recommendedProducts: [
      { name: 'Crème Arnica ou Arnican Gel', category: 'Anti-ecchymose', description: 'En tapotant délicatement si petite ecchymose au point d’injection' },
      { name: 'Eau Thermale d’Avène ou La Roche-Posay', category: 'Brumisateur apaisant', description: 'Pour apaiser sans contact direct' },
      { name: 'Écran Solaire SPF 50+ Minéral', category: 'Photoprotection', description: 'Application douce à partir de J+1' }
    ],
    warningSigns: [
      'Asymétrie prononcée ou paupière lourde (ptosis) ressentie après quelques jours',
      'Douleur aiguë anormale ou gonflement asymétrique chaud au toucher',
      'Maux de tête persistants ne cédant pas au Paracétamol classique'
    ],
    doctorAdviceQuote: '« Le résultat du Botox commence à s’installer entre le 4ème et le 7ème jour. L’effet optimal est apprécié à 14 jours. Une consultation de contrôle et de retouche gratuite est systématiquement prévue à J+15 chez GH Clinic. » — Dr. Ghaouat Sarra',
    checklistItems: [
      'Je suis restée debout ou assise pendant au moins 4 heures',
      'Je n’ai pas massé mon visage ni frotté les points d’injection',
      'J’ai évité le sport et la transpiration aujourd’hui',
      'J’ai bu de l’eau et évité l’alcool et les anti-inflammatoires',
      'Je dors sur le dos ce soir'
    ]
  },
  'fillers': {
    id: 'care-fillers',
    treatmentId: 'hyaluronic-acid-fillers',
    category: 'injectables',
    title: 'Soins Post-Injections d’Acide Hyaluronique (Lèvres & Sillons)',
    subtitle: 'Guide de stabilisation et gestion de l’œdème post-comblement',
    description: 'L’acide hyaluronique est un composant hydrophile naturel qui capte l’eau pour restaurer les volumes. Un léger gonflement initial (œdème) est tout à fait physiologique pendant 48h à 72h.',
    immediateCare: {
      hours: '0 à 6 Heures Post-Acte',
      instructions: [
        'Appliquer des compresses froides stériles enveloppées dans un tissu propre (pas de glace directe sur la peau) pendant 10 min toutes les 2 heures pour résorber l’œdème',
        'Ne pas manipuler, comprimer ni masser les lèvres ou la zone injectée',
        'Éviter les boissons très chaudes (thé, café bouillant) et les aliments trop épicés ou acides le jour même',
        'Boire avec un verre directement (ne pas utiliser de paille pour éviter la contraction excessive de la bouche)'
      ]
    },
    shortTermCare: {
      days: '24 à 72 Heures Post-Acte',
      instructions: [
        'Boire au minimum 1,5 à 2 litres d’eau par jour : l’eau optimise l’intégration et la souplesse de l’acide hyaluronique',
        'Appliquer un baume à lèvres réparateur nourrissant stérile (Cicalfate Lèvres ou Cicaplast Lèvres)',
        'Dormir la tête surélevée pour faciliter le drainage lymphatique nocturne',
        'Ne pas s’inquiéter des éventuelles petites asymétries transitoires dues au gonflement réactionnel'
      ]
    },
    forbiddenActions: [
      'AUCUN baiser appuyé ou mouvement de morsure des lèvres pendant 48 heures',
      'PAS de rouge à lèvres ni de maquillage occlusif pendant 24 heures',
      'PAS de hammam, sauna, jacuzzi ou cryothérapie pendant 7 jours',
      'PAS de sport intense ni de plongée sous-marine pendant 48 heures',
      'PAS de soins dentaires ou anesthésie dentaire dans les 2 semaines suivant l’acte'
    ],
    recommendedProducts: [
      { name: 'Cicalfate Lèvres (Avène) ou Cicaplast B5 Lèvres', category: 'Baume réparateur dermo', description: 'Application 4 à 5 fois par jour en couche généreuse' },
      { name: 'Gel d’Arnica 7CH', category: 'Homéopathie / Gel apaisant', description: 'En cas de petite ecchymose sous-cutanée' },
      { name: 'Paracétamol 1g', category: 'Antalgique', description: 'En cas de sensation de tension douloureuse (pas d’aspirine)' }
    ],
    warningSigns: [
      'Blanchiment cutané immédiat ou marbrure violacée persistante avec douleur pulsatile',
      'Douleur croissante non calmée par les antalgiques usuels',
      'Apparition de vésicules ou cloques fébriles (type herpès labial)'
    ],
    doctorAdviceQuote: '« Le volume initial est toujours majoré de 20% à 30% par l’œdème temporaire. Le volume définitif, souple et naturel se stabilise au bout de 10 à 15 jours. Faites confiance au processus d’intégration tissulaire. » — Dr. Ghaouat Sarra',
    checklistItems: [
      'J’ai appliqué du froid enveloppé pour apaiser l’œdème',
      'J’ai bu au moins 1.5L d’eau aujourd’hui',
      'J’ai appliqué mon baume réparateur lèvres stérile',
      'Je n’ai pas maquillé mes lèvres',
      'Je n’ai pas consommé de boissons brûlantes ni fumé'
    ]
  },
  'laser': {
    id: 'care-laser',
    treatmentId: 'laser-hair-removal',
    category: 'laser',
    title: 'Soins Post-Épilation Laser Médicale',
    subtitle: 'Protocole de régénération cutanée et photoprotection absolue',
    description: 'Le laser triple-onde détruit les follicules pilaires par thermolyse sélective. La peau présente une rougeur transitoire (érythème perifolliculaire) qui témoigne de l’efficacité du tir laser.',
    immediateCare: {
      hours: '0 à 12 Heures Post-Acte',
      instructions: [
        'Appliquer généreusement une crème réparatrice et apaisante (Biafine, Cicaplast Baume B5 ou Cicalfate+)',
        'Porter des vêtements amples en coton doux (éviter les frottements sur les cuisses, aisselles ou maillot)',
        'Prendre une douche tiède ou fraîche (bannir l’eau très chaude sur les zones flashées)',
        'Ne pas appliquer de déodorant avec alcool ni de parfum sur les aisselles traitées pendant 24h'
      ]
    },
    shortTermCare: {
      days: 'J+1 à J+7 Post-Acte',
      instructions: [
        'Poursuivre l’application biquotidienne de crème cicatrisante pendant 3 à 5 jours',
        'Appliquer quotidiennement un écran solaire minéral SPF 50+ sur toutes les zones exposées (visage, avant-bras, cou)',
        'Hydrater abondamment la peau après chaque douche pour faciliter l’expulsion des débris pilaires carbonisés',
        'Laisser les poils traités tomber naturellement entre J+7 et J+15 sans les arracher'
      ]
    },
    forbiddenActions: [
      'EXPOSITION SOLAIRE STRICTEMENT INTERDITE pendant au moins 15 jours (risque d’hyperpigmentation)',
      'NE JAMAIS ÉPILER à la cire, à la pince ou à l’épilateur électrique entre les séances (rasoir uniquement à J-1)',
      'AUCUN gommage ou exfoliation mécanique avant 7 jours',
      'PAS de piscine publique chlorée, jacuzzi, sauna ou hammam pendant 48 heures',
      'PAS de vêtements synthétiques ultra-moulants risquant de créer des frottements irritants'
    ],
    recommendedProducts: [
      { name: 'Cicaplast Baume B5+ (La Roche-Posay)', category: 'Crème apaisante réparatrice', description: 'À appliquer 2 à 3 fois par jour jusqu’à disparition complète des rougeurs' },
      { name: 'Anthelios UVmune 400 SPF 50+', category: 'Photoprotection médicale', description: 'Indispensable pour éviter tout risque de taches pigmentaires' },
      { name: 'Lait Corporel Surgras à l’Urée 5%', category: 'Hydratation corporelle', description: 'Dès J+4 pour favoriser la chute nette des follicules' }
    ],
    warningSigns: [
      'Petites cloques d’eau (phlyctènes) ou brûlure superficielle persistante',
      'Démangeaisons intenses ne cédant pas au baume réparateur',
      'Hyperpigmentation ou tache brune apparaissant après une exposition fortuite'
    ],
    doctorAdviceQuote: '« Ne touchez pas aux petits points noirs qui apparaissent dans les pores quelques jours après : ce sont les racines détruites en cours d’élimination. Elles s’évacueront toutes seules sous la douche. » — Dr. Ghaouat Sarra',
    checklistItems: [
      'J’ai appliqué ma crème réparatrice apaisante',
      'J’ai protégé ma peau du soleil avec du SPF 50+',
      'J’ai pris une douche tiède sans frotter',
      'Je n’ai pas utilisé de cire ni de pince à épiler',
      'Je porte des vêtements amples et doux'
    ]
  },
  'hydrafacial': {
    id: 'care-hydrafacial',
    treatmentId: 'hydrafacial-md',
    category: 'facial',
    title: 'Soins Post-Hydrafacial MD® & Nettoyage Médical',
    subtitle: 'Conserver l’éclat satiné et maximiser la pénétration des sérums',
    description: 'Votre peau vient d’être nettoyée en profondeur, exfoliée et infusée de complexes antioxydants et d’acide hyaluronique. Les pores sont désobstrués et ultra-réceptifs.',
    immediateCare: {
      hours: '0 à 12 Heures Post-Acte',
      instructions: [
        'Laisser infuser les sérums actifs déposés par Dr. Ghaouat : ne pas laver le visage le soir même',
        'Ne pas appliquer de fond de teint ni de maquillage compact durant les 24 premières heures',
        'Boire beaucoup d’eau pour maintenir le rebond d’hydratation cellulaire',
        'Changer la taie d’oreiller ce soir pour dormir sur un support propre et aseptisé'
      ]
    },
    shortTermCare: {
      days: 'J+1 à J+5 Post-Acte',
      instructions: [
        'Reprendre un nettoyage très doux avec une eau micellaire ou gel doux sans savon',
        'Appliquer un sérum hydratant à l’acide hyaluronique matin et soir',
        'Appliquer systématiquement une protection solaire SPF 50+ avant de sortir',
        'Profiter de la pureté du teint sans surcharger la peau en produits cosmétiques gras'
      ]
    },
    forbiddenActions: [
      'PAS de gommage granuleux, brosses nettoyantes oscillantes ou éponges exfoliantes pendant 7 jours',
      'PAS de produits contenant du Rétinol, de l’acide glycolique ou salicylique pendant 5 jours',
      'PAS d’exposition solaire directe prolongée sans protection solaire SPF 50+',
      'PAS de sauna ou hammam pendant 48 heures',
      'Ne pas percer ni triturer d’éventuelles petites imperfections résiduelles'
    ],
    recommendedProducts: [
      { name: 'Sérum Hyalu B5 ou Minéral 89', category: 'Booster d’hydratation', description: 'Matin et soir sous la crème de jour' },
      { name: 'Tolériane Dermo-Nettoyant', category: 'Nettoyant visage ultra-doux', description: 'Sans rinçage agressif pour préserver le film hydrolipidique' },
      { name: 'Fluide Solaire Teinté ou Invisible SPF 50+', category: 'Protection UV quotidienne', description: 'Tous les matins à la fin de la routine' }
    ],
    warningSigns: [
      'Rougeur généralisée brûlante persistant plus de 24 heures',
      'Réaction allergique ou éruption cutanée inhabituelle'
    ],
    doctorAdviceQuote: '« Pour conserver cet effet glow et maintenir la clarté des pores, une séance mensuelle d’entretien est recommandée. Votre peau est comme une soie : traitez-la avec délicatesse. » — Dr. Ghaouat Sarra',
    checklistItems: [
      'J’ai laissé poser les sérums sans rincer le visage ce soir',
      'J’ai changé ma taie d’oreiller pour la nuit',
      'Je n’ai pas appliqué de maquillage occlusif',
      'J’ai évité les exfoliants et le rétinol',
      'J’applique mon écran solaire SPF 50+ chaque matin'
    ]
  },
  'prp': {
    id: 'care-prp',
    treatmentId: 'prp-cheveux-visage',
    category: 'regeneration',
    title: 'Soins Post-PRP (Plasma Riche en Plaquettes)',
    subtitle: 'Optimisation de la stimulation plaquettaire et des facteurs de croissance',
    description: 'Le PRP réinjecte vos propres facteurs de croissance concentrés pour stimuler la vascularisation des bulbes capillaires ou des fibroblastes dermiques. Le processus biologique de stimulation s’étale sur plusieurs semaines.',
    immediateCare: {
      hours: '0 à 24 Heures Post-Acte',
      instructions: [
        'Pour les cheveux : NE PAS se laver les cheveux ni mouiller le cuir chevelu pendant 24 à 48 heures',
        'Pour le visage : Laisser le film de plasma agir toute la nuit sans laver le visage',
        'Éviter de toucher ou frotter le cuir chevelu ou les micro-papules d’injection',
        'Dormir avec la tête surélevée sur une serviette propre'
      ]
    },
    shortTermCare: {
      days: 'J+2 à J+7 Post-Acte',
      instructions: [
        'Laver les cheveux avec un shampooing dermatologique doux à pH neutre sans sulfates',
        'Sécher délicatement en tamponnant avec une serviette tiède (éviter le sèche-cheveux brûlant)',
        'Prendre les compléments alimentaires prescrits par Dr. Ghaouat (Biotine, Zinc, Cystine B6)',
        'Masser très doucement le cuir chevelu du bout des doigts à partir de J+3 pour stimuler la micro-circulation'
      ]
    },
    forbiddenActions: [
      'NE PAS PRENDRE D’ANTI-INFLAMMATOIRES (Ibuprofène, Voltarène, Aspirine) pendant 10 jours : ils inhibent la dégranulation des plaquettes et annulent l’effet du PRP',
      'PAS de coloration, décoloration, lissage ou traitement chimique capillaire pendant 10 jours',
      'PAS de sport intense, cardio ou sauna pendant 48 heures',
      'PAS de port de casquette serrée ou casque de protection étouffant le cuir chevelu',
      'Éviction solaire totale sur le crâne ou le visage pendant 7 jours'
    ],
    recommendedProducts: [
      { name: 'Shampooing Doux Énergisant Anti-Chute', category: 'Hygiène capillaire', description: 'Sans parabènes, sans sulfates agressifs' },
      { name: 'Complexe Biotine & Minéraux', category: 'Complément nutritif', description: 'En cure de 3 mois pour nourrir le bulbe' },
      { name: 'Spray Apaisant Cuir Chevelu', category: 'Confort', description: 'Si sensation de tiraillement les premiers jours' }
    ],
    warningSigns: [
      'Fièvre inexpliquée ou chaleur excessive sur la zone injectée',
      'Écoulement ou douleur aiguë pulsatile au niveau d’un point d’injection'
    ],
    doctorAdviceQuote: '« La stimulation par PRP est progressive. Le bulbe pilaire se réactive dès la 2ème séance, avec un arrêt net de la chute et un épaississement mesurable de la tige pilaire à 3 mois. » — Dr. Ghaouat Sarra',
    checklistItems: [
      'Je n’ai pas pris d’anti-inflammatoires (aucun Ibuprofène)',
      'Je n’ai pas mouillé mes cheveux ou mon visage pendant 24h',
      'J’ai évité le sport intense et la sueur',
      'Je lave délicatement avec un shampooing doux neutre',
      'Je protège mon crâne du soleil direct'
    ]
  },
  'peeling': {
    id: 'care-peeling',
    treatmentId: 'peeling-chimique',
    category: 'facial',
    title: 'Soins Post-Peeling Chimique Médical',
    subtitle: 'Régénération de la couche épidermique et protection anti-rebond',
    description: 'Le peeling chimique stimule le renouvellement épidermique. Une légère desquamation (petites peaux mortes) apparaît généralement entre le 3ème et le 5ème jour.',
    immediateCare: {
      hours: '0 à 12 Heures Post-Acte',
      instructions: [
        'Brumiser abondamment avec de l’eau thermale fraîche pour apaiser la sensation d’échauffement',
        'Appliquer la crème réparatrice haute tolérance prescrite par le médecin en couche épaisse',
        'Ne pas rincer le visage à l’eau du robinet calcaire le soir même',
        'Ne pas se frotter les yeux ni toucher son visage sans s’être lavé les mains'
      ]
    },
    shortTermCare: {
      days: 'J+1 à J+7 Post-Acte',
      instructions: [
        'Appliquer une crème cicatrisante réparatrice 3 à 4 fois par jour dès que la peau tiraille',
        'Laisser les peaux mortes se détacher toutes seules : NE JAMAIS LES ARRACHER NI LES TIRER',
        'Appliquer impérativement un écran solaire SPF 50+ toutes les 2 heures en cas de sortie diurne',
        'Nettoyer le visage matin et soir avec une émulsion nettoyante sans frottement mécanique'
      ]
    },
    forbiddenActions: [
      'NE JAMAIS TIRER OU ARRACHER LES PETITES PEAUX MORTES (risque majeur de cicatrice et de tache pigmentaire)',
      'AUCUNE exposition au soleil direct pendant au moins 1 mois',
      'AUCUN gommage, masque purifiant à l’argile ou éponge konjac pendant 14 jours',
      'PAS de piscine publique chlorée, hammam ou sauna pendant 7 jours',
      'PAS de maquillage minéral ou couvrant avant la fin complète de la desquamation'
    ],
    recommendedProducts: [
      { name: 'Cicalfate+ Crème Réparatrice Protectrice (Avène)', category: 'Cicatrisant dermo', description: 'Application généreuse 3 à 4 fois par jour' },
      { name: 'Brumisateur d’Eau Thermale', category: 'Apaisant anti-échauffement', description: 'Plusieurs pulvérisations par jour' },
      { name: 'Crème Solaire Très Haute Protection SPF 50+', category: 'Photoprotection stricte', description: 'Chaque matin sans exception' }
    ],
    warningSigns: [
      'Brûlure persistante avec suintement ou croûtes jaunâtres épaisses',
      'Hyperpigmentation brutale ou apparition de taches sombres anormales'
    ],
    doctorAdviceQuote: '« La peau neuve sous le peeling est un épiderme de bébé ultra-sensible aux rayons UV. Votre écran solaire SPF 50+ est votre meilleur allié de protection. » — Dr. Ghaouat Sarra',
    checklistItems: [
      'J’ai appliqué ma crème réparatrice en couche épaisse',
      'Je n’ai absolument pas tiré sur les peaux mortes',
      'J’ai appliqué mon écran total SPF 50+',
      'J’ai brumisé mon visage à l’eau thermale',
      'J’ai évité toute exposition au soleil'
    ]
  }
};

// -------------------------------------------------------------------------
// INITIAL DEMO PATIENTS WITH RICH MEDICAL RECORD HISTORY
// -------------------------------------------------------------------------

export const DEMO_PATIENTS_DATABASE: PatientProfile[] = [
  {
    id: 'pat-101',
    pinCode: '1234',
    name: 'Rania Haddad',
    phone: '+213 551 22 33 44',
    email: 'rania.haddad@gmail.com',
    city: 'Khemis Miliana',
    dateOfBirth: '1992-06-14',
    phototype: 'Phototype III — Peau claire à intermédiaire',
    knownAllergies: ['Aucune allergie médicamenteuse connue'],
    memberSince: '2025-11-10',
    status: 'Privilège',
    doctorNotes: 'Patiente très assidue. Excellente réponse musculaire au Bocouture (Toxine botulique sans protéines complexantes). Recherche un rendu harmonieux et très naturel (Baby Botox). Traitement d’entretien programmé.',
    emergencyContact: '+213 550 11 22 33 (Époux)'
  },
  {
    id: 'pat-102',
    pinCode: '5678',
    name: 'Nadia Benali',
    phone: '+213 662 44 55 66',
    email: 'nadia.benali@yahoo.fr',
    city: 'Aïn Defla',
    dateOfBirth: '1995-09-22',
    phototype: 'Phototype IV — Peau mate méditerranéenne',
    knownAllergies: ['Sensibilité de contact aux sparadraps adhésifs'],
    memberSince: '2026-01-15',
    status: 'VIP',
    doctorNotes: 'Protocole épilation laser diode triple-onde en cours. Bilan séance 3 : réduction de 65% de la densité pilaire sur les demi-jambes. Tolérance cutanée excellente, aucun érythème persistant.',
    emergencyContact: '+213 661 99 88 77 (Famille)'
  },
  {
    id: 'pat-103',
    pinCode: '9012',
    name: 'Meriem Zenati',
    phone: '+213 770 88 99 00',
    email: 'meriem.z@outlook.com',
    city: 'Blida',
    dateOfBirth: '1998-03-30',
    phototype: 'Phototype III — Peau mixte',
    knownAllergies: ['Aucune'],
    memberSince: '2026-07-04',
    status: 'Régulier',
    doctorNotes: 'Préparation cutanée en vue d’un événement familial. Protocole Hydrafacial MD couplé à un peeling doux à l’acide mandélique pour resserrer les pores et illuminer le teint.',
    emergencyContact: '+213 771 22 44 66 (Mère)'
  },
  {
    id: 'pat-104',
    pinCode: '3456',
    name: 'Fatima Zohra K.',
    phone: '+213 540 11 22 33',
    email: 'fz.khelif@gmail.com',
    city: 'Khemis Miliana',
    dateOfBirth: '1989-11-05',
    phototype: 'Phototype III — Peau fine',
    knownAllergies: ['Intolérance aspirine à haute dose'],
    memberSince: '2025-09-18',
    status: 'VIP',
    doctorNotes: 'Suivi régulier comblement lèvres et skinbooster. Rendu Russian Lips très délicat réalisé en mars 2026. Prévoit une légère retouche d’hydratation 0.5ml.',
    emergencyContact: '+213 541 33 22 11 (Soeur)'
  }
];

export const INITIAL_TREATMENT_HISTORY: PatientTreatmentHistoryItem[] = [
  // ---------------- RANIA HADDAD HISTORY ----------------
  {
    id: 'th-101',
    patientPhone: '+213 551 22 33 44',
    treatmentId: 'botox-injections',
    treatmentName: 'Botox Front & Pattes d’oie (Baby Botox)',
    category: 'injectables',
    categoryLabel: 'Injectables & Botox',
    date: '2026-07-15',
    timeSlot: '11:00',
    doctorName: 'Dr. Ghaouat Sarra',
    zoneTreated: 'Région frontale, glabelle et pattes d’oie bilatérales',
    productOrDevice: 'Bocouture Merz Pharma 50U — Aiguilles 32G',
    batchNumber: 'LOT-BOC-2026A44',
    totalPriceDZD: 22000,
    status: 'completed',
    clinicalNotes: 'Examen initial : ridules d’expression dynamiques du front et du regard. Injection précise en micro-doses pour préserver la mobilité naturelle des sourcils. Absence totale de saignement.',
    doctorObservations: 'Contrôle à J+15 satisfaisant : lissage harmonieux du tiers supérieur, regard reposé et éclatant.',
    postCareSummary: [
      'Maintien de la position assise pendant 5 heures respecté par la patiente',
      'Pas de sport ni sauna pendant 48h',
      'Application d’eau thermale en brumisation'
    ],
    nextRecommendedSessionDate: '2026-11-15',
    patientSatisfactionRating: 5,
    healingStatus: 'healed'
  },
  {
    id: 'th-102',
    patientPhone: '+213 551 22 33 44',
    treatmentId: 'hydrafacial-vip',
    treatmentName: 'Hydrafacial VIP Booster + LED',
    category: 'facial',
    categoryLabel: 'Soins Visage Médicaux',
    date: '2026-05-20',
    timeSlot: '14:30',
    doctorName: 'Dr. Ghaouat Sarra',
    zoneTreated: 'Visage entier, cou et décolleté',
    productOrDevice: 'Appareil Hydrafacial MD Original + Sérums Antiox+ et Britenol',
    batchNumber: 'SER-HF-9812',
    totalPriceDZD: 8000,
    status: 'completed',
    clinicalNotes: 'Nettoyage en profondeur par vortex fusion, extraction indolore des comédons de la zone T, infusion d’acide hyaluronique et luminothérapie LED rouge 20 minutes.',
    doctorObservations: 'Teint clarifié, rebond cutané immédiat, aucun temps d’arrêt.',
    postCareSummary: [
      'Pas de maquillage pendant 24h',
      'Hydratation renforcée matin et soir',
      'Application d’écran SPF 50+'
    ],
    nextRecommendedSessionDate: '2026-06-20',
    patientSatisfactionRating: 5,
    healingStatus: 'healed'
  },
  {
    id: 'th-103',
    patientPhone: '+213 551 22 33 44',
    treatmentId: 'consultation-diagnostic',
    treatmentName: 'Consultation & Diagnostic Visia Initial',
    category: 'facial',
    categoryLabel: 'Consultation Médicale',
    date: '2025-11-10',
    timeSlot: '10:00',
    doctorName: 'Dr. Ghaouat Sarra',
    zoneTreated: 'Examen morphologique complet du visage',
    productOrDevice: 'Analyseur dermatologique Visia & Examen à la lampe de Wood',
    totalPriceDZD: 3000,
    status: 'completed',
    clinicalNotes: 'Bilan de santé cutanée. Analyse des volumes, phototype cutané III, recherche des contre-indications. Établissement du plan personnalisé de soins.',
    doctorObservations: 'Patiente éligible aux injectables et aux soins de resurfaçage.',
    postCareSummary: ['Remise de la fiche médicale d’information et devis détaillé'],
    patientSatisfactionRating: 5,
    healingStatus: 'healed'
  },

  // ---------------- NADIA BENALI HISTORY ----------------
  {
    id: 'th-201',
    patientPhone: '+213 662 44 55 66',
    treatmentId: 'laser-hair-removal',
    treatmentName: 'Épilation Laser Médicale — Séance 3 / 6',
    category: 'laser',
    categoryLabel: 'Épilation Laser Médicale',
    date: '2026-07-22',
    timeSlot: '15:00',
    doctorName: 'Dr. Ghaouat Sarra',
    zoneTreated: 'Demi-Jambes, Aisselles et Ligne Nombril',
    productOrDevice: 'Laser Médical Diode Triple Onde (755/808/1064nm) avec Cryo-Cooling -5°C',
    batchNumber: 'PARAM-FL-26J-40ms',
    totalPriceDZD: 9500,
    status: 'completed',
    clinicalNotes: 'Fluence adaptée à 26 J/cm², durée d’impulsion 40ms. Refroidissement cryogénique continu. Bonne élimination des follicules au passage de la pièce à main.',
    doctorObservations: 'Réduction de 65% de la pilosité visible. Poils repoussent beaucoup plus fins et clairsemés.',
    postCareSummary: [
      'Application immédiate de Biafine et Cicaplast Baume B5',
      'Éviction solaire stricte avec SPF 50+',
      'Aucun gommage pendant 7 jours'
    ],
    nextRecommendedSessionDate: '2026-09-10',
    patientSatisfactionRating: 5,
    healingStatus: 'healed'
  },
  {
    id: 'th-202',
    patientPhone: '+213 662 44 55 66',
    treatmentId: 'laser-hair-removal',
    treatmentName: 'Épilation Laser Médicale — Séance 2 / 6',
    category: 'laser',
    categoryLabel: 'Épilation Laser Médicale',
    date: '2026-06-10',
    timeSlot: '15:30',
    doctorName: 'Dr. Ghaouat Sarra',
    zoneTreated: 'Demi-Jambes et Aisselles',
    productOrDevice: 'Laser Médical Diode Triple Onde (755/808/1064nm)',
    batchNumber: 'PARAM-FL-24J-35ms',
    totalPriceDZD: 8200,
    status: 'completed',
    clinicalNotes: 'Deuxième passage. Très bonne tolérance à la fluence augmentée.',
    doctorObservations: 'Ralentissement marqué de la repousse sur les aisselles.',
    postCareSummary: ['Crème cicatrisante appliquée 3 fois par jour pendant 48h'],
    nextRecommendedSessionDate: '2026-07-22',
    patientSatisfactionRating: 5,
    healingStatus: 'healed'
  },
  {
    id: 'th-203',
    patientPhone: '+213 662 44 55 66',
    treatmentId: 'laser-hair-removal',
    treatmentName: 'Épilation Laser Médicale — Séance 1 / 6 + Test Spot',
    category: 'laser',
    categoryLabel: 'Épilation Laser Médicale',
    date: '2026-04-28',
    timeSlot: '14:00',
    doctorName: 'Dr. Ghaouat Sarra',
    zoneTreated: 'Demi-Jambes et Aisselles',
    productOrDevice: 'Laser Médical Diode Triple Onde (755/808/1064nm)',
    batchNumber: 'PARAM-FL-22J-30ms',
    totalPriceDZD: 8200,
    status: 'completed',
    clinicalNotes: 'Test de réactivité cutanée effectué 48h au préalable. Aucune réaction anormale. Première séance complète effectuée sans douleur grâce au système de froid.',
    doctorObservations: 'Tolérance parfaite chez cette patiente au phototype IV.',
    postCareSummary: ['Consignes post-laser remises en main propre'],
    nextRecommendedSessionDate: '2026-06-10',
    patientSatisfactionRating: 5,
    healingStatus: 'healed'
  },

  // ---------------- MERIEM ZENATI HISTORY ----------------
  {
    id: 'th-301',
    patientPhone: '+213 770 88 99 00',
    treatmentId: 'soin-nettoyant',
    treatmentName: 'Soin Nettoyant Profond & Peeling Doux',
    category: 'facial',
    categoryLabel: 'Soins Visage Médicaux',
    date: '2026-08-05',
    timeSlot: '11:00',
    doctorName: 'Dr. Ghaouat Sarra',
    zoneTreated: 'Visage et Cou',
    productOrDevice: 'Désincrustation ultrasons + Peeling doux à l’acide lactique 10%',
    batchNumber: 'PEEL-LAC-441',
    totalPriceDZD: 3500,
    status: 'completed',
    clinicalNotes: 'Purification des pores dilatés et élimination des comédons ouverts. Pose masque apaisant d’alginate marin.',
    doctorObservations: 'Grain de peau affiné, peau nette et confortable.',
    postCareSummary: [
      'Protection solaire SPF 50+ impérative',
      'Pas de gommage pendant 1 semaine',
      'Hydratation renforcée'
    ],
    nextRecommendedSessionDate: '2026-09-11',
    patientSatisfactionRating: 5,
    healingStatus: 'healed'
  },

  // ---------------- FATIMA ZOHRA K. HISTORY ----------------
  {
    id: 'th-401',
    patientPhone: '+213 540 11 22 33',
    treatmentId: 'hyaluronic-acid-fillers',
    treatmentName: 'Acide Hyaluronique Russian Lips (0.8ml)',
    category: 'injectables',
    categoryLabel: 'Injectables & Botox',
    date: '2026-03-12',
    timeSlot: '16:00',
    doctorName: 'Dr. Ghaouat Sarra',
    zoneTreated: 'Lèvre supérieure (arcs de cupidon) et lèvre inférieure',
    productOrDevice: 'Juvéderm Volift Allergan (1.0ml avec lidocaïne 0.3%)',
    batchNumber: 'LOT-JUV-VOL-88910',
    totalPriceDZD: 28000,
    status: 'completed',
    clinicalNotes: 'Technique d’injection verticale par micro-colonnes (technique Russian) pour éverser délicatement la lèvre sans projection excessive vers l’avant (pas d’effet canard). Volume utilisé : 0.8ml.',
    doctorObservations: 'Résultat à 1 mois : lèvre redéfinie, profil élégant, excellente souplesse tissulaire.',
    postCareSummary: [
      'Application de compresses froides les premières 4 heures',
      'Baume Cicalfate Lèvres appliqué 4 fois par jour',
      'Hydratation orale 2L/jour'
    ],
    nextRecommendedSessionDate: '2026-09-12',
    patientSatisfactionRating: 5,
    healingStatus: 'healed'
  },
  {
    id: 'th-402',
    patientPhone: '+213 540 11 22 33',
    treatmentId: 'skinbooster-nctf',
    treatmentName: 'Skinbooster Polydermique NCTF 135 HA',
    category: 'facial',
    categoryLabel: 'Mésothérapie & Régénération',
    date: '2026-05-15',
    timeSlot: '16:30',
    doctorName: 'Dr. Ghaouat Sarra',
    zoneTreated: 'Cou et Décolleté',
    productOrDevice: 'Fillmed NCTF 135 HA (55 ingrédients polyrevitalisants)',
    batchNumber: 'LOT-FIL-NCTF-2026',
    totalPriceDZD: 13000,
    status: 'completed',
    clinicalNotes: 'Micro-papules dermiques superficielles espacées de 1cm pour revitaliser la texture froissée du cou.',
    doctorObservations: 'Hydratation profonde retrouvée, réduction des ridules horizontales du cou.',
    postCareSummary: ['Disparition complète des petites papules en 24 heures'],
    nextRecommendedSessionDate: '2026-06-15',
    patientSatisfactionRating: 5,
    healingStatus: 'healed'
  }
];

// Helper to find care advice for a treatment or category
export function getCareProtocolForTreatment(treatmentIdOrCategory: string): PostProcedureCareProtocol {
  const normalized = (treatmentIdOrCategory || '').toLowerCase();
  
  if (normalized.includes('botox') || normalized.includes('toxine')) {
    return POST_PROCEDURE_CARE_PROTOCOLS['botox'];
  }
  if (normalized.includes('filler') || normalized.includes('hyaluronique') || normalized.includes('levre') || normalized.includes('lèvre') || normalized.includes('bacio') || normalized.includes('lip')) {
    return POST_PROCEDURE_CARE_PROTOCOLS['fillers'];
  }
  if (normalized.includes('laser') || normalized.includes('epilation') || normalized.includes('épilation')) {
    return POST_PROCEDURE_CARE_PROTOCOLS['laser'];
  }
  if (normalized.includes('hydrafacial') || normalized.includes('nettoyant') || normalized.includes('facial') || normalized.includes('black doll')) {
    return POST_PROCEDURE_CARE_PROTOCOLS['hydrafacial'];
  }
  if (normalized.includes('prp') || normalized.includes('cheveux') || normalized.includes('plasma')) {
    return POST_PROCEDURE_CARE_PROTOCOLS['prp'];
  }
  if (normalized.includes('peeling') || normalized.includes('acide') || normalized.includes('meso') || normalized.includes('nctf') || normalized.includes('ejal')) {
    return POST_PROCEDURE_CARE_PROTOCOLS['peeling'];
  }

  // Default fallback
  return POST_PROCEDURE_CARE_PROTOCOLS['hydrafacial'];
}
