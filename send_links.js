// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Send back to the popup a sorted deduped list of valid link URLs on this page.
// The popup injects this script into all frames in the active tab.

var file_type = ['jpg', 'jpge', 'png', 'gif'];

var imgDOM = [].slice.apply(document.getElementsByTagName('img'));
var aDOM =  [].slice.apply(document.getElementsByTagName('a'));
var links = imgDOM.concat(aDOM);
links = links.map(function(element) {
  // Return an anchor's href attribute, stripping any URL fragment (hash '#').
  // If the html specifies a relative path, chrome converts it to an absolute
  // URL.

  var img = element.src;
  if (img == null) {
    img = element.href;
  }
  var httpIndex = img.indexOf('http://');
  var goldenIndex = img.indexOf('hkgolden.com');

  var file_extension = img.substring(img.lastIndexOf(".") + 1);

  // hack
  if (file_extension == 'gifv') {
    img = img.substring(0, img.length - 1);
    // file_extension = img.substring(img.lastIndexOf(".") + 1);
    file_extension = 'gif';
  }

  var is_image_file = file_type.indexOf(file_extension) >= 0;

  if (httpIndex >= 0 && goldenIndex < 0 && is_image_file) {
    console.log(img);
    return img;
  }

});

links.sort();

// Remove duplicates and invalid URLs.
for (var i = 0; i < links.length;) {
  // console.log(links[i]);
  if (((i > 0) && (links[i] == links[i - 1])) ||
      (links[i] == '') || 
      (links[i] == 'null')) {
    links.splice(i, 1);
  } else {
    ++i;
  }
}

chrome.extension.sendRequest(links);
