import { decodeBase64, encodeBase64 } from '#app';

function nativeEncode(data, safe) {
  return Buffer.from(data).toString(safe ? 'base64url' : 'base64');
}

function nativeDecode(data, safe) {
  const encoded = Buffer.from(data).toString(safe ? 'base64url' : 'base64');
  return Buffer.from(encoded, safe ? 'base64url' : 'base64').toString();
}

describe('encodeBase64', () => {
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

  it(`should encode '§498¨&*7q[{{ª+-_*&VFC%B*(N8765EV7*B\\|/?°='`, () => {
    const testString = '§498¨&*7q[{{ª+-_*&VFC%B*(N8765EV7*B\\|/?°=';
    expect(encodeBase64(testString)).toBe(nativeEncode(testString));
  });

  it(`should url-safe encode '§498¨&*7q[{{ª+-_*&VFC%B*(N8765EV7*B\\|/?°='`, () => {
    const testString = '§498¨&*7q[{{ª+-_*&VFC%B*(N8765EV7*B\\|/?°=';
    expect(encodeBase64(testString, true)).toBe(nativeEncode(testString, true));
  });
});

describe('decodeBase64', () => {
  it(`should decode 'abcde'`, () => {
    const testString = 'abcde';
    expect(decodeBase64(nativeEncode(testString))).toBe(
      nativeDecode(testString),
    );
  });

  it(`should decode 'abcdef'`, () => {
    const testString = 'abcdef';
    expect(decodeBase64(nativeEncode(testString))).toBe(
      nativeDecode(testString),
    );
  });

  it(`should decode 'abcdef\\n'`, () => {
    const testString = 'abcdef\n';
    expect(decodeBase64(nativeEncode(testString))).toBe(
      nativeDecode(testString),
    );
  });

  // it(`should decode '§498¨&*7q[{{ª+-_*&VFC%B*(N8765EV7*B\\|/?°='`, () => {
  //   const testString = '§498¨&*7q[{{ª+-_*&VFC%B*(N8765EV7*B\\|/?°=';
  //   expect(decodeBase64(nativeEncode(testString))).toBe(
  //     nativeDecode(testString),
  //   );
  // });

  // it(`should url-safe decode '§498¨&*7q[{{ª+-_*&VFC%B*(N8765EV7*B\\|/?°='`, () => {
  //   const testString = '§498¨&*7q[{{ª+-_*&VFC%B*(N8765EV7*B\\|/?°=';
  //   expect(decodeBase64(nativeEncode(testString, true))).toBe(
  //     nativeDecode(testString, true),
  //   );
  // });
});
