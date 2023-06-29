/**
 * Generates a random string of the given length and character set.
 * @param {number} length - The length of the string to generate.
 * @param {string} chars - A string containing the characters to include in the random string.
 * @returns {Promise<string>} A promise that resolves to the generated random string.
 */
const randomString = async (length, chars)=>{
  let mask = '';
  if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
  if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (chars.indexOf('#') > -1) mask += '0123456789';
  if (chars.indexOf('!') > -1) mask += '~!@#$%&*';
  let result = '';
  for (let i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
  return result;
}