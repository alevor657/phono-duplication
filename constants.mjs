import { scriptDir } from './utils.mjs';
import { join } from 'path';

export const OUT_DIR_PATH = join(scriptDir(), 'result-img');
export const IN_DIR_PATH = join(scriptDir(), 'source-img');