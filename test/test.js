var test = require('tape')
var bitrate = require('../index.js').bitrate
var formattedBitrate = require('../index').formattedBitrate

test('autoformatting functionality', function (t) {
  // Verified using https://www.dslreports.com/calculator
  t.equal(formattedBitrate(126, 12.1, 0), '83 bps')
  t.equal(formattedBitrate(71471001, 0.73, 1), '783.2 Mb/s')
  t.equal(formattedBitrate(71471001, 0.73, 2), '783.24 Mb/s')
  t.equal(formattedBitrate(1813, 1.03, 2), '14.08 Kb/s')
  t.equal(formattedBitrate(769, 4.73, 4), '1.3000 Kb/s')
  t.equal(formattedBitrate(10246228711, 0.87, 3), '94.220 Gb/s')
  t.equal(formattedBitrate(10246228711, 0.87, 0), '94 Gb/s')
  t.equal(formattedBitrate(86135861356711, 0.37, 5), '1.86000 Pb/s')
  t.equal(formattedBitrate(1000813716663818711, 0.87, 1), '9.2 Eb/s')
  t.equal(formattedBitrate(0, 69, 2, 'N|A'), 'N|A')
  t.equal(formattedBitrate(0, 69), 'n/a') // test default params
  t.end()
})

test('basic functionality', function (t) {
	t.equal(bitrate(6000000, 150, 'bps'), 320000)
	t.equal(bitrate(6000000, 150, 'Bps'), 40000)
	t.equal(bitrate(6000000, 150, 'kbps'), 320)
	t.equal(bitrate(6000000, 150, 'KBps'), 40)
	t.equal(bitrate(6000000, 150, 'mbps'), 0.32)
	t.equal(bitrate(6000000, 150, 'MBps'), 0.04)
	t.end()
})

test('defaults to Kbps', function (t) {
	t.equal(bitrate(6000000, 150), 320)
	t.equal(bitrate(6000000, 150, null), 320)
	t.equal(bitrate(6000000, 150, undefined), 320)
	t.end()
})

test('allows kb/s style format also', function (t) {
	t.equal(bitrate(6000000, 150, 'b/s'), 320000)
	t.equal(bitrate(6000000, 150, 'B/s'), 40000)
	t.equal(bitrate(6000000, 150, 'kb/s'), 320)
	t.equal(bitrate(6000000, 150, 'KB/s'), 40)
	t.equal(bitrate(6000000, 150, 'mb/s'), 0.32)
	t.equal(bitrate(6000000, 150, 'MB/s'), 0.04)
	t.end()
})

test('only allows null, undefined, or a valid string as the format argument', function (t) {
	t.doesNotThrow(function () { bitrate(6000000, 150, null) }, 'allows null')
	t.doesNotThrow(function () { bitrate(6000000, 150, undefined) }, 'allows undefined')
	t.throws(function () { bitrate(6000000, 150, 'lolwut') }, 'does not allow an invalid string')
	t.throws(function () { bitrate(6000000, 150, 123) }, 'does not allow a positive number')
	t.throws(function () { bitrate(6000000, 150, 0) }, 'does not allow a 0')
	t.throws(function () { bitrate(6000000, 150, false) }, 'does not allow false')
	t.throws(function () { bitrate(6000000, 150, {}) }, 'does not allow an object')
	t.end()
})
