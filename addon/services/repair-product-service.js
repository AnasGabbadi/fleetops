import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class RepairProductServiceService extends Service {
  @tracked products = [];
  @tracked isLoading = false;
  @tracked error = null;

  async fetchProducts() {
    try {
      this.isLoading = true;
      this.error = null;
      
      // Essaie de consommer l'API du fournisseur
      console.log('Tentative API du fournisseur...');
      const response = await fetch('http://localhost:8000/int/v1/repair-products?limit=100');
      
      console.log('API Status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✓ API du fournisseur OK:', data);
        
        if (data.data && Array.isArray(data.data)) {
          this.products = data.data;
          return this.products;
        }
      }
      
      // Si l'API échoue, utilise les fausses données
      console.warn('✗ API échouée, charge les fausses données');
      this.products = this.getFakeProducts();
      return this.products;
      
    } catch (error) {
      console.error('Erreur API:', error.message);
      this.error = error.message;
      
      // Fallback aux fausses données
      console.warn('Fallback aux fausses données');
      this.products = this.getFakeProducts();
      return this.products;
    } finally {
      this.isLoading = false;
    }
  }

  // Fausses données pour développement/test
  getFakeProducts() {
    return [
      {
        id: '1',
        name: 'Filtre à huile',
        sku: 'F001',
        price_mad: 45.00,
        currency: 'MAD',
        category: 'Filtres',
        stock_quantity: 20,
        is_active: true
      },
      {
        id: '2',
        name: 'Filtre à air',
        sku: 'F002',
        price_mad: 35.00,
        currency: 'MAD',
        category: 'Filtres',
        stock_quantity: 15,
        is_active: true
      },
      {
        id: '3',
        name: 'Huile moteur 5W30',
        sku: 'H001',
        price_mad: 120.00,
        currency: 'MAD',
        category: 'Huiles',
        stock_quantity: 30,
        is_active: true
      },
      {
        id: '4',
        name: 'Huile de transmission',
        sku: 'H002',
        price_mad: 150.00,
        currency: 'MAD',
        category: 'Huiles',
        stock_quantity: 10,
        is_active: true
      },
      {
        id: '5',
        name: 'Liquide de refroidissement',
        sku: 'L001',
        price_mad: 85.00,
        currency: 'MAD',
        category: 'Liquides',
        stock_quantity: 25,
        is_active: true
      },
      {
        id: '6',
        name: 'Plaquettes de frein',
        sku: 'B001',
        price_mad: 250.00,
        currency: 'MAD',
        category: 'Freinage',
        stock_quantity: 8,
        is_active: true
      }
    ];
  }
}
