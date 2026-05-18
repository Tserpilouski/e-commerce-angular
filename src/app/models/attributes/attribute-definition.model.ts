import { LocalizedString } from '../common/localized-string.model';

export interface AttributeDefinition {
  name: string;
  label: LocalizedString;
  isRequired?: boolean;
}
