/*! jsTree - v3.0.1 - 2014-06-02 - (MIT) */
(function (e) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery"], e) : "object" == typeof exports ? e(require("jquery")) : e(jQuery)
})(function (e, t) {
    "use strict";
    if (!e.jstree) {
        var i = 0, r = !1, n = !1, s = !1, a = [], d = e("script:last").attr("src"), o = document,
            l = o.createElement("LI"), c, h;
        l.setAttribute("role", "treeitem"), c = o.createElement("I"), c.className = "jstree-icon jstree-ocl", l.appendChild(c), c = o.createElement("A"), c.className = "jstree-anchor", c.setAttribute("href", "#"), h = o.createElement("I"), h.className = "jstree-icon jstree-themeicon", c.appendChild(h), l.appendChild(c), c = h = null, e.jstree = {
            version: "3.0.1",
            defaults: {plugins: []},
            plugins: {},
            path: d && -1 !== d.indexOf("/") ? d.replace(/\/[^\/]+$/, "") : "",
            idregex: /[\\:&!^|()\[\]<>@*'+~#";.,=\- \/$]/g
        }, e.jstree.create = function (t, r) {
            var n = new e.jstree.core(++i), s = r;
            return r = e.extend(!0, {}, e.jstree.defaults, r), s && s.plugins && (r.plugins = s.plugins), e.each(r.plugins, function (e, t) {
                "core" !== e && (n = n.plugin(t, r[t]))
            }), n.init(t, r), n
        }, e.jstree.core = function (e) {
            this._id = e, this._cnt = 0, this._wrk = null, this._data = {
                core: {
                    themes: {name: !1, dots: !1, icons: !1},
                    selected: [],
                    last_error: {}
                }
            }
        }, e.jstree.reference = function (i) {
            var r = null, n = null;
            if (i && i.id && (i = i.id), !n || !n.length) try {
                n = e(i)
            } catch (s) {
            }
            if (!n || !n.length) try {
                n = e("#" + i.replace(e.jstree.idregex, "\\$&"))
            } catch (s) {
            }
            return n && n.length && (n = n.closest(".jstree")).length && (n = n.data("jstree")) ? r = n : e(".jstree").each(function () {
                var n = e(this).data("jstree");
                return n && n._model.data[i] ? (r = n, !1) : t
            }), r
        }, e.fn.jstree = function (i) {
            var r = "string" == typeof i, n = Array.prototype.slice.call(arguments, 1), s = null;
            return this.each(function () {
                var a = e.jstree.reference(this), d = r && a ? a[i] : null;
                return s = r && d ? d.apply(a, n) : null, a || r || i !== t && !e.isPlainObject(i) || e(this).data("jstree", new e.jstree.create(this, i)), (a && !r || i === !0) && (s = a || !1), null !== s && s !== t ? !1 : t
            }), null !== s && s !== t ? s : this
        }, e.expr[":"].jstree = e.expr.createPseudo(function (i) {
            return function (i) {
                return e(i).hasClass("jstree") && e(i).data("jstree") !== t
            }
        }), e.jstree.defaults.core = {
            data: !1,
            strings: !1,
            check_callback: !1,
            error: e.noop,
            animation: 200,
            multiple: !0,
            themes: {name: !1, url: !1, dir: !1, dots: !0, icons: !0, stripes: !1, variant: !1, responsive: !0},
            expand_selected_onload: !0,
            worker: !0
        }, e.jstree.core.prototype = {
            plugin: function (t, i) {
                var r = e.jstree.plugins[t];
                return r ? (this._data[t] = {}, r.prototype = this, new r(i, this)) : this
            }, init: function (t, i) {
                this._model = {
                    data: {
                        "#": {
                            id: "#",
                            parent: null,
                            parents: [],
                            children: [],
                            children_d: [],
                            state: {loaded: !1}
                        }
                    },
                    changed: [],
                    force_full_redraw: !1,
                    redraw_timeout: !1,
                    default_state: {loaded: !0, opened: !1, selected: !1, disabled: !1}
                }, this.element = e(t).addClass("jstree jstree-" + this._id), this.settings = i, this.element.bind("destroyed", e.proxy(this.teardown, this)), this._data.core.ready = !1, this._data.core.loaded = !1, this._data.core.rtl = "rtl" === this.element.css("direction"), this.element[this._data.core.rtl ? "addClass" : "removeClass"]("jstree-rtl"), this.element.attr("role", "tree"), this.bind(), this.trigger("init"), this._data.core.original_container_html = this.element.find(" > ul > li").clone(!0), this._data.core.original_container_html.find("li").addBack().contents().filter(function () {
                    return 3 === this.nodeType && (!this.nodeValue || /^\s+$/.test(this.nodeValue))
                }).remove(), this.element.html("<ul class='jstree-container-ul jstree-children'><li class='jstree-initial-node jstree-loading jstree-leaf jstree-last'><i class='jstree-icon jstree-ocl'></i><a class='jstree-anchor' href='#'><i class='jstree-icon jstree-themeicon-hidden'></i>" + this.get_string("Loading ...") + "</a></li></ul>"), this._data.core.li_height = this.get_container_ul().children("li:eq(0)").height() || 24, this.trigger("loading"), this.load_node("#")
            }, destroy: function (e) {
                e || this.element.empty(), this.element.unbind("destroyed", this.teardown), this.teardown()
            }, teardown: function () {
                this.unbind(), this.element.removeClass("jstree").removeData("jstree").find("[class^='jstree']").addBack().attr("class", function () {
                    return this.className.replace(/jstree[^ ]*|$/gi, "")
                }), this.element = null
            }, bind: function () {
                this.element.on("dblclick.jstree", function () {
                    if (document.selection && document.selection.empty) document.selection.empty(); else if (window.getSelection) {
                        var e = window.getSelection();
                        try {
                            e.removeAllRanges(), e.collapse()
                        } catch (t) {
                        }
                    }
                }).on("click.jstree", ".jstree-ocl", e.proxy(function (e) {
                    this.toggle_node(e.target)
                }, this)).on("click.jstree", ".jstree-anchor", e.proxy(function (t) {
                    t.preventDefault(), e(t.currentTarget).focus(), this.activate_node(t.currentTarget, t)
                }, this)).on("keydown.jstree", ".jstree-anchor", e.proxy(function (t) {
                    if ("INPUT" === t.target.tagName) return !0;
                    var i = null;
                    switch (t.which) {
                        case 13:
                        case 32:
                            t.type = "click", e(t.currentTarget).trigger(t);
                            break;
                        case 37:
                            t.preventDefault(), this.is_open(t.currentTarget) ? this.close_node(t.currentTarget) : (i = this.get_prev_dom(t.currentTarget), i && i.length && i.children(".jstree-anchor").focus());
                            break;
                        case 38:
                            t.preventDefault(), i = this.get_prev_dom(t.currentTarget), i && i.length && i.children(".jstree-anchor").focus();
                            break;
                        case 39:
                            t.preventDefault(), this.is_closed(t.currentTarget) ? this.open_node(t.currentTarget, function (e) {
                                this.get_node(e, !0).children(".jstree-anchor").focus()
                            }) : (i = this.get_next_dom(t.currentTarget), i && i.length && i.children(".jstree-anchor").focus());
                            break;
                        case 40:
                            t.preventDefault(), i = this.get_next_dom(t.currentTarget), i && i.length && i.children(".jstree-anchor").focus();
                            break;
                        case 46:
                            t.preventDefault(), i = this.get_node(t.currentTarget), i && i.id && "#" !== i.id && (i = this.is_selected(i) ? this.get_selected() : i);
                            break;
                        case 113:
                            t.preventDefault(), i = this.get_node(t.currentTarget);
                            break;
                        default:
                    }
                }, this)).on("load_node.jstree", e.proxy(function (t, i) {
                    if (i.status && ("#" !== i.node.id || this._data.core.loaded || (this._data.core.loaded = !0, this.trigger("loaded")), !this._data.core.ready && !this.get_container_ul().find(".jstree-loading:eq(0)").length)) {
                        if (this._data.core.ready = !0, this._data.core.selected.length) {
                            if (this.settings.core.expand_selected_onload) {
                                var r = [], n, s;
                                for (n = 0, s = this._data.core.selected.length; s > n; n++) r = r.concat(this._model.data[this._data.core.selected[n]].parents);
                                for (r = e.vakata.array_unique(r), n = 0, s = r.length; s > n; n++) this.open_node(r[n], !1, 0)
                            }
                            this.trigger("changed", {action: "ready", selected: this._data.core.selected})
                        }
                        setTimeout(e.proxy(function () {
                            this.trigger("ready")
                        }, this), 0)
                    }
                }, this)).on("init.jstree", e.proxy(function () {
                    var e = this.settings.core.themes;
                    this._data.core.themes.dots = e.dots, this._data.core.themes.stripes = e.stripes, this._data.core.themes.icons = e.icons, this.set_theme(e.name || "default", e.url), this.set_theme_variant(e.variant)
                }, this)).on("loading.jstree", e.proxy(function () {
                    this[this._data.core.themes.dots ? "show_dots" : "hide_dots"](), this[this._data.core.themes.icons ? "show_icons" : "hide_icons"](), this[this._data.core.themes.stripes ? "show_stripes" : "hide_stripes"]()
                }, this)).on("focus.jstree", ".jstree-anchor", e.proxy(function (t) {
                    this.element.find(".jstree-hovered").not(t.currentTarget).mouseleave(), e(t.currentTarget).mouseenter()
                }, this)).on("mouseenter.jstree", ".jstree-anchor", e.proxy(function (e) {
                    this.hover_node(e.currentTarget)
                }, this)).on("mouseleave.jstree", ".jstree-anchor", e.proxy(function (e) {
                    this.dehover_node(e.currentTarget)
                }, this))
            }, unbind: function () {
                this.element.off(".jstree"), e(document).off(".jstree-" + this._id)
            }, trigger: function (e, t) {
                t || (t = {}), t.instance = this, this.element.triggerHandler(e.replace(".jstree", "") + ".jstree", t)
            }, get_container: function () {
                return this.element
            }, get_container_ul: function () {
                return this.element.children(".jstree-children:eq(0)")
            }, get_string: function (t) {
                var i = this.settings.core.strings;
                return e.isFunction(i) ? i.call(this, t) : i && i[t] ? i[t] : t
            }, _firstChild: function (e) {
                e = e ? e.firstChild : null;
                while (null !== e && 1 !== e.nodeType) e = e.nextSibling;
                return e
            }, _nextSibling: function (e) {
                e = e ? e.nextSibling : null;
                while (null !== e && 1 !== e.nodeType) e = e.nextSibling;
                return e
            }, _previousSibling: function (e) {
                e = e ? e.previousSibling : null;
                while (null !== e && 1 !== e.nodeType) e = e.previousSibling;
                return e
            }, get_node: function (t, i) {
                t && t.id && (t = t.id);
                var r;
                try {
                    if (this._model.data[t]) t = this._model.data[t]; else if (((r = e(t, this.element)).length || (r = e("#" + t.replace(e.jstree.idregex, "\\$&"), this.element)).length) && this._model.data[r.closest(".jstree-node").attr("id")]) t = this._model.data[r.closest(".jstree-node").attr("id")]; else {
                        if (!(r = e(t, this.element)).length || !r.hasClass("jstree")) return !1;
                        t = this._model.data["#"]
                    }
                    return i && (t = "#" === t.id ? this.element : e("#" + t.id.replace(e.jstree.idregex, "\\$&"), this.element)), t
                } catch (n) {
                    return !1
                }
            }, get_path: function (e, t, i) {
                if (e = e.parents ? e : this.get_node(e), !e || "#" === e.id || !e.parents) return !1;
                var r, n, s = [];
                for (s.push(i ? e.id : e.text), r = 0, n = e.parents.length; n > r; r++) s.push(i ? e.parents[r] : this.get_text(e.parents[r]));
                return s = s.reverse().slice(1), t ? s.join(t) : s
            }, get_next_dom: function (t, i) {
                var r;
                return t = this.get_node(t, !0), t[0] === this.element[0] ? (r = this._firstChild(this.get_container_ul()[0]), r ? e(r) : !1) : t && t.length ? i ? (r = this._nextSibling(t[0]), r ? e(r) : !1) : t.hasClass("jstree-open") ? (r = this._firstChild(t.children(".jstree-children")[0]), r ? e(r) : !1) : null !== (r = this._nextSibling(t[0])) ? e(r) : t.parentsUntil(".jstree", ".jstree-node").next(".jstree-node").eq(0) : !1
            }, get_prev_dom: function (t, i) {
                var r;
                if (t = this.get_node(t, !0), t[0] === this.element[0]) return r = this.get_container_ul()[0].lastChild, r ? e(r) : !1;
                if (!t || !t.length) return !1;
                if (i) return r = this._previousSibling(t[0]), r ? e(r) : !1;
                if (null !== (r = this._previousSibling(t[0]))) {
                    t = e(r);
                    while (t.hasClass("jstree-open")) t = t.children(".jstree-children:eq(0)").children(".jstree-node:last");
                    return t
                }
                return r = t[0].parentNode.parentNode, r && r.className && -1 !== r.className.indexOf("jstree-node") ? e(r) : !1
            }, get_parent: function (e) {
                return e = this.get_node(e), e && "#" !== e.id ? e.parent : !1
            }, get_children_dom: function (e) {
                return e = this.get_node(e, !0), e[0] === this.element[0] ? this.get_container_ul().children(".jstree-node") : e && e.length ? e.children(".jstree-children").children(".jstree-node") : !1
            }, is_parent: function (e) {
                return e = this.get_node(e), e && (e.state.loaded === !1 || e.children.length > 0)
            }, is_loaded: function (e) {
                return e = this.get_node(e), e && e.state.loaded
            }, is_loading: function (e) {
                return e = this.get_node(e), e && e.state && e.state.loading
            }, is_open: function (e) {
                return e = this.get_node(e), e && e.state.opened
            }, is_closed: function (e) {
                return e = this.get_node(e), e && this.is_parent(e) && !e.state.opened
            }, is_leaf: function (e) {
                return !this.is_parent(e)
            }, load_node: function (t, i) {
                var r, n, s, a, d, o, l;
                if (e.isArray(t)) {
                    for (t = t.slice(), r = 0, n = t.length; n > r; r++) this.load_node(t[r], i);
                    return !0
                }
                if (t = this.get_node(t), !t) return i && i.call(this, t, !1), !1;
                if (t.state.loaded) {
                    for (t.state.loaded = !1, s = 0, a = t.children_d.length; a > s; s++) {
                        for (d = 0, o = t.parents.length; o > d; d++) this._model.data[t.parents[d]].children_d = e.vakata.array_remove_item(this._model.data[t.parents[d]].children_d, t.children_d[s]);
                        this._model.data[t.children_d[s]].state.selected && (l = !0, this._data.core.selected = e.vakata.array_remove_item(this._data.core.selected, t.children_d[s])), delete this._model.data[t.children_d[s]]
                    }
                    t.children = [], t.children_d = [], l && this.trigger("changed", {
                        action: "load_node",
                        node: t,
                        selected: this._data.core.selected
                    })
                }
                return t.state.loading = !0, this.get_node(t, !0).addClass("jstree-loading"), this._load_node(t, e.proxy(function (e) {
                    t = this._model.data[t.id], t.state.loading = !1, t.state.loaded = e;
                    var r = this.get_node(t, !0);
                    t.state.loaded && !t.children.length && r && r.length && !r.hasClass("jstree-leaf") && r.removeClass("jstree-closed jstree-open").addClass("jstree-leaf"), r.removeClass("jstree-loading"), this.trigger("load_node", {
                        node: t,
                        status: e
                    }), i && i.call(this, t, e)
                }, this)), !0
            }, _load_nodes: function (e, t, i) {
                var r = !0, n = function () {
                    this._load_nodes(e, t, !0)
                }, s = this._model.data, a, d;
                for (a = 0, d = e.length; d > a; a++) !s[e[a]] || s[e[a]].state.loaded && i || (this.is_loading(e[a]) || this.load_node(e[a], n), r = !1);
                r && (t.done || (t.call(this, e), t.done = !0))
            }, _load_node: function (t, i) {
                var r = this.settings.core.data, n;
                return r ? e.isFunction(r) ? r.call(this, t, e.proxy(function (r) {
                    r === !1 && i.call(this, !1), this["string" == typeof r ? "_append_html_data" : "_append_json_data"](t, "string" == typeof r ? e(r) : r, function (e) {
                        i.call(this, e)
                    })
                }, this)) : "object" == typeof r ? r.url ? (r = e.extend(!0, {}, r), e.isFunction(r.url) && (r.url = r.url.call(this, t)), e.isFunction(r.data) && (r.data = r.data.call(this, t)), e.ajax(r).done(e.proxy(function (r, n, s) {
                    var a = s.getResponseHeader("Content-Type");
                    return -1 !== a.indexOf("json") || "object" == typeof r ? this._append_json_data(t, r, function (e) {
                        i.call(this, e)
                    }) : -1 !== a.indexOf("html") || "string" == typeof r ? this._append_html_data(t, e(r), function (e) {
                        i.call(this, e)
                    }) : (this._data.core.last_error = {
                        error: "ajax",
                        plugin: "core",
                        id: "core_04",
                        reason: "Could not load node",
                        data: JSON.stringify({id: t.id, xhr: s})
                    }, this.settings.core.error.call(this, this._data.core.last_error), i.call(this, !1))
                }, this)).fail(e.proxy(function (e) {
                    i.call(this, !1), this._data.core.last_error = {
                        error: "ajax",
                        plugin: "core",
                        id: "core_04",
                        reason: "Could not load node",
                        data: JSON.stringify({id: t.id, xhr: e})
                    }, this.settings.core.error.call(this, this._data.core.last_error)
                }, this))) : (n = e.isArray(r) || e.isPlainObject(r) ? JSON.parse(JSON.stringify(r)) : r, "#" === t.id ? this._append_json_data(t, n, function (e) {
                    i.call(this, e)
                }) : (this._data.core.last_error = {
                    error: "nodata",
                    plugin: "core",
                    id: "core_05",
                    reason: "Could not load node",
                    data: JSON.stringify({id: t.id})
                }, this.settings.core.error.call(this, this._data.core.last_error), i.call(this, !1))) : "string" == typeof r ? "#" === t.id ? this._append_html_data(t, e(r), function (e) {
                    i.call(this, e)
                }) : (this._data.core.last_error = {
                    error: "nodata",
                    plugin: "core",
                    id: "core_06",
                    reason: "Could not load node",
                    data: JSON.stringify({id: t.id})
                }, this.settings.core.error.call(this, this._data.core.last_error), i.call(this, !1)) : i.call(this, !1) : "#" === t.id ? this._append_html_data(t, this._data.core.original_container_html.clone(!0), function (e) {
                    i.call(this, e)
                }) : i.call(this, !1)
            }, _node_changed: function (e) {
                e = this.get_node(e), e && this._model.changed.push(e.id)
            }, _append_html_data: function (t, i, r) {
                t = this.get_node(t), t.children = [], t.children_d = [];
                var n = i.is("ul") ? i.children() : i, s = t.id, a = [], d = [], o = this._model.data, l = o[s],
                    c = this._data.core.selected.length, h, _, u;
                for (n.each(e.proxy(function (t, i) {
                    h = this._parse_model_from_html(e(i), s, l.parents.concat()), h && (a.push(h), d.push(h), o[h].children_d.length && (d = d.concat(o[h].children_d)))
                }, this)), l.children = a, l.children_d = d, _ = 0, u = l.parents.length; u > _; _++) o[l.parents[_]].children_d = o[l.parents[_]].children_d.concat(d);
                this.trigger("model", {
                    nodes: d,
                    parent: s
                }), "#" !== s ? (this._node_changed(s), this.redraw()) : (this.get_container_ul().children(".jstree-initial-node").remove(), this.redraw(!0)), this._data.core.selected.length !== c && this.trigger("changed", {
                    action: "model",
                    selected: this._data.core.selected
                }), r.call(this, !0)
            }, _append_json_data: function (t, i, r) {
                t = this.get_node(t), t.children = [], t.children_d = [], i.d && (i = i.d, "string" == typeof i && (i = JSON.parse(i))), e.isArray(i) || (i = [i]);
                var n = null, s = {
                    df: this._model.default_state,
                    dat: i,
                    par: t.id,
                    m: this._model.data,
                    t_id: this._id,
                    t_cnt: this._cnt,
                    sel: this._data.core.selected
                }, a = function (e, t) {
                    e.data && (e = e.data);
                    var i = e.dat, r = e.par, n = [], s = [], a = [], d = e.df, o = e.t_id, l = e.t_cnt, c = e.m,
                        h = c[r], _ = e.sel, u, g, f, p, m = function (e, i, r) {
                            r = r ? r.concat() : [], i && r.unshift(i);
                            var n = "" + e.id, s, o, l, h, _ = {
                                id: n,
                                text: e.text || "",
                                icon: e.icon !== t ? e.icon : !0,
                                parent: i,
                                parents: r,
                                children: e.children || [],
                                children_d: e.children_d || [],
                                data: e.data,
                                state: {},
                                li_attr: {id: !1},
                                a_attr: {href: "#"},
                                original: !1
                            };
                            for (s in d) d.hasOwnProperty(s) && (_.state[s] = d[s]);
                            if (e && e.data && e.data.jstree && e.data.jstree.icon && (_.icon = e.data.jstree.icon), e && e.data && (_.data = e.data, e.data.jstree)) for (s in e.data.jstree) e.data.jstree.hasOwnProperty(s) && (_.state[s] = e.data.jstree[s]);
                            if (e && "object" == typeof e.state) for (s in e.state) e.state.hasOwnProperty(s) && (_.state[s] = e.state[s]);
                            if (e && "object" == typeof e.li_attr) for (s in e.li_attr) e.li_attr.hasOwnProperty(s) && (_.li_attr[s] = e.li_attr[s]);
                            if (_.li_attr.id || (_.li_attr.id = n), e && "object" == typeof e.a_attr) for (s in e.a_attr) e.a_attr.hasOwnProperty(s) && (_.a_attr[s] = e.a_attr[s]);
                            for (e && e.children && e.children === !0 && (_.state.loaded = !1, _.children = [], _.children_d = []), c[_.id] = _, s = 0, o = _.children.length; o > s; s++) l = m(c[_.children[s]], _.id, r), h = c[l], _.children_d.push(l), h.children_d.length && (_.children_d = _.children_d.concat(h.children_d));
                            return delete e.data, delete e.children, c[_.id].original = e, _.state.selected && a.push(_.id), _.id
                        }, v = function (e, i, r) {
                            r = r ? r.concat() : [], i && r.unshift(i);
                            var n = !1, s, h, _, u, g;
                            do n = "j" + o + "_" + ++l; while (c[n]);
                            g = {
                                id: !1,
                                text: "string" == typeof e ? e : "",
                                icon: "object" == typeof e && e.icon !== t ? e.icon : !0,
                                parent: i,
                                parents: r,
                                children: [],
                                children_d: [],
                                data: null,
                                state: {},
                                li_attr: {id: !1},
                                a_attr: {href: "#"},
                                original: !1
                            };
                            for (s in d) d.hasOwnProperty(s) && (g.state[s] = d[s]);
                            if (e && e.id && (g.id = "" + e.id), e && e.text && (g.text = e.text), e && e.data && e.data.jstree && e.data.jstree.icon && (g.icon = e.data.jstree.icon), e && e.data && (g.data = e.data, e.data.jstree)) for (s in e.data.jstree) e.data.jstree.hasOwnProperty(s) && (g.state[s] = e.data.jstree[s]);
                            if (e && "object" == typeof e.state) for (s in e.state) e.state.hasOwnProperty(s) && (g.state[s] = e.state[s]);
                            if (e && "object" == typeof e.li_attr) for (s in e.li_attr) e.li_attr.hasOwnProperty(s) && (g.li_attr[s] = e.li_attr[s]);
                            if (g.li_attr.id && !g.id && (g.id = "" + g.li_attr.id), g.id || (g.id = n), g.li_attr.id || (g.li_attr.id = g.id), e && "object" == typeof e.a_attr) for (s in e.a_attr) e.a_attr.hasOwnProperty(s) && (g.a_attr[s] = e.a_attr[s]);
                            if (e && e.children && e.children.length) {
                                for (s = 0, h = e.children.length; h > s; s++) _ = v(e.children[s], g.id, r), u = c[_], g.children.push(_), u.children_d.length && (g.children_d = g.children_d.concat(u.children_d));
                                g.children_d = g.children_d.concat(g.children)
                            }
                            return e && e.children && e.children === !0 && (g.state.loaded = !1, g.children = [], g.children_d = []), delete e.data, delete e.children, g.original = e, c[g.id] = g, g.state.selected && a.push(g.id), g.id
                        };
                    if (i.length && i[0].id !== t && i[0].parent !== t) {
                        for (g = 0, f = i.length; f > g; g++) i[g].children || (i[g].children = []), c["" + i[g].id] = i[g];
                        for (g = 0, f = i.length; f > g; g++) c["" + i[g].parent].children.push("" + i[g].id), h.children_d.push("" + i[g].id);
                        for (g = 0, f = h.children.length; f > g; g++) u = m(c[h.children[g]], r, h.parents.concat()), s.push(u), c[u].children_d.length && (s = s.concat(c[u].children_d));
                        p = {cnt: l, mod: c, sel: _, par: r, dpc: s, add: a}
                    } else {
                        for (g = 0, f = i.length; f > g; g++) u = v(i[g], r, h.parents.concat()), u && (n.push(u), s.push(u), c[u].children_d.length && (s = s.concat(c[u].children_d)));
                        for (h.children = n, h.children_d = s, g = 0, f = h.parents.length; f > g; g++) c[h.parents[g]].children_d = c[h.parents[g]].children_d.concat(s);
                        p = {cnt: l, mod: c, sel: _, par: r, dpc: s, add: a}
                    }
                    return p
                }, d = function (t, i) {
                    if (this._cnt = t.cnt, this._model.data = t.mod, i) {
                        var n, s, a = t.add, d = t.sel, o = this._data.core.selected.slice(), l = this._model.data;
                        if (d.length !== o.length || e.vakata.array_unique(d.concat(o)).length !== d.length) {
                            for (n = 0, s = d.length; s > n; n++) -1 === e.inArray(d[n], a) && -1 === e.inArray(d[n], o) && (l[d[n]].state.selected = !1);
                            for (n = 0, s = o.length; s > n; n++) -1 === e.inArray(o[n], d) && (l[o[n]].state.selected = !0)
                        }
                    }
                    t.add.length && (this._data.core.selected = this._data.core.selected.concat(t.add)), this.trigger("model", {
                        nodes: t.dpc,
                        parent: t.par
                    }), "#" !== t.par ? (this._node_changed(t.par), this.redraw()) : this.redraw(!0), t.add.length && this.trigger("changed", {
                        action: "model",
                        selected: this._data.core.selected
                    }), r.call(this, !0)
                };
                if (this.settings.core.worker && window.Blob && window.URL && window.Worker) try {
                    null === this._wrk && (this._wrk = window.URL.createObjectURL(new window.Blob(["self.onmessage = " + ("" + a).replace(/return ([^;}]+)[\s;}]+$/, "postMessage($1);}")], {type: "text/javascript"}))), n = new window.Worker(this._wrk), n.onmessage = e.proxy(function (e) {
                        d.call(this, e.data, !0)
                    }, this), n.postMessage(s)
                } catch (o) {
                    d.call(this, a(s), !1)
                } else d.call(this, a(s), !1)
            }, _parse_model_from_html: function (i, r, n) {
                n = n ? [].concat(n) : [], r && n.unshift(r);
                var s, a, d = this._model.data, o = {
                    id: !1,
                    text: !1,
                    icon: !0,
                    parent: r,
                    parents: n,
                    children: [],
                    children_d: [],
                    data: null,
                    state: {},
                    li_attr: {id: !1},
                    a_attr: {href: "#"},
                    original: !1
                }, l, c, h;
                for (l in this._model.default_state) this._model.default_state.hasOwnProperty(l) && (o.state[l] = this._model.default_state[l]);
                if (c = e.vakata.attributes(i, !0), e.each(c, function (i, r) {
                    return r = e.trim(r), r.length ? (o.li_attr[i] = r, "id" === i && (o.id = "" + r), t) : !0
                }), c = i.children("a").eq(0), c.length && (c = e.vakata.attributes(c, !0), e.each(c, function (t, i) {
                    i = e.trim(i), i.length && (o.a_attr[t] = i)
                })), c = i.children("a:eq(0)").length ? i.children("a:eq(0)").clone() : i.clone(), c.children("ins, i, ul").remove(), c = c.html(), c = e("<div />").html(c), o.text = c.html(), c = i.data(), o.data = c ? e.extend(!0, {}, c) : null, o.state.opened = i.hasClass("jstree-open"), o.state.selected = i.children("a").hasClass("jstree-clicked"), o.state.disabled = i.children("a").hasClass("jstree-disabled"), o.data && o.data.jstree) for (l in o.data.jstree) o.data.jstree.hasOwnProperty(l) && (o.state[l] = o.data.jstree[l]);
                c = i.children("a").children(".jstree-themeicon"), c.length && (o.icon = c.hasClass("jstree-themeicon-hidden") ? !1 : c.attr("rel")), o.state.icon && (o.icon = o.state.icon), c = i.children("ul").children("li");
                do h = "j" + this._id + "_" + ++this._cnt; while (d[h]);
                return o.id = o.li_attr.id ? "" + o.li_attr.id : h, c.length ? (c.each(e.proxy(function (t, i) {
                    s = this._parse_model_from_html(e(i), o.id, n), a = this._model.data[s], o.children.push(s), a.children_d.length && (o.children_d = o.children_d.concat(a.children_d))
                }, this)), o.children_d = o.children_d.concat(o.children)) : i.hasClass("jstree-closed") && (o.state.loaded = !1), o.li_attr["class"] && (o.li_attr["class"] = o.li_attr["class"].replace("jstree-closed", "").replace("jstree-open", "")), o.a_attr["class"] && (o.a_attr["class"] = o.a_attr["class"].replace("jstree-clicked", "").replace("jstree-disabled", "")), d[o.id] = o, o.state.selected && this._data.core.selected.push(o.id), o.id
            }, _parse_model_from_flat_json: function (e, i, r) {
                r = r ? r.concat() : [], i && r.unshift(i);
                var n = "" + e.id, s = this._model.data, a = this._model.default_state, d, o, l, c, h = {
                    id: n,
                    text: e.text || "",
                    icon: e.icon !== t ? e.icon : !0,
                    parent: i,
                    parents: r,
                    children: e.children || [],
                    children_d: e.children_d || [],
                    data: e.data,
                    state: {},
                    li_attr: {id: !1},
                    a_attr: {href: "#"},
                    original: !1
                };
                for (d in a) a.hasOwnProperty(d) && (h.state[d] = a[d]);
                if (e && e.data && e.data.jstree && e.data.jstree.icon && (h.icon = e.data.jstree.icon), e && e.data && (h.data = e.data, e.data.jstree)) for (d in e.data.jstree) e.data.jstree.hasOwnProperty(d) && (h.state[d] = e.data.jstree[d]);
                if (e && "object" == typeof e.state) for (d in e.state) e.state.hasOwnProperty(d) && (h.state[d] = e.state[d]);
                if (e && "object" == typeof e.li_attr) for (d in e.li_attr) e.li_attr.hasOwnProperty(d) && (h.li_attr[d] = e.li_attr[d]);
                if (h.li_attr.id || (h.li_attr.id = n), e && "object" == typeof e.a_attr) for (d in e.a_attr) e.a_attr.hasOwnProperty(d) && (h.a_attr[d] = e.a_attr[d]);
                for (e && e.children && e.children === !0 && (h.state.loaded = !1, h.children = [], h.children_d = []), s[h.id] = h, d = 0, o = h.children.length; o > d; d++) l = this._parse_model_from_flat_json(s[h.children[d]], h.id, r), c = s[l], h.children_d.push(l), c.children_d.length && (h.children_d = h.children_d.concat(c.children_d));
                return delete e.data, delete e.children, s[h.id].original = e, h.state.selected && this._data.core.selected.push(h.id), h.id
            }, _parse_model_from_json: function (e, i, r) {
                r = r ? r.concat() : [], i && r.unshift(i);
                var n = !1, s, a, d, o, l = this._model.data, c = this._model.default_state, h;
                do n = "j" + this._id + "_" + ++this._cnt; while (l[n]);
                h = {
                    id: !1,
                    text: "string" == typeof e ? e : "",
                    icon: "object" == typeof e && e.icon !== t ? e.icon : !0,
                    parent: i,
                    parents: r,
                    children: [],
                    children_d: [],
                    data: null,
                    state: {},
                    li_attr: {id: !1},
                    a_attr: {href: "#"},
                    original: !1
                };
                for (s in c) c.hasOwnProperty(s) && (h.state[s] = c[s]);
                if (e && e.id && (h.id = "" + e.id), e && e.text && (h.text = e.text), e && e.data && e.data.jstree && e.data.jstree.icon && (h.icon = e.data.jstree.icon), e && e.data && (h.data = e.data, e.data.jstree)) for (s in e.data.jstree) e.data.jstree.hasOwnProperty(s) && (h.state[s] = e.data.jstree[s]);
                if (e && "object" == typeof e.state) for (s in e.state) e.state.hasOwnProperty(s) && (h.state[s] = e.state[s]);
                if (e && "object" == typeof e.li_attr) for (s in e.li_attr) e.li_attr.hasOwnProperty(s) && (h.li_attr[s] = e.li_attr[s]);
                if (h.li_attr.id && !h.id && (h.id = "" + h.li_attr.id), h.id || (h.id = n), h.li_attr.id || (h.li_attr.id = h.id), e && "object" == typeof e.a_attr) for (s in e.a_attr) e.a_attr.hasOwnProperty(s) && (h.a_attr[s] = e.a_attr[s]);
                if (e && e.children && e.children.length) {
                    for (s = 0, a = e.children.length; a > s; s++) d = this._parse_model_from_json(e.children[s], h.id, r), o = l[d], h.children.push(d), o.children_d.length && (h.children_d = h.children_d.concat(o.children_d));
                    h.children_d = h.children_d.concat(h.children)
                }
                return e && e.children && e.children === !0 && (h.state.loaded = !1, h.children = [], h.children_d = []), delete e.data, delete e.children, h.original = e, l[h.id] = h, h.state.selected && this._data.core.selected.push(h.id), h.id
            }, _redraw: function () {
                var e = this._model.force_full_redraw ? this._model.data["#"].children.concat([]) : this._model.changed.concat([]),
                    t = document.createElement("UL"), i, r, n;
                for (r = 0, n = e.length; n > r; r++) i = this.redraw_node(e[r], !0, this._model.force_full_redraw), i && this._model.force_full_redraw && t.appendChild(i);
                this._model.force_full_redraw && (t.className = this.get_container_ul()[0].className, this.element.empty().append(t)), this._model.force_full_redraw = !1, this._model.changed = [], this.trigger("redraw", {nodes: e})
            }, redraw: function (e) {
                e && (this._model.force_full_redraw = !0), this._redraw()
            }, redraw_node: function (t, i, r) {
                var n = this.get_node(t), s = !1, a = !1, d = !1, o = !1, c = !1, h = !1, _ = "", u = document,
                    g = this._model.data, f = !1, p = !1, m = null;
                if (!n) return !1;
                if ("#" === n.id) return this.redraw(!0);
                if (i = i || 0 === n.children.length, t = document.querySelector ? this.element[0].querySelector("#" + (-1 !== "0123456789".indexOf(n.id[0]) ? "\\3" + n.id[0] + " " + n.id.substr(1).replace(e.jstree.idregex, "\\$&") : n.id.replace(e.jstree.idregex, "\\$&"))) : document.getElementById(n.id)) t = e(t), r || (s = t.parent().parent()[0], s === this.element[0] && (s = null), a = t.index()), i || !n.children.length || t.children(".jstree-children").length || (i = !0), i || (d = t.children(".jstree-children")[0]), p = t.attr("aria-selected"), f = t.children(".jstree-anchor")[0] === document.activeElement, t.remove(); else if (i = !0, !r) {
                    if (s = "#" !== n.parent ? e("#" + n.parent.replace(e.jstree.idregex, "\\$&"), this.element)[0] : null, !(null === s || s && g[n.parent].state.opened)) return !1;
                    a = e.inArray(n.id, null === s ? g["#"].children : g[n.parent].children)
                }
                t = l.cloneNode(!0), _ = "jstree-node ";
                for (o in n.li_attr) if (n.li_attr.hasOwnProperty(o)) {
                    if ("id" === o) continue;
                    "class" !== o ? t.setAttribute(o, n.li_attr[o]) : _ += n.li_attr[o]
                }
                p && "false" !== p && t.setAttribute("aria-selected", !0), n.state.loaded && !n.children.length ? _ += " jstree-leaf" : (_ += n.state.opened && n.state.loaded ? " jstree-open" : " jstree-closed", t.setAttribute("aria-expanded", n.state.opened && n.state.loaded)), null !== n.parent && g[n.parent].children[g[n.parent].children.length - 1] === n.id && (_ += " jstree-last"), t.id = n.id, t.className = _, _ = (n.state.selected ? " jstree-clicked" : "") + (n.state.disabled ? " jstree-disabled" : "");
                for (c in n.a_attr) if (n.a_attr.hasOwnProperty(c)) {
                    if ("href" === c && "#" === n.a_attr[c]) continue;
                    "class" !== c ? t.childNodes[1].setAttribute(c, n.a_attr[c]) : _ += " " + n.a_attr[c]
                }
                if (_.length && (t.childNodes[1].className = "jstree-anchor " + _), (n.icon && n.icon !== !0 || n.icon === !1) && (n.icon === !1 ? t.childNodes[1].childNodes[0].className += " jstree-themeicon-hidden" : -1 === n.icon.indexOf("/") && -1 === n.icon.indexOf(".") ? t.childNodes[1].childNodes[0].className += " " + n.icon + " jstree-themeicon-custom" : (t.childNodes[1].childNodes[0].style.backgroundImage = "url(" + n.icon + ")", t.childNodes[1].childNodes[0].style.backgroundPosition = "center center", t.childNodes[1].childNodes[0].style.backgroundSize = "auto", t.childNodes[1].childNodes[0].className += " jstree-themeicon-custom")), t.childNodes[1].innerHTML += n.text, i && n.children.length && n.state.opened && n.state.loaded) {
                    for (h = u.createElement("UL"), h.setAttribute("role", "group"), h.className = "jstree-children", o = 0, c = n.children.length; c > o; o++) h.appendChild(this.redraw_node(n.children[o], i, !0));
                    t.appendChild(h)
                }
                if (d && t.appendChild(d), !r) {
                    for (s || (s = this.element[0]), o = 0, c = s.childNodes.length; c > o; o++) if (s.childNodes[o] && s.childNodes[o].className && -1 !== s.childNodes[o].className.indexOf("jstree-children")) {
                        m = s.childNodes[o];
                        break
                    }
                    m || (m = u.createElement("UL"), m.setAttribute("role", "group"), m.className = "jstree-children", s.appendChild(m)), s = m, s.childNodes.length > a ? s.insertBefore(t, s.childNodes[a]) : s.appendChild(t), f && t.childNodes[1].focus()
                }
                return n.state.opened && !n.state.loaded && (n.state.opened = !1, setTimeout(e.proxy(function () {
                    this.open_node(n.id, !1, 0)
                }, this), 0)), t
            }, open_node: function (i, r, n) {
                var s, a, d, o;
                if (e.isArray(i)) {
                    for (i = i.slice(), s = 0, a = i.length; a > s; s++) this.open_node(i[s], r, n);
                    return !0
                }
                if (i = this.get_node(i), !i || "#" === i.id) return !1;
                if (n = n === t ? this.settings.core.animation : n, !this.is_closed(i)) return r && r.call(this, i, !1), !1;
                if (this.is_loaded(i)) d = this.get_node(i, !0), o = this, d.length && (i.children.length && !this._firstChild(d.children(".jstree-children")[0]) && (i.state.opened = !0, this.redraw_node(i, !0), d = this.get_node(i, !0)), n ? (this.trigger("before_open", {node: i}), d.children(".jstree-children").css("display", "none").end().removeClass("jstree-closed").addClass("jstree-open").attr("aria-expanded", !0).children(".jstree-children").stop(!0, !0).slideDown(n, function () {
                    this.style.display = "", o.trigger("after_open", {node: i})
                })) : (this.trigger("before_open", {node: i}), d[0].className = d[0].className.replace("jstree-closed", "jstree-open"), d[0].setAttribute("aria-expanded", !0))), i.state.opened = !0, r && r.call(this, i, !0), d.length || this.trigger("before_open", {node: i}), this.trigger("open_node", {node: i}), n && d.length || this.trigger("after_open", {node: i}); else {
                    if (this.is_loading(i)) return setTimeout(e.proxy(function () {
                        this.open_node(i, r, n)
                    }, this), 500);
                    this.load_node(i, function (e, t) {
                        return t ? this.open_node(e, r, n) : r ? r.call(this, e, !1) : !1
                    })
                }
            }, _open_to: function (t) {
                if (t = this.get_node(t), !t || "#" === t.id) return !1;
                var i, r, n = t.parents;
                for (i = 0, r = n.length; r > i; i += 1) "#" !== i && this.open_node(n[i], !1, 0);
                return e("#" + t.id.replace(e.jstree.idregex, "\\$&"), this.element)
            }, close_node: function (i, r) {
                var n, s, a, d;
                if (e.isArray(i)) {
                    for (i = i.slice(), n = 0, s = i.length; s > n; n++) this.close_node(i[n], r);
                    return !0
                }
                return i = this.get_node(i), i && "#" !== i.id ? this.is_closed(i) ? !1 : (r = r === t ? this.settings.core.animation : r, a = this, d = this.get_node(i, !0), d.length && (r ? d.children(".jstree-children").attr("style", "display:block !important").end().removeClass("jstree-open").addClass("jstree-closed").attr("aria-expanded", !1).children(".jstree-children").stop(!0, !0).slideUp(r, function () {
                    this.style.display = "", d.children(".jstree-children").remove(), a.trigger("after_close", {node: i})
                }) : (d[0].className = d[0].className.replace("jstree-open", "jstree-closed"), d.attr("aria-expanded", !1).children(".jstree-children").remove())), i.state.opened = !1, this.trigger("close_node", {node: i}), r && d.length || this.trigger("after_close", {node: i}), t) : !1
            }, toggle_node: function (i) {
                var r, n;
                if (e.isArray(i)) {
                    for (i = i.slice(), r = 0, n = i.length; n > r; r++) this.toggle_node(i[r]);
                    return !0
                }
                return this.is_closed(i) ? this.open_node(i) : this.is_open(i) ? this.close_node(i) : t
            }, open_all: function (e, t, i) {
                if (e || (e = "#"), e = this.get_node(e), !e) return !1;
                var r = "#" === e.id ? this.get_container_ul() : this.get_node(e, !0), n, s, a;
                if (!r.length) {
                    for (n = 0, s = e.children_d.length; s > n; n++) this.is_closed(this._model.data[e.children_d[n]]) && (this._model.data[e.children_d[n]].state.opened = !0);
                    return this.trigger("open_all", {node: e})
                }
                i = i || r, a = this, r = this.is_closed(e) ? r.find(".jstree-closed").addBack() : r.find(".jstree-closed"), r.each(function () {
                    a.open_node(this, function (e, r) {
                        r && this.is_parent(e) && this.open_all(e, t, i)
                    }, t || 0)
                }), 0 === i.find(".jstree-closed").length && this.trigger("open_all", {node: this.get_node(i)})
            }, close_all: function (t, i) {
                if (t || (t = "#"), t = this.get_node(t), !t) return !1;
                var r = "#" === t.id ? this.get_container_ul() : this.get_node(t, !0), n = this, s, a;
                if (!r.length) {
                    for (s = 0, a = t.children_d.length; a > s; s++) this._model.data[t.children_d[s]].state.opened = !1;
                    return this.trigger("close_all", {node: t})
                }
                r = this.is_open(t) ? r.find(".jstree-open").addBack() : r.find(".jstree-open"), e(r.get().reverse()).each(function () {
                    n.close_node(this, i || 0)
                }), this.trigger("close_all", {node: t})
            }, is_disabled: function (e) {
                return e = this.get_node(e), e && e.state && e.state.disabled
            }, enable_node: function (i) {
                var r, n;
                if (e.isArray(i)) {
                    for (i = i.slice(), r = 0, n = i.length; n > r; r++) this.enable_node(i[r]);
                    return !0
                }
                return i = this.get_node(i), i && "#" !== i.id ? (i.state.disabled = !1, this.get_node(i, !0).children(".jstree-anchor").removeClass("jstree-disabled"), this.trigger("enable_node", {node: i}), t) : !1
            }, disable_node: function (i) {
                var r, n;
                if (e.isArray(i)) {
                    for (i = i.slice(), r = 0, n = i.length; n > r; r++) this.disable_node(i[r]);
                    return !0
                }
                return i = this.get_node(i), i && "#" !== i.id ? (i.state.disabled = !0, this.get_node(i, !0).children(".jstree-anchor").addClass("jstree-disabled"), this.trigger("disable_node", {node: i}), t) : !1
            }, activate_node: function (e, i) {
                if (this.is_disabled(e)) return !1;
                if (this._data.core.last_clicked = this._data.core.last_clicked && this._data.core.last_clicked.id !== t ? this.get_node(this._data.core.last_clicked.id) : null, this._data.core.last_clicked && !this._data.core.last_clicked.state.selected && (this._data.core.last_clicked = null), !this._data.core.last_clicked && this._data.core.selected.length && (this._data.core.last_clicked = this.get_node(this._data.core.selected[this._data.core.selected.length - 1])), this.settings.core.multiple && (i.metaKey || i.ctrlKey || i.shiftKey) && (!i.shiftKey || this._data.core.last_clicked && this.get_parent(e) && this.get_parent(e) === this._data.core.last_clicked.parent)) if (i.shiftKey) {
                    var r = this.get_node(e).id, n = this._data.core.last_clicked.id,
                        s = this.get_node(this._data.core.last_clicked.parent).children, a = !1, d, o;
                    for (d = 0, o = s.length; o > d; d += 1) s[d] === r && (a = !a), s[d] === n && (a = !a), a || s[d] === r || s[d] === n ? this.select_node(s[d], !1, !1, i) : this.deselect_node(s[d], !1, !1, i)
                } else this.is_selected(e) ? this.deselect_node(e, !1, !1, i) : this.select_node(e, !1, !1, i); else !this.settings.core.multiple && (i.metaKey || i.ctrlKey || i.shiftKey) && this.is_selected(e) ? this.deselect_node(e, !1, !1, i) : (this.deselect_all(!0), this.select_node(e, !1, !1, i), this._data.core.last_clicked = this.get_node(e));
                this.trigger("activate_node", {node: this.get_node(e)})
            }, hover_node: function (e) {
                if (e = this.get_node(e, !0), !e || !e.length || e.children(".jstree-hovered").length) return !1;
                var t = this.element.find(".jstree-hovered"), i = this.element;
                t && t.length && this.dehover_node(t), e.children(".jstree-anchor").addClass("jstree-hovered"), this.trigger("hover_node", {node: this.get_node(e)}), setTimeout(function () {
                    i.attr("aria-activedescendant", e[0].id), e.attr("aria-selected", !0)
                }, 0)
            }, dehover_node: function (e) {
                return e = this.get_node(e, !0), e && e.length && e.children(".jstree-hovered").length ? (e.attr("aria-selected", !1).children(".jstree-anchor").removeClass("jstree-hovered"), this.trigger("dehover_node", {node: this.get_node(e)}), t) : !1
            }, select_node: function (i, r, n, s) {
                var a, d, o, l;
                if (e.isArray(i)) {
                    for (i = i.slice(), d = 0, o = i.length; o > d; d++) this.select_node(i[d], r, n, s);
                    return !0
                }
                return i = this.get_node(i), i && "#" !== i.id ? (a = this.get_node(i, !0), i.state.selected || (i.state.selected = !0, this._data.core.selected.push(i.id), n || (a = this._open_to(i)), a && a.length && a.children(".jstree-anchor").addClass("jstree-clicked"), this.trigger("select_node", {
                    node: i,
                    selected: this._data.core.selected,
                    event: s
                }), r || this.trigger("changed", {
                    action: "select_node",
                    node: i,
                    selected: this._data.core.selected,
                    event: s
                })), t) : !1
            }, deselect_node: function (i, r, n) {
                var s, a, d;
                if (e.isArray(i)) {
                    for (i = i.slice(), s = 0, a = i.length; a > s; s++) this.deselect_node(i[s], r, n);
                    return !0
                }
                return i = this.get_node(i), i && "#" !== i.id ? (d = this.get_node(i, !0), i.state.selected && (i.state.selected = !1, this._data.core.selected = e.vakata.array_remove_item(this._data.core.selected, i.id), d.length && d.children(".jstree-anchor").removeClass("jstree-clicked"), this.trigger("deselect_node", {
                    node: i,
                    selected: this._data.core.selected,
                    event: n
                }), r || this.trigger("changed", {
                    action: "deselect_node",
                    node: i,
                    selected: this._data.core.selected,
                    event: n
                })), t) : !1
            }, select_all: function (e) {
                var t = this._data.core.selected.concat([]), i, r;
                for (this._data.core.selected = this._model.data["#"].children_d.concat(), i = 0, r = this._data.core.selected.length; r > i; i++) this._model.data[this._data.core.selected[i]] && (this._model.data[this._data.core.selected[i]].state.selected = !0);
                this.redraw(!0), this.trigger("select_all", {selected: this._data.core.selected}), e || this.trigger("changed", {
                    action: "select_all",
                    selected: this._data.core.selected,
                    old_selection: t
                })
            }, deselect_all: function (e) {
                var t = this._data.core.selected.concat([]), i, r;
                for (i = 0, r = this._data.core.selected.length; r > i; i++) this._model.data[this._data.core.selected[i]] && (this._model.data[this._data.core.selected[i]].state.selected = !1);
                this._data.core.selected = [], this.element.find(".jstree-clicked").removeClass("jstree-clicked"), this.trigger("deselect_all", {
                    selected: this._data.core.selected,
                    node: t
                }), e || this.trigger("changed", {
                    action: "deselect_all",
                    selected: this._data.core.selected,
                    old_selection: t
                })
            }, is_selected: function (e) {
                return e = this.get_node(e), e && "#" !== e.id ? e.state.selected : !1
            }, get_selected: function (t) {
                return t ? e.map(this._data.core.selected, e.proxy(function (e) {
                    return this.get_node(e)
                }, this)) : this._data.core.selected
            }, get_top_selected: function (t) {
                var i = this.get_selected(!0), r = {}, n, s, a, d;
                for (n = 0, s = i.length; s > n; n++) r[i[n].id] = i[n];
                for (n = 0, s = i.length; s > n; n++) for (a = 0, d = i[n].children_d.length; d > a; a++) r[i[n].children_d[a]] && delete r[i[n].children_d[a]];
                i = [];
                for (n in r) r.hasOwnProperty(n) && i.push(n);
                return t ? e.map(i, e.proxy(function (e) {
                    return this.get_node(e)
                }, this)) : i
            }, get_bottom_selected: function (t) {
                var i = this.get_selected(!0), r = [], n, s;
                for (n = 0, s = i.length; s > n; n++) i[n].children.length || r.push(i[n].id);
                return t ? e.map(r, e.proxy(function (e) {
                    return this.get_node(e)
                }, this)) : r
            }, get_state: function () {
                var e = {
                    core: {
                        open: [],
                        scroll: {left: this.element.scrollLeft(), top: this.element.scrollTop()},
                        selected: []
                    }
                }, t;
                for (t in this._model.data) this._model.data.hasOwnProperty(t) && "#" !== t && (this._model.data[t].state.opened && e.core.open.push(t), this._model.data[t].state.selected && e.core.selected.push(t));
                return e
            }, set_state: function (i, r) {
                if (i) {
                    if (i.core) {
                        var n, s, a, d;
                        if (i.core.open) return e.isArray(i.core.open) ? (n = !0, s = !1, a = this, e.each(i.core.open.concat([]), function (t, d) {
                            s = a.get_node(d), s && (a.is_loaded(d) ? (a.is_closed(d) && a.open_node(d, !1, 0), i && i.core && i.core.open && e.vakata.array_remove_item(i.core.open, d)) : (a.is_loading(d) || a.open_node(d, e.proxy(function (t, n) {
                                !n && i && i.core && i.core.open && e.vakata.array_remove_item(i.core.open, t.id), this.set_state(i, r)
                            }, a), 0), n = !1))
                        }), n && (delete i.core.open, this.set_state(i, r)), !1) : (delete i.core.open, this.set_state(i, r), !1);
                        if (i.core.scroll) return i.core.scroll && i.core.scroll.left !== t && this.element.scrollLeft(i.core.scroll.left), i.core.scroll && i.core.scroll.top !== t && this.element.scrollTop(i.core.scroll.top), delete i.core.scroll, this.set_state(i, r), !1;
                        if (i.core.selected) return d = this, this.deselect_all(), e.each(i.core.selected, function (e, t) {
                            d.select_node(t)
                        }), delete i.core.selected, this.set_state(i, r), !1;
                        if (e.isEmptyObject(i.core)) return delete i.core, this.set_state(i, r), !1
                    }
                    return e.isEmptyObject(i) ? (i = null, r && r.call(this), this.trigger("set_state"), !1) : !0
                }
                return !1
            }, refresh: function (t) {
                this._data.core.state = this.get_state(), this._cnt = 0, this._model.data = {
                    "#": {
                        id: "#",
                        parent: null,
                        parents: [],
                        children: [],
                        children_d: [],
                        state: {loaded: !1}
                    }
                };
                var i = this.get_container_ul()[0].className;
                t || this.element.html("<ul class='" + i + "'><" + "li class='jstree-initial-node jstree-loading jstree-leaf jstree-last'><i class='jstree-icon jstree-ocl'></i><" + "a class='jstree-anchor' href='#'><i class='jstree-icon jstree-themeicon-hidden'></i>" + this.get_string("Loading ...") + "</a></li></ul>"), this.load_node("#", function (t, r) {
                    r && (this.get_container_ul()[0].className = i, this.set_state(e.extend(!0, {}, this._data.core.state), function () {
                        this.trigger("refresh")
                    })), this._data.core.state = null
                })
            }, refresh_node: function (t) {
                if (t = this.get_node(t), !t || "#" === t.id) return !1;
                var i = [], r = this._data.core.selected.concat([]);
                t.state.opened === !0 && i.push(t.id), this.get_node(t, !0).find(".jstree-open").each(function () {
                    i.push(this.id)
                }), this._load_nodes(i, e.proxy(function (e) {
                    this.open_node(e, !1, 0), this.select_node(this._data.core.selected), this.trigger("refresh_node", {
                        node: t,
                        nodes: e
                    })
                }, this))
            }, set_id: function (t, i) {
                if (t = this.get_node(t), !t || "#" === t.id) return !1;
                var r, n, s = this._model.data;
                for (i = "" + i, s[t.parent].children[e.inArray(t.id, s[t.parent].children)] = i, r = 0, n = t.parents.length; n > r; r++) s[t.parents[r]].children_d[e.inArray(t.id, s[t.parents[r]].children_d)] = i;
                for (r = 0, n = t.children.length; n > r; r++) s[t.children[r]].parent = i;
                for (r = 0, n = t.children_d.length; n > r; r++) s[t.children_d[r]].parents[e.inArray(t.id, s[t.children_d[r]].parents)] = i;
                return r = e.inArray(t.id, this._data.core.selected), -1 !== r && (this._data.core.selected[r] = i), r = this.get_node(t.id, !0), r && r.attr("id", i), delete s[t.id], t.id = i, s[i] = t, !0
            }, get_text: function (e) {
                return e = this.get_node(e), e && "#" !== e.id ? e.text : !1
            }, set_text: function (t, i) {
                var r, n, s, a;
                if (e.isArray(t)) {
                    for (t = t.slice(), r = 0, n = t.length; n > r; r++) this.set_text(t[r], i);
                    return !0
                }
                return t = this.get_node(t), t && "#" !== t.id ? (t.text = i, s = this.get_node(t, !0), s.length && (s = s.children(".jstree-anchor:eq(0)"), a = s.children("I").clone(), s.html(i).prepend(a), this.trigger("set_text", {
                    obj: t,
                    text: i
                })), !0) : !1
            }, get_json: function (e, t, i) {
                if (e = this.get_node(e || "#"), !e) return !1;
                t && t.flat && !i && (i = []);
                var r = {
                    id: e.id,
                    text: e.text,
                    icon: this.get_icon(e),
                    li_attr: e.li_attr,
                    a_attr: e.a_attr,
                    state: {},
                    data: t && t.no_data ? !1 : e.data
                }, n, s;
                if (t && t.flat ? r.parent = e.parent : r.children = [], !t || !t.no_state) for (n in e.state) e.state.hasOwnProperty(n) && (r.state[n] = e.state[n]);
                if (t && t.no_id && (delete r.id, r.li_attr && r.li_attr.id && delete r.li_attr.id), t && t.flat && "#" !== e.id && i.push(r), !t || !t.no_children) for (n = 0, s = e.children.length; s > n; n++) t && t.flat ? this.get_json(e.children[n], t, i) : r.children.push(this.get_json(e.children[n], t));
                return t && t.flat ? i : "#" === e.id ? r.children : r
            }, create_node: function (i, r, n, s, a) {
                if (null === i && (i = "#"), i = this.get_node(i), !i) return !1;
                if (n = n === t ? "last" : n, !("" + n).match(/^(before|after)$/) && !a && !this.is_loaded(i)) return this.load_node(i, function () {
                    this.create_node(i, r, n, s, !0)
                });
                r || (r = {text: this.get_string("New node")}), r.text === t && (r.text = this.get_string("New node"));
                var d, o, l, c;
                switch ("#" === i.id && ("before" === n && (n = "first"), "after" === n && (n = "last")), n) {
                    case"before":
                        d = this.get_node(i.parent), n = e.inArray(i.id, d.children), i = d;
                        break;
                    case"after":
                        d = this.get_node(i.parent), n = e.inArray(i.id, d.children) + 1, i = d;
                        break;
                    case"inside":
                    case"first":
                        n = 0;
                        break;
                    case"last":
                        n = i.children.length;
                        break;
                    default:
                        n || (n = 0)
                }
                if (n > i.children.length && (n = i.children.length), r.id || (r.id = !0), !this.check("create_node", r, i, n)) return this.settings.core.error.call(this, this._data.core.last_error), !1;
                if (r.id === !0 && delete r.id, r = this._parse_model_from_json(r, i.id, i.parents.concat()), !r) return !1;
                for (d = this.get_node(r), o = [], o.push(r), o = o.concat(d.children_d), this.trigger("model", {
                    nodes: o,
                    parent: i.id
                }), i.children_d = i.children_d.concat(o), l = 0, c = i.parents.length; c > l; l++) this._model.data[i.parents[l]].children_d = this._model.data[i.parents[l]].children_d.concat(o);
                for (r = d, d = [], l = 0, c = i.children.length; c > l; l++) d[l >= n ? l + 1 : l] = i.children[l];
                return d[n] = r.id, i.children = d, this.redraw_node(i, !0), s && s.call(this, this.get_node(r)), this.trigger("create_node", {
                    node: this.get_node(r),
                    parent: i.id,
                    position: n
                }), r.id
            }, rename_node: function (t, i) {
                var r, n, s;
                if (e.isArray(t)) {
                    for (t = t.slice(), r = 0, n = t.length; n > r; r++) this.rename_node(t[r], i);
                    return !0
                }
                return t = this.get_node(t), t && "#" !== t.id ? (s = t.text, this.check("rename_node", t, this.get_parent(t), i) ? (this.set_text(t, i), this.trigger("rename_node", {
                    node: t,
                    text: i,
                    old: s
                }), !0) : (this.settings.core.error.call(this, this._data.core.last_error), !1)) : !1
            }, delete_node: function (t) {
                var i, r, n, s, a, d, o, l, c, h;
                if (e.isArray(t)) {
                    for (t = t.slice(), i = 0, r = t.length; r > i; i++) this.delete_node(t[i]);
                    return !0
                }
                if (t = this.get_node(t), !t || "#" === t.id) return !1;
                if (n = this.get_node(t.parent), s = e.inArray(t.id, n.children), h = !1, !this.check("delete_node", t, n, s)) return this.settings.core.error.call(this, this._data.core.last_error), !1;
                for (-1 !== s && (n.children = e.vakata.array_remove(n.children, s)), a = t.children_d.concat([]), a.push(t.id), l = 0, c = a.length; c > l; l++) {
                    for (d = 0, o = t.parents.length; o > d; d++) s = e.inArray(a[l], this._model.data[t.parents[d]].children_d), -1 !== s && (this._model.data[t.parents[d]].children_d = e.vakata.array_remove(this._model.data[t.parents[d]].children_d, s));
                    this._model.data[a[l]].state.selected && (h = !0, s = e.inArray(a[l], this._data.core.selected), -1 !== s && (this._data.core.selected = e.vakata.array_remove(this._data.core.selected, s)))
                }
                for (this.trigger("delete_node", {
                    node: t,
                    parent: n.id
                }), h && this.trigger("changed", {
                    action: "delete_node",
                    node: t,
                    selected: this._data.core.selected,
                    parent: n.id
                }), l = 0, c = a.length; c > l; l++) delete this._model.data[a[l]];
                return this.redraw_node(n, !0), !0
            }, check: function (t, i, r, n, s) {
                i = i && i.id ? i : this.get_node(i), r = r && r.id ? r : this.get_node(r);
                var a = t.match(/^move_node|copy_node|create_node$/i) ? r : i, d = this.settings.core.check_callback;
                return "move_node" !== t && "copy_node" !== t || s && s.is_multi || i.id !== r.id && e.inArray(i.id, r.children) !== n && -1 === e.inArray(r.id, i.children_d) ? (a && a.data && (a = a.data), a && a.functions && (a.functions[t] === !1 || a.functions[t] === !0) ? (a.functions[t] === !1 && (this._data.core.last_error = {
                    error: "check",
                    plugin: "core",
                    id: "core_02",
                    reason: "Node data prevents function: " + t,
                    data: JSON.stringify({chk: t, pos: n, obj: i && i.id ? i.id : !1, par: r && r.id ? r.id : !1})
                }), a.functions[t]) : d === !1 || e.isFunction(d) && d.call(this, t, i, r, n, s) === !1 || d && d[t] === !1 ? (this._data.core.last_error = {
                    error: "check",
                    plugin: "core",
                    id: "core_03",
                    reason: "User config for core.check_callback prevents function: " + t,
                    data: JSON.stringify({chk: t, pos: n, obj: i && i.id ? i.id : !1, par: r && r.id ? r.id : !1})
                }, !1) : !0) : (this._data.core.last_error = {
                    error: "check",
                    plugin: "core",
                    id: "core_01",
                    reason: "Moving parent inside child",
                    data: JSON.stringify({chk: t, pos: n, obj: i && i.id ? i.id : !1, par: r && r.id ? r.id : !1})
                }, !1)
            }, last_error: function () {
                return this._data.core.last_error
            }, move_node: function (i, r, n, s, a) {
                var d, o, l, c, h, _, u, g, f, p, m, v, j, y;
                if (e.isArray(i)) {
                    for (i = i.reverse().slice(), d = 0, o = i.length; o > d; d++) this.move_node(i[d], r, n, s, a);
                    return !0
                }
                if (i = i && i.id ? i : this.get_node(i), r = this.get_node(r), n = n === t ? 0 : n, !r || !i || "#" === i.id) return !1;
                if (!("" + n).match(/^(before|after)$/) && !a && !this.is_loaded(r)) return this.load_node(r, function () {
                    this.move_node(i, r, n, s, !0)
                });
                if (l = "" + (i.parent || "#"), h = ("" + n).match(/^(before|after)$/) && "#" !== r.id ? this.get_node(r.parent) : r, _ = i.instance ? i.instance : this._model.data[i.id] ? this : e.jstree.reference(i.id), u = !_ || !_._id || this._id !== _._id, c = _ && _._id && l && _._model.data[l] && _._model.data[l].children ? e.inArray(i.id, _._model.data[l].children) : -1, u) return this.copy_node(i, r, n, s, a) ? (_ && _.delete_node(i), !0) : !1;
                switch ("#" === h.id && ("before" === n && (n = "first"), "after" === n && (n = "last")), n) {
                    case"before":
                        n = e.inArray(r.id, h.children);
                        break;
                    case"after":
                        n = e.inArray(r.id, h.children) + 1;
                        break;
                    case"inside":
                    case"first":
                        n = 0;
                        break;
                    case"last":
                        n = h.children.length;
                        break;
                    default:
                        n || (n = 0)
                }
                if (n > h.children.length && (n = h.children.length), !this.check("move_node", i, h, n, {
                    core: !0,
                    is_multi: _ && _._id && _._id !== this._id,
                    is_foreign: !_ || !_._id
                })) return this.settings.core.error.call(this, this._data.core.last_error), !1;
                if (i.parent === h.id) {
                    for (g = h.children.concat(), f = e.inArray(i.id, g), -1 !== f && (g = e.vakata.array_remove(g, f), n > f && n--), f = [], p = 0, m = g.length; m > p; p++) f[p >= n ? p + 1 : p] = g[p];
                    f[n] = i.id, h.children = f, this._node_changed(h.id), this.redraw("#" === h.id)
                } else {
                    for (f = i.children_d.concat(), f.push(i.id), p = 0, m = i.parents.length; m > p; p++) {
                        for (g = [], y = _._model.data[i.parents[p]].children_d, v = 0, j = y.length; j > v; v++) -1 === e.inArray(y[v], f) && g.push(y[v]);
                        _._model.data[i.parents[p]].children_d = g
                    }
                    for (_._model.data[l].children = e.vakata.array_remove_item(_._model.data[l].children, i.id), p = 0, m = h.parents.length; m > p; p++) this._model.data[h.parents[p]].children_d = this._model.data[h.parents[p]].children_d.concat(f);
                    for (g = [], p = 0, m = h.children.length; m > p; p++) g[p >= n ? p + 1 : p] = h.children[p];
                    for (g[n] = i.id, h.children = g, h.children_d.push(i.id), h.children_d = h.children_d.concat(i.children_d), i.parent = h.id, f = h.parents.concat(), f.unshift(h.id), y = i.parents.length, i.parents = f, f = f.concat(), p = 0, m = i.children_d.length; m > p; p++) this._model.data[i.children_d[p]].parents = this._model.data[i.children_d[p]].parents.slice(0, -1 * y), Array.prototype.push.apply(this._model.data[i.children_d[p]].parents, f);
                    this._node_changed(l), this._node_changed(h.id), this.redraw("#" === l || "#" === h.id)
                }
                return s && s.call(this, i, h, n), this.trigger("move_node", {
                    node: i,
                    parent: h.id,
                    position: n,
                    old_parent: l,
                    old_position: c,
                    is_multi: _ && _._id && _._id !== this._id,
                    is_foreign: !_ || !_._id,
                    old_instance: _,
                    new_instance: this
                }), !0
            }, copy_node: function (i, r, n, s, a) {
                var d, o, l, c, h, _, u, g, f, p, m;
                if (e.isArray(i)) {
                    for (i = i.reverse().slice(), d = 0, o = i.length; o > d; d++) this.copy_node(i[d], r, n, s, a);
                    return !0
                }
                if (i = i && i.id ? i : this.get_node(i), r = this.get_node(r), n = n === t ? 0 : n, !r || !i || "#" === i.id) return !1;
                if (!("" + n).match(/^(before|after)$/) && !a && !this.is_loaded(r)) return this.load_node(r, function () {
                    this.copy_node(i, r, n, s, !0)
                });
                switch (g = "" + (i.parent || "#"), f = ("" + n).match(/^(before|after)$/) && "#" !== r.id ? this.get_node(r.parent) : r, p = i.instance ? i.instance : this._model.data[i.id] ? this : e.jstree.reference(i.id), m = !p || !p._id || this._id !== p._id, "#" === f.id && ("before" === n && (n = "first"), "after" === n && (n = "last")), n) {
                    case"before":
                        n = e.inArray(r.id, f.children);
                        break;
                    case"after":
                        n = e.inArray(r.id, f.children) + 1;
                        break;
                    case"inside":
                    case"first":
                        n = 0;
                        break;
                    case"last":
                        n = f.children.length;
                        break;
                    default:
                        n || (n = 0)
                }
                if (n > f.children.length && (n = f.children.length), !this.check("copy_node", i, f, n, {
                    core: !0,
                    is_multi: p && p._id && p._id !== this._id,
                    is_foreign: !p || !p._id
                })) return this.settings.core.error.call(this, this._data.core.last_error), !1;
                if (u = p ? p.get_json(i, {no_id: !0, no_data: !0, no_state: !0}) : i, !u) return !1;
                if (u.id === !0 && delete u.id, u = this._parse_model_from_json(u, f.id, f.parents.concat()), !u) return !1;
                for (c = this.get_node(u), i && i.state && i.state.loaded === !1 && (c.state.loaded = !1), l = [], l.push(u), l = l.concat(c.children_d), this.trigger("model", {
                    nodes: l,
                    parent: f.id
                }), h = 0, _ = f.parents.length; _ > h; h++) this._model.data[f.parents[h]].children_d = this._model.data[f.parents[h]].children_d.concat(l);
                for (l = [], h = 0, _ = f.children.length; _ > h; h++) l[h >= n ? h + 1 : h] = f.children[h];
                return l[n] = c.id, f.children = l, f.children_d.push(c.id), f.children_d = f.children_d.concat(c.children_d), this._node_changed(f.id), this.redraw("#" === f.id), s && s.call(this, c, f, n), this.trigger("copy_node", {
                    node: c,
                    original: i,
                    parent: f.id,
                    position: n,
                    old_parent: g,
                    old_position: p && p._id && g && p._model.data[g] && p._model.data[g].children ? e.inArray(i.id, p._model.data[g].children) : -1,
                    is_multi: p && p._id && p._id !== this._id,
                    is_foreign: !p || !p._id,
                    old_instance: p,
                    new_instance: this
                }), c.id
            }, cut: function (i) {
                if (i || (i = this._data.core.selected.concat()), e.isArray(i) || (i = [i]), !i.length) return !1;
                var a = [], d, o, l;
                for (o = 0, l = i.length; l > o; o++) d = this.get_node(i[o]), d && d.id && "#" !== d.id && a.push(d);
                return a.length ? (r = a, s = this, n = "move_node", this.trigger("cut", {node: i}), t) : !1
            }, copy: function (i) {
                if (i || (i = this._data.core.selected.concat()), e.isArray(i) || (i = [i]), !i.length) return !1;
                var a = [], d, o, l;
                for (o = 0, l = i.length; l > o; o++) d = this.get_node(i[o]), d && d.id && "#" !== d.id && a.push(d);
                return a.length ? (r = a, s = this, n = "copy_node", this.trigger("copy", {node: i}), t) : !1
            }, get_buffer: function () {
                return {mode: n, node: r, inst: s}
            }, can_paste: function () {
                return n !== !1 && r !== !1
            }, paste: function (e, i) {
                return e = this.get_node(e), e && n && n.match(/^(copy_node|move_node)$/) && r ? (this[n](r, e, i) && this.trigger("paste", {
                    parent: e.id,
                    node: r,
                    mode: n
                }), r = !1, n = !1, s = !1, t) : !1
            }, edit: function (i, r) {
                if (i = this._open_to(i), !i || !i.length) return !1;
                if (this.settings.core.check_callback === !1) return this._data.core.last_error = {
                    error: "check",
                    plugin: "core",
                    id: "core_07",
                    reason: "Could not edit node because of check_callback"
                }, this.settings.core.error.call(this, this._data.core.last_error), !1;
                var n = this._data.core.rtl, s = this.element.width(), a = i.children(".jstree-anchor"),
                    d = e("<span>"), o = "string" == typeof r ? r : this.get_text(i), l = e("<div />", {
                        css: {
                            position: "absolute",
                            top: "-200px",
                            left: n ? "0px" : "-1000px",
                            visibility: "hidden"
                        }
                    }).appendTo("body"), c = e("<input />", {
                        value: o,
                        "class": "jstree-rename-input",
                        css: {
                            padding: "0",
                            // border: "1px solid silver",
                            "box-sizing": "border-box",
                            display: "inline-block",
                            height: this._data.core.li_height + -5 + "px",
                            lineHeight: this._data.core.li_height + -5 + "px",
                            width: "150px",
                        },
                        blur: e.proxy(function () {
                            var e = d.children(".jstree-rename-input"), t = e.val();
                            "" === t && (t = o), l.remove(), d.replaceWith(a), d.remove(), this.set_text(i, o), this.rename_node(i, t) === !1 && this.set_text(i, o)
                        }, this),
                        keydown: function (e) {
                            var t = e.which;
                            27 === t && (this.value = o), (27 === t || 13 === t || 37 === t || 38 === t || 39 === t || 40 === t || 32 === t) && e.stopImmediatePropagation(), (27 === t || 13 === t) && (e.preventDefault(), this.blur())
                        },
                        click: function (e) {
                            e.stopImmediatePropagation()
                        },
                        mousedown: function (e) {
                            e.stopImmediatePropagation()
                        },
                        keyup: function (e) {
                            c.width(Math.min(l.text("pW" + this.value).width(), s))
                        },
                        keypress: function (e) {
                            return 13 === e.which ? !1 : t
                        }
                    }), h = {
                        fontFamily: a.css("fontFamily") || "",
                        fontSize: a.css("fontSize") || "",
                        fontWeight: a.css("fontWeight") || "",
                        fontStyle: a.css("fontStyle") || "",
                        fontStretch: a.css("fontStretch") || "",
                        fontVariant: a.css("fontVariant") || "",
                        letterSpacing: a.css("letterSpacing") || "",
                        wordSpacing: a.css("wordSpacing") || ""
                    };
                this.set_text(i, ""), d.attr("class", a.attr("class")).append(a.contents().clone()).append(c), a.replaceWith(d), l.css(h), c.css(h).width(Math.min(l.text("pW" + c[0].value).width(), s))[0].select()
            }, set_theme: function (t, i) {
                if (!t) return !1;
                if (i === !0) {
                    var r = this.settings.core.themes.dir;
                    r || (r = e.jstree.path + "/themes"), i = r + "/" + t + "/style.css"
                }
                i && -1 === e.inArray(i, a) && (e("head").append('<link rel="stylesheet" href="' + i + '" type="text/css" />'), a.push(i)), this._data.core.themes.name && this.element.removeClass("jstree-" + this._data.core.themes.name), this._data.core.themes.name = t, this.element.addClass("jstree-" + t), this.element[this.settings.core.themes.responsive ? "addClass" : "removeClass"]("jstree-" + t + "-responsive"), this.trigger("set_theme", {theme: t})
            }, get_theme: function () {
                return this._data.core.themes.name
            }, set_theme_variant: function (e) {
                this._data.core.themes.variant && this.element.removeClass("jstree-" + this._data.core.themes.name + "-" + this._data.core.themes.variant), this._data.core.themes.variant = e, e && this.element.addClass("jstree-" + this._data.core.themes.name + "-" + this._data.core.themes.variant)
            }, get_theme_variant: function () {
                return this._data.core.themes.variant
            }, show_stripes: function () {
                this._data.core.themes.stripes = !0, this.get_container_ul().addClass("jstree-striped")
            }, hide_stripes: function () {
                this._data.core.themes.stripes = !1, this.get_container_ul().removeClass("jstree-striped")
            }, toggle_stripes: function () {
                this._data.core.themes.stripes ? this.hide_stripes() : this.show_stripes()
            }, show_dots: function () {
                this._data.core.themes.dots = !0, this.get_container_ul().removeClass("jstree-no-dots")
            }, hide_dots: function () {
                this._data.core.themes.dots = !1, this.get_container_ul().addClass("jstree-no-dots")
            }, toggle_dots: function () {
                this._data.core.themes.dots ? this.hide_dots() : this.show_dots()
            }, show_icons: function () {
                this._data.core.themes.icons = !0, this.get_container_ul().removeClass("jstree-no-icons")
            }, hide_icons: function () {
                this._data.core.themes.icons = !1, this.get_container_ul().addClass("jstree-no-icons")
            }, toggle_icons: function () {
                this._data.core.themes.icons ? this.hide_icons() : this.show_icons()
            }, set_icon: function (t, i) {
                var r, n, s, a;
                if (e.isArray(t)) {
                    for (t = t.slice(), r = 0, n = t.length; n > r; r++) this.set_icon(t[r], i);
                    return !0
                }
                return t = this.get_node(t), t && "#" !== t.id ? (a = t.icon, t.icon = i, s = this.get_node(t, !0).children(".jstree-anchor").children(".jstree-themeicon"), i === !1 ? this.hide_icon(t) : i === !0 ? s.removeClass("jstree-themeicon-custom " + a).css("background", "").removeAttr("rel") : -1 === i.indexOf("/") && -1 === i.indexOf(".") ? (s.removeClass(a).css("background", ""), s.addClass(i + " jstree-themeicon-custom").attr("rel", i)) : (s.removeClass(a).css("background", ""), s.addClass("jstree-themeicon-custom").css("background", "url('" + i + "') center center no-repeat").attr("rel", i)), !0) : !1
            }, get_icon: function (e) {
                return e = this.get_node(e), e && "#" !== e.id ? e.icon : !1
            }, hide_icon: function (t) {
                var i, r;
                if (e.isArray(t)) {
                    for (t = t.slice(), i = 0, r = t.length; r > i; i++) this.hide_icon(t[i]);
                    return !0
                }
                return t = this.get_node(t), t && "#" !== t ? (t.icon = !1, this.get_node(t, !0).children(".jstree-anchor").children(".jstree-themeicon").addClass("jstree-themeicon-hidden"), !0) : !1
            }, show_icon: function (t) {
                var i, r, n;
                if (e.isArray(t)) {
                    for (t = t.slice(), i = 0, r = t.length; r > i; i++) this.show_icon(t[i]);
                    return !0
                }
                return t = this.get_node(t), t && "#" !== t ? (n = this.get_node(t, !0), t.icon = n.length ? n.children(".jstree-anchor").children(".jstree-themeicon").attr("rel") : !0, t.icon || (t.icon = !0), n.children(".jstree-anchor").children(".jstree-themeicon").removeClass("jstree-themeicon-hidden"), !0) : !1
            }
        }, e.vakata = {}, e.vakata.attributes = function (t, i) {
            t = e(t)[0];
            var r = i ? {} : [];
            return t && t.attributes && e.each(t.attributes, function (t, n) {
                -1 === e.inArray(n.nodeName.toLowerCase(), ["style", "contenteditable", "hasfocus", "tabindex"]) && null !== n.nodeValue && "" !== e.trim(n.nodeValue) && (i ? r[n.nodeName] = n.nodeValue : r.push(n.nodeName))
            }), r
        }, e.vakata.array_unique = function (e) {
            var t = [], i, r, n;
            for (i = 0, n = e.length; n > i; i++) {
                for (r = 0; i >= r; r++) if (e[i] === e[r]) break;
                r === i && t.push(e[i])
            }
            return t
        }, e.vakata.array_remove = function (e, t, i) {
            var r = e.slice((i || t) + 1 || e.length);
            return e.length = 0 > t ? e.length + t : t, e.push.apply(e, r), e
        }, e.vakata.array_remove_item = function (t, i) {
            var r = e.inArray(i, t);
            return -1 !== r ? e.vakata.array_remove(t, r) : t
        };
        var _ = document.createElement("I");
        _.className = "jstree-icon jstree-checkbox", e.jstree.defaults.checkbox = {
            visible: !0,
            three_state: !0,
            whole_node: !0,
            keep_selected_style: !0
        }, e.jstree.plugins.checkbox = function (t, i) {
            this.bind = function () {
                i.bind.call(this), this._data.checkbox.uto = !1, this.element.on("init.jstree", e.proxy(function () {
                    this._data.checkbox.visible = this.settings.checkbox.visible, this.settings.checkbox.keep_selected_style || this.element.addClass("jstree-checkbox-no-clicked")
                }, this)).on("loading.jstree", e.proxy(function () {
                    this[this._data.checkbox.visible ? "show_checkboxes" : "hide_checkboxes"]()
                }, this)), this.settings.checkbox.three_state && this.element.on("changed.jstree move_node.jstree copy_node.jstree redraw.jstree open_node.jstree", e.proxy(function () {
                    this._data.checkbox.uto && clearTimeout(this._data.checkbox.uto), this._data.checkbox.uto = setTimeout(e.proxy(this._undetermined, this), 50)
                }, this)).on("model.jstree", e.proxy(function (t, i) {
                    var r = this._model.data, n = r[i.parent], s = i.nodes, a = [], d, o, l, c, h, _;
                    if (n.state.selected) {
                        for (o = 0, l = s.length; l > o; o++) r[s[o]].state.selected = !0;
                        this._data.core.selected = this._data.core.selected.concat(s)
                    } else for (o = 0, l = s.length; l > o; o++) if (r[s[o]].state.selected) {
                        for (c = 0, h = r[s[o]].children_d.length; h > c; c++) r[r[s[o]].children_d[c]].state.selected = !0;
                        this._data.core.selected = this._data.core.selected.concat(r[s[o]].children_d)
                    }
                    for (o = 0, l = n.children_d.length; l > o; o++) r[n.children_d[o]].children.length || a.push(r[n.children_d[o]].parent);
                    for (a = e.vakata.array_unique(a), c = 0, h = a.length; h > c; c++) {
                        n = r[a[c]];
                        while (n && "#" !== n.id) {
                            for (d = 0, o = 0, l = n.children.length; l > o; o++) d += r[n.children[o]].state.selected;
                            if (d !== l) break;
                            n.state.selected = !0, this._data.core.selected.push(n.id), _ = this.get_node(n, !0), _ && _.length && _.children(".jstree-anchor").addClass("jstree-clicked"), n = this.get_node(n.parent)
                        }
                    }
                    this._data.core.selected = e.vakata.array_unique(this._data.core.selected)
                }, this)).on("select_node.jstree", e.proxy(function (t, i) {
                    var r = i.node, n = this._model.data, s = this.get_node(r.parent), a = this.get_node(r, !0), d, o,
                        l, c;
                    for (this._data.core.selected = e.vakata.array_unique(this._data.core.selected.concat(r.children_d)), d = 0, o = r.children_d.length; o > d; d++) c = n[r.children_d[d]], c.state.selected = !0, c && c.original && c.original.state && c.original.state.undetermined && (c.original.state.undetermined = !1);
                    while (s && "#" !== s.id) {
                        for (l = 0, d = 0, o = s.children.length; o > d; d++) l += n[s.children[d]].state.selected;
                        if (l !== o) break;
                        s.state.selected = !0, this._data.core.selected.push(s.id), c = this.get_node(s, !0), c && c.length && c.children(".jstree-anchor").addClass("jstree-clicked"), s = this.get_node(s.parent)
                    }
                    a.length && a.find(".jstree-anchor").addClass("jstree-clicked")
                }, this)).on("deselect_all.jstree", e.proxy(function (e, t) {
                    var i = this.get_node("#"), r = this._model.data, n, s, a;
                    for (n = 0, s = i.children_d.length; s > n; n++) a = r[i.children_d[n]], a && a.original && a.original.state && a.original.state.undetermined && (a.original.state.undetermined = !1)
                }, this)).on("deselect_node.jstree", e.proxy(function (t, i) {
                    var r = i.node, n = this.get_node(r, !0), s, a, d;
                    for (r && r.original && r.original.state && r.original.state.undetermined && (r.original.state.undetermined = !1), s = 0, a = r.children_d.length; a > s; s++) d = this._model.data[r.children_d[s]], d.state.selected = !1, d && d.original && d.original.state && d.original.state.undetermined && (d.original.state.undetermined = !1);
                    for (s = 0, a = r.parents.length; a > s; s++) d = this._model.data[r.parents[s]], d.state.selected = !1, d && d.original && d.original.state && d.original.state.undetermined && (d.original.state.undetermined = !1), d = this.get_node(r.parents[s], !0), d && d.length && d.children(".jstree-anchor").removeClass("jstree-clicked");
                    for (d = [], s = 0, a = this._data.core.selected.length; a > s; s++) -1 === e.inArray(this._data.core.selected[s], r.children_d) && -1 === e.inArray(this._data.core.selected[s], r.parents) && d.push(this._data.core.selected[s]);
                    this._data.core.selected = e.vakata.array_unique(d), n.length && n.find(".jstree-anchor").removeClass("jstree-clicked")
                }, this)).on("delete_node.jstree", e.proxy(function (e, t) {
                    var i = this.get_node(t.parent), r = this._model.data, n, s, a, d;
                    while (i && "#" !== i.id) {
                        for (a = 0, n = 0, s = i.children.length; s > n; n++) a += r[i.children[n]].state.selected;
                        if (a !== s) break;
                        i.state.selected = !0, this._data.core.selected.push(i.id), d = this.get_node(i, !0), d && d.length && d.children(".jstree-anchor").addClass("jstree-clicked"), i = this.get_node(i.parent)
                    }
                }, this)).on("move_node.jstree", e.proxy(function (t, i) {
                    var r = i.is_multi, n = i.old_parent, s = this.get_node(i.parent), a = this._model.data, d, o, l, c,
                        h;
                    if (!r) {
                        d = this.get_node(n);
                        while (d && "#" !== d.id) {
                            for (o = 0, l = 0, c = d.children.length; c > l; l++) o += a[d.children[l]].state.selected;
                            if (o !== c) break;
                            d.state.selected = !0, this._data.core.selected.push(d.id), h = this.get_node(d, !0), h && h.length && h.children(".jstree-anchor").addClass("jstree-clicked"), d = this.get_node(d.parent)
                        }
                    }
                    d = s;
                    while (d && "#" !== d.id) {
                        for (o = 0, l = 0, c = d.children.length; c > l; l++) o += a[d.children[l]].state.selected;
                        if (o === c) d.state.selected || (d.state.selected = !0, this._data.core.selected.push(d.id), h = this.get_node(d, !0), h && h.length && h.children(".jstree-anchor").addClass("jstree-clicked")); else {
                            if (!d.state.selected) break;
                            d.state.selected = !1, this._data.core.selected = e.vakata.array_remove_item(this._data.core.selected, d.id), h = this.get_node(d, !0), h && h.length && h.children(".jstree-anchor").removeClass("jstree-clicked")
                        }
                        d = this.get_node(d.parent)
                    }
                }, this))
            }, this._undetermined = function () {
                var t, i, r = this._model.data, n = this._data.core.selected, s = [], a = this;
                for (t = 0, i = n.length; i > t; t++) r[n[t]] && r[n[t]].parents && (s = s.concat(r[n[t]].parents));
                for (this.element.find(".jstree-closed").not(":has(.jstree-children)").each(function () {
                    var e = a.get_node(this), n;
                    if (e.state.loaded) for (t = 0, i = e.children_d.length; i > t; t++) n = r[e.children_d[t]], !n.state.loaded && n.original && n.original.state && n.original.state.undetermined && n.original.state.undetermined === !0 && (s.push(n.id), s = s.concat(n.parents)); else e.original && e.original.state && e.original.state.undetermined && e.original.state.undetermined === !0 && (s.push(e.id), s = s.concat(e.parents))
                }), s = e.vakata.array_unique(s), s = e.vakata.array_remove_item(s, "#"), this.element.find(".jstree-undetermined").removeClass("jstree-undetermined"), t = 0, i = s.length; i > t; t++) r[s[t]].state.selected || (n = this.get_node(s[t], !0), n && n.length && n.children(".jstree-anchor").children(".jstree-checkbox").addClass("jstree-undetermined"))
            }, this.redraw_node = function (t, r, n) {
                if (t = i.redraw_node.call(this, t, r, n)) {
                    var s, a, d = null;
                    for (s = 0, a = t.childNodes.length; a > s; s++) if (t.childNodes[s] && t.childNodes[s].className && -1 !== t.childNodes[s].className.indexOf("jstree-anchor")) {
                        d = t.childNodes[s];
                        break
                    }
                    d && d.insertBefore(_.cloneNode(!1), d.childNodes[0])
                }
                return !n && this.settings.checkbox.three_state && (this._data.checkbox.uto && clearTimeout(this._data.checkbox.uto), this._data.checkbox.uto = setTimeout(e.proxy(this._undetermined, this), 50)), t
            }, this.activate_node = function (t, r) {
                return (this.settings.checkbox.whole_node || e(r.target).hasClass("jstree-checkbox")) && (r.ctrlKey = !0), i.activate_node.call(this, t, r)
            }, this.show_checkboxes = function () {
                this._data.core.themes.checkboxes = !0, this.get_container_ul().removeClass("jstree-no-checkboxes")
            }, this.hide_checkboxes = function () {
                this._data.core.themes.checkboxes = !1, this.get_container_ul().addClass("jstree-no-checkboxes")
            }, this.toggle_checkboxes = function () {
                this._data.core.themes.checkboxes ? this.hide_checkboxes() : this.show_checkboxes()
            }
        }, e.jstree.defaults.contextmenu = {
            select_node: !0, show_at_node: !0, items: function (t, i) {
                return {
                    create: {
                        separator_before: !1,
                        separator_after: !0,
                        _disabled: !1,
                        label: "Create",
                        action: function (t) {
                            var i = e.jstree.reference(t.reference), r = i.get_node(t.reference);
                            i.create_node(r, {}, "last", function (e) {
                                setTimeout(function () {
                                    i.edit(e)
                                }, 0)
                            })
                        }
                    },
                    rename: {
                        separator_before: !1,
                        separator_after: !1,
                        _disabled: !1,
                        label: "Rename",
                        action: function (t) {
                            var i = e.jstree.reference(t.reference), r = i.get_node(t.reference);
                            i.edit(r)
                        }
                    },
                    remove: {
                        separator_before: !1,
                        icon: !1,
                        separator_after: !1,
                        _disabled: !1,
                        label: "Delete",
                        action: function (t) {
                            var i = e.jstree.reference(t.reference), r = i.get_node(t.reference);
                            i.is_selected(r) ? i.delete_node(i.get_selected()) : i.delete_node(r)
                        }
                    },
                    ccp: {
                        separator_before: !0,
                        icon: !1,
                        separator_after: !1,
                        label: "Edit",
                        action: !1,
                        submenu: {
                            cut: {
                                separator_before: !1, separator_after: !1, label: "Cut", action: function (t) {
                                    var i = e.jstree.reference(t.reference), r = i.get_node(t.reference);
                                    i.is_selected(r) ? i.cut(i.get_selected()) : i.cut(r)
                                }
                            },
                            copy: {
                                separator_before: !1,
                                icon: !1,
                                separator_after: !1,
                                label: "Copy",
                                action: function (t) {
                                    var i = e.jstree.reference(t.reference), r = i.get_node(t.reference);
                                    i.is_selected(r) ? i.copy(i.get_selected()) : i.copy(r)
                                }
                            },
                            paste: {
                                separator_before: !1, icon: !1, _disabled: function (t) {
                                    return !e.jstree.reference(t.reference).can_paste()
                                }, separator_after: !1, label: "Paste", action: function (t) {
                                    var i = e.jstree.reference(t.reference), r = i.get_node(t.reference);
                                    i.paste(r)
                                }
                            }
                        }
                    }
                }
            }
        }, e.jstree.plugins.contextmenu = function (i, r) {
            this.bind = function () {
                r.bind.call(this);
                var t = 0;
                this.element.on("contextmenu.jstree", ".jstree-anchor", e.proxy(function (e) {
                    e.preventDefault(), t = e.ctrlKey ? e.timeStamp : 0, this.is_loading(e.currentTarget) || this.show_contextmenu(e.currentTarget, e.pageX, e.pageY, e)
                }, this)).on("click.jstree", ".jstree-anchor", e.proxy(function (i) {
                    this._data.contextmenu.visible && (!t || i.timeStamp - t > 250) && e.vakata.context.hide()
                }, this)), e(document).on("context_hide.vakata", e.proxy(function () {
                    this._data.contextmenu.visible = !1
                }, this))
            }, this.teardown = function () {
                this._data.contextmenu.visible && e.vakata.context.hide(), r.teardown.call(this)
            }, this.show_contextmenu = function (i, r, n, s) {
                if (i = this.get_node(i), !i || "#" === i.id) return !1;
                var a = this.settings.contextmenu, d = this.get_node(i, !0), o = d.children(".jstree-anchor"), l = !1,
                    c = !1;
                (a.show_at_node || r === t || n === t) && (l = o.offset(), r = l.left, n = l.top + this._data.core.li_height), this.settings.contextmenu.select_node && !this.is_selected(i) && this.activate_node(i, s), c = a.items, e.isFunction(c) && (c = c.call(this, i, e.proxy(function (e) {
                    this._show_contextmenu(i, r, n, e)
                }, this))), e.isPlainObject(c) && this._show_contextmenu(i, r, n, c)
            }, this._show_contextmenu = function (t, i, r, n) {
                var s = this.get_node(t, !0), a = s.children(".jstree-anchor");
                e(document).one("context_show.vakata", e.proxy(function (t, i) {
                    var r = "jstree-contextmenu jstree-" + this.get_theme() + "-contextmenu";
                    e(i.element).addClass(r)
                }, this)), this._data.contextmenu.visible = !0, e.vakata.context.show(a, {
                    x: i,
                    y: r
                }, n), this.trigger("show_contextmenu", {node: t, x: i, y: r})
            }
        }, function (e) {
            var i = !1,
                r = {element: !1, reference: !1, position_x: 0, position_y: 0, items: [], html: "", is_visible: !1};
            e.vakata.context = {
                settings: {hide_onmouseleave: 0, icons: !0}, _trigger: function (t) {
                    e(document).triggerHandler("context_" + t + ".vakata", {
                        reference: r.reference,
                        element: r.element,
                        position: {x: r.position_x, y: r.position_y}
                    })
                }, _execute: function (t) {
                    return t = r.items[t], t && (!t._disabled || e.isFunction(t._disabled) && !t._disabled({
                        item: t,
                        reference: r.reference,
                        element: r.element
                    })) && t.action ? t.action.call(null, {
                        item: t,
                        reference: r.reference,
                        element: r.element,
                        position: {x: r.position_x, y: r.position_y}
                    }) : !1
                }, _parse: function (i, n) {
                    if (!i) return !1;
                    n || (r.html = "", r.items = []);
                    var s = "", a = !1, d;
                    return n && (s += "<ul>"), e.each(i, function (i, n) {
                        return n ? (r.items.push(n), !a && n.separator_before && (s += "<li class='vakata-context-separator'><a href='#' " + (e.vakata.context.settings.icons ? "" : 'style="margin-left:0px;"') + ">&#160;<" + "/a><" + "/li>"), a = !1, s += "<li class='" + (n._class || "") + (n._disabled === !0 || e.isFunction(n._disabled) && n._disabled({
                            item: n,
                            reference: r.reference,
                            element: r.element
                        }) ? " vakata-contextmenu-disabled " : "") + "' " + (n.shortcut ? " data-shortcut='" + n.shortcut + "' " : "") + ">", s += "<a href='#' rel='" + (r.items.length - 1) + "'>", e.vakata.context.settings.icons && (s += "<i ", n.icon && (s += -1 !== n.icon.indexOf("/") || -1 !== n.icon.indexOf(".") ? " style='background:url(\"" + n.icon + "\") center center no-repeat' " : " class='" + n.icon + "' "), s += "></i><span class='vakata-contextmenu-sep'>&#160;</span>"), s += (e.isFunction(n.label) ? n.label({
                            item: i,
                            reference: r.reference,
                            element: r.element
                        }) : n.label) + (n.shortcut ? ' <span class="vakata-contextmenu-shortcut vakata-contextmenu-shortcut-' + n.shortcut + '">' + (n.shortcut_label || "") + "</span>" : "") + "<" + "/a>", n.submenu && (d = e.vakata.context._parse(n.submenu, !0), d && (s += d)), s += "</li>", n.separator_after && (s += "<li class='vakata-context-separator'><a href='#' " + (e.vakata.context.settings.icons ? "" : 'style="margin-left:0px;"') + ">&#160;<" + "/a><" + "/li>", a = !0), t) : !0
                    }), s = s.replace(/<li class\='vakata-context-separator'\><\/li\>$/, ""), n && (s += "</ul>"), n || (r.html = s, e.vakata.context._trigger("parse")), s.length > 10 ? s : !1
                }, _show_submenu: function (t) {
                    if (t = e(t), t.length && t.children("ul").length) {
                        var r = t.children("ul"), n = t.offset().left + t.outerWidth(), s = t.offset().top,
                            a = r.width(), d = r.height(), o = e(window).width() + e(window).scrollLeft(),
                            l = e(window).height() + e(window).scrollTop();
                        i ? t[0 > n - (a + 10 + t.outerWidth()) ? "addClass" : "removeClass"]("vakata-context-left") : t[n + a + 10 > o ? "addClass" : "removeClass"]("vakata-context-right"), s + d + 10 > l && r.css("bottom", "-1px"), r.show()
                    }
                }, show: function (t, n, s) {
                    var a, d, o, l, c, h, _, u, g = !0;
                    switch (r.element && r.element.length && r.element.width(""), g) {
                        case!n && !t:
                            return !1;
                        case!!n && !!t:
                            r.reference = t, r.position_x = n.x, r.position_y = n.y;
                            break;
                        case!n && !!t:
                            r.reference = t, a = t.offset(), r.position_x = a.left + t.outerHeight(), r.position_y = a.top;
                            break;
                        case!!n && !t:
                            r.position_x = n.x, r.position_y = n.y
                    }
                    t && !s && e(t).data("vakata_contextmenu") && (s = e(t).data("vakata_contextmenu")), e.vakata.context._parse(s) && r.element.html(r.html), r.items.length && (d = r.element, o = r.position_x, l = r.position_y, c = d.width(), h = d.height(), _ = e(window).width() + e(window).scrollLeft(), u = e(window).height() + e(window).scrollTop(), i && (o -= d.outerWidth(), e(window).scrollLeft() + 20 > o && (o = e(window).scrollLeft() + 20)), o + c + 20 > _ && (o = _ - (c + 20)), l + h + 20 > u && (l = u - (h + 20)), r.element.css({
                        left: o,
                        top: l
                    }).show().find("a:eq(0)").focus().parent().addClass("vakata-context-hover"), r.is_visible = !0, e.vakata.context._trigger("show"))
                }, hide: function () {
                    r.is_visible && (r.element.hide().find("ul").hide().end().find(":focus").blur(), r.is_visible = !1, e.vakata.context._trigger("hide"))
                }
            }, e(function () {
                i = "rtl" === e("body").css("direction");
                var t = !1;
                r.element = e("<ul class='vakata-context'></ul>"), r.element.on("mouseenter", "li", function (i) {
                    i.stopImmediatePropagation(), e.contains(this, i.relatedTarget) || (t && clearTimeout(t), r.element.find(".vakata-context-hover").removeClass("vakata-context-hover").end(), e(this).siblings().find("ul").hide().end().end().parentsUntil(".vakata-context", "li").addBack().addClass("vakata-context-hover"), e.vakata.context._show_submenu(this))
                }).on("mouseleave", "li", function (t) {
                    e.contains(this, t.relatedTarget) || e(this).find(".vakata-context-hover").addBack().removeClass("vakata-context-hover")
                }).on("mouseleave", function (i) {
                    e(this).find(".vakata-context-hover").removeClass("vakata-context-hover"), e.vakata.context.settings.hide_onmouseleave && (t = setTimeout(function (t) {
                        return function () {
                            e.vakata.context.hide()
                        }
                    }(this), e.vakata.context.settings.hide_onmouseleave))
                }).on("click", "a", function (e) {
                    e.preventDefault()
                }).on("mouseup", "a", function (t) {
                    e(this).blur().parent().hasClass("vakata-context-disabled") || e.vakata.context._execute(e(this).attr("rel")) === !1 || e.vakata.context.hide()
                }).on("keydown", "a", function (t) {
                    var i = null;
                    switch (t.which) {
                        case 13:
                        case 32:
                            t.type = "mouseup", t.preventDefault(), e(t.currentTarget).trigger(t);
                            break;
                        case 37:
                            r.is_visible && (r.element.find(".vakata-context-hover").last().parents("li:eq(0)").find("ul").hide().find(".vakata-context-hover").removeClass("vakata-context-hover").end().end().children("a").focus(), t.stopImmediatePropagation(), t.preventDefault());
                            break;
                        case 38:
                            r.is_visible && (i = r.element.find("ul:visible").addBack().last().children(".vakata-context-hover").removeClass("vakata-context-hover").prevAll("li:not(.vakata-context-separator)").first(), i.length || (i = r.element.find("ul:visible").addBack().last().children("li:not(.vakata-context-separator)").last()), i.addClass("vakata-context-hover").children("a").focus(), t.stopImmediatePropagation(), t.preventDefault());
                            break;
                        case 39:
                            r.is_visible && (r.element.find(".vakata-context-hover").last().children("ul").show().children("li:not(.vakata-context-separator)").removeClass("vakata-context-hover").first().addClass("vakata-context-hover").children("a").focus(), t.stopImmediatePropagation(), t.preventDefault());
                            break;
                        case 40:
                            r.is_visible && (i = r.element.find("ul:visible").addBack().last().children(".vakata-context-hover").removeClass("vakata-context-hover").nextAll("li:not(.vakata-context-separator)").first(), i.length || (i = r.element.find("ul:visible").addBack().last().children("li:not(.vakata-context-separator)").first()), i.addClass("vakata-context-hover").children("a").focus(), t.stopImmediatePropagation(), t.preventDefault());
                            break;
                        case 27:
                            e.vakata.context.hide(), t.preventDefault();
                            break;
                        default:
                    }
                }).on("keydown", function (e) {
                    e.preventDefault();
                    var t = r.element.find(".vakata-contextmenu-shortcut-" + e.which).parent();
                    t.parent().not(".vakata-context-disabled") && t.mouseup()
                }).appendTo("body"), e(document).on("mousedown", function (t) {
                    r.is_visible && !e.contains(r.element[0], t.target) && e.vakata.context.hide()
                }).on("context_show.vakata", function (e, t) {
                    r.element.find("li:has(ul)").children("a").addClass("vakata-context-parent"), i && r.element.addClass("vakata-context-rtl").css("direction", "rtl"), r.element.find("ul").hide().end()
                })
            })
        }(e), e.jstree.defaults.dnd = {
            copy: !0,
            open_timeout: 500,
            is_draggable: !0,
            check_while_dragging: !0,
            always_copy: !1,
            inside_pos: 0
        }, e.jstree.plugins.dnd = function (i, r) {
            this.bind = function () {
                r.bind.call(this), this.element.on("mousedown.jstree touchstart.jstree", ".jstree-anchor", e.proxy(function (i) {
                    var r = this.get_node(i.target), n = this.is_selected(r) ? this.get_selected().length : 1;
                    return r && r.id && "#" !== r.id && (1 === i.which || "touchstart" === i.type) && (this.settings.dnd.is_draggable === !0 || e.isFunction(this.settings.dnd.is_draggable) && this.settings.dnd.is_draggable.call(this, n > 1 ? this.get_selected(!0) : [r])) ? (this.element.trigger("mousedown.jstree"), e.vakata.dnd.start(i, {
                        jstree: !0,
                        origin: this,
                        obj: this.get_node(r, !0),
                        nodes: n > 1 ? this.get_selected() : [r.id]
                    }, '<div id="jstree-dnd" class="jstree-' + this.get_theme() + '"><i class="jstree-icon jstree-er"></i>' + (n > 1 ? n + " " + this.get_string("nodes") : this.get_text(i.currentTarget, !0)) + '<ins class="jstree-copy" style="display:none;">+</ins></div>')) : t
                }, this))
            }
        }, e(function () {
            var i = !1, r = !1, n = !1, s = e('<div id="jstree-marker">&#160;</div>').hide().appendTo("body");
            e(document).bind("dnd_start.vakata", function (e, t) {
                i = !1
            }).bind("dnd_move.vakata", function (a, d) {
                if (n && clearTimeout(n), d.data.jstree && (!d.event.target.id || "jstree-marker" !== d.event.target.id)) {
                    var o = e.jstree.reference(d.event.target), l = !1, c = !1, h = !1, _, u, g, f, p, m, v, j, y, x, k,
                        b, w, C;
                    if (o && o._data && o._data.dnd) if (s.attr("class", "jstree-" + o.get_theme()), d.helper.children().attr("class", "jstree-" + o.get_theme()).find(".jstree-copy:eq(0)")[d.data.origin && (d.data.origin.settings.dnd.always_copy || d.data.origin.settings.dnd.copy && (d.event.metaKey || d.event.ctrlKey)) ? "show" : "hide"](), d.event.target !== o.element[0] && d.event.target !== o.get_container_ul()[0] || 0 !== o.get_container_ul().children().length) {
                        if (l = e(d.event.target).closest(".jstree-anchor"), l && l.length && l.parent().is(".jstree-closed, .jstree-open, .jstree-leaf") && (c = l.offset(), h = d.event.pageY - c.top, g = l.height(), m = g / 3 > h ? ["b", "i", "a"] : h > g - g / 3 ? ["a", "i", "b"] : h > g / 2 ? ["i", "a", "b"] : ["i", "b", "a"], e.each(m, function (a, h) {
                            switch (h) {
                                case"b":
                                    _ = c.left - 6, u = c.top - 5, f = o.get_parent(l), p = l.parent().index();
                                    break;
                                case"i":
                                    w = o.settings.dnd.inside_pos, C = o.get_node(l.parent()), _ = c.left - 2, u = c.top - 5 + g / 2 + 1, f = C.id, p = "first" === w ? 0 : "last" === w ? C.children.length : Math.min(w, C.children.length);
                                    break;
                                case"a":
                                    _ = c.left - 6, u = c.top - 5 + g, f = o.get_parent(l), p = l.parent().index() + 1
                            }
                            for (v = !0, j = 0, y = d.data.nodes.length; y > j; j++) if (x = d.data.origin && (d.data.origin.settings.dnd.always_copy || d.data.origin.settings.dnd.copy && (d.event.metaKey || d.event.ctrlKey)) ? "copy_node" : "move_node", k = p, "move_node" === x && "a" === h && d.data.origin && d.data.origin === o && f === o.get_parent(d.data.nodes[j]) && (b = o.get_node(f), k > e.inArray(d.data.nodes[j], b.children) && (k -= 1)), v = v && (o && o.settings && o.settings.dnd && o.settings.dnd.check_while_dragging === !1 || o.check(x, d.data.origin && d.data.origin !== o ? d.data.origin.get_node(d.data.nodes[j]) : d.data.nodes[j], f, k, {
                                dnd: !0,
                                ref: o.get_node(l.parent()),
                                pos: h,
                                is_multi: d.data.origin && d.data.origin !== o,
                                is_foreign: !d.data.origin
                            })), !v) {
                                o && o.last_error && (r = o.last_error());
                                break
                            }
                            return v ? ("i" === h && l.parent().is(".jstree-closed") && o.settings.dnd.open_timeout && (n = setTimeout(function (e, t) {
                                return function () {
                                    e.open_node(t)
                                }
                            }(o, l), o.settings.dnd.open_timeout)), i = {
                                ins: o,
                                par: f,
                                pos: "i" !== h || "last" !== w || 0 !== p || o.is_loaded(C) ? p : "last"
                            }, s.css({
                                left: _ + "px",
                                top: u + "px"
                            }).show(), d.helper.find(".jstree-icon:eq(0)").removeClass("jstree-er").addClass("jstree-ok"), r = {}, m = !0, !1) : t
                        }), m === !0)) return
                    } else {
                        for (v = !0, j = 0, y = d.data.nodes.length; y > j; j++) if (v = v && o.check(d.data.origin && (d.data.origin.settings.dnd.always_copy || d.data.origin.settings.dnd.copy && (d.event.metaKey || d.event.ctrlKey)) ? "copy_node" : "move_node", d.data.origin && d.data.origin !== o ? d.data.origin.get_node(d.data.nodes[j]) : d.data.nodes[j], "#", "last", {
                            dnd: !0,
                            ref: o.get_node("#"),
                            pos: "i",
                            is_multi: d.data.origin && d.data.origin !== o,
                            is_foreign: !d.data.origin
                        }), !v) break;
                        if (v) return i = {
                            ins: o,
                            par: "#",
                            pos: "last"
                        }, s.hide(), d.helper.find(".jstree-icon:eq(0)").removeClass("jstree-er").addClass("jstree-ok"), t
                    }
                    i = !1, d.helper.find(".jstree-icon").removeClass("jstree-ok").addClass("jstree-er"), s.hide()
                }
            }).bind("dnd_scroll.vakata", function (e, t) {
                t.data.jstree && (s.hide(), i = !1, t.helper.find(".jstree-icon:eq(0)").removeClass("jstree-ok").addClass("jstree-er"))
            }).bind("dnd_stop.vakata", function (t, a) {
                if (n && clearTimeout(n), a.data.jstree) {
                    s.hide();
                    var d, o, l = [];
                    if (i) {
                        for (d = 0, o = a.data.nodes.length; o > d; d++) l[d] = a.data.origin ? a.data.origin.get_node(a.data.nodes[d]) : a.data.nodes[d], a.data.origin && (l[d].instance = a.data.origin);
                        i.ins[a.data.origin && (a.data.origin.settings.dnd.always_copy || a.data.origin.settings.dnd.copy && (a.event.metaKey || a.event.ctrlKey)) ? "copy_node" : "move_node"](l, i.par, i.pos)
                    } else d = e(a.event.target).closest(".jstree"), d.length && r && r.error && "check" === r.error && (d = d.jstree(!0), d && d.settings.core.error.call(this, r))
                }
            }).bind("keyup keydown", function (t, i) {
                i = e.vakata.dnd._get(), i.data && i.data.jstree && i.helper.find(".jstree-copy:eq(0)")[i.data.origin && (i.data.origin.settings.dnd.always_copy || i.data.origin.settings.dnd.copy && (t.metaKey || t.ctrlKey)) ? "show" : "hide"]()
            })
        }), function (e) {
            var i = {
                element: !1,
                is_down: !1,
                is_drag: !1,
                helper: !1,
                helper_w: 0,
                data: !1,
                init_x: 0,
                init_y: 0,
                scroll_l: 0,
                scroll_t: 0,
                scroll_e: !1,
                scroll_i: !1
            };
            e.vakata.dnd = {
                settings: {scroll_speed: 10, scroll_proximity: 20, helper_left: 5, helper_top: 10, threshold: 5},
                _trigger: function (t, i) {
                    var r = e.vakata.dnd._get();
                    r.event = i, e(document).triggerHandler("dnd_" + t + ".vakata", r)
                },
                _get: function () {
                    return {data: i.data, element: i.element, helper: i.helper}
                },
                _clean: function () {
                    i.helper && i.helper.remove(), i.scroll_i && (clearInterval(i.scroll_i), i.scroll_i = !1), i = {
                        element: !1,
                        is_down: !1,
                        is_drag: !1,
                        helper: !1,
                        helper_w: 0,
                        data: !1,
                        init_x: 0,
                        init_y: 0,
                        scroll_l: 0,
                        scroll_t: 0,
                        scroll_e: !1,
                        scroll_i: !1
                    }, e(document).off("mousemove touchmove", e.vakata.dnd.drag), e(document).off("mouseup touchend", e.vakata.dnd.stop)
                },
                _scroll: function (t) {
                    if (!i.scroll_e || !i.scroll_l && !i.scroll_t) return i.scroll_i && (clearInterval(i.scroll_i), i.scroll_i = !1), !1;
                    if (!i.scroll_i) return i.scroll_i = setInterval(e.vakata.dnd._scroll, 100), !1;
                    if (t === !0) return !1;
                    var r = i.scroll_e.scrollTop(), n = i.scroll_e.scrollLeft();
                    i.scroll_e.scrollTop(r + i.scroll_t * e.vakata.dnd.settings.scroll_speed), i.scroll_e.scrollLeft(n + i.scroll_l * e.vakata.dnd.settings.scroll_speed), (r !== i.scroll_e.scrollTop() || n !== i.scroll_e.scrollLeft()) && e.vakata.dnd._trigger("scroll", i.scroll_e)
                },
                start: function (t, r, n) {
                    "touchstart" === t.type && t.originalEvent && t.originalEvent.changedTouches && t.originalEvent.changedTouches[0] && (t.pageX = t.originalEvent.changedTouches[0].pageX, t.pageY = t.originalEvent.changedTouches[0].pageY, t.target = document.elementFromPoint(t.originalEvent.changedTouches[0].pageX - window.pageXOffset, t.originalEvent.changedTouches[0].pageY - window.pageYOffset)), i.is_drag && e.vakata.dnd.stop({});
                    try {
                        t.currentTarget.unselectable = "on", t.currentTarget.onselectstart = function () {
                            return !1
                        }, t.currentTarget.style && (t.currentTarget.style.MozUserSelect = "none")
                    } catch (s) {
                    }
                    return i.init_x = t.pageX, i.init_y = t.pageY, i.data = r, i.is_down = !0, i.element = t.currentTarget, n !== !1 && (i.helper = e("<div id='vakata-dnd'></div>").html(n).css({
                        display: "block",
                        margin: "0",
                        padding: "0",
                        position: "absolute",
                        top: "-2000px",
                        lineHeight: "16px",
                        zIndex: "10000"
                    })), e(document).bind("mousemove touchmove", e.vakata.dnd.drag), e(document).bind("mouseup touchend", e.vakata.dnd.stop), !1
                },
                drag: function (r) {
                    if ("touchmove" === r.type && r.originalEvent && r.originalEvent.changedTouches && r.originalEvent.changedTouches[0] && (r.pageX = r.originalEvent.changedTouches[0].pageX, r.pageY = r.originalEvent.changedTouches[0].pageY, r.target = document.elementFromPoint(r.originalEvent.changedTouches[0].pageX - window.pageXOffset, r.originalEvent.changedTouches[0].pageY - window.pageYOffset)), i.is_down) {
                        if (!i.is_drag) {
                            if (!(Math.abs(r.pageX - i.init_x) > e.vakata.dnd.settings.threshold || Math.abs(r.pageY - i.init_y) > e.vakata.dnd.settings.threshold)) return;
                            i.helper && (i.helper.appendTo("body"), i.helper_w = i.helper.outerWidth()), i.is_drag = !0, e.vakata.dnd._trigger("start", r)
                        }
                        var n = !1, s = !1, a = !1, d = !1, o = !1, l = !1, c = !1, h = !1, _ = !1, u = !1;
                        i.scroll_t = 0, i.scroll_l = 0, i.scroll_e = !1, e(e(r.target).parentsUntil("body").addBack().get().reverse()).filter(function () {
                            return /^auto|scroll$/.test(e(this).css("overflow")) && (this.scrollHeight > this.offsetHeight || this.scrollWidth > this.offsetWidth)
                        }).each(function () {
                            var n = e(this), s = n.offset();
                            return this.scrollHeight > this.offsetHeight && (s.top + n.height() - r.pageY < e.vakata.dnd.settings.scroll_proximity && (i.scroll_t = 1), r.pageY - s.top < e.vakata.dnd.settings.scroll_proximity && (i.scroll_t = -1)), this.scrollWidth > this.offsetWidth && (s.left + n.width() - r.pageX < e.vakata.dnd.settings.scroll_proximity && (i.scroll_l = 1), r.pageX - s.left < e.vakata.dnd.settings.scroll_proximity && (i.scroll_l = -1)), i.scroll_t || i.scroll_l ? (i.scroll_e = e(this), !1) : t
                        }), i.scroll_e || (n = e(document), s = e(window), a = n.height(), d = s.height(), o = n.width(), l = s.width(), c = n.scrollTop(), h = n.scrollLeft(), a > d && r.pageY - c < e.vakata.dnd.settings.scroll_proximity && (i.scroll_t = -1), a > d && d - (r.pageY - c) < e.vakata.dnd.settings.scroll_proximity && (i.scroll_t = 1), o > l && r.pageX - h < e.vakata.dnd.settings.scroll_proximity && (i.scroll_l = -1), o > l && l - (r.pageX - h) < e.vakata.dnd.settings.scroll_proximity && (i.scroll_l = 1), (i.scroll_t || i.scroll_l) && (i.scroll_e = n)), i.scroll_e && e.vakata.dnd._scroll(!0), i.helper && (_ = parseInt(r.pageY + e.vakata.dnd.settings.helper_top, 10), u = parseInt(r.pageX + e.vakata.dnd.settings.helper_left, 10), a && _ + 25 > a && (_ = a - 50), o && u + i.helper_w > o && (u = o - (i.helper_w + 2)), i.helper.css({
                            left: u + "px",
                            top: _ + "px"
                        })), e.vakata.dnd._trigger("move", r)
                    }
                },
                stop: function (t) {
                    "touchend" === t.type && t.originalEvent && t.originalEvent.changedTouches && t.originalEvent.changedTouches[0] && (t.pageX = t.originalEvent.changedTouches[0].pageX, t.pageY = t.originalEvent.changedTouches[0].pageY, t.target = document.elementFromPoint(t.originalEvent.changedTouches[0].pageX - window.pageXOffset, t.originalEvent.changedTouches[0].pageY - window.pageYOffset)), i.is_drag && e.vakata.dnd._trigger("stop", t), e.vakata.dnd._clean()
                }
            }
        }(jQuery), e.jstree.defaults.search = {
            ajax: !1,
            fuzzy: !0,
            case_sensitive: !1,
            show_only_matches: !1,
            close_opened_onclear: !0,
            search_leaves_only: !1
        }, e.jstree.plugins.search = function (i, r) {
            this.bind = function () {
                r.bind.call(this), this._data.search.str = "", this._data.search.dom = e(), this._data.search.res = [], this._data.search.opn = [], this.element.on("before_open.jstree", e.proxy(function (t, i) {
                    var r, n, s, a = this._data.search.res, d = [], o = e();
                    if (a && a.length && (this._data.search.dom = e(this.element[0].querySelectorAll("#" + e.map(a, function (t) {
                        return -1 !== "0123456789".indexOf(t[0]) ? "\\3" + t[0] + " " + t.substr(1).replace(e.jstree.idregex, "\\$&") : t.replace(e.jstree.idregex, "\\$&")
                    }).join(", #"))), this._data.search.dom.children(".jstree-anchor").addClass("jstree-search"), this.settings.search.show_only_matches && this._data.search.res.length)) {
                        for (r = 0, n = a.length; n > r; r++) d = d.concat(this.get_node(a[r]).parents);
                        d = e.vakata.array_remove_item(e.vakata.array_unique(d), "#"), o = d.length ? e(this.element[0].querySelectorAll("#" + e.map(d, function (t) {
                            return -1 !== "0123456789".indexOf(t[0]) ? "\\3" + t[0] + " " + t.substr(1).replace(e.jstree.idregex, "\\$&") : t.replace(e.jstree.idregex, "\\$&")
                        }).join(", #"))) : e(), this.element.find(".jstree-node").hide().filter(".jstree-last").filter(function () {
                            return this.nextSibling
                        }).removeClass("jstree-last"), o = o.add(this._data.search.dom), o.parentsUntil(".jstree").addBack().show().filter(".jstree-children").each(function () {
                            e(this).children(".jstree-node:visible").eq(-1).addClass("jstree-last")
                        })
                    }
                }, this)), this.settings.search.show_only_matches && this.element.on("search.jstree", function (t, i) {
                    i.nodes.length && (e(this).find(".jstree-node").hide().filter(".jstree-last").filter(function () {
                        return this.nextSibling
                    }).removeClass("jstree-last"), i.nodes.parentsUntil(".jstree").addBack().show().filter(".jstree-children").each(function () {
                        e(this).children(".jstree-node:visible").eq(-1).addClass("jstree-last")
                    }))
                }).on("clear_search.jstree", function (t, i) {
                    i.nodes.length && e(this).find(".jstree-node").css("display", "").filter(".jstree-last").filter(function () {
                        return this.nextSibling
                    }).removeClass("jstree-last")
                })
            }, this.search = function (i, r) {
                if (i === !1 || "" === e.trim(i)) return this.clear_search();
                var n = this.settings.search, s = n.ajax ? n.ajax : !1, a = null, d = [], o = [], l, c;
                return this._data.search.res.length && this.clear_search(), r || s === !1 ? (this._data.search.str = i, this._data.search.dom = e(), this._data.search.res = [], this._data.search.opn = [], a = new e.vakata.search(i, !0, {
                    caseSensitive: n.case_sensitive,
                    fuzzy: n.fuzzy
                }), e.each(this._model.data, function (e, t) {
                    t.text && a.search(t.text).isMatch && (!n.search_leaves_only || t.state.loaded && 0 === t.children.length) && (d.push(e), o = o.concat(t.parents))
                }), d.length && (o = e.vakata.array_unique(o), this._search_open(o), this._data.search.dom = e(this.element[0].querySelectorAll("#" + e.map(d, function (t) {
                    return -1 !== "0123456789".indexOf(t[0]) ? "\\3" + t[0] + " " + t.substr(1).replace(e.jstree.idregex, "\\$&") : t.replace(e.jstree.idregex, "\\$&")
                }).join(", #"))), this._data.search.res = d, this._data.search.dom.children(".jstree-anchor").addClass("jstree-search")), this.trigger("search", {
                    nodes: this._data.search.dom,
                    str: i,
                    res: this._data.search.res
                }), t) : e.isFunction(s) ? s.call(this, i, e.proxy(function (t) {
                    t && t.d && (t = t.d), this._load_nodes(e.isArray(t) ? t : [], function () {
                        this.search(i, !0)
                    })
                }, this)) : (s = e.extend({}, s), s.data || (s.data = {}), s.data.str = i, e.ajax(s).fail(e.proxy(function () {
                    this._data.core.last_error = {
                        error: "ajax",
                        plugin: "search",
                        id: "search_01",
                        reason: "Could not load search parents",
                        data: JSON.stringify(s)
                    }, this.settings.core.error.call(this, this._data.core.last_error)
                }, this)).done(e.proxy(function (t) {
                    t && t.d && (t = t.d), this._load_nodes(e.isArray(t) ? t : [], function () {
                        this.search(i, !0)
                    }, !0)
                }, this)))
            }, this.clear_search = function () {
                this._data.search.dom.children(".jstree-anchor").removeClass("jstree-search"), this.settings.search.close_opened_onclear && this.close_node(this._data.search.opn, 0), this.trigger("clear_search", {
                    nodes: this._data.search.dom,
                    str: this._data.search.str,
                    res: this._data.search.res
                }), this._data.search.str = "", this._data.search.res = [], this._data.search.opn = [], this._data.search.dom = e()
            }, this._search_open = function (t) {
                var i = this;
                e.each(t.concat([]), function (r, n) {
                    if ("#" === n) return !0;
                    try {
                        n = e("#" + n.replace(e.jstree.idregex, "\\$&"), i.element)
                    } catch (s) {
                    }
                    n && n.length && i.is_closed(n) && (i._data.search.opn.push(n[0].id), i.open_node(n, function () {
                        i._search_open(t)
                    }, 0))
                })
            }
        }, function (e) {
            e.vakata.search = function (e, t, i) {
                i = i || {}, i.fuzzy !== !1 && (i.fuzzy = !0), e = i.caseSensitive ? e : e.toLowerCase();
                var r = i.location || 0, n = i.distance || 100, s = i.threshold || .6, a = e.length, d, o, l, c;
                return a > 32 && (i.fuzzy = !1), i.fuzzy && (d = 1 << a - 1, o = function () {
                    var t = {}, i = 0;
                    for (i = 0; a > i; i++) t[e.charAt(i)] = 0;
                    for (i = 0; a > i; i++) t[e.charAt(i)] |= 1 << a - i - 1;
                    return t
                }(), l = function (e, t) {
                    var i = e / a, s = Math.abs(r - t);
                    return n ? i + s / n : s ? 1 : i
                }), c = function (t) {
                    if (t = i.caseSensitive ? t : t.toLowerCase(), e === t || -1 !== t.indexOf(e)) return {
                        isMatch: !0,
                        score: 0
                    };
                    if (!i.fuzzy) return {isMatch: !1, score: 1};
                    var n, c, h = t.length, _ = s, u = t.indexOf(e, r), g, f, p = a + h, m, v, j, y, x, k = 1, b = [];
                    for (-1 !== u && (_ = Math.min(l(0, u), _), u = t.lastIndexOf(e, r + a), -1 !== u && (_ = Math.min(l(0, u), _))), u = -1, n = 0; a > n; n++) {
                        g = 0, f = p;
                        while (f > g) _ >= l(n, r + f) ? g = f : p = f, f = Math.floor((p - g) / 2 + g);
                        for (p = f, v = Math.max(1, r - f + 1), j = Math.min(r + f, h) + a, y = Array(j + 2), y[j + 1] = (1 << n) - 1, c = j; c >= v; c--) if (x = o[t.charAt(c - 1)], y[c] = 0 === n ? (1 | y[c + 1] << 1) & x : (1 | y[c + 1] << 1) & x | (1 | (m[c + 1] | m[c]) << 1) | m[c + 1], y[c] & d && (k = l(n, c - 1), _ >= k)) {
                            if (_ = k, u = c - 1, b.push(u), !(u > r)) break;
                            v = Math.max(1, 2 * r - u)
                        }
                        if (l(n + 1, r) > _) break;
                        m = y
                    }
                    return {isMatch: u >= 0, score: k}
                }, t === !0 ? {search: c} : c(t)
            }
        }(jQuery), e.jstree.defaults.sort = function (e, t) {
            return this.get_text(e) > this.get_text(t) ? 1 : -1
        }, e.jstree.plugins.sort = function (t, i) {
            this.bind = function () {
                i.bind.call(this), this.element.on("model.jstree", e.proxy(function (e, t) {
                    this.sort(t.parent, !0)
                }, this)).on("rename_node.jstree create_node.jstree", e.proxy(function (e, t) {
                    this.sort(t.parent || t.node.parent, !1), this.redraw_node(t.parent || t.node.parent, !0)
                }, this)).on("move_node.jstree copy_node.jstree", e.proxy(function (e, t) {
                    this.sort(t.parent, !1), this.redraw_node(t.parent, !0)
                }, this))
            }, this.sort = function (t, i) {
                var r, n;
                if (t = this.get_node(t), t && t.children && t.children.length && (t.children.sort(e.proxy(this.settings.sort, this)), i)) for (r = 0, n = t.children_d.length; n > r; r++) this.sort(t.children_d[r], !1)
            }
        };
        var u = !1;
        e.jstree.defaults.state = {
            key: "jstree",
            events: "changed.jstree open_node.jstree close_node.jstree",
            ttl: !1,
            filter: !1
        }, e.jstree.plugins.state = function (t, i) {
            this.bind = function () {
                i.bind.call(this);
                var t = e.proxy(function () {
                    this.element.on(this.settings.state.events, e.proxy(function () {
                        u && clearTimeout(u), u = setTimeout(e.proxy(function () {
                            this.save_state()
                        }, this), 100)
                    }, this))
                }, this);
                this.element.on("ready.jstree", e.proxy(function (e, i) {
                    this.element.one("restore_state.jstree", t), this.restore_state() || t()
                }, this))
            }, this.save_state = function () {
                var t = {state: this.get_state(), ttl: this.settings.state.ttl, sec: +new Date};
                e.vakata.storage.set(this.settings.state.key, JSON.stringify(t))
            }, this.restore_state = function () {
                var t = e.vakata.storage.get(this.settings.state.key);
                if (t) try {
                    t = JSON.parse(t)
                } catch (i) {
                    return !1
                }
                return t && t.ttl && t.sec && +new Date - t.sec > t.ttl ? !1 : (t && t.state && (t = t.state), t && e.isFunction(this.settings.state.filter) && (t = this.settings.state.filter.call(this, t)), t ? (this.element.one("set_state.jstree", function (i, r) {
                    r.instance.trigger("restore_state", {state: e.extend(!0, {}, t)})
                }), this.set_state(t), !0) : !1)
            }, this.clear_state = function () {
                return e.vakata.storage.del(this.settings.state.key)
            }
        }, function (e, t) {
            e.vakata.storage = {
                set: function (e, t) {
                    return window.localStorage.setItem(e, t)
                }, get: function (e) {
                    return window.localStorage.getItem(e)
                }, del: function (e) {
                    return window.localStorage.removeItem(e)
                }
            }
        }(jQuery), e.jstree.defaults.types = {"#": {}, "default": {}}, e.jstree.plugins.types = function (i, r) {
            this.init = function (e, i) {
                var n, s;
                if (i && i.types && i.types["default"]) for (n in i.types) if ("default" !== n && "#" !== n && i.types.hasOwnProperty(n)) for (s in i.types["default"]) i.types["default"].hasOwnProperty(s) && i.types[n][s] === t && (i.types[n][s] = i.types["default"][s]);
                r.init.call(this, e, i), this._model.data["#"].type = "#"
            }, this.refresh = function (e) {
                r.refresh.call(this, e), this._model.data["#"].type = "#"
            }, this.bind = function () {
                this.element.on("model.jstree", e.proxy(function (e, i) {
                    var r = this._model.data, n = i.nodes, s = this.settings.types, a, d, o = "default";
                    for (a = 0, d = n.length; d > a; a++) o = "default", r[n[a]].original && r[n[a]].original.type && s[r[n[a]].original.type] && (o = r[n[a]].original.type), r[n[a]].data && r[n[a]].data.jstree && r[n[a]].data.jstree.type && s[r[n[a]].data.jstree.type] && (o = r[n[a]].data.jstree.type), r[n[a]].type = o, r[n[a]].icon === !0 && s[o].icon !== t && (r[n[a]].icon = s[o].icon)
                }, this)), r.bind.call(this)
            }, this.get_json = function (t, i, n) {
                var s, a, d = this._model.data, o = i ? e.extend(!0, {}, i, {no_id: !1}) : {},
                    l = r.get_json.call(this, t, o, n);
                if (l === !1) return !1;
                if (e.isArray(l)) for (s = 0, a = l.length; a > s; s++) l[s].type = l[s].id && d[l[s].id] && d[l[s].id].type ? d[l[s].id].type : "default", i && i.no_id && (delete l[s].id, l[s].li_attr && l[s].li_attr.id && delete l[s].li_attr.id); else l.type = l.id && d[l.id] && d[l.id].type ? d[l.id].type : "default", i && i.no_id && (l = this._delete_ids(l));
                return l
            }, this._delete_ids = function (t) {
                if (e.isArray(t)) {
                    for (var i = 0, r = t.length; r > i; i++) t[i] = this._delete_ids(t[i]);
                    return t
                }
                return delete t.id, t.li_attr && t.li_attr.id && delete t.li_attr.id, t.children && e.isArray(t.children) && (t.children = this._delete_ids(t.children)), t
            }, this.check = function (i, n, s, a, d) {
                if (r.check.call(this, i, n, s, a, d) === !1) return !1;
                n = n && n.id ? n : this.get_node(n), s = s && s.id ? s : this.get_node(s);
                var o = n && n.id ? e.jstree.reference(n.id) : null, l, c, h, _;
                switch (o = o && o._model && o._model.data ? o._model.data : null, i) {
                    case"create_node":
                    case"move_node":
                    case"copy_node":
                        if ("move_node" !== i || -1 === e.inArray(n.id, s.children)) {
                            if (l = this.get_rules(s), l.max_children !== t && -1 !== l.max_children && l.max_children === s.children.length) return this._data.core.last_error = {
                                error: "check",
                                plugin: "types",
                                id: "types_01",
                                reason: "max_children prevents function: " + i,
                                data: JSON.stringify({
                                    chk: i,
                                    pos: a,
                                    obj: n && n.id ? n.id : !1,
                                    par: s && s.id ? s.id : !1
                                })
                            }, !1;
                            if (l.valid_children !== t && -1 !== l.valid_children && -1 === e.inArray(n.type, l.valid_children)) return this._data.core.last_error = {
                                error: "check",
                                plugin: "types",
                                id: "types_02",
                                reason: "valid_children prevents function: " + i,
                                data: JSON.stringify({
                                    chk: i,
                                    pos: a,
                                    obj: n && n.id ? n.id : !1,
                                    par: s && s.id ? s.id : !1
                                })
                            }, !1;
                            if (o && n.children_d && n.parents) {
                                for (c = 0, h = 0, _ = n.children_d.length; _ > h; h++) c = Math.max(c, o[n.children_d[h]].parents.length);
                                c = c - n.parents.length + 1
                            }
                            (0 >= c || c === t) && (c = 1);
                            do {
                                if (l.max_depth !== t && -1 !== l.max_depth && c > l.max_depth) return this._data.core.last_error = {
                                    error: "check",
                                    plugin: "types",
                                    id: "types_03",
                                    reason: "max_depth prevents function: " + i,
                                    data: JSON.stringify({
                                        chk: i,
                                        pos: a,
                                        obj: n && n.id ? n.id : !1,
                                        par: s && s.id ? s.id : !1
                                    })
                                }, !1;
                                s = this.get_node(s.parent), l = this.get_rules(s), c++
                            } while (s)
                        }
                }
                return !0
            }, this.get_rules = function (e) {
                if (e = this.get_node(e), !e) return !1;
                var i = this.get_type(e, !0);
                return i.max_depth === t && (i.max_depth = -1), i.max_children === t && (i.max_children = -1), i.valid_children === t && (i.valid_children = -1), i
            }, this.get_type = function (t, i) {
                return t = this.get_node(t), t ? i ? e.extend({type: t.type}, this.settings.types[t.type]) : t.type : !1
            }, this.set_type = function (i, r) {
                var n, s, a, d, o;
                if (e.isArray(i)) {
                    for (i = i.slice(), s = 0, a = i.length; a > s; s++) this.set_type(i[s], r);
                    return !0
                }
                return n = this.settings.types, i = this.get_node(i), n[r] && i ? (d = i.type, o = this.get_icon(i), i.type = r, (o === !0 || n[d] && n[d].icon && o === n[d].icon) && this.set_icon(i, n[r].icon !== t ? n[r].icon : !0), !0) : !1
            }
        }, e.jstree.plugins.unique = function (i, r) {
            this.check = function (t, i, n, s, a) {
                if (r.check.call(this, t, i, n, s, a) === !1) return !1;
                if (i = i && i.id ? i : this.get_node(i), n = n && n.id ? n : this.get_node(n), !n || !n.children) return !0;
                var d = "rename_node" === t ? s : i.text, o = [], l = this._model.data, c, h;
                for (c = 0, h = n.children.length; h > c; c++) o.push(l[n.children[c]].text);
                switch (t) {
                    case"delete_node":
                        return !0;
                    case"rename_node":
                        return c = -1 === e.inArray(d, o) || i.text && i.text === d, c || (this._data.core.last_error = {
                            error: "check",
                            plugin: "unique",
                            id: "unique_01",
                            reason: "Child with name " + d + " already exists. Preventing: " + t,
                            data: JSON.stringify({
                                chk: t,
                                pos: s,
                                obj: i && i.id ? i.id : !1,
                                par: n && n.id ? n.id : !1
                            })
                        }), c;
                    case"create_node":
                        return c = -1 === e.inArray(d, o), c || (this._data.core.last_error = {
                            error: "check",
                            plugin: "unique",
                            id: "unique_04",
                            reason: "Child with name " + d + " already exists. Preventing: " + t,
                            data: JSON.stringify({
                                chk: t,
                                pos: s,
                                obj: i && i.id ? i.id : !1,
                                par: n && n.id ? n.id : !1
                            })
                        }), c;
                    case"copy_node":
                        return c = -1 === e.inArray(d, o), c || (this._data.core.last_error = {
                            error: "check",
                            plugin: "unique",
                            id: "unique_02",
                            reason: "Child with name " + d + " already exists. Preventing: " + t,
                            data: JSON.stringify({
                                chk: t,
                                pos: s,
                                obj: i && i.id ? i.id : !1,
                                par: n && n.id ? n.id : !1
                            })
                        }), c;
                    case"move_node":
                        return c = i.parent === n.id || -1 === e.inArray(d, o), c || (this._data.core.last_error = {
                            error: "check",
                            plugin: "unique",
                            id: "unique_03",
                            reason: "Child with name " + d + " already exists. Preventing: " + t,
                            data: JSON.stringify({
                                chk: t,
                                pos: s,
                                obj: i && i.id ? i.id : !1,
                                par: n && n.id ? n.id : !1
                            })
                        }), c
                }
                return !0
            }, this.create_node = function (i, n, s, a, d) {
                if (!n || n.text === t) {
                    if (null === i && (i = "#"), i = this.get_node(i), !i) return r.create_node.call(this, i, n, s, a, d);
                    if (s = s === t ? "last" : s, !("" + s).match(/^(before|after)$/) && !d && !this.is_loaded(i)) return r.create_node.call(this, i, n, s, a, d);
                    n || (n = {});
                    var o, l, c, h, _, u = this._model.data;
                    for (l = o = this.get_string("New node"), c = [], h = 0, _ = i.children.length; _ > h; h++) c.push(u[i.children[h]].text);
                    h = 1;
                    while (-1 !== e.inArray(l, c)) l = o + " (" + ++h + ")";
                    n.text = l
                }
                return r.create_node.call(this, i, n, s, a, d)
            }
        };
        var g = document.createElement("DIV");
        g.setAttribute("unselectable", "on"), g.className = "jstree-wholerow", g.innerHTML = "&#160;", e.jstree.plugins.wholerow = function (t, i) {
            this.bind = function () {
                i.bind.call(this), this.element.on("ready.jstree set_state.jstree", e.proxy(function () {
                    this.hide_dots()
                }, this)).on("init.jstree loading.jstree ready.jstree", e.proxy(function () {
                    g.style.height = this._data.core.li_height + "px", this.get_container_ul().addClass("jstree-wholerow-ul")
                }, this)).on("deselect_all.jstree", e.proxy(function (e, t) {
                    this.element.find(".jstree-wholerow-clicked").removeClass("jstree-wholerow-clicked")
                }, this)).on("changed.jstree", e.proxy(function (e, t) {
                    this.element.find(".jstree-wholerow-clicked").removeClass("jstree-wholerow-clicked");
                    var i = !1, r, n;
                    for (r = 0, n = t.selected.length; n > r; r++) i = this.get_node(t.selected[r], !0), i && i.length && i.children(".jstree-wholerow").addClass("jstree-wholerow-clicked")
                }, this)).on("open_node.jstree", e.proxy(function (e, t) {
                    this.get_node(t.node, !0).find(".jstree-clicked").parent().children(".jstree-wholerow").addClass("jstree-wholerow-clicked")
                }, this)).on("hover_node.jstree dehover_node.jstree", e.proxy(function (e, t) {
                    this.get_node(t.node, !0).children(".jstree-wholerow")["hover_node" === e.type ? "addClass" : "removeClass"]("jstree-wholerow-hovered")
                }, this)).on("contextmenu.jstree", ".jstree-wholerow", e.proxy(function (t) {
                    t.preventDefault();
                    var i = e.Event("contextmenu", {
                        metaKey: t.metaKey,
                        ctrlKey: t.ctrlKey,
                        altKey: t.altKey,
                        shiftKey: t.shiftKey,
                        pageX: t.pageX,
                        pageY: t.pageY
                    });
                    e(t.currentTarget).closest(".jstree-node").children(".jstree-anchor:eq(0)").trigger(i)
                }, this)).on("click.jstree", ".jstree-wholerow", function (t) {
                    t.stopImmediatePropagation();
                    var i = e.Event("click", {
                        metaKey: t.metaKey,
                        ctrlKey: t.ctrlKey,
                        altKey: t.altKey,
                        shiftKey: t.shiftKey
                    });
                    e(t.currentTarget).closest(".jstree-node").children(".jstree-anchor:eq(0)").trigger(i).focus()
                }).on("click.jstree", ".jstree-leaf > .jstree-ocl", e.proxy(function (t) {
                    t.stopImmediatePropagation();
                    var i = e.Event("click", {
                        metaKey: t.metaKey,
                        ctrlKey: t.ctrlKey,
                        altKey: t.altKey,
                        shiftKey: t.shiftKey
                    });
                    e(t.currentTarget).closest(".jstree-node").children(".jstree-anchor:eq(0)").trigger(i).focus()
                }, this)).on("mouseover.jstree", ".jstree-wholerow, .jstree-icon", e.proxy(function (e) {
                    return e.stopImmediatePropagation(), this.hover_node(e.currentTarget), !1
                }, this)).on("mouseleave.jstree", ".jstree-node", e.proxy(function (e) {
                    this.dehover_node(e.currentTarget)
                }, this))
            }, this.teardown = function () {
                this.settings.wholerow && this.element.find(".jstree-wholerow").remove(), i.teardown.call(this)
            }, this.redraw_node = function (t, r, n) {
                if (t = i.redraw_node.call(this, t, r, n)) {
                    var s = g.cloneNode(!0);
                    -1 !== e.inArray(t.id, this._data.core.selected) && (s.className += " jstree-wholerow-clicked"), t.insertBefore(s, t.childNodes[0])
                }
                return t
            }
        }
    }
});