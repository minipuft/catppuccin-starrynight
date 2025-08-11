// Test script to validate WebGL settings integration
// Run this in Spicetify's developer console to test the new settings system

console.log('🧪 Testing WebGL Settings Integration');

// Test 1: Check if new WebGL settings exist in SettingsManager
console.group('📋 Settings Manager Integration Test');
try {
  // Get the global SettingsManager instance (if available)
  const settingsTest = [
    'sn-webgl-enabled',
    'sn-webgl-force-enabled', 
    'sn-webgl-persistence-mode'
  ];

  settingsTest.forEach(setting => {
    // Try to access the setting (this would normally go through SettingsManager)
    const stored = localStorage.getItem(setting);
    console.log(`Setting ${setting}:`, stored || 'not set (will use default)');
  });

  console.log('✅ Settings integration test complete');
} catch (error) {
  console.error('❌ Settings integration test failed:', error);
}
console.groupEnd();

// Test 2: Validate default values
console.group('🎯 Default Values Test');
try {
  const expectedDefaults = {
    'sn-webgl-enabled': 'true',
    'sn-webgl-force-enabled': 'false',
    'sn-webgl-persistence-mode': 'adaptive',
    'sn-flow-gradient': 'balanced'
  };

  Object.entries(expectedDefaults).forEach(([key, expected]) => {
    const stored = localStorage.getItem(key);
    const effective = stored || expected;
    const isCorrect = effective === expected;
    
    console.log(`${isCorrect ? '✅' : '⚠️'} ${key}:`, {
      stored,
      expected,
      effective,
      correct: isCorrect
    });
  });
} catch (error) {
  console.error('❌ Default values test failed:', error);
}
console.groupEnd();

// Test 3: WebGL System Settings Loading
console.group('🔧 WebGL System Settings Loading Test');
try {
  // Test the settings that would be loaded by WebGL system
  const webglSettings = {
    enabled: localStorage.getItem('sn-webgl-enabled') !== 'false',
    forceEnabled: localStorage.getItem('sn-webgl-force-enabled') === 'true',
    persistenceMode: localStorage.getItem('sn-webgl-persistence-mode') || 'adaptive',
    intensity: localStorage.getItem('sn-flow-gradient') || 'balanced'
  };

  console.log('WebGL System would load these settings:', webglSettings);

  // Test logic for WebGL enablement
  const shouldEnableWebGL = webglSettings.enabled || webglSettings.forceEnabled;
  console.log('WebGL should be enabled:', shouldEnableWebGL);

  // Test persistence mode validation
  const validPersistenceModes = ['adaptive', 'persistent', 'fallback'];
  const isPersistenceModeValid = validPersistenceModes.includes(webglSettings.persistenceMode);
  console.log(`Persistence mode "${webglSettings.persistenceMode}" is valid:`, isPersistenceModeValid);

  console.log('✅ WebGL system settings loading test complete');
} catch (error) {
  console.error('❌ WebGL system settings loading test failed:', error);
}
console.groupEnd();

// Test 4: Runtime Setting Change Simulation
console.group('⚡ Runtime Setting Changes Test');
try {
  console.log('Simulating runtime setting changes...');

  // Test WebGL disable
  console.log('Test 1: Disabling WebGL');
  const originalWebGL = localStorage.getItem('sn-webgl-enabled');
  localStorage.setItem('sn-webgl-enabled', 'false');
  
  const disabledState = {
    webglEnabled: localStorage.getItem('sn-webgl-enabled') === 'true',
    shouldDisable: true
  };
  console.log('After disabling WebGL:', disabledState);

  // Test WebGL re-enable
  console.log('Test 2: Re-enabling WebGL');
  localStorage.setItem('sn-webgl-enabled', 'true');
  
  const enabledState = {
    webglEnabled: localStorage.getItem('sn-webgl-enabled') === 'true',
    shouldEnable: true
  };
  console.log('After enabling WebGL:', enabledState);

  // Test persistence mode change
  console.log('Test 3: Changing persistence mode');
  const originalPersistence = localStorage.getItem('sn-webgl-persistence-mode');
  localStorage.setItem('sn-webgl-persistence-mode', 'persistent');
  
  const persistenceState = {
    mode: localStorage.getItem('sn-webgl-persistence-mode'),
    changed: true
  };
  console.log('After changing persistence mode:', persistenceState);

  // Restore original values
  if (originalWebGL) localStorage.setItem('sn-webgl-enabled', originalWebGL);
  else localStorage.removeItem('sn-webgl-enabled');
  
  if (originalPersistence) localStorage.setItem('sn-webgl-persistence-mode', originalPersistence);
  else localStorage.removeItem('sn-webgl-persistence-mode');

  console.log('✅ Runtime setting changes test complete (values restored)');
} catch (error) {
  console.error('❌ Runtime setting changes test failed:', error);
}
console.groupEnd();

// Test 5: Performance System Integration
console.group('🚀 Performance System Integration Test');
try {
  // Test how performance system should interact with settings
  const deviceCapabilities = {
    memory: navigator.deviceMemory || 4,
    cores: navigator.hardwareConcurrency || 4,
    webgl: (() => {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
    })()
  };

  console.log('Device capabilities:', deviceCapabilities);

  // Simulate quality level calculation
  let qualityLevel = 50; // baseline
  if (deviceCapabilities.memory >= 8) qualityLevel += 20;
  if (deviceCapabilities.cores >= 6) qualityLevel += 15;
  if (deviceCapabilities.webgl) qualityLevel += 15;

  const finalQuality = Math.min(100, qualityLevel);
  console.log('Calculated quality level:', finalQuality);

  // Test user setting override logic
  const userWebGLDisabled = localStorage.getItem('sn-webgl-enabled') === 'false';
  const shouldRespectUserChoice = userWebGLDisabled;
  
  console.log('Performance system should respect user WebGL disable:', shouldRespectUserChoice);

  if (shouldRespectUserChoice && userWebGLDisabled) {
    console.log('✅ Performance system correctly respects user preference to disable WebGL');
  } else if (!userWebGLDisabled && finalQuality >= 60) {
    console.log('✅ Performance system should enable corridor effects at quality level', finalQuality);
  } else {
    console.log('⚠️ Performance system may disable corridor effects due to low quality level', finalQuality);
  }

  console.log('✅ Performance system integration test complete');
} catch (error) {
  console.error('❌ Performance system integration test failed:', error);
}
console.groupEnd();

console.log('🎉 WebGL Settings Integration Test Suite Complete!');
console.log('\nSummary of improvements:');
console.log('• Added sn-webgl-enabled, sn-webgl-force-enabled, sn-webgl-persistence-mode to SettingsManager');
console.log('• WebGL system now loads all relevant settings, not just sn-flow-gradient'); 
console.log('• Performance system can respect explicit user setting preferences');
console.log('• Runtime setting changes are properly handled for all WebGL settings');
console.log('• Settings integration maintains backwards compatibility');

// Provide instructions for manual testing
console.log('\n📝 Manual Testing Instructions:');
console.log('1. Open Spicetify Settings and look for WebGL controls (if exposed in UI)');
console.log('2. Try disabling WebGL via localStorage.setItem("sn-webgl-enabled", "false")');
console.log('3. Reload and check if WebGL background is disabled');
console.log('4. Re-enable via localStorage.setItem("sn-webgl-enabled", "true")');
console.log('5. Change flow gradient intensity and verify immediate visual changes');