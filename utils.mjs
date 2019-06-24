import { dirname, resolve } from 'path';
import piexif from 'piexifjs';
import moment from 'moment';

export const scriptDir = () => resolve(dirname(''));

export const getFileNameByDate = momentDate => momentDate.clone().format('YYYYMMDD_HHmmss.jpg');

export const getExifDataByDate = momentDate => momentDate.clone().format('YYYY:MM:DD HH:mm:ss');

export const getRandomizedDate = () => moment()
    .set('date', getRandomIntInRange(19, 23))
    .set('hour', getRandomIntInRange(9, 21))
    .set('minute', getRandomIntInRange(0, 60))
    .set('second', getRandomIntInRange(0, 60))
    .set('millisecond', getRandomIntInRange(0, 1000))
    .clone();

function getRandomIntInRange(min, max) { 
    return Math.floor(Math.random() * (max - min)) + min;
}

export const getRandomInRange = (min, max) => Math.random() * (max - min) + min;

export function deleteThumbnailFromExif(imageBuffer) {
    const imageString = imageBuffer.toString('binary')
    const exifObj = piexif.load(imageString)
    delete exifObj.thumbnail
    delete exifObj['1st']
    const exifBytes = piexif.dump(exifObj)
    const newImageString = piexif.insert(exifBytes, imageString)
    return Buffer.from(newImageString, 'binary')
  }