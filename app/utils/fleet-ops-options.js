import toPowerSelectGroups from '@fleetbase/ember-ui/utils/to-power-select-groups';

export const driverTypes = [
    { label: 'Temps plein', value: 'full_time', description: 'Chauffeur employé permanent' },
    { label: 'Temps partiel', value: 'part_time', description: 'Chauffeur à temps partiel ou contractuel' },
    { label: 'Contractuel', value: 'contractor', description: 'Chauffeur indépendant' },
    { label: 'Propriétaire-exploitant', value: 'owner_operator', description: 'Chauffeur propriétaire de son véhicule' },
    { label: 'Temporaire', value: 'temporary', description: 'Chauffeur à court terme ou saisonnier' },
    { label: 'Apprenti', value: 'apprentice', description: 'Chauffeur en formation ou sous supervision' },
    { label: 'Remplaçant / Disponible', value: 'relief', description: 'Couvre les quarts et les pics de demande' },
    { label: 'Certifié matières dangereuses', value: 'hazmat', description: 'Qualifié pour le transport de matières dangereuses' },
    { label: 'Spécialiste cargo réfrigéré', value: 'reefer_specialist', description: 'Expérimenté avec les cargaisons sous température contrôlée' },
    { label: 'Transport exceptionnel', value: 'heavy_haul', description: 'Certifié pour les chargements hors gabarit' },
    { label: 'Coursier / Dernier kilomètre', value: 'last_mile', description: 'Spécialiste livraison urbaine' },
];

export const driverStatuses = [
    { label: 'Actif', value: 'active', description: 'Chauffeur disponible pour les missions' },
    { label: 'Inactif', value: 'inactive', description: 'Chauffeur non actif' },
    { label: 'En service', value: 'on_duty', description: 'Chauffeur en service et disponible' },
    { label: 'Hors service', value: 'off_duty', description: 'Chauffeur hors service' },
    { label: 'En pause', value: 'on_break', description: 'Chauffeur en pause planifiée' },
    { label: 'Suspendu', value: 'suspended', description: 'Chauffeur temporairement suspendu' },
    { label: 'Licencié', value: 'terminated', description: 'Chauffeur ne travaille plus avec l\'entreprise' },
    { label: 'Pré-quart', value: 'pre_shift', description: 'Pointé, en préparation de quart' },
    { label: 'En formation', value: 'training', description: 'En formation, non disponible' },
    { label: 'Intégration', value: 'onboarding', description: 'Documents/intégration en cours' },
    { label: 'En route', value: 'on_route', description: 'En train de conduire un itinéraire planifié' },
    { label: 'Retardé', value: 'delayed', description: 'Retard (circulation, météo, etc.)' },
    { label: 'Arrêt suite accident', value: 'accident_hold', description: 'Temporairement arrêté suite à un incident' },
    { label: 'En congé', value: 'on_leave', description: 'Congé approuvé' },
    { label: 'Absent', value: 'no_show', description: 'Quart manqué' },
    { label: 'Vérification en attente', value: 'pending_verification', description: 'En attente de vérification des documents' },
];

export const vehicleTypes = [
    { label: 'Camion', value: 'truck', description: 'Camion de fret standard' },
    { label: 'Fourgonnette', value: 'van', description: 'Fourgonnette cargo ou de livraison' },
    { label: 'Remorque', value: 'trailer', description: 'Remorque cargo détachable' },
    { label: 'Moto', value: 'motorbike', description: 'Moto de livraison à deux roues' },
    { label: 'Voiture', value: 'car', description: 'Voiture particulière ou petit véhicule' },
    { label: 'Camion frigorifique', value: 'reefer', description: 'Transport à température contrôlée' },
    { label: 'Camion porte-conteneurs', value: 'container_truck', description: 'Camion pour cargo conteneurisé' },
    { label: 'Camion citerne', value: 'tanker', description: 'Camion pour transport de liquide/gaz' },
    { label: 'Camion fourgon', value: 'box_truck', description: 'Camion à caisse fermée' },
    { label: 'Plateau', value: 'flatbed', description: 'Plateforme ouverte pour cargo surdimensionné' },
    { label: 'Pick-up', value: 'pickup', description: 'Utilitaire léger' },
    { label: 'Bus / Minibus', value: 'bus', description: 'Transport de passagers' },
    { label: 'Chariot élévateur', value: 'forklift', description: 'Équipement de manutention' },
    { label: 'Véhicule électrique (VE)', value: 'ev', description: 'Véhicule électrique à batterie' },
    { label: 'Hybride', value: 'hybrid', description: 'Véhicule électrique hybride' },
    { label: 'Remorque de recharge', value: 'charging_trailer', description: 'Unité de recharge ou d\'alimentation mobile' },
];

export const vehicleStatuses = [
    { label: 'Disponible', value: 'available', description: 'Véhicule prêt à l\'utilisation' },
    { label: 'En utilisation', value: 'in_use', description: 'Véhicule assigné à un chauffeur/commande' },
    { label: 'En maintenance', value: 'maintenance', description: 'Véhicule en maintenance ou réparation' },
    { label: 'Hors service', value: 'out_of_service', description: 'Véhicule non opérationnel' },
    { label: 'Réservé', value: 'reserved', description: 'Véhicule réservé pour une mission future' },
    { label: 'Retraité', value: 'retired', description: 'Véhicule décommissionné' },
    { label: 'En attente de départ', value: 'staging', description: 'Préparé et en attente d\'expédition' },
    { label: 'En route', value: 'on_route', description: 'En cours d\'exécution d\'un itinéraire' },
    { label: 'En veille', value: 'idle', description: 'Démarré mais ne se déplace pas' },
    { label: 'En nettoyage', value: 'cleaning', description: 'En lavage/détailing' },
    { label: 'En attente de pièces', value: 'awaiting_parts', description: 'Maintenance en attente de pièces' },
    { label: 'Inspection requise', value: 'inspection_due', description: 'Inspection de conformité requise' },
    { label: 'Inspection échouée', value: 'inspection_failed', description: 'Inspection échouée — ne peut pas partir' },
    { label: 'Accident / Dommage', value: 'accident', description: 'Indisponible suite à un incident' },
    { label: 'Blocage conformité', value: 'compliance_hold', description: 'Bloqué pour documents/permis expirés' },
    { label: 'Volé', value: 'stolen', description: 'Signalé volé — ne pas expédier' },
];

export const vendorTypes = [
    { label: 'Fournisseur', value: 'vendor', description: 'Type de fournisseur général' },
    { label: 'Fournisseur intégré', value: 'integrated_vendor', description: 'Fournisseur avec intégration API native' },
    { label: 'Fournisseur de carburant', value: 'fuel_supplier', description: 'Fournit le carburant pour les véhicules' },
    { label: 'Prestataire de maintenance', value: 'maintenance_provider', description: 'Effectue les réparations/maintenance' },
    { label: 'Fournisseur de pièces', value: 'parts_supplier', description: 'Fournit des pièces détachées' },
    { label: 'Prestataire technologique', value: 'tech_provider', description: 'Fournit des services logiciels ou matériels' },
    { label: 'Partenaire logistique', value: 'logistics_partner', description: 'Sous-traitant logistique' },
    { label: 'Assureur', value: 'insurance_provider', description: 'Fournit des services d\'assurance' },
    { label: 'Service de remorquage', value: 'towing_service', description: 'Assistance routière et remorquage' },
    { label: 'Société de leasing', value: 'leasing_company', description: 'Fournit des véhicules en location ou leasing' },
    { label: 'Agence de chauffeurs', value: 'driver_staffing', description: 'Fournit des chauffeurs contractuels' },
    { label: 'Transitaire douanier', value: 'customs_broker', description: 'Gère le dédouanement' },
    { label: 'Fournisseur de télématique', value: 'telematics_provider', description: 'Fournit GPS, ELD et services télématiques IoT' },
    { label: 'Transitaire', value: 'freight_forwarder', description: 'Gère les expéditions internationales' },
    { label: 'Conformité / Audit', value: 'compliance_audit', description: 'Audits réglementaires, sécurité, formation' },
    { label: 'Lavage & Détailing', value: 'wash_detailing', description: 'Services de nettoyage et désinfection' },
    { label: 'Service pneus', value: 'tire_service', description: 'Vente, réparation et montage de pneus' },
    { label: 'Carrosserie & Peinture', value: 'body_paint', description: 'Réparation accident et refinition' },
    { label: 'Stockage / Parc', value: 'yard_storage', description: 'Stockage de véhicules court/long terme' },
    { label: 'Réseau de recharge', value: 'charging_network', description: 'Fournisseur d\'infrastructure de recharge VE' },
];

export const vendorStatuses = [
    { label: 'Actif', value: 'active', description: 'Fournisseur actif et disponible' },
    { label: 'Inactif', value: 'inactive', description: 'Fournisseur inactif ou en attente' },
    { label: 'Suspendu', value: 'suspended', description: 'Fournisseur temporairement suspendu' },
    { label: 'Blacklisté', value: 'blacklisted', description: 'Fournisseur banni des opérations' },
    { label: 'Connecté', value: 'connected', description: 'Connexion API fonctionnelle' },
    { label: 'Synchronisation', value: 'syncing', description: 'Synchronisation des données en cours' },
    { label: 'Erreur d\'intégration', value: 'integration_error', description: 'Connexion API en échec' },
    { label: 'En cours d\'examen', value: 'under_review', description: 'En cours d\'évaluation pour approbation' },
    { label: 'Préféré', value: 'preferred', description: 'Fournisseur préféré avec conditions négociées' },
    { label: 'Préqualifié', value: 'prequalified', description: 'Répond aux normes minimales' },
    { label: 'Résilié', value: 'terminated', description: 'Relation formellement terminée' },
];

export const contactTypes = [
    { label: 'Client', value: 'customer', description: 'Contact client final' },
    { label: 'Contact fournisseur', value: 'vendor_contact', description: 'Point de contact chez le fournisseur' },
    { label: 'Contact chauffeur', value: 'driver_contact', description: 'Chauffeur ou contact terrain' },
    { label: 'Gestionnaire de flotte', value: 'fleet_manager', description: 'Contact pour la gestion des flottes' },
    { label: 'Support', value: 'support', description: 'Contact support général' },
    { label: 'Expéditeur', value: 'consignor', description: 'Expéditeur des marchandises' },
    { label: 'Destinataire', value: 'consignee', description: 'Destinataire des marchandises' },
    { label: 'Comptabilité fournisseurs', value: 'accounts_payable', description: 'Contact facturation et paiements' },
    { label: 'Approvisionnement', value: 'procurement', description: 'Contact achats' },
    { label: 'Sécurité du site', value: 'site_security', description: 'Poste de garde/sécurité' },
    { label: 'Responsable quai', value: 'dock_manager', description: 'Contact opérations quai de chargement' },
    { label: 'Répartiteur', value: 'dispatcher', description: 'Contact planification et opérations' },
];

export const contactStatuses = [
    { label: 'Actif', value: 'active', description: 'Contact valide et utilisé' },
    { label: 'Inactif', value: 'inactive', description: 'Contact non valide' },
    { label: 'Bloqué', value: 'blocked', description: 'Contact bloqué' },
    { label: 'Principal', value: 'primary', description: 'Contact principal' },
    { label: 'Vérifié', value: 'verified', description: 'Email/téléphone vérifié' },
    { label: 'Non vérifié', value: 'unverified', description: 'Coordonnées non vérifiées' },
    { label: 'Ne pas contacter', value: 'do_not_contact', description: 'Respecter la liste DNC' },
    { label: 'Archivé', value: 'archived', description: 'Conservé pour archive' },
];

export const fleetTypes = [
    { label: 'Flotte régionale', value: 'regional', description: 'Flotte couvrant une région spécifique' },
    { label: 'Flotte longue distance', value: 'long_haul', description: 'Flotte pour trajets nationaux ou internationaux' },
    { label: 'Flotte urbaine', value: 'urban', description: 'Flotte pour livraisons en ville' },
    { label: 'Flotte spécialisée', value: 'specialized', description: 'Flotte pour cargo spécial (matières dangereuses, réfrigéré)' },
    { label: 'Flotte dernier kilomètre', value: 'last_mile', description: 'Opérations urbaines denses, courtes livraisons' },
    { label: 'Flotte tronçon principal', value: 'linehaul', description: 'Routes terminales à terminales' },
    { label: 'Flotte de service', value: 'service', description: 'Véhicules de techniciens terrain' },
    { label: 'Pool de location', value: 'rental_pool', description: 'Pool de véhicules partagés/loués' },
    { label: 'Flotte électrique', value: 'electric', description: 'Opérations axées sur les VE' },
    { label: 'Coursiers moto', value: 'moto_courier', description: 'Flotte de livraison à deux roues' },
];

export const fleetStatuses = [
    { label: 'Active', value: 'active', description: 'Flotte active et opérationnelle' },
    { label: 'Inactive', value: 'inactive', description: 'Flotte inactive ou dissoute' },
    { label: 'En attente', value: 'on_hold', description: 'Opérations de flotte suspendues' },
    { label: 'En expansion', value: 'scaling', description: 'Ajout actif de véhicules/chauffeurs' },
    { label: 'En réduction', value: 'downsizing', description: 'Réduction de la flotte' },
    { label: 'Saisonnière', value: 'seasonal', description: 'Opérationnel pendant des saisons spécifiques' },
    { label: 'Pilote', value: 'pilot', description: 'Opérations d\'essai à portée limitée' },
    { label: 'En décommissionnement', value: 'decommissioning', description: 'En cours de fermeture' },
];

export const fuelReportTypes = [
    { label: 'Ravitaillement', value: 'refueling', description: 'Journal de ravitaillement standard' },
    { label: 'Appoint', value: 'top_up', description: 'Ravitaillement partiel' },
    { label: 'Plein', value: 'full_tank', description: 'Ravitaillement complet' },
    { label: 'Ajustement', value: 'adjustment', description: 'Correction ou ajustement manuel' },
    { label: 'Transaction carte carburant', value: 'card_txn', description: 'Importé depuis une carte carburant' },
    { label: 'Saisie manuelle', value: 'manual_entry', description: 'Saisi par l\'utilisateur/chauffeur' },
    { label: 'Ravitaillement en vrac', value: 'bulk_refuel', description: 'Ravitaillement en masse depuis un parc' },
    { label: 'DEF / AdBlue', value: 'def', description: 'Achat de fluide d\'échappement diesel' },
    { label: 'Transfert', value: 'transfer', description: 'Carburant transféré entre actifs/réservoirs' },
    { label: 'Remboursement / Annulation', value: 'refund', description: 'Transaction remboursée ou annulée' },
];

export const fuelReportStatuses = [
    { label: 'Enregistré', value: 'recorded', description: 'Rapport carburant enregistré' },
    { label: 'Vérifié', value: 'verified', description: 'Rapport vérifié par le responsable' },
    { label: 'Contesté', value: 'disputed', description: 'Rapport en cours d\'examen' },
    { label: 'Rejeté', value: 'rejected', description: 'Rapport rejeté' },
    { label: 'En attente de vérification', value: 'pending', description: 'En attente de vérification' },
    { label: 'Associé', value: 'matched', description: 'Associé automatiquement au trajet/véhicule' },
    { label: 'Non associé', value: 'unmatched', description: 'Aucun trajet/véhicule correspondant trouvé' },
    { label: 'Anomalie signalée', value: 'flagged', description: 'Valeur aberrante détectée' },
    { label: 'Remboursé', value: 'reimbursed', description: 'Dépense chauffeur remboursée' },
];

export const issueStatuses = [
    { label: 'Ouvert', value: 'open', description: 'Problème ouvert et non résolu' },
    { label: 'En attente', value: 'pending', description: 'Problème enregistré mais non commencé' },
    { label: 'Triage', value: 'triage', description: 'Évaluation et classification initiale' },
    { label: 'En attente de planification', value: 'backlogged', description: 'Priorité établie mais non planifié' },
    { label: 'En cours', value: 'in_progress', description: 'Problème en cours de traitement' },
    { label: 'Mise à jour requise', value: 'requires_update', description: 'Informations supplémentaires nécessaires' },
    { label: 'En révision', value: 'in_review', description: 'En cours de révision ou de QA' },
    { label: 'Réouvert', value: 're_opened', description: 'Problème réouvert après résolution' },
    { label: 'En attente de pièces', value: 'awaiting_parts', description: 'Bloqué en attente de pièces' },
    { label: 'En attente fournisseur', value: 'awaiting_vendor', description: 'En attente d\'action tierce' },
    { label: 'Surveillance', value: 'monitoring', description: 'Résolu mais sous observation' },
    { label: 'Escaladé', value: 'escalated', description: 'Problème escaladé pour révision supérieure' },
    { label: 'Doublon', value: 'duplicate', description: 'Fusionné dans un problème existant' },
    { label: 'Révision en attente', value: 'pending_review', description: 'En attente de révision du responsable' },
    { label: 'Résolu', value: 'resolved', description: 'Problème résolu' },
    { label: 'Terminé', value: 'completed', description: 'Travail entièrement terminé et vérifié' },
    { label: 'Fermé', value: 'closed', description: 'Problème fermé, aucune action supplémentaire' },
    { label: 'Ne sera pas corrigé', value: 'wont_fix', description: 'Risque accepté — aucune action prévue' },
    { label: 'Annulé', value: 'canceled', description: 'Problème annulé avant achèvement' },
];

export const issueTypes = [
    { label: 'Véhicule', value: 'vehicle', description: 'Problèmes liés au véhicule (mécanique, électrique, dommages, accidents, etc.)' },
    { label: 'Chauffeur', value: 'driver', description: 'Problèmes liés au chauffeur (comportement, formation, documentation, sécurité)' },
    { label: 'Itinéraire', value: 'route', description: 'Problèmes de routage et navigation' },
    { label: 'Charge / Cargo', value: 'payload-cargo', description: 'Problèmes de cargo (dommages, perte, documentation)' },
    { label: 'Logiciel / Technique', value: 'software-technical', description: 'Problèmes système/application/appareil' },
    { label: 'Opérationnel', value: 'operational', description: 'Problèmes de processus, ressources, fournisseurs ou coûts' },
    { label: 'Client', value: 'customer', description: 'Service client, facturation, communications' },
    { label: 'Sécurité', value: 'security', description: 'Accès non autorisé, vol, vandalisme' },
    { label: 'Environnement / Durabilité', value: 'environmental-sustainability', description: 'Risques environnementaux, émissions, déchets' },
];

export const issueCategories = [
    { label: 'Problèmes mécaniques', value: 'mechanical_problems', description: 'Problèmes de performance mécanique ou pannes.', group: 'vehicle' },
    { label: 'Pannes électriques', value: 'electrical_faults', description: 'Pannes électriques/batterie affectant l\'exploitation.', group: 'vehicle' },
    { label: 'Accidents & Collisions', value: 'accidents_collisions', description: 'Tout accident impliquant le véhicule.', group: 'vehicle' },
    { label: 'Dommages esthétiques', value: 'cosmetic_damages', description: 'Problèmes de carrosserie non critiques.', group: 'vehicle' },
    { label: 'Problèmes de pneus', value: 'tire_issues', description: 'Usure, crevaisons, éclatements, problèmes d\'alignement.', group: 'vehicle' },
    { label: 'Électronique & Instruments', value: 'electronics_instruments', description: 'Pannes tableau de bord, capteurs, télématique.', group: 'vehicle' },
    { label: 'Alertes de maintenance', value: 'maintenance_alerts', description: 'Notifications de maintenance planifiée/en retard.', group: 'vehicle' },
    { label: 'Problèmes de consommation', value: 'fuel_efficiency', description: 'Consommation anormale par rapport à la référence.', group: 'vehicle' },
    { label: 'Pénurie de carburant', value: 'fuel_shortage', description: 'Carburant insuffisant causant une perturbation.', group: 'vehicle' },
    { label: 'Problèmes de comportement', value: 'behavior_concerns', description: 'Conduite, professionnalisme, respect des politiques.', group: 'driver' },
    { label: 'Documentation', value: 'driver_documentation', description: 'Licences, permis ou accréditations expirées.', group: 'driver' },
    { label: 'Gestion du temps', value: 'time_management', description: 'Retards, délais manqués.', group: 'driver' },
    { label: 'Communication', value: 'driver_communication', description: 'Lacunes de communication chauffeur↔dispatch.', group: 'driver' },
    { label: 'Besoins en formation', value: 'training_needs', description: 'Formation ou recyclage requis.', group: 'driver' },
    { label: 'Violations santé & sécurité', value: 'health_safety', description: 'Non-conformité H&S ou incidents.', group: 'driver' },
    { label: 'Déviation d\'itinéraire', value: 'route_deviation', description: 'Écart par rapport à l\'itinéraire planifié.', group: 'route' },
    { label: 'Itinéraires inefficaces', value: 'inefficient_routes', description: 'Temps/coût/kilométrage inutiles.', group: 'route' },
    { label: 'Problèmes de sécurité', value: 'route_safety', description: 'Dangers sur l\'itinéraire.', group: 'route' },
    { label: 'Itinéraires bloqués', value: 'blocked_routes', description: 'Fermetures de routes, restrictions.', group: 'route' },
    { label: 'Conditions météo défavorables', value: 'unfavorable_weather', description: 'Retards ou dangers météo.', group: 'route' },
    { label: 'Considérations environnementales', value: 'environmental_considerations', description: 'Restrictions environnementales sur l\'itinéraire.', group: 'route' },
    { label: 'Dommages / Perte de cargo', value: 'cargo_damage', description: 'Marchandises endommagées, avariées ou manquantes.', group: 'payload-cargo' },
    { label: 'Marchandises endommagées', value: 'damaged_goods', description: 'Marchandises reçues/livrées endommagées.', group: 'payload-cargo' },
    { label: 'Marchandises égarées', value: 'misplaced_goods', description: 'Articles mal acheminés ou perdus.', group: 'payload-cargo' },
    { label: 'Problèmes de documentation', value: 'cargo_documentation', description: 'Documents cargo incorrects/manquants.', group: 'payload-cargo' },
    { label: 'Marchandises sensibles à la température', value: 'temperature_sensitive_goods', description: 'Défaillances de la chaîne du froid.', group: 'payload-cargo' },
    { label: 'Chargement incorrect', value: 'incorrect_cargo_loading', description: 'Plan de chargement incorrect ou empilage dangereux.', group: 'payload-cargo' },
    { label: 'Bugs', value: 'bugs', description: 'Défauts impactant le flux de travail.', group: 'software-technical' },
    { label: 'Panne système', value: 'system_outage', description: 'Indisponibilité de l\'application/plateforme.', group: 'software-technical' },
    { label: 'Échecs d\'intégration', value: 'integration_failures', description: 'Erreurs de synchronisation API tierce.', group: 'software-technical' },
    { label: 'Performance', value: 'performance', description: 'Comportement système lent ou dégradé.', group: 'software-technical' },
    { label: 'Demandes de fonctionnalités', value: 'feature_requests', description: 'Améliorations ou capacités demandées.', group: 'software-technical' },
    { label: 'Vulnérabilités de sécurité', value: 'security_vulnerabilities', description: 'Exploitation potentielle ou configuration non sécurisée.', group: 'software-technical' },
    { label: 'Conformité', value: 'compliance', description: 'Non-conformité réglementaire ou politique.', group: 'operational' },
    { label: 'Papiers & Permis', value: 'paperwork_permits', description: 'Documents incorrects/expirés.', group: 'operational' },
    { label: 'Allocation des ressources', value: 'resource_allocation', description: 'Personnel ou actifs insuffisants/incorrects.', group: 'operational' },
    { label: 'Dépassements de coûts', value: 'cost_overruns', description: 'Anomalies budget/dépenses.', group: 'operational' },
    { label: 'Communication', value: 'operational_communication', description: 'Défaillances de communication interne.', group: 'operational' },
    { label: 'Problèmes fournisseurs', value: 'vendor_management', description: 'Lacunes de coordination tierce ou SLA.', group: 'operational' },
    { label: 'Réclamation client', value: 'customer_complaint', description: 'Insatisfaction ou incident signalé.', group: 'customer' },
    { label: 'Qualité de service', value: 'service_quality', description: 'Service en dessous des attentes.', group: 'customer' },
    { label: 'Écarts de facturation', value: 'billing_discrepancies', description: 'Erreurs ou litiges de facturation.', group: 'customer' },
    { label: 'Problème de communication', value: 'customer_communication', description: 'Problèmes de communication client.', group: 'customer' },
    { label: 'Erreurs de commande', value: 'order_errors', description: 'Mauvais article/quantité/adresse/etc.', group: 'customer' },
    { label: 'Accès non autorisé', value: 'unauthorized_access', description: 'Intrusion ou accès inapproprié.', group: 'security' },
    { label: 'Vol / Vandalisme', value: 'theft', description: 'Actifs volés ou dommages malveillants.', group: 'security' },
    { label: 'Problèmes de données', value: 'data_concerns', description: 'Violation de données potentielle ou réelle.', group: 'security' },
    { label: 'Sécurité physique', value: 'physical_security', description: 'Failles de sécurité des installations ou des marchandises.', group: 'security' },
    { label: 'Problèmes d\'intégrité des données', value: 'data_integrity', description: 'Corruption ou incohérence des données.', group: 'security' },
    { label: 'Consommation de carburant', value: 'fuel_consumption', description: 'Modèles d\'utilisation excessifs ou anormaux.', group: 'environmental-sustainability' },
    { label: 'Empreinte carbone', value: 'carbon_footprint', description: 'Problèmes de suivi des émissions.', group: 'environmental-sustainability' },
    { label: 'Gestion des déchets', value: 'waste_management', description: 'Traitement et élimination des déchets.', group: 'environmental-sustainability' },
    { label: 'Opportunités d\'initiatives vertes', value: 'green_initiatives', description: 'Améliorations des programmes de durabilité.', group: 'environmental-sustainability' },
];

export const issuePriorities = [
    { label: 'Faible', value: 'low', description: 'Problème mineur avec peu ou pas d\'impact opérationnel.', group: 'severity' },
    { label: 'Moyen', value: 'medium', description: 'Problème modéré nécessitant attention mais non urgent.', group: 'severity' },
    { label: 'Élevé', value: 'high', description: 'Problème sérieux affectant les opérations.', group: 'severity' },
    { label: 'Critique', value: 'critical', description: 'Problème grave causant une perturbation majeure.', group: 'severity' },
    { label: 'Maintenance planifiée', value: 'scheduled_maintenance', description: 'Tâches de maintenance planifiées.', group: 'planned' },
    { label: 'Suggestion opérationnelle', value: 'operational_suggestion', description: 'Idée d\'amélioration ou recommandation.', group: 'planned' },
];

export const placeTypes = [
    { label: 'Entrepôt', value: 'warehouse', description: 'Entrepôt de stockage ou de distribution' },
    { label: 'Dépôt', value: 'depot', description: 'Dépôt ou hub opérationnel' },
    { label: 'Station carburant', value: 'fuel_station', description: 'Station de ravitaillement' },
    { label: 'Point de contrôle', value: 'checkpoint', description: 'Point de contrôle frontalier ou sécuritaire' },
    { label: 'Adresse client', value: 'customer_location', description: 'Adresse de livraison client' },
    { label: 'Site fournisseur', value: 'vendor_facility', description: 'Site appartenant au fournisseur' },
    { label: 'Port', value: 'port', description: 'Port de chargement ou de déchargement' },
    { label: 'Aéroport', value: 'airport', description: 'Hub de fret aérien' },
    { label: 'Centre de distribution', value: 'distribution_center', description: 'DC régional / fulfillment' },
    { label: 'Cross-dock', value: 'cross_dock', description: 'Transfert immédiat sans stockage' },
    { label: 'Mini-hub', value: 'micro_hub', description: 'Mini-entrepôt urbain pour dernier kilomètre' },
    { label: 'Aire de repos / Escale', value: 'rest_area', description: 'Lieu de repos pour chauffeur' },
    { label: 'Station de pesée', value: 'weigh_station', description: 'Site de pesée réglementaire' },
    { label: 'Péage', value: 'toll_plaza', description: 'Point de paiement de péage' },
    { label: 'Centre de service', value: 'service_center', description: 'Installation de réparation/maintenance' },
    { label: 'Borne de recharge', value: 'charging_station', description: 'Lieu de recharge VE' },
];

export const placeStatuses = [
    { label: 'Actif', value: 'active', description: 'Lieu actif et valide' },
    { label: 'Inactif', value: 'inactive', description: 'Lieu non utilisé' },
    { label: 'Accès restreint', value: 'restricted', description: 'Lieu à accès restreint' },
    { label: 'Fermé', value: 'closed', description: 'Lieu définitivement fermé' },
    { label: 'Nouveau', value: 'new', description: 'Récemment créé — détails incomplets' },
    { label: 'Temporairement fermé', value: 'temp_closed', description: 'Fermé pour une période limitée' },
    { label: 'En construction', value: 'under_construction', description: 'Travaux en cours' },
    { label: 'Permis requis', value: 'permit_required', description: 'Entrée nécessite un permis' },
    { label: 'Approche avec précaution', value: 'approach_caution', description: 'Difficultés d\'accès ou dangers connus' },
];

export const routeProfileOptions = [
    { label: 'Conduite', value: 'driving', description: 'Itinéraires optimisés pour véhicules à moteur.' },
    { label: 'Vélo', value: 'bicycle', description: 'Itinéraires optimisés pour vélos.' },
    { label: 'Marche', value: 'walking', description: 'Itinéraires piétons adaptés à la marche.' },
];

export const podOptions = [
    { label: 'Scan', value: 'scan', description: 'Preuve de livraison par scan QR ou code-barres.' },
    { label: 'Signature', value: 'signature', description: 'Preuve de livraison par signature du destinataire.' },
    { label: 'Photo', value: 'photo', description: 'Preuve de livraison par photo des marchandises.' },
    { label: 'SMS', value: 'sms', description: 'Preuve de livraison confirmée par SMS.' },
];

export const serviceRateCalculationMethods = [
    { label: 'Par mètre', value: 'per_meter', description: 'Calcul du coût basé sur le nombre de mètres parcourus.' },
    { label: 'Tarif fixe', value: 'fixed_meter', description: 'Tarif fixe par mètre quelle que soit la distance.' },
    { label: 'Tarif colis', value: 'parcel', description: 'Tarif dynamique basé sur le poids et les dimensions.' },
    { label: 'Par point de dépôt', value: 'per_drop', description: 'Coût appliqué par point de dépôt.' },
    { label: 'Algorithme', value: 'algo', description: 'Coût calculé dynamiquement par logique algorithmique.' },
];

export const serviceRateCodCalculationMethods = [
    { label: 'Frais fixe', value: 'flat', description: 'Frais fixe appliqué à toutes les transactions COD.' },
    { label: 'Pourcentage', value: 'percentage', description: 'Frais calculé en pourcentage du montant COD.' },
];

export const serviceRatePeakHourCalculationMethods = [
    { label: 'Frais fixe', value: 'flat', description: 'Supplément fixe appliqué aux heures de pointe.' },
    { label: 'Pourcentage', value: 'percentage', description: 'Supplément calculé en pourcentage du tarif de base.' },
];

export const distanceUnits = [
    { label: 'Mètre', value: 'm', description: 'Distances en mètres.' },
    { label: 'Kilomètre', value: 'km', description: 'Distances en kilomètres.' },
    { label: 'Pied', value: 'ft', description: 'Distances en pieds.' },
    { label: 'Yard', value: 'yd', description: 'Distances en yards.' },
    { label: 'Mile', value: 'mi', description: 'Distances en miles.' },
];

export const longDistanceUnits = [
    { label: 'Kilomètre', value: 'km', description: 'Distances en kilomètres.' },
    { label: 'Mile', value: 'mi', description: 'Distances en miles.' },
];

export const dimensionUnits = [
    { label: 'Centimètres', value: 'cm', description: 'Mesures en centimètres.' },
    { label: 'Pouces', value: 'in', description: 'Mesures en pouces.' },
    { label: 'Pieds', value: 'ft', description: 'Mesures en pieds.' },
    { label: 'Millimètres', value: 'mm', description: 'Mesures en millimètres.' },
    { label: 'Mètres', value: 'm', description: 'Mesures en mètres.' },
    { label: 'Yards', value: 'yd', description: 'Mesures en yards.' },
];

export const weightUnits = [
    { label: 'Grammes', value: 'g', description: 'Poids en grammes.' },
    { label: 'Onces', value: 'oz', description: 'Poids en onces.' },
    { label: 'Livres', value: 'lb', description: 'Poids en livres.' },
    { label: 'Kilogrammes', value: 'kg', description: 'Poids en kilogrammes.' },
];

export const serviceAreaTypes = [
    { label: 'Quartier', value: 'neighborhood', description: 'Petite zone localisée dans une ville.' },
    { label: 'Ville', value: 'city', description: 'Zone urbaine avec sa propre municipalité.' },
    { label: 'État', value: 'state', description: 'Division administrative majeure d\'un pays.' },
    { label: 'Province', value: 'province', description: 'Division territoriale dans un pays.' },
    { label: 'Région', value: 'region', description: 'Grande zone géographique incluant plusieurs villes.' },
    { label: 'Pays', value: 'country', description: 'Nation souveraine avec des frontières définies.' },
    { label: 'Continent', value: 'continent', description: 'Grande masse terrestre mondiale.' },
];

export const telematicStatuses = [
    { value: 'initialized', label: 'Initialisé', description: 'Entrée créée mais pas encore configurée.' },
    { value: 'configured', label: 'Configuré', description: 'Identifiants valides mais connexion non testée.' },
    { value: 'connecting', label: 'Connexion en cours', description: 'Tentative de connexion à l\'API fournisseur.' },
    { value: 'connected', label: 'Connecté', description: 'Authentifié et connecté à l\'API fournisseur.' },
    { value: 'synchronizing', label: 'Synchronisation', description: 'Synchronisation des données en cours.' },
    { value: 'active', label: 'Actif', description: 'Intégration saine et synchronisations normales.' },
    { value: 'degraded', label: 'Dégradé', description: 'Intégration partiellement fonctionnelle.' },
    { value: 'disconnected', label: 'Déconnecté', description: 'Connexion perdue ou authentification échouée.' },
    { value: 'error', label: 'Erreur', description: 'Problème fatal dans l\'intégration fournisseur.' },
    { value: 'disabled', label: 'Désactivé', description: 'Désactivé manuellement par l\'utilisateur.' },
    { value: 'archived', label: 'Archivé', description: 'Intégration obsolète ou remplacée.' },
];

export const telematicHealthStates = [
    { value: 'healthy', label: 'Sain', description: 'Intégration testée et stable.' },
    { value: 'warning', label: 'Avertissement', description: 'Problèmes mineurs détectés.' },
    { value: 'critical', label: 'Critique', description: 'Échec persistant ou aucune donnée reçue.' },
];

export const deviceTypes = [
    { label: 'Traceur GPS', value: 'gps_tracker', description: 'Appareil GPS autonome installé dans le véhicule.' },
    { label: 'Appareil OBD-II', value: 'obd2_plugin', description: 'Se branche sur le port OBD-II du véhicule.' },
    { label: 'Module CAN Bus', value: 'can_bus_module', description: 'Module câblé connecté au CAN bus du véhicule.' },
    { label: 'Dashcam télématique', value: 'dashcam_unit', description: 'Caméra + module télématique intégré.' },
    { label: 'Traceur actif sur batterie', value: 'battery_asset_tracker', description: 'Appareil sans fil pour actifs non alimentés.' },
    { label: 'Application smartphone', value: 'smartphone_app_device', description: 'Appareil mobile avec application de télématique.' },
    { label: 'Boîte noire câblée', value: 'hardwired_black_box', description: 'Unité de contrôle télématique installée en permanence.' },
    { label: 'Passerelle IoT mobile', value: 'mobile_edge_gateway', description: 'Passerelle multi-capteurs/IoT dans le véhicule.' },
    { label: 'Nœud télématique remorque', value: 'trailer_container_node', description: 'Nœud spécialisé pour remorques et conteneurs.' },
];

export const sensorTypes = [
    { label: 'Récepteur GPS / GNSS', value: 'gps_gnss', description: 'Capteur de positionnement global.' },
    { label: 'Accéléromètre', value: 'accelerometer', description: 'Mesure l\'accélération linéaire.' },
    { label: 'Gyroscope / IMU', value: 'gyroscope_imu', description: 'Unité de mesure inertielle.' },
    { label: 'Capteur niveau carburant', value: 'fuel_level', description: 'Mesure le carburant restant dans le réservoir.' },
    { label: 'Capteur pression pneus (TPMS)', value: 'tire_pressure', description: 'Mesure la pression des pneus.' },
    { label: 'Diagnostic moteur / OBD', value: 'engine_diagnostic', description: 'Lit les codes de défaut moteur.' },
    { label: 'Capteur de température', value: 'temperature', description: 'Surveille la température ambiante ou des équipements.' },
    { label: 'Capteur d\'humidité', value: 'humidity', description: 'Détecte les niveaux d\'humidité.' },
    { label: 'Capteur porte / trappe', value: 'door_hatch', description: 'Surveille l\'état ouvert/fermé des portes.' },
    { label: 'Capteur vibration / choc', value: 'vibration_shock', description: 'Mesure les événements de vibration ou choc.' },
    { label: 'Capteur tension batterie', value: 'battery_voltage', description: 'Surveille la tension de la batterie.' },
    { label: 'Capteur géofence', value: 'geofence_event', description: 'Déclenche lors de l\'entrée/sortie d\'une zone géographique.' },
    { label: 'Capteur temps de ralenti', value: 'idle_time', description: 'Suit le moteur en marche avec véhicule à l\'arrêt.' },
    { label: 'Capteur comportement chauffeur', value: 'driver_behavior', description: 'Agrège les données pour scorer le comportement de conduite.' },
];

export const deviceStatuses = [
    { label: 'Inactif', value: 'inactive', description: 'Appareil créé mais pas encore activé.' },
    { label: 'Actif', value: 'active', description: 'Appareil en ligne et communiquant.' },
    { label: 'En ligne', value: 'online', description: 'Appareil connecté et transmettant des données.' },
    { label: 'Hors ligne', value: 'offline', description: 'Appareil éteint ou sans transmission.' },
    { label: 'En veille', value: 'sleeping', description: 'Appareil en mode basse consommation.' },
    { label: 'Inoccupé', value: 'idle', description: 'Connecté mais sans nouvelle télémétrie.' },
    { label: 'En maintenance', value: 'maintenance', description: 'Appareil en réparation ou mise à jour.' },
    { label: 'Dégradé', value: 'degraded', description: 'Partiellement fonctionnel; connectivité intermittente.' },
    { label: 'Erreur', value: 'error', description: 'Panne matérielle ou erreurs de communication répétées.' },
    { label: 'Déconnecté', value: 'disconnected', description: 'Appareil a perdu la connexion réseau.' },
    { label: 'Décommissionné', value: 'decommissioned', description: 'Appareil retraité de la flotte.' },
    { label: 'Désactivé', value: 'disabled', description: 'Désactivé manuellement.' },
    { label: 'En attente d\'activation', value: 'pending_activation', description: 'Provisionné mais pas encore vérifié.' },
    { label: 'En provisionnement', value: 'provisioning', description: 'Configuration ou initialisation en cours.' },
];

export const sensorStatuses = [
    { label: 'Actif', value: 'active', description: 'Capteur en ligne et transmettant normalement.' },
    { label: 'Inactif', value: 'inactive', description: 'Capteur non opérationnel.' },
    { label: 'En ligne', value: 'online', description: 'Capteur connecté et envoyant des données.' },
    { label: 'Hors ligne', value: 'offline', description: 'Capteur arrêté ou inaccessible.' },
    { label: 'Calibration', value: 'calibrating', description: 'Capteur en calibration ou auto-test.' },
    { label: 'Défaillant', value: 'faulty', description: 'Panne matérielle ou lectures incohérentes.' },
    { label: 'Dégradé', value: 'degraded', description: 'Partiellement fonctionnel.' },
    { label: 'En maintenance', value: 'maintenance', description: 'Temporairement désactivé pour maintenance.' },
    { label: 'Erreur', value: 'error', description: 'Échec critique signalé.' },
    { label: 'Déconnecté', value: 'disconnected', description: 'Lien de communication perdu.' },
    { label: 'Désactivé', value: 'disabled', description: 'Capteur désactivé manuellement.' },
    { label: 'Décommissionné', value: 'decommissioned', description: 'Capteur retraité.' },
];

export const measurementSystems = [
    { label: 'Système métrique', value: 'metric', description: 'Système international basé sur mètres, litres et kilogrammes.' },
    { label: 'Système impérial', value: 'imperial', description: 'Système britannique traditionnel utilisant miles, gallons et livres.' },
];

export const fuelVolumeUnits = [
    { label: 'Litres (L)', value: 'liters', description: 'Unité métrique pour mesurer le carburant liquide.' },
    { label: 'Gallons (US)', value: 'gallons_us', description: 'Gallon américain, égal à 3,785 litres.' },
    { label: 'Gallons (Impériaux)', value: 'gallons_imperial', description: 'Gallon impérial britannique, égal à 4,546 litres.' },
];

export const fuelTypes = [
    { label: 'Essence', value: 'petrol', description: 'Carburant traditionnel à moteur à combustion interne.' },
    { label: 'Diesel', value: 'diesel', description: 'Carburant pour moteurs à allumage par compression.' },
    { label: 'Électrique', value: 'electric', description: 'Véhicules à batterie sans émissions directes.' },
    { label: 'Hybride', value: 'hybrid', description: 'Combine moteur essence/diesel avec moteur électrique.' },
    { label: 'GPL (Gaz de Pétrole Liquéfié)', value: 'lpg', description: 'Carburant alternatif à base de propane ou butane.' },
    { label: 'GNC (Gaz Naturel Comprimé)', value: 'cng', description: 'Carburant stocké sous haute pression.' },
];

export const vehicleUsageTypes = [
    { label: 'Commercial', value: 'commercial', description: 'Utilisé pour des opérations commerciales.' },
    { label: 'Personnel', value: 'personal', description: 'Utilisé à des fins privées.' },
    { label: 'Mixte', value: 'mixed', description: 'Utilisé à des fins professionnelles et personnelles.' },
    { label: 'Location', value: 'rental', description: 'Mis en location à des tiers.' },
    { label: 'Flotte', value: 'fleet', description: 'Partie d\'un groupe de véhicules géré par l\'entreprise.' },
    { label: 'Opérationnel', value: 'operational', description: 'Véhicules activement utilisés pour les opérations.' },
    { label: 'En attente', value: 'standby', description: 'Actifs en attente pour usage futur ou urgence.' },
    { label: 'En maintenance', value: 'under_maintenance', description: 'Véhicules en réparation ou inspection.' },
    { label: 'Décommissionné', value: 'decommissioned', description: 'Actifs retirés des opérations.' },
    { label: 'En transit', value: 'in_transit', description: 'Actifs en cours de transport entre sites.' },
    { label: 'En prêt', value: 'on_loan', description: 'Actifs temporairement prêtés.' },
];

export const vehicleOwnershipTypes = [
    { label: 'Propriété de l\'entreprise', value: 'company_owned', description: 'Véhicules entièrement détenus par l\'entreprise.' },
    { label: 'Leasing', value: 'leased', description: 'Véhicules en leasing auprès d\'un fournisseur.' },
    { label: 'Location', value: 'rented', description: 'Actifs en location courte durée.' },
    { label: 'Financement (Crédit)', value: 'financed', description: 'Véhicules achetés par financement ou prêt.' },
    { label: 'Fourni par fournisseur', value: 'vendor_supplied', description: 'Actifs fournis et entretenus par des fournisseurs externes.' },
    { label: 'Propriété client', value: 'customer_owned', description: 'Actifs appartenant à un client mais opérés dans le système.' },
];

export const vehicleBodyTypes = [
    { label: 'Berline', value: 'sedan', description: 'Voiture passager standard avec coffre.' },
    { label: 'SUV', value: 'suv', description: 'Véhicule utilitaire sport.' },
    { label: 'Pick-up', value: 'pickup_truck', description: 'Camionnette avec espace cargo ouvert.' },
    { label: 'Fourgonnette', value: 'van', description: 'Véhicule polyvalent pour passagers ou marchandises.' },
    { label: 'Camion fourgon', value: 'box_truck', description: 'Camion cargo fermé pour livraisons.' },
    { label: 'Plateau', value: 'flatbed', description: 'Camion à plateforme ouverte pour charges surdimensionnées.' },
    { label: 'Remorque', value: 'trailer', description: 'Véhicule non motorisé remorqué pour fret.' },
    { label: 'Bus', value: 'bus', description: 'Véhicule de transport passagers.' },
];

export const vehicleBodySubTypes = [
    { label: 'Camion frigorifique', value: 'refrigerated_truck', description: 'Camion à température contrôlée.' },
    { label: 'Citerne', value: 'tanker', description: 'Véhicule pour transport de liquides.' },
    { label: 'Camion benne', value: 'tipper_truck', description: 'Camion avec benne hydraulique.' },
    { label: 'Porte-voitures', value: 'car_carrier', description: 'Remorque pour transport de véhicules.' },
    { label: 'Mini fourgonnette', value: 'mini_van', description: 'Fourgonnette compacte pour transport urbain.' },
    { label: 'Fourgon tôlé', value: 'panel_van', description: 'Fourgon fermé pour livraisons.' },
    { label: 'Châssis-cabine', value: 'chassis_cab', description: 'Base camion avec carrosserie arrière personnalisable.' },
    { label: 'Bus électrique', value: 'electric_bus', description: 'Bus à batterie pour transport durable.' },
    { label: 'Moto', value: 'motorbike', description: 'Actif à deux roues pour transport rapide.' },
];

export const transmissionTypes = [
    { label: 'Manuelle', value: 'manual', description: 'Véhicules nécessitant un changement de vitesse manuel.' },
    { label: 'Automatique', value: 'automatic', description: 'Véhicules avec transmission entièrement automatique.' },
    { label: 'Semi-automatique', value: 'semi_automatic', description: 'Combine contrôle manuel avec embrayage automatique.' },
    { label: 'CVT (Transmission à variation continue)', value: 'cvt', description: 'Utilise un système courroie/poulie.' },
    { label: 'Double embrayage', value: 'dual_clutch', description: 'Transmission haute performance à deux embrayages.' },
    { label: 'Transmission électrique', value: 'electric_drive', description: 'Transmission à vitesse unique pour VE.' },
];

export const odometerUnits = [...distanceUnits, { label: 'Heures', value: 'hours', description: 'Unité de mesure du temps.' }];

export default function fleetOpsOptions(key) {
    const allOptions = {
        driverTypes,
        driverStatuses,
        vehicleTypes,
        vehicleStatuses,
        vendorTypes,
        vendorStatuses,
        fleetTypes,
        fleetStatuses,
        contactTypes,
        contactStatuses,
        fuelReportTypes,
        fuelReportStatuses,
        issueTypes,
        issueStatuses,
        issueCategories,
        issueCategoriesPowerGroups: toPowerSelectGroups(issueCategories),
        issuePriorities,
        placeTypes,
        placeStatuses,
        routeProfileOptions,
        podOptions,
        serviceRateCalculationMethods,
        serviceRateCodCalculationMethods,
        serviceRatePeakHourCalculationMethods,
        distanceUnits,
        longDistanceUnits,
        dimensionUnits,
        weightUnits,
        serviceAreaTypes,
        telematicStatuses,
        telematicHealthStates,
        deviceTypes,
        sensorTypes,
        deviceStatuses,
        sensorStatuses,
        fuelTypes,
        fuelVolumeUnits,
        vehicleUsageTypes,
        vehicleOwnershipTypes,
        vehicleBodyTypes,
        vehicleBodySubTypes,
        transmissionTypes,
        odometerUnits,
        measurementSystems,
    };

    return allOptions[key] ?? [];
}