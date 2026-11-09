import { describe, it, expect } from 'vitest';
import { parseDatabaseConfiguration } from '../../src/services/database/config';
describe('optional public database configuration', () => {
  it('runs offline without credentials', () =>
    expect(parseDatabaseConfiguration()).toBeNull());
  it('rejects partial configuration without exposing values', () =>
    expect(() => parseDatabaseConfiguration('https://example.com')).toThrow(
      'Supply a valid',
    ));
  it('rejects secret keys', () =>
    expect(() =>
      parseDatabaseConfiguration('https://example.com', 'sb_secret_example'),
    ).toThrow());
  it('rejects insecure remote endpoints', () =>
    expect(() =>
      parseDatabaseConfiguration(
        'http://example.com',
        'sb_publishable_example',
      ),
    ).toThrow());
  it('accepts public configuration', () =>
    expect(
      parseDatabaseConfiguration(
        'https://example.com',
        'sb_publishable_example',
      )?.url,
    ).toBe('https://example.com'));
});
