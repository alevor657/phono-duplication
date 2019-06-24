'use strict';

import { readdirSync } from 'fs';
import { IN_DIR_PATH } from './constants.mjs';
import { cpus } from 'os';
import { fork } from 'child_process';

const numCpus = cpus().length;
let processes = 0;

function main() {
    let fileNames = readdirSync(IN_DIR_PATH);

    // 443
    fileNames = fileNames.slice(150, 295);

    const interval = setInterval(() => {
        if (fileNames.length > 0) {
            run(fileNames);
        } else {
            clearInterval(interval)
        }
    }, 500);
}

function run(fileNames) {
    if (processes < numCpus) {
        let cp = fork('./process.mjs', [fileNames.shift()]);
        processes ++;

        cp.on('error', err => {
            console.error('Process errored', err);
            process.exit(2);
        });

        cp.on('close', code => {
            console.log('Forked process closed with code: ' + code);
            
            processes --;
        });

        console.log('Active processes: ' + processes);
    }
}

main();
  