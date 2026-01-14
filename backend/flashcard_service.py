"""
Service de génération de flashcards utilisant Google Gemini API
Solution 100% gratuite avec 60 requêtes par minute
"""

import os
import json
from typing import List, Optional
from dotenv import load_dotenv
import google.generativeai as genai

# Charger les variables d'environnement
load_dotenv()


class FlashCard:
    """Classe pour représenter une flashcard"""
    
    def __init__(self, question: str, answer: str):
        self.question = question
        self.answer = answer
    
    def to_dict(self):
        """Convertit la flashcard en dictionnaire"""
        return {
            "question": self.question,
            "answer": self.answer
        }


class FlashCardConfig:
    """Classe pour configurer la génération de flashcards"""
    
    def __init__(self):
        self.max_question_words = 20
        self.max_answer_words = 40
        self.number_of_cards = 15
        self.temperature = 0.9
    
    def set_max_question_words(self, words: int) -> 'FlashCardConfig':
        self.max_question_words = words
        return self
    
    def set_max_answer_words(self, words: int) -> 'FlashCardConfig':
        self.max_answer_words = words
        return self
    
    def set_number_of_cards(self, number: int) -> 'FlashCardConfig':
        self.number_of_cards = number
        return self
    
    def set_temperature(self, temp: float) -> 'FlashCardConfig':
        self.temperature = temp
        return self


def create_flashcard_prompt(text: str, config: FlashCardConfig) -> str:
    """
    Crée le prompt système pour générer des flashcards
    
    Args:
        text: Le texte source
        config: Configuration de génération
        
    Returns:
        Le prompt système complet
    """
    system_prompt = f"""Tu es un expert en création de flashcards éducatives. 
Tu dois générer des flashcards au format JSON strict à partir du texte fourni.
Respecte ABSOLUMENT les contraintes suivantes :
- Chaque question doit contenir MAXIMUM {config.max_question_words} mots
- Chaque réponse doit contenir MAXIMUM {config.max_answer_words} mots
- Génère exactement {config.number_of_cards} flashcards
- Les questions doivent être claires et précises
- Les réponses doivent être concises et informatives

FORMAT DE SORTIE OBLIGATOIRE (JSON uniquement, sans texte supplémentaire) :
{{
  "flashcards": [
    {{
      "question": "Question ici?",
      "answer": "Réponse ici."
    }}
  ]
}}

IMPORTANT : Retourne UNIQUEMENT le JSON, sans balises markdown, sans texte avant ou après."""

    user_prompt = f"Génère des flashcards à partir de ce texte :\n\n{text}"
    
    return system_prompt, user_prompt


def parse_flashcards(json_content: str) -> List[FlashCard]:
    """
    Parse la réponse JSON pour extraire les flashcards
    
    Args:
        json_content: Contenu JSON de la réponse
        
    Returns:
        Liste des flashcards
    """
    flash_cards = []
    
    # Nettoyer le contenu si l'IA a ajouté des balises markdown
    cleaned_content = json_content.strip()
    
    # Supprimer les balises markdown si présentes
    if cleaned_content.startswith("```json"):
        cleaned_content = cleaned_content[7:]
    elif cleaned_content.startswith("```"):
        cleaned_content = cleaned_content[3:]
    
    if cleaned_content.endswith("```"):
        cleaned_content = cleaned_content[:-3]
    
    cleaned_content = cleaned_content.strip()
    
    try:
        # Parser le JSON
        json_response = json.loads(cleaned_content)
        flashcards_array = json_response.get("flashcards", [])
        
        for card_data in flashcards_array:
            question = card_data.get("question", "")
            answer = card_data.get("answer", "")
            if question and answer:
                flash_cards.append(FlashCard(question, answer))
                
    except json.JSONDecodeError as e:
        print(f"⚠️ Erreur de parsing JSON: {e}")
        print(f"Contenu reçu: {cleaned_content[:200]}...")
        raise ValueError(f"Impossible de parser la réponse JSON: {e}")
    
    return flash_cards


def generate_flashcards(text: str, config: Optional[FlashCardConfig] = None) -> List[FlashCard]:
    """
    Génère des flashcards à partir d'un texte en utilisant Google Gemini API
    
    Args:
        text: Le texte source pour générer les flashcards
        config: Configuration optionnelle (utilise les valeurs par défaut si non fournie)
        
    Returns:
        Liste des flashcards générées
        
    Raises:
        ValueError: Si la clé API n'est pas configurée ou en cas d'erreur
    """
    if config is None:
        config = FlashCardConfig()
    
    # Récupérer la clé API depuis les variables d'environnement
    api_key = os.getenv("GEMINI_API_KEY")
    
    if not api_key:
        raise ValueError("GEMINI_API_KEY non configurée dans le fichier .env")
    
    try:
        # Configurer l'API Gemini
        genai.configure(api_key=api_key)
        
        # Créer le prompt
        system_prompt, user_prompt = create_flashcard_prompt(text, config)
        
        # Utiliser le modèle gemini-1.5-flash (gratuit et rapide)
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            system_instruction=system_prompt
        )
        
        # Générer la réponse
        response = model.generate_content(
            user_prompt,
            generation_config={
                "temperature": config.temperature,
                "top_p": 0.8,
                "top_k": 40,
                "max_output_tokens": 2048,  # Plus de tokens pour plusieurs flashcards
            }
        )
        
        # Extraire le texte de la réponse
        if response.text:
            flash_cards = parse_flashcards(response.text)
            return flash_cards
        else:
            raise ValueError("Réponse vide de Gemini API")
            
    except Exception as e:
        error_msg = str(e)
        print(f"⚠️ Erreur avec Gemini API: {error_msg}")
        raise ValueError(f"Erreur lors de la génération des flashcards: {error_msg}")

