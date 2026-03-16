#!/bin/bash

echo "🔄 Installation des dépendances Composer..."
cd /fleetbase/api
composer install --no-dev --prefer-dist

echo "🔄 Synchronisation des customisations KounHany..."

echo "🔧 Synchronisant les extensions modifiées..."
cp /fleetbase/packages/fleetops/addon/extension.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/extension.js

# === SYNCHRONISATION EMBER CORE ===
echo "🔧 Synchronisant ember-core modifié..."
sudo cp /fleetbase/packages/ember-core/addon/services/current-user.js \
/fleetbase/console/node_modules/@fleetbase/ember-core/addon/services/current-user.js

cp /fleetbase/packages/iam-engine/addon/extension.js \
/fleetbase/console/node_modules/@fleetbase/iam-engine/addon/extension.js

# === FRONTEND CONTROLLERS (drivers & vehicles) ===
echo "🔧 Synchronisant les contrôleurs d'édition..."
cp /fleetbase/packages/fleetops/addon/controllers/management/drivers/index/edit.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/controllers/management/drivers/index/edit.js

cp /fleetbase/packages/fleetops/addon/controllers/management/vehicles/index/edit.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/controllers/management/vehicles/index/edit.js

# Frontend Components & Routes
cp /fleetbase/packages/fleetops/addon/routes/management/index.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/routes/management/index.js

# === FUEL REPORT COMPONENTS ===
echo "🔧 Synchronisant les composants carburant..."
cp /fleetbase/packages/fleetops/addon/components/fuel-report/form.hbs \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/components/fuel-report/form.hbs

cp /fleetbase/packages/fleetops/addon/components/fuel-report/form.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/components/fuel-report/form.js

cp /fleetbase/packages/fleetops/addon/components/fuel-report/details.hbs \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/components/fuel-report/details.hbs

cp /fleetbase/packages/fleetops/addon/controllers/management/fuel-reports/index/new.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/controllers/management/fuel-reports/index/new.js

cp /fleetbase/packages/fleetops/addon/controllers/management/fuel-reports/index.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/controllers/management/fuel-reports/index.js

# === FUEL REPORT COMPONENTS (Backend) ===
echo "🔧 Appliquant les customisations FuelReport..."
cp /fleetbase/packages/fleetops/server/src/Models/FuelReport.php \
/fleetbase/api/vendor/fleetbase/fleetops-api/server/src/Models/FuelReport.php

cp /fleetbase/packages/fleetops/server/src/Http/Resources/v1/FuelReport.php \
/fleetbase/api/vendor/fleetbase/fleetops-api/server/src/Http/Resources/v1/FuelReport.php

cp /fleetbase/packages/fleetops/server/src/Http/Controllers/Api/v1/FuelReportController.php \
/fleetbase/api/vendor/fleetbase/fleetops-api/server/src/Http/Controllers/Api/v1/FuelReportController.php

# === VEHICLE COMPONENTS ===
echo "🔧 Synchronisant les composants véhicules..."
cp /fleetbase/packages/fleetops/addon/components/vehicle/form.hbs \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/components/vehicle/form.hbs

cp /fleetbase/packages/fleetops/addon/components/vehicle/form.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/components/vehicle/form.js

cp /fleetbase/packages/fleetops/addon/components/vehicle/details.hbs \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/components/vehicle/details.hbs

cp /fleetbase/packages/fleetops/addon/controllers/management/vehicles/index/new.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/controllers/management/vehicles/index/new.js

cp /fleetbase/packages/fleetops/addon/controllers/management/vehicles/index.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/controllers/management/vehicles/index.js

# === DRIVER COMPONENTS ===
echo "🔧 Synchronisant les composants conducteurs..."
cp /fleetbase/packages/fleetops/addon/components/driver/form.hbs \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/components/driver/form.hbs

cp /fleetbase/packages/fleetops/addon/components/driver/details.hbs \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/components/driver/details.hbs

cp /fleetbase/packages/fleetops/addon/components/modals/driver-details.hbs \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/components/modals/driver-details.hbs

cp /fleetbase/packages/fleetops/addon/controllers/management/drivers/index.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/controllers/management/drivers/index.js

# === FLEET COMPONENTS ===
echo "🔧 Synchronisant les composants flottes..."
cp /fleetbase/packages/fleetops/addon/components/fleet/form.hbs \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/components/fleet/form.hbs

cp /fleetbase/packages/fleetops/addon/components/fleet/form.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/components/fleet/form.js

cp /fleetbase/packages/fleetops/addon/components/fleet/details.hbs \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/components/fleet/details.hbs

cp /fleetbase/packages/fleetops/addon/components/modals/fleet-assign-vehicles.hbs \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/components/modals/fleet-assign-vehicles.hbs

cp /fleetbase/packages/fleetops/addon/components/modals/fleet-assign-vehicles.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/components/modals/fleet-assign-vehicles.js

cp /fleetbase/packages/fleetops/app/components/modals/fleet-assign-vehicles.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/app/components/modals/fleet-assign-vehicles.js

cp /fleetbase/packages/fleetops/addon/services/fleet-actions.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/services/fleet-actions.js

# === OTHER COMPONENTS ===
cp /fleetbase/packages/fleetops/translations/fr-fr.yaml \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/translations/fr-fr.yaml

cp /fleetbase/packages/fleetops/addon/routes.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/routes.js

cp /fleetbase/packages/ember-ui/addon/utils/get-currency.js \
/fleetbase/console/node_modules/@fleetbase/ember-ui/addon/utils/get-currency.js

cp /fleetbase/packages/fleetops/addon/components/layout/fleet-ops-sidebar.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/components/layout/fleet-ops-sidebar.js

# === BACKEND MODELS & RESOURCES ===
echo "🔧 Appliquant les customisations Fleet..."
cp /fleetbase/packages/fleetops/server/src/Models/Fleet.php \
/fleetbase/api/vendor/fleetbase/fleetops-api/server/src/Models/Fleet.php

cp /fleetbase/packages/fleetops/server/src/Http/Resources/v1/Fleet.php \
/fleetbase/api/vendor/fleetbase/fleetops-api/server/src/Http/Resources/v1/Fleet.php

cp /fleetbase/packages/fleetops/server/src/Http/Controllers/Api/v1/FleetController.php \
/fleetbase/api/vendor/fleetbase/fleetops-api/server/src/Http/Controllers/Api/v1/FleetController.php

echo "🔧 Appliquant les customisations Vehicle..."
cp /fleetbase/packages/fleetops/server/src/Models/Vehicle.php \
/fleetbase/api/vendor/fleetbase/fleetops-api/server/src/Models/Vehicle.php

cp /fleetbase/packages/fleetops/server/src/Http/Resources/v1/Vehicle.php \
/fleetbase/api/vendor/fleetbase/fleetops-api/server/src/Http/Resources/v1/Vehicle.php

cp /fleetbase/packages/fleetops/server/src/Http/Resources/v1/VehicleWithoutDriver.php \
/fleetbase/api/vendor/fleetbase/fleetops-api/server/src/Http/Resources/v1/VehicleWithoutDriver.php

cp /fleetbase/packages/fleetops/server/src/Http/Controllers/Api/v1/VehicleController.php \
/fleetbase/api/vendor/fleetbase/fleetops-api/server/src/Http/Controllers/Api/v1/VehicleController.php

echo "🔧 Appliquant les customisations Driver..."
cp /fleetbase/packages/fleetops/server/src/Models/Driver.php \
/fleetbase/api/vendor/fleetbase/fleetops-api/server/src/Models/Driver.php

cp /fleetbase/packages/fleetops/server/src/Http/Resources/v1/Driver.php \
/fleetbase/api/vendor/fleetbase/fleetops-api/server/src/Http/Resources/v1/Driver.php

cp /fleetbase/packages/fleetops/server/src/Http/Controllers/Api/v1/DriverController.php \
/fleetbase/api/vendor/fleetbase/fleetops-api/server/src/Http/Controllers/Api/v1/DriverController.php

# === FRONTEND EMBER DATA MODELS ===
echo "🔧 Appliquant les modèles Ember Data Fleet & Driver..."
sudo cp /fleetbase/packages/fleetops/packages/fleetops-data/addon/models/driver.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-data/addon/models/driver.js 2>/dev/null || true

sudo cp /fleetbase/packages/fleetops/packages/fleetops-data/addon/models/vehicle.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-data/addon/models/vehicle.js 2>/dev/null || true

sudo cp /fleetbase/packages/fleetops/packages/fleetops-data/addon/models/fleet.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-data/addon/models/fleet.js 2>/dev/null || true

# === SYNCHRONISATION MODIFICATIONS NOMS ===
echo "🔧 Synchronisant les noms des modules..."
sudo cp /fleetbase/console/app/utils/get-service-name.js \
/fleetbase/packages/fleetops/console/app/utils/get-service-name.js 2>/dev/null || true

sudo cp /fleetbase/packages/ember-core/addon/utils/load-installed-extensions.js \
/fleetbase/console/node_modules/@fleetbase/ember-core/addon/utils/load-installed-extensions.js 2>/dev/null || true

cp /fleetbase/packages/fleetops/addon/controllers/management/fleets/index.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/controllers/management/fleets/index.js

# ============================================================
# === MAINTENANCE MODULE - KounHany (NOUVEAU) ===
# ============================================================

echo "🔧 Synchronisant les Controllers de Maintenance..."
cp /fleetbase/packages/fleetops/api/src/Http/Controllers/Api/v1/RepairProductController.php \
/fleetbase/api/vendor/fleetbase/fleetops-api/server/src/Http/Controllers/Api/v1/RepairProductController.php 2>/dev/null || true

cp /fleetbase/packages/fleetops/api/src/Http/Controllers/Api/v1/GarageController.php \
/fleetbase/api/vendor/fleetbase/fleetops-api/server/src/Http/Controllers/Api/v1/GarageController.php 2>/dev/null || true

cp /fleetbase/packages/fleetops/api/src/Http/Controllers/Api/v1/AppointmentSlotController.php \
/fleetbase/api/vendor/fleetbase/fleetops-api/server/src/Http/Controllers/Api/v1/AppointmentSlotController.php 2>/dev/null || true

cp /fleetbase/packages/fleetops/api/src/Http/Controllers/Api/v1/MaintenanceRequestController.php \
/fleetbase/api/vendor/fleetbase/fleetops-api/server/src/Http/Controllers/Api/v1/MaintenanceRequestController.php 2>/dev/null || true

echo "🔧 Synchronisant les Resources de Maintenance..."
cp /fleetbase/packages/fleetops/api/src/Http/Resources/v1/RepairProductResource.php \
/fleetbase/api/vendor/fleetbase/fleetops-api/server/src/Http/Resources/v1/RepairProductResource.php 2>/dev/null || true

cp /fleetbase/packages/fleetops/api/src/Http/Resources/v1/GarageResource.php \
/fleetbase/api/vendor/fleetbase/fleetops-api/server/src/Http/Resources/v1/GarageResource.php 2>/dev/null || true

cp /fleetbase/packages/fleetops/api/src/Http/Resources/v1/AppointmentSlotResource.php \
/fleetbase/api/vendor/fleetbase/fleetops-api/server/src/Http/Resources/v1/AppointmentSlotResource.php 2>/dev/null || true

cp /fleetbase/packages/fleetops/api/src/Http/Resources/v1/MaintenanceItemResource.php \
/fleetbase/api/vendor/fleetbase/fleetops-api/server/src/Http/Resources/v1/MaintenanceItemResource.php 2>/dev/null || true

cp /fleetbase/packages/fleetops/api/src/Http/Resources/v1/MaintenanceRequestResource.php \
/fleetbase/api/vendor/fleetbase/fleetops-api/server/src/Http/Resources/v1/MaintenanceRequestResource.php 2>/dev/null || true

echo "🔧 Synchronisant les Models PHP de Maintenance..."
cp /fleetbase/packages/fleetops/server/src/Models/RepairProduct.php \
/fleetbase/api/vendor/fleetbase/fleetops-api/server/src/Models/

cp /fleetbase/packages/fleetops/server/src/Models/Garage.php \
/fleetbase/api/vendor/fleetbase/fleetops-api/server/src/Models/

cp /fleetbase/packages/fleetops/server/src/Models/AppointmentSlot.php \
/fleetbase/api/vendor/fleetbase/fleetops-api/server/src/Models/

cp /fleetbase/packages/fleetops/server/src/Models/MaintenanceRequest.php \
/fleetbase/api/vendor/fleetbase/fleetops-api/server/src/Models/

cp /fleetbase/packages/fleetops/server/src/Models/MaintenanceItem.php \
/fleetbase/api/vendor/fleetbase/fleetops-api/server/src/Models/

# === NOUVEAU - AppServiceProvider (override route POST maintenance-requests) ===
echo "🔧 Synchronisant AppServiceProvider (route override)..."
cp /fleetbase/api/app/Providers/AppServiceProvider.php \
/fleetbase/api/app/Providers/AppServiceProvider.php 2>/dev/null || true

# === NOUVEAU - MaintenanceRequestController custom (camelCase → snake_case) ===
echo "🔧 Synchronisant MaintenanceRequestController custom..."
mkdir -p /fleetbase/api/app/Http/Controllers/Internal/v1
# (fichier déjà en place dans /fleetbase/api/app/Http/Controllers/Internal/v1/)

# === MAINTENANCE MODULE - EMBER MODELS ===
echo "🔧 Synchronisant les Modèles Ember Data de Maintenance..."
cp /fleetbase/packages/fleetops/packages/fleetops-data/app/models/repair-product.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-data/app/models/repair-product.js 2>/dev/null || true

cp /fleetbase/packages/fleetops/packages/fleetops-data/app/models/garage.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-data/app/models/garage.js 2>/dev/null || true

cp /fleetbase/packages/fleetops/packages/fleetops-data/app/models/appointment-slot.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-data/app/models/appointment-slot.js 2>/dev/null || true

cp /fleetbase/packages/fleetops/packages/fleetops-data/app/models/maintenance-item.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-data/app/models/maintenance-item.js 2>/dev/null || true

cp /fleetbase/packages/fleetops/packages/fleetops-data/app/models/maintenance-request.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-data/app/models/maintenance-request.js 2>/dev/null || true

cp /fleetbase/packages/fleetops/packages/fleetops-data/addon/models/repair-product.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-data/addon/models/repair-product.js 2>/dev/null || true

cp /fleetbase/packages/fleetops/packages/fleetops-data/addon/models/garage.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-data/addon/models/garage.js 2>/dev/null || true

cp /fleetbase/packages/fleetops/packages/fleetops-data/addon/models/appointment-slot.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-data/addon/models/appointment-slot.js 2>/dev/null || true

cp /fleetbase/packages/fleetops/packages/fleetops-data/addon/models/maintenance-item.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-data/addon/models/maintenance-item.js 2>/dev/null || true

# === NOUVEAU - Modèle Ember maintenance-request avec priority ===
cp /fleetbase/packages/fleetops/addon/models/maintenance-request.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/models/maintenance-request.js 2>/dev/null || true

cp /fleetbase/packages/fleetops/packages/fleetops-data/addon/models/maintenance-request.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-data/addon/models/maintenance-request.js 2>/dev/null || true

# === MAINTENANCE MODULE - EMBER SERVICES ===
echo "🔧 Synchronisant les Services Ember de Maintenance..."
cp /fleetbase/packages/fleetops/addon/services/maintenance-wizard.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/services/maintenance-wizard.js 2>/dev/null || true

cp /fleetbase/packages/fleetops/addon/services/repair-products.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/services/repair-products.js 2>/dev/null || true

cp /fleetbase/packages/fleetops/addon/services/garage-integration.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/services/garage-integration.js 2>/dev/null || true

# === MAINTENANCE MODULE - EMBER COMPONENTS (WIZARD) ===
echo "🔧 Synchronisant les Composants Wizard de Maintenance..."
cp /fleetbase/packages/fleetops/addon/components/maintenance-wizard.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/components/maintenance-wizard.js 2>/dev/null || true

cp /fleetbase/packages/fleetops/addon/components/maintenance-wizard.hbs \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/components/maintenance-wizard.hbs 2>/dev/null || true

cp /fleetbase/packages/fleetops/addon/components/maintenance-wizard/step*.hbs \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/components/maintenance-wizard/ 2>/dev/null || true

cp /fleetbase/packages/fleetops/addon/components/maintenance-wizard/step*.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/components/maintenance-wizard/ 2>/dev/null || true

# === MAINTENANCE MODULE - EMBER COMPONENTS (LISTE + CELLS) ===
echo "🔧 Synchronisant les Composants Maintenance (Refactor Frontend)..."

for cell in cell-vehicle cell-type cell-date cell-status cell-price cell-payment; do
  cp /fleetbase/packages/fleetops/addon/components/maintenance/${cell}.js \
  /fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/components/maintenance/${cell}.js 2>/dev/null || true
  cp /fleetbase/packages/fleetops/addon/components/maintenance/${cell}.hbs \
  /fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/components/maintenance/${cell}.hbs 2>/dev/null || true
done

cp /fleetbase/packages/fleetops/addon/adapters/maintenance.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/adapters/maintenance.js 2>/dev/null || true

cp /fleetbase/packages/fleetops/addon/adapters/maintenance-request.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/adapters/maintenance-request.js 2>/dev/null || true

# === MAINTENANCE MODULE - EMBER ROUTES & CONTROLLERS ===
echo "🔧 Synchronisant les Routes et Controllers de Maintenance..."
cp /fleetbase/packages/fleetops/addon/routes/management/maintenances.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/routes/management/maintenances.js 2>/dev/null || true

cp -r /fleetbase/packages/fleetops/addon/routes/management/maintenances \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/routes/management/ 2>/dev/null || true

cp -r /fleetbase/packages/fleetops/addon/controllers/management/maintenances \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/controllers/management/ 2>/dev/null || true

cp -r /fleetbase/packages/fleetops/addon/templates/management/maintenances \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/templates/management/ 2>/dev/null || true

cp /fleetbase/packages/fleetops/addon/models/repair-product.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/models/repair-product.js 2>/dev/null || true










cp /fleetbase/packages/fleetops/addon/serializers/maintenance-request.js \
   /fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/serializers/maintenance-request.js



   
# ============================================================
# === MIGRATIONS & RESTART ===
# ============================================================

echo "🔄 Exécution des migrations..."
cd /fleetbase/api
php artisan migrate --force

echo "🔄 Clear des caches Laravel..."
php artisan route:clear
php artisan cache:clear
php artisan config:clear

echo "🔄 Redémarrage d'Octane..."
pkill -f "php artisan octane" || true
sleep 2
php artisan octane:reload 2>/dev/null || true

echo "🔄 Nettoyage des caches Ember..."
cd /fleetbase/console
rm -rf dist/ tmp/ 2>/dev/null || true

echo "✅ Synchronisation, migrations et installation terminées!"
