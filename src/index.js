const DICT = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/`;

function parse24bits(bytes) {
  return (
    ((bytes[0] ?? 0) << (8 * 2)) +
    ((bytes[1] ?? 0) << (8 * 1)) +
    ((bytes[2] ?? 0) << (8 * 0))
  );
}

function bitSplit(bits, count, offset) {
  return (bits >> (count * offset)) & 0b111111;
}

function decodeBase64(payload) {
  let block = '';
  let decoded = '';

  for (let i = 0; i < payload.length; i++) {
    const char = payload[i];
    if (char === '=') continue;

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

function encodeBase64(payload) {
  const block = [];
  let buff = Buffer.from(payload);
  let encoded = '';

  for (let i = 0; i < buff.length; i++) {
    block.push(buff[i]);
    if (block.length < 3) continue;
    const bits = parse24bits(block);
    encoded += DICT[bitSplit(bits, 6, 3)];
    encoded += DICT[bitSplit(bits, 6, 2)];
    encoded += DICT[bitSplit(bits, 6, 1)];
    encoded += DICT[bitSplit(bits, 6, 0)];
    block.pop();
    block.pop();
    block.pop();
  }

  if (block.length) {
    let drain = '';
    const bits = parse24bits(block);

    if (block.length) {
      drain += DICT[bitSplit(bits, 6, 3)] + DICT[bitSplit(bits, 6, 2)];
    }
    if (block.length > 1) drain += DICT[bitSplit(bits, 6, 1)];
    if (block.length > 2) drain += DICT[bitSplit(bits, 6, 0)];

    encoded += drain.padEnd(4, '=');
  }

  return encoded;
}

export { decodeBase64, encodeBase64 };
