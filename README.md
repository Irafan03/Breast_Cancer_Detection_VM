# 🩺 Application de Détection du Cancer du Sein (IDC)

Application **web et mobile** pour la **détection du cancer du sein (IDC)** basée sur l’intelligence artificielle. Le projet comprend :

* un **backend FastAPI** avec un modèle **TensorFlow (ResNet50)**,
* un **frontend Angular**,
* une **version mobile Android** via **Capacitor**,
* une exposition de l’API pour mobile via **ngrok**.

---

## 🏗️ Structure du projet

```
Breast_Cancer_Detection_VM/
├── backend/                     # API FastAPI + modèle IA
│   ├── main.py                  # Point d’entrée de l’API
│   ├── script.py                # Logique de prédiction (ResNet50)
│   ├── requirements.txt
│   └── idc_breast_cancer_model_final/
│       └── model.weights.h5
├── frontEnd/                    # Application Angular
│   ├── src/
│   ├── angular.json
│   └── package.json
├── 0/                           # Dataset (classe 0 – bénin)
├── 1/                           # Dataset (classe 1 – malin)
└── README.md
```

---

## 📋 Prérequis

### Backend

* Python **3.8+**
* pip

### Frontend / Mobile

* Node.js **18+**
* npm
* Angular CLI
* Capacitor (`@capacitor/core`, `@capacitor/cli`)
* Android Studio (pour Android)

---

## 🚀 Lancement du Backend (FastAPI)

### 1️⃣ Accéder au dossier backend

```bash
cd backend
```

### 2️⃣ Créer et activer un environnement virtuel (recommandé)

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux / Mac
python3 -m venv venv
source venv/bin/activate
```

### 3️⃣ Installer les dépendances

```bash
pip install -r requirements.txt
```

### 4️⃣ Lancer l’API

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

📍 API disponible sur : `http://localhost:8000`

* Documentation Swagger : `http://localhost:8000/docs`
* Endpoint principal : `POST /predict`

> ℹ️ Le modèle TensorFlow est chargé au démarrage (quelques secondes).

---

## 🌐 Lancement du Frontend (Angular Web)

### 1️⃣ Accéder au dossier frontend

```bash
cd frontEnd
```

### 2️⃣ Installer les dépendances

```bash
npm install
```

### 3️⃣ Lancer le serveur Angular

```bash
ng serve
# ou
npm start
```

📍 Application web : `http://localhost:4200`

---

## 📱 Version Mobile (Android avec Capacitor)

### 1️⃣ Build Angular

```bash
ng build
```

### 2️⃣ Synchroniser Capacitor

```bash
npx cap sync
```

### 3️⃣ Ouvrir Android Studio

```bash
npx cap open android
```

📱 L’application mobile communique avec le backend via **ngrok**.

---

## 🌍 Exposition du Backend pour Mobile (ngrok)

Le mobile Android ne peut pas accéder à `localhost`. On utilise **ngrok**.

### Lancer ngrok

```bash
ngrok http 8000
```

Exemple d’URL générée :

```
https://xxxx-xxxx.ngrok-free.app
```

➡️ Mettre cette URL dans :

```
frontEnd/src/app/services/api.service.ts
```

---

## 🔌 Configuration CORS

Le backend autorise :

* `http://localhost:4200`
* les URLs **ngrok**

Configuration dans `backend/main.py`.

---

## 🧪 Utilisation de l’application

1. Lancer le **backend**
2. Lancer le **frontend web** ou l’app **mobile Android**
3. Importer une image histopathologique (PNG / JPG / JPEG)
4. Obtenir :

   * la prédiction (**bénin / malin**)
   * le **taux de confiance**

---

## 📦 Dépendances principales

### Backend

* fastapi
* uvicorn
* tensorflow
* opencv-python
* numpy
* python-multipart
* python-dotenv
* google-generativeai

### Frontend

* @angular/core
* rxjs
* jspdf
* @capacitor/core

---

## 🤖 API Google Gemini (Flashcards)

Utilisée pour la génération de flashcards médicales.

### Configuration

1. Créer une clé sur **Google AI Studio**
2. Créer un fichier `.env` dans `backend/`
3. Ajouter :

```
GEMINI_API_KEY=your_api_key_here
```

---

## ⚠️ Notes importantes

* Ne **jamais versionner** : `node_modules/`, `dist/`, `.env`
* RAM recommandée : **4 Go+**
* Le premier lancement est plus lent (chargement du modèle)

---

## 🐛 Dépannage rapide

### ❌ git add frontEnd échoue

* Vérifier que `node_modules/` est dans `.gitignore`
* Supprimer `frontEnd/.git` s’il existe

### ❌ Mobile ne se connecte pas

* Vérifier ngrok actif
* Vérifier l’URL API côté Angular

---

