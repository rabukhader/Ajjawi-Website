# Clean Architecture Documentation

## Overview
This application follows Clean Architecture principles with a clear separation of concerns.

## Architecture Layers

### 1. Types Layer (`src/types/`)
- **product.ts**: Defines `Brand`, `Product` interfaces and `ProductType` enum
- **api.ts**: Defines API response types

### 2. Configuration Layer (`src/config/`)
- **api.ts**: API endpoints configuration (currently empty strings, ready for backend)

### 3. Services Layer (`src/services/`)
- **api.service.ts**: HTTP client service for API calls
- **mock-data.service.ts**: Mock data service (fallback when API not available)
- **excel-reader.service.ts**: Excel file reader service for data import

### 4. Repositories Layer (`src/repositories/`)
- **brand.repository.ts**: Brand data access layer
- **product.repository.ts**: Product data access layer

### 5. Hooks Layer (`src/hooks/`)
- **useBrands.ts**: Custom hook for fetching brands
- **useProducts.ts**: Custom hook for fetching products

## Data Flow

```
Component → Hook → Repository → Service → API/Mock Data
```

## Product Type Enum

The `ProductType` supports the following Arabic types:
- كرتونة (CARTON)
- دزينة (DOZEN)
- علبة (CAN)
- تنكة (TANK)
- بكيت (PACKET)
- كغم (KILOGRAM)
- غلن (GALLON)
- كيلو (KILO)
- شوال (SACK)
- كيس (BAG)
- سطل (BUCKET)
- ربطة (BUNDLE)
- '' (UNKNOWN - for empty or non-handled types)

## Excel File Structure

Expected Excel columns:
- Brand: Brand name (English)
- BrandAr: Brand name (Arabic)
- Product: Product name (English)
- ProductAr: Product name (Arabic)
- Type: Product type (one of the Arabic types above)
- Photo: Product image URL
- Description: Product description (English)
- DescriptionAr: Product description (Arabic)
- Price: Product price

## API Endpoints (To be configured)

When backend is ready, update `src/config/api.ts`:

```typescript
export const API_ENDPOINTS = {
  BRANDS: {
    LIST: '/api/brands',
    DETAIL: '/api/brands/:id',
    // ...
  },
  PRODUCTS: {
    LIST: '/api/products',
    BY_BRAND: '/api/products?brandId=:id',
    // ...
  },
};
```

## Environment Variables

Set `VITE_API_BASE_URL` in `.env` file when backend is ready:
```
VITE_API_BASE_URL=https://api.example.com
```

