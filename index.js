var DIVISORS = {
  bps: 0.125,
  kbps: 125,
  mbps: 125000,
  Bps: 1,
  KBps: 1000, 
  MBps: 1000000
}

exports.bitrate = function(bytes, seconds, format) {
  if (format === undefined || format === null) format = 'kbps'
  if (typeof format !== 'string') throw new TypeError("Expected 'format' to be a string")
  format = format.replace('/', 'p')

  var divisor = DIVISORS[format]
  if (!divisor) throw new Error("'format' is an invalid string")
  return bytes / seconds / divisor
}

exports.formattedBitrate = function (bytes, seconds, fpAccuracy, undefinedFormatStr) {
  if (fpAccuracy === undefined || fpAccuracy === null) fpAccuracy = 2

  // Default to 'n/a' for undefined return value
  if (undefinedFormatStr === undefined || undefinedFormatStr === null) undefinedFormatStr = 'n/a'
  let bitSuffixes = ['bps', 'Kb/s', 'Mb/s', 'Gb/s', 'Tb/s', 'Pb/s', 'Eb/s', 'Zb/s', 'Yb/s']
  let bps = bytes / seconds / 0.125
  let computedRate = _formatRate(bps, bitSuffixes, fpAccuracy)
  
  // if the computed and formatted rate doesn't have a value, 
  // return the default
  // else return the formatted value
  let formattedRate = (computedRate === undefined || computedRate === null) ? undefinedFormatStr : computedRate
  // console.log(formattedRate)  // useful for testing
  return formattedRate
}



/**
 * Iterates over powers of 1000 and bitSuffixes array to determine which 
 * suffix (ie: bps, kbps, mbps, etc) the input value lies between.  
 * The matching for loop index matches the bitSuffix[] index and we have the
 * proper suffix.  We then divide by the power of 1000 to reduce the input number
 * to the proper smaller number (that is, we convert 1,000,000 bytes to 1000KB or 1MB) 
 * We then round off to the passed in rounding accuracy and create a string with
 * the final value and suffix
 *     
 * @param   {Number}  bytes       Number of bytes.  Must be bytes, not kilobytes, 
 * bits or anything else
 * @param   {Array}  suffixes     Array of suffixes we use to create our string.  
 * Could be a global but I made it a param to avoid state
 * @param   {Number}  fpAccuracy  Floating point accuracy. Number of decimal places
 * to be accurate to
 *
 * @return  {string}              Formatted string in format: 251.13 kbps
 */
function _formatRate (bytes, suffixes, fpAccuracy) {
  // Shamelessly stolen from Numeral.js
  // https://github.com/adamwdraper/Numeral-js/blob/5ad6b2d56b30147e885f9eb55fc1c089603e7f10/numeral.js#L349
  for (var power = 0; power <= suffixes.length; power++) {
    let min = Math.pow(1000, power)
    let max = Math.pow(1000, power + 1)
    if (bytes >= min && bytes < max) {
      let myformat = suffixes[power]
      if (min > 0) {
        let reducedValue = bytes / min
        let roundedValue = Number(Math.round(reducedValue + 'e2') + 'e-2').toFixed(fpAccuracy)
        let formattedStr = roundedValue + ' ' + myformat
        return formattedStr
      }
      break
    }
  }
}
