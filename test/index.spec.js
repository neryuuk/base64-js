import { decodeBase64, encodeBase64 } from '#app';

function nativeEncode(data) {
  return Buffer.from(data).toString('base64');
}

function nativeDecode(data) {
  const encoded = Buffer.from(data).toString('base64');
  return Buffer.from(encoded, 'base64').toString();
}

describe('encodeBase64', () => {
  it(`should encode 'abc'`, () => {
    const testString = 'abc';
    expect(encodeBase64(testString)).toBe(nativeEncode(testString));
  });

  it(`should encode 'abcd'`, () => {
    const testString = 'abcd';
    expect(encodeBase64(testString)).toBe(nativeEncode(testString));
  });

  it(`should encode 'abcde'`, () => {
    const testString = 'abcde';
    expect(encodeBase64(testString)).toBe(nativeEncode(testString));
  });

  it(`should encode 'abcdef'`, () => {
    const testString = 'abcdef';
    expect(encodeBase64(testString)).toBe(nativeEncode(testString));
  });

  it(`should encode 'abcdef\\n'`, () => {
    const testString = 'abcdef\n';
    expect(encodeBase64(testString)).toBe(nativeEncode(testString));
  });
});

describe('decodeBase64', () => {
  it(`should encode 'abc'`, () => {
    const testString = 'abc';
    expect(decodeBase64(nativeEncode(testString))).toBe(
      nativeDecode(testString),
    );
  });

  it(`should encode 'abcd'`, () => {
    const testString = 'abcd';
    expect(decodeBase64(nativeEncode(testString))).toBe(
      nativeDecode(testString),
    );
  });

  it(`should encode 'abcde'`, () => {
    const testString = 'abcde';
    expect(decodeBase64(nativeEncode(testString))).toBe(
      nativeDecode(testString),
    );
  });

  it(`should encode 'abcdef'`, () => {
    const testString = 'abcdef';
    expect(decodeBase64(nativeEncode(testString))).toBe(
      nativeDecode(testString),
    );
  });

  it(`should encode 'abcdef\\n'`, () => {
    const testString = 'abcdef\n';
    expect(decodeBase64(nativeEncode(testString))).toBe(
      nativeDecode(testString),
    );
  });
});
