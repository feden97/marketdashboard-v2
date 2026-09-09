export interface InflationPoint {
  fecha: string;
  valor: number;
}

export interface InflationStats {
  lastMonth: number;
  lastMonthLabel: string;
  avg12m: number;
  acum12m: number;
  purchasingPowerCost: number;
  history: InflationPoint[];
}

export interface HolidayRaw {
  fecha: string;
  tipo: string;
  nombre: string;
}

export interface ProcessedHoliday {
  dateFormatted: string;
  daysRemaining: number;
  name: string;
  type: string;
}

export interface RiesgoPaisPoint {
  fecha: string;
  valor: number;
}
