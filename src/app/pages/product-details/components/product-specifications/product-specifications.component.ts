import { Component, computed, input } from '@angular/core';
import { Attribute } from '@models/attributes/attribute.model';

export interface SpecificationItem {
  label: string;
  value: string;
}

@Component({
  selector: 'ec-product-specifications',
  templateUrl: './product-specification.component.html',
  styleUrl: './product-specification.component.scss',
})
export class ProductSpecificationsComponent {
  readonly attributes = input<Attribute[]>();
  readonly customSpecs = input<SpecificationItem[]>();

  readonly displaySpecs = computed<SpecificationItem[]>(() => {
    const custom = this.customSpecs();
    if (custom?.length) return custom;

    const attrs = this.attributes();
    return attrs?.length ? attrs.map((a) => ({ label: a.label ?? a.name, value: a.value })) : [];
  });
}
