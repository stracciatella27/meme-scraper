import fs from 'node:fs';
import stream from 'node:stream';
import { promisify } from 'node:util';
import axios from 'axios';

/**
 * Sends a request to a given URL and returns the response
 * @example let response = await httpRequest('http://www.google.at/');
 * @param {string} URL
 * @returns A Promise with a 'resolve' of the response
 */
export function httpRequest(URL) {
  return axios
    .get(URL)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      console.error(error);
    });
}

/**
 * Filters links inside of img tags out of a given array of HTML tags and returns them as an array
 * @param {string[]} htmlLines
 * @returns {string[]} img links
 */
export function imageLinks(htmlLines) {
  const _imageLinks = [];
  let boolean = false;
  let link = '';

  htmlLines.forEach((element) => {
    if (element.includes(`src="https://api.memegen.link/images/`)) {
      for (const char of element.split('')) {
        if (boolean) {
          link += char;
        }
        if (char === `"`) {
          boolean = !boolean;
        }
      }

      _imageLinks.push(link.slice(0, -1));
      link = '';
    }
  });

  return _imageLinks;
}

// prerequisite
const finished = promisify(stream.finished);
/**
 * stackoverflow copypasta, downloads a file to a given directory
 * @credit https://stackoverflow.com/users/737457/csotiriou
 * @param {string} fileUrl
 * @param {string} outputLocationPath
 */
export function downloadFile(fileUrl, outputLocationPath) {
  const writer = fs.createWriteStream(outputLocationPath);
  return axios({
    method: 'get',
    url: fileUrl,
    responseType: 'stream',
  }).then((response) => {
    response.data.pipe(writer);
    return finished(writer); // this is a Promise
  });
}
