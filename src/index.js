const DICT = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/`;

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
  let uint = Array.from(new TextEncoder().encode(payload));
  let block = '';
  let encoded = '';

  for (let i = 0; i < uint.length; i++) {
    const byte = uint[i];
    block += byte.toString(2).padStart(8, '0');
    if (block.length < 24) continue;
    const match = block.match(/.{6}/g);
    encoded += DICT[parseInt(match[0], 2)];
    encoded += DICT[parseInt(match[1], 2)];
    encoded += DICT[parseInt(match[2], 2)];
    encoded += DICT[parseInt(match[3], 2)];
    block = '';
  }

  if (block.length) {
    let drain = '';
    const match = block.match(/.{1,6}/g);
    if (match[0]) drain += DICT[parseInt(match[0].padEnd(6, '0'), 2)];
    if (match[1]) drain += DICT[parseInt(match[1].padEnd(6, '0'), 2)];
    if (match[2]) drain += DICT[parseInt(match[2].padEnd(6, '0'), 2)];
    if (match[3]) drain += DICT[parseInt(match[3].padEnd(6, '0'), 2)];
    encoded += drain.padEnd(4, '=');
  }

  return encoded;
}

export { decodeBase64, encodeBase64 };
