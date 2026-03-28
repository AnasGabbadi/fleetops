import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class MaintenanceWizardStep2Component extends Component {
  @service('repair-product-service') productService;

  @tracked products = [];
  @tracked cartItems = [];
  @tracked searchTerm = '';
  @tracked selectedCategory = '';
  @tracked isLoading = true;
  @tracked quickFilter = null;

  // Stocker les quantités par product.id séparément
  @tracked quantities = {};


  get vehicle() { return this.args.vehicle; }
  get maintenanceType() { return this.args.maintenanceType; }
  get city() { return this.args.city; }

  // Action pour setter le filtre
  @action
  setQuickFilter(filter) {
    // Toggle : cliquer sur le même filtre le désactive
    this.quickFilter = this.quickFilter === filter ? null : filter;
  }

  // Modifier filteredProducts pour inclure le quickFilter
  get filteredProducts() {
    let filtered = this.products.filter(product => {
      if (!product.isActive) return false;
      const matchSearch = product.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? true;
      const matchCategory = !this.selectedCategory || product.category === this.selectedCategory;
      return matchSearch && matchCategory;
    });

    // Appliquer le quickFilter
    if (this.quickFilter === 'origine') {
      // Pièces d'origine : produits avec "origine" dans le nom ou category
      filtered = filtered.filter(p =>
        p.name?.toLowerCase().includes('origine') ||
        p.category?.toLowerCase().includes('origine')
      );
    } else if (this.quickFilter === 'premium') {
      // Premium : produits avec "premium" dans le nom ou les plus chers (top 30%)
      const withPremiumName = filtered.filter(p =>
        p.name?.toLowerCase().includes('premium') ||
        p.category?.toLowerCase().includes('premium')
      );
      if (withPremiumName.length > 0) {
        filtered = withPremiumName;
      } else {
        // Fallback : top 30% par prix
        const sorted = [...filtered].sort((a, b) => b.priceMad - a.priceMad);
        const top30 = Math.max(1, Math.ceil(sorted.length * 0.3));
        filtered = sorted.slice(0, top30);
      }
    } else if (this.quickFilter === 'economique') {
      // Moins cher : trier par prix croissant, prendre bottom 30%
      const sorted = [...filtered].sort((a, b) => a.priceMad - b.priceMad);
      const bottom30 = Math.max(1, Math.ceil(sorted.length * 0.3));
      filtered = sorted.slice(0, bottom30);
    }

    return filtered;
  }

  constructor() {
    super(...arguments);
    this.loadProducts();
  }

  async loadProducts() {
    try {
      this.isLoading = true;
      const data = await this.productService.fetchProducts();

      this.products = data.map(p => {
        const product = {
          id: p.id,
          name: p.name,
          sku: p.sku,
          priceMad: parseFloat(p.price_mad) || 0,
          currency: p.currency || 'MAD',
          stockQuantity: parseInt(p.stock_quantity) || 0,
          isActive: p.is_active !== false,
          category: p.category,
        };
        product.isInStock = product.stockQuantity > 0 && product.isActive;
        return product;
      });

      // Initialiser les quantités à 1 pour chaque produit
      const initialQuantities = {};
      this.products.forEach(p => {
        initialQuantities[p.id] = 1;
      });
      this.quantities = initialQuantities;

    } catch (error) {
      console.error('Erreur chargement produits:', error);
    } finally {
      this.isLoading = false;
    }
  }

  get categoriesList() {
    const categories = new Set();
    this.products.forEach(p => {
      if (p.category) categories.add(p.category);
    });
    return Array.from(categories).sort();
  }

  get filteredProducts() {
    return this.products.filter(product => {
      if (!product.isActive) return false;
      const matchSearch = product.name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? true;
      const matchCategory = !this.selectedCategory || product.category === this.selectedCategory;
      return matchSearch && matchCategory;
    });
  }

  get cartTotal() {
    return this.cartItems
      .reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
      .toFixed(2);
  }

  get isStep2Valid() {
    return this.cartItems.length > 0;
  }

  // Lire la quantité d'un produit depuis le tracker
  getQuantity(productId) {
    return this.quantities[productId] ?? 1;
  }

  @action
  updateSearch(event) {
    this.searchTerm = event.target.value;
  }

  @action
  updateCategory(event) {
    this.selectedCategory = event.target.value;
  }

  // Action pour mettre à jour la quantité d'un produit dans la grille
  @action
  updateProductQuantity(productId, event) {
    const value = parseInt(event.target.value) || 1;
    // Réassigner l'objet entier pour déclencher la réactivité
    this.quantities = { ...this.quantities, [productId]: value };
  }

  @action
  addToCart(product) {
    const quantity = this.quantities[product.id] ?? 1;
    const existingItem = this.cartItems.find(item => item.productId === product.id);

    if (existingItem) {
      this.cartItems = this.cartItems.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      this.cartItems = [
        ...this.cartItems,
        {
          productId: product.id,
          name: product.name,
          unitPrice: product.priceMad,
          quantity,
          sku: product.sku,
          currency: product.currency,
        },
      ];
    }

    this.quantities = { ...this.quantities, [product.id]: 1 };

    // ✅ Synchroniser avec wizardData parent
    this.args.onUpdateData('cartItems', this.cartItems);
  }

  @action
  removeFromCart(productId) {
    this.cartItems = this.cartItems.filter(item => item.productId !== productId);
    this.args.onUpdateData('cartItems', this.cartItems); // ✅ sync
  }

  @action
  updateQuantity(item, event) {
    const quantity = parseInt(event.target.value);
    if (quantity > 0) {
      // Réassigner pour déclencher la réactivité
      this.cartItems = this.cartItems.map(i =>
        i.productId === item.productId ? { ...i, quantity } : i
      );
    } else {
      this.removeFromCart(item.productId);
    }
  }

  @action
  clearCart() {
    if (confirm('Vider le panier ?')) {
      this.cartItems = [];
      this.args.onUpdateData('cartItems', []); // ✅ sync
    }
  }

  getItemTotal(item) {
    return (item.unitPrice * item.quantity).toFixed(2);
  }
}
