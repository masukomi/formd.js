## formd.js&mdash;A JavaScript port of [formd](http://drbunsen.github.com/formd/):

For more information on `formd` consult the [documentation](http://drbunsen.github.com/formd/) and [this blog post](http://www.drbunsen.org/formd-a-markdown-formatting-tool.html).

### Usage

    var test_text = "The quick brown [fox](http://en.wikipedia.org/wiki/Fox) jumped over the lazy [dog](http://en.wikipedia.org/wiki/Dog).";

    formd = new ForMd(test_text);

    console.log(formd.inline_md());
    console.log(formd.ref_md());
    console.log(formd.flip());