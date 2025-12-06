# Exp'Air Medical - Workflow Figma AI + Infrastructure

## 🤖 Rôles & Coordination

**Figma Make** : Génération des composants UI React/TypeScript
**Moi (Antigravity)** : Setup infrastructure (Supabase, GitHub, intégration)
**Gemini** : Coordination et fourniture des prompts optimisés

---

## 📋 Queue de Tâches Figma

### Prompt 1 - PatientList.tsx
**Status**: [/] En cours
**Prompt Gemini**:
> "Génère un composant React 'PatientList' sous forme de tableau interactif avec colonnes (Nom, N° Série Machine, Dernière Synchro, Statut IAH), une barre de recherche en haut, des filtres (Tous/Alerte), et des badges de statut colorés (Vert/Rouge) pour chaque ligne."

**Envoyé à Figma**: Oui
**Code récupéré**: Non

---

### Prompt 2 - EquipmentMonitor.tsx
**Status**: [ ] En attente
**Prompt Gemini**:
> "Crée un composant 'EquipmentMonitor' sous forme de carte affichant les métriques PPC (Fuite L/min, IAH, Pression) avec trois jauges circulaires SVG animées et des indicateurs visuels d'alerte rouge si les seuils sont dépassés."

**Envoyé à Figma**: Non
**Code récupéré**: Non

---

### Prompt 3 - InterventionForm.tsx
**Status**: [ ] En attente
**Envoyé à Figma**: Non
**Code récupéré**: Non

---

### Prompt 4 - DashboardStats.tsx
**Status**: [ ] En attente
**Envoyé à Figma**: Non
**Code récupéré**: Non

---

## ⚙️ Infrastructure Technique (Ma Responsabilité)

- [x] Supabase client configuré
- [x] GitHub repository créé
- [x] Routes de base intégrées
- [ ] Schema Supabase pour patients
- [ ] Schema Supabase pour équipements
- [ ] Types TypeScript pour données médicales
- [ ] API helpers Supabase

---

## 🔄 Workflow

1. **Gemini** fournit prompt optimisé
2. **Moi** → envoie prompt à Figma Make
3. **Figma** génère le composant (~2-5 min)
4. **Moi** → récupère code via bouton "Télécharger"
5. **Moi** → copie-colle dans projet + fix imports
6. **Repeat** pour composant suivant

**Temps estimé total**: 30-45 min (4 composants × ~10 min/comp)
