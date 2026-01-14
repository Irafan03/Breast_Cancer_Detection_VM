from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List
from script import predict_from_bytes
from flashcard_service import generate_flashcards, FlashCard, FlashCardConfig

app = FastAPI(
    title="Breast Cancer API",
    description="API de prédiction IDC avec ResNet50",
    version="1.0.0"
)

origins = origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict")
async def predict_image(file: UploadFile = File(...)):
    image_bytes = await file.read()
    result = predict_from_bytes(image_bytes)
    return  result
    

@app.get("/")
def home():
    return {"message": "IDC Breast Cancer Prediction API is running "}

# Modèle pour les requêtes de génération de flashcards
class FlashCardRequest(BaseModel):
    text: str = Field(..., description="Le texte source pour générer les flashcards")
    max_question_words: Optional[int] = Field(default=20, description="Nombre maximum de mots par question")
    max_answer_words: Optional[int] = Field(default=40, description="Nombre maximum de mots par réponse")
    number_of_cards: Optional[int] = Field(default=15, description="Nombre de flashcards à générer")
    temperature: Optional[float] = Field(default=0.9, description="Température pour la génération (0.0-1.0)")

class FlashCardResponse(BaseModel):
    flashcards: List[dict] = Field(..., description="Liste des flashcards générées")
    total: int = Field(..., description="Nombre total de flashcards générées")

@app.post("/flashcards", response_model=FlashCardResponse)
async def generate_flashcards_endpoint(request: FlashCardRequest):
    """
    Endpoint pour générer des flashcards à partir d'un texte
    Utilise Google Gemini API (gratuit, 60 requêtes par minute)
    """
    try:
        # Créer la configuration
        config = FlashCardConfig()
        if request.max_question_words:
            config.set_max_question_words(request.max_question_words)
        if request.max_answer_words:
            config.set_max_answer_words(request.max_answer_words)
        if request.number_of_cards:
            config.set_number_of_cards(request.number_of_cards)
        if request.temperature is not None:
            config.set_temperature(request.temperature)
        
        # Générer les flashcards
        flash_cards = generate_flashcards(request.text, config)
        
        # Convertir en format JSON
        flashcards_data = [card.to_dict() for card in flash_cards]
        
        return FlashCardResponse(
            flashcards=flashcards_data,
            total=len(flashcards_data)
        )
        
    except ValueError as e:
        # Erreur de configuration ou de parsing
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        # Autres erreurs
        error_msg = str(e)
        print(f"Erreur dans /flashcards: {error_msg}")
        raise HTTPException(status_code=500, detail=f"Erreur lors de la génération des flashcards: {error_msg}")