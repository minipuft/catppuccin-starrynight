import { CSSVariableBatcher } from '@/core/performance/CSSVariableBatcher';
import { PerformanceAnalyzer } from '@/core/performance/PerformanceAnalyzer';
import { GlobalEventBus } from '@/core/events/EventBus';
import type { Year3000Config } from '@/types/models';
import { 
  UNIFIED_VARIABLE_GROUPS, 
  LEGACY_VARIABLE_MAPPINGS,
  getVariableDefinition,
  getVariablesForGroup,
  getCriticalVariables,
  convertLegacyVariable,
  isVariableCritical,
  getGroupPriority,
  getVariableDefaultValue,
  validateVariableValue,
  type VariableGroup,
  type VariablePriority
} from './UnifiedVariableGroups';

interface CSSVariableGroup {
  name: string;
  variables: Map<string, string>;
  priority: VariablePriority;
  batchSize: number;
  flushInterval: number;
}

interface CSSVariableTransaction {
  id: string;
  variables: Map<string, string>;
  timestamp: number;
  priority: VariablePriority;
  completed: boolean;
}

interface CSSVariableUpdate {
  property: string;
  value: string;
  priority: VariablePriority;
  timestamp: number;
  source: string;
}

/**
 * UnifiedCSSVariableManager - Phase 2 System Consolidation
 * 
 * Provides centralized CSS variable management with:
 * - Priority-based variable batching
 * - Transaction-based updates
 * - Performance monitoring and optimization
 * - Conflict resolution and deduplication
 * - Event-driven synchronization
 * 
 * @architecture Phase 2 of system consolidation
 * @performance Target: 50% reduction in CSS variable update overhead
 */
export class UnifiedCSSVariableManager {
  private static instance: UnifiedCSSVariableManager | null = null;
  
  private config: Year3000Config;
  private performanceAnalyzer: PerformanceAnalyzer | null = null;
  private cssVariableBatcher: CSSVariableBatcher | null = null;
  private eventBus: typeof GlobalEventBus;
  
  // Variable groups for organized management
  private variableGroups: Map<string, CSSVariableGroup> = new Map();
  
  // Transaction system for batch updates
  private pendingTransactions: Map<string, CSSVariableTransaction> = new Map();
  private transactionCounter = 0;
  
  // Update queue with priority handling
  private updateQueue: Map<string, CSSVariableUpdate> = new Map();
  private flushTimer: NodeJS.Timeout | null = null;
  
  // Performance tracking
  private performanceMetrics = {
    totalUpdates: 0,
    batchedUpdates: 0,
    conflictResolutions: 0,
    averageFlushTime: 0,
    transactionCount: 0,
    lastFlushTime: 0,
  };
  
  // Configuration
  private readonly DEFAULT_BATCH_SIZE = 50;
  private readonly DEFAULT_FLUSH_INTERVAL = 16; // 60fps
  private readonly PRIORITY_WEIGHTS = {
    low: 1,
    normal: 2,
    high: 3,
    critical: 4,
  };
  
  constructor(config: Year3000Config) {
    this.config = config;
    this.eventBus = GlobalEventBus;
    
    // Initialize default variable groups
    this.initializeDefaultGroups();
    
    // Subscribe to events
    this.subscribeToEvents();
    
    if (this.config.enableDebug) {
      console.log('[UnifiedCSSVariableManager] Created with centralized management');
    }
  }
  
  /**
   * Get or create singleton instance
   */
  public static getInstance(config?: Year3000Config): UnifiedCSSVariableManager {
    if (!UnifiedCSSVariableManager.instance) {
      if (!config) {
        throw new Error('UnifiedCSSVariableManager requires config for first initialization');
      }
      UnifiedCSSVariableManager.instance = new UnifiedCSSVariableManager(config);
    }
    return UnifiedCSSVariableManager.instance;
  }
  
  /**
   * Initialize with performance analyzer and CSS variable batcher
   */
  public initialize(performanceAnalyzer: PerformanceAnalyzer, cssVariableBatcher: CSSVariableBatcher): void {
    this.performanceAnalyzer = performanceAnalyzer;
    this.cssVariableBatcher = cssVariableBatcher;
    
    if (this.config.enableDebug) {
      console.log('[UnifiedCSSVariableManager] Initialized with performance monitoring');
    }
  }
  
  /**
   * Queue a CSS variable update with priority
   */
  public queueUpdate(
    property: string,
    value: string,
    priority: VariablePriority = 'normal',
    source: string = 'unknown'
  ): void {
    // Convert legacy variable names to unified names
    const unifiedProperty = convertLegacyVariable(property);
    
    // Auto-detect priority based on variable definition
    let finalPriority = priority;
    if (priority === 'normal') {
      const varDef = getVariableDefinition(unifiedProperty);
      if (varDef) {
        finalPriority = getGroupPriority(varDef.group);
      }
    }
    
    // Validate variable value
    if (this.config.enableDebug && !validateVariableValue(unifiedProperty, value)) {
      console.warn(`[UnifiedCSSVariableManager] Invalid value for ${unifiedProperty}: ${value}`);
    }
    
    const update: CSSVariableUpdate = {
      property: unifiedProperty,
      value,
      priority: finalPriority,
      timestamp: performance.now(),
      source,
    };
    
    // Handle conflicts with existing updates
    const existingUpdate = this.updateQueue.get(unifiedProperty);
    if (existingUpdate) {
      // Resolve conflict based on priority and timestamp
      if (this.shouldReplaceUpdate(existingUpdate, update)) {
        this.updateQueue.set(unifiedProperty, update);
        this.performanceMetrics.conflictResolutions++;
      }
    } else {
      this.updateQueue.set(unifiedProperty, update);
    }
    
    this.performanceMetrics.totalUpdates++;
    
    // Schedule flush based on priority
    this.scheduleFlush(finalPriority);
    
    if (this.config.enableDebug && finalPriority === 'critical') {
      console.log(`[UnifiedCSSVariableManager] Critical update queued: ${unifiedProperty} = ${value}`);
    }
  }
  
  /**
   * Queue multiple CSS variable updates in a transaction
   */
  public queueTransaction(
    variables: Record<string, string>,
    priority: 'low' | 'normal' | 'high' | 'critical' = 'normal',
    source: string = 'unknown'
  ): string {
    const transactionId = `tx_${++this.transactionCounter}`;
    const variableMap = new Map(Object.entries(variables));
    
    const transaction: CSSVariableTransaction = {
      id: transactionId,
      variables: variableMap,
      timestamp: performance.now(),
      priority,
      completed: false,
    };
    
    this.pendingTransactions.set(transactionId, transaction);
    
    // Queue all variables from the transaction
    for (const [property, value] of variableMap) {
      this.queueUpdate(property, value, priority, `${source}:${transactionId}`);
    }
    
    this.performanceMetrics.transactionCount++;
    
    if (this.config.enableDebug) {
      console.log(`[UnifiedCSSVariableManager] Transaction ${transactionId} queued with ${variableMap.size} variables`);
    }
    
    return transactionId;
  }
  
  /**
   * Register a variable group for organized management
   */
  public registerVariableGroup(
    name: string,
    priority: 'low' | 'normal' | 'high' | 'critical' = 'normal',
    batchSize: number = this.DEFAULT_BATCH_SIZE,
    flushInterval: number = this.DEFAULT_FLUSH_INTERVAL
  ): void {
    const group: CSSVariableGroup = {
      name,
      variables: new Map(),
      priority,
      batchSize,
      flushInterval,
    };
    
    this.variableGroups.set(name, group);
    
    if (this.config.enableDebug) {
      console.log(`[UnifiedCSSVariableManager] Registered variable group: ${name}`);
    }
  }
  
  /**
   * Update variables in a specific group
   */
  public updateVariableGroup(
    groupName: string,
    variables: Record<string, string>,
    source: string = 'unknown'
  ): void {
    const group = this.variableGroups.get(groupName);
    if (!group) {
      console.warn(`[UnifiedCSSVariableManager] Unknown variable group: ${groupName}`);
      return;
    }
    
    // Update group variables
    for (const [property, value] of Object.entries(variables)) {
      group.variables.set(property, value);
    }
    
    // Queue updates with group priority
    this.queueTransaction(variables, group.priority, `group:${groupName}:${source}`);
  }
  
  /**
   * Force immediate flush of all pending updates
   */
  public forceFlush(): void {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
    
    this.flushUpdates();
  }
  
  /**
   * Get current performance metrics
   */
  public getPerformanceMetrics(): typeof this.performanceMetrics {
    return { ...this.performanceMetrics };
  }
  
  /**
   * Get current variable group status
   */
  public getVariableGroups(): Map<string, CSSVariableGroup> {
    return new Map(this.variableGroups);
  }
  
  /**
   * Get pending transaction status
   */
  public getPendingTransactions(): Map<string, CSSVariableTransaction> {
    return new Map(this.pendingTransactions);
  }
  
  /**
   * Clear all pending updates (emergency reset)
   */
  public clearPendingUpdates(): void {
    this.updateQueue.clear();
    this.pendingTransactions.clear();
    
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
    
    if (this.config.enableDebug) {
      console.log('[UnifiedCSSVariableManager] Cleared all pending updates');
    }
  }
  
  // =========================================================================
  // UNIFIED VARIABLE GROUP CONVENIENCE METHODS
  // =========================================================================
  
  /**
   * Update music system variables
   */
  public updateMusicVariables(variables: {
    'beat.pulse.intensity'?: number;
    'beat.frequency'?: number;
    'beat.phase'?: number;
    'spectrum.phase'?: number;
    'spectrum.energy'?: number;
    'breathing.scale'?: number;
    'rhythm.phase'?: number;
    'rhythm.intensity'?: number;
    'tempo.bpm'?: number;
    'energy.level'?: number;
    'valence'?: number;
    'danceability'?: number;
  }): void {
    const updates: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(variables)) {
      if (value !== undefined) {
        const fullKey = `--sn-music-${key.replace(/\./g, '-')}`;  // Convert dots to dashes
        updates[fullKey] = String(value);
      }
    }
    
    this.queueTransaction(updates, 'critical', 'music-system');
  }
  
  /**
   * Update color system variables
   */
  public updateColorVariables(variables: {
    'accent.hex'?: string;
    'accent.rgb'?: string;
    'extracted.primary.rgb'?: string;
    'extracted.secondary.rgb'?: string;
    'extracted.tertiary.rgb'?: string;
    'harmony.blend.intensity'?: number;
    'shift.hue'?: number;
    'shift.saturation'?: number;
    'shift.lightness'?: number;
    'shift.temperature'?: number;
  }): void {
    const updates: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(variables)) {
      if (value !== undefined) {
        const fullKey = `--sn-color-${key.replace(/\./g, '-')}`;  // Convert dots to dashes
        updates[fullKey] = String(value);
      }
    }
    
    this.queueTransaction(updates, 'high', 'color-system');
  }
  
  /**
   * Update background system variables
   */
  public updateBackgroundVariables(variables: {
    'gradient.primary.rgb'?: string;
    'gradient.secondary.rgb'?: string;
    'gradient.tertiary.rgb'?: string;
    'gradient.opacity'?: number;
    'gradient.blur'?: string;
    'gradient.angle'?: string;
    'gradient.flow.direction'?: string;
    'gradient.flow.speed'?: number;
    'webgl.ready'?: boolean;
    'webgl.quality'?: number;
    'active-backend'?: string;
  }): void {
    const updates: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(variables)) {
      if (value !== undefined) {
        const fullKey = `--sn-bg-${key.replace(/\./g, '-')}`;  // Convert dots to dashes
        updates[fullKey] = typeof value === 'boolean' ? (value ? '1' : '0') : String(value);
      }
    }
    
    this.queueTransaction(updates, 'normal', 'background-system');
  }
  
  /**
   * Update performance system variables
   */
  public updatePerformanceVariables(variables: {
    'mode'?: string;
    'quality.level'?: number;
    'fps.target'?: number;
    'frame.budget'?: number;
    'optimization.level'?: number;
    'device.tier'?: string;
    'device.memory'?: number;
    'device.gpu'?: number;
    'device.mobile'?: number;
    'thermal.temperature'?: number;
    'thermal.throttle'?: boolean;
    'battery.level'?: number;
    'battery.charging'?: boolean;
    'battery.saver'?: boolean;
    'blur.quality'?: number;
    'shadow.quality'?: number;
    'animation.quality'?: number;
    'effect.quality'?: number;
    'gpu.acceleration.enabled'?: boolean;
  }): void {
    const updates: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(variables)) {
      if (value !== undefined) {
        const fullKey = `--sn-performance-${key.replace(/\./g, '-')}`;  // Convert dots to dashes
        updates[fullKey] = typeof value === 'boolean' ? (value ? '1' : '0') : String(value);
      }
    }
    
    this.queueTransaction(updates, 'high', 'performance-system');
  }
  
  /**
   * Update consciousness system variables
   */
  public updateConsciousnessVariables(variables: {
    'depth.field'?: string;
    'depth.near'?: string;
    'depth.far'?: string;
    'field.intensity'?: number;
    'field.breathing.rate'?: string;
    'field.sensitivity'?: number;
    'hover.pull'?: string;
    'focus.pull'?: string;
    'transition.speed'?: string;
    'bilateral.sync'?: boolean;
  }): void {
    const updates: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(variables)) {
      if (value !== undefined) {
        const fullKey = `--sn-consciousness-${key.replace(/\./g, '-')}`;  // Convert dots to dashes
        updates[fullKey] = typeof value === 'boolean' ? (value ? '1' : '0') : String(value);
      }
    }
    
    this.queueTransaction(updates, 'normal', 'consciousness-system');
  }
  
  /**
   * Update animation system variables
   */
  public updateAnimationVariables(variables: {
    'duration.fast'?: string;
    'duration.normal'?: string;
    'duration.slow'?: string;
    'duration.breathing'?: string;
    'motion.reduced'?: boolean;
    'motion.scale'?: number;
    'frame.budget'?: string;
    'frame.priority'?: string;
    'frame.fps'?: number;
  }): void {
    const updates: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(variables)) {
      if (value !== undefined) {
        const fullKey = `--sn-anim-${key.replace(/\./g, '-')}`;  // Convert dots to dashes
        updates[fullKey] = typeof value === 'boolean' ? (value ? '1' : '0') : String(value);
      }
    }
    
    this.queueTransaction(updates, 'normal', 'animation-system');
  }
  /**
   * Update utility system variables
   */
  public updateUtilityVariables(variables: {
    'debug.enabled'?: boolean;
    'debug.verbose'?: boolean;
    'debug.performance'?: boolean;
    'debug.grid.visible'?: boolean;
    'a11y.contrast.enhanced'?: boolean;
    'a11y.focus.visible'?: boolean;
    'a11y.motion.reduced'?: boolean;
    'a11y.text.size.scale'?: number;
    'feature.webgl.enabled'?: boolean;
    'feature.consciousness.enabled'?: boolean;
    'feature.music.sync.enabled'?: boolean;
    'feature.animations.enabled'?: boolean;
  }): void {
    const updates: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(variables)) {
      if (value !== undefined) {
        const fullKey = `--sn-${key.replace(/\./g, '-')}`;  // Convert dots to dashes
        updates[fullKey] = typeof value === 'boolean' ? (value ? '1' : '0') : String(value);
      }
    }
    
    this.queueTransaction(updates, 'low', 'utility-system');
  }
  
  /**
   * Get current value for a unified variable
   */
  public getVariableValue(variableName: string): string | null {
    const unifiedName = convertLegacyVariable(variableName);
    const computedStyle = getComputedStyle(document.documentElement);
    return computedStyle.getPropertyValue(unifiedName).trim() || null;
  }
  
  /**
   * Check if a variable is currently being updated
   */
  public isVariablePending(variableName: string): boolean {
    const unifiedName = convertLegacyVariable(variableName);
    return this.updateQueue.has(unifiedName);
  }
  
  /**
   * Get all variables in a specific group
   */
  public getGroupVariables(groupName: VariableGroup): Record<string, string> {
    const variables = getVariablesForGroup(groupName);
    const result: Record<string, string> = {};
    
    for (const [key, variable] of Object.entries(variables)) {
      const value = this.getVariableValue(variable.name);
      if (value !== null) {
        result[key] = value;
      }
    }
    
    return result;
  }
  
  /**
   * Destroy the manager and clean up resources
   */
  public destroy(): void {
    this.clearPendingUpdates();
    this.variableGroups.clear();
    
    if (UnifiedCSSVariableManager.instance === this) {
      UnifiedCSSVariableManager.instance = null;
    }
    
    if (this.config.enableDebug) {
      console.log('[UnifiedCSSVariableManager] Destroyed');
    }
  }
  
  // =========================================================================
  // PRIVATE METHODS
  // =========================================================================
  
  /**
   * Initialize default variable groups based on unified system architecture
   */
  private initializeDefaultGroups(): void {
    // Clear existing groups
    this.variableGroups.clear();
    
    // Initialize groups based on unified variable groups
    for (const [groupName, groupDef] of Object.entries(UNIFIED_VARIABLE_GROUPS)) {
      const batchSize = this.getBatchSizeForPriority(groupDef.priority);
      const flushInterval = this.getFlushIntervalForPriority(groupDef.priority);
      
      this.registerVariableGroup(groupName, groupDef.priority, batchSize, flushInterval);
      
      if (this.config.enableDebug) {
        console.log(`[UnifiedCSSVariableManager] Registered group: ${groupName} (${groupDef.priority})`);
      }
    }
    
    // Register critical variables with CSS variable batcher
    if (this.cssVariableBatcher) {
      const criticalVars = getCriticalVariables();
      for (const varName of criticalVars) {
        this.cssVariableBatcher.addCriticalVariable(varName);
      }
      
      if (this.config.enableDebug) {
        console.log(`[UnifiedCSSVariableManager] Registered ${criticalVars.length} critical variables`);
      }
    }
    
    if (this.config.enableDebug) {
      console.log('[UnifiedCSSVariableManager] Unified variable groups initialized');
    }
  }
  
  /**
   * Get batch size based on priority
   */
  private getBatchSizeForPriority(priority: VariablePriority): number {
    switch (priority) {
      case 'critical': return 10;  // Small batches for immediate updates
      case 'high': return 25;      // Medium batches for responsive updates
      case 'normal': return 50;    // Default batch size
      case 'low': return 100;      // Large batches for non-urgent updates
      default: return 50;
    }
  }
  
  /**
   * Get flush interval based on priority
   */
  private getFlushIntervalForPriority(priority: VariablePriority): number {
    switch (priority) {
      case 'critical': return 4;   // ~240fps for critical updates
      case 'high': return 8;       // ~120fps for high priority
      case 'normal': return 16;    // ~60fps for normal updates
      case 'low': return 32;       // ~30fps for low priority
      default: return 16;
    }
  }
  
  /**
   * Subscribe to relevant events
   */
  private subscribeToEvents(): void {
    // Subscribe to settings changes
    this.eventBus.subscribe('settings:css-variable-optimization', (payload: any) => {
      if (payload.enabled !== undefined) {
        // Adjust optimization based on settings
        if (this.config.enableDebug) {
          console.log(`[UnifiedCSSVariableManager] CSS variable optimization ${payload.enabled ? 'enabled' : 'disabled'}`);
        }
      }
    });
    
    // Subscribe to performance warnings
    this.eventBus.subscribe('performance:warning', (payload: any) => {
      if (payload.type === 'css-variables') {
        // Reduce update frequency under performance pressure
        this.adjustPerformanceProfile('low');
      }
    });
  }
  
  /**
   * Determine if an update should replace an existing one
   */
  private shouldReplaceUpdate(existing: CSSVariableUpdate, incoming: CSSVariableUpdate): boolean {
    // Priority-based replacement
    const existingWeight = this.PRIORITY_WEIGHTS[existing.priority];
    const incomingWeight = this.PRIORITY_WEIGHTS[incoming.priority];
    
    if (incomingWeight > existingWeight) {
      return true;
    }
    
    if (incomingWeight === existingWeight) {
      // Same priority - use timestamp (newer wins)
      return incoming.timestamp > existing.timestamp;
    }
    
    return false;
  }
  
  /**
   * Schedule flush based on priority
   */
  private scheduleFlush(priority: 'low' | 'normal' | 'high' | 'critical'): void {
    if (this.flushTimer) {
      // Critical updates should flush immediately
      if (priority === 'critical') {
        this.forceFlush();
        return;
      }
      
      // High priority updates should reduce flush delay
      if (priority === 'high') {
        clearTimeout(this.flushTimer);
        this.flushTimer = setTimeout(() => this.flushUpdates(), 8);
        return;
      }
      
      // Normal and low priority updates use existing timer
      return;
    }
    
    // Schedule new flush
    const delay = this.getFlushDelay(priority);
    this.flushTimer = setTimeout(() => this.flushUpdates(), delay);
  }
  
  /**
   * Get flush delay based on priority
   */
  private getFlushDelay(priority: 'low' | 'normal' | 'high' | 'critical'): number {
    switch (priority) {
      case 'critical': return 0;
      case 'high': return 8;
      case 'normal': return 16;
      case 'low': return 32;
      default: return 16;
    }
  }
  
  /**
   * Flush all pending updates
   */
  private flushUpdates(): void {
    if (this.updateQueue.size === 0) {
      this.flushTimer = null;
      return;
    }
    
    const startTime = performance.now();
    const updates = Array.from(this.updateQueue.values());
    
    // Sort by priority and timestamp
    updates.sort((a, b) => {
      const priorityDiff = this.PRIORITY_WEIGHTS[b.priority] - this.PRIORITY_WEIGHTS[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return a.timestamp - b.timestamp;
    });
    
    // Apply updates through CSS variable batcher or direct application
    const variables: Record<string, string> = {};
    for (const update of updates) {
      variables[update.property] = update.value;
    }
    
    // Use CSS variable batcher if available, otherwise apply directly
    if (this.cssVariableBatcher) {
      for (const [property, value] of Object.entries(variables)) {
        this.cssVariableBatcher.queueCSSVariableUpdate(property, value);
      }
      this.cssVariableBatcher.flushCSSVariableBatch();
    } else {
      // Direct application fallback
      for (const [property, value] of Object.entries(variables)) {
        document.documentElement.style.setProperty(property, value);
      }
    }
    
    // Mark transactions as completed
    for (const transaction of this.pendingTransactions.values()) {
      let allVariablesProcessed = true;
      for (const [property] of transaction.variables) {
        if (this.updateQueue.has(property)) {
          allVariablesProcessed = false;
          break;
        }
      }
      if (allVariablesProcessed) {
        transaction.completed = true;
      }
    }
    
    // Clean up completed transactions
    for (const [id, transaction] of this.pendingTransactions) {
      if (transaction.completed) {
        this.pendingTransactions.delete(id);
      }
    }
    
    // Clear update queue
    this.updateQueue.clear();
    this.flushTimer = null;
    
    // Track performance
    const flushTime = performance.now() - startTime;
    this.performanceMetrics.averageFlushTime = 
      (this.performanceMetrics.averageFlushTime * 0.9) + (flushTime * 0.1);
    this.performanceMetrics.batchedUpdates += updates.length;
    this.performanceMetrics.lastFlushTime = Date.now();
    
    // Record performance with analyzer
    if (this.performanceAnalyzer) {
      this.performanceAnalyzer.recordMetric('css-variable-flush-time', flushTime);
      this.performanceAnalyzer.recordMetric('css-variable-batch-size', updates.length);
    }
    
    // Emit flush event
    this.eventBus.publish('css-variables:flushed', {
      updateCount: updates.length,
      flushTime,
      timestamp: Date.now(),
    });
    
    if (this.config.enableDebug && updates.length > 50) {
      console.log(`[UnifiedCSSVariableManager] Flushed ${updates.length} updates in ${flushTime.toFixed(2)}ms`);
    }
  }
  
  /**
   * Adjust performance profile based on system load
   */
  private adjustPerformanceProfile(profile: 'low' | 'normal' | 'high'): void {
    switch (profile) {
      case 'low':
        // Reduce update frequency under performance pressure
        for (const group of this.variableGroups.values()) {
          group.flushInterval = Math.max(group.flushInterval * 2, 64);
          group.batchSize = Math.min(group.batchSize * 2, 200);
        }
        break;
      case 'normal':
        // Reset to default intervals
        this.initializeDefaultGroups();
        break;
      case 'high':
        // Increase update frequency for high performance
        for (const group of this.variableGroups.values()) {
          group.flushInterval = Math.max(group.flushInterval * 0.5, 4);
          group.batchSize = Math.max(group.batchSize * 0.5, 10);
        }
        break;
    }
    
    if (this.config.enableDebug) {
      console.log(`[UnifiedCSSVariableManager] Performance profile adjusted to ${profile}`);
    }
  }
}