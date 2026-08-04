const BASE64_DICT = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/`;
const URI_SAFE_DICT = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_`;

function parse24bits(bytes, bits = 8) {
  if (bits === 8) {
    return (
      ((bytes[0] ?? 0) << (bits * 2)) +
      ((bytes[1] ?? 0) << (bits * 1)) +
      ((bytes[2] ?? 0) << (bits * 0))
    );
  }
  if (bits === 6) {
    return (
      ((bytes[0] ?? 0) << (bits * 3)) +
      ((bytes[1] ?? 0) << (bits * 2)) +
      ((bytes[2] ?? 0) << (bits * 1)) +
      ((bytes[3] ?? 0) << (bits * 0))
    );
  }
}

function bitSplit(bits, count, offset) {
  return bits >> (count * offset);
}

function and8bit(bits, offset) {
  return bitSplit(bits, 8, offset) & 0b11111111;
}

function and6bit(bits, offset) {
  return bitSplit(bits, 6, offset) & 0b111111;
}

function decodeBase64(payload, safe) {
  const DICT = safe ? URI_SAFE_DICT : BASE64_DICT;
  let block = '';
  let decoded = '';

  for (let i = 0; i < payload.length; i++) {
    const char = payload[i];
    if (!safe && char === '=') continue;

    block += DICT.indexOf(char).toString(2).padStart(6, '0');
    if (block.length < 24) continue;

    const match = block.match(/.{8}/g);
    decoded += String.fromCharCode(parseInt(match[0], 2));
    decoded += String.fromCharCode(parseInt(match[1], 2));
    decoded += String.fromCharCode(parseInt(match[2], 2));
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

function decodeBase64bitwise(payload, safe) {
  const DICT = safe ? URI_SAFE_DICT : BASE64_DICT;
  const block = [];
  let buff = Buffer.from(payload);
  let decoded = '';

  for (let i = 0; i < buff.length; i++) {
    if (!safe && String.fromCharCode(buff[i]) === '=') continue;

    block.push(DICT.indexOf(buff[i]));
    if (block.length < 4) continue;

    const bits = parse24bits(block, 6);
    decoded += String.fromCharCode(and8bit(bits, 2));
    decoded += String.fromCharCode(and8bit(bits, 1));
    decoded += String.fromCharCode(and8bit(bits, 0));
    block.pop();
    block.pop();
    block.pop();
    block.pop();
  }

  if (block.length) {
    const bits = parse24bits(block, 6);
    decoded += String.fromCharCode(and8bit(bits, 2));
    decoded += String.fromCharCode(and8bit(bits, 1));
    decoded += String.fromCharCode(and8bit(bits, 0));
  }

  return decoded;
}

function encodeBase64(payload, safe = false) {
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
  let buff = Buffer.from(payload);
  let encoded = '';

  for (let i = 0; i < buff.length; i++) {
    block.push(buff[i]);
    if (block.length < 3) continue;

    const bits = parse24bits(block);
    encoded += DICT[bitSplit(bits, 3)];
    encoded += DICT[bitSplit(bits, 2)];
    encoded += DICT[bitSplit(bits, 1)];
    encoded += DICT[bitSplit(bits, 0)];
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

export { decodeBase64, decodeBase64bitwise, encodeBase64 };
