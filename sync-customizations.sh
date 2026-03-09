#!/bin/bash

echo "🔄 Installation des dépendances Composer..."
cd /fleetbase/api
composer install --no-dev --prefer-dist

echo "🔄 Synchronisation des customisations KounHany..."

# Frontend Components & Routes
cp /fleetbase/packages/fleetops/addon/routes/management/index.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/routes/management/index.js

cp /fleetbase/packages/fleetops/addon/components/vehicle/form.hbs \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/components/vehicle/form.hbs

cp /fleetbase/packages/fleetops/addon/components/vehicle/form.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/components/vehicle/form.js

cp /fleetbase/packages/fleetops/addon/controllers/management/vehicles/index/new.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/controllers/management/vehicles/index/new.js

cp /fleetbase/packages/fleetops/addon/components/driver/form.hbs \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/components/driver/form.hbs

cp /fleetbase/packages/fleetops/addon/components/driver/details.hbs \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/components/driver/details.hbs

cp /fleetbase/packages/fleetops/addon/components/modals/driver-details.hbs \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/components/modals/driver-details.hbs

cp /fleetbase/packages/fleetops/translations/fr-fr.yaml \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/translations/fr-fr.yaml

cp /fleetbase/packages/fleetops/addon/routes.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/routes.js

cp /fleetbase/packages/fleetops/addon/components/vehicle/details.hbs \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/components/vehicle/details.hbs

cp /fleetbase/packages/ember-ui/addon/utils/get-currency.js \
/fleetbase/console/node_modules/@fleetbase/ember-ui/addon/utils/get-currency.js

cp /fleetbase/packages/fleetops/addon/controllers/management/vehicles/index.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/controllers/management/vehicles/index.js

cp /fleetbase/packages/fleetops/addon/components/layout/fleet-ops-sidebar.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/components/layout/fleet-ops-sidebar.js

# Backend Models & Resources (packages → vendor)
echo "🔧 Appliquant les customisations Vehicle..."
cp /fleetbase/packages/fleetops/server/src/Models/Vehicle.php \
/fleetbase/api/vendor/fleetbase/fleetops-api/server/src/Models/Vehicle.php

cp /fleetbase/packages/fleetops/server/src/Http/Resources/v1/VehicleWithoutDriver.php \
/fleetbase/api/vendor/fleetbase/fleetops-api/server/src/Http/Resources/v1/VehicleWithoutDriver.php

cp /fleetbase/packages/fleetops/server/src/Http/Controllers/Api/v1/VehicleController.php \
/fleetbase/api/vendor/fleetbase/fleetops-api/server/src/Http/Controllers/Api/v1/VehicleController.php

# Backend Driver Models & Resources (packages → vendor)
echo "🔧 Appliquant les customisations Driver..."
cp /fleetbase/packages/fleetops/server/src/Models/Driver.php \
/fleetbase/api/vendor/fleetbase/fleetops-api/server/src/Models/Driver.php

cp /fleetbase/packages/fleetops/server/src/Http/Resources/v1/Driver.php \
/fleetbase/api/vendor/fleetbase/fleetops-api/server/src/Http/Resources/v1/Driver.php

cp /fleetbase/packages/fleetops/server/src/Http/Controllers/Api/v1/DriverController.php \
/fleetbase/api/vendor/fleetbase/fleetops-api/server/src/Http/Controllers/Api/v1/DriverController.php

cp /fleetbase/packages/fleetops/addon/controllers/management/drivers/index.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-engine/addon/controllers/management/drivers/index.js

# Frontend Models (packages → node_modules)
cp /fleetbase/packages/fleetops-data/addon/models/vehicle.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-data/addon/models/vehicle.js

cp /fleetbase/packages/fleetops-data/addon/models/driver.js \
/fleetbase/console/node_modules/@fleetbase/fleetops-data/addon/models/driver.js

# 🔄 Exécuter les migrations
echo "🔄 Exécution des migrations..."
cd /fleetbase/api
php artisan migrate --force

# 🔄 Redémarrage d'Octane
echo "🔄 Redémarrage d'Octane..."
cd /fleetbase/api
pkill -f "php artisan octane" || true
sleep 2
php artisan octane:reload 2>/dev/null || true

echo "✅ Synchronisation, migrations et installation terminées!"