/*
 Highcharts JS v4.2.3 (2016-02-08)

 (c) 2009-2016 Torstein Honsi

 License: www.highcharts.com/license
 */
(function (m) {
    typeof module === "object" && module.exports ? module.exports = m : m(Highcharts)
})(function (m) {
    function J(a, b, c) {
        this.init(a, b, c)
    }

    var O = m.arrayMin, P = m.arrayMax, s = m.each, F = m.extend, t = m.merge, Q = m.map, q = m.pick, A = m.pInt, o = m.getOptions().plotOptions, k = m.seriesTypes, u = m.extendClass, K = m.splat, v = m.wrap, L = m.Axis, y = m.Tick, G = m.Point, R = m.Pointer, S = m.CenteredSeriesMixin, B = m.TrackerMixin, w = m.Series, x = Math, E = x.round, C = x.floor, M = x.max, T = m.Color, r = function () {
    };
    F(J.prototype, {
        init: function (a, b, c) {
            var d = this, g =
                d.defaultOptions;
            d.chart = b;
            d.options = a = t(g, b.angular ? {background: {}} : void 0, a);
            (a = a.background) && s([].concat(K(a)).reverse(), function (a) {
                var g = a.backgroundColor, b = c.userOptions, a = t(d.defaultBackgroundOptions, a);
                if (g)a.backgroundColor = g;
                a.color = a.backgroundColor;
                c.options.plotBands.unshift(a);
                b.plotBands = b.plotBands || [];
                b.plotBands !== c.options.plotBands && b.plotBands.unshift(a)
            })
        }, defaultOptions: {center: ["50%", "50%"], size: "85%", startAngle: 0}, defaultBackgroundOptions: {
            shape: "circle",
            borderWidth: 1,
            borderColor: "silver",
            backgroundColor: {linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1}, stops: [[0, "#FFF"], [1, "#DDD"]]},
            from: -Number.MAX_VALUE,
            innerRadius: 0,
            to: Number.MAX_VALUE,
            outerRadius: "105%"
        }
    });
    var z = L.prototype, y = y.prototype, U = {
        getOffset: r, redraw: function () {
            this.isDirty = !1
        }, render: function () {
            this.isDirty = !1
        }, setScale: r, setCategories: r, setTitle: r
    }, N = {
        isRadial: !0,
        defaultRadialGaugeOptions: {
            labels: {align: "center", x: 0, y: null},
            minorGridLineWidth: 0,
            minorTickInterval: "auto",
            minorTickLength: 10,
            minorTickPosition: "inside",
            minorTickWidth: 1,
            tickLength: 10,
            tickPosition: "inside",
            tickWidth: 2,
            title: {rotation: 0},
            zIndex: 2
        },
        defaultRadialXOptions: {
            gridLineWidth: 1,
            labels: {align: null, distance: 15, x: 0, y: null},
            maxPadding: 0,
            minPadding: 0,
            showLastLabel: !1,
            tickLength: 0
        },
        defaultRadialYOptions: {
            gridLineInterpolation: "circle",
            labels: {align: "right", x: -3, y: -2},
            showLastLabel: !1,
            title: {x: 4, text: null, rotation: 90}
        },
        setOptions: function (a) {
            a = this.options = t(this.defaultOptions, this.defaultRadialOptions, a);
            if (!a.plotBands)a.plotBands = []
        },
        getOffset: function () {
            z.getOffset.call(this);
            this.chart.axisOffset[this.side] = 0;
            this.center = this.pane.center = S.getCenter.call(this.pane)
        },
        getLinePath: function (a, b) {
            var c = this.center, b = q(b, c[2] / 2 - this.offset);
            return this.chart.renderer.symbols.arc(this.left + c[0], this.top + c[1], b, b, {
                start: this.startAngleRad,
                end: this.endAngleRad,
                open: !0,
                innerR: 0
            })
        },
        setAxisTranslation: function () {
            z.setAxisTranslation.call(this);
            if (this.center)this.transA = this.isCircular ? (this.endAngleRad - this.startAngleRad) / (this.max - this.min || 1) : this.center[2] / 2 / (this.max - this.min ||
            1), this.minPixelPadding = this.isXAxis ? this.transA * this.minPointOffset : 0
        },
        beforeSetTickPositions: function () {
            this.autoConnect && (this.max += this.categories && 1 || this.pointRange || this.closestPointRange || 0)
        },
        setAxisSize: function () {
            z.setAxisSize.call(this);
            if (this.isRadial) {
                this.center = this.pane.center = m.CenteredSeriesMixin.getCenter.call(this.pane);
                if (this.isCircular)this.sector = this.endAngleRad - this.startAngleRad;
                this.len = this.width = this.height = this.center[2] * q(this.sector, 1) / 2
            }
        },
        getPosition: function (a,
                               b) {
            return this.postTranslate(this.isCircular ? this.translate(a) : 0, q(this.isCircular ? b : this.translate(a), this.center[2] / 2) - this.offset)
        },
        postTranslate: function (a, b) {
            var c = this.chart, d = this.center, a = this.startAngleRad + a;
            return {x: c.plotLeft + d[0] + Math.cos(a) * b, y: c.plotTop + d[1] + Math.sin(a) * b}
        },
        getPlotBandPath: function (a, b, c) {
            var d = this.center, g = this.startAngleRad, e = d[2] / 2, j = [q(c.outerRadius, "100%"), c.innerRadius, q(c.thickness, 10)], l = /%$/, i, f = this.isCircular;
            this.options.gridLineInterpolation === "polygon" ?
                d = this.getPlotLinePath(a).concat(this.getPlotLinePath(b, !0)) : (a = Math.max(a, this.min), b = Math.min(b, this.max), f || (j[0] = this.translate(a), j[1] = this.translate(b)), j = Q(j, function (a) {
                l.test(a) && (a = A(a, 10) * e / 100);
                return a
            }), c.shape === "circle" || !f ? (a = -Math.PI / 2, b = Math.PI * 1.5, i = !0) : (a = g + this.translate(a), b = g + this.translate(b)), d = this.chart.renderer.symbols.arc(this.left + d[0], this.top + d[1], j[0], j[0], {
                start: Math.min(a, b),
                end: Math.max(a, b),
                innerR: q(j[1], j[0] - j[2]),
                open: i
            }));
            return d
        },
        getPlotLinePath: function (a,
                                   b) {
            var c = this, d = c.center, g = c.chart, e = c.getPosition(a), j, l, i;
            c.isCircular ? i = ["M", d[0] + g.plotLeft, d[1] + g.plotTop, "L", e.x, e.y] : c.options.gridLineInterpolation === "circle" ? (a = c.translate(a)) && (i = c.getLinePath(0, a)) : (s(g.xAxis, function (a) {
                a.pane === c.pane && (j = a)
            }), i = [], a = c.translate(a), d = j.tickPositions, j.autoConnect && (d = d.concat([d[0]])), b && (d = [].concat(d).reverse()), s(d, function (e, b) {
                l = j.getPosition(e, a);
                i.push(b ? "L" : "M", l.x, l.y)
            }));
            return i
        },
        getTitlePosition: function () {
            var a = this.center, b = this.chart,
                c = this.options.title;
            return {
                x: b.plotLeft + a[0] + (c.x || 0),
                y: b.plotTop + a[1] - {high: 0.5, middle: 0.25, low: 0}[c.align] * a[2] + (c.y || 0)
            }
        }
    };
    v(z, "init", function (a, b, c) {
        var h;
        var d = b.angular, g = b.polar, e = c.isX, j = d && e, l, i;
        i = b.options;
        var f = c.pane || 0;
        if (d) {
            if (F(this, j ? U : N), l = !e)this.defaultRadialOptions = this.defaultRadialGaugeOptions
        } else if (g)F(this, N), this.defaultRadialOptions = (l = e) ? this.defaultRadialXOptions : t(this.defaultYAxisOptions, this.defaultRadialYOptions);
        a.call(this, b, c);
        if (!j && (d || g)) {
            a = this.options;
            if (!b.panes)b.panes =
                [];
            this.pane = (h = b.panes[f] = b.panes[f] || new J(K(i.pane)[f], b, this), f = h);
            f = f.options;
            b.inverted = !1;
            i.chart.zoomType = null;
            this.startAngleRad = b = (f.startAngle - 90) * Math.PI / 180;
            this.endAngleRad = i = (q(f.endAngle, f.startAngle + 360) - 90) * Math.PI / 180;
            this.offset = a.offset || 0;
            if ((this.isCircular = l) && c.max === void 0 && i - b === 2 * Math.PI)this.autoConnect = !0
        }
    });
    v(z, "autoLabelAlign", function (a) {
        if (!this.isRadial)return a.apply(this, [].slice.call(arguments, 1))
    });
    v(y, "getPosition", function (a, b, c, d, g) {
        var e = this.axis;
        return e.getPosition ?
            e.getPosition(c) : a.call(this, b, c, d, g)
    });
    v(y, "getLabelPosition", function (a, b, c, d, g, e, j, l, i) {
        var f = this.axis, h = e.y, n = 20, k = e.align, m = (f.translate(this.pos) + f.startAngleRad + Math.PI / 2) / Math.PI * 180 % 360;
        f.isRadial ? (a = f.getPosition(this.pos, f.center[2] / 2 + q(e.distance, -25)), e.rotation === "auto" ? d.attr({rotation: m}) : h === null && (h = f.chart.renderer.fontMetrics(d.styles.fontSize).b - d.getBBox().height / 2), k === null && (f.isCircular ? (this.label.getBBox().width > f.len * f.tickInterval / (f.max - f.min) && (n = 0), k = m > n && m < 180 - n ?
            "left" : m > 180 + n && m < 360 - n ? "right" : "center") : k = "center", d.attr({align: k})), a.x += e.x, a.y += h) : a = a.call(this, b, c, d, g, e, j, l, i);
        return a
    });
    v(y, "getMarkPath", function (a, b, c, d, g, e, j) {
        var l = this.axis;
        l.isRadial ? (a = l.getPosition(this.pos, l.center[2] / 2 + d), b = ["M", b, c, "L", a.x, a.y]) : b = a.call(this, b, c, d, g, e, j);
        return b
    });
    o.arearange = t(o.area, {
        lineWidth: 1,
        marker: null,
        threshold: null,
        tooltip: {pointFormat: '<span style="color:{series.color}">\u25cf</span> {series.name}: <b>{point.low}</b> - <b>{point.high}</b><br/>'},
        trackByArea: !0,
        dataLabels: {align: null, verticalAlign: null, xLow: 0, xHigh: 0, yLow: 0, yHigh: 0},
        states: {hover: {halo: !1}}
    });
    k.arearange = u(k.area, {
        type: "arearange",
        pointArrayMap: ["low", "high"],
        dataLabelCollections: ["dataLabel", "dataLabelUpper"],
        toYData: function (a) {
            return [a.low, a.high]
        },
        pointValKey: "low",
        deferTranslatePolar: !0,
        highToXY: function (a) {
            var b = this.chart, c = this.xAxis.postTranslate(a.rectPlotX, this.yAxis.len - a.plotHigh);
            a.plotHighX = c.x - b.plotLeft;
            a.plotHigh = c.y - b.plotTop
        },
        translate: function () {
            var a =
                this, b = a.yAxis;
            k.area.prototype.translate.apply(a);
            s(a.points, function (a) {
                var d = a.low, g = a.high, e = a.plotY;
                g === null || d === null ? a.isNull = !0 : (a.plotLow = e, a.plotHigh = b.translate(g, 0, 1, 0, 1))
            });
            this.chart.polar && s(this.points, function (b) {
                a.highToXY(b)
            })
        },
        getGraphPath: function () {
            var a = this.points, b = [], c = [], d = a.length, g = w.prototype.getGraphPath, e, j, l;
            l = this.options;
            for (var i = l.step, d = a.length; d--;)e = a[d], !e.isNull && (!a[d + 1] || a[d + 1].isNull) && c.push({
                plotX: e.plotX,
                plotY: e.plotLow
            }), j = {
                plotX: e.plotX, plotY: e.plotHigh,
                isNull: e.isNull
            }, c.push(j), b.push(j), !e.isNull && (!a[d - 1] || a[d - 1].isNull) && c.push({
                plotX: e.plotX,
                plotY: e.plotLow
            });
            a = g.call(this, a);
            if (i)i === !0 && (i = "left"), l.step = {left: "right", center: "center", right: "left"}[i];
            b = g.call(this, b);
            c = g.call(this, c);
            l.step = i;
            l = [].concat(a, b);
            !this.chart.polar && c[0] === "M" && (c[0] = "L");
            this.areaPath = this.areaPath.concat(a, c);
            return l
        },
        drawDataLabels: function () {
            var a = this.data, b = a.length, c, d = [], g = w.prototype, e = this.options.dataLabels, j = e.align, l = e.verticalAlign, i = e.inside, f,
                h, n = this.chart.inverted;
            if (e.enabled || this._hasPointLabels) {
                for (c = b; c--;)if (f = a[c]) {
                    h = i ? f.plotHigh < f.plotLow : f.plotHigh > f.plotLow;
                    f.y = f.high;
                    f._plotY = f.plotY;
                    f.plotY = f.plotHigh;
                    d[c] = f.dataLabel;
                    f.dataLabel = f.dataLabelUpper;
                    f.below = h;
                    if (n) {
                        if (!j)e.align = h ? "right" : "left"
                    } else if (!l)e.verticalAlign = h ? "top" : "bottom";
                    e.x = e.xHigh;
                    e.y = e.yHigh
                }
                g.drawDataLabels && g.drawDataLabels.apply(this, arguments);
                for (c = b; c--;)if (f = a[c]) {
                    h = i ? f.plotHigh < f.plotLow : f.plotHigh > f.plotLow;
                    f.dataLabelUpper = f.dataLabel;
                    f.dataLabel =
                        d[c];
                    f.y = f.low;
                    f.plotY = f._plotY;
                    f.below = !h;
                    if (n) {
                        if (!j)e.align = h ? "left" : "right"
                    } else if (!l)e.verticalAlign = h ? "bottom" : "top";
                    e.x = e.xLow;
                    e.y = e.yLow
                }
                g.drawDataLabels && g.drawDataLabels.apply(this, arguments)
            }
            e.align = j;
            e.verticalAlign = l
        },
        alignDataLabel: function () {
            k.column.prototype.alignDataLabel.apply(this, arguments)
        },
        setStackedPoints: r,
        getSymbol: r,
        drawPoints: r
    });
    o.areasplinerange = t(o.arearange);
    k.areasplinerange = u(k.arearange, {type: "areasplinerange", getPointSpline: k.spline.prototype.getPointSpline});
    (function () {
        var a = k.column.prototype;
        o.columnrange = t(o.column, o.arearange, {lineWidth: 1, pointRange: null});
        k.columnrange = u(k.arearange, {
            type: "columnrange",
            translate: function () {
                var b = this, c = b.yAxis, d = b.xAxis, g = b.chart, e;
                a.translate.apply(b);
                s(b.points, function (a) {
                    var l = a.shapeArgs, i = b.options.minPointLength, f, h;
                    a.plotHigh = e = c.translate(a.high, 0, 1, 0, 1);
                    a.plotLow = a.plotY;
                    h = e;
                    f = a.plotY - e;
                    Math.abs(f) < i ? (i -= f, f += i, h -= i / 2) : f < 0 && (f *= -1, h -= f);
                    l.height = f;
                    l.y = h;
                    a.tooltipPos = g.inverted ? [c.len + c.pos - g.plotLeft -
                    h - f / 2, d.len + d.pos - g.plotTop - l.x - l.width / 2, f] : [d.left - g.plotLeft + l.x + l.width / 2, c.pos - g.plotTop + h + f / 2, f]
                })
            },
            directTouch: !0,
            trackerGroups: ["group", "dataLabelsGroup"],
            drawGraph: r,
            crispCol: a.crispCol,
            pointAttrToOptions: a.pointAttrToOptions,
            drawPoints: a.drawPoints,
            drawTracker: a.drawTracker,
            animate: a.animate,
            getColumnMetrics: a.getColumnMetrics
        })
    })();
    o.gauge = t(o.line, {
        dataLabels: {
            enabled: !0,
            defer: !1,
            y: 15,
            borderWidth: 1,
            borderColor: "silver",
            borderRadius: 3,
            crop: !1,
            verticalAlign: "top",
            zIndex: 2
        }, dial: {}, pivot: {},
        tooltip: {headerFormat: ""}, showInLegend: !1
    });
    B = {
        type: "gauge",
        pointClass: u(G, {
            setState: function (a) {
                this.state = a
            }
        }),
        angular: !0,
        drawGraph: r,
        fixedBox: !0,
        forceDL: !0,
        trackerGroups: ["group", "dataLabelsGroup"],
        translate: function () {
            var a = this.yAxis, b = this.options, c = a.center;
            this.generatePoints();
            s(this.points, function (d) {
                var g = t(b.dial, d.dial), e = A(q(g.radius, 80)) * c[2] / 200, j = A(q(g.baseLength, 70)) * e / 100, l = A(q(g.rearLength, 10)) * e / 100, i = g.baseWidth || 3, f = g.topWidth || 1, h = b.overshoot, n = a.startAngleRad + a.translate(d.y,
                        null, null, null, !0);
                h && typeof h === "number" ? (h = h / 180 * Math.PI, n = Math.max(a.startAngleRad - h, Math.min(a.endAngleRad + h, n))) : b.wrap === !1 && (n = Math.max(a.startAngleRad, Math.min(a.endAngleRad, n)));
                n = n * 180 / Math.PI;
                d.shapeType = "path";
                d.shapeArgs = {
                    d: g.path || ["M", -l, -i / 2, "L", j, -i / 2, e, -f / 2, e, f / 2, j, i / 2, -l, i / 2, "z"],
                    translateX: c[0],
                    translateY: c[1],
                    rotation: n
                };
                d.plotX = c[0];
                d.plotY = c[1]
            })
        },
        drawPoints: function () {
            var a = this, b = a.yAxis.center, c = a.pivot, d = a.options, g = d.pivot, e = a.chart.renderer;
            s(a.points, function (b) {
                var g =
                    b.graphic, c = b.shapeArgs, f = c.d, h = t(d.dial, b.dial);
                g ? (g.animate(c), c.d = f) : b.graphic = e[b.shapeType](c).attr({
                    stroke: h.borderColor || "none",
                    "stroke-width": h.borderWidth || 0,
                    fill: h.backgroundColor || "black",
                    rotation: c.rotation,
                    zIndex: 1
                }).add(a.group)
            });
            c ? c.animate({
                translateX: b[0],
                translateY: b[1]
            }) : a.pivot = e.circle(0, 0, q(g.radius, 5)).attr({
                "stroke-width": g.borderWidth || 0,
                stroke: g.borderColor || "silver",
                fill: g.backgroundColor || "black",
                zIndex: 2
            }).translate(b[0], b[1]).add(a.group)
        },
        animate: function (a) {
            var b =
                this;
            if (!a)s(b.points, function (a) {
                var d = a.graphic;
                d && (d.attr({rotation: b.yAxis.startAngleRad * 180 / Math.PI}), d.animate({rotation: a.shapeArgs.rotation}, b.options.animation))
            }), b.animate = null
        },
        render: function () {
            this.group = this.plotGroup("group", "series", this.visible ? "visible" : "hidden", this.options.zIndex, this.chart.seriesGroup);
            w.prototype.render.call(this);
            this.group.clip(this.chart.clipRect)
        },
        setData: function (a, b) {
            w.prototype.setData.call(this, a, !1);
            this.processData();
            this.generatePoints();
            q(b, !0) &&
            this.chart.redraw()
        },
        drawTracker: B && B.drawTrackerPoint
    };
    k.gauge = u(k.line, B);
    o.boxplot = t(o.column, {
        fillColor: "#FFFFFF",
        lineWidth: 1,
        medianWidth: 2,
        states: {hover: {brightness: -0.3}},
        threshold: null,
        tooltip: {pointFormat: '<span style="color:{point.color}">\u25cf</span> <b> {series.name}</b><br/>Maximum: {point.high}<br/>Upper quartile: {point.q3}<br/>Median: {point.median}<br/>Lower quartile: {point.q1}<br/>Minimum: {point.low}<br/>'},
        whiskerLength: "50%",
        whiskerWidth: 2
    });
    k.boxplot = u(k.column, {
        type: "boxplot",
        pointArrayMap: ["low", "q1", "median", "q3", "high"],
        toYData: function (a) {
            return [a.low, a.q1, a.median, a.q3, a.high]
        },
        pointValKey: "high",
        pointAttrToOptions: {fill: "fillColor", stroke: "color", "stroke-width": "lineWidth"},
        drawDataLabels: r,
        translate: function () {
            var a = this.yAxis, b = this.pointArrayMap;
            k.column.prototype.translate.apply(this);
            s(this.points, function (c) {
                s(b, function (b) {
                    c[b] !== null && (c[b + "Plot"] = a.translate(c[b], 0, 1, 0, 1))
                })
            })
        },
        drawPoints: function () {
            var a = this, b = a.options, c = a.chart.renderer, d, g, e, j, l, i,
                f, h, n, k, m, H, I, o, t, r, v, u, w, x, B, A, y = a.doQuartiles !== !1, z, D = a.options.whiskerLength;
            s(a.points, function (p) {
                n = p.graphic;
                B = p.shapeArgs;
                m = {};
                o = {};
                r = {};
                A = p.color || a.color;
                if (p.plotY !== void 0)if (d = p.pointAttr[p.selected ? "selected" : ""], v = B.width, u = C(B.x), w = u + v, x = E(v / 2), g = C(y ? p.q1Plot : p.lowPlot), e = C(y ? p.q3Plot : p.lowPlot), j = C(p.highPlot), l = C(p.lowPlot), m.stroke = p.stemColor || b.stemColor || A, m["stroke-width"] = q(p.stemWidth, b.stemWidth, b.lineWidth), m.dashstyle = p.stemDashStyle || b.stemDashStyle, o.stroke = p.whiskerColor ||
                        b.whiskerColor || A, o["stroke-width"] = q(p.whiskerWidth, b.whiskerWidth, b.lineWidth), r.stroke = p.medianColor || b.medianColor || A, r["stroke-width"] = q(p.medianWidth, b.medianWidth, b.lineWidth), f = m["stroke-width"] % 2 / 2, h = u + x + f, k = ["M", h, e, "L", h, j, "M", h, g, "L", h, l], y && (f = d["stroke-width"] % 2 / 2, h = C(h) + f, g = C(g) + f, e = C(e) + f, u += f, w += f, H = ["M", u, e, "L", u, g, "L", w, g, "L", w, e, "L", u, e, "z"]), D && (f = o["stroke-width"] % 2 / 2, j += f, l += f, z = /%$/.test(D) ? x * parseFloat(D) / 100 : D / 2, I = ["M", h - z, j, "L", h + z, j, "M", h - z, l, "L", h + z, l]), f = r["stroke-width"] %
                        2 / 2, i = E(p.medianPlot) + f, t = ["M", u, i, "L", w, i], n)p.stem.animate({d: k}), D && p.whiskers.animate({d: I}), y && p.box.animate({d: H}), p.medianShape.animate({d: t}); else {
                    p.graphic = n = c.g().add(a.group);
                    p.stem = c.path(k).attr(m).add(n);
                    if (D)p.whiskers = c.path(I).attr(o).add(n);
                    if (y)p.box = c.path(H).attr(d).add(n);
                    p.medianShape = c.path(t).attr(r).add(n)
                }
            })
        },
        setStackedPoints: r
    });
    o.errorbar = t(o.boxplot, {
        color: "#000000",
        grouping: !1,
        linkedTo: ":previous",
        tooltip: {pointFormat: '<span style="color:{point.color}">\u25cf</span> {series.name}: <b>{point.low}</b> - <b>{point.high}</b><br/>'},
        whiskerWidth: null
    });
    k.errorbar = u(k.boxplot, {
        type: "errorbar",
        pointArrayMap: ["low", "high"],
        toYData: function (a) {
            return [a.low, a.high]
        },
        pointValKey: "high",
        doQuartiles: !1,
        drawDataLabels: k.arearange ? k.arearange.prototype.drawDataLabels : r,
        getColumnMetrics: function () {
            return this.linkedParent && this.linkedParent.columnMetrics || k.column.prototype.getColumnMetrics.call(this)
        }
    });
    o.waterfall = t(o.column, {
        lineWidth: 1,
        lineColor: "#333",
        dashStyle: "dot",
        borderColor: "#333",
        dataLabels: {inside: !0},
        states: {hover: {lineWidthPlus: 0}}
    });
    k.waterfall = u(k.column, {
        type: "waterfall", upColorProp: "fill", pointValKey: "y", translate: function () {
            var a = this.options, b = this.yAxis, c, d, g, e, j, l, i, f, h, n = q(a.minPointLength, 5), m = a.threshold, o = a.stacking;
            k.column.prototype.translate.apply(this);
            this.minPointLengthOffset = 0;
            i = f = m;
            d = this.points;
            for (c = 0, a = d.length; c < a; c++) {
                g = d[c];
                l = this.processedYData[c];
                e = g.shapeArgs;
                h = (j = o && b.stacks[(this.negStacks && l < m ? "-" : "") + this.stackKey]) ? j[g.x].points[this.index + "," + c] : [0, l];
                if (g.isSum)g.y = l; else if (g.isIntermediateSum)g.y =
                    l - f;
                j = M(i, i + g.y) + h[0];
                e.y = b.translate(j, 0, 1);
                if (g.isSum)e.y = b.translate(h[1], 0, 1), e.height = Math.min(b.translate(h[0], 0, 1), b.len) - e.y + this.minPointLengthOffset; else if (g.isIntermediateSum)e.y = b.translate(h[1], 0, 1), e.height = Math.min(b.translate(f, 0, 1), b.len) - e.y + this.minPointLengthOffset, f = h[1]; else {
                    if (i !== 0)e.height = l > 0 ? b.translate(i, 0, 1) - e.y : b.translate(i, 0, 1) - b.translate(i - l, 0, 1);
                    i += l
                }
                e.height < 0 && (e.y += e.height, e.height *= -1);
                g.plotY = e.y = E(e.y) - this.borderWidth % 2 / 2;
                e.height = M(E(e.height), 0.001);
                g.yBottom =
                    e.y + e.height;
                if (e.height <= n)e.height = n, this.minPointLengthOffset += n;
                e.y -= this.minPointLengthOffset;
                e = g.plotY + (g.negative ? e.height : 0) - this.minPointLengthOffset;
                this.chart.inverted ? g.tooltipPos[0] = b.len - e : g.tooltipPos[1] = e
            }
        }, processData: function (a) {
            var b = this.yData, c = this.options.data, d, g = b.length, e, j, l, i, f, h;
            j = e = l = i = this.options.threshold || 0;
            for (h = 0; h < g; h++)f = b[h], d = c && c[h] ? c[h] : {}, f === "sum" || d.isSum ? b[h] = j : f === "intermediateSum" || d.isIntermediateSum ? b[h] = e : (j += f, e += f), l = Math.min(j, l), i = Math.max(j,
                i);
            w.prototype.processData.call(this, a);
            this.dataMin = l;
            this.dataMax = i
        }, toYData: function (a) {
            return a.isSum ? a.x === 0 ? null : "sum" : a.isIntermediateSum ? a.x === 0 ? null : "intermediateSum" : a.y
        }, getAttribs: function () {
            k.column.prototype.getAttribs.apply(this, arguments);
            var a = this, b = a.options, c = b.states, d = b.upColor || a.color, b = m.Color(d).brighten(0.1).get(), g = t(a.pointAttr), e = a.upColorProp;
            g[""][e] = d;
            g.hover[e] = c.hover.upColor || b;
            g.select[e] = c.select.upColor || d;
            s(a.points, function (e) {
                if (!e.options.color)e.y > 0 ? (e.pointAttr =
                    g, e.color = d) : e.pointAttr = a.pointAttr
            })
        }, getGraphPath: function () {
            var a = this.data, b = a.length, c = E(this.options.lineWidth + this.borderWidth) % 2 / 2, d = [], g, e, j;
            for (j = 1; j < b; j++)e = a[j].shapeArgs, g = a[j - 1].shapeArgs, e = ["M", g.x + g.width, g.y + c, "L", e.x, g.y + c], a[j - 1].y < 0 && (e[2] += g.height, e[5] += g.height), d = d.concat(e);
            return d
        }, getExtremes: r, drawGraph: w.prototype.drawGraph
    });
    o.polygon = t(o.scatter, {marker: {enabled: !1}});
    k.polygon = u(k.scatter, {
        type: "polygon", fillGraph: !0, getSegmentPath: function (a) {
            return w.prototype.getSegmentPath.call(this,
                a).concat("z")
        }, drawGraph: w.prototype.drawGraph, drawLegendSymbol: m.LegendSymbolMixin.drawRectangle
    });
    o.bubble = t(o.scatter, {
        dataLabels: {
            formatter: function () {
                return this.point.z
            }, inside: !0, verticalAlign: "middle"
        },
        marker: {lineColor: null, lineWidth: 1},
        minSize: 8,
        maxSize: "20%",
        softThreshold: !1,
        states: {hover: {halo: {size: 5}}},
        tooltip: {pointFormat: "({point.x}, {point.y}), Size: {point.z}"},
        turboThreshold: 0,
        zThreshold: 0,
        zoneAxis: "z"
    });
    B = u(G, {
        haloPath: function () {
            return G.prototype.haloPath.call(this, this.shapeArgs.r +
                this.series.options.states.hover.halo.size)
        }, ttBelow: !1
    });
    k.bubble = u(k.scatter, {
        type: "bubble",
        pointClass: B,
        pointArrayMap: ["y", "z"],
        parallelArrays: ["x", "y", "z"],
        trackerGroups: ["group", "dataLabelsGroup"],
        bubblePadding: !0,
        zoneAxis: "z",
        pointAttrToOptions: {stroke: "lineColor", "stroke-width": "lineWidth", fill: "fillColor"},
        applyOpacity: function (a) {
            var b = this.options.marker, c = q(b.fillOpacity, 0.5), a = a || b.fillColor || this.color;
            c !== 1 && (a = T(a).setOpacity(c).get("rgba"));
            return a
        },
        convertAttribs: function () {
            var a =
                w.prototype.convertAttribs.apply(this, arguments);
            a.fill = this.applyOpacity(a.fill);
            return a
        },
        getRadii: function (a, b, c, d) {
            var g, e, j, l = this.zData, i = [], f = this.options, h = f.sizeBy !== "width", n = f.zThreshold, k = b - a;
            for (e = 0, g = l.length; e < g; e++)j = l[e], f.sizeByAbsoluteValue && j !== null && (j = Math.abs(j - n), b = Math.max(b - n, Math.abs(a - n)), a = 0), j === null ? j = null : j < a ? j = c / 2 - 1 : (j = k > 0 ? (j - a) / k : 0.5, h && j >= 0 && (j = Math.sqrt(j)), j = x.ceil(c + j * (d - c)) / 2), i.push(j);
            this.radii = i
        },
        animate: function (a) {
            var b = this.options.animation;
            if (!a)s(this.points,
                function (a) {
                    var d = a.graphic, a = a.shapeArgs;
                    d && a && (d.attr("r", 1), d.animate({r: a.r}, b))
                }), this.animate = null
        },
        translate: function () {
            var a, b = this.data, c, d, g = this.radii;
            k.scatter.prototype.translate.call(this);
            for (a = b.length; a--;)c = b[a], d = g ? g[a] : 0, typeof d === "number" && d >= this.minPxSize / 2 ? (c.shapeType = "circle", c.shapeArgs = {
                x: c.plotX,
                y: c.plotY,
                r: d
            }, c.dlBox = {
                x: c.plotX - d,
                y: c.plotY - d,
                width: 2 * d,
                height: 2 * d
            }) : c.shapeArgs = c.plotY = c.dlBox = void 0
        },
        drawLegendSymbol: function (a, b) {
            var c = this.chart.renderer, d = c.fontMetrics(a.itemStyle.fontSize).f /
                2;
            b.legendSymbol = c.circle(d, a.baseline - d, d).attr({zIndex: 3}).add(b.legendGroup);
            b.legendSymbol.isMarker = !0
        },
        drawPoints: k.column.prototype.drawPoints,
        alignDataLabel: k.column.prototype.alignDataLabel,
        buildKDTree: r,
        applyZones: r
    });
    L.prototype.beforePadding = function () {
        var a = this, b = this.len, c = this.chart, d = 0, g = b, e = this.isXAxis, j = e ? "xData" : "yData", l = this.min, i = {}, f = x.min(c.plotWidth, c.plotHeight), h = Number.MAX_VALUE, n = -Number.MAX_VALUE, k = this.max - l, m = b / k, o = [];
        s(this.series, function (b) {
            var g = b.options;
            if (b.bubblePadding &&
                (b.visible || !c.options.chart.ignoreHiddenSeries))if (a.allowZoomOutside = !0, o.push(b), e)s(["minSize", "maxSize"], function (a) {
                var b = g[a], e = /%$/.test(b), b = A(b);
                i[a] = e ? f * b / 100 : b
            }), b.minPxSize = i.minSize, b.maxPxSize = i.maxSize, b = b.zData, b.length && (h = q(g.zMin, x.min(h, x.max(O(b), g.displayNegative === !1 ? g.zThreshold : -Number.MAX_VALUE))), n = q(g.zMax, x.max(n, P(b))))
        });
        s(o, function (a) {
            var b = a[j], c = b.length, f;
            e && a.getRadii(h, n, a.minPxSize, a.maxPxSize);
            if (k > 0)for (; c--;)typeof b[c] === "number" && (f = a.radii[c], d = Math.min((b[c] -
                l) * m - f, d), g = Math.max((b[c] - l) * m + f, g))
        });
        o.length && k > 0 && !this.isLog && (g -= b, m *= (b + d - g) / b, s([["min", "userMin", d], ["max", "userMax", g]], function (b) {
            q(a.options[b[0]], a[b[1]]) === void 0 && (a[b[0]] += b[2] / m)
        }))
    };
    (function () {
        function a(a, b) {
            var c = this.chart, d = this.options.animation, i = this.group, f = this.markerGroup, h = this.xAxis.center, n = c.plotLeft, k = c.plotTop;
            if (c.polar) {
                if (c.renderer.isSVG)d === !0 && (d = {}), b ? (c = {
                    translateX: h[0] + n,
                    translateY: h[1] + k,
                    scaleX: 0.001,
                    scaleY: 0.001
                }, i.attr(c), f && f.attr(c)) : (c = {
                    translateX: n,
                    translateY: k, scaleX: 1, scaleY: 1
                }, i.animate(c, d), f && f.animate(c, d), this.animate = null)
            } else a.call(this, b)
        }

        var b = w.prototype, c = R.prototype, d;
        b.searchPointByAngle = function (a) {
            var b = this.chart, c = this.xAxis.pane.center;
            return this.searchKDTree({clientX: 180 + Math.atan2(a.chartX - c[0] - b.plotLeft, a.chartY - c[1] - b.plotTop) * (-180 / Math.PI)})
        };
        v(b, "buildKDTree", function (a) {
            if (this.chart.polar)this.kdByAngle ? this.searchPoint = this.searchPointByAngle : this.kdDimensions = 2;
            a.apply(this)
        });
        b.toXY = function (a) {
            var b, c = this.chart,
                d = a.plotX;
            b = a.plotY;
            a.rectPlotX = d;
            a.rectPlotY = b;
            b = this.xAxis.postTranslate(a.plotX, this.yAxis.len - b);
            a.plotX = a.polarPlotX = b.x - c.plotLeft;
            a.plotY = a.polarPlotY = b.y - c.plotTop;
            this.kdByAngle ? (c = (d / Math.PI * 180 + this.xAxis.pane.options.startAngle) % 360, c < 0 && (c += 360), a.clientX = c) : a.clientX = a.plotX
        };
        k.spline && v(k.spline.prototype, "getPointSpline", function (a, b, c, d) {
            var i, f, h, n, k, m, o;
            if (this.chart.polar) {
                i = c.plotX;
                f = c.plotY;
                a = b[d - 1];
                h = b[d + 1];
                this.connectEnds && (a || (a = b[b.length - 2]), h || (h = b[1]));
                if (a && h)n = a.plotX,
                    k = a.plotY, b = h.plotX, m = h.plotY, n = (1.5 * i + n) / 2.5, k = (1.5 * f + k) / 2.5, h = (1.5 * i + b) / 2.5, o = (1.5 * f + m) / 2.5, b = Math.sqrt(Math.pow(n - i, 2) + Math.pow(k - f, 2)), m = Math.sqrt(Math.pow(h - i, 2) + Math.pow(o - f, 2)), n = Math.atan2(k - f, n - i), k = Math.atan2(o - f, h - i), o = Math.PI / 2 + (n + k) / 2, Math.abs(n - o) > Math.PI / 2 && (o -= Math.PI), n = i + Math.cos(o) * b, k = f + Math.sin(o) * b, h = i + Math.cos(Math.PI + o) * m, o = f + Math.sin(Math.PI + o) * m, c.rightContX = h, c.rightContY = o;
                d ? (c = ["C", a.rightContX || a.plotX, a.rightContY || a.plotY, n || i, k || f, i, f], a.rightContX = a.rightContY = null) :
                    c = ["M", i, f]
            } else c = a.call(this, b, c, d);
            return c
        });
        v(b, "translate", function (a) {
            var b = this.chart;
            a.call(this);
            if (b.polar && (this.kdByAngle = b.tooltip && b.tooltip.shared, !this.preventPostTranslate)) {
                a = this.points;
                for (b = a.length; b--;)this.toXY(a[b])
            }
        });
        v(b, "getGraphPath", function (a, b) {
            var c = this;
            if (this.chart.polar) {
                b = b || this.points;
                if (this.options.connectEnds !== !1 && b[0].y !== null)this.connectEnds = !0, b.splice(b.length, 0, b[0]);
                s(b, function (a) {
                    a.polarPlotY === void 0 && c.toXY(a)
                })
            }
            return a.apply(this, [].slice.call(arguments,
                1))
        });
        v(b, "animate", a);
        if (k.column)d = k.column.prototype, v(d, "animate", a), v(d, "translate", function (a) {
            var b = this.xAxis, c = this.yAxis.len, d = b.center, i = b.startAngleRad, f = this.chart.renderer, h, k;
            this.preventPostTranslate = !0;
            a.call(this);
            if (b.isRadial) {
                b = this.points;
                for (k = b.length; k--;)h = b[k], a = h.barX + i, h.shapeType = "path", h.shapeArgs = {
                    d: f.symbols.arc(d[0], d[1], c - h.plotY, null, {
                        start: a,
                        end: a + h.pointWidth,
                        innerR: c - q(h.yBottom, c)
                    })
                }, this.toXY(h), h.tooltipPos = [h.plotX, h.plotY], h.ttBelow = h.plotY > d[1]
            }
        }), v(d,
            "alignDataLabel", function (a, c, d, l, i, f) {
                if (this.chart.polar) {
                    a = c.rectPlotX / Math.PI * 180;
                    if (l.align === null)l.align = a > 20 && a < 160 ? "left" : a > 200 && a < 340 ? "right" : "center";
                    if (l.verticalAlign === null)l.verticalAlign = a < 45 || a > 315 ? "bottom" : a > 135 && a < 225 ? "top" : "middle";
                    b.alignDataLabel.call(this, c, d, l, i, f)
                } else a.call(this, c, d, l, i, f)
            });
        v(c, "getCoordinates", function (a, b) {
            var c = this.chart, d = {xAxis: [], yAxis: []};
            c.polar ? s(c.axes, function (a) {
                var f = a.isXAxis, g = a.center, k = b.chartX - g[0] - c.plotLeft, g = b.chartY - g[1] - c.plotTop;
                d[f ? "xAxis" : "yAxis"].push({
                    axis: a,
                    value: a.translate(f ? Math.PI - Math.atan2(k, g) : Math.sqrt(Math.pow(k, 2) + Math.pow(g, 2)), !0)
                })
            }) : d = a.call(this, b);
            return d
        })
    })()
});