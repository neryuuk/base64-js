Pure base64 in Javascript
===

Pure implementation of the base64 algorithm in Javascript

This project was inspired by this video ([Writing the `base64` algorithm FROM SCRATCH using nothing but bash](https://youtu.be/yICvuBin6Mg)) and this repo
([github:bahamas10/bash-base64](https://github.com/bahamas10/bash-base64))

Installing
---

```bash
$ pnpm add github:neryuuk/base64-js
```

Usage
---

```javascript
import { decodeBase64, encodeBase64 } from 'base64-js';

// encode
encodeBase64('string');

// decode
decodeBase64('base64');
```

License
---

GNU AFFERO GENERAL PUBLIC LICENSE
