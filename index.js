#!/usr/bin/env node

var Canvas = require('canvas')
var crypto = require('crypto');
var fs = require('fs');
var generateName = require('project-name-generator');
var jdenticon = require('jdenticon');
var mkdirp = require('mkdirp');
var path = require('path');

jdenticon.config = {
  lightness: {
    color: [0, 1.0],
    grayscale: [0, 1],
  },
  saturation: 1.0,
};

var icons = [{
  filename: 'ios/iTunesArtwork',
  size: 512,
}, {
  filename: 'ios/iTunesArtwork@2x',
  size: 1024,
}, {
  filename: 'ios/AppIcon-60@2x',
  size: 120,
}, {
  filename: 'ios/AppIcon-60@3x',
  size: 180,
}, {
  filename: 'ios/AppIcon-76',
  size: 76,
}, {
  filename: 'ios/AppIcon-76@2x',
  size: 152,
}, {
  filename: 'ios/AppIcon-Small-40',
  size: 40,
}, {
  filename: 'ios/AppIcon-Small-40@2x',
  size: 80,
}, {
  filename: 'ios/AppIcon-Small-40@3x',
  size: 120,
}, {
  filename: 'ios/AppIcon-Small',
  size: 29,
}, {
  filename: 'ios/AppIcon-Small@2x',
  size: 58,
}, {
  filename: 'ios/AppIcon-Small@3x',
  size: 87,
}, {
  filename: 'android/mipmap-hdpi/ic_launcher',
  size: 72,
  padding: 1.5,
}, {
  filename: 'android/mipmap-mdpi/ic_launcher',
  size: 48,
  padding: 1,
}, {
  filename: 'android/mipmap-xhdpi/ic_launcher',
  size: 96,
  padding: 2,
}, {
  filename: 'android/mipmap-xxhdpi/ic_launcher',
  size: 144,
  padding: 3,
}, {
  filename: 'web/favicon',
  suffix: 'ico',
  size: 16,
}, {
  filename: 'web/favicon-16x16',
  size: 16,
}, {
  filename: 'web/favicon-32x32',
  size: 32,
}, {
  filename: 'web/android-chrome-36x36',
  size: 36,
}, {
  filename: 'web/android-chrome-48x48',
  size: 48,
}, {
  filename: 'web/android-chrome-72x72',
  size: 72,
}, {
  filename: 'web/android-chrome-96x96',
  size: 96,
}, {
  filename: 'web/android-chrome-144x144',
  size: 144,
}, {
  filename: 'web/android-chrome-192x192',
  size: 192,
}, {
  filename: 'web/mstile-70x70',
  size: 70,
}, {
  filename: 'web/mstile-144x144',
  size: 144,
}, {
  filename: 'web/mstile-150x150',
  size: 150,
}, {
  filename: 'web/mstile-310x310',
  size: 310,
}, {
  filename: 'web/apple-touch-icon',
  size: 180,
}];

var generated = generateName({alliterative: true});
var name = generated.dashed;
var title = generated.spaced.replace(/\b\w/g, l => l.toUpperCase())
var hash = crypto.createHash('md5').update(name).digest('hex')
var hue = parseInt(hash.slice(-2, hash.length), 16) / 256 * 360;
var backgroundColor = `hsl(${hue}, 75%, 50%)`;

console.log(`Name: ${name}`);
console.log(`Title: ${title}`);

fs.writeFileSync('./name.txt', `${name}\n`);
fs.writeFileSync('./title.txt', `${title}\n`);

for ({filename, suffix = 'png', size, padding} of icons) {
  var jiconSize = 30 <= size ? size : 2 * size;
  var jiconPadding = 30 <= size ? padding : 2 * padding;

  var jicon = new Canvas(jiconSize, jiconSize);
  jicon.patternQuality = 'best';
  jicon.filter = 'best';

  var jiconCtx = jicon.getContext('2d');
  jdenticon.drawIcon(jiconCtx, hash, jiconSize, jiconPadding);

  var icon = new Canvas(size, size);
  icon.patternQuality = 'best';
  icon.filter = 'best';

  var iconCtx = icon.getContext('2d');
  iconCtx.fillStyle = backgroundColor;
  iconCtx.fillRect(0, 0, size, size);
  iconCtx.drawImage(jicon, 0, 0, size, size);

  var png = icon.toBuffer();

  var filepath = `./${filename}.${suffix}`;
  var dir = path.dirname(filepath);

  mkdirp.sync(dir);
  fs.writeFileSync(filepath, png);

  console.log(`Icon: ${filename}.png`);
}

console.log('Icon: Icon.svg');

var svgSize = 1024;
var svg = jdenticon.toSvg(hash, svgSize);
fs.writeFileSync('Icon.svg', svg);

console.log('Done.');
