## 1. 架构设计

```mermaid
flowchart TB
    subgraph "前端层"
        "React 应用" --> "类别标签组件"
        "React 应用" --> "换算输入组件"
        "React 应用" --> "收藏列表组件"
    end
    subgraph "数据层"
        "Zustand Store" --> "换算状态"
        "Zustand Store" --> "收藏数据"
        "localStorage" --> "持久化收藏"
    end
    subgraph "工具层"
        "换算引擎" --> "长度换算"
        "换算引擎" --> "重量换算"
        "换算引擎" --> "体积换算"
        "换算引擎" --> "温度换算"
        "换算引擎" --> "面积换算"
    end
    "换算输入组件" --> "Zustand Store"
    "Zustand Store" --> "换算引擎"
    "收藏列表组件" --> "localStorage"
```

## 2. 技术说明

- 前端：React@18 + TypeScript + Tailwind CSS@3 + Vite
- 初始化工具：vite-init（react-ts 模板）
- 状态管理：Zustand
- 后端：无（纯前端应用）
- 数据持久化：localStorage（收藏组合本地存储）
- 图标：lucide-react

## 3. 路由定义

| 路由 | 用途 |
|------|------|
| / | 主页面，包含所有换算功能 |

## 4. 数据模型

### 4.1 换算类别与单位

```
长度: 毫米、厘米、米、千米、英寸、英尺、码、英里
重量: 毫克、克、千克、吨、盎司、磅
体积: 毫升、升、加仑(美)、品脱(美)、杯、立方厘米、立方米
温度: 摄氏度、华氏度、开尔文
面积: 平方毫米、平方厘米、平方米、平方千米、平方英寸、平方英尺、英亩、公顷
```

### 4.2 收藏数据结构

```typescript
interface Favorite {
  id: string;
  category: Category;
  fromUnit: string;
  toUnit: string;
  label: string;
  createdAt: number;
}
```

### 4.3 换算状态

```typescript
interface ConverterState {
  category: Category;
  fromUnit: string;
  toUnit: string;
  fromValue: number | '';
  toValue: number | '';
  favorites: Favorite[];
}
```

## 5. 换算逻辑

- 非温度类别：以基准单位（如长度→米，重量→千克）为中间桥梁，先转为基准单位再转为目标单位
- 温度类别：使用专用公式（°C↔°F、°C↔K）直接换算
- 所有换算结果保留合理精度（最多6位小数，去除尾部零）
