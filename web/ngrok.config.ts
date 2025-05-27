import * as fs from 'node:fs';
import * as path from 'node:path';
import YAML from 'yaml'

export const ngrokConfig = YAML.parse(
  fs.readFileSync(
    path.resolve('/home/d.romashov/snap/ngrok/265/.config/ngrok/ngrok.yml'),
    'utf-8'
  )
);