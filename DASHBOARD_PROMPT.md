# Ajjawi Management Dashboard - Development Prompt

## Project Overview
Build a comprehensive management dashboard for Ajjawi company managers to manage brands and products for the Ajjawi website. This dashboard will provide authenticated CRUD operations with ordering capabilities for brands and products.

## Technical Stack & Configuration

### Core Technologies
- **React 19.1.1** with TypeScript
- **Vite 7.1.7** as build tool
- **React Router DOM 7.9.5** for routing
- **Tailwind CSS 3.4.18** for styling
- **Framer Motion 12.23.24** for animations
- **TypeScript 5.9.3** with strict mode

### Project Configuration

#### Package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

#### Vite Configuration
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

#### Tailwind Configuration
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        accent: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
    },
  },
  plugins: [],
}
```

## Backend API Information

### Base URL
```
http://3.239.1.159:8089
```

### Authentication
- **ALL API endpoints require authentication**
- Use JWT token or session-based authentication (check backend implementation)
- Store auth token in localStorage or httpOnly cookies
- Include token in request headers: `Authorization: Bearer <token>` or as specified by backend

### API Endpoints

#### Authentication Endpoints
- `POST /api/auth/login` - Login
  - Request Body: `{ email: string, password: string }`
  - Response: `{ token: string, user: { id: number, email: string, name: string } }`
  
- `POST /api/auth/register` - Sign Up
  - Request Body: `{ email: string, password: string, name: string }`
  - Response: `{ token: string, user: { id: number, email: string, name: string } }`

- `POST /api/auth/logout` - Logout
  - Headers: `Authorization: Bearer <token>`

- `GET /api/auth/me` - Get current user
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ id: number, email: string, name: string }`

#### Brands Endpoints (All require authentication)
- `GET /api/brands` - Get all brands
  - Response: `BrandsApiResponse` (array of ApiBrand)
  - Headers: `Authorization: Bearer <token>`

- `GET /api/brands/:id` - Get brand by ID
  - Response: `ApiBrand`
  - Headers: `Authorization: Bearer <token>`

- `POST /api/brands` - Create brand
  - Request Body: `{ name: string, logo?: string, description?: string, order?: number }`
  - Response: `ApiBrand`
  - Headers: `Authorization: Bearer <token>`
  - **Note: `order` field controls display order (lower numbers appear first)**

- `PUT /api/brands/:id` - Update brand
  - Request Body: `{ name?: string, logo?: string, description?: string, order?: number }`
  - Response: `ApiBrand`
  - Headers: `Authorization: Bearer <token>`

- `DELETE /api/brands/:id` - Delete brand
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ success: boolean, message: string }`

#### Products Endpoints (All require authentication)
- `GET /api/products` - Get all products
  - Response: `BrandsApiResponse` (same structure as brands - array of brands with nested products)
  - Headers: `Authorization: Bearer <token>`

- `GET /api/products/:id` - Get product by ID
  - Response: `ApiProduct`
  - Headers: `Authorization: Bearer <token>`

- `POST /api/products` - Create product
  - Request Body: `{ brandId: number, name: string, quantity?: string, packaging?: string, unit?: string, order?: number }`
  - Response: `ApiProduct`
  - Headers: `Authorization: Bearer <token>`
  - **Note: `order` field controls display order within the brand (lower numbers appear first)**

- `PUT /api/products/:id` - Update product
  - Request Body: `{ brandId?: number, name?: string, quantity?: string, packaging?: string, unit?: string, order?: number }`
  - Response: `ApiProduct`
  - Headers: `Authorization: Bearer <token>`

- `DELETE /api/products/:id` - Delete product
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ success: boolean, message: string }`

## Data Models

### API Response Types
```typescript
export interface ApiProduct {
  id: number;
  brandId: number;
  brandName: string;
  name: string;
  quantity: string;
  packaging: string;
  unit: string;
  order?: number; // Display order (optional, defaults to creation order)
}

export interface ApiBrand {
  id: number;
  name: string;
  logo?: string;
  description?: string;
  order?: number; // Display order (optional, defaults to creation order)
  products: ApiProduct[];
}

export type BrandsApiResponse = ApiBrand[];
```

### Internal Types
```typescript
export const ProductType = {
  CARTON: 'كرتونة',
  DOZEN: 'دزينة',
  CAN: 'علبة',
  TANK: 'تنكة',
  PACKET: 'بكيت',
  KILOGRAM: 'كغم',
  GALLON: 'غلن',
  KILO: 'كيلو',
  SACK: 'شوال',
  BAG: 'كيس',
  BUCKET: 'سطل',
  BUNDLE: 'ربطة',
  UNKNOWN: '',
} as const;

export type ProductType = typeof ProductType[keyof typeof ProductType];

export interface Product {
  id: string;
  name: string;
  nameAr?: string;
  brandId: string;
  image?: string;
  description?: string;
  descriptionAr?: string;
  price?: string;
  type: ProductType;
  order?: number; // Display order
}

export interface Brand {
  id: string;
  name: string;
  nameAr?: string;
  logo: string;
  description: string;
  descriptionAr?: string;
  products?: Product[];
  order?: number; // Display order
}
```

## Architecture Requirements

### Clean Architecture Pattern
Follow the same clean architecture pattern as the main website:

```
src/
├── types/              # TypeScript interfaces and types
├── config/             # Configuration files (API endpoints, etc.)
├── services/           # API service layer
├── repositories/       # Data access layer (repository pattern)
├── hooks/              # Custom React hooks
├── contexts/           # React Context providers (Auth, Theme, Language)
├── components/         # Reusable UI components
├── pages/              # Page components
├── mappers/            # Data transformation mappers
└── utils/              # Utility functions
```

### Key Files Structure
- `src/config/api.ts` - API endpoints configuration
- `src/services/api.service.ts` - HTTP client with authentication
- `src/services/auth.service.ts` - Authentication service
- `src/repositories/brand.repository.ts` - Brand data access
- `src/repositories/product.repository.ts` - Product data access
- `src/contexts/AuthContext.tsx` - Authentication context
- `src/hooks/useAuth.ts` - Authentication hook
- `src/hooks/useBrands.ts` - Brands data hook
- `src/hooks/useProducts.ts` - Products data hook

## Features & Requirements

### 1. Authentication System
- **Login Page**
  - Email/username and password fields
  - Form validation
  - Error handling
  - Remember me option (optional)
  - Redirect to dashboard on success

- **Sign Up Page**
  - Name, email, password, confirm password fields
  - Form validation
  - Password strength indicator
  - Error handling
  - Redirect to dashboard on success

- **Protected Routes**
  - All dashboard routes require authentication
  - Redirect to login if not authenticated
  - Token expiration handling
  - Auto-logout on token expiry

- **Auth Context**
  - Global authentication state
  - Login/logout functions
  - Current user information
  - Token management

### 2. Dashboard Layout
- **Sidebar Navigation**
  - Dashboard home
  - Brands management
  - Products management
  - User profile/logout

- **Header**
  - Current user name/email
  - Logout button
  - Theme toggle (light/dark)
  - Language toggle (English/Arabic) - if needed

- **Main Content Area**
  - Responsive grid layout
  - Breadcrumbs navigation
  - Page title and actions

### 3. Brands Management

#### Brands List Page
- **Table/Grid View**
  - Display: ID, Name, Logo (thumbnail), Description, Order, Actions
  - Sortable columns
  - Search/filter functionality
  - Pagination (if many brands)
  - Drag-and-drop or number input for reordering

- **Actions**
  - Create new brand button
  - Edit brand (inline or modal)
  - Delete brand (with confirmation)
  - View brand details
  - Reorder brands (drag-and-drop or order number input)

#### Create/Edit Brand Form
- **Fields**
  - Name (required)
  - Logo URL or file upload (optional)
  - Description (optional)
  - Order number (optional, for display order)
  - Arabic name (optional, if bilingual)
  - Arabic description (optional)

- **Validation**
  - Name is required
  - Order must be a positive integer
  - Logo URL must be valid URL (if provided)

- **Features**
  - Image preview for logo
  - Save/Cancel buttons
  - Success/error notifications

### 4. Products Management

#### Products List Page
- **Table/Grid View**
  - Display: ID, Name, Brand, Quantity, Packaging, Unit, Order, Actions
  - Filter by brand
  - Search by name
  - Sortable columns
  - Pagination
  - Drag-and-drop or number input for reordering within brand

- **Actions**
  - Create new product button
  - Edit product (inline or modal)
  - Delete product (with confirmation)
  - View product details
  - Reorder products within brand

#### Create/Edit Product Form
- **Fields**
  - Brand selection (dropdown, required)
  - Name (required)
  - Quantity (optional)
  - Packaging (optional)
  - Unit (dropdown with ProductType options, optional)
  - Order number (optional, for display order within brand)
  - Image URL (optional)
  - Description (optional)
  - Price (optional)
  - Arabic name (optional)
  - Arabic description (optional)

- **Validation**
  - Brand is required
  - Name is required
  - Order must be a positive integer
  - Unit must be from ProductType enum

- **Features**
  - Brand dropdown populated from API
  - Unit dropdown with all ProductType options
  - Image preview
  - Save/Cancel buttons
  - Success/error notifications

### 5. Ordering System

#### Brand Ordering
- **Implementation Options**
  1. Drag-and-drop interface with visual feedback
  2. Number input field for each brand
  3. Up/Down arrow buttons
  4. Combination of above

- **Behavior**
  - Lower order numbers appear first
  - If order is not specified, use creation order
  - When updating order, save immediately or batch save
  - Visual feedback during reordering

#### Product Ordering
- **Implementation Options**
  1. Drag-and-drop within brand
  2. Number input field for each product
  3. Up/Down arrow buttons
  4. Combination of above

- **Behavior**
  - Order is scoped to brand (products within same brand)
  - Lower order numbers appear first within brand
  - If order is not specified, use creation order
  - Visual feedback during reordering

### 6. UI/UX Requirements

#### Design System
- Use the same color palette (primary golds, accent greens)
- Consistent spacing and typography
- Modern, clean dashboard aesthetic
- Professional look suitable for business management

#### Responsive Design
- Mobile-friendly (tablet and desktop priority)
- Responsive tables/grids
- Collapsible sidebar on mobile
- Touch-friendly interactions

#### Animations
- Use Framer Motion for:
  - Page transitions
  - Form submissions
  - Loading states
  - Success/error notifications
  - Drag-and-drop feedback

#### Theme Support
- Light/Dark theme toggle
- Use CSS variables for theming (same as main website)
- Theme files: `src/themes/light.css` and `src/themes/dark.css`

#### Internationalization (Optional)
- English/Arabic language support
- RTL support for Arabic
- Translation files in `src/translations/`

### 7. Error Handling
- Network error handling
- API error messages display
- Form validation errors
- Token expiration handling
- 401/403 error handling (redirect to login)
- User-friendly error messages

### 8. Loading States
- Loading spinners for API calls
- Skeleton loaders for tables
- Button loading states
- Progress indicators

### 9. Notifications
- Success notifications (toast messages)
- Error notifications
- Warning notifications
- Info notifications
- Auto-dismiss after 3-5 seconds

## Implementation Details

### API Service with Authentication
```typescript
// Example structure
class ApiService {
  private baseURL: string;
  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };

    // Implementation with error handling
  }
}
```

### Authentication Context
```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}
```

### Protected Route Component
```typescript
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return <>{children}</>;
};
```

## Pages Structure

1. **Login Page** (`/login`)
   - Login form
   - Link to sign up

2. **Sign Up Page** (`/register`)
   - Registration form
   - Link to login

3. **Dashboard Home** (`/dashboard`)
   - Overview statistics
   - Recent activity
   - Quick actions

4. **Brands Management** (`/dashboard/brands`)
   - Brands list
   - Create/Edit/Delete brands
   - Reorder brands

5. **Products Management** (`/dashboard/products`)
   - Products list
   - Create/Edit/Delete products
   - Filter by brand
   - Reorder products

6. **Brand Detail** (`/dashboard/brands/:id`)
   - Brand information
   - Associated products
   - Edit brand

7. **Product Detail** (`/dashboard/products/:id`)
   - Product information
   - Edit product

## Additional Requirements

### Form Validation
- Use a validation library (e.g., zod, yup) or custom validation
- Real-time validation feedback
- Clear error messages

### Image Handling
- Support for image URLs
- Optional: Image upload to backend (if endpoint available)
- Image preview before save
- Placeholder images for missing logos

### Data Refresh
- Auto-refresh on create/update/delete
- Manual refresh button
- Optimistic updates for better UX

### Confirmation Dialogs
- Delete confirmation modals
- Unsaved changes warning
- Clear confirmation messages

### Search & Filter
- Real-time search
- Multi-criteria filtering
- Clear filters button
- Filter persistence (optional)

## Testing Considerations
- Test authentication flow
- Test CRUD operations
- Test ordering functionality
- Test error scenarios
- Test responsive design
- Test form validations

## Deliverables
1. Complete dashboard application with all features
2. Clean, maintainable code following the architecture
3. Responsive design
4. Error handling throughout
5. Loading states for all async operations
6. User-friendly notifications
7. Proper TypeScript types
8. Documentation comments where needed

## Notes
- All API calls must include authentication token
- Order field is optional but recommended for better control
- If order is not provided, backend should use creation timestamp
- Maintain consistency with main website's design language
- Ensure accessibility (keyboard navigation, screen readers)
- Optimize for performance (lazy loading, code splitting)

---

**Start building the dashboard with the same quality and attention to detail as the main Ajjawi website!**

