# Application de Détection du Cancer du Sein (IDC)

Application web complète pour la détection du cancer du sein (IDC) utilisant l'intelligence artificielle. Le projet se compose d'un backend FastAPI avec un modèle TensorFlow/ResNet50 et d'un frontend Angular.

## 🏗️ Structure du Projet

```
Brest-Cancer-Detection/
├── backend/              # API FastAPI avec modèle TensorFlow
│   ├── main.py          # Point d'entrée de l'API
│   ├── script.py        # Logique de prédiction avec ResNet50
│   └── idc_breast_cancer_model_final/  # Modèle entraîné
│       └── model.weights.h5
└── frontEnd/            # Application Angular
    └── src/
```

## 📋 Prérequis

### Pour le Backend
- Python 3.8 ou supérieur
- pip (gestionnaire de paquets Python)

### Pour le Frontend
- Node.js (version 18 ou supérieure)
- npm (vient avec Node.js)

## 🚀 Installation et Lancement

### 1. Backend (API FastAPI)

#### Étape 1 : Aller dans le dossier backend
```bash
cd backend
```

#### Étape 2 : Créer un environnement virtuel (recommandé)
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

#### Étape 3 : Installer les dépendances
```bash
pip install -r requirements.txt
# ou manuellement :
pip install fastapi uvicorn[standard] tensorflow opencv-python numpy python-multipart python-dotenv google-generativeai
```

#### Étape 4 : Lancer le serveur
```bash
uvicorn main:app --reload --port 8000
```

Le backend sera accessible sur `http://localhost:8000`

📝 **Note**: Le modèle sera chargé au démarrage. Attendez le message "Modèle chargé avec succès" avant d'utiliser l'API.

#### Vérification
Vous pouvez tester l'API en visitant: `http://localhost:8000` (devrait afficher un message JSON)

Documentation interactive de l'API: `http://localhost:8000/docs`

---

### 2. Frontend (Application Angular)

#### Étape 1 : Aller dans le dossier frontend
```bash
cd frontEnd
```

#### Étape 2 : Installer les dépendances
```bash
npm install
```

#### Étape 3 : Lancer le serveur de développement
```bash
npm start
# ou
ng serve
```

Le frontend sera accessible sur `http://localhost:4200`

---

## 🔄 Lancement Complet

Pour utiliser l'application complète, vous devez lancer **les deux serveurs en parallèle** :

### Terminal 1 - Backend
```bash
cd backend
# Activer l'environnement virtuel si vous en avez créé un
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

uvicorn main:app --reload --port 8000
```

### Terminal 2 - Frontend
```bash
cd frontEnd
npm start
```

## 📡 Configuration de l'API

- **Backend URL**: `http://localhost:8000`
- **Frontend URL**: `http://localhost:4200`
- **Endpoint de prédiction**: `POST http://localhost:8000/predict`

Le backend est configuré pour accepter les requêtes CORS depuis `http://localhost:4200`.

## 🧪 Test de l'Application

1. Assurez-vous que les deux serveurs sont lancés
2. Ouvrez votre navigateur sur `http://localhost:4200`
3. Uploadez une image histopathologique
4. Obtenez la prédiction avec le niveau de confiance

## 📦 Dépendances Principales

### Backend
- `fastapi`: Framework web moderne pour Python
- `uvicorn`: Serveur ASGI
- `tensorflow`: Framework de machine learning
- `opencv-python`: Traitement d'images
- `numpy`: Calculs numériques
- `python-multipart`: Support des uploads de fichiers
- `python-dotenv`: Gestion des variables d'environnement
- `google-generativeai`: API Google Gemini pour la génération de flashcards

### Frontend
- `@angular/core`: Framework Angular
- `@angular/common`: Utilitaires Angular
- `rxjs`: Programmation réactive
- `jspdf`: Génération de PDF

## ⚠️ Notes Importantes

1. **Premier démarrage**: Le chargement du modèle TensorFlow peut prendre quelques secondes
2. **Mémoire**: Le modèle nécessite de la RAM disponible (recommandé: 4GB+)
3. **Formats d'images**: L'application accepte les images au format PNG, JPG, JPEG

## 🐛 Dépannage

### Backend ne démarre pas
- Vérifiez que le port 8000 n'est pas déjà utilisé
- Vérifiez que toutes les dépendances sont installées
- Vérifiez que le fichier `model.weights.h5` existe dans `backend/idc_breast_cancer_model_final/`

### Frontend ne se connecte pas à l'API
- Vérifiez que le backend est lancé sur le port 8000
- Vérifiez la configuration CORS dans `backend/main.py`
- Vérifiez l'URL de l'API dans `frontEnd/src/app/services/api.service.ts`

### Erreur "Module not found"
- Réinstallez les dépendances avec `pip install -r requirements.txt` (si le fichier existe)
- Ou installez manuellement toutes les dépendances listées ci-dessus

## 🤖 Configuration Google Gemini API

L'API Google Gemini est utilisée pour la génération de flashcards.

### ✅ Avantages
- **100% gratuit** : 60 requêtes par minute
- **Pas de carte bancaire** requise
- **Très intelligent** : Comparable à GPT-4
- **Gratuit à long terme**

### 🔑 Configuration

1. **Obtenez une clé API** sur [Google AI Studio](https://ai.google.dev/)
2. **Créez un fichier `.env`** dans le dossier `backend/`
3. **Ajoutez votre clé API** :
   ```env
   GEMINI_API_KEY=votre_cle_api_ici
   ```

⚠️ **Important** : Le fichier `.env` est déjà dans `.gitignore` et ne sera pas commité.

