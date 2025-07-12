# ShelfSpace Design System

A comprehensive design system for building scalable, accessible, and high-performance B2B SaaS applications using React, Next.js, and Tailwind CSS.

## 🎨 Design Principles

- **User-Centricity**: Prioritize user efficiency, clarity, and delight
- **Consistency**: Maintain visual and interactive consistency across all components
- **Accessibility**: Adhere to WCAG 2.1 AA standards as a minimum
- **Scalability**: Design for easy extension and maintenance
- **Performance**: Optimize for fast loading and smooth interactions

## 🎯 Quick Start

### 1. Design System Components

All design system components are available as CSS classes and React components:

```tsx
// Using CSS classes
<button className="btn btn-primary">Primary Button</button>
<div className="card">
  <div className="card-header">Header</div>
  <div className="card-body">Content</div>
</div>

// Using React components
import { StatsCard, BookCard, GroupCard } from '../components/dashboard';
```

### 2. View Design System

Visit `/design-system` to see all design tokens, components, and patterns in action.

## �� Color Palette

### Brand Colors
Our color palette is built around five core brand colors that create a cohesive and professional visual identity:

- **Indigo Dye** (#004777): Primary brand color, used for main actions and primary elements
- **Turkey Red** (#a30000): Error states and critical actions
- **Safety Orange** (#ff7700): Warning states and accent elements
- **Peach Yellow** (#efd28d): Background accents and subtle highlights
- **Verdigris** (#00afb5): Success states and secondary actions

### Color Scales
Each brand color includes a complete 50-900 scale for flexible usage:

#### Indigo Dye Scale
- **50-400**: Light tints for backgrounds and subtle elements
- **500**: Main brand color (#004777)
- **600-900**: Darker shades for text and emphasis

#### Safety Orange Scale
- **50-400**: Light tints for backgrounds and subtle elements
- **500**: Main accent color (#ff7700)
- **600-900**: Darker shades for text and emphasis

#### Turkey Red Scale
- **50-400**: Light tints for error backgrounds
- **500**: Main error color (#a30000)
- **600-900**: Darker shades for error text

#### Peach Yellow Scale
- **50-400**: Light tints for warm backgrounds
- **500**: Main highlight color (#e6c77a)
- **600-900**: Darker shades for emphasis

#### Verdigris Scale
- **50-400**: Light tints for success backgrounds
- **500**: Main success color (#00afb5)
- **600-900**: Darker shades for success text

### Semantic Colors
- **Success**: Verdigris (#00afb5) - Positive actions and states
- **Warning**: Safety Orange (#ff7700) - Caution and alerts
- **Error**: Turkey Red (#a30000) - Errors and destructive actions
- **Info**: Indigo Dye (#004777) - Information and neutral states

### Neutral Colors
- **Gray 50-900**: Complete grayscale palette
- **Gray 900**: Primary text (#212121)
- **Gray 50**: Backgrounds (#FAFAFA)

### Usage Guidelines
- Use Indigo Dye for primary actions, navigation, and main brand elements
- Use Safety Orange for CTAs, highlights, and attention-grabbing elements
- Use Turkey Red sparingly for errors and destructive actions
- Use Peach Yellow for warm backgrounds and subtle highlights
- Use Verdigris for success states and secondary actions
- Maintain proper contrast ratios for accessibility

## 📝 Typography

### Font Family
- **Primary**: Inter, sans-serif

### Heading Scale
```css
h1: text-h1 (3rem, font-extrabold)
h2: text-h2 (2.25rem, font-bold)
h3: text-h3 (1.875rem, font-bold)
h4: text-h4 (1.5rem, font-semibold)
h5: text-h5 (1.25rem, font-semibold)
h6: text-h6 (1.125rem, font-medium)
```

### Body Text
```css
body-lg: text-body-lg (1.125rem, leading-relaxed)
body-base: text-body-base (1rem, leading-normal) - Default
body-sm: text-body-sm (0.875rem, leading-snug)
```

## 🧩 Component Library

### Buttons
```tsx
// Primary button (main actions)
<button className="btn-primary">Primary Action</button>

// Secondary button (secondary actions)
<button className="btn-secondary">Secondary Action</button>

// Accent button (highlighted actions)
<button className="btn-accent">Highlighted Action</button>

// Outline button (subtle actions)
<button className="btn-outline">Subtle Action</button>

// Ghost button (minimal actions)
<button className="btn-ghost">Minimal Action</button>
```

### Cards
```tsx
<div className="card">
  <div className="card-header">
    <h3>Card Title</h3>
  </div>
  <div className="card-body">
    <p>Card content goes here</p>
  </div>
  <div className="card-footer">
    <button className="btn-primary">Action</button>
  </div>
</div>
```

### Form Elements
```tsx
<label className="form-label">Email Address</label>
<input type="email" className="form-input" placeholder="Enter your email" />
<div className="form-error">Please enter a valid email address</div>
```

### Badges
```tsx
<span className="badge-primary">Primary</span>
<span className="badge-success">Success</span>
<span className="badge-warning">Warning</span>
<span className="badge-error">Error</span>
<span className="badge-info">Info</span>
```

### Status Indicators
```tsx
<span className="status-dot-success"></span>
<span className="status-dot-warning"></span>
<span className="status-dot-error"></span>
<span className="status-dot-info"></span>
```

## 📏 Spacing & Layout

### Spacing Scale
```css
space-xs: p-1 (4px)
space-sm: p-2 (8px)
space-md: p-4 (16px) - Default
space-lg: p-6 (24px)
space-xl: p-8 (32px)
```

### Border Radius
```css
rounded-sm: rounded-md (6px) - Small elements
rounded-md: rounded-lg (8px) - Cards, larger elements
rounded-lg: rounded-lg (12px) - Default card radius
```

### Shadows
```css
shadow-sm: shadow-md (subtle lift)
shadow-md: shadow-lg (card elements)
shadow-lg: shadow-xl (modals, popovers)
```

## 🎯 Component States

### Interactive States
- **Hover**: Slightly darker background or subtle shadow increase
- **Focus**: `ring-2 ring-offset-2 ring-primary-500` (accessibility outline)
- **Active**: Slightly more pronounced background change
- **Disabled**: `opacity-50 cursor-not-allowed`

### Accessibility Features
- All interactive elements have proper focus states
- Color contrast meets WCAG AA standards
- Screen reader friendly with proper ARIA labels
- Keyboard navigation support

## 📱 Responsive Design

### Breakpoints
```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Mobile-First Approach
- Start with mobile styles
- Use responsive prefixes for larger screens
- Ensure touch targets are at least 44px

## 🚀 Usage Examples

### Dashboard Layout
```tsx
import { ShelfSpaceDashboard } from '../components/dashboard';

export default function DashboardPage() {
  return <ShelfSpaceDashboard />;
}
```

### Stats Card
```tsx
import { StatsCard } from '../components/dashboard';
import { BookOpen } from 'lucide-react';

<StatsCard
  title="Total Books"
  value={47}
  icon={BookOpen}
  iconColor="text-primary-600"
  iconBgColor="bg-primary-50"
  change={{ value: 12, type: 'increase', period: 'last month' }}
  trend="up"
/>
```

### Book Card
```tsx
import { BookCard } from '../components/dashboard';

<BookCard
  id="1"
  title="The Design of Everyday Things"
  author="Don Norman"
  rating={4.5}
  readingProgress={75}
  timeToRead="2h 30m"
  genre="Design"
  isCurrentlyReading={true}
  onBookClick={(id) => console.log('Book clicked:', id)}
  onMoreClick={(id) => console.log('More options:', id)}
/>
```

## 🔧 Customization

### Extending Colors
Add new colors to `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      custom: {
        50: '#f0f9ff',
        500: '#3b82f6',
        900: '#1e3a8a',
      }
    }
  }
}
```

### Creating New Components
Follow the established patterns:

```tsx
interface CustomComponentProps {
  // Props with proper TypeScript types
  title: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}

const CustomComponent: React.FC<CustomComponentProps> = ({
  title,
  variant = 'primary',
  className = '',
}) => {
  return (
    <div className={`custom-component ${className}`}>
      {/* Component content */}
    </div>
  );
};
```

## 📚 Best Practices

### 1. Component Structure
- Use TypeScript interfaces for props
- Include proper accessibility attributes
- Follow the established naming conventions
- Use semantic HTML elements

### 2. Styling
- Use Tailwind utility classes exclusively
- Leverage the design system tokens
- Maintain consistent spacing and typography
- Ensure responsive design

### 3. Accessibility
- Include proper ARIA labels
- Ensure keyboard navigation
- Maintain color contrast ratios
- Test with screen readers

### 4. Performance
- Use React.memo for expensive components
- Optimize images and assets
- Implement proper loading states
- Minimize bundle size

## 🧪 Testing

### Visual Testing
- Use the design system page (`/design-system`) for visual regression testing
- Test all component variants and states
- Verify responsive behavior across breakpoints

### Accessibility Testing
- Use tools like axe-core for automated testing
- Test keyboard navigation
- Verify screen reader compatibility
- Check color contrast ratios

## 📖 Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Inter Font](https://rsms.me/inter/)
- [Lucide Icons](https://lucide.dev/)

## 🤝 Contributing

When contributing to the design system:

1. Follow the established patterns and conventions
2. Update the design system documentation
3. Test across different screen sizes and browsers
4. Ensure accessibility compliance
5. Update the `/design-system` page with new components

---

For questions or support, please refer to the component documentation or contact the design team. 