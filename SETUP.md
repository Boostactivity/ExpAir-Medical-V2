# Exp'Air Medical V2 - Configuration

## ⚙️ Configuration Supabase

### Variables d'Environnement

Créez un fichier `.env.local` à la racine du projet avec vos credentials Supabase :

```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_clé_anonyme_supabase
```

### Obtenir vos Credentials

1. Connectez-vous à [Supabase](https://supabase.com)
2. Sélectionnez votre projet
3. Allez dans `Settings` → `API`
4. Copiez :
   - **URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

## 🗄️ Structure de la Base de Données

La table `alerts` doit avoir la structure suivante :

```sql
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_name TEXT NOT NULL,
  equipment_type TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('critique', 'urgente', 'normale')),
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Index pour performance
CREATE INDEX idx_alerts_is_resolved ON alerts(is_resolved);
CREATE INDEX idx_alerts_created_at ON alerts(created_at DESC);
CREATE INDEX idx_alerts_resolved_at ON alerts(resolved_at DESC);
```

## 🚀 Installation et Lancement

### Installation des Dépendances

```bash
npm install
```

### Lancer en Mode Développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

### Build de Production

```bash
npm run build
```

## 📱 Fonctionnalités Disponibles

### Pages Médicales

- **`/monitoring`** : Dashboard temps réel des alertes
  - Filtrage par sévérité (Toutes / Critiques / Résolues)
  - Rafraîchissement auto toutes les 30s
  - Subscriptions temps réel Supabase
  - Boutons d'action : Appeler / Marquer résolu

- **`/interventions`** : Historique des interventions
  - Liste chronologique des alertes résolues
  - Calcul automatique de la durée d'intervention
  - Tri par date de résolution (DESC)

### Actions Disponibles

- **Appeler un patient** : Click sur "Appeler" ouvre l'app téléphone native
- **Résoudre une alerte** : Update Supabase en temps réel
- **Monitoring live** : WebSocket Supabase pour mises à jour instantanées

## 🔧 Développement

### Ajouter des Données de Test

```sql
INSERT INTO alerts (patient_name, equipment_type, severity, phone, address)
VALUES 
  ('Jean Dupont', 'Concentrateur d''oxygène', 'critique', '+33612345678', '12 Rue de la Santé, 75013 Paris'),
  ('Marie Martin', 'Ventilateur', 'urgente', '+33687654321', '45 Avenue Victor Hugo, 69002 Lyon'),
  ('Pierre Bernard', 'Aspirateur médical', 'normale', '+33698765432', '8 Boulevard Gambetta, 33000 Bordeaux');
```

### Technologies Utilisées

- **React** + **TypeScript** + **Vite**
- **Supabase** (PostgreSQL + Real-time)
- **React Router** (navigation)
- **Tailwind CSS** + **shadcn/ui** (composants UI)
- **Lucide React** (icônes)

## ⚠️ Notes Importantes

- Les variables d'environnement **doivent** commencer par `VITE_` pour être accessibles dans Vite
- Ne **jamais** commit `.env.local` dans Git
- Les subscriptions temps réel nécessitent que Realtime soit activé sur Supabase
- La fonction d'appel utilise `tel:` URL scheme (fonctionne sur mobile et certains OS desktop)

## 📞 Support

En cas de problème :
1. Vérifiez que `.env.local` est correctement configuré
2. Vérifiez que la table `alerts` existe dans Supabase
3. Vérifiez les logs de la console browser (F12)
4. Consultez les logs Supabase dans le dashboard
