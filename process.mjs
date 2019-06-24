import jr from 'jpeg-autorotate';
import { join } from 'path';
import Jimp from 'jimp';
import { promisify } from 'util';
import { exec } from 'child_process';
import { readFile } from 'fs';

import { getFileNameByDate, getRandomizedDate, getExifDataByDate, getRandomInRange, deleteThumbnailFromExif } from './utils.mjs';
import { IN_DIR_PATH, OUT_DIR_PATH } from './constants.mjs'

const execPromise = promisify(exec);
const readFilePromise = promisify(readFile);

export default async function processPhoto(oldFilename) {
    const oldImagePath = join(IN_DIR_PATH, oldFilename);
    const newDate = getRandomizedDate();
    const formatedNewExifString = getExifDataByDate(newDate);
    const newFilename = getFileNameByDate(newDate);
    const newImagePath = join(OUT_DIR_PATH, newFilename);    

    let fileIn = deleteThumbnailFromExif(await readFilePromise(oldImagePath));
    // let fileIn = await readFilePromise(oldImagePath);
    let buffer = null;

    try {
        buffer = (await jr.rotate(fileIn, { quality: 100 })).buffer;
    } catch(e) {        
        if (e.code !== 'correct_orientation') {
            console.log('exiting');
            
            process.exit(2);
        } else {
            buffer = fileIn;
        }
    }

    const img = await Jimp.read(buffer);    
    
    img
        .quality(100)
        .brightness(getRandomInRange(-0.1, 0.1))
        .contrast(getRandomInRange(-0.1, 0.1))
        .write(newImagePath);

    const dateTimeCommand = `-FileModifyDate='${formatedNewExifString}' -FileAccessDate='${formatedNewExifString}' -FileInodeChangeDate='${formatedNewExifString}'`;
    
    // Change exif date data
    await execPromise(`exiftool ${dateTimeCommand} -overwrite_original_in_place ${newImagePath}`);
}

if (process.argv[2]) {
    processPhoto(process.argv[2])
} else {
    console.log('no argv[2]');
    
    process.exit(2);
}