/**
 * Test script to validate corridor bubble flow integration
 * Tests the coordination between GradientDirectionalFlowSystem and WebGL system
 */

console.log('=== Dungeon Corridor Tunnel Integration Test ===');

// Test 1: Check if ConsolidatedShaderLibrary has corridor functions
try {
  const shaderLib = window.CONSCIOUSNESS_SHADER_LIBRARY || {};
  console.log('✓ ConsolidatedShaderLibrary available:', !!shaderLib.CORRIDOR_FUNCTIONS);
  
  if (shaderLib.Template && shaderLib.Template.getCorridorUniformNames) {
    const corridorUniforms = shaderLib.Template.getCorridorUniformNames();
    console.log('✓ Corridor uniforms available:', corridorUniforms.length, 'uniforms');
    console.log('  - Expected uniforms:', [
      'u_corridorIntensity', 
      'u_corridorFlowStrength', 
      'u_corridorDepthEffect',
      'u_corridorBubbleScale'
    ]);
  } else {
    console.log('⚠ getCorridorUniformNames method not found');
  }
} catch (error) {
  console.log('⚠ ConsolidatedShaderLibrary test failed:', error.message);
}

// Test 2: Check if GradientDirectionalFlowSystem is working
try {
  // Look for the system in the global debug object
  const Y3K = window.Y3K || {};
  console.log('✓ Y3K Debug object available:', !!Y3K);
  
  if (Y3K.systems) {
    const flowSystem = Object.values(Y3K.systems).find(s => 
      s.constructor.name === 'GradientDirectionalFlowSystem'
    );
    
    if (flowSystem) {
      console.log('✓ GradientDirectionalFlowSystem found');
      
      // Test corridor flow methods
      if (typeof flowSystem.setCorridorFlowEnabled === 'function') {
        console.log('✓ setCorridorFlowEnabled method available');
      }
      
      if (typeof flowSystem.calculateInwardVectorForPosition === 'function') {
        console.log('✓ calculateInwardVectorForPosition method available');
        
        // Test inward vector calculation for center position
        const testVector = flowSystem.calculateInwardVectorForPosition(0.7, 0.3);
        console.log('  - Test inward vector (0.7, 0.3):', {
          inwardX: testVector.inwardX.toFixed(3),
          inwardY: testVector.inwardY.toFixed(3),
          distance: testVector.distanceFromCenter.toFixed(3),
          intensity: testVector.flowIntensity.toFixed(3)
        });
      }
      
      if (typeof flowSystem.getCorridorFlowMapping === 'function') {
        console.log('✓ getCorridorFlowMapping method available');
        const mapping = flowSystem.getCorridorFlowMapping();
        console.log('  - Corridor flow enabled:', mapping.enabled);
      }
    } else {
      console.log('⚠ GradientDirectionalFlowSystem not found in Y3K.systems');
    }
  }
} catch (error) {
  console.log('⚠ GradientDirectionalFlowSystem test failed:', error.message);
}

// Test 3: Check CSS variables for corridor flow coordination
try {
  const rootStyle = getComputedStyle(document.documentElement);
  const corridorVars = [
    '--sn-dungeon-enabled',
    '--sn-tunnel-width',
    '--sn-lighting-intensity',
    '--sn-atmospheric-haze',
    '--sn-wall-color-r',
    '--sn-wall-color-g',
    '--sn-wall-color-b',
    '--sn-light-temperature'
  ];
  
  console.log('✓ Testing CSS variable coordination:');
  corridorVars.forEach(varName => {
    const value = rootStyle.getPropertyValue(varName);
    console.log(`  - ${varName}: ${value || 'not set'}`);
  });
} catch (error) {
  console.log('⚠ CSS variables test failed:', error.message);
}

// Test 4: WebGL system corridor shader coordination
try {
  // Look for WebGL canvas element
  const canvas = document.querySelector('canvas') || document.querySelector('[data-webgl="true"]');
  if (canvas) {
    console.log('✓ WebGL canvas found');
  } else {
    console.log('⚠ WebGL canvas not found - WebGL system may not be active');
  }
} catch (error) {
  console.log('⚠ WebGL test failed:', error.message);
}

// Test 5: Validate corridor shader functions
try {
  const shaderLib = window.CONSCIOUSNESS_SHADER_LIBRARY || {};
  if (shaderLib.CORRIDOR_FUNCTIONS) {
    const corridorFunctions = shaderLib.CORRIDOR_FUNCTIONS;
    const expectedFunctions = [
      'dungeonCorridorTunnels',
      'dungeonCorridorGradientReveal',
      'calculateTunnelLighting',
      'roundedRectangleSDF',
      'perspectiveTunnelTransform'
    ];
    
    console.log('✓ Testing corridor shader functions:');
    expectedFunctions.forEach(funcName => {
      const hasFunction = corridorFunctions.includes(funcName);
      console.log(`  - ${funcName}: ${hasFunction ? '✓' : '⚠ missing'}`);
    });
  }
} catch (error) {
  console.log('⚠ Corridor shader functions test failed:', error.message);
}

console.log('=== Corridor Bubble Flow Integration Test Complete ===');

// If running in a browser with Spicetify, try to activate corridor flow
if (typeof Spicetify !== 'undefined') {
  console.log('🎵 Spicetify detected - attempting to activate corridor flow...');
  
  setTimeout(() => {
    try {
      // Dispatch test events to trigger corridor flow
      document.dispatchEvent(new CustomEvent('music-sync:beat', {
        detail: { intensity: 0.8, bpm: 120, confidence: 0.9 }
      }));
      
      document.dispatchEvent(new CustomEvent('music-sync:energy-changed', {
        detail: { energy: 0.7, valence: 0.6 }
      }));
      
      console.log('🎵 Test music events dispatched');
    } catch (error) {
      console.log('⚠ Failed to dispatch test events:', error.message);
    }
  }, 1000);
}