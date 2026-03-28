import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class RepairProductServiceService extends Service {
  @service session;
  @tracked products = [];
  @tracked isLoading = false;
  @tracked error = null;

  async fetchProducts() {
    try {
      this.isLoading = true;
      this.error = null;

      const token = this.session?.data?.authenticated?.token;
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch('http://localhost:8000/int/v1/repair-products?limit=100', { headers });

      if (response.ok) {
        const data = await response.json();
        const items = data.repairProducts || data.data || [];
        this.products = items.map(p => ({
          id: p.uuid,
          uuid: p.uuid,
          name: p.name,
          sku: p.sku,
          price_mad: parseFloat(p.price_mad),
          currency: p.currency || 'MAD',
          category: p.category,
          stock_quantity: p.stock_quantity,
          is_active: p.is_active,
        }));
        return this.products;
      }

      this.products = this.getFakeProducts();
      return this.products;

    } catch (error) {
      this.error = error.message;
      this.products = this.getFakeProducts();
      return this.products;
    } finally {
      this.isLoading = false;
    }
  }

  getFakeProducts() { return []; }
}
