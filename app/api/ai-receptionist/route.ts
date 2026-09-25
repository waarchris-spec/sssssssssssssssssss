import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient } from '@/lib/gemini';
import { TREATMENTS, PRICING_CATEGORIES, INITIAL_CLINIC_SETTINGS } from '@/lib/clinicData';

const CLINIC_KNOWLEDGE = `
Tu es l'Assistante Virtuelle & Concierge de Luxe officielle de "GH Clinic — Cabinet Médico-Esthétique Dr. Ghaouat Sarra" située à Khemis Miliana (Wilaya d'Aïn Defla, Algérie).

INFORMATIONS CLÉS SUR LA CLINIQUE :
- Nom : GH Clinic (Cabinet médico-esthétique Dr. Ghaouat Sarra)
- Médecin Fondatrice : Dr. Ghaouat Sarra (Médecin esthétique et laseriste certifiée)
- Ville & Localisation : Centre-ville de Khemis Miliana, Wilaya d'Aïn Defla, Algérie. (Accessible facilement depuis Alger, Blida, Chlef, Médéa).
- Téléphone & WhatsApp : +213 550 12 34 56
- Horaires d'ouverture : Du Samedi au Jeudi, de 09h00 à 18h00. (Fermé le Vendredi).
- Instagram : @gh_clinic10 | Facebook : Drsarraghaouat

SOINS PROPOSÉS ET TARIFS OFFICIELS (en Dinars Algériens - DZD) :
1. Épilation Laser Diode 2025 (Technologie médicale indolore avec refroidissement -5°C) :
   - Aisselles : 3 700 DA (Pack 3 séances : 10 000 DA)
   - Demi-jambes : 5 500 DA (Pack 3 séances : 14 800 DA)
   - Jambes complètes : 9 000 DA (Pack 3 séances : 25 000 DA)
   - Maillot échancré : 4 500 DA | Maillot intégral : 5 500 DA (Pack 3 séances : 14 800 DA)
   - Visage entier : 5 000 DA (Pack 3 séances : 13 500 DA) | Moustache : 2 000 DA | Menton : 2 500 DA
   - Bras entiers : 6 500 DA | Avant-bras : 4 500 DA | Dos entier : 7 000 DA
2. Soins Visage & Nettoyage :
   - Soin nettoyant simple : 2 500 DA
   - Hydrafacial simple : 6 000 DA | Hydrafacial VIP : 8 000 DA
   - Carbon Peel Laser : 6 000 DA | Radiofréquence visage : 4 000 DA
   - Microneedling visage : 4 500 DA | Dermaplaning : 4 000 DA
3. PRP (Plasma Riche en Plaquettes) :
   - PRP visage : 6 500 DA
   - PRP cheveux : 6 500 DA | PRP cheveux + biotine : 9 500 DA
4. Peelings Médicaux :
   - Peeling visage : 7 000 DA | Peeling mains : 4 000 DA | Peeling dos / corps : 7 000 DA
5. Skinboosters :
   - Hydra : 14 000 DA | Glow : 14 000 DA | Rejuvenating : 16 000 DA
   - Lumieyes (contour des yeux) : 16 000 DA | Profhilo 2ml : 25 000 DA
6. Botox & Fillers :
   - Botox FULL FACE : 30 000 DA | Botox Front : 15 000 DA | Botox 0.5ml : 6 000 DA
   - Filler lèvres 0.5ml : 12 000 DA | BACIO Lipbooster : 22 000 DA

RÈGLES D'OR ET DÉONTOLOGIE MÉDICALE :
1. Ton & Style : Chaleureux, haut de gamme, extrêmement poli, raffiné et rassurant (style clinique de luxe suisse/dubaïote).
2. Langue : Réponds avec élégance dans la langue utilisée par la patiente (Français par défaut, ou Arabe algérien/Derja/Arabe classique si elle s'exprime en arabe, ou Anglais).
3. NON-DIAGNOSTIC & SÉCURITÉ : Ne pose JAMAIS de diagnostic médical définitif et ne prescris JAMAIS de médicaments. Rappelle systématiquement avec bienveillance que seul Dr. Ghaouat Sarra peut poser une indication médicale personnalisée lors d'une consultation au cabinet.
4. OBJECTIF DE CONVERSION : Encourage toujours poliment la patiente à prendre rendez-vous pour une consultation d'évaluation avec Dr. Sarra, ou propose de bloquer un créneau directement via le bouton de réservation en ligne ou par WhatsApp au +213 550 12 34 56.
5. Sois concise, claire et percutante (2 à 4 phrases bien aérées, avec puces si nécessaire).
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, conversationHistory = [] } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message requis' }, { status: 400 });
    }

    let replyText = '';

    // Check if Gemini API key exists
    if (process.env.GEMINI_API_KEY) {
      const ai = getGeminiClient();

      // Format conversation contents
      const formattedContents = [
        ...conversationHistory.slice(-6).map((item: { role: string; content: string }) => ({
          role: item.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: item.content }],
        })),
        {
          role: 'user',
          parts: [{ text: message }],
        },
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: formattedContents,
        config: {
          systemInstruction: CLINIC_KNOWLEDGE,
          temperature: 0.7,
        },
      });

      replyText = response.text || "Je suis ravie de vous renseigner. N'hésitez pas à réserver une consultation avec Dr. Ghaouat Sarra à Khemis Miliana pour un examen personnalisé.";
    } else {
      // Graceful fallback if API key is not yet set
      const lower = message.toLowerCase();
      if (lower.includes('prix') || lower.includes('tarif') || lower.includes('combien')) {
        replyText = "Chez GH Clinic, nos tarifs sont transparents : Épilation laser corps complet à partir de 18 000 DZD, Hydrafacial MD à 9 500 DZD, Botox 3 zones à 28 000 DZD, et Fillers lèvres à 28 000 DZD. Souhaitez-vous planifier une consultation d'évaluation avec Dr. Ghaouat Sarra ?";
      } else if (lower.includes('laser') || lower.includes('épilation')) {
        replyText = "Notre cabinet utilise des lasers médicaux de pointe triple onde avec système de refroidissement cryogénique à -5°C pour une séance rapide et sans douleur. Le Dr. Ghaouat Sarra adapte les réglages à votre phototype. Voulez-vous réserver votre créneau ?";
      } else if (lower.includes('botox') || lower.includes('ride')) {
        replyText = "Dr. Ghaouat Sarra réalise les injections de Botox avec un dosage ultra précis pour estomper les rides du front, de la glabelle et des pattes d'oie tout en préservant la fraîcheur naturelle de vos expressions. Comptez 28 000 DZD pour le protocole 3 zones.";
      } else if (lower.includes('adresse') || lower.includes('où') || lower.includes('localisation') || lower.includes('khemis')) {
        replyText = "GH Clinic est située au centre-ville de Khemis Miliana (Wilaya d'Aïn Defla). Nous vous accueillons du Samedi au Jeudi de 09h00 à 18h00. Vous pouvez nous joindre directement au +213 550 12 34 56.";
      } else {
        replyText = "Bonjour et bienvenue chez GH Clinic ! Je suis l'assistante virtuelle de Dr. Ghaouat Sarra. Je peux vous renseigner sur nos soins (Laser, Botox, Fillers, Hydrafacial, PRP, Skinboosters), nos tarifs en DZD et vous aider à réserver votre rendez-vous à Khemis Miliana.";
      }
    }

    return NextResponse.json({
      reply: replyText,
      clinicPhone: INITIAL_CLINIC_SETTINGS.phone,
      whatsappUrl: `https://wa.me/${INITIAL_CLINIC_SETTINGS.whatsappPhone}?text=${encodeURIComponent("Bonjour Dr. Ghaouat, je souhaite me renseigner et prendre rendez-vous.")}`
    });
  } catch (error: unknown) {
    console.error('Error in AI Receptionist route:', error);
    return NextResponse.json(
      {
        reply: "Bonjour ! Dr. Ghaouat Sarra et notre équipe vous accueillent avec plaisir à Khemis Miliana pour sublimer votre beauté naturelle. Souhaitez-vous réserver une consultation ou connaître nos tarifs en Dinars ?",
      },
      { status: 200 }
    );
  }
}
