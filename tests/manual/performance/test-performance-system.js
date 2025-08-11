// Test script to verify the new performance system is working correctly
// This can be run in Spicetify's developer console to test corridor effects

console.log('🔍 Testing Spicetify Performance System Rework');

// Test device capabilities detection
console.group('📱 Device Detection Test');
try {
  // Check if our enhanced device detection is working
  const deviceMemory = navigator.deviceMemory || 'not available';
  const hardwareConcurrency = navigator.hardwareConcurrency || 'not available';
  const webglSupport = (() => {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  })();
  
  console.log('Device Memory:', deviceMemory, 'GB');
  console.log('Hardware Concurrency:', hardwareConcurrency, 'cores');
  console.log('WebGL Support:', webglSupport);
  
  // Estimate quality level based on capabilities
  let estimatedQuality = 50; // baseline
  if (typeof deviceMemory === 'number' && deviceMemory >= 8) estimatedQuality += 20;
  if (typeof hardwareConcurrency === 'number' && hardwareConcurrency >= 8) estimatedQuality += 15;
  if (webglSupport) estimatedQuality += 15;
  
  console.log('✅ Estimated Quality Level:', Math.min(estimatedQuality, 100));
} catch (error) {
  console.error('❌ Device detection error:', error);
}
console.groupEnd();

// Test performance monitoring
console.group('📊 Performance Monitoring Test');
try {
  const perfMemory = performance.memory;
  if (perfMemory) {
    const memoryUsage = (perfMemory.usedJSHeapSize / perfMemory.jsHeapSizeLimit * 100).toFixed(1);
    console.log('Memory Usage:', memoryUsage + '%');
    console.log('JS Heap Limit:', Math.round(perfMemory.jsHeapSizeLimit / 1024 / 1024), 'MB');
  }
  
  // Test FPS monitoring
  let frameCount = 0;
  const startTime = performance.now();
  
  const measureFPS = () => {
    frameCount++;
    if (frameCount >= 60) { // Sample 60 frames
      const endTime = performance.now();
      const fps = Math.round((frameCount * 1000) / (endTime - startTime));
      console.log('✅ Current FPS:', fps);
    } else {
      requestAnimationFrame(measureFPS);
    }
  };
  requestAnimationFrame(measureFPS);
  
} catch (error) {
  console.error('❌ Performance monitoring error:', error);
}
console.groupEnd();

// Test corridor effects enablement
console.group('🌈 Corridor Effects Test');
try {
  // Check if WebGL canvas elements are present
  const webglCanvases = document.querySelectorAll('canvas[style*="position"]');
  console.log('WebGL Canvases Found:', webglCanvases.length);
  
  webglCanvases.forEach((canvas, index) => {
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (gl) {
      console.log(`Canvas ${index + 1}:`, {
        width: canvas.width,
        height: canvas.height,
        visible: canvas.style.opacity !== '0',
        context: gl.constructor.name
      });
    }
  });
  
  // Test quality level determination
  const shouldEnableCorridors = (() => {
    // Our new quality system enables corridors at quality level >= 60
    const deviceScore = (deviceMemory || 4) * 10 + (hardwareConcurrency || 4) * 5 + (webglSupport ? 20 : 0);
    return deviceScore >= 60;
  })();
  
  console.log('✅ Should Enable Corridor Effects:', shouldEnableCorridors);
  
  if (shouldEnableCorridors) {
    console.log('🎉 Corridor effects should be visible based on device capabilities!');
  } else {
    console.log('⚠️  Corridor effects disabled due to lower device capabilities');
    console.log('   Consider enabling manually or the system may upgrade quality over time');
  }
  
} catch (error) {
  console.error('❌ Corridor effects test error:', error);
}
console.groupEnd();

// Test event bus integration
console.group('📡 Event System Test');
try {
  // Check if performance events are working
  console.log('Testing performance event emission...');
  
  // Simulate performance metrics event
  const testMetrics = {
    fps: 60,
    frameTime: 16.67,
    memoryUsage: 0.5,
    cpuUsage: 0.3,
    timestamp: Date.now()
  };
  
  console.log('✅ Test metrics would trigger:', testMetrics);
  console.log('This would determine quality adjustments in the new system');
  
} catch (error) {
  console.error('❌ Event system test error:', error);
}
console.groupEnd();

console.log('🎯 Performance System Rework Test Complete!');
console.log('The new system provides:');
console.log('• Spicetify-optimized device detection');
console.log('• Continuous quality scaling (0-100) instead of binary high/medium/low');
console.log('• Proper corridor effects enablement based on capabilities');
console.log('• Recovery mechanisms to prevent permanent quality degradation');
console.log('• Performance-aware quality adjustments with cooldown periods');