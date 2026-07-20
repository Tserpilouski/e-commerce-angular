import { Pipe, PipeTransform } from '@angular/core';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractAttributeLabel(value: any): string {
  if (value == null) return '';

  if (Array.isArray(value)) {
    return value.map((v) => extractAttributeLabel(v)).join(', ');
  }

  if (typeof value === 'object') {
    if ('label' in value) {
      if (typeof value.label === 'string') return value.label;
      if (typeof value.label === 'object') return localize(value.label, value.key || 'Unnamed');
    }
    if ('key' in value) return String(value.key);

    if (Object.values(value).some((v) => typeof v === 'string')) {
      return localize(value);
    }

    return JSON.stringify(value);
  }

  return String(value);
}

export function localize(nameObj: Record<string, string> | undefined | null, defaultVal = ''): string {
  if (!nameObj) return defaultVal;
  return nameObj['en'] || nameObj['en-US'] || Object.values(nameObj)[0] || defaultVal;
}

@Pipe({
  name: 'localize',
  standalone: true,
})
export class LocalizePipe implements PipeTransform {
  transform(value: Record<string, string> | undefined | null, defaultVal = ''): string {
    return localize(value, defaultVal);
  }
}
