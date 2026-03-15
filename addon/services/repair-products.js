import Service from '@ember/service';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

/**
 * Service de gestion des Produits de Réparation
 * Récupère les produits depuis l'API et les cache
 */
export default class RepairProductsService extends Service {
  @service store;
  @service ajax;

  @tracked products = [];
  @tracked filteredProducts = [];
  @tracked isLoading = false;
  @tracked error = null;

  @tracked selectedCategory = null;
  @tracked searchTerm = '';

  // Cache
  @tracked productsByCategory = {};
  @tracked categoriesList = [];

  // ======= CHARGEMENT DES PRODUITS =======

  @action
  async loadProducts() {
    this.isLoading = true;
    this.error = null;

    try {
      // Charger tous les produits depuis l'API
      this.products = await this.store.query('repair-product', {});

      // Extraire les catégories uniques
      this.extractCategories();

      // Initialiser le cache par catégorie
      this.buildCategoryIndex();

      // Filtrer les produits
      this.applyFilters();

      this.isLoading = false;
    } catch (err) {
      this.error = 'Erreur lors du chargement des produits';
      console.error('RepairProductsService.loadProducts error:', err);
      this.isLoading = false;
    }
  }

  @action
  async loadProductsByCategory(category) {
    this.isLoading = true;
    this.error = null;

    try {
      const products = await this.store.query('repair-product', {
        category: category
      });

      this.productsByCategory[category] = products;
      this.isLoading = false;

      return products;
    } catch (err) {
      this.error = `Erreur lors du chargement des produits de ${category}`;
      console.error('RepairProductsService.loadProductsByCategory error:', err);
      this.isLoading = false;
    }
  }

  @action
  async loadProductBySku(sku) {
    this.isLoading = true;
    this.error = null;

    try {
      const product = await this.store.queryRecord('repair-product', {
        sku: sku
      });

      this.isLoading = false;
      return product;
    } catch (err) {
      this.error = `Produit avec SKU ${sku} non trouvé`;
      console.error('RepairProductsService.loadProductBySku error:', err);
      this.isLoading = false;
    }
  }

  // ======= FILTRAGE =======

  @action
  setCategory(category) {
    this.selectedCategory = category;
    this.applyFilters();
  }

  @action
  setSearchTerm(term) {
    this.searchTerm = term;
    this.applyFilters();
  }

  @action
  applyFilters() {
    let filtered = this.products;

    // Filtre par catégorie
    if (this.selectedCategory) {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

    // Filtre par terme de recherche
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term) ||
        (p.description && p.description.toLowerCase().includes(term))
      );
    }

    this.filteredProducts = filtered;
  }

  @action
  clearFilters() {
    this.selectedCategory = null;
    this.searchTerm = '';
    this.applyFilters();
  }

  // ======= CATÉGORIES =======

  extractCategories() {
    const categoriesSet = new Set();

    this.products.forEach(product => {
      if (product.category) {
        categoriesSet.add(product.category);
      }
    });

    this.categoriesList = Array.from(categoriesSet).sort();
  }

  buildCategoryIndex() {
    this.productsByCategory = {};

    this.products.forEach(product => {
      if (!this.productsByCategory[product.category]) {
        this.productsByCategory[product.category] = [];
      }
      this.productsByCategory[product.category].push(product);
    });
  }

  // ======= REQUÊTES SPÉCIFIQUES =======

  @action
  async getProductsByIds(ids) {
    try {
      const products = await this.store.query('repair-product', {
        ids: ids.join(',')
      });

      return products;
    } catch (err) {
      console.error('RepairProductsService.getProductsByIds error:', err);
      return [];
    }
  }

  @action
  async searchProducts(searchTerm, category = null) {
    try {
      const params = {
        search: searchTerm
      };

      if (category) {
        params.category = category;
      }

      const results = await this.store.query('repair-product', params);
      return results;
    } catch (err) {
      console.error('RepairProductsService.searchProducts error:', err);
      return [];
    }
  }

  // ======= GESTION DE STOCK =======

  @action
  async increaseStock(productId, quantity) {
    try {
      const response = await this.ajax.post(
        `/internal/v1/repair-products/${productId}/increase-stock`,
        {
          data: { quantity }
        }
      );

      // Recharger le produit
      const product = this.store.peekRecord('repair-product', productId);
      if (product) {
        await product.reload();
      }

      return response;
    } catch (err) {
      console.error('RepairProductsService.increaseStock error:', err);
      throw err;
    }
  }

  @action
  async decreaseStock(productId, quantity) {
    try {
      const response = await this.ajax.post(
        `/internal/v1/repair-products/${productId}/decrease-stock`,
        {
          data: { quantity }
        }
      );

      // Recharger le produit
      const product = this.store.peekRecord('repair-product', productId);
      if (product) {
        await product.reload();
      }

      return response;
    } catch (err) {
      console.error('RepairProductsService.decreaseStock error:', err);
      throw err;
    }
  }

  // ======= COMPUTED PROPERTIES =======

  get availableProducts() {
    return this.filteredProducts.filter(p => p.isInStock);
  }

  get outOfStockProducts() {
    return this.filteredProducts.filter(p => !p.isInStock);
  }

  get totalProducts() {
    return this.products.length;
  }

  get filteredProductsCount() {
    return this.filteredProducts.length;
  }

  // ======= RESET =======

  @action
  reset() {
    this.products = [];
    this.filteredProducts = [];
    this.selectedCategory = null;
    this.searchTerm = '';
    this.productsByCategory = {};
    this.categoriesList = [];
    this.error = null;
  }
}