-- Schema Supabase pour Exp'Air Medical
-- Tables pour le monitoring médical PPC

-- Table des patients
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  serial_number TEXT UNIQUE NOT NULL,
  phone TEXT,
  address TEXT,
  equipment_model TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des synchronisations de données PPC
CREATE TABLE IF NOT EXISTS ppc_syncs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  synced_at TIMESTAMP WITH TIME ZONE NOT NULL,
  iah_value DECIMAL(5,2) NOT NULL, -- Index Apnée-Hypopnée
  leakage_lmin DECIMAL(5,2), -- Fuite en L/min
  pressure_cmh2o DECIMAL(5,2), -- Pression en cm H2O
  usage_hours DECIMAL(5,2), -- Heures d'utilisation
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des alertes (existante - on garde celle déjà créée)
-- Voir la table 'alerts' déjà en place

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_patients_serial ON patients(serial_number);
CREATE INDEX IF NOT EXISTS idx_ppc_syncs_patient_id ON ppc_syncs(patient_id);
CREATE INDEX IF NOT EXISTS idx_ppc_syncs_synced_at ON ppc_syncs(synced_at DESC);

-- Vue pour dernière synchro par patient
CREATE OR REPLACE VIEW latest_patient_sync AS
SELECT DISTINCT ON (patient_id)
  ppc_syncs.*,
  patients.name,
  patients.serial_number
FROM ppc_syncs
JOIN patients ON patients.id = ppc_syncs.patient_id
ORDER BY patient_id, synced_at DESC;

-- Fonction pour déterminer statut IAH
CREATE OR REPLACE FUNCTION get_iah_status(iah DECIMAL)
RETURNS TEXT AS $$
BEGIN
  IF iah >= 30 THEN
    RETURN 'alert';
  ELSE
    RETURN 'normal';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Données de test
INSERT INTO patients (name, serial_number, phone, address, equipment_model)
VALUES 
  ('Jean Dupont', 'PPC2024001', '+33612345678', '12 Rue de la Santé, 75013 Paris', 'ResMed AirSense 10'),
  ('Marie Martin', 'PPC2024002', '+33687654321', '45 Avenue Victor Hugo, 69002 Lyon', 'Philips DreamStation'),
  ('Pierre Bernard', 'PPC2024003', '+33698765432', '8 Boulevard Gambetta, 33000 Bordeaux', 'ResMed AirCurve 10')
ON CONFLICT (serial_number) DO NOTHING;

-- Synchros de test (dernières 24h)
INSERT INTO ppc_syncs (patient_id, synced_at, iah_value, leakage_lmin, pressure_cmh2o, usage_hours)
SELECT 
  id,
  NOW() - (random() * INTERVAL '24 hours'),
  (random() * 40)::DECIMAL(5,2), -- IAH entre 0 et 40
  (random() * 30)::DECIMAL(5,2), -- Fuite entre 0 et 30 L/min
  (8 + random() * 7)::DECIMAL(5,2), -- Pression entre 8 et 15 cmH2O
  (4 + random() * 6)::DECIMAL(5,2) -- Usage entre 4 et 10h
FROM patients;
