"""
Exemple de code FastAPI pour l'application de détection du cancer du sein
Copiez ce code dans votre fichier main.py ou app.py
"""

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import tempfile
import os
from script import predict_new_image

app = FastAPI()

# ⚠️ IMPORTANT : Configuration CORS pour permettre les requêtes depuis Angular
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:4200",  # URL de développement Angular
        "http://127.0.0.1:4200",  # Alternative
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Permet toutes les méthodes (GET, POST, etc.)
    allow_headers=["*"],  # Permet tous les headers
)

@app.get("/")
def read_root():
    return {"message": "API de détection du cancer du sein", "status": "running"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Endpoint pour analyser une image uploadée
    
    Args:
        file: Fichier image uploadé via FormData
    
    Returns:
        dict: Résultat avec label et confidence
    """
    # Vérifier que c'est bien une image
    if not file.content_type or not file.content_type.startswith('image/'):
        return {"error": "Le fichier doit être une image"}
    
    # Créer un fichier temporaire
    with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as tmp_file:
        tmp_path = tmp_file.name
        try:
            # Lire le contenu du fichier uploadé
            content = await file.read()
            tmp_file.write(content)
            tmp_file.flush()
            
            # Appeler votre fonction de prédiction
            result = predict_new_image(tmp_path)
            return result
        except Exception as e:
            return {"error": f"Erreur lors de l'analyse: {str(e)}"}
        finally:
            # Nettoyer le fichier temporaire
            if os.path.exists(tmp_path):
                try:
                    os.remove(tmp_path)
                except:
                    pass

# Pour démarrer l'API :
# uvicorn main:app --reload --port 8000
# ou
# python -m uvicorn main:app --reload --port 8000

