'use client';

import React, { useState } from 'react';
import { 
  Palette, 
  Type, 
  Square, 
  Layers, 
  ChevronDown, 
  ChevronRight,
  Check,
  AlertCircle,
  Info,
  Star
} from 'lucide-react';

interface DesignSystemProps {
  className?: string;
}

const DesignSystem: React.FC<DesignSystemProps> = ({ className = '' }) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['colors']);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const colorTokens = [
    { name: 'Indigo Dye 50', class: 'bg-indigo-dye-50', hex: '#e6f0f7' },
    { name: 'Indigo Dye 100', class: 'bg-indigo-dye-100', hex: '#cce1ef' },
    { name: 'Indigo Dye 200', class: 'bg-indigo-dye-200', hex: '#99c3df' },
    { name: 'Indigo Dye 300', class: 'bg-indigo-dye-300', hex: '#66a5cf' },
    { name: 'Indigo Dye 400', class: 'bg-indigo-dye-400', hex: '#3387bf' },
    { name: 'Indigo Dye 500', class: 'bg-indigo-dye-500', hex: '#004777' },
    { name: 'Indigo Dye 600', class: 'bg-indigo-dye-600', hex: '#003a5f' },
    { name: 'Indigo Dye 700', class: 'bg-indigo-dye-700', hex: '#002d47' },
    { name: 'Indigo Dye 800', class: 'bg-indigo-dye-800', hex: '#00202f' },
    { name: 'Indigo Dye 900', class: 'bg-indigo-dye-900', hex: '#001318' },
  ];

  const accentTokens = [
    { name: 'Safety Orange 50', class: 'bg-safety-orange-50', hex: '#fff2e6' },
    { name: 'Safety Orange 100', class: 'bg-safety-orange-100', hex: '#ffe5cc' },
    { name: 'Safety Orange 200', class: 'bg-safety-orange-200', hex: '#ffcb99' },
    { name: 'Safety Orange 300', class: 'bg-safety-orange-300', hex: '#ffb166' },
    { name: 'Safety Orange 400', class: 'bg-safety-orange-400', hex: '#ff9733' },
    { name: 'Safety Orange 500', class: 'bg-safety-orange-500', hex: '#ff7700' },
    { name: 'Safety Orange 600', class: 'bg-safety-orange-600', hex: '#cc5f00' },
    { name: 'Safety Orange 700', class: 'bg-safety-orange-700', hex: '#994700' },
    { name: 'Safety Orange 800', class: 'bg-safety-orange-800', hex: '#662f00' },
    { name: 'Safety Orange 900', class: 'bg-safety-orange-900', hex: '#331800' },
  ];

  const semanticColors = [
    { name: 'Success (Verdigris)', class: 'bg-success', hex: '#00afb5', icon: Check },
    { name: 'Warning (Safety Orange)', class: 'bg-warning', hex: '#ff7700', icon: AlertCircle },
    { name: 'Error (Turkey Red)', class: 'bg-error', hex: '#a30000', icon: AlertCircle },
    { name: 'Info (Indigo Dye)', class: 'bg-info', hex: '#004777', icon: Info },
  ];

  const brandColors = [
    { name: 'Indigo Dye', class: 'bg-indigo-dye-500', hex: '#004777' },
    { name: 'Turkey Red', class: 'bg-turkey-red-500', hex: '#a30000' },
    { name: 'Safety Orange', class: 'bg-safety-orange-500', hex: '#ff7700' },
    { name: 'Peach Yellow', class: 'bg-peach-yellow-500', hex: '#e6c77a' },
    { name: 'Verdigris', class: 'bg-verdigris-500', hex: '#00afb5' },
  ];

  const typographyScale = [
    { name: 'H1', class: 'text-h1', description: 'Page titles, hero sections' },
    { name: 'H2', class: 'text-h2', description: 'Section headers' },
    { name: 'H3', class: 'text-h3', description: 'Subsection headers' },
    { name: 'H4', class: 'text-h4', description: 'Card titles' },
    { name: 'H5', class: 'text-h5', description: 'Small headers' },
    { name: 'H6', class: 'text-h6', description: 'Tiny headers' },
    { name: 'Body Large', class: 'text-body-lg', description: 'Large body text' },
    { name: 'Body Base', class: 'text-body-base', description: 'Default body text' },
    { name: 'Body Small', class: 'text-body-sm', description: 'Small body text' },
  ];

  const buttonVariants = [
    { name: 'Primary', class: 'btn-primary', description: 'Main actions' },
    { name: 'Secondary', class: 'btn-secondary', description: 'Secondary actions' },
    { name: 'Accent', class: 'btn-accent', description: 'Highlighted actions' },
    { name: 'Outline', class: 'btn-outline', description: 'Subtle actions' },
    { name: 'Ghost', class: 'btn-ghost', description: 'Minimal actions' },
  ];

  const badgeVariants = [
    { name: 'Primary', class: 'badge-primary' },
    { name: 'Success', class: 'badge-success' },
    { name: 'Warning', class: 'badge-warning' },
    { name: 'Error', class: 'badge-error' },
    { name: 'Info', class: 'badge-info' },
  ];

  return (
    <div className={`max-w-6xl mx-auto p-6 space-y-8 ${className}`}>
      <div className="text-center mb-8">
        <h1 className="text-h1 text-gray-900 mb-4">ShelfSpace Design System</h1>
        <p className="text-body-lg text-gray-600">
          Comprehensive design tokens, components, and patterns for building consistent user interfaces
        </p>
      </div>

      {/* Colors Section */}
      <section className="card">
        <div className="card-header">
          <button
            onClick={() => toggleSection('colors')}
            className="flex items-center space-x-2 w-full text-left"
          >
            <Palette className="h-5 w-5 text-indigo-dye-600" />
            <h2 className="text-h4">Color Palette</h2>
            {expandedSections.includes('colors') ? (
              <ChevronDown className="h-4 w-4 ml-auto" />
            ) : (
              <ChevronRight className="h-4 w-4 ml-auto" />
            )}
          </button>
        </div>
        
        {expandedSections.includes('colors') && (
          <div className="card-body space-y-6">
            {/* Indigo Dye Colors */}
            <div>
              <h3 className="text-h5 text-gray-900 mb-4">Indigo Dye Colors</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {colorTokens.map((color) => (
                  <div key={color.name} className="text-center">
                    <div className={`w-full h-16 rounded-lg ${color.class} mb-2 border border-gray-200`} />
                    <p className="text-xs font-medium text-gray-900">{color.name}</p>
                    <p className="text-xs text-gray-500">{color.hex}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety Orange Colors */}
            <div>
              <h3 className="text-h5 text-gray-900 mb-4">Safety Orange Colors</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {accentTokens.map((color) => (
                  <div key={color.name} className="text-center">
                    <div className={`w-full h-16 rounded-lg ${color.class} mb-2 border border-gray-200`} />
                    <p className="text-xs font-medium text-gray-900">{color.name}</p>
                    <p className="text-xs text-gray-500">{color.hex}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Semantic Colors */}
            <div>
              <h3 className="text-h5 text-gray-900 mb-4">Semantic Colors</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {semanticColors.map((color) => (
                  <div key={color.name} className="text-center">
                    <div className={`w-full h-16 rounded-lg ${color.class} mb-2 border border-gray-200 flex items-center justify-center`}>
                      <color.icon className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-xs font-medium text-gray-900">{color.name}</p>
                    <p className="text-xs text-gray-500">{color.hex}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Brand Colors */}
            <div>
              <h3 className="text-h5 text-gray-900 mb-4">Brand Colors</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {brandColors.map((color) => (
                  <div key={color.name} className="text-center">
                    <div className={`w-full h-16 rounded-lg ${color.class} mb-2 border border-gray-200`} />
                    <p className="text-xs font-medium text-gray-900">{color.name}</p>
                    <p className="text-xs text-gray-500">{color.hex}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Typography Section */}
      <section className="card">
        <div className="card-header">
          <button
            onClick={() => toggleSection('typography')}
            className="flex items-center space-x-2 w-full text-left"
          >
            <Type className="h-5 w-5 text-indigo-dye-600" />
            <h2 className="text-h4">Typography</h2>
            {expandedSections.includes('typography') ? (
              <ChevronDown className="h-4 w-4 ml-auto" />
            ) : (
              <ChevronRight className="h-4 w-4 ml-auto" />
            )}
          </button>
        </div>
        
        {expandedSections.includes('typography') && (
          <div className="card-body">
            <div className="space-y-4">
              {typographyScale.map((type) => (
                <div key={type.name} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <p className={`${type.class} text-gray-900`}>
                        {type.name} - The quick brown fox jumps over the lazy dog
                      </p>
                      <p className="text-body-sm text-gray-500 mt-1">{type.description}</p>
                    </div>
                    <span className="text-xs text-gray-400 font-mono">{type.class}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Components Section */}
      <section className="card">
        <div className="card-header">
          <button
            onClick={() => toggleSection('components')}
            className="flex items-center space-x-2 w-full text-left"
          >
            <Layers className="h-5 w-5 text-indigo-dye-600" />
            <h2 className="text-h4">Components</h2>
            {expandedSections.includes('components') ? (
              <ChevronDown className="h-4 w-4 ml-auto" />
            ) : (
              <ChevronRight className="h-4 w-4 ml-auto" />
            )}
          </button>
        </div>
        
        {expandedSections.includes('components') && (
          <div className="card-body space-y-6">
            {/* Buttons */}
            <div>
              <h3 className="text-h5 text-gray-900 mb-4">Buttons</h3>
              <div className="flex flex-wrap gap-4">
                {buttonVariants.map((variant) => (
                  <div key={variant.name} className="text-center">
                    <button className={`${variant.class} mb-2`}>
                      {variant.name} Button
                    </button>
                    <p className="text-xs text-gray-500">{variant.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div>
              <h3 className="text-h5 text-gray-900 mb-4">Badges</h3>
              <div className="flex flex-wrap gap-4">
                {badgeVariants.map((variant) => (
                  <div key={variant.name} className="text-center">
                    <span className={`${variant.class} mb-2`}>
                      {variant.name}
                    </span>
                    <p className="text-xs text-gray-500">{variant.name} badge</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Indicators */}
            <div>
              <h3 className="text-h5 text-gray-900 mb-4">Status Indicators</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <span className="status-dot-success" />
                  <span className="text-sm">Success</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="status-dot-warning" />
                  <span className="text-sm">Warning</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="status-dot-error" />
                  <span className="text-sm">Error</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="status-dot-info" />
                  <span className="text-sm">Info</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Spacing Section */}
      <section className="card">
        <div className="card-header">
          <button
            onClick={() => toggleSection('spacing')}
            className="flex items-center space-x-2 w-full text-left"
          >
            <Square className="h-5 w-5 text-indigo-dye-600" />
            <h2 className="text-h4">Spacing & Layout</h2>
            {expandedSections.includes('spacing') ? (
              <ChevronDown className="h-4 w-4 ml-auto" />
            ) : (
              <ChevronRight className="h-4 w-4 ml-auto" />
            )}
          </button>
        </div>
        
        {expandedSections.includes('spacing') && (
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-h5 text-gray-900 mb-4">Spacing Scale</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">space-xs</span>
                    <div className="w-4 h-4 bg-indigo-dye-200 rounded"></div>
                    <span className="text-xs text-gray-500">4px</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">space-sm</span>
                    <div className="w-8 h-4 bg-indigo-dye-200 rounded"></div>
                    <span className="text-xs text-gray-500">8px</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">space-md</span>
                    <div className="w-16 h-4 bg-indigo-dye-200 rounded"></div>
                    <span className="text-xs text-gray-500">16px</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">space-lg</span>
                    <div className="w-24 h-4 bg-indigo-dye-200 rounded"></div>
                    <span className="text-xs text-gray-500">24px</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">space-xl</span>
                    <div className="w-32 h-4 bg-indigo-dye-200 rounded"></div>
                    <span className="text-xs text-gray-500">32px</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-h5 text-gray-900 mb-4">Border Radius</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-sm bg-indigo-dye-200"></div>
                    <div>
                      <p className="text-sm font-medium">rounded-sm</p>
                      <p className="text-xs text-gray-500">6px - Small elements</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-md bg-indigo-dye-200"></div>
                    <div>
                      <p className="text-sm font-medium">rounded-md</p>
                      <p className="text-xs text-gray-500">8px - Cards, larger elements</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-lg bg-indigo-dye-200"></div>
                    <div>
                      <p className="text-sm font-medium">rounded-lg</p>
                      <p className="text-xs text-gray-500">12px - Default card radius</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default DesignSystem; 