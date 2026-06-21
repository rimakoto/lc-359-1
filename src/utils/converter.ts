export type Category = 'length' | 'weight' | 'volume' | 'temperature' | 'area';

export interface UnitDef {
  key: string;
  label: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

export interface CategoryDef {
  key: Category;
  label: string;
  icon: string;
  units: UnitDef[];
}

const categories: CategoryDef[] = [
  {
    key: 'length',
    label: '长度',
    icon: 'ruler',
    units: [
      { key: 'mm', label: '毫米 (mm)', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { key: 'cm', label: '厘米 (cm)', toBase: v => v / 100, fromBase: v => v * 100 },
      { key: 'm', label: '米 (m)', toBase: v => v, fromBase: v => v },
      { key: 'km', label: '千米 (km)', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { key: 'in', label: '英寸 (in)', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
      { key: 'ft', label: '英尺 (ft)', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
      { key: 'yd', label: '码 (yd)', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
      { key: 'mi', label: '英里 (mi)', toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
    ],
  },
  {
    key: 'weight',
    label: '重量',
    icon: 'weight',
    units: [
      { key: 'mg', label: '毫克 (mg)', toBase: v => v / 1e6, fromBase: v => v * 1e6 },
      { key: 'g', label: '克 (g)', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { key: 'kg', label: '千克 (kg)', toBase: v => v, fromBase: v => v },
      { key: 't', label: '吨 (t)', toBase: v => v * 1000, fromBase: v => v / 1000 },
      { key: 'oz', label: '盎司 (oz)', toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
      { key: 'lb', label: '磅 (lb)', toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
    ],
  },
  {
    key: 'volume',
    label: '体积',
    icon: 'beaker',
    units: [
      { key: 'ml', label: '毫升 (mL)', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { key: 'l', label: '升 (L)', toBase: v => v, fromBase: v => v },
      { key: 'gal', label: '加仑 (gal)', toBase: v => v * 3.78541, fromBase: v => v / 3.78541 },
      { key: 'pt', label: '品脱 (pt)', toBase: v => v * 0.473176, fromBase: v => v / 0.473176 },
      { key: 'cup', label: '杯 (cup)', toBase: v => v * 0.236588, fromBase: v => v / 0.236588 },
      { key: 'cm3', label: '立方厘米 (cm³)', toBase: v => v / 1000, fromBase: v => v * 1000 },
      { key: 'm3', label: '立方米 (m³)', toBase: v => v * 1000, fromBase: v => v / 1000 },
    ],
  },
  {
    key: 'temperature',
    label: '温度',
    icon: 'thermometer',
    units: [
      {
        key: 'c',
        label: '摄氏度 (°C)',
        toBase: v => v,
        fromBase: v => v,
      },
      {
        key: 'f',
        label: '华氏度 (°F)',
        toBase: v => (v - 32) * 5 / 9,
        fromBase: v => v * 9 / 5 + 32,
      },
      {
        key: 'k',
        label: '开尔文 (K)',
        toBase: v => v - 273.15,
        fromBase: v => v + 273.15,
      },
    ],
  },
  {
    key: 'area',
    label: '面积',
    icon: 'square',
    units: [
      { key: 'mm2', label: '平方毫米 (mm²)', toBase: v => v / 1e6, fromBase: v => v * 1e6 },
      { key: 'cm2', label: '平方厘米 (cm²)', toBase: v => v / 1e4, fromBase: v => v * 1e4 },
      { key: 'm2', label: '平方米 (m²)', toBase: v => v, fromBase: v => v },
      { key: 'km2', label: '平方千米 (km²)', toBase: v => v * 1e6, fromBase: v => v / 1e6 },
      { key: 'in2', label: '平方英寸 (in²)', toBase: v => v * 6.4516e-4, fromBase: v => v / 6.4516e-4 },
      { key: 'ft2', label: '平方英尺 (ft²)', toBase: v => v * 0.092903, fromBase: v => v / 0.092903 },
      { key: 'acre', label: '英亩 (acre)', toBase: v => v * 4046.86, fromBase: v => v / 4046.86 },
      { key: 'ha', label: '公顷 (ha)', toBase: v => v * 1e4, fromBase: v => v / 1e4 },
    ],
  },
];

export function getCategories(): CategoryDef[] {
  return categories;
}

export function getCategoryByKey(key: Category): CategoryDef {
  return categories.find(c => c.key === key)!;
}

export function convert(
  category: Category,
  fromUnit: string,
  toUnit: string,
  value: number,
): number {
  const cat = getCategoryByKey(category);
  const from = cat.units.find(u => u.key === fromUnit)!;
  const to = cat.units.find(u => u.key === toUnit)!;
  const baseValue = from.toBase(value);
  return to.fromBase(baseValue);
}

export function formatResult(value: number): string {
  if (value === 0) return '0';
  if (Number.isInteger(value)) return value.toLocaleString('en-US');
  const abs = Math.abs(value);
  if (abs >= 1e10 || abs < 1e-6) {
    return value.toExponential(4);
  }
  const fixed = value.toPrecision(10);
  const num = parseFloat(fixed);
  if (Number.isInteger(num)) return num.toLocaleString('en-US');
  const str = num.toString();
  const parts = str.split('.');
  if (parts[1] && parts[1].length > 6) {
    return num.toFixed(6).replace(/0+$/, '').replace(/\.$/, '');
  }
  return str;
}
