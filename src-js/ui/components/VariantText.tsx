/**
 * VariantText - React component for applying Spicetify typography variants
 * Integrates with VariantResolver for consistent typography across the theme
 */

import React, { useEffect, useRef } from "react";
// Import theme-specific Spicetify type extensions
/// <reference path="../../types/spicetify-extensions.d.ts" />
import { VariantResolver } from "@/utils/spicetify/VariantResolver";

// Create a singleton instance for performance
let variantResolver: VariantResolver | null = null;

function getVariantResolver(): VariantResolver {
  if (!variantResolver) {
    variantResolver = new VariantResolver({
      enableDebug: false,
      enableResponsiveScaling: true,
      performanceMode: 'optimized'
    });
    variantResolver.initialize();
  }
  return variantResolver;
}

interface VariantTextProps {
  variant: Spicetify.Variant;
  children: React.ReactNode;
  className?: string;
  component?: keyof JSX.IntrinsicElements;
  style?: React.CSSProperties;
  musicContext?: {
    energy: number;
    tempo: number;
    valence: number;
  };
  [key: string]: any; // For additional props
}

export const VariantText: React.FC<VariantTextProps> = ({
  variant,
  children,
  className = "",
  component = "span",
  style = {},
  musicContext,
  ...props
}) => {
  const elementRef = useRef<HTMLElement>(null);
  const resolver = getVariantResolver();

  useEffect(() => {
    if (elementRef.current) {
      const context = musicContext ? {
        component: component,
        state: 'normal' as const,
        musicContext
      } : undefined;
      
      resolver.applyVariantToElement(elementRef.current, variant, context);
    }
  }, [variant, musicContext, component]);

  const Component = component as any;
  const variantClassName = resolver.getVariantClass(variant);
  const combinedClassName = `${variantClassName} ${className}`.trim();

  return (
    <Component
      ref={elementRef}
      className={combinedClassName}
      style={style}
      {...props}
    >
      {children}
    </Component>
  );
};

// Convenient preset components for common use cases
export const VariantHeading: React.FC<Omit<VariantTextProps, 'component'>> = (props) => {
  // Provide defaults for required props if not provided
  const propsWithDefaults = {
    variant: 'forte' as Spicetify.Variant,
    children: '',
    ...props
  };
  return <VariantText {...propsWithDefaults} component="h2" />;
};

export const VariantLabel: React.FC<Omit<VariantTextProps, 'component'>> = (props) => {
  const propsWithDefaults = {
    variant: 'bass' as Spicetify.Variant,
    children: '',
    ...props
  };
  return <VariantText {...propsWithDefaults} component="label" />;
};

export const VariantButton: React.FC<Omit<VariantTextProps, 'component'>> = (props) => {
  const propsWithDefaults = {
    variant: 'brio' as Spicetify.Variant,
    children: '',
    ...props
  };
  return <VariantText {...propsWithDefaults} component="button" />;
};

export const VariantSpan: React.FC<Omit<VariantTextProps, 'component'>> = (props) => {
  const propsWithDefaults = {
    variant: 'bass' as Spicetify.Variant,
    children: '',
    ...props
  };
  return <VariantText {...propsWithDefaults} component="span" />;
};

// Hook for getting variant CSS directly
export const useVariantCSS = (variant: Spicetify.Variant, musicContext?: VariantTextProps['musicContext']) => {
  const resolver = getVariantResolver();
  const context = musicContext ? {
    component: 'span',
    state: 'normal' as const,
    musicContext
  } : undefined;
  
  return resolver.getVariantCSS(variant, context);
};

// Hook for getting recommended variant based on usage
export const useRecommendedVariant = (usage: string): Spicetify.Variant | null => {
  const resolver = getVariantResolver();
  return resolver.getRecommendedVariant(usage);
};