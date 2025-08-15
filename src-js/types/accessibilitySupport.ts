/**
 * AccessibilitySupport - Accessibility and User Preferences Interface
 * 
 * This interface defines accessibility features and user preference handling
 * for visual systems. It ensures WCAG compliance and supports user needs
 * including motion sensitivity, visual impairments, and cognitive preferences.
 * 
 * @architecture Phase 3 Interface Decomposition - Accessibility Focus
 * @responsibility Accessibility compliance, motion preferences, visual adaptations
 * @compliance WCAG 2.1 AA standards with enhanced support for motion sensitivity
 */

/**
 * Accessibility support interface for visual systems
 * 
 * Visual systems that implement this interface can adapt to user accessibility
 * preferences and provide inclusive experiences for users with diverse needs.
 */
export interface AccessibilitySupport {
  /**
   * Apply accessibility preferences
   * 
   * Called when prefers-reduced-motion or other accessibility settings change.
   * Systems should adapt visual effects to meet user accessibility needs.
   * 
   * @param preferences - Current accessibility preferences
   */
  applyAccessibilityPreferences(preferences: AccessibilityPreferences): void;
  
  /**
   * Check accessibility compliance status
   * 
   * Returns current compliance status and any accessibility issues.
   * Used for accessibility auditing and validation.
   * 
   * @returns Current accessibility compliance status
   */
  getAccessibilityStatus?(): AccessibilityStatus;
  
  /**
   * Update motion preferences specifically
   * 
   * Called when prefers-reduced-motion setting changes. This is separate from
   * the general preferences method for performance-critical motion updates.
   * 
   * @param reduceMotion - Whether to reduce or disable motion effects
   */
  setMotionPreference?(reduceMotion: boolean): void;
  
  /**
   * Update contrast preferences
   * 
   * Called when prefers-contrast or high-contrast mode changes.
   * 
   * @param contrastLevel - Desired contrast level
   */
  setContrastPreference?(contrastLevel: ContrastLevel): void;
  
  /**
   * Update transparency preferences
   * 
   * Called when prefers-reduced-transparency setting changes.
   * 
   * @param reduceTransparency - Whether to reduce transparency effects
   */
  setTransparencyPreference?(reduceTransparency: boolean): void;
  
  /**
   * Enable accessibility debugging mode
   * 
   * Provides visual indicators for accessibility features and compliance issues.
   * Used for development and testing.
   * 
   * @param enabled - Whether to enable accessibility debugging
   */
  setAccessibilityDebugMode?(enabled: boolean): void;
}

/**
 * User accessibility preferences
 */
export interface AccessibilityPreferences {
  /** Whether to reduce or disable motion and animations */
  reducedMotion: boolean;
  
  /** Whether user prefers high contrast visuals */
  highContrast: boolean;
  
  /** Whether to reduce transparency and translucent effects */
  prefersTransparency: boolean;
  
  /** User's preferred color scheme */
  colorScheme?: 'light' | 'dark' | 'auto';
  
  /** Whether user has enabled forced colors mode (Windows high contrast) */
  forcedColors?: boolean;
  
  /** Preferred contrast level */
  contrastLevel?: ContrastLevel;
  
  /** Whether user prefers reduced data usage (affects quality) */
  prefersReducedData?: boolean;
  
  /** Focus visibility preferences */
  focusVisibility?: FocusVisibilityLevel;
}

/**
 * Contrast level preferences
 */
export type ContrastLevel = 'normal' | 'more' | 'less' | 'high';

/**
 * Focus visibility level preferences
 */
export type FocusVisibilityLevel = 'standard' | 'enhanced' | 'maximum';

/**
 * Accessibility compliance status
 */
export interface AccessibilityStatus {
  /** Overall compliance level */
  complianceLevel: 'AA' | 'AAA' | 'partial' | 'non-compliant';
  
  /** Specific WCAG criteria compliance */
  wcagCompliance: {
    /** 1.4.3 Contrast (Minimum) - AA */
    contrastMinimum: boolean;
    
    /** 1.4.6 Contrast (Enhanced) - AAA */
    contrastEnhanced: boolean;
    
    /** 2.2.2 Pause, Stop, Hide - AA */
    pauseStopHide: boolean;
    
    /** 2.3.1 Three Flashes or Below Threshold - AA */
    flashingContent: boolean;
    
    /** 2.3.3 Animation from Interactions - AAA */
    animationFromInteractions: boolean;
  };
  
  /** Current accessibility issues */
  issues: AccessibilityIssue[];
  
  /** Accessibility features currently active */
  activeFeatures: string[];
  
  /** Timestamp of last accessibility check */
  lastChecked: Date;
}

/**
 * Accessibility issue reporting
 */
export interface AccessibilityIssue {
  /** Issue severity level */
  severity: 'error' | 'warning' | 'info';
  
  /** WCAG criterion this issue relates to */
  criterion: string;
  
  /** Human-readable description of the issue */
  description: string;
  
  /** Suggested fix for the issue */
  suggestion?: string;
  
  /** Element or component where issue was found */
  location?: string;
}

/**
 * Motion and animation accessibility settings
 */
export interface MotionAccessibility {
  /** Whether motion effects are completely disabled */
  motionDisabled: boolean;
  
  /** Whether to use essential motion only */
  essentialMotionOnly: boolean;
  
  /** Maximum animation duration allowed (ms) */
  maxAnimationDuration: number;
  
  /** Whether to respect user's battery level for motion */
  respectBatteryLevel: boolean;
  
  /** Whether to disable parallax effects */
  disableParallax: boolean;
  
  /** Whether to disable auto-playing animations */
  disableAutoplay: boolean;
}

/**
 * Visual accessibility adaptations
 */
export interface VisualAccessibility {
  /** Contrast ratio requirements */
  contrastRatio: {
    normal: number;    // WCAG AA: 4.5:1
    large: number;     // WCAG AA: 3:1
    enhanced: number;  // WCAG AAA: 7:1
  };
  
  /** Color differentiation settings */
  colorDifferentiation: {
    /** Whether to avoid color-only information */
    avoidColorOnly: boolean;
    
    /** Whether to provide pattern alternatives */
    usePatterns: boolean;
    
    /** Whether to enhance color differences */
    enhanceColorDiff: boolean;
  };
  
  /** Typography accessibility */
  typography: {
    /** Minimum font size (px) */
    minFontSize: number;
    
    /** Whether to enhance focus indicators */
    enhanceFocus: boolean;
    
    /** Line height multiplier for readability */
    lineHeightMultiplier: number;
  };
}

/**
 * Advanced accessibility support for systems with comprehensive features
 */
export interface AdvancedAccessibilitySupport extends AccessibilitySupport {
  /**
   * Get detailed accessibility metrics
   * 
   * @returns Comprehensive accessibility compliance and usage metrics
   */
  getDetailedAccessibilityMetrics(): DetailedAccessibilityMetrics;
  
  /**
   * Perform accessibility audit
   * 
   * @returns Comprehensive accessibility audit results
   */
  performAccessibilityAudit(): Promise<AccessibilityAuditResult>;
  
  /**
   * Configure motion accessibility settings
   * 
   * @param settings - Detailed motion accessibility configuration
   */
  configureMotionAccessibility(settings: MotionAccessibility): void;
  
  /**
   * Configure visual accessibility settings
   * 
   * @param settings - Detailed visual accessibility configuration
   */
  configureVisualAccessibility(settings: VisualAccessibility): void;
}

/**
 * Detailed accessibility metrics
 */
export interface DetailedAccessibilityMetrics {
  /** Overall accessibility score (0-100) */
  score: number;
  
  /** WCAG compliance breakdown */
  wcagBreakdown: {
    level: 'AA' | 'AAA';
    passingCriteria: number;
    totalCriteria: number;
    percentage: number;
  };
  
  /** User preference adoption */
  preferenceAdoption: {
    reducedMotion: boolean;
    highContrast: boolean;
    reducedTransparency: boolean;
    forcedColors: boolean;
  };
  
  /** Performance impact of accessibility features */
  performanceImpact: {
    additionalMemoryMB: number;
    fpsReduction: number;
    renderTimeIncrease: number;
  };
}

/**
 * Comprehensive accessibility audit result
 */
export interface AccessibilityAuditResult {
  /** Overall audit score */
  score: number;
  
  /** Issues found during audit */
  issues: AccessibilityIssue[];
  
  /** Recommendations for improvement */
  recommendations: string[];
  
  /** Compliance status by WCAG level */
  compliance: {
    AA: boolean;
    AAA: boolean;
  };
  
  /** Audit timestamp */
  timestamp: Date;
}