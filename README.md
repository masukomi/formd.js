## formd.js&mdash;A JavaScript port of an ancient version of formd:

Converts from inline to referenced markdown links formats, and back. 

The original project is long gone, but [lives on in Typescript here](https://github.com/seth-brown/formd).


### Usage

    var test_text = "The quick brown [fox](http://en.wikipedia.org/wiki/Fox) jumped over the lazy [dog](http://en.wikipedia.org/wiki/Dog).";

    formd = new ForMd(test_text);

    console.log(formd.inline_md());
    console.log(formd.ref_md());
    console.log(formd.flip());
