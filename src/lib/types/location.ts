export type AreaType =
  | 'fridge'
  | 'freezer'
  | 'shelf'
  | 'counter'
  | 'storage'
  | 'other';

export interface Location {
  id: string;
  store_id: string;
  label: string;
  area_type: AreaType;
  sort_order: number;
  created_at: string;
}

export interface Item {
  id: string;
  store_id: string;
  location_id: string;
  name: string;
  photo_url: string | null;
  notes: string | null;
  created_at: string;
  location?: Location;
}
