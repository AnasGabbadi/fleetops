import Model, { attr } from '@ember-data/model';

export default class RepairProductModel extends Model {
  @attr('string') publicId;
  @attr('string') name;
  @attr('string') description;
  @attr('string') sku;
  @attr('number') priceMad;
  @attr('string') currency;
  @attr('number') stockQuantity;
  @attr('boolean') isActive;
  @attr('string') category;
  @attr('boolean') isInStock;
  @attr('object') meta;
  @attr('date') createdAt;
  @attr('date') updatedAt;
}
