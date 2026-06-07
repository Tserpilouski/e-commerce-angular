import { AttributeDefinition } from '../attributes/attribute-definition.model';

export interface ProductType {
  id: string;
  version: number;
  name: string;
  description?: string;
  attributes?: AttributeDefinition[];
}
