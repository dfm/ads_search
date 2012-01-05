// Get the arguments from the URL
function get_url_args() {
    var i;
    var ret = [];
    var loc = window.location.search;
    var args = loc.slice(loc.indexOf('?')+1).split('&');

    for (i = 0; i < args.length; i++) {
        var tmp = args[i].split('=');
        ret.push(tmp[0]);
        ret[tmp[0]] = tmp[1];
    }

    return ret;
}

// Tokenize a search query taking quotes into account
function tokenize(s) {
    var i;
    var ret = [];
    var i0 = 0, dq = -1, sq = -1;
    for (i = 0; i < s.length; i++) {
        if (s[i] == '"') {
            if (dq < 0) {
                dq = i+1;
            } else {
                if (sq < 0) {
                    ret.push(s.substring(dq, i));
                }
                dq = -1;
                i0 = i+1;
            }
        } else if (s[i] == "'") {
            if (sq < 0) {
                sq = i+1;
            } else {
                if (dq < 0) {
                    ret.push(s.substring(sq, i));
                }
                sq = -1;
                i0 = i+1;
            }
        } else if (s[i] == ' ' || s[i] == '+') {
            if (sq < 0 && dq < 0) {
                if (i0 < i) {
                    ret.push(s.substring(i0, i));
                }
                i0 = i+1;
            }
        }
    }
    if (i0 < s.length) {
        ret.push(s.substring(i0, s.length));
    }
    return ret;
}

// Parse the tokenized input
function parse(tokens) {
    var i;
    var logic = "AND";
    var au = [], yr = [];

    for (i = 0; i < tokens.length; i++) {
        var token = tokens[i];
        if (token.search("20") != -1 || token.search("19") != -1) {
            yr.push(token);
        } else if (token.toLowerCase() == "and") {
            logic = "AND";
        } else if (token.toLowerCase() == "or") {
            logic = "OR";
        } else {
            au.push(token);
        }
    }
    return [logic,au,yr.sort()];
}

// Get the redirect URL
function get_redirect() {
    var i, res, tokens, logic, au, yr, start = "", end = "", author = "";
    var args = get_url_args();
    if (args.indexOf("ads") < 0) {
        return "search";
    }

    tokens = tokenize(unescape(args["ads"]));
    res = parse(tokens);
    logic = res[0];
    au = res[1];
    yr = res[2];

    if (yr.length >= 1) {
        start = yr[0];
        if (yr.length >= 2) {
            end = yr[1];
        } else {
            end = start;
        }
    }

    for (i = 0; i < au.length; i++) {
        author += escape(au[i]+"\r\n");
    }

    return "http://adsabs.harvard.edu/cgi-bin/nph-abs_connect?db_key=AST&db_key=PRE&qform=AST&arxiv_sel=astro-ph&arxiv_sel=cond-mat&arxiv_sel=cs&arxiv_sel=gr-qc&arxiv_sel=hep-ex&arxiv_sel=hep-lat&arxiv_sel=hep-ph&arxiv_sel=hep-th&arxiv_sel=math&arxiv_sel=math-ph&arxiv_sel=nlin&arxiv_sel=nucl-ex&arxiv_sel=nucl-th&arxiv_sel=physics&arxiv_sel=quant-ph&arxiv_sel=q-bio&sim_query=YES&ned_query=YES&adsobj_query=YES&aut_logic="+logic+"&obj_logic=OR&author="+author+"&object=&start_mon=&start_year="+start+"&end_mon=&end_year="+end+"&ttl_logic=OR&title=&txt_logic=OR&text=&nr_to_return=200&start_nr=1&jou_pick=ALL&ref_stems=&data_and=ALL&group_and=ALL&start_entry_day=&start_entry_mon=&start_entry_year=&end_entry_day=&end_entry_mon=&end_entry_year=&min_score=&sort=SCORE&data_type=SHORT&aut_syn=YES&ttl_syn=YES&txt_syn=YES&aut_wt=1.0&obj_wt=1.0&ttl_wt=0.3&txt_wt=3.0&aut_wgt=YES&obj_wgt=YES&ttl_wgt=YES&txt_wgt=YES&ttl_sco=YES&txt_sco=YES&version=1";
}

window.location = get_redirect();

