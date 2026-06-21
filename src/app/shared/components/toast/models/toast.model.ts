export type Toast = ToastBase | ProdactToast;

export interface ToastBase {
  id: symbol;
  type: ToastType;
  message: string;
  duration?: number;
}

export interface ProdactToast extends ToastBase {
  productName: string;
}

export enum ToastType {
  Success = 'success',
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
}
