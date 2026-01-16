
export enum View {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  GLOBAL_ROUTES = 'GLOBAL_ROUTES',
  DEAL_MAKER = 'DEAL_MAKER',
  DOC_INSIGHT = 'DOC_INSIGHT',
  CONFIRMATION = 'CONFIRMATION'
}

export interface Notification {
  id: string;
  type: 'alert' | 'info' | 'success';
  message: string;
  timestamp: Date;
}

export interface RawMaterial {
  name: string;
  level: number; // percentage
  status: 'critical' | 'low' | 'stable';
  upcomingShipment: string;
}

export interface DetailedShipment {
  id: string;
  vessel: string;
  origin: string;
  destination: string;
  eta: string;
  status: 'Transit' | 'Docking' | 'Loading' | 'Delayed';
  materials: { name: string; qty: string }[];
  verificationLevel: 'Low' | 'Medium' | 'High';
}
