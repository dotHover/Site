/*! showdown 28-05-2015 */
(function() {
    function a(a) {
        "use strict";
        if (!f.hasOwnProperty(a)) throw Error("Extension named " + a + " is not registered!");
        return f[a]
    }

    function b(a, b) {
        "use strict";
        if ("object" != typeof b) throw Error("A Showdown Extension must be an object, " + typeof b + " given");
        if (!d.helper.isString(b.type)) throw Error('When registering a showdown extension, "type" must be a string, ' + typeof b.type + " given");
        b.type = b.type.toLowerCase(), f[a] = b
    }

    function c(a, b) {
        "use strict";
        var c = b.charCodeAt(0);
        return "~E" + c + "E"
    }
    var d = {},
        e = {},
        f = {},
        g = {
            omitExtraWLInCodeBlocks: !1,
            prefixHeaderId: !1
        };
    d.helper = {}, d.extensions = {}, d.setOption = function(a, b) {
        "use strict";
        return g[a] = b, this
    }, d.getOption = function(a) {
        "use strict";
        return g[a]
    }, d.getOptions = function() {
        "use strict";
        return g
    }, d.subParser = function(a, b) {
        "use strict";
        if (d.helper.isString(a)) {
            if ("undefined" == typeof b) {
                if (e.hasOwnProperty(a)) return e[a];
                throw Error("SubParser named " + a + " not registered!")
            }
            e[a] = b
        }
    }, d.extension = function(c, e) {
        "use strict";
        if (!d.helper.isString(c)) throw Error("Extension 'name' must be a string");
        return c = d.helper.stdExtName(c), d.helper.isUndefined(e) ? a() : b()
    }, d.Converter = function(a) {
        "use strict";

        function b(a) {
            if (!a) return a;
            var b = {
                gHtmlBlocks: [],
                gUrls: {},
                gTitles: {},
                gListLevel: 0,
                hashLinkCounts: {},
                langExtensions: k,
                outputModifiers: l
            };
            a = a.replace(/~/g, "~T"), a = a.replace(/\$/g, "~D"), a = a.replace(/\r\n/g, "\n"), a = a.replace(/\r/g, "\n"), a = "\n\n" + a + "\n\n", a = e.detab(a, j, b), a = e.stripBlankLines(a, j, b), a = e.languageExtensions(a, j, b);
            for (var c = 0; c < m.length; ++c) {
                var f = m[c];
                a = e[f](a, j, b)
            }
            return a = a.replace(/~D/g, "$$"), a = a.replace(/~T/g, "~"), d.helper.forEach(b.outputModifiers, function(b) {
                a = d.subParser("runExtension")(b, a)
            }), a = e.outputModifiers(a, j, b)
        }

        function c(a, b) {
            j[a] = b
        }

        function h(a) {
            return j[a]
        }

        function i() {
            return j
        }
        a = a || {};
        var j = {},
            k = [],
            l = [],
            m = ["githubCodeBlocks", "hashHTMLBlocks", "stripLinkDefinitions", "blockGamut", "unescapeSpecialChars"];
        for (var n in g) g.hasOwnProperty(n) && (j[n] = g[n]);
        if ("object" == typeof a)
            for (var o in a) a.hasOwnProperty(o) && (j[o] = a[o]);
        var p = this;
        return p.makeHtml = b, j.extensions && d.helper.forEach(j.extensions, function(a) {
            var b = a;
            if ("string" == typeof a) {
                var c = d.helper.stdExtName(a);
                !d.helper.isUndefined(d.extensions[c]) && d.extensions[c] ? a = d.extensions[c] : d.helper.isUndefined(f[c]) || (a = f[c])
            }
            if ("function" != typeof a) {
                var e = "An extension could not be loaded. It was either not found or is not a valid extension.";
                throw "string" == typeof b && (e = 'Extension "' + b + '" could not be loaded.  It was either not found or is not a valid extension.'), e
            }
            d.helper.forEach(a(p), function(a) {
                a.type ? "language" === a.type || "lang" === a.type ? k.push(a) : ("output" === a.type || "html" === a.type) && l.push(a) : l.push(a)
            })
        }), {
            makeHtml: b,
            setOption: c,
            getOption: h,
            getOptions: i
        }
    }, d.hasOwnProperty("helper") || (d.helper = {}), d.helper.isString = function(a) {
        "use strict";
        return "string" == typeof a || a instanceof String
    }, d.helper.forEach = function(a, b) {
        "use strict";
        if ("function" == typeof a.forEach) a.forEach(b);
        else
            for (var c = 0; c < a.length; c++) b(a[c], c, a)
    }, d.helper.isArray = function(a) {
        "use strict";
        return a.constructor === Array
    }, d.helper.isUndefined = function(a) {
        "use strict";
        return "undefined" == typeof a
    }, d.helper.stdExtName = function(a) {
        "use strict";
        return a.replace(/[_-]||\s/g, "").toLowerCase()
    }, d.helper.escapeCharactersCallback = c, d.helper.escapeCharacters = function(a, b, d) {
        "use strict";
        var e = "([" + b.replace(/([\[\]\\])/g, "\\$1") + "])";
        d && (e = "\\\\" + e);
        var f = new RegExp(e, "g");
        return a = a.replace(f, c)
    }, d.subParser("anchors", function(a, b, c) {
        "use strict";
        var e = function(a, b, e, f, g, h, i, j) {
            d.helper.isUndefined(j) && (j = ""), a = b;
            var k = e,
                l = f.toLowerCase(),
                m = g,
                n = j;
            if (!m)
                if (l || (l = k.toLowerCase().replace(/ ?\n/g, " ")), m = "#" + l, d.helper.isUndefined(c.gUrls[l])) {
                    if (!(a.search(/\(\s*\)$/m) > -1)) return a;
                    m = ""
                } else m = c.gUrls[l], d.helper.isUndefined(c.gTitles[l]) || (n = c.gTitles[l]);
            m = d.helper.escapeCharacters(m, "*_", !1);
            var o = '<a href="' + m + '"';
            return "" !== n && null !== n && (n = n.replace(/"/g, "&quot;"), n = d.helper.escapeCharacters(n, "*_", !1), o += ' title="' + n + '"'), o += ">" + k + "</a>"
        };
        return a = a.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g, e), a = a.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\]\([ \t]*()<?(.*?(?:\(.*?\).*?)?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g, e), a = a.replace(/(\[([^\[\]]+)\])()()()()()/g, e)
    }), d.subParser("autoLinks", function(a) {
        "use strict";
        a = a.replace(/<((https?|ftp|dict):[^'">\s]+)>/gi, '<a href="$1">$1</a>');
        var b = /<(?:mailto:)?([-.\w]+\@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi;
        return a = a.replace(b, function(a, b) {
            var c = d.subParser("unescapeSpecialChars")(b);
            return d.subParser("encodeEmailAddress")(c)
        })
    }), d.subParser("blockGamut", function(a, b, c) {
        "use strict";
        a = d.subParser("headers")(a, b, c);
        var e = d.subParser("hashBlock")("<hr />", b, c);
        return a = a.replace(/^[ ]{0,2}([ ]?\*[ ]?){3,}[ \t]*$/gm, e), a = a.replace(/^[ ]{0,2}([ ]?\-[ ]?){3,}[ \t]*$/gm, e), a = a.replace(/^[ ]{0,2}([ ]?\_[ ]?){3,}[ \t]*$/gm, e), a = d.subParser("lists")(a, b, c), a = d.subParser("codeBlocks")(a, b, c), a = d.subParser("blockQuotes")(a, b, c), a = d.subParser("hashHTMLBlocks")(a, b, c), a = d.subParser("paragraphs")(a, b, c)
    }), d.subParser("blockQuotes", function(a, b, c) {
        "use strict";
        return a = a.replace(/((^[ \t]*>[ \t]?.+\n(.+\n)*\n*)+)/gm, function(a, e) {
            var f = e;
            return f = f.replace(/^[ \t]*>[ \t]?/gm, "~0"), f = f.replace(/~0/g, ""), f = f.replace(/^[ \t]+$/gm, ""), f = d.subParser("blockGamut")(f, b, c), f = f.replace(/(^|\n)/g, "$1  "), f = f.replace(/(\s*<pre>[^\r]+?<\/pre>)/gm, function(a, b) {
                var c = b;
                return c = c.replace(/^  /gm, "~0"), c = c.replace(/~0/g, "")
            }), d.subParser("hashBlock")("<blockquote>\n" + f + "\n</blockquote>", b, c)
        })
    }), d.subParser("codeBlocks", function(a, b, c) {
        "use strict";
        a += "~0";
        var e = /(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=~0))/g;
        return a = a.replace(e, function(a, e, f) {
            var g = e,
                h = f,
                i = "\n";
            return g = d.subParser("outdent")(g), g = d.subParser("encodeCode")(g), g = d.subParser("detab")(g), g = g.replace(/^\n+/g, ""), g = g.replace(/\n+$/g, ""), b.omitExtraWLInCodeBlocks && (i = ""), g = "<pre><code>" + g + i + "</code></pre>", d.subParser("hashBlock")(g, b, c) + h
        }), a = a.replace(/~0/, "")
    }), d.subParser("codeSpans", function(a) {
        "use strict";
        return a = a.replace(/(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm, function(a, b, c, e) {
            var f = e;
            return f = f.replace(/^([ \t]*)/g, ""), f = f.replace(/[ \t]*$/g, ""), f = d.subParser("encodeCode")(f), b + "<code>" + f + "</code>"
        })
    }), d.subParser("detab", function(a) {
        "use strict";
        return a = a.replace(/\t(?=\t)/g, "    "), a = a.replace(/\t/g, "~A~B"), a = a.replace(/~B(.+?)~A/g, function(a, b) {
            for (var c = b, d = 4 - c.length % 4, e = 0; d > e; e++) c += " ";
            return c
        }), a = a.replace(/~A/g, "    "), a = a.replace(/~B/g, "")
    }), d.subParser("encodeAmpsAndAngles", function(a) {
        "use strict";
        return a = a.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g, "&amp;"), a = a.replace(/<(?![a-z\/?\$!])/gi, "&lt;")
    }), d.subParser("encodeBackslashEscapes", function(a) {
        "use strict";
        return a = a.replace(/\\(\\)/g, d.helper.escapeCharactersCallback), a = a.replace(/\\([`*_{}\[\]()>#+-.!])/g, d.helper.escapeCharactersCallback)
    }), d.subParser("encodeCode", function(a) {
        "use strict";
        return a = a.replace(/&/g, "&amp;"), a = a.replace(/</g, "&lt;"), a = a.replace(/>/g, "&gt;"), a = d.helper.escapeCharacters(a, "*_{}[]\\", !1)
    }), d.subParser("encodeEmailAddress", function(a) {
        "use strict";
        var b = [function(a) {
            return "&#" + a.charCodeAt(0) + ";"
        }, function(a) {
            return "&#x" + a.charCodeAt(0).toString(16) + ";"
        }, function(a) {
            return a
        }];
        return a = "mailto:" + a, a = a.replace(/./g, function(a) {
            if ("@" === a) a = b[Math.floor(2 * Math.random())](a);
            else if (":" !== a) {
                var c = Math.random();
                a = c > .9 ? b[2](a) : c > .45 ? b[1](a) : b[0](a)
            }
            return a
        }), a = '<a href="' + a + '">' + a + "</a>", a = a.replace(/">.+:/g, '">')
    }), d.subParser("escapeSpecialCharsWithinTagAttributes", function(a) {
        "use strict";
        var b = /(<[a-z\/!$]("[^"]*"|'[^']*'|[^'">])*>|<!(--.*?--\s*)+>)/gi;
        return a = a.replace(b, function(a) {
            var b = a.replace(/(.)<\/?code>(?=.)/g, "$1`");
            return b = d.helper.escapeCharacters(b, "\\`*_", !1)
        })
    }), d.subParser("githubCodeBlocks", function(a, b, c) {
        "use strict";
        return a += "~0", a = a.replace(/(?:^|\n)```(.*)\n([\s\S]*?)\n```/g, function(a, e, f) {
            var g = e,
                h = f,
                i = "\n";
            return b.omitExtraWLInCodeBlocks && (i = ""), h = d.subParser("encodeCode")(h), h = d.subParser("detab")(h), h = h.replace(/^\n+/g, ""), h = h.replace(/\n+$/g, ""), h = "<pre><code" + (g ? ' class="' + g + '"' : "") + ">" + h + i + "</code></pre>", d.subParser("hashBlock")(h, b, c)
        }), a = a.replace(/~0/, "")
    }), d.subParser("hashBlock", function(a, b, c) {
        "use strict";
        return a = a.replace(/(^\n+|\n+$)/g, ""), "\n\n~K" + (c.gHtmlBlocks.push(a) - 1) + "K\n\n"
    }), d.subParser("hashElement", function(a, b, c) {
        "use strict";
        return function(a, b) {
            var d = b;
            return d = d.replace(/\n\n/g, "\n"), d = d.replace(/^\n/, ""), d = d.replace(/\n+$/g, ""), d = "\n\n~K" + (c.gHtmlBlocks.push(d) - 1) + "K\n\n"
        }
    }), d.subParser("hashHTMLBlocks", function(a, b, c) {
        "use strict";
        return a = a.replace(/\n/g, "\n\n"), a = a.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del)\b[^\r]*?\n<\/\2>[ \t]*(?=\n+))/gm, d.subParser("hashElement")(a, b, c)), a = a.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|style|section|header|footer|nav|article|aside|address|audio|canvas|figure|hgroup|output|video)\b[^\r]*?<\/\2>[ \t]*(?=\n+)\n)/gm, d.subParser("hashElement")(a, b, c)), a = a.replace(/(\n[ ]{0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g, d.subParser("hashElement")(a, b, c)), a = a.replace(/(\n\n[ ]{0,3}<!(--[^\r]*?--\s*)+>[ \t]*(?=\n{2,}))/g, d.subParser("hashElement")(a, b, c)), a = a.replace(/(?:\n\n)([ ]{0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g, d.subParser("hashElement")(a, b, c)), a = a.replace(/\n\n/g, "\n")
    }), d.subParser("headers", function(a, b, c) {
        "use strict";

        function e(a) {
            var b, e = a.replace(/[^\w]/g, "").toLowerCase();
            return c.hashLinkCounts[e] ? b = e + "-" + c.hashLinkCounts[e]++ : (b = e, c.hashLinkCounts[e] = 1), f === !0 && (f = "section"), d.helper.isString(f) ? f + b : b
        }
        var f = b.prefixHeaderId;
        return a = a.replace(/^(.+)[ \t]*\n=+[ \t]*\n+/gm, function(a, f) {
            var g = d.subParser("spanGamut")(f, b, c),
                h = '<h1 id="' + e(f) + '">' + g + "</h1>";
            return d.subParser("hashBlock")(h, b, c)
        }), a = a.replace(/^(.+)[ \t]*\n-+[ \t]*\n+/gm, function(a, f) {
            var g = d.subParser("spanGamut")(f, b, c),
                h = '<h2 id="' + e(f) + '">' + g + "</h2>";
            return d.subParser("hashBlock")(h, b, c)
        }), a = a.replace(/^(\#{1,6})[ \t]*(.+?)[ \t]*\#*\n+/gm, function(a, f, g) {
            var h = d.subParser("spanGamut")(g, b, c),
                i = "<h" + f.length + ' id="' + e(g) + '">' + h + "</h" + f.length + ">";
            return d.subParser("hashBlock")(i, b, c)
        })
    }), d.subParser("images", function(a, b, c) {
        "use strict";
        var e = function(a, b, e, f, g, h, i, j) {
            a = b;
            var k = e,
                l = f.toLowerCase(),
                m = g,
                n = j,
                o = c.gUrls,
                p = c.gTitles;
            if (n || (n = ""), "" === m || null === m) {
                if (("" === l || null === l) && (l = k.toLowerCase().replace(/ ?\n/g, " ")), m = "#" + l, "undefined" == typeof o[l]) return a;
                m = o[l], "undefined" != typeof p[l] && (n = p[l])
            }
            k = k.replace(/"/g, "&quot;"), m = d.helper.escapeCharacters(m, "*_", !1);
            var q = '<img src="' + m + '" alt="' + k + '"';
            return n = n.replace(/"/g, "&quot;"), n = d.helper.escapeCharacters(n, "*_", !1), q += ' title="' + n + '"', q += " />"
        };
        return a = a.replace(/(!\[(.*?)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g, e), a = a.replace(/(!\[(.*?)\]\s?\([ \t]*()<?(\S+?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g, e)
    }), d.subParser("italicsAndBold", function(a) {
        "use strict";
        return a = a.replace(/(\*\*|__)(?=\S)([^\r]*?\S[*_]*)\1/g, "<strong>$2</strong>"), a = a.replace(/(\*|_)(?=\S)([^\r]*?\S)\1/g, "<em>$2</em>")
    }), d.subParser("languageExtensions", function(a, b, c) {
        "use strict";
        return d.helper.forEach(c.langExtensions, function(b) {
            a = d.subParser("runExtension")(b, a)
        }), a
    }), d.subParser("lists", function(a, b, c) {
        "use strict";
        var e = function(a) {
            return c.gListLevel++, a = a.replace(/\n{2,}$/, "\n"), a += "~0", a = a.replace(/(\n)?(^[ \t]*)([*+-]|\d+[.])[ \t]+([^\r]+?(\n{1,2}))(?=\n*(~0|\2([*+-]|\d+[.])[ \t]+))/gm, function(a, e, f, g, h) {
                var i = d.subParser("outdent")(h, b, c);
                return e || i.search(/\n{2,}/) > -1 ? i = d.subParser("blockGamut")(i, b, c) : (i = d.subParser("lists")(i, b, c), i = i.replace(/\n$/, ""), i = d.subParser("spanGamut")(i, b, c)), "<li>" + i + "</li>\n"
            }), a = a.replace(/~0/g, ""), c.gListLevel--, a
        };
        a += "~0";
        var f = /^(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm;
        return c.gListLevel ? a = a.replace(f, function(a, b, c) {
            var d = b,
                f = c.search(/[*+-]/g) > -1 ? "ul" : "ol";
            d = d.replace(/\n{2,}/g, "\n\n\n");
            var g = e(d);
            return g = g.replace(/\s+$/, ""), g = "<" + f + ">" + g + "</" + f + ">\n"
        }) : (f = /(\n\n|^\n?)(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/g, a = a.replace(f, function(a, b, c, d) {
            var f = c.replace(/\n{2,}/g, "\n\n\n"),
                g = d.search(/[*+-]/g) > -1 ? "ul" : "ol",
                h = e(f);
            return b + "<" + g + ">\n" + h + "</" + g + ">\n"
        })), a = a.replace(/~0/, "")
    }), d.subParser("outdent", function(a) {
        "use strict";
        return a = a.replace(/^(\t|[ ]{1,4})/gm, "~0"), a = a.replace(/~0/g, "")
    }), d.subParser("outputModifiers", function(a, b, c) {
        "use strict";
        return d.helper.forEach(c.outputModifiers, function(b) {
            a = d.subParser("runExtension")(b, a)
        }), a
    }), d.subParser("paragraphs", function(a, b, c) {
        "use strict";
        a = a.replace(/^\n+/g, ""), a = a.replace(/\n+$/g, "");
        for (var e = a.split(/\n{2,}/g), f = [], g = e.length, h = 0; g > h; h++) {
            var i = e[h];
            i.search(/~K(\d+)K/g) >= 0 ? f.push(i) : i.search(/\S/) >= 0 && (i = d.subParser("spanGamut")(i, b, c), i = i.replace(/^([ \t]*)/g, "<p>"), i += "</p>", f.push(i))
        }
        for (g = f.length, h = 0; g > h; h++)
            for (; f[h].search(/~K(\d+)K/) >= 0;) {
                var j = c.gHtmlBlocks[RegExp.$1];
                j = j.replace(/\$/g, "$$$$"), f[h] = f[h].replace(/~K\d+K/, j)
            }
        return f.join("\n\n")
    }), d.subParser("runExtension", function(a, b) {
        "use strict";
        if (a.regex) {
            var c = new RegExp(a.regex, "g");
            return b.replace(c, a.replace)
        }
        return a.filter ? a.filter(b) : void 0
    }), d.subParser("spanGamut", function(a, b, c) {
        "use strict";
        return a = d.subParser("codeSpans")(a, b, c), a = d.subParser("escapeSpecialCharsWithinTagAttributes")(a, b, c), a = d.subParser("encodeBackslashEscapes")(a, b, c), a = d.subParser("images")(a, b, c), a = d.subParser("anchors")(a, b, c), a = d.subParser("autoLinks")(a, b, c), a = d.subParser("encodeAmpsAndAngles")(a, b, c), a = d.subParser("italicsAndBold")(a, b, c), a = a.replace(/  +\n/g, " <br />\n")
    }), d.subParser("stripBlankLines", function(a) {
        "use strict";
        return a.replace(/^[ \t]+$/gm, "")
    }), d.subParser("stripLinkDefinitions", function(a, b, c) {
        "use strict";
        var e = /^[ ]{0,3}\[(.+)]:[ \t]*\n?[ \t]*<?(\S+?)>?[ \t]*\n?[ \t]*(?:(\n*)["(](.+?)[")][ \t]*)?(?:\n+|(?=~0))/gm;
        return a += "~0", a = a.replace(e, function(a, b, e, f, g) {
            return b = b.toLowerCase(), c.gUrls[b] = d.subParser("encodeAmpsAndAngles")(e), f ? f + g : (g && (c.gTitles[b] = g.replace(/"/g, "&quot;")), "")
        }), a = a.replace(/~0/, "")
    }), d.subParser("unescapeSpecialChars", function(a) {
        "use strict";
        return a = a.replace(/~E(\d+)E/g, function(a, b) {
            var c = parseInt(b);
            return String.fromCharCode(c)
        })
    });
    var h = this;
    "undefined" != typeof module && module.exports ? module.exports = d : "function" == typeof define && define.amd ? define("showdown", function() {
        "use strict";
        return d
    }) : h.showdown = d
}).call(this);
//# sourceMappingURL=showdown.min.js.map