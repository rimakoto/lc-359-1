import { create } from 'zustand';
import { Category, convert, formatResult, getCategoryByKey } from '@/utils/converter';

export interface Favorite {
  id: string;
  category: Category;
  fromUnit: string;
  toUnit: string;
  label: string;
  createdAt: number;
}

interface ConverterState {
  category: Category;
  fromUnit: string;
  toUnit: string;
  fromValue: string;
  toValue: string;
  lastEdited: 'from' | 'to';
  favorites: Favorite[];

  setCategory: (cat: Category) => void;
  setFromUnit: (unit: string) => void;
  setToUnit: (unit: string) => void;
  setFromValue: (val: string) => void;
  setToValue: (val: string) => void;
  swapUnits: () => void;
  addFavorite: (label: string) => void;
  removeFavorite: (id: string) => void;
  loadFavorite: (fav: Favorite) => void;
}

const STORAGE_KEY = 'unit-converter-favorites';

function loadFavorites(): Favorite[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFavorites(favs: Favorite[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
}

function getDefaultUnits(cat: Category): { fromUnit: string; toUnit: string } {
  const units = getCategoryByKey(cat).units;
  return {
    fromUnit: units[0].key,
    toUnit: units.length > 1 ? units[1].key : units[0].key,
  };
}

function recalc(
  category: Category,
  fromUnit: string,
  toUnit: string,
  value: string,
  direction: 'from' | 'to',
): { fromValue: string; toValue: string } {
  const num = parseFloat(value);
  if (value === '' || value === '-' || isNaN(num)) {
    return direction === 'from'
      ? { fromValue: value, toValue: '' }
      : { fromValue: '', toValue: value };
  }
  if (direction === 'from') {
    const result = convert(category, fromUnit, toUnit, num);
    return { fromValue: value, toValue: formatResult(result) };
  } else {
    const result = convert(category, toUnit, fromUnit, num);
    return { fromValue: formatResult(result), toValue: value };
  }
}

const defaults = getDefaultUnits('length');

export const useConverterStore = create<ConverterState>((set, get) => ({
  category: 'length',
  fromUnit: defaults.fromUnit,
  toUnit: defaults.toUnit,
  fromValue: '',
  toValue: '',
  lastEdited: 'from',
  favorites: loadFavorites(),

  setCategory: (cat) => {
    const units = getDefaultUnits(cat);
    const { fromValue, lastEdited } = get();
    const recalced = recalc(cat, units.fromUnit, units.toUnit, fromValue, lastEdited);
    set({
      category: cat,
      fromUnit: units.fromUnit,
      toUnit: units.toUnit,
      ...recalced,
    });
  },

  setFromUnit: (unit) => {
    const { category, toUnit, fromValue } = get();
    const recalced = recalc(category, unit, toUnit, fromValue, 'from');
    set({ fromUnit: unit, ...recalced });
  },

  setToUnit: (unit) => {
    const { category, fromUnit, fromValue } = get();
    const recalced = recalc(category, fromUnit, unit, fromValue, 'from');
    set({ toUnit: unit, ...recalced });
  },

  setFromValue: (val) => {
    const { category, fromUnit, toUnit } = get();
    const recalced = recalc(category, fromUnit, toUnit, val, 'from');
    set({ fromValue: val, toValue: recalced.toValue, lastEdited: 'from' });
  },

  setToValue: (val) => {
    const { category, fromUnit, toUnit } = get();
    const recalced = recalc(category, fromUnit, toUnit, val, 'to');
    set({ toValue: val, fromValue: recalced.fromValue, lastEdited: 'to' });
  },

  swapUnits: () => {
    const { category, fromUnit, toUnit, fromValue, toValue, lastEdited } = get();
    const newFrom = toUnit;
    const newTo = fromUnit;
    const newVal = lastEdited === 'from' ? toValue : fromValue;
    const recalced = recalc(category, newFrom, newTo, newVal, lastEdited);
    set({
      fromUnit: newFrom,
      toUnit: newTo,
      ...recalced,
    });
  },

  addFavorite: (label) => {
    const { category, fromUnit, toUnit, favorites } = get();
    const fav: Favorite = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      category,
      fromUnit,
      toUnit,
      label,
      createdAt: Date.now(),
    };
    const updated = [fav, ...favorites];
    saveFavorites(updated);
    set({ favorites: updated });
  },

  removeFavorite: (id) => {
    const updated = get().favorites.filter(f => f.id !== id);
    saveFavorites(updated);
    set({ favorites: updated });
  },

  loadFavorite: (fav) => {
    const { fromValue, lastEdited } = get();
    const recalced = recalc(fav.category, fav.fromUnit, fav.toUnit, fromValue, lastEdited);
    set({
      category: fav.category,
      fromUnit: fav.fromUnit,
      toUnit: fav.toUnit,
      ...recalced,
    });
  },
}));
