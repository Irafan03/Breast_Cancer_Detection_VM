import { Injectable } from '@angular/core';

/**
 * Service de chatbot local avec réponses prédéfinies
 * Utilisé comme fallback si l'API externe échoue
 */
@Injectable({
  providedIn: 'root'
})
export class ChatbotLocalService {
  
  // Base de connaissances en français
  private knowledgeBaseFR: {[key: string]: string} = {
    // Questions sur le cancer du sein
    'cancer': `Le **cancer du sein** est une tumeur maligne qui se développe dans les cellules mammaires. 🎗️

**Les types principaux :**
• Carcinome canalaire invasif (le plus courant - 80%)
• Carcinome lobulaire invasif
• Carcinome in situ (non invasif)

**Bon à savoir :**
Le dépistage précoce augmente considérablement les chances de guérison (jusqu'à 99% de survie à 5 ans si détecté tôt).

💡 Des questions sur le dépistage ou les symptômes ?`,
    
    'détection': `Notre système utilise l'**intelligence artificielle** pour analyser vos images mammographiques. 🤖

**Comment ça marche :**
1. Vous uploadez votre image
2. Notre IA l'analyse en quelques secondes
3. Vous recevez un score de classification (bénin/malin)

⚠️ **Important :** Notre outil est une aide au diagnostic. Seul un médecin peut poser un diagnostic définitif.

Vous voulez analyser une image maintenant ?`,
    
    'dépistage': `**Recommandations de dépistage :** 📅

🔸 **À partir de 50 ans :** Mammographie tous les 2 ans
🔸 **Facteurs de risque élevés :** Dépistage plus précoce et fréquent
🔸 **Auto-examen :** Une fois par mois, à faire chez soi

**Quand consulter :**
Si vous détectez une anomalie lors de l'auto-examen, consultez rapidement votre médecin.

Besoin d'aide pour comprendre comment faire un auto-examen ?`,
    
    'symptômes': `**Signes d'alerte à surveiller :** ⚠️

🔴 **Signes urgents :**
• Bosse ou grosseur dans le sein
• Changement de taille ou forme du sein
• Rétraction du mamelon
• Écoulement anormal du mamelon
• Peau "peau d'orange"
• Rougeur ou chaleur inhabituelle

⚠️ **Action :** Si vous remarquez l'un de ces symptômes, consultez rapidement votre médecin.

💡 Beaucoup de changements sont bénins, mais mieux vaut vérifier !`,
    
    'résultats': `**Comment interpréter vos résultats :** 📊

Notre système donne un **score de probabilité** :

🟢 **Score faible (< 30%)** : Probablement bénin
🟡 **Score moyen (30-70%)** : À surveiller
🔴 **Score élevé (> 70%)** : Nécessite confirmation médicale

⚠️ **Important :**
• Un score élevé ≠ diagnostic certain
• Seul un médecin peut confirmer
• Notre outil aide à prioriser les examens

Des questions sur votre résultat ?`,
    
    'traitement': `**Options de traitement disponibles :** 💊

Le traitement dépend du stade et du type de cancer :

🏥 **Chirurgie :**
• Tumorectomie (conservation du sein)
• Mastectomie (ablation)

⚡ **Traitements complémentaires :**
• Radiothérapie
• Chimiothérapie
• Hormonothérapie
• Thérapie ciblée

Votre oncologue établira le meilleur plan pour votre situation.

Vous avez des questions sur un traitement spécifique ?`,
    
    'prévention': `**Comment réduire les risques :** 🛡️

✅ **Ce que vous pouvez faire :**
• Maintenir un poids santé
• Faire de l'exercice régulièrement (30 min/jour)
• Limiter l'alcool
• Ne pas fumer
• Allaiter si possible
• Dépistages réguliers

⚠️ **Facteurs non modifiables :**
L'âge et la génétique sont des facteurs importants mais qu'on ne peut pas changer.

💡 La prévention réduit les risques mais ne les élimine pas complètement.`,
    
    'facteurs de risque': `**Principaux facteurs de risque :** ⚠️

🔴 **Majeurs :**
• Âge (> 50 ans)
• Antécédents familiaux
• Mutations génétiques (BRCA1/BRCA2)
• Antécédents personnels

🟡 **Modérés :**
• Obésité
• Sédentarité
• Consommation d'alcool
• Traitement hormonal prolongé
• Pas d'allaitement

💡 Avoir un facteur de risque ne signifie pas que vous développerez un cancer.

Voulez-vous en savoir plus sur la prévention ?`,
    
    'upload': `**Comment analyser une image :** 📤

**Étapes simples :**

1️⃣ Cliquez sur le bouton **"Upload"** ou **"Analyse"**
2️⃣ Sélectionnez votre image mammographique
3️⃣ Attendez l'analyse (quelques secondes)
4️⃣ Consultez vos résultats

**Formats acceptés :** JPG, PNG
**Taille recommandée :** Moins de 5 MB

✅ Vos images sont analysées de manière sécurisée et confidentielle.

Besoin d'aide pour uploader ?`,
    
    'bonjour': `Bonjour ! 👋

Je suis votre **assistant médical virtuel** spécialisé dans la détection du cancer du sein. 💙

**Je peux vous aider avec :**
• 📊 Informations sur le dépistage
• 🔍 Utilisation de la plateforme
• 💊 Questions sur le cancer du sein
• 💙 Soutien et accompagnement

Comment puis-je vous aider aujourd'hui ?`,
    
    'aide': `**Je suis là pour vous aider ! 🤝**

**Mes domaines d'expertise :**

📊 **Dépistage & Détection**
Mammographie, auto-examen, quand consulter

🔬 **Analyse d'Images**
Comment uploader, interpréter les résultats

💊 **Informations Médicales**
Symptômes, traitements, prévention

💙 **Support Émotionnel**
Gérer l'anxiété, parler à sa famille

📱 **Aide Technique**
Navigation, problèmes d'upload

**Posez-moi simplement votre question ! 😊**`,
    
    'merci': `Avec plaisir ! 😊

N'hésitez surtout pas si vous avez d'autres questions. Je suis là pour vous aider. 💙

**Rappel :** Votre santé est précieuse. En cas de doute, consultez toujours un professionnel de santé.`,
    
    'stress': `Je comprends que cette situation puisse être stressante. 💙

**Ressources de soutien :**

🗣️ **Parler à quelqu'un**
• Psychologue spécialisé en oncologie
• Groupes de soutien pour patients
• Ligne d'écoute Cancer Info : 0 805 123 124

🧘 **Gérer l'anxiété**
• Méditation et relaxation
• Exercices de respiration
• Activité physique douce

💬 **Partager**
Parler à vos proches peut vraiment aider.

**Rappelez-vous :** Vous n'êtes pas seul(e) dans cette épreuve. L'anxiété est une réaction normale.

Comment puis-je vous aider davantage ?`,
    
    'famille': `**Comment en parler à votre famille :** 💬

**Conseils pratiques :**

⏰ **Choisissez le bon moment**
Trouvez un moment calme où vous ne serez pas dérangés

💭 **Soyez honnête**
Exprimez vos sentiments et vos besoins

📚 **Informez-les**
Donnez-leur des informations claires sur la situation

❓ **Écoutez leurs questions**
Laissez-les exprimer leurs inquiétudes

🤝 **Demandez du soutien**
Dites-leur comment ils peuvent vous aider

**Le dialogue ouvert aide tout le monde à mieux vivre cette épreuve.**

Besoin de plus de conseils sur le soutien émotionnel ?`
  };

  // Base de connaissances en anglais
  private knowledgeBaseEN: {[key: string]: string} = {
    'cancer': `**Breast cancer** is a malignant tumor that develops in breast cells. 🎗️

**Main types:**
• Invasive ductal carcinoma (most common - 80%)
• Invasive lobular carcinoma  
• Carcinoma in situ (non-invasive)

**Good to know:**
Early detection significantly increases survival rates (up to 99% 5-year survival if detected early).

💡 Questions about screening or symptoms?`,
    
    'detection': `Our system uses **artificial intelligence** to analyze mammographic images. 🤖

**How it works:**
1. Upload your image
2. AI analyzes it in seconds
3. Receive classification score (benign/malignant)

⚠️ **Important:** This is a diagnostic aid. Only a doctor can make a definitive diagnosis.

Want to analyze an image now?`,
    
    'screening': `**Screening recommendations:** 📅

🔸 **From age 50:** Mammography every 2 years
🔸 **High risk:** Earlier and more frequent screening
🔸 **Self-exam:** Once monthly at home

**When to consult:**
If you detect abnormality during self-exam, see your doctor promptly.`,
    
    'symptoms': `**Warning signs:** ⚠️

🔴 **Urgent signs:**
• Lump or mass in breast
• Change in size or shape
• Nipple retraction
• Abnormal discharge
• "Orange peel" skin
• Unusual redness/warmth

⚠️ If you notice these symptoms, consult your doctor quickly.

💡 Many changes are benign, but better to check!`,
    
    'results': `**Interpreting results:** 📊

Our system provides a **probability score**:

🟢 **Low (< 30%)**: Likely benign
🟡 **Medium (30-70%)**: Monitor
🔴 **High (> 70%)**: Needs medical confirmation

⚠️ **Remember:**
• High score ≠ certain diagnosis
• Only a doctor can confirm
• Our tool helps prioritize exams

Questions about your result?`,
    
    'treatment': `**Treatment options:** 💊

Treatment depends on stage and type:

🏥 **Surgery:**
• Lumpectomy (breast conservation)
• Mastectomy (removal)

⚡ **Additional treatments:**
• Radiation therapy
• Chemotherapy
• Hormone therapy
• Targeted therapy

Your oncologist will determine the best plan.`,
    
    'prevention': `**Reducing risks:** 🛡️

✅ **You can:**
• Maintain healthy weight
• Exercise regularly (30 min/day)
• Limit alcohol
• Don't smoke
• Breastfeed if possible
• Regular screenings

⚠️ **Non-modifiable:** Age and genetics can't be changed.

💡 Prevention reduces but doesn't eliminate risk.`,
    
    'risk': `**Main risk factors:** ⚠️

🔴 **Major:**
• Age (> 50 years)
• Family history
• Genetic mutations (BRCA1/BRCA2)
• Personal history

🟡 **Moderate:**
• Obesity
• Sedentary lifestyle
• Alcohol
• Hormone treatment
• No breastfeeding

💡 Having risk factors doesn't mean you'll develop cancer.`,
    
    'upload': `**How to analyze an image:** 📤

**Simple steps:**

1️⃣ Click **"Upload"** or **"Analysis"** button
2️⃣ Select your mammographic image
3️⃣ Wait for analysis (few seconds)
4️⃣ View your results

**Formats:** JPG, PNG
**Size:** Less than 5 MB

✅ Images analyzed securely and confidentially.`,
    
    'hello': `Hello! 👋

I'm your **virtual medical assistant** specialized in breast cancer detection. 💙

**I can help with:**
• 📊 Screening information
• 🔍 Platform usage
• 💊 Breast cancer questions
• 💙 Support and guidance

How can I help you today?`,
    
    'help': `**I'm here to help! 🤝**

**My expertise:**

📊 **Screening & Detection**
Mammography, self-exam, consultations

🔬 **Image Analysis**
Upload, interpret results

💊 **Medical Info**
Symptoms, treatments, prevention

💙 **Emotional Support**
Managing anxiety, family communication

📱 **Technical Help**
Navigation, upload issues

**Just ask me! 😊**`,
    
    'thanks': `You're welcome! 😊

Feel free to ask more questions. I'm here to help. 💙

**Remember:** Your health is precious. Always consult a healthcare professional when in doubt.`,
    
    'stress': `I understand this can be stressful. 💙

**Support resources:**

🗣️ **Talk to someone**
• Oncology psychologist
• Patient support groups
• Cancer helpline

🧘 **Managing anxiety**
• Meditation and relaxation
• Breathing exercises
• Gentle exercise

💬 **Share** with loved ones - it helps.

**Remember:** You're not alone. Anxiety is normal.

How else can I help?`,
    
    'family': `**Talking to your family:** 💬

**Tips:**

⏰ **Choose the right time**
Find a quiet, uninterrupted moment

💭 **Be honest**
Express your feelings and needs

📚 **Inform them**
Give clear information

❓ **Listen**
Let them express concerns

🤝 **Ask for support**
Tell them how they can help

**Open dialogue helps everyone cope better.**`
  };

  /**
   * Détecte la langue du message
   */
  private detectLanguage(message: string): 'fr' | 'en' {
    const lower = message.toLowerCase();
    
    // Mots anglais distinctifs
    const enWords = ['hello', 'hi', 'help', 'what', 'how', 'the', 'and', 'can', 'you', 'speak', 'english', 'do', 'does', 'breast', 'treatment'];
    // Mots français distinctifs  
    const frWords = ['bonjour', 'salut', 'aide', 'comment', 'quoi', 'le', 'la', 'et', 'tu', 'vous', 'parle', 'francais', 'sein', 'traitement'];
    
    let enScore = enWords.filter(w => lower.includes(w)).length;
    let frScore = frWords.filter(w => lower.includes(w)).length;
    
    return enScore > frScore ? 'en' : 'fr';
  }

  /**
   * Génère une réponse basée sur le message de l'utilisateur
   */
  generateResponse(userMessage: string): string {
    // Détecter la langue
    const language = this.detectLanguage(userMessage);
    const knowledgeBase: {[key: string]: string} = language === 'en' ? this.knowledgeBaseEN : this.knowledgeBaseFR;
    
    const messageLower = userMessage.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Enlever les accents
    
    // Questions sur la langue
    if (this.containsAny(messageLower, ['anglais', 'english', 'langue', 'language', 'parle', 'speak'])) {
      if (language === 'en') {
        return `Yes, I can understand and respond in English! 🇬🇧🇺🇸

I'm also fluent in French. Just ask your questions in the language you're most comfortable with!

**I can help you with:**
- 🏥 Breast cancer detection
- 📊 Using this platform
- 💊 Treatments and screening
- 💙 Emotional support

How can I help you today?`;
      } else {
        return `Oui, je peux comprendre et répondre en **français ET en anglais** ! 🇫🇷🇬🇧

Posez-moi vos questions dans la langue qui vous convient !

**Je peux vous aider avec :**
- 🏥 La détection du cancer du sein
- 📊 L'utilisation de cette plateforme
- 💊 Les traitements et le dépistage
- 💙 Le soutien émotionnel

Comment puis-je vous aider ?`;
      }
    }

    // Salutations
    if (this.containsAny(messageLower, ['salut', 'hello', 'hi', 'coucou', 'bonjour', 'bonsoir'])) {
      return language === 'en' ? knowledgeBase['hello'] : knowledgeBase['bonjour'];
    }
    
    // Remerciements
    if (this.containsAny(messageLower, ['merci', 'thanks', 'thank you', 'merci beaucoup'])) {
      return language === 'en' ? knowledgeBase['thanks'] : knowledgeBase['merci'];
    }
    
    // Questions existentielles sur le bot
    if (this.containsAny(messageLower, ['qui es tu', 'qui etes vous', 'c\'est quoi', 'what are you', 'who are you'])) {
      if (language === 'en') {
        return `I'm your virtual medical assistant specialized in breast cancer detection. 🤖💙

**My role:**
✅ Help you understand our detection platform
✅ Answer breast cancer questions
✅ Guide you through the system
✅ Provide support and information

I'm here to help, but remember: only a doctor can make a medical diagnosis.

What would you like to know?`;
      } else {
        return `Je suis votre assistant médical virtuel spécialisé dans la détection du cancer du sein. 🤖💙

**Mon rôle :**
✅ Comprendre notre plateforme de détection
✅ Répondre à vos questions sur le cancer du sein
✅ Vous guider dans l'utilisation du système
✅ Vous apporter du soutien et des informations

Je suis là pour vous accompagner, mais n'oubliez pas que seul un médecin peut établir un diagnostic médical.

Que souhaitez-vous savoir ?`;
      }
    }

    // Émotions négatives
    if (this.containsAny(messageLower, ['peur', 'angoisse', 'anxiete', 'stress', 'inquiet', 'inquiete', 'panique', 'nerveux', 'scared', 'worried', 'anxiety'])) {
      return knowledgeBase['stress'];
    }
    
    // Recherche par mots-clés principaux
    if (this.containsAny(messageLower, ['cancer', 'tumeur', 'maladie', 'tumor', 'disease'])) {
      return knowledgeBase['cancer'];
    }
    
    if (this.containsAny(messageLower, ['detection', 'detecter', 'detecte', 'analyse', 'analyser', 'ia', 'intelligence artificielle', 'detect', 'analyze', 'ai'])) {
      return knowledgeBase['detection'];
    }
    
    if (this.containsAny(messageLower, ['depistage', 'mammographie', 'examen', 'controle', 'screening', 'mammography', 'exam'])) {
      return language === 'en' ? knowledgeBase['screening'] : knowledgeBase['dépistage'];
    }
    
    if (this.containsAny(messageLower, ['symptome', 'signe', 'boule', 'grosseur', 'douleur', 'symptom', 'sign', 'lump', 'pain'])) {
      return language === 'en' ? knowledgeBase['symptoms'] : knowledgeBase['symptômes'];
    }
    
    if (this.containsAny(messageLower, ['resultat', 'rapport', 'score', 'benin', 'malin', 'interpreter', 'result', 'report', 'benign', 'malignant', 'interpret'])) {
      return language === 'en' ? knowledgeBase['results'] : knowledgeBase['résultats'];
    }
    
    if (this.containsAny(messageLower, ['traitement', 'soigner', 'guerir', 'chimiotherapie', 'chirurgie', 'radiotherapie', 'treatment', 'cure', 'chemotherapy', 'surgery', 'radiation'])) {
      return knowledgeBase['treatment'];
    }
    
    if (this.containsAny(messageLower, ['prevention', 'prevenir', 'eviter', 'proteger', 'prevent', 'avoid', 'protect'])) {
      return language === 'en' ? knowledgeBase['prevention'] : knowledgeBase['prévention'];
    }
    
    if (this.containsAny(messageLower, ['risque', 'facteur', 'cause', 'probabilite', 'risk', 'factor', 'probability'])) {
      return language === 'en' ? knowledgeBase['risk'] : knowledgeBase['facteurs de risque'];
    }
    
    if (this.containsAny(messageLower, ['upload', 'telecharger', 'envoyer', 'image', 'photo', 'fichier', 'utiliser', 'plateforme', 'send', 'file', 'use', 'platform'])) {
      return knowledgeBase['upload'];
    }
    
    if (this.containsAny(messageLower, ['aide', 'help', 'comment', 'fonctionnement', 'how'])) {
      return language === 'en' ? knowledgeBase['help'] : knowledgeBase['aide'];
    }
    
    if (this.containsAny(messageLower, ['famille', 'proches', 'entourage', 'dire', 'annoncer', 'family', 'relatives', 'tell'])) {
      return knowledgeBase['family'];
    }
    
    // Questions interrogatives
    if (messageLower.includes('?')) {
      if (language === 'en') {
        return `I understand your question. While I don't have a specific answer for it, here's what I can help you with:

📊 **Screening & Detection**
Ask me about screening, mammography, or our analysis system.

💊 **Symptoms & Treatment**
Ask me about warning signs or treatment options.

📱 **Platform Usage**
I can guide you through our image analysis system.

💙 **Support**
I'm here to provide support and reassuring information.

Try rephrasing your question or choose one of these topics!`;
      } else {
        return `Je comprends votre question. Bien que je n'aie pas de réponse spécifique pour celle-ci, voici ce que je peux vous aider :

📊 **Dépistage et Détection**
Posez-moi des questions sur le dépistage, la mammographie, ou notre système d'analyse.

💊 **Symptômes et Traitement**
Demandez-moi des informations sur les signes d'alerte ou les options de traitement.

📱 **Utilisation de la Plateforme**
Je peux vous guider dans l'utilisation de notre système d'analyse d'images.

💙 **Support**
Je suis là pour vous apporter du soutien et des informations rassurantes.

Essayez de reformuler votre question ou choisissez un de ces sujets !`;
      }
    }
    
    // Réponse par défaut plus courte et plus amicale
    if (language === 'en') {
      return `I didn't quite understand your request. 🤔

Here are some questions you can ask me:

❓ "What is breast cancer?"
❓ "How to use this platform?"
❓ "What are the symptoms?"
❓ "How to interpret my results?"
❓ "What are the risk factors?"

Just type your question and I'll be happy to help! 😊`;
    } else {
      return `Je n'ai pas bien compris votre demande. 🤔

Voici quelques exemples de questions que vous pouvez me poser :

❓ "Qu'est-ce que le cancer du sein ?"
❓ "Comment utiliser cette plateforme ?"
❓ "Quels sont les symptômes ?"
❓ "Comment interpréter mes résultats ?"
❓ "Quels sont les facteurs de risque ?"

Tapez simplement votre question et je vous aiderai avec plaisir ! 😊`;
    }
  }

  /**
   * Vérifie si le texte contient l'un des mots
   */
  private containsAny(text: string, words: string[]): boolean {
    return words.some(word => text.includes(word));
  }

  /**
   * Génère des suggestions de questions
   */
  getSuggestedQuestions(language: 'fr' | 'en' = 'fr'): string[] {
    if (language === 'en') {
      return [
        "What is breast cancer?",
        "How to use this platform?",
        "What symptoms to watch for?",
        "How to interpret my results?",
        "What are the risk factors?",
        "How to prevent breast cancer?"
      ];
    } else {
      return [
        "Qu'est-ce que le cancer du sein ?",
        "Comment utiliser cette plateforme ?",
        "Quels sont les symptômes à surveiller ?",
        "Comment interpréter mes résultats ?",
        "Quels sont les facteurs de risque ?",
        "Comment prévenir le cancer du sein ?"
      ];
    }
  }
}

