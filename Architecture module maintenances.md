  # 🔧 ARCHITECTURE COMPLÈTE - Module Gestion Maintenances Véhicules
  **Fleetbase KounHany - Projet 2026**

  ---

  ## 📋 TABLE DES MATIÈRES
  1. [Vue d'ensemble](#vue-densemble)
  2. [Modèle de données](#modèle-de-données)
  3. [API Endpoints](#api-endpoints)
  4. [Flux de données](#flux-de-données)
  5. [Mock Data](#mock-data)
  6. [Décisions techniques](#décisions-techniques)
  7. [Diagrammes](#diagrammes)

  ---

  ## 🎯 VUE D'ENSEMBLE

  ### Objectif
  Permettre aux utilisateurs de créer des demandes de maintenance pour leurs véhicules via un wizard 4 étapes, avec sélection de produits, garages, et rendez-vous.

  ### Architecture
  ```
  UTILISATEUR
      ↓
  Frontend Wizard (4 Steps)
      ↓
  Ember Services (data management)
      ↓
  API REST (Laravel)
      ↓
  Base de Données MySQL
      ↓
  Stockage & Traitement
  ```

  ### Statuts Maintenance
  ```
  pending (En attente)
      ↓
  confirmed (Confirmée)
      ↓
  in_progress (En cours)
      ↓
  completed (Complétée)
      ↓
  paid (Payée)
  ```

  ---

  ## 💾 MODÈLE DE DONNÉES

  ### TABLE: `repair_products` (Produits de réparation)

  **Colonnes:**
  ```sql
  id (bigint, PK)
  uuid (string, 36, unique) - Identifiant Fleetbase
  company_uuid (string, 36) - Entreprise
  name (string, 255) - Nom du produit
  description (text) - Description
  category (string, 100) - Catégorie (filtre, huile, etc)
  sku (string, 100, unique) - Code produit
  price_mad (decimal, 10,2) - Prix en MAD
  currency (string, 3, default: 'MAD')
  stock_quantity (int, default: 0)
  is_active (boolean, default: 1)
  api_reference (string, 255) - Ref API externe (future)
  meta (json) - Données additionnelles
  created_at (timestamp)
  updated_at (timestamp)
  deleted_at (timestamp, nullable)
  ```

  **Indexes:**
  ```sql
  - uuid (unique)
  - company_uuid
  - sku
  - category
  - is_active
  ```

  ---

  ### TABLE: `garages` (Garages/Ateliers)

  **Colonnes:**
  ```sql
  id (bigint, PK)
  uuid (string, 36, unique)
  company_uuid (string, 36)
  name (string, 255) - Nom du garage
  description (text)
  phone (string, 20)
  email (string, 255)
  address (string, 500)
  city (string, 100)
  latitude (decimal, 10, 8, nullable)
  longitude (decimal, 11, 8, nullable)
  base_price_mad (decimal, 10,2) - Prix forfaitaire de base
  currency (string, 3, default: 'MAD')
  services_offered (json) - ["vidange", "diagnostic", "remplacement"]
  is_active (boolean, default: 1)
  api_reference (string, 255) - Ref API externe
  working_hours_start (time) - 09:00
  working_hours_end (time) - 17:30
  rating (decimal, 3,2, nullable)
  meta (json)
  created_at (timestamp)
  updated_at (timestamp)
  deleted_at (timestamp, nullable)
  ```

  **Indexes:**
  ```sql
  - uuid (unique)
  - company_uuid
  - city
  - is_active
  ```

  ---

  ### TABLE: `appointment_slots` (Créneaux disponibles)

  **Colonnes:**
  ```sql
  id (bigint, PK)
  uuid (string, 36, unique)
  garage_uuid (string, 36, FK → garages.uuid)
  date (date)
  time (time) - Format HH:MM
  duration_minutes (int, default: 60)
  max_capacity (int, default: 1)
  booked_count (int, default: 0)
  is_available (boolean) - 1 si (booked_count < max_capacity)
  api_reference (string, 255)
  meta (json)
  created_at (timestamp)
  updated_at (timestamp)
  ```

  **Indexes:**
  ```sql
  - uuid (unique)
  - garage_uuid
  - date
  - (garage_uuid, date) - Composite
  - is_available
  ```

  ---

  ### TABLE: `maintenance_requests` (Demandes de maintenance)

  **Colonnes:**
  ```sql
  id (bigint, PK)
  uuid (string, 36, unique)
  public_id (string, 50) - Pour affichage (MNT-2025-001)
  company_uuid (string, 36, FK)
  user_uuid (string, 36, FK → users.uuid) - Créateur
  vehicle_uuid (string, 36, FK → vehicles.uuid)
  garage_uuid (string, 36, FK → garages.uuid)
  appointment_slot_uuid (string, 36, FK → appointment_slots.uuid)

  -- Détails maintenance
  maintenance_type (string, 100) - "vidange_complet", "diagnostic", etc
  status (string, 50) - pending, confirmed, in_progress, completed, paid
  priority (string, 20) - low, medium, high, critical

  -- Localisation
  city (string, 100)
  address (string, 500, nullable)

  -- Coûts
  total_products_cost_mad (decimal, 10,2)
  garage_service_cost_mad (decimal, 10,2)
  subtotal_mad (decimal, 10,2) - products + garage
  tax_mad (decimal, 10,2) - TVA/Taxes
  discount_mad (decimal, 10,2, nullable) - Code promo
  total_cost_mad (decimal, 10,2) - Final

  currency (string, 3, default: 'MAD')

  -- Données additionnelles
  customer_message (text, nullable)
  notes (text, nullable)
  attachments (json, nullable) - URLs fichiers
  line_items (json) - Copie des produits au moment de la commande

  -- Dates
  scheduled_date (date)
  scheduled_time (time)
  started_at (timestamp, nullable)
  completed_at (timestamp, nullable)
  paid_at (timestamp, nullable)

  -- Paiement
  payment_status (string, 50) - pending, partial, completed
  payment_method (string, 50, nullable) - cash, card, check, etc
  payment_reference (string, 255, nullable)

  -- Audit
  created_by_uuid (string, 36)
  updated_by_uuid (string, 36, nullable)
  deleted_at (timestamp, nullable)
  created_at (timestamp)
  updated_at (timestamp)
  ```

  **Indexes:**
  ```sql
  - uuid (unique)
  - public_id (unique)
  - company_uuid
  - user_uuid
  - vehicle_uuid
  - garage_uuid
  - status
  - payment_status
  - (company_uuid, created_at) - Pour filtres
  - created_at (pour tri)
  ```

  ---

  ### TABLE: `maintenance_items` (Produits sélectionnés)

  **Colonnes:**
  ```sql
  id (bigint, PK)
  uuid (string, 36, unique)
  maintenance_request_uuid (string, 36, FK → maintenance_requests.uuid)
  repair_product_uuid (string, 36, FK → repair_products.uuid)

  -- Détails produit (copie au moment du choix)
  product_name (string, 255)
  product_sku (string, 100)
  quantity (int, default: 1)
  unit_price_mad (decimal, 10,2)
  total_price_mad (decimal, 10,2) - quantity * unit_price

  currency (string, 3, default: 'MAD')

  -- Audit
  created_at (timestamp)
  updated_at (timestamp)
  ```

  **Indexes:**
  ```sql
  - uuid (unique)
  - maintenance_request_uuid
  - repair_product_uuid
  ```

  ---

  ### RELATIONS DIAGRAM

  ```
  users (1)
      ↓ 1
      └─────→ (n) maintenance_requests
                  ↓ 1
                  ├─────→ (n) maintenance_items
                  │           ↓ 1
                  │           └─────→ (1) repair_products
                  │
                  ├─────→ (1) vehicles
                  │           ↓ 1
                  │           └─────→ (1) fleets
                  │
                  ├─────→ (1) garages
                  │           ↓ 1
                  │           └─────→ (n) appointment_slots
                  │
                  └─────→ (1) appointment_slots
  ```

  ---

  ## 🔌 API ENDPOINTS

  ### BASE URL
  ```
  POST   /api/v1/maintenance-requests
  GET    /api/v1/maintenance-requests
  GET    /api/v1/maintenance-requests/:id
  PUT    /api/v1/maintenance-requests/:id
  DELETE /api/v1/maintenance-requests/:id

  GET    /api/v1/repair-products
  GET    /api/v1/repair-products/:id

  GET    /api/v1/garages
  GET    /api/v1/garages/:id
  GET    /api/v1/garages/:id/slots

  GET    /api/v1/appointment-slots
  GET    /api/v1/appointment-slots/available
  ```

  ---

  ### 1️⃣ CREATE MAINTENANCE REQUEST

  **Endpoint:**
  ```
  POST /api/v1/maintenance-requests
  ```

  **Request Body:**
  ```json
  {
    "vehicle_uuid": "veh_abc123...",
    "maintenance_type": "vidange_complet",
    "city": "Casablanca",
    "garage_uuid": "gar_xyz789...",
    "appointment_slot_uuid": "slot_111...",
    "products": [
      {
        "repair_product_uuid": "prod_1",
        "quantity": 1
      },
      {
        "repair_product_uuid": "prod_2",
        "quantity": 2
      }
    ],
    "customer_message": "Message client optionnel",
    "discount_code": "PROMO10"
  }
  ```

  **Response (201):**
  ```json
  {
    "data": {
      "id": "mnt_abc123...",
      "uuid": "mnt_abc123...",
      "public_id": "MNT-2025-0001",
      "vehicle": {
        "id": "veh_abc123",
        "display_name": "RENAULT CLIO IV Grandtour",
        "plate_number": "AB-123-CD"
      },
      "garage": {
        "id": "gar_xyz789",
        "name": "SPA CLEAN CAR",
        "city": "Casablanca"
      },
      "appointment": {
        "date": "2025-03-15",
        "time": "10:00"
      },
      "items": [
        {
          "product_name": "Filtre à carburant",
          "quantity": 1,
          "unit_price_mad": 164.00,
          "total_price_mad": 164.00
        }
      ],
      "costs": {
        "total_products_mad": 164.00,
        "garage_service_mad": 100.00,
        "subtotal_mad": 264.00,
        "tax_mad": 0.00,
        "discount_mad": 0.00,
        "total_mad": 264.00,
        "currency": "MAD"
      },
      "status": "pending",
      "payment_status": "pending",
      "created_at": "2025-03-12T14:30:00Z"
    }
  }
  ```

  ---

  ### 2️⃣ GET REPAIR PRODUCTS

  **Endpoint:**
  ```
  GET /api/v1/repair-products?category=filtre&limit=10&page=1
  ```

  **Query Params:**
  - `category` (optional) - Filtrer par catégorie
  - `search` (optional) - Recherche textuelle
  - `limit` (default: 20)
  - `page` (default: 1)
  - `sort` (default: -created_at)

  **Response (200):**
  ```json
  {
    "data": [
      {
        "id": "prod_1",
        "uuid": "prod_uuid_1",
        "name": "Filtre à carburant",
        "description": "Filtre de haute qualité...",
        "category": "filtres",
        "sku": "CFI10659",
        "price_mad": 164.00,
        "currency": "MAD",
        "stock_quantity": 45,
        "is_active": true
      },
      {
        "id": "prod_2",
        "uuid": "prod_uuid_2",
        "name": "Filtre air habitacle",
        "description": "Pour une meilleure qualité d'air...",
        "category": "filtres",
        "sku": "715746",
        "price_mad": 111.00,
        "currency": "MAD",
        "stock_quantity": 30,
        "is_active": true
      }
    ],
    "meta": {
      "total": 45,
      "per_page": 20,
      "current_page": 1,
      "last_page": 3
    }
  }
  ```

  ---

  ### 3️⃣ GET GARAGES

  **Endpoint:**
  ```
  GET /api/v1/garages?city=Casablanca&limit=10
  ```

  **Query Params:**
  - `city` (optional) - Filtrer par ville
  - `search` (optional) - Recherche par nom
  - `limit` (default: 20)
  - `page` (default: 1)

  **Response (200):**
  ```json
  {
    "data": [
      {
        "id": "gar_1",
        "uuid": "gar_uuid_1",
        "name": "SPA CLEAN CAR",
        "description": "Garage spécialisé en entretien...",
        "phone": "+212612345678",
        "email": "contact@sparcleancar.ma",
        "address": "123 Bd Ibn Sina",
        "city": "Casablanca",
        "latitude": 33.5731,
        "longitude": -7.5898,
        "base_price_mad": 100.00,
        "services_offered": ["vidange", "diagnostic", "remplacement"],
        "is_active": true,
        "rating": 4.5,
        "working_hours": {
          "start": "09:00",
          "end": "17:30"
        }
      },
      {
        "id": "gar_2",
        "uuid": "gar_uuid_2",
        "name": "SILVER AUTO SERVICE",
        "description": "Service automobile premium...",
        "phone": "+212612345679",
        "email": "info@silverauto.ma",
        "address": "456 Rue Hassan II",
        "city": "Casablanca",
        "latitude": 33.5743,
        "longitude": -7.5919,
        "base_price_mad": 160.00,
        "services_offered": ["vidange", "diagnostic", "remplacement", "carrosserie"],
        "is_active": true,
        "rating": 4.8
      }
    ],
    "meta": {
      "total": 8,
      "per_page": 10,
      "current_page": 1
    }
  }
  ```

  ---

  ### 4️⃣ GET AVAILABLE SLOTS (pour un garage)

  **Endpoint:**
  ```
  GET /api/v1/garages/gar_uuid_1/slots?date=2025-03-15
  ```

  **Query Params:**
  - `date` (required) - Format YYYY-MM-DD
  - `time_start` (optional) - 09:00

  **Response (200):**
  ```json
  {
    "data": {
      "garage": {
        "id": "gar_1",
        "name": "SPA CLEAN CAR",
        "working_hours": {
          "start": "09:00",
          "end": "17:30"
        }
      },
      "date": "2025-03-15",
      "slots": [
        {
          "id": "slot_1",
          "uuid": "slot_uuid_1",
          "time": "09:00",
          "is_available": true,
          "booked_count": 0,
          "max_capacity": 1
        },
        {
          "id": "slot_2",
          "uuid": "slot_uuid_2",
          "time": "09:30",
          "is_available": true,
          "booked_count": 0,
          "max_capacity": 1
        },
        {
          "id": "slot_3",
          "uuid": "slot_uuid_3",
          "time": "10:00",
          "is_available": false,
          "booked_count": 1,
          "max_capacity": 1
        }
      ]
    }
  }
  ```

  ---

  ### 5️⃣ GET MAINTENANCE REQUESTS (Liste)

  **Endpoint:**
  ```
  GET /api/v1/maintenance-requests?status=pending&limit=20&page=1
  ```

  **Query Params:**
  - `status` (optional) - pending, confirmed, in_progress, completed, paid
  - `vehicle_uuid` (optional)
  - `garage_uuid` (optional)
  - `payment_status` (optional)
  - `limit` (default: 20)
  - `page` (default: 1)
  - `sort` (default: -created_at)

  **Response (200):**
  ```json
  {
    "data": [
      {
        "id": "mnt_1",
        "uuid": "mnt_uuid_1",
        "public_id": "MNT-2025-0001",
        "vehicle": {
          "display_name": "RENAULT CLIO IV",
          "plate_number": "AB-123-CD"
        },
        "garage": {
          "name": "SPA CLEAN CAR"
        },
        "scheduled_date": "2025-03-15",
        "scheduled_time": "10:00",
        "status": "confirmed",
        "total_cost_mad": 264.00,
        "payment_status": "pending",
        "created_at": "2025-03-12T14:30:00Z"
      }
    ],
    "meta": {
      "total": 5,
      "per_page": 20,
      "current_page": 1
    }
  }
  ```

  ---

  ### 6️⃣ UPDATE MAINTENANCE REQUEST STATUS

  **Endpoint:**
  ```
  PUT /api/v1/maintenance-requests/mnt_uuid_1
  ```

  **Request Body:**
  ```json
  {
    "status": "in_progress",
    "notes": "Maintenance en cours...",
    "started_at": "2025-03-15T10:05:00Z"
  }
  ```

  **Response (200):**
  ```json
  {
    "data": {
      "id": "mnt_1",
      "uuid": "mnt_uuid_1",
      "status": "in_progress",
      "started_at": "2025-03-15T10:05:00Z",
      "updated_at": "2025-03-15T10:05:00Z"
    }
  }
  ```

  ---

  ## 🔄 FLUX DE DONNÉES

  ### STEP 1: Sélection Véhicule

  ```
  USER selects vehicle
      ↓
  Frontend stores: vehicle_uuid, maintenance_type, city
      ↓
  wizard-service.selectedVehicle = { uuid, display_name, plate_number }
  wizard-service.selectedType = "vidange_complet"
  wizard-service.selectedCity = "Casablanca"
      ↓
  MOVE TO STEP 2
  ```

  **Data stored in service:**
  ```javascript
  @tracked selectedVehicle = null;
  @tracked selectedMaintenanceType = null;
  @tracked selectedCity = null;
  ```

  ---

  ### STEP 2: Sélection Produits (Panier)

  ```
  Frontend calls: GET /api/v1/repair-products?category=filtres
      ↓
  repair-products.service returns: [Product, Product, ...]
      ↓
  USER clicks "Ajouter" → product added to cart
      ↓
  wizard-service.cart = [
    { product_uuid, product_name, quantity: 1, unit_price, total_price }
  ]
      ↓
  USER clicks "Suivant" (or "Vider panier")
      ↓
  MOVE TO STEP 3 or CLEAR CART
  ```

  **Data stored in service:**
  ```javascript
  @tracked cart = []; // Array of { product_uuid, quantity, ... }
  @tracked cartTotal = 0;
  ```

  ---

  ### STEP 3: Sélection Garage & Créneau

  ```
  Frontend calls: GET /api/v1/garages?city=Casablanca
      ↓
  garage-integration.service returns: [Garage, Garage, ...]
      ↓
  USER selects garage
      ↓
  Frontend calls: GET /api/v1/garages/gar_id/slots?date=2025-03-15
      ↓
  appointment-slots returned with availability
      ↓
  USER selects time slot (ex: 10:00)
      ↓
  wizard-service.selectedGarage = { uuid, name, price_mad }
  wizard-service.selectedSlot = { uuid, time, date }
      ↓
  MOVE TO STEP 4
  ```

  **Data stored in service:**
  ```javascript
  @tracked selectedGarage = null;
  @tracked selectedSlot = null;
  @tracked availableSlots = [];
  ```

  ---

  ### STEP 4: Récapitulatif & Validation

  ```
  USER reviews all data:
    - Vehicle: RENAULT CLIO IV (AB-123-CD)
    - Type: Vidange complet
    - City: Casablanca
    - Products: [Filtre (164 MAD), Huile (400 MAD)]
    - Garage: SPA CLEAN CAR
    - Date/Time: 2025-03-15 10:00
    - Costs:
      * Products: 564 MAD
      * Garage: 100 MAD
      * Total: 664 MAD
      ↓
  USER can:
    - Enter promo code → recalculate total
    - Enter message
    - Click CONFIRM
      ↓
  Frontend calls:
    POST /api/v1/maintenance-requests {
      vehicle_uuid, maintenance_type, city,
      garage_uuid, appointment_slot_uuid,
      products: [...], customer_message, discount_code
    }
      ↓
  API creates maintenance_request + maintenance_items
      ↓
  Response returns new maintenance (id, public_id, status)
      ↓
  Frontend redirects to list
      ↓
  USER sees "MNT-2025-0001" in list with status "pending"
  ```

  ---

  ## 📊 MOCK DATA

  ### Produits (repair_products)

  ```json
  [
    {
      "uuid": "prod_uuid_1",
      "name": "Filtre à carburant",
      "category": "filtres",
      "sku": "CFI10659",
      "price_mad": 164.00,
      "stock_quantity": 45,
      "is_active": true
    },
    {
      "uuid": "prod_uuid_2",
      "name": "Filtre à carburant Premium",
      "category": "filtres",
      "sku": "KX338/260",
      "price_mad": 159.75,
      "stock_quantity": 30,
      "is_active": true
    },
    {
      "uuid": "prod_uuid_3",
      "name": "Filtre air de l'habitacle",
      "category": "filtres",
      "sku": "715746",
      "price_mad": 111.00,
      "stock_quantity": 50,
      "is_active": true
    },
    {
      "uuid": "prod_uuid_4",
      "name": "Substance étanchéisante",
      "category": "produits_chimiques",
      "sku": "4937287",
      "price_mad": 807.00,
      "stock_quantity": 10,
      "is_active": true
    },
    {
      "uuid": "prod_uuid_5",
      "name": "Huile moteur 5W40",
      "category": "huiles",
      "sku": "10142",
      "price_mad": 450.00,
      "stock_quantity": 60,
      "is_active": true
    },
    {
      "uuid": "prod_uuid_6",
      "name": "Huile de transmission",
      "category": "huiles",
      "sku": "10161",
      "price_mad": 480.00,
      "stock_quantity": 40,
      "is_active": true
    },
    {
      "uuid": "prod_uuid_7",
      "name": "Liquide de refroidissement",
      "category": "liquides",
      "sku": "10162",
      "price_mad": 380.00,
      "stock_quantity": 35,
      "is_active": true
    }
  ]
  ```

  ### Garages

  ```json
  [
    {
      "uuid": "gar_uuid_1",
      "name": "SPA CLEAN CAR",
      "phone": "+212612345678",
      "email": "contact@spacleancar.ma",
      "address": "51 Bd Ibn Al Ouanane",
      "city": "Casablanca",
      "latitude": 33.5731,
      "longitude": -7.5898,
      "base_price_mad": 100.00,
      "services_offered": ["vidange", "diagnostic", "remplacement"],
      "is_active": true,
      "rating": 4.5,
      "working_hours_start": "09:00",
      "working_hours_end": "17:30"
    },
    {
      "uuid": "gar_uuid_2",
      "name": "SILVER AUTO SERVICE",
      "phone": "+212612345679",
      "email": "info@silverauto.ma",
      "address": "456 Rue Hassan II",
      "city": "Casablanca",
      "latitude": 33.5743,
      "longitude": -7.5919,
      "base_price_mad": 160.00,
      "services_offered": ["vidange", "diagnostic", "remplacement"],
      "is_active": true,
      "rating": 4.8,
      "working_hours_start": "09:00",
      "working_hours_end": "17:30"
    },
    {
      "uuid": "gar_uuid_3",
      "name": "Hord AUTO SERVICES BELVEDERE",
      "phone": "+212612345680",
      "email": "service@hardauto.ma",
      "address": "789 Bd Corniche",
      "city": "Casablanca",
      "latitude": 33.5812,
      "longitude": -7.6145,
      "base_price_mad": 0.00,
      "services_offered": ["vidange", "diagnostic", "remplacement", "carrosserie"],
      "is_active": true,
      "rating": 4.2,
      "working_hours_start": "08:00",
      "working_hours_end": "18:00"
    },
    {
      "uuid": "gar_uuid_4",
      "name": "DABA PNEU AIN SEBAA",
      "phone": "+212612345681",
      "email": "info@dabapneu.ma",
      "address": "123 Rue Sidi Maaroufi",
      "city": "Casablanca",
      "latitude": 33.5450,
      "longitude": -7.6200,
      "base_price_mad": 120.00,
      "services_offered": ["pneus", "vidange", "diagnostic"],
      "is_active": true,
      "rating": 4.0,
      "working_hours_start": "09:00",
      "working_hours_end": "17:30"
    }
  ]
  ```

  ### Créneaux disponibles (exemple pour garage_uuid_1 et date 2025-03-15)

  ```json
  {
    "date": "2025-03-15",
    "garage": {
      "uuid": "gar_uuid_1",
      "name": "SPA CLEAN CAR",
      "working_hours_start": "09:00",
      "working_hours_end": "17:30"
    },
    "slots": [
      { "uuid": "slot_1", "time": "09:00", "is_available": true, "booked_count": 0 },
      { "uuid": "slot_2", "time": "09:30", "is_available": true, "booked_count": 0 },
      { "uuid": "slot_3", "time": "10:00", "is_available": false, "booked_count": 1 },
      { "uuid": "slot_4", "time": "10:30", "is_available": true, "booked_count": 0 },
      { "uuid": "slot_5", "time": "11:00", "is_available": true, "booked_count": 0 },
      { "uuid": "slot_6", "time": "11:30", "is_available": true, "booked_count": 0 },
      { "uuid": "slot_7", "time": "12:00", "is_available": true, "booked_count": 0 },
      { "uuid": "slot_8", "time": "12:30", "is_available": false, "booked_count": 1 },
      { "uuid": "slot_9", "time": "14:00", "is_available": true, "booked_count": 0 },
      { "uuid": "slot_10", "time": "14:30", "is_available": true, "booked_count": 0 },
      { "uuid": "slot_11", "time": "15:00", "is_available": true, "booked_count": 0 },
      { "uuid": "slot_12", "time": "15:30", "is_available": true, "booked_count": 0 },
      { "uuid": "slot_13", "time": "16:00", "is_available": true, "booked_count": 0 },
      { "uuid": "slot_14", "time": "16:30", "is_available": true, "booked_count": 0 },
      { "uuid": "slot_15", "time": "17:00", "is_available": true, "booked_count": 0 }
    ]
  }
  ```

  ---

  ## ⚙️ DÉCISIONS TECHNIQUES

  ### 1. Devise forcée: MAD
  - ✅ Pas de sélection devise
  - ✅ Tous les prix en MAD
  - ✅ Affichage: "264.00 MAD"
  - ✅ Devise stockée en BD pour future flexibilité

  ### 2. Pas de localisation géographique GeoJSON
  - ✅ Utiliser latitude/longitude simples
  - ✅ Pas de validation GeoJSON stricte
  - ✅ Affichage sur carte optionnel (future)

  ### 3. Promo code
  - ✅ Code optionnel
  - ✅ Recalcule total_cost_mad
  - ✅ Stocké en BD (discount_mad)

  ### 4. Statuts maintenance
  ```
  pending → confirmed → in_progress → completed → paid
  ```
  - Création = `pending`
  - Admin confirm = `confirmed`
  - Garage start = `in_progress`
  - Garage finish = `completed`
  - Paiement = `paid`

  ### 5. Paiement optionnel pour MVP
  - ✅ payment_status suivi
  - ✅ Pas de traitement carte pour MVP
  - ✅ Méthodes: cash, card, check

  ### 6. Fake Data Strategy
  - ✅ Seeders Laravel pour BD locale
  - ✅ API endpoints retournent fake data
  - ✅ Structure prête pour intégration API réelle plus tard

  ### 7. Relations polymorphes
  - ❌ PAS de polymorphes maintenant
  - ✅ Clés étrangères simples (garage_uuid, vehicle_uuid)
  - ✅ Plus simple à maintenir

  ### 8. Audit & Logs
  - ✅ created_by_uuid, updated_by_uuid
  - ✅ created_at, updated_at (Eloquent auto)
  - ✅ Activity logs via Spatie (futur)

  ---

  ## 📈 DIAGRAMMES

  ### Diagramme Entité-Relation

  ```
  ┌─────────────┐
  │   users     │
  │─────────────│
  │ uuid (PK)   │
  │ name        │
  │ email       │
  └─────────────┘
          │ 1
          │
          │ (n) maintenance_requests
          │
          ↓
  ┌──────────────────────────┐        ┌─────────────────┐
  │ maintenance_requests      │───1───→│   vehicles      │
  │──────────────────────────│        │─────────────────│
  │ uuid (PK)                 │        │ uuid (PK)       │
  │ vehicle_uuid (FK)         │        │ plate_number    │
  │ garage_uuid (FK)          │        │ display_name    │
  │ appointment_slot_uuid(FK) │        └─────────────────┘
  │ status                    │
  │ total_cost_mad            │              │ 1
  │ payment_status            │              │
  └──────────────────────────┘              │ (n) fleets
          │ 1                                │
          │ (n) maintenance_items            ↓
          │                         ┌──────────────┐
          ↓                         │   fleets     │
  ┌──────────────────────┐         │──────────────│
  │ maintenance_items     │         │ uuid (PK)    │
  │──────────────────────│         │ name         │
  │ uuid (PK)            │─────1──→│ city         │
  │ repair_product_uuid  │         └──────────────┘
  │ quantity             │
  │ unit_price_mad       │         ┌─────────────────┐
  │ total_price_mad      │         │ repair_products │
  └──────────────────────┘         │─────────────────│
                                    │ uuid (PK)       │
                                    │ name            │
                                    │ category        │
                                    │ price_mad       │
                                    │ stock_quantity  │
                                    └─────────────────┘

  ┌──────────────────────┐        ┌──────────────────┐
  │  garages             │───1───→│ appointment_slots│
  │──────────────────────│        │──────────────────│
  │ uuid (PK)            │ (n)    │ uuid (PK)        │
  │ name                 │        │ garage_uuid (FK) │
  │ city                 │        │ date             │
  │ base_price_mad       │        │ time             │
  │ working_hours_start  │        │ is_available     │
  │ working_hours_end    │        └──────────────────┘
  └──────────────────────┘
  ```

  ### Flux Wizard

  ```
  START
    ↓
  STEP 1: Vehicle Selection
    - Search vehicle (fleet, VIN, plate, driver)
    - Select maintenance type
    - Select city
    ↓
  STEP 2: Products Cart
    - Show products API
    - Add/remove products
    - Calculate cart total
    ↓
  STEP 3: Garage & Appointment
    - Show garages by city
    - Select garage
    - Show available slots
    - Select date/time
    ↓
  STEP 4: Review & Confirm
    - Show all data
    - Optional: promo code
    - Optional: message
    - Click CONFIRM
    ↓
  CREATE MAINTENANCE REQUEST
    - POST to API
    - Create maintenance_request
    - Create maintenance_items
    ↓
  SHOW SUCCESS
    - Display MNT-2025-0001
    - Redirect to list
    ↓
  END
  ```

  ---

  ## 📝 RÉSUMÉ FICHIERS À CRÉER

  ### Backend (27 fichiers)
  ```
  Models (5):
    - MaintenanceRequest.php
    - MaintenanceItem.php
    - RepairProduct.php
    - Garage.php
    - AppointmentSlot.php

  Controllers (4):
    - MaintenanceRequestController.php
    - RepairProductController.php
    - GarageController.php
    - AppointmentSlotController.php

  Resources (5):
    - MaintenanceRequestResource.php
    - MaintenanceItemResource.php
    - RepairProductResource.php
    - GarageResource.php
    - AppointmentSlotResource.php

  Migrations (5):
    - create_repair_products_table.php
    - create_garages_table.php
    - create_appointment_slots_table.php
    - create_maintenance_requests_table.php
    - create_maintenance_items_table.php

  Seeders (2):
    - RepairProductSeeder.php
    - GarageSeeder.php
  ```

  ### Frontend (22 fichiers)
  ```
  Components (8):
    - maintenance-wizard/step-1-vehicle.hbs/js
    - maintenance-wizard/step-2-products.hbs/js
    - maintenance-wizard/step-3-garage.hbs/js
    - maintenance-wizard/step-4-review.hbs/js

  Controllers (2):
    - controllers/management/maintenances/index.js
    - controllers/management/maintenances/new.js

  Routes (2):
    - routes/management/maintenances/index.js
    - routes/management/maintenances/new.js

  Services (3):
    - services/maintenance-wizard.js
    - services/repair-products.js
    - services/garage-integration.js

  Templates (4):
    - templates/management/maintenances/index.hbs
    - templates/management/maintenances/new.hbs

  Ember Data Models (5):
    - repair-product.js
    - garage.js
    - appointment-slot.js
    - maintenance-request.js
    - maintenance-item.js
  ```

  ---

  ## ✅ VALIDATION AVANT CODAGE

  - [x] BD structure définie
  - [x] API endpoints documentée
  - [x] Flux de données clair
  - [x] Mock data complète
  - [x] Décisions techniques confirmées
  - [x] Fichiers à créer listés
  - [x] Routes/controllers pattern établis

  **Status:** ✅ **PRÊT POUR DÉVELOPPEMENT**

  ---

  **Date:** 12 Mars 2026
  **Responsable:** Anas (anas0gabbadi@gmail.com)
  **Projet:** KounHany - Fleetbase Maintenances