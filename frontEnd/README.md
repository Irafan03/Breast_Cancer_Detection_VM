# Application de Détection du Cancer du Sein

Application Angular pour la détection du cancer du sein (IDC) utilisant l'intelligence artificielle. Cette application permet d'uploader des images histopathologiques et d'obtenir une analyse avec un niveau de confiance.

## Fonctionnalités

- 🏠 **Landing Page** : Page d'accueil professionnelle avec présentation de l'application
- 📤 **Upload d'images** : Interface moderne pour uploader des images (drag & drop ou sélection de fichier)
- 🔍 **Analyse IA** : Communication avec l'API FastAPI pour l'analyse des images
- 📊 **Affichage des résultats** : Affichage clair des résultats avec niveau de confiance et barre de progression

## Prérequis

- Node.js (version 18 ou supérieure)
- npm ou yarn
- API FastAPI backend en cours d'exécution sur `http://localhost:8080`

## Installation

1. Installer les dépendances :

```bash
npm install
```

## Démarrage

Pour démarrer le serveur de développement :

```bash
npm start
# ou
ng serve
```

L'application sera accessible sur `http://localhost:4200/`

## Configuration de l'API

⚠️ **Important** : Avant d'utiliser l'application, vous devez modifier votre API FastAPI pour accepter les uploads de fichiers. Consultez le fichier `API_MODIFICATION.md` pour les instructions détaillées.

L'API doit être configurée pour :
- Accepter les requêtes POST sur `/predict`
- Accepter les fichiers uploadés via FormData
- Retourner un JSON avec `label` et `confidence`
- Autoriser les requêtes CORS depuis `http://localhost:4200`

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
