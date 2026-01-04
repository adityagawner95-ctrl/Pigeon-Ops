
export enum View {
  DASHBOARD = 'DASHBOARD',
  GLOBAL_ROUTES = 'GLOBAL_ROUTES',
  DEAL_MAKER = 'DEAL_MAKER',
  DOC_INSIGHT = 'DOC_INSIGHT'
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

export interface RouteUpdate {
  origin: string;
  destination: string;
  condition: 'storm' | 'clear' | 'delay';
  alternativeSuggested: boolean;
}
