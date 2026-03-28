<?php

namespace Fleetbase\FleetOps\Http\Controllers\Internal\v1;

use Fleetbase\FleetOps\Exports\FuelReportExport;
use Fleetbase\FleetOps\Http\Controllers\FleetOpsController;
use Fleetbase\FleetOps\Imports\FuelReportImport;
use Fleetbase\FleetOps\Models\FuelReport;
use Fleetbase\Http\Requests\ExportRequest;
use Fleetbase\Http\Requests\ImportRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use Fleetbase\FleetOps\Http\Resources\v1\FuelReport as FuelReportResource;

class FuelReportController extends FleetOpsController
{
    /**
     * The resource to query.
     *
     * @var string
     */
    public $resource = 'fuel_report';

    /**
     * The resource class to use for responses.
     *
     * @var string
     */
    public $resourceClass = FuelReportResource::class; 

    /**
     * Handle post save transactions.
     */
    public function afterSave(Request $request, FuelReport $fuelReport)
    {
        // ← AJOUTER LES LOGS ET L'UPLOAD D'IMAGE
        \Log::info('🔵 FuelReportController::afterSave appelé');
        \Log::info('FuelReport ID:', ['id' => $fuelReport->id]);
        \Log::info('Has file receipt_image?', ['has_file' => $request->hasFile('receipt_image')]);
        
        // Upload de l'image
        if ($request->hasFile('receipt_image')) {
            \Log::info('🔵 Uploading receipt image...');
            
            // Supprimer l'ancienne image si elle existe
            if ($fuelReport->receipt_image) {
                \Log::info('Deleting old image:', ['path' => $fuelReport->receipt_image]);
                Storage::disk('local')->delete($fuelReport->receipt_image);
            }
            
            $file = $request->file('receipt_image');
            $path = $file->store('uploads/system', 'local');
            \Log::info('✅ Image stored at:', ['path' => $path]);
            
            // Sauvegarder le chemin dans le fuel report
            $fuelReport->update(['receipt_image' => $path]);
            \Log::info('✅ Receipt image path saved to database');
        }
        
        // Custom fields (code existant)
        $customFieldValues = $request->array('fuel_report.custom_field_values');
        if ($customFieldValues) {
            $fuelReport->syncCustomFieldValues($customFieldValues);
        }
    }

    /**
     * Upload receipt image for fuel report.
     */
    public function uploadReceipt(Request $request, $id)
    {
        \Log::info('🔵 uploadReceipt appelé');
        \Log::info('ID:', ['id' => $id]);
        \Log::info('Has file receipt_image?', ['has_file' => $request->hasFile('receipt_image')]);
        
        try {
            $fuelReport = FuelReport::where('uuid', $id)->orWhere('public_id', $id)->firstOrFail();
            
            if ($request->hasFile('receipt_image')) {
                \Log::info('🔵 Uploading receipt image...');
                
                // Supprimer l'ancienne image
                if ($fuelReport->receipt_image) {
                    Storage::disk('local')->delete($fuelReport->receipt_image);
                }
                
                $file = $request->file('receipt_image');
                $path = $file->store('uploads/system', 'local');
                \Log::info('✅ Image stored at:', ['path' => $path]);
                
                $fuelReport->update(['receipt_image' => $path]);
                \Log::info('✅ Receipt image saved to database');
            }
            
            return response()->json([
                'status' => 'ok',
                'fuel_report' => new \Fleetbase\FleetOps\Http\Resources\v1\FuelReport($fuelReport)
            ]);
        } catch (\Exception $e) {
            \Log::error('❌ uploadReceipt ERROR:', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Export the fleets to excel or csv.
     *
     * @return \Illuminate\Http\Response
     */
    public function export(ExportRequest $request)
    {
        $format       = $request->input('format', 'xlsx');
        $selections   = $request->array('selections');
        $fileName     = trim(Str::slug('fuel_report-' . date('Y-m-d-H:i')) . '.' . $format);

        return Excel::download(new FuelReportExport($selections), $fileName);
    }

    public function import(ImportRequest $request)
    {
        $disk           = $request->input('disk', config('filesystems.default'));
        $files          = $request->resolveFilesFromIds();
        $importedCount  = 0;

        foreach ($files as $file) {
            try {
                $import = new FuelReportImport();
                Excel::import($import, $file->path, $disk);
                $importedCount += $import->imported;
            } catch (\Throwable $e) {
                return response()->error('Invalid file, unable to proccess.');
            }
        }

        return response()->json(['status' => 'ok', 'message' => 'Import completed', 'imported' => $importedCount]);
    }
}
