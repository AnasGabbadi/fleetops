<?php

namespace Fleetbase\FleetOps\Http\Controllers\Api\v1;

use Fleetbase\FleetOps\Http\Requests\CreateFleetRequest;
use Fleetbase\FleetOps\Http\Requests\UpdateFleetRequest;
use Fleetbase\FleetOps\Http\Resources\v1\DeletedResource;
use Fleetbase\FleetOps\Http\Resources\v1\Fleet as FleetResource;
use Fleetbase\FleetOps\Models\Fleet;
use Fleetbase\FleetOps\Models\Vehicle;
use Fleetbase\FleetOps\Support\Utils;
use Fleetbase\Http\Controllers\Controller;
use Illuminate\Http\Request;

class FleetController extends Controller
{
    public function create(CreateFleetRequest $request)
    {
        $input = $request->only(['name', 'fleet_level', 'country', 'city']);
        $input['company_uuid'] = session('company');

        if ($request->has('service_area')) {
            $input['service_area_uuid'] = Utils::getUuid('service_areas', [
                'public_id'    => $request->input('service_area'),
                'company_uuid' => session('company'),
            ]);
        }

        $fleet = Fleet::create($input);
        return new FleetResource($fleet);
    }

    public function update($id, UpdateFleetRequest $request)
    {
        try {
            $fleet = Fleet::findRecordOrFail($id);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $exception) {
            return response()->json(['error' => 'Fleet resource not found.'], 404);
        }

        $input = $request->only(['name', 'fleet_level', 'country', 'city']);

        // ✅ CHERCHER vehicles_ids dans fleet.vehicles_ids
        if ($request->has('fleet.vehicles_ids') || $request->has('vehicles_ids')) {
        $vehicleIds = $request->input('fleet.vehicles_ids') ?? $request->input('vehicles_ids');
        
        if (is_array($vehicleIds) && count($vehicleIds) > 0) {
            // Détacher tous d'abord
            $fleet->vehicles()->detach();
            // Attacher les nouveaux
            foreach ($vehicleIds as $vehicleId) {
                $vehicle = Vehicle::where('uuid', $vehicleId)->first();
                if ($vehicle) {
                    $vehicle->update(['fleet_uuid' => $fleet->uuid]);
                }
            }
        }
    }

        $fleet->update($input);
        $fleet->refresh();

        return new FleetResource($fleet);
    }

    public function query(Request $request)
    {
        $results = Fleet::queryWithRequest($request);
        return FleetResource::collection($results);
    }

    public function find($id, Request $request)
    {
        try {
            $fleet = Fleet::findRecordOrFail($id);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $exception) {
            return response()->json(['error' => 'Fleet resource not found.'], 404);
        }
        return new FleetResource($fleet);
    }

    public function delete($id, Request $request)
    {
        try {
            $fleet = Fleet::findRecordOrFail($id);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $exception) {
            return response()->json(['error' => 'Fleet resource not found.'], 404);
        }
        $fleet->delete();
        return new DeletedResource($fleet);
    }
}
