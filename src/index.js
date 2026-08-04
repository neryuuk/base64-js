const BASE64_DICT = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/`;
const URI_SAFE_DICT = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`;

function decodeBase64old(payload, safe) {
  const DICT = safe ? URI_SAFE_DICT : BASE64_DICT;
  let block = '';
  let decoded = '';

  for (let i = 0; i < payload.length; i++) {
    const char = payload[i];
    if (!safe && char === '=') continue;

    block += DICT.indexOf(char).toString(2).padStart(6, '0');
    if (block.length < 24) continue;

    const match = block.match(/.{8}/g);
    decoded +=
      String.fromCharCode(parseInt(match[0], 2)) +
      String.fromCharCode(parseInt(match[1], 2)) +
      String.fromCharCode(parseInt(match[2], 2));
    block = '';
  }

  if (block.length) {
    const match = block.match(/.{1,8}/g);
    let parsed = parseInt(match[0]?.padStart(8, '0'), 2);
    if (parsed) {
      decoded += String.fromCharCode(parsed);
    }
    parsed = parseInt(match[1]?.padStart(8, '0'), 2);
    if (parsed) {
      decoded += String.fromCharCode(parsed);
    }
    parsed = parseInt(match[2]?.padStart(8, '0'), 2);
    if (parsed) {
      decoded += String.fromCharCode(parsed);
    }
  }

  return decoded;
}

function decodeBase64(payload, safe) {
  function parse24bits(bytes) {
    return (
      ((bytes[0] ?? 0) << (6 * 3)) +
      ((bytes[1] ?? 0) << (6 * 2)) +
      ((bytes[2] ?? 0) << (6 * 1)) +
      ((bytes[3] ?? 0) << (6 * 0))
    );
  }

  function bitSplit(bits, offset) {
    return (bits >> (8 * offset)) & 0b11111111;
  }

  const DICT = safe ? URI_SAFE_DICT : BASE64_DICT;
  const block = [];
  let buff = Buffer.from(payload);
  let decoded = '';

  for (let i = 0; i < buff.length; i++) {
    if (!safe && buff[i] === 61) continue;

    block.push(DICT.indexOf(String.fromCodePoint(buff[i])));
    if (block.length < 4) continue;

    const bits = parse24bits(block);
    decoded +=
      String.fromCodePoint(bitSplit(bits, 2)) +
      String.fromCodePoint(bitSplit(bits, 1)) +
      String.fromCodePoint(bitSplit(bits, 0));
    block.length = 0;
  }

  if (block.length) {
    const bits = parse24bits(block);
    decoded += String.fromCodePoint(bitSplit(bits, 2));
    if (block.length > 2) decoded += String.fromCodePoint(bitSplit(bits, 1));
    if (block.length > 3) decoded += String.fromCodePoint(bitSplit(bits, 0));
  }

  return decoded;
}

function encodeBase64(
  payload,
  { encoding, safe } = { encoding: 'utf8', safe: false },
) {
  function parse24bits(bytes) {
    return (
      ((bytes[0] ?? 0) << (8 * 2)) +
      ((bytes[1] ?? 0) << (8 * 1)) +
      ((bytes[2] ?? 0) << (8 * 0))
    );
  }

  function bitSplit(bits, offset) {
    return (bits >> (6 * offset)) & 0b111111;
  }

  const DICT = safe ? URI_SAFE_DICT : BASE64_DICT;
  const block = [];
  let buff = Buffer.from(payload, encoding);
  let encoded = '';

  for (let i = 0; i < buff.length; i++) {
    block.push(buff[i]);
    if (block.length < 3) continue;

    const bits = parse24bits(block);
    encoded +=
      DICT[bitSplit(bits, 3)] +
      DICT[bitSplit(bits, 2)] +
      DICT[bitSplit(bits, 1)] +
      DICT[bitSplit(bits, 0)];
    block.length = 0;
  }

  if (block.length) {
    const bits = parse24bits(block);
    let drain = DICT[bitSplit(bits, 3)] + DICT[bitSplit(bits, 2)];

    if (block.length > 1) drain += DICT[bitSplit(bits, 1)];
    if (block.length > 2) drain += DICT[bitSplit(bits, 0)];

    encoded += safe ? drain : drain.padEnd(4, '=');
  }

  return encoded;
}

export { decodeBase64, decodeBase64old, encodeBase64 };
