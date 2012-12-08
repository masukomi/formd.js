if (typeof(String.prototype.strip) === 'undefined') {
    String.prototype.strip = function() {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

if (typeof(String.prototype.rstrip) === 'undefined') {
    String.prototype.rstrip = function() {
        return String(this).replace(/\s+$/g, '');
    };
}

function ForMd(text) {
    // Format markdown text
    
    this.text = text;
    
    this.match_links = /(\[.*?\])\s*(\[.*?\]|\(.*?\))/g;
    this.match_link = /(\[.*?\])\s*(\[.*?\]|\(.*?\))/;
    
    this.match_refs = /\[(.*?)\]:\s(.*)/g;
    this.match_ref = /\[(.*?)\]:\s(.*)/;
    
    this.data = [];
}

ForMd.prototype._links = function() {
    // find Markdown links
    
    var links = this.text.match(this.match_links);
    var results = [];
    
    for (var i = 0; i < links.length; i++) {
        var link = links[i].replace(/\n/g, '');
        var parts = link.match(this.match_link)
        
        results.push([parts[1].slice(1, -1), parts[2].slice(1, -1)]);
    }
    
    return results;
};

ForMd.prototype._refs = function() {
    // find Markdown references
    
    var refs = this.text.match(this.match_refs);
    
    if (!refs) {
        return [];
    }
    
    refs.sort();
    
    var refs_array = [];
    
    for (var i = 0; i < refs.length; i++) {
        var ref = refs[i];
        var parts = ref.match(this.match_ref);
        
        refs_array.push(parts[1], parts[2]);
    }
    
    return refs_array;
};

ForMd.prototype._format = function() {
    // process text
    
    this.data = [];
    
    var links = this._links();
    var refs = this._refs();
    
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        var text = link[0];
        var ref = link[1];
        
        var url = ref;
        
        for (var j = 0; j < refs.length; j++) {
            var _ref = refs[j];
            
            if ([ref, text].indexOf(_ref[0]) != -1) {
                url = _ref[1].strip();
                break;
            }
        }
        
        var formd_text = '[' + text + '][' + (i + 1) + ']';
        var formd_ref = '[' + (i + 1) + ']: ' + url;
            
        this.data.push([formd_text, formd_ref]);
    }
};

ForMd.prototype.inline_md = function() {
    // generate inline markdown
    
    var results = [];
    this._format();
    
    var temp = [];
    
    for (var i = 0; i < this.data.length; i++) {
        var text = this.data[i][0];
        var ref = this.data[i][1];
        
        var url = ref.split(':').slice(1).join(':').strip();
        var actual_text = text.split('][')[0].slice(1);
        
        var formatted = '[' + actual_text + '](' + url + ')';
        
        temp.unshift(formatted);
    }
    
    var formd_text = this.text.replace(this.match_links, function() { return temp.pop(); });
    var formd_md = formd_text.replace(this.match_refs, '').strip();
    
    return formd_md;
}

ForMd.prototype.ref_md = function() {
    // generate referenced markdown
    
    var ref_nums = [];
    var references = [];
    this._format();
    
    for (var i = 0; i < this.data.length; i++) {
        ref_nums.unshift(this.data[i][0].rstrip(' :'));
        references.push(this.data[i][1]);
    }
    
    var formd_text = this.text.replace(this.match_links, function() { return ref_nums.pop(); });
    var formd_refs = formd_text.replace(this.match_refs, '').strip();
    
    return [formd_refs, '\n', references.join('\n')].join('\n');
};

ForMd.prototype.flip = function() {
    // convert markdown to the opposite style of the first text link
    var first_match = this.match_links.exec(this.text)[0];
    var formd_md;
    
    if ((first_match.indexOf('(') != -1) && (first_match.indexOf(')') != -1)) {
        formd_md = this.ref_md();
    } else {
        formd_md = this.inline_md();
    }
    
    return formd_md
};