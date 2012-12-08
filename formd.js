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
    this.match_refs = /\[.*?\]:\s*.*/g;
    this.data = [];
}

ForMd.prototype._links = function() {
    // find Markdown links
    
    var links = this.match_links.exec(this.text);
    var results = [];
    
    for (var i = 0; i < links.length; i++) {
        results.push(links[i].replace(/\n/g, ''));
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
        
        refs_array.push(ref.split('/', 1));
    }
    
    return refs_array;
};

ForMd.prototype._format = function() {
    // process text
    
    var links = this._links();
    var refs = this._refs();
    
    for (var i = 1; i < links.length; i++) {
        var link = links[i];
        var text = link[0];
        var ref = link[1];
        
        var ref_num = '[' + i + ']: ';
        var url = ref.strip('()');
        
        for (var j = 0; j < refs.length; j++) {
            var _ref = refs[j];
            
            if ([ref, text].indexOf(_ref[0]) != -1) {
                url = _ref[1].strip();
                break;
            }
        }
        
        var formd_text = text + ref_num;
        var formd_ref = ref_num + url;
            
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
        
        var formatted = text.split('][', 1)[0] + '](' + ref.split(':', 1)[1].strip() + ')';
        
        temp.unshift(formatted);
    }
    
    var formd_text = this.text.replace(this.match_links, temp.pop);
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
    
    var formd_text = this.text.replace(this.match_links, ref_nums.pop);
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