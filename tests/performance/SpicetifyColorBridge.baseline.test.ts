import { SpicetifyColorBridge } from '@/utils/spicetify/SpicetifyColorBridge';

const createCssWriterStub = () => ({
  initialize: jest.fn().mockResolvedValue(undefined),
  destroy: jest.fn(),
  queueBatchUpdate: jest.fn(),
  batchSetVariables: jest.fn(),
  flushUpdates: jest.fn(),
  updateAnimation: jest.fn(),
  healthCheck: jest.fn().mockResolvedValue({ healthy: true }),
});

describe('SpicetifyColorBridge baseline', () => {
  let bridge: SpicetifyColorBridge;
  let cssWriter: ReturnType<typeof createCssWriterStub>;

  beforeEach(() => {
    cssWriter = createCssWriterStub();
    bridge = new SpicetifyColorBridge({ enableDebug: false, cacheDuration: 0 });
  });

  afterEach(() => {
    bridge.destroy();
  });

  it('initializes with the provided CSS controller and applies fallback colors', async () => {
    await bridge.initialize(cssWriter as any);

    bridge.updateWithAlbumColors({
      OKLAB_PRIMARY: '#c6a0f6',
      OKLAB_ACCENT: '#8aadf4',
    } as any);

    const batchCalls = (cssWriter.batchSetVariables as jest.Mock).mock
      .calls;

    const fallbackCall = batchCalls.find((call) => call[3] === 'fallback-colors');
    expect(fallbackCall).toBeDefined();

    const albumUpdateCall = batchCalls.find(
      (call) => call[3] === 'album-color-update-optimized'
    );
    expect(albumUpdateCall).toBeDefined();
  });

  it('ignores updates when not initialized', () => {
    expect(() =>
      bridge.updateWithAlbumColors({ OKLAB_PRIMARY: '#c6a0f6' } as any)
    ).not.toThrow();
  });

  it('can be destroyed multiple times safely', () => {
    bridge.destroy();
    expect(() => bridge.destroy()).not.toThrow();
  });
});
