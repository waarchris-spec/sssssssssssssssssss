import laserImg from '@/src/assets/images/regenerated_image_1788824049965.jpg';
import botoxImg from '@/src/assets/images/regenerated_image_1788824051653.jpg';
import fillersImg from '@/src/assets/images/regenerated_image_1788821569480.jpg';
import hydrafacialImg from '@/src/assets/images/regenerated_image_1788821571843.jpg';

export interface ServiceVariant {
  id: string;
  name: string;
  priceDZD: number;
  oldPriceDZD?: number;
  durationMinutes?: number;
  description?: string;
  isPopular?: boolean;
}

export interface Service {
  id: string;
  name: string;
  nameAr?: string;
  category: 'laser' | 'injectables' | 'facial' | 'body' | 'regeneration';
  categoryLabel: string;
  subCategory?: string;
  shortDescription: string;
  fullDescription: string;
  heroImage: string;
  galleryImages?: string[];
  priceDZD: number;
  priceNote?: string;
  durationMinutes: number;
  recoveryDays?: string;
  painLevel?: number; // 0 to 5
  recommendedSessions?: string;
  availability: 'available' | 'few_slots' | 'by_consultation';
  bookingEnabled: boolean;
  variants?: ServiceVariant[];
  promotionalPriceDZD?: number;
  oldPriceDZD?: number;
  notes?: string;
  benefits?: string[];
  procedureSteps?: { title: string; desc: string }[];
  contraindications?: string[];
  faqs?: { question: string; answer: string }[];
  doctorAdvice?: string;
  featured?: boolean;
}

const getImageSrc = (img: string | { src: string }) => (typeof img === 'string' ? img : img.src);

export const SERVICES: Service[] = [
  // ==========================================
  // 1. SOINS VISAGE & NETTOYAGE
  // ==========================================
  {
    id: 'soin-nettoyant',
    name: 'Soin Nettoyant Simple',
    nameAr: 'تنظيف البشرة الكلاسيكي',
    category: 'facial',
    categoryLabel: 'Soins Visage',
    subCategory: 'Soins Visage',
    shortDescription: 'Nettoyage en profondeur, désincrustation des impuretés et hydratation essentielle.',
    fullDescription: 'Un protocole dermatologique doux et complet pour purifier l’épiderme, éliminer les comédons et redonner de la fraîcheur au teint.',
    heroImage: getImageSrc(hydrafacialImg),
    priceDZD: 2500,
    durationMinutes: 45,
    availability: 'available',
    bookingEnabled: true,
    benefits: ['Élimination des impuretés', 'Pores resserrés', 'Teint frais et éclatant'],
  },
  {
    id: 'hydrafacial-simple',
    name: 'Hydrafacial Simple',
    nameAr: 'هيدرافيشل طبي بسيط',
    category: 'facial',
    categoryLabel: 'Soins Visage',
    subCategory: 'Soins Visage',
    shortDescription: 'Protocole breveté Vortex-Fusion : nettoyage profond, exfoliation et infusion d’antioxydants.',
    fullDescription: 'Le soin culte pour purifier la peau sans agression. Désobstrue les pores, élimine points noirs et cellules mortes, tout en infusant des sérums hydratants et nourrissants.',
    heroImage: getImageSrc(hydrafacialImg),
    priceDZD: 6000,
    durationMinutes: 60,
    availability: 'available',
    bookingEnabled: true,
    featured: true,
    variants: [
      { id: 'hydra-std', name: 'Hydrafacial Simple (Séance Standard)', priceDZD: 6000, durationMinutes: 60 },
      { id: 'hydra-vip', name: 'Hydrafacial VIP (Booster + Luminothérapie)', priceDZD: 8000, durationMinutes: 75, isPopular: true },
    ],
    benefits: ['Éclat immédiat sans éviction', 'Nettoyage et extraction indolores', 'Hydratation intense'],
  },
  {
    id: 'hydrafacial-vip',
    name: 'Hydrafacial VIP',
    nameAr: 'هيدرافيشل VIP متكامل',
    category: 'facial',
    categoryLabel: 'Soins Visage',
    subCategory: 'Soins Visage',
    shortDescription: 'Soin Hydrafacial complet enrichi de boosters ciblés anti-âge et photothérapie LED médicale.',
    fullDescription: 'Expérience d’excellence combinant l’aspiration vortex, peeling léger, masque hydrojelly régénérant et séance de luminothérapie LED pour stimuler le collagène.',
    heroImage: getImageSrc(hydrafacialImg),
    priceDZD: 8000,
    durationMinutes: 75,
    availability: 'available',
    bookingEnabled: true,
    benefits: ['Régénération cellulaire profonde', 'Effet tenseur & coup d’éclat', 'Traitement personnalisé selon phototype'],
  },
  {
    id: 'carbon-peel-laser',
    name: 'Carbon Peel Laser (Hollywood Peel)',
    nameAr: 'تقشير الكربون بالليزر',
    category: 'facial',
    categoryLabel: 'Soins Visage',
    subCategory: 'Soins Visage',
    shortDescription: 'Association d’un masque au carbone actif et d’un tir laser Q-Switched pour exfolier et lisser la peau.',
    fullDescription: 'Le soin Hollywood Peel par excellence : resserre les pores dilatés, régule la production de sébum, atténue les taches et ravive l’éclat sans aucune éviction sociale.',
    heroImage: 'https://images.unsplash.com/photo-1512290900672-1f02e71d34f0?q=80&w=1200&auto=format&fit=crop',
    priceDZD: 6000,
    durationMinutes: 45,
    availability: 'available',
    bookingEnabled: true,
    benefits: ['Pores instantanément resserrés', 'Effet matifiant anti-sébum', 'Teint unifié et lumineux'],
  },
  {
    id: 'radiofrequence-visage',
    name: 'Radiofréquence Visage',
    nameAr: 'شد الوجه بالراديو فريكونسي',
    category: 'facial',
    categoryLabel: 'Soins Visage',
    subCategory: 'Soins Visage',
    shortDescription: 'Ondes électromagnétiques chauffantes pour stimuler la synthèse naturelle d’élastine et de collagène.',
    fullDescription: 'Traitement non invasif du relâchement cutané du visage, de l’ovale et du cou. Redéfinit les contours du visage et lisse les ridules.',
    heroImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1200&auto=format&fit=crop',
    priceDZD: 4000,
    durationMinutes: 45,
    availability: 'available',
    bookingEnabled: true,
    benefits: ['Effet liftant naturel', 'Amélioration de la fermeté cutanée', 'Non douloureux et relaxant'],
  },
  {
    id: 'microneedling-visage',
    name: 'Microneedling Visage Médical',
    nameAr: 'مايكرونيدلينغ طبي للوجه',
    category: 'facial',
    categoryLabel: 'Soins Visage',
    subCategory: 'Soins Visage',
    shortDescription: 'Micro-perforations contrôlées avec infusion de complexes polyvitaminés et d’acide hyaluronique.',
    fullDescription: 'Active la régénération cellulaire et la synthèse de collagène. Idéal pour traiter les cicatrices d’acné, les pores dilatés et le grain de peau irrégulier.',
    heroImage: 'https://images.unsplash.com/photo-1512290900672-1f02e71d34f0?q=80&w=1200&auto=format&fit=crop',
    priceDZD: 4500,
    durationMinutes: 45,
    availability: 'available',
    bookingEnabled: true,
    benefits: ['Atténuation des cicatrices d’acné', 'Resserrement du grain de peau', 'Stimulation collagénique intense'],
  },
  {
    id: 'dermaplaning',
    name: 'Dermaplaning Médical',
    nameAr: 'ديرمابلانينغ طبي',
    category: 'facial',
    categoryLabel: 'Soins Visage',
    subCategory: 'Soins Visage',
    shortDescription: 'Exfoliation douce au bistouri chirurgical stérile pour éliminer le duvet et les peaux mortes.',
    fullDescription: 'Procédure médicale minutieuse laissant la peau ultra-lisse comme de la soie, optimisant la pénétration des sérums et l’éclat naturel.',
    heroImage: getImageSrc(hydrafacialImg),
    priceDZD: 4000,
    durationMinutes: 40,
    availability: 'available',
    bookingEnabled: true,
    benefits: ['Peau instantanément douce et soyeuse', 'Élimination du duvet facial', 'Application parfaite du maquillage'],
  },

  // ==========================================
  // 2. PRP (PLASMA RICHE EN PLAQUETTES)
  // ==========================================
  {
    id: 'prp-visage',
    name: 'PRP Visage (Vampire Facial)',
    nameAr: 'حقن البلازما الغنية بالصفائح للوجه',
    category: 'regeneration',
    categoryLabel: 'PRP Régénératif',
    subCategory: 'PRP',
    shortDescription: 'Régénération autologue par injection de vos propres facteurs de croissance plaquettaires.',
    fullDescription: 'Le PRP réveille la jeunesse cutanée en boostant la vascularisation et la fermeté. 100% biocompatible, stérile et sans risque d’allergie.',
    heroImage: 'https://images.unsplash.com/photo-1512290900672-1f02e71d34f0?q=80&w=1200&auto=format&fit=crop',
    priceDZD: 6500,
    durationMinutes: 45,
    availability: 'available',
    bookingEnabled: true,
    benefits: ['Teint revitalisé et repulpé', 'Amélioration de la tonicité de la peau', 'Facteurs de croissance 100% naturels'],
  },
  {
    id: 'prp-cheveux',
    name: 'PRP Cheveux (Anti-Chute & Repousse)',
    nameAr: 'حقن البلازما للشعر ومكافحة التساقط',
    category: 'regeneration',
    categoryLabel: 'PRP Régénératif',
    subCategory: 'PRP',
    shortDescription: 'Freine la chute de cheveux, stimule les follicules dormants et renforce la fibre capillaire.',
    fullDescription: 'Protocole médical de choix contre l’alopécie androgénique, la chute saisonnière ou post-partum. Revitalise le cuir chevelu en profondeur.',
    heroImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1200&auto=format&fit=crop',
    priceDZD: 6500,
    durationMinutes: 45,
    availability: 'available',
    bookingEnabled: true,
    variants: [
      { id: 'prp-hair-std', name: 'PRP Cheveux Standard (1 séance)', priceDZD: 6500, durationMinutes: 45 },
      { id: 'prp-hair-biotine', name: 'PRP Cheveux + Biotine Booster (1 séance)', priceDZD: 9500, durationMinutes: 50, isPopular: true },
    ],
    benefits: ['Ralentissement significatif de la chute', 'Épaississement de la tige capillaire', 'Densité et vitalité retrouvées'],
  },
  {
    id: 'prp-cheveux-biotine',
    name: 'PRP Cheveux + Biotine',
    nameAr: 'حقن البلازما مع البيوتين المقوي للشعر',
    category: 'regeneration',
    categoryLabel: 'PRP Régénératif',
    subCategory: 'PRP',
    shortDescription: 'Synergie puissante combinant le plasma riche en plaquettes et une ampoule concentrée de biotine & vitamines.',
    fullDescription: 'Formule renforcée pour des résultats accélérés sur la densité et la brillance des cheveux fragiles ou clairsemés.',
    heroImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1200&auto=format&fit=crop',
    priceDZD: 9500,
    durationMinutes: 50,
    availability: 'available',
    bookingEnabled: true,
    benefits: ['Action fortifiante démultipliée', 'Nutrition directe des bulbes pileux', 'Résultats visibles dès 3 semaines'],
  },

  // ==========================================
  // 3. PEELINGS MÉDICAUX
  // ==========================================
  {
    id: 'peeling-visage',
    name: 'Peeling Visage Médical',
    nameAr: 'التقشير الطبي للوجه',
    category: 'facial',
    categoryLabel: 'Peelings',
    subCategory: 'Peeling',
    shortDescription: 'Acides de fruits ou salicylique/TCA pour renouveler l’épiderme et traiter taches et imperfections.',
    fullDescription: 'Exfoliation chimique médicale contrôlée adaptée au type de peau : affine le grain, élimine les taches pigmentaires et lisse le relief cutané.',
    heroImage: 'https://images.unsplash.com/photo-1512290900672-1f02e71d34f0?q=80&w=1200&auto=format&fit=crop',
    priceDZD: 7000,
    durationMinutes: 30,
    availability: 'available',
    bookingEnabled: true,
    benefits: ['Régulation du sébum et anti-acné', 'Atténuation des taches brunes', 'Renouvellement cutané global'],
  },
  {
    id: 'peeling-mains',
    name: 'Peeling Mains',
    nameAr: 'التقشير الطبي لليدين',
    category: 'facial',
    categoryLabel: 'Peelings',
    subCategory: 'Peeling',
    shortDescription: 'Rajeunissement et dépigmentation des mains pour effacer les taches de soleil et ridules.',
    fullDescription: 'Protocole dépigmentant et hydratant conçu spécifiquement pour la peau fine des mains exposée au vieillissement prématuré.',
    heroImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1200&auto=format&fit=crop',
    priceDZD: 4000,
    durationMinutes: 30,
    availability: 'available',
    bookingEnabled: true,
    benefits: ['Éclaircissement des taches solaires', 'Peau des mains lissée et rajeunie'],
  },
  {
    id: 'peeling-dos',
    name: 'Peeling Dos',
    nameAr: 'التقشير الطبي للظهر',
    category: 'body',
    categoryLabel: 'Peelings',
    subCategory: 'Peeling',
    shortDescription: 'Traitement des imperfections, boutons d’acné et taches pigmentaires sur le dos.',
    fullDescription: 'Assainit en profondeur la peau du dos, désincruste les follicules obstrués et prévient les récidives d’imperfections corporelles.',
    heroImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1200&auto=format&fit=crop',
    priceDZD: 7000,
    durationMinutes: 45,
    availability: 'available',
    bookingEnabled: true,
    benefits: ['Dos net et lisse', 'Traitement efficace de l’acné dorsale'],
  },
  {
    id: 'peeling-corps',
    name: 'Peeling Corps',
    nameAr: 'التقشير الطبي للجسم والمناطق الحساسة',
    category: 'body',
    categoryLabel: 'Peelings',
    subCategory: 'Peeling',
    shortDescription: 'Zones ciblées (coudes, genoux, aisselles, maillot) pour unifier le teint et estomper l’hyperpigmentation.',
    fullDescription: 'Formules dépigmentantes douces mais hautement efficaces pour éclaircir les zones de frottement et peaux épaissies.',
    heroImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1200&auto=format&fit=crop',
    priceDZD: 7000,
    durationMinutes: 45,
    availability: 'available',
    bookingEnabled: true,
    benefits: ['Éclaircissement visible des zones foncées', 'Texture de peau soyeuse'],
  },

  // ==========================================
  // 4. SKINBOOSTERS & MÉSO-HYDRATATION
  // ==========================================
  {
    id: 'skinbooster-hydra',
    name: 'Skinbooster Hydra',
    nameAr: 'سكين بوستر هيدرا للترطيب العميق',
    category: 'injectables',
    categoryLabel: 'Skinboosters',
    subCategory: 'Skinbooster',
    shortDescription: 'Bain d’hydratation profonde à l’acide hyaluronique non réticulé pour repulper la peau.',
    fullDescription: 'Micro-injections d’acide hyaluronique fluide pour restaurer la réserve en eau du derme, lisser les ridules de déshydratation et défroisser la peau.',
    heroImage: getImageSrc(fillersImg),
    priceDZD: 14000,
    durationMinutes: 45,
    availability: 'available',
    bookingEnabled: true,
    benefits: ['Hydratation longue durée de l’intérieur', 'Élasticité et souplesse cutanée retrouvées'],
  },
  {
    id: 'skinbooster-glow',
    name: 'Skinbooster Glow',
    nameAr: 'سكين بوستر غلو للإشراقة الماسية',
    category: 'injectables',
    categoryLabel: 'Skinboosters',
    subCategory: 'Skinbooster',
    shortDescription: 'Cocktail booster d’éclat associant acide hyaluronique, acides aminés et vitamines antioxydantes.',
    fullDescription: 'Idéal avant un événement ou pour illuminer un teint terne et fatigué. Procure un glow spectaculaire et naturel.',
    heroImage: getImageSrc(fillersImg),
    priceDZD: 14000,
    durationMinutes: 45,
    availability: 'available',
    bookingEnabled: true,
    benefits: ['Coup d’éclat immédiat', 'Nutrition cellulaire complète', 'Grain de peau affiné'],
  },
  {
    id: 'skinbooster-rejuvenating',
    name: 'Skinbooster Rejuvenating',
    nameAr: 'سكين بوستر ريجوفينيتينغ لتجديد الشباب',
    category: 'injectables',
    categoryLabel: 'Skinboosters',
    subCategory: 'Skinbooster',
    shortDescription: 'Formule anti-âge hautement dosée pour redensifier le derme mature et lisser les ridules.',
    fullDescription: 'Booste la production de néo-collagène et d’élastine. Traite le relâchement débutant du visage, du cou et du décolleté.',
    heroImage: getImageSrc(fillersImg),
    priceDZD: 16000,
    durationMinutes: 45,
    availability: 'available',
    bookingEnabled: true,
    benefits: ['Redensification de la matrice dermique', 'Effet tenseur doux et naturel'],
  },
  {
    id: 'skinbooster-lumieyes',
    name: 'Skinbooster Lumi Eyes',
    nameAr: 'لومي آيز لعلاج الهالات والتجاعيد حول العين',
    category: 'injectables',
    categoryLabel: 'Skinboosters',
    subCategory: 'Skinbooster',
    shortDescription: 'Polynucléotides dédiés au contour des yeux : éclaircit les cernes et lisse la zone péri-orbitaire.',
    fullDescription: 'Traitement médical innovant ciblant la zone fragile du contour des yeux. Éclaircit les cernes pigmentaires et vasculaires, diminue les poches et efface les ridules.',
    heroImage: getImageSrc(fillersImg),
    priceDZD: 16000,
    durationMinutes: 45,
    availability: 'available',
    bookingEnabled: true,
    benefits: ['Regard défatigué et lumineux', 'Éclaircissement remarquable des cernes', 'Tolérance parfaite'],
  },
  {
    id: 'skinbooster-profhilo',
    name: 'Profhilo® 2ml (Biolifting Cellulaire)',
    nameAr: 'بروفايلو هجين الهيالورونيك عالي النقاء',
    category: 'injectables',
    categoryLabel: 'Skinboosters',
    subCategory: 'Skinbooster',
    shortDescription: 'Acide hyaluronique hybride ultra-pur haute et basse masse moléculaire injecté en 5 points BAP.',
    fullDescription: 'Le soin tenseur par excellence. Remodèle les tissus relâchés sans créer de volume artificiel. 100% sans BDDE, résultat ultra naturel.',
    heroImage: getImageSrc(fillersImg),
    priceDZD: 25000,
    durationMinutes: 45,
    availability: 'available',
    bookingEnabled: true,
    featured: true,
    benefits: ['Remodelage dynamique des tissus', 'Effet tenseur sans modification des volumes', '5 points d’injection confortables'],
  },

  // ==========================================
  // 5. BOTOX (TOXINE BOTULIQUE)
  // ==========================================
  {
    id: 'botox-full-face',
    name: 'Botox FULL FACE',
    nameAr: 'بوتوكس الوجه الكامل (3 مناطق)',
    category: 'injectables',
    categoryLabel: 'Botox',
    subCategory: 'Botox',
    shortDescription: 'Lissage complet du tiers supérieur (front, ride du lion, pattes d’oie) sans figer les expressions.',
    fullDescription: 'Détend harmonieusement les muscles responsables des rides dynamiques. Vous conservez vos expressions avec un regard reposé et rajeuni de plusieurs années.',
    heroImage: getImageSrc(botoxImg),
    priceDZD: 30000,
    priceNote: 'À partir de 30 000 DA',
    durationMinutes: 45,
    availability: 'available',
    bookingEnabled: true,
    featured: true,
    variants: [
      { id: 'botox-full', name: 'Botox FULL FACE (Front + Ride du Lion + Pattes d’oie)', priceDZD: 30000, isPopular: true },
      { id: 'botox-front-var', name: 'Botox Front & Glabelle', priceDZD: 15000 },
      { id: 'botox-half-var', name: 'Botox 0.5ml (Retouche / Petite zone)', priceDZD: 6000 },
    ],
    benefits: ['Effacement des rides d’expression', 'Effet reposé et lifté du regard', 'Résultat naturel garanti sous contrôle médical'],
  },
  {
    id: 'botox-front',
    name: 'Botox FRONT',
    nameAr: 'بوتوكس الجبهة',
    category: 'injectables',
    categoryLabel: 'Botox',
    subCategory: 'Botox',
    shortDescription: 'Lissage ciblé des lignes horizontales du front et de la glabelle.',
    fullDescription: 'Défroisse les rides de préoccupation du front pour un visage serein et ouvert.',
    heroImage: getImageSrc(botoxImg),
    priceDZD: 15000,
    priceNote: 'À partir de 15 000 DA',
    durationMinutes: 30,
    availability: 'available',
    bookingEnabled: true,
    benefits: ['Front lisse et rajeuni', 'Prévention des cassures cutanées'],
  },
  {
    id: 'botox-0-5ml',
    name: 'BOTOX 0.5ml',
    nameAr: 'بوتوكس 0.5 مل / منطقة محددة',
    category: 'injectables',
    categoryLabel: 'Botox',
    subCategory: 'Botox',
    shortDescription: 'Dose ciblée pour petite zone (bunny lines, ride du lion isolée ou retouche).',
    fullDescription: 'Précision millimétrique pour traiter une zone isolée ou parfaire un résultat existant.',
    heroImage: getImageSrc(botoxImg),
    priceDZD: 6000,
    durationMinutes: 25,
    availability: 'available',
    bookingEnabled: true,
    benefits: ['Dosage sur-mesure', 'Idéal pour baby botox ou micro-correction'],
  },

  // ==========================================
  // 6. FILLERS (ACIDE HYALURONIQUE)
  // ==========================================
  {
    id: 'filler-levres-0-5ml',
    name: 'Filler Lèvres 0.5ml',
    nameAr: 'فيلر الشفاه 0.5 مل (ترطيب وتحديد طبيعي)',
    category: 'injectables',
    categoryLabel: 'Filler',
    subCategory: 'Filler',
    shortDescription: 'Sublimation discrète des lèvres : définition de l’arc de Cupidon et hydratation subtile.',
    fullDescription: 'Idéal pour une première expérience d’injection ou pour apporter une légère sensualité sans excès de volume. Acide hyaluronique de grade médical supérieur.',
    heroImage: getImageSrc(fillersImg),
    priceDZD: 12000,
    durationMinutes: 45,
    availability: 'available',
    bookingEnabled: true,
    featured: true,
    variants: [
      { id: 'filler-lip-05', name: 'Filler Lèvres 0.5ml (Volume doux & contour)', priceDZD: 12000, isPopular: true },
      { id: 'filler-lip-10', name: 'Filler Lèvres 1.0ml complet (Russian Lips / Repulpage)', priceDZD: 24000 },
    ],
    benefits: ['Contour net et bien dessiné', 'Effet repulpé ultra naturel', 'Résultat immédiat durable 9-12 mois'],
  },

  // ==========================================
  // 7. LIPBOOSTER
  // ==========================================
  {
    id: 'lipbooster-bacio',
    name: 'BACIO (Hydratant Lips)',
    nameAr: 'باشيو لترطيب ونضارة الشفاه بدون تكبير',
    category: 'injectables',
    categoryLabel: 'Lipbooster',
    subCategory: 'Lipbooster',
    shortDescription: 'Booster d’hydratation intense pour les lèvres gercées, déshydratées ou ternes sans ajout de volume.',
    fullDescription: 'Inonde les lèvres d’hydratation cellulaire, ravive leur couleur rosée naturelle et lisse les ridules péribuccales sans modifier la morphologie.',
    heroImage: getImageSrc(fillersImg),
    priceDZD: 22000,
    durationMinutes: 40,
    availability: 'available',
    bookingEnabled: true,
    benefits: ['Lèvres intensément douces et hydratées', 'Couleur naturelle rehaussée', 'Zéro effet gonflé'],
  },

  // ==========================================
  // 8. ÉPILATION LASER DIODE 2025 - VISAGE
  // ==========================================
  {
    id: 'laser-cou',
    name: 'Épilation Laser Cou',
    nameAr: 'إزالة شعر الرقبة بالليزر',
    category: 'laser',
    categoryLabel: 'Épilation Laser',
    subCategory: 'Visage',
    shortDescription: 'Élimination définitive des poils du cou avec technologie laser Diode indolore.',
    fullDescription: 'Laser Diode médical de pointe avec embout réfrigérant à -5°C pour une peau nette et sans rougeur.',
    heroImage: getImageSrc(laserImg),
    priceDZD: 2500,
    durationMinutes: 20,
    availability: 'available',
    bookingEnabled: true,
    variants: [
      { id: 'laser-cou-1', name: '1 Séance Cou', priceDZD: 2500 },
      { id: 'laser-cou-3', name: 'Forfait 3 Séances Cou', priceDZD: 6700, oldPriceDZD: 7500, isPopular: true },
    ],
    benefits: ['Fin des poils incarnés', 'Séance rapide en 15 min', 'Confort cryogénique maximal'],
  },
  {
    id: 'laser-moustache',
    name: 'Épilation Laser Moustache',
    nameAr: 'إزالة شعر الشارب بالليزر',
    category: 'laser',
    categoryLabel: 'Épilation Laser',
    subCategory: 'Visage',
    shortDescription: 'Épilation ultra-précise de la lèvre supérieure.',
    fullDescription: 'Supprime définitivement le duvet foncé et les poils drus de la lèvre supérieure avec douceur.',
    heroImage: getImageSrc(laserImg),
    priceDZD: 2000,
    durationMinutes: 15,
    availability: 'available',
    bookingEnabled: true,
    variants: [
      { id: 'laser-moust-1', name: '1 Séance Moustache', priceDZD: 2000 },
      { id: 'laser-moust-3', name: 'Forfait 3 Séances Moustache', priceDZD: 5400, oldPriceDZD: 6000, isPopular: true },
    ],
    benefits: ['Précision dermatologique', 'Séance éclair en 10 minutes'],
  },
  {
    id: 'laser-menton',
    name: 'Épilation Laser Menton',
    nameAr: 'إزالة شعر الذقن بالليزر',
    category: 'laser',
    categoryLabel: 'Épilation Laser',
    subCategory: 'Visage',
    shortDescription: 'Élimination des poils hormonaux et récalcitrants du menton.',
    fullDescription: 'Paramétrage laser sécurisé pour traiter efficacement la zone du menton sans risque d’effet rebond.',
    heroImage: getImageSrc(laserImg),
    priceDZD: 2500,
    durationMinutes: 15,
    availability: 'available',
    bookingEnabled: true,
    variants: [
      { id: 'laser-menton-1', name: '1 Séance Menton', priceDZD: 2500 },
      { id: 'laser-menton-3', name: 'Forfait 3 Séances Menton', priceDZD: 6700, oldPriceDZD: 7500, isPopular: true },
    ],
    benefits: ['Cible les poils drus', 'Contrôle médical rigoureux'],
  },
  {
    id: 'laser-pattes',
    name: 'Épilation Laser Pattes',
    nameAr: 'إزالة شعر السوالف بالليزر',
    category: 'laser',
    categoryLabel: 'Épilation Laser',
    subCategory: 'Visage',
    shortDescription: 'Dessin et affinement net des pattes faciales.',
    fullDescription: 'Nettoie harmonieusement les contours du visage pour un profil parfait.',
    heroImage: getImageSrc(laserImg),
    priceDZD: 2000,
    durationMinutes: 15,
    availability: 'available',
    bookingEnabled: true,
    variants: [
      { id: 'laser-pattes-1', name: '1 Séance Pattes', priceDZD: 2000 },
      { id: 'laser-pattes-3', name: 'Forfait 3 Séances Pattes', priceDZD: 5400, oldPriceDZD: 6000, isPopular: true },
    ],
    benefits: ['Ligne nette et harmonieuse', 'Indolore'],
  },
  {
    id: 'laser-visage-entier',
    name: 'Épilation Laser Visage Entier',
    nameAr: 'إزالة شعر الوجه كاملاً بالليزر',
    category: 'laser',
    categoryLabel: 'Épilation Laser',
    subCategory: 'Visage',
    shortDescription: 'Couverture intégrale du visage (front, joues, lèvre supérieure, menton, ovale).',
    fullDescription: 'Protocole complet pour une peau de porcelaine nette et durablement lisse.',
    heroImage: getImageSrc(laserImg),
    priceDZD: 5000,
    durationMinutes: 30,
    availability: 'available',
    bookingEnabled: true,
    featured: true,
    variants: [
      { id: 'laser-visage-1', name: '1 Séance Visage Entier', priceDZD: 5000 },
      { id: 'laser-visage-3', name: 'Forfait 3 Séances Visage Entier', priceDZD: 13500, oldPriceDZD: 15000, isPopular: true },
    ],
    benefits: ['Élimination globale des poils du visage', 'Teint éclairci et soyeux'],
  },

  // ==========================================
  // 9. ÉPILATION LASER DIODE 2025 - BRAS
  // ==========================================
  {
    id: 'laser-aisselles',
    name: 'Épilation Laser Aisselles',
    nameAr: 'إزالة شعر الإبطين بالليزر',
    category: 'laser',
    categoryLabel: 'Épilation Laser',
    subCategory: 'Bras',
    shortDescription: 'Traitement star rapide et radical pour des aisselles nettes à 100%.',
    fullDescription: 'Dites adieu aux poils incarnés et aux ombres sous les bras en seulement quelques séances rapides.',
    heroImage: getImageSrc(laserImg),
    priceDZD: 3700,
    durationMinutes: 20,
    availability: 'available',
    bookingEnabled: true,
    featured: true,
    variants: [
      { id: 'laser-aisselles-1', name: '1 Séance Aisselles', priceDZD: 3700 },
      { id: 'laser-aisselles-3', name: 'Forfait 3 Séances Aisselles', priceDZD: 10000, oldPriceDZD: 11000, isPopular: true },
    ],
    benefits: ['Séance en 15 minutes chrono', 'Suppression totale des poils incarnés', 'Effet blanchissant progressif'],
  },
  {
    id: 'laser-avant-bras',
    name: 'Épilation Laser Avant Bras',
    nameAr: 'إزالة شعر الساعدين بالليزر',
    category: 'laser',
    categoryLabel: 'Épilation Laser',
    subCategory: 'Bras',
    shortDescription: 'Épilation définitive des deux avant-bras.',
    fullDescription: 'Élimine le duvet foncé et les poils des bras avec homogénéité.',
    heroImage: getImageSrc(laserImg),
    priceDZD: 4500,
    durationMinutes: 30,
    availability: 'available',
    bookingEnabled: true,
    variants: [
      { id: 'laser-ab-1', name: '1 Séance Avant-Bras', priceDZD: 4500 },
      { id: 'laser-ab-3', name: 'Forfait 3 Séances Avant-Bras', priceDZD: 12100, oldPriceDZD: 13500, isPopular: true },
    ],
    benefits: ['Peau nette et douce', 'Balayage rapide'],
  },
  {
    id: 'laser-bras-superieur',
    name: 'Épilation Laser Bras Supérieur',
    nameAr: 'إزالة شعر الجزء العلوي من الذراعين',
    category: 'laser',
    categoryLabel: 'Épilation Laser',
    subCategory: 'Bras',
    shortDescription: 'Traitement des épaules et de la partie haute des bras.',
    fullDescription: 'Idéal pour éliminer les poils disgracieux sur les épaules et triceps.',
    heroImage: getImageSrc(laserImg),
    priceDZD: 4000,
    durationMinutes: 25,
    availability: 'available',
    bookingEnabled: true,
    variants: [
      { id: 'laser-bs-1', name: '1 Séance Bras Supérieur', priceDZD: 4000 },
      { id: 'laser-bs-3', name: 'Forfait 3 Séances Bras Supérieur', priceDZD: 10800, oldPriceDZD: 12000, isPopular: true },
    ],
    benefits: ['Résultat homogène', 'Peau lisse'],
  },
  {
    id: 'laser-bras-entiers',
    name: 'Épilation Laser Bras Entiers (sans mains)',
    nameAr: 'إزالة شعر الذراعين بالكامل (بدون اليدين)',
    category: 'laser',
    categoryLabel: 'Épilation Laser',
    subCategory: 'Bras',
    shortDescription: 'Couverture intégrale des deux bras des épaules jusqu’aux poignets.',
    fullDescription: 'Forfait complet pour une douceur impeccable sur l’ensemble des membres supérieurs.',
    heroImage: getImageSrc(laserImg),
    priceDZD: 6500,
    durationMinutes: 45,
    availability: 'available',
    bookingEnabled: true,
    variants: [
      { id: 'laser-be-1', name: '1 Séance Bras Entiers', priceDZD: 6500 },
      { id: 'laser-be-3', name: 'Forfait 3 Séances Bras Entiers', priceDZD: 17500, oldPriceDZD: 19500, isPopular: true },
    ],
    benefits: ['Douceur intégrale', 'Gain de temps considérable'],
  },
  {
    id: 'laser-mains',
    name: 'Épilation Laser Mains',
    nameAr: 'إزالة شعر اليدين والأصابع',
    category: 'laser',
    categoryLabel: 'Épilation Laser',
    subCategory: 'Bras',
    shortDescription: 'Épilation des doigts et du dos des mains.',
    fullDescription: 'Détail esthétique soigné pour des mains impeccables jusqu’au bout des doigts.',
    heroImage: getImageSrc(laserImg),
    priceDZD: 1500,
    durationMinutes: 15,
    availability: 'available',
    bookingEnabled: true,
    variants: [
      { id: 'laser-mains-1', name: '1 Séance Mains', priceDZD: 1500 },
      { id: 'laser-mains-3', name: 'Forfait 3 Séances Mains', priceDZD: 4000, oldPriceDZD: 4500, isPopular: true },
    ],
    benefits: ['Finition parfaite', 'Séance ultra rapide'],
  },

  // ==========================================
  // 10. ÉPILATION LASER DIODE 2025 - CORPS
  // ==========================================
  {
    id: 'laser-dos-bas',
    name: 'Épilation Laser Dos-Bas',
    nameAr: 'إزالة شعر أسفل الظهر',
    category: 'laser',
    categoryLabel: 'Épilation Laser',
    subCategory: 'Corps',
    shortDescription: 'Épilation de la zone lombaire et bas du dos.',
    fullDescription: 'Nettoie la zone lombaire avec un balayage laser haute vitesse.',
    heroImage: getImageSrc(laserImg),
    priceDZD: 4500,
    durationMinutes: 25,
    availability: 'available',
    bookingEnabled: true,
    variants: [
      { id: 'laser-db-1', name: '1 Séance Dos-Bas', priceDZD: 4500 },
      { id: 'laser-db-3', name: 'Forfait 3 Séances Dos-Bas', priceDZD: 12100, oldPriceDZD: 13500, isPopular: true },
    ],
    benefits: ['Zone nette', 'Confort cryo'],
  },
  {
    id: 'laser-dos-haut',
    name: 'Épilation Laser Dos-Haut',
    nameAr: 'إزالة شعر أعلى الظهر',
    category: 'laser',
    categoryLabel: 'Épilation Laser',
    subCategory: 'Corps',
    shortDescription: 'Épilation de la zone dorsale supérieure et omoplates.',
    fullDescription: 'Traitement des poils entre les omoplates et haut du dos.',
    heroImage: getImageSrc(laserImg),
    priceDZD: 4500,
    durationMinutes: 25,
    availability: 'available',
    bookingEnabled: true,
    variants: [
      { id: 'laser-dh-1', name: '1 Séance Dos-Haut', priceDZD: 4500 },
      { id: 'laser-dh-3', name: 'Forfait 3 Séances Dos-Haut', priceDZD: 12100, oldPriceDZD: 13500, isPopular: true },
    ],
    benefits: ['Confort optimal', 'Peau lisse'],
  },
  {
    id: 'laser-dos-entier',
    name: 'Épilation Laser Dos Entier',
    nameAr: 'إزالة شعر الظهر كاملاً',
    category: 'laser',
    categoryLabel: 'Épilation Laser',
    subCategory: 'Corps',
    shortDescription: 'Traitement complet de toute la surface du dos.',
    fullDescription: 'Élimination définitive de l’ensemble de la pilosité dorsale.',
    heroImage: getImageSrc(laserImg),
    priceDZD: 7000,
    priceNote: 'À partir de 7 000 DA',
    durationMinutes: 45,
    availability: 'available',
    bookingEnabled: true,
    variants: [
      { id: 'laser-de-1', name: '1 Séance Dos Entier', priceDZD: 7000 },
      { id: 'laser-de-3', name: 'Forfait 3 Séances Dos Entier', priceDZD: 18900, oldPriceDZD: 21000, isPopular: true },
    ],
    benefits: ['Couverture maximale', 'Libération des poils incarnés'],
  },
  {
    id: 'laser-ventre',
    name: 'Épilation Laser Ventre',
    nameAr: 'إزالة شعر البطن بالليزر',
    category: 'laser',
    categoryLabel: 'Épilation Laser',
    subCategory: 'Corps',
    shortDescription: 'Épilation de l’abdomen et zone abdominale.',
    fullDescription: 'Balayage doux et efficace de l’abdomen.',
    heroImage: getImageSrc(laserImg),
    priceDZD: 4000,
    durationMinutes: 25,
    availability: 'available',
    bookingEnabled: true,
    variants: [
      { id: 'laser-ventre-1', name: '1 Séance Ventre', priceDZD: 4000 },
      { id: 'laser-ventre-3', name: 'Forfait 3 Séances Ventre', priceDZD: 10800, oldPriceDZD: 12000, isPopular: true },
    ],
    benefits: ['Ventre net et soyeux'],
  },
  {
    id: 'laser-nombril',
    name: 'Épilation Laser Nombril (Ligne Ombilicale)',
    nameAr: 'إزالة شعر خط السرة',
    category: 'laser',
    categoryLabel: 'Épilation Laser',
    subCategory: 'Corps',
    shortDescription: 'Ligne médiane du nombril vers le pubis.',
    fullDescription: 'Suppression discrète et ciblée des poils de la ligne ombilicale.',
    heroImage: getImageSrc(laserImg),
    priceDZD: 1500,
    durationMinutes: 15,
    availability: 'available',
    bookingEnabled: true,
    variants: [
      { id: 'laser-nombril-1', name: '1 Séance Nombril', priceDZD: 1500 },
      { id: 'laser-nombril-3', name: 'Forfait 3 Séances Nombril', priceDZD: 4000, oldPriceDZD: 4500, isPopular: true },
    ],
    benefits: ['Précision et rapidité'],
  },
  {
    id: 'laser-fesses',
    name: 'Épilation Laser Fesses',
    nameAr: 'إزالة شعر المؤخرة',
    category: 'laser',
    categoryLabel: 'Épilation Laser',
    subCategory: 'Corps',
    shortDescription: 'Épilation des fessiers avec confort et discrétion médicale.',
    fullDescription: 'Traitement de la zone fessière dans un cadre strictement médical et respectueux.',
    heroImage: getImageSrc(laserImg),
    priceDZD: 4500,
    priceNote: 'À partir de 4 500 DA',
    durationMinutes: 30,
    availability: 'available',
    bookingEnabled: true,
    variants: [
      { id: 'laser-fesses-1', name: '1 Séance Fesses', priceDZD: 4500 },
      { id: 'laser-fesses-3', name: 'Forfait 3 Séances Fesses', priceDZD: 12100, oldPriceDZD: 13500, isPopular: true },
    ],
    benefits: ['Peau lisse sans boutons de frottement'],
  },
  {
    id: 'laser-maillot-echancre',
    name: 'Épilation Laser Maillot Échancré',
    nameAr: 'إزالة شعر البكيني الكلاسيكي',
    category: 'laser',
    categoryLabel: 'Épilation Laser',
    subCategory: 'Corps',
    shortDescription: 'Bords du maillot et contours nets.',
    fullDescription: 'Épilation soignée des contours du maillot avec refroidissement continu.',
    heroImage: getImageSrc(laserImg),
    priceDZD: 4500,
    durationMinutes: 25,
    availability: 'available',
    bookingEnabled: true,
    variants: [
      { id: 'laser-me-1', name: '1 Séance Maillot Échancré', priceDZD: 4500 },
      { id: 'laser-me-3', name: 'Forfait 3 Séances Maillot Échancré', priceDZD: 12100, oldPriceDZD: 13500, isPopular: true },
    ],
    benefits: ['Nettoyage des contours', 'Sans irritation'],
  },
  {
    id: 'laser-maillot-integral',
    name: 'Épilation Laser Maillot Intégral',
    nameAr: 'إزالة شعر البكيني الكامل بالليزر',
    category: 'laser',
    categoryLabel: 'Épilation Laser',
    subCategory: 'Corps',
    shortDescription: 'Épilation totale de la zone intime avec confort cryogénique.',
    fullDescription: 'Protocole le plus demandé : disparition définitive des poils, zéro folliculite et hygiène optimale.',
    heroImage: getImageSrc(laserImg),
    priceDZD: 5500,
    durationMinutes: 30,
    availability: 'available',
    bookingEnabled: true,
    featured: true,
    variants: [
      { id: 'laser-mi-1', name: '1 Séance Maillot Intégral', priceDZD: 5500 },
      { id: 'laser-mi-3', name: 'Forfait 3 Séances Maillot Intégral', priceDZD: 14800, oldPriceDZD: 16500, isPopular: true },
    ],
    benefits: ['Liberté totale au quotidien', 'Fin des kystes et poils incarnés'],
  },
  {
    id: 'laser-sif',
    name: 'Épilation Laser Sillon Interfessier (SIF)',
    nameAr: 'إزالة شعر خط ما بين الفخذين (SIF)',
    category: 'laser',
    categoryLabel: 'Épilation Laser',
    subCategory: 'Corps',
    shortDescription: 'Traitement de la zone du sillon interfessier.',
    fullDescription: 'Acte rapide et minutieux réalisé avec pudeur et professionnalisme médical.',
    heroImage: getImageSrc(laserImg),
    priceDZD: 1500,
    durationMinutes: 15,
    availability: 'available',
    bookingEnabled: true,
    variants: [
      { id: 'laser-sif-1', name: '1 Séance SIF', priceDZD: 1500 },
      { id: 'laser-sif-3', name: 'Forfait 3 Séances SIF', priceDZD: 4000, oldPriceDZD: 4500, isPopular: true },
    ],
    benefits: ['Confort et hygiène'],
  },

  // ==========================================
  // 11. ÉPILATION LASER DIODE 2025 - JAMBES
  // ==========================================
  {
    id: 'laser-cuisses',
    name: 'Épilation Laser Cuisses',
    nameAr: 'إزالة شعر الفخذين بالليزر',
    category: 'laser',
    categoryLabel: 'Épilation Laser',
    subCategory: 'Jambes',
    shortDescription: 'Épilation complète des deux cuisses jusqu’au-dessus des genoux.',
    fullDescription: 'Traite le duvet épais et les poils des cuisses avec une vitesse de balayage fluide.',
    heroImage: getImageSrc(laserImg),
    priceDZD: 5500,
    priceNote: 'À partir de 5 500 DA',
    durationMinutes: 35,
    availability: 'available',
    bookingEnabled: true,
    variants: [
      { id: 'laser-cuisses-1', name: '1 Séance Cuisses', priceDZD: 5500 },
      { id: 'laser-cuisses-3', name: 'Forfait 3 Séances Cuisses', priceDZD: 14800, oldPriceDZD: 16500, isPopular: true },
    ],
    benefits: ['Cuisses douces et sans poils'],
  },
  {
    id: 'laser-demi-jambes',
    name: 'Épilation Laser Demi-Jambes',
    nameAr: 'إزالة شعر نصف الساقين مع الركبتين',
    category: 'laser',
    categoryLabel: 'Épilation Laser',
    subCategory: 'Jambes',
    shortDescription: 'Des chevilles jusqu’aux genoux inclus.',
    fullDescription: 'L’un des soins les plus populaires : élimine les poils drus des mollets et tibias de façon durable.',
    heroImage: getImageSrc(laserImg),
    priceDZD: 5500,
    durationMinutes: 35,
    availability: 'available',
    bookingEnabled: true,
    featured: true,
    variants: [
      { id: 'laser-dj-1', name: '1 Séance Demi-Jambes', priceDZD: 5500 },
      { id: 'laser-dj-3', name: 'Forfait 3 Séances Demi-Jambes', priceDZD: 14800, oldPriceDZD: 16500, isPopular: true },
    ],
    benefits: ['Adieu le rasoir quotidien', 'Jambes lisses et soyeuses'],
  },
  {
    id: 'laser-jambes-completes',
    name: 'Épilation Laser Jambes Complètes (sans pieds)',
    nameAr: 'إزالة شعر الساقين بالكامل',
    category: 'laser',
    categoryLabel: 'Épilation Laser',
    subCategory: 'Jambes',
    shortDescription: 'Des cuisses jusqu’aux chevilles pour une douceur totale.',
    fullDescription: 'Protocole complet pour libérer vos jambes de toute pilosité avec un résultat soyeux garanti.',
    heroImage: getImageSrc(laserImg),
    priceDZD: 9000,
    priceNote: 'À partir de 9 000 DA',
    durationMinutes: 50,
    availability: 'available',
    bookingEnabled: true,
    featured: true,
    variants: [
      { id: 'laser-jc-1', name: '1 Séance Jambes Complètes', priceDZD: 9000 },
      { id: 'laser-jc-3', name: 'Forfait 3 Séances Jambes Complètes', priceDZD: 25000, oldPriceDZD: 27000, isPopular: true },
    ],
    benefits: ['Tranquillité totale', 'Peau éclatante'],
  },
  {
    id: 'laser-pieds',
    name: 'Épilation Laser Pieds',
    nameAr: 'إزالة شعر القدمين والأصابع',
    category: 'laser',
    categoryLabel: 'Épilation Laser',
    subCategory: 'Jambes',
    shortDescription: 'Dos des pieds et orteils.',
    fullDescription: 'Finition soignée pour des pieds parfaits en toute saison.',
    heroImage: getImageSrc(laserImg),
    priceDZD: 1500,
    durationMinutes: 15,
    availability: 'available',
    bookingEnabled: true,
    variants: [
      { id: 'laser-pieds-1', name: '1 Séance Pieds', priceDZD: 1500 },
      { id: 'laser-pieds-3', name: 'Forfait 3 Séances Pieds', priceDZD: 4000, oldPriceDZD: 4500, isPopular: true },
    ],
    benefits: ['Finition impeccable'],
  },
];

// Helper query functions
export function getServiceById(id: string): Service | undefined {
  if (!id) return undefined;
  const cleanId = id.trim().toLowerCase();
  return SERVICES.find((s) => s.id.toLowerCase() === cleanId);
}

export function getServiceByNameOrSlug(query: string): Service | undefined {
  if (!query) return undefined;
  const q = query.trim().toLowerCase();
  
  // 1. Exact ID match
  const byId = SERVICES.find((s) => s.id.toLowerCase() === q);
  if (byId) return byId;

  // 2. Exact Name match
  const byName = SERVICES.find((s) => s.name.toLowerCase() === q);
  if (byName) return byName;

  // 3. Variant ID or Name match
  for (const s of SERVICES) {
    if (s.variants?.some((v) => v.id.toLowerCase() === q || v.name.toLowerCase() === q)) {
      return s;
    }
  }

  // 4. Fuzzy Substring match
  const byIncludes = SERVICES.find((s) => {
    const sName = s.name.toLowerCase();
    return sName.includes(q) || q.includes(sName);
  });
  if (byIncludes) return byIncludes;

  // 5. Special keyword aliases
  if (q.includes('botox') && (q.includes('full') || q.includes('3 zone'))) return getServiceById('botox-full-face');
  if (q.includes('botox') && q.includes('front')) return getServiceById('botox-front');
  if (q.includes('botox')) return getServiceById('botox-full-face') || getServiceById('botox-0-5ml');
  if (q.includes('hydra') || q.includes('facial')) return getServiceById('hydrafacial-simple');
  if (q.includes('filler') || q.includes('levre') || q.includes('lèvre')) return getServiceById('filler-levres-0-5ml');
  if (q.includes('prp') && q.includes('cheveux')) return getServiceById('prp-cheveux');
  if (q.includes('prp')) return getServiceById('prp-visage');
  if (q.includes('profhilo')) return getServiceById('skinbooster-profhilo');
  if (q.includes('lumieyes') || q.includes('lumi')) return getServiceById('skinbooster-lumieyes');
  if (q.includes('laser')) {
    if (q.includes('aisselle')) return getServiceById('laser-aisselles');
    if (q.includes('maillot') && q.includes('integral')) return getServiceById('laser-maillot-integral');
    if (q.includes('maillot')) return getServiceById('laser-maillot-echancre');
    if (q.includes('jambe') && q.includes('complete')) return getServiceById('laser-jambes-completes');
    if (q.includes('jambe') || q.includes('demi')) return getServiceById('laser-demi-jambes');
    if (q.includes('visage')) return getServiceById('laser-visage-entier');
    if (q.includes('bras')) return getServiceById('laser-bras-entiers');
    if (q.includes('dos')) return getServiceById('laser-dos-entier');
  }

  return undefined;
}
