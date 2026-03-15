<?php

namespace Fleetbase\FleetOps\Http\Controllers\Api\v1;

use Fleetbase\FleetOps\Models\RepairProduct;
use Fleetbase\FleetOps\Http\Resources\v1\RepairProductResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class RepairProductController extends Controller
{
    /**
     * Display a listing of repair products.
     * GET /api/v1/repair-products
     *
     * @param Request $request
     * @return ResourceCollection
     */
    public function index(Request $request): ResourceCollection
    {
        $category = $request->input('category');
        $search = $request->input('search');
        $limit = $request->input('limit', 20);
        $page = $request->input('page', 1);
        $sort = $request->input('sort', '-created_at');

        $query = RepairProduct::query();

        // Filtrer par entreprise
        if ($request->user()) {
            $query->where('company_uuid', $request->user()->company_uuid);
        }

        // Filtrer par catégorie
        if ($category) {
            $query->where('category', $category);
        }

        // Recherche textuelle
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filtrer les produits actifs et en stock
        $query->active()->inStock();

        // Trier
        if (str_starts_with($sort, '-')) {
            $query->orderByDesc(substr($sort, 1));
        } else {
            $query->orderBy($sort);
        }

        // Paginer
        $products = $query->paginate($limit, ['*'], 'page', $page);

        return RepairProductResource::collection($products);
    }

    /**
     * Display a specific repair product.
     * GET /api/v1/repair-products/{id}
     *
     * @param RepairProduct $product
     * @return RepairProductResource
     */
    public function show(RepairProduct $product): RepairProductResource
    {
        return new RepairProductResource($product);
    }

    /**
     * Create a new repair product.
     * POST /api/v1/repair-products
     *
     * @param Request $request
     * @return RepairProductResource
     */
    public function store(Request $request): RepairProductResource
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'category'    => 'required|string|max:100',
            'sku'         => 'required|string|max:100|unique:repair_products',
            'price_mad'   => 'required|numeric|min:0',
            'currency'    => 'nullable|string|default:MAD',
            'stock_quantity' => 'nullable|integer|default:0',
            'is_active'   => 'nullable|boolean|default:true',
            'api_reference' => 'nullable|string',
            'meta'        => 'nullable|array',
        ]);

        $validated['company_uuid'] = $request->user()->company_uuid;

        $product = RepairProduct::create($validated);

        return new RepairProductResource($product);
    }

    /**
     * Update a repair product.
     * PUT /api/v1/repair-products/{id}
     *
     * @param Request $request
     * @param RepairProduct $product
     * @return RepairProductResource
     */
    public function update(Request $request, RepairProduct $product): RepairProductResource
    {
        $validated = $request->validate([
            'name'        => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'category'    => 'sometimes|string|max:100',
            'sku'         => 'sometimes|string|max:100|unique:repair_products,sku,' . $product->id,
            'price_mad'   => 'sometimes|numeric|min:0',
            'currency'    => 'nullable|string',
            'stock_quantity' => 'nullable|integer',
            'is_active'   => 'nullable|boolean',
            'api_reference' => 'nullable|string',
            'meta'        => 'nullable|array',
        ]);

        $product->update($validated);

        return new RepairProductResource($product);
    }

    /**
     * Delete a repair product.
     * DELETE /api/v1/repair-products/{id}
     *
     * @param RepairProduct $product
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(RepairProduct $product)
    {
        $product->delete();

        return response()->json([
            'message' => 'Repair product deleted successfully',
            'data'    => new RepairProductResource($product),
        ], 200);
    }

    /**
     * Get products by category.
     * GET /api/v1/repair-products/category/{category}
     *
     * @param string $category
     * @param Request $request
     * @return ResourceCollection
     */
    public function byCategory(string $category, Request $request): ResourceCollection
    {
        $limit = $request->input('limit', 20);

        $query = RepairProduct::byCategory($category)->active()->inStock();

        if ($request->user()) {
            $query->where('company_uuid', $request->user()->company_uuid);
        }

        $products = $query->paginate($limit);

        return RepairProductResource::collection($products);
    }

    /**
     * Get product by SKU.
     * GET /api/v1/repair-products/sku/{sku}
     *
     * @param string $sku
     * @return RepairProductResource
     */
    public function bySku(string $sku): RepairProductResource
    {
        $product = RepairProduct::where('sku', $sku)->firstOrFail();

        return new RepairProductResource($product);
    }

    /**
     * Increase stock for a product.
     * POST /api/v1/repair-products/{id}/increase-stock
     *
     * @param Request $request
     * @param RepairProduct $product
     * @return RepairProductResource
     */
    public function increaseStock(Request $request, RepairProduct $product): RepairProductResource
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $product->increaseStock($validated['quantity']);

        return new RepairProductResource($product);
    }

    /**
     * Decrease stock for a product.
     * POST /api/v1/repair-products/{id}/decrease-stock
     *
     * @param Request $request
     * @param RepairProduct $product
     * @return RepairProductResource
     */
    public function decreaseStock(Request $request, RepairProduct $product): RepairProductResource
    {
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        if (!$product->decreaseStock($validated['quantity'])) {
            return response()->json([
                'message' => 'Insufficient stock',
            ], 400);
        }

        return new RepairProductResource($product);
    }
}