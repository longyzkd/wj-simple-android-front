
// 温度
    $(function () {

        $('#temp').highcharts({

                    chart: {
                        type: 'gauge',
                        plotBackgroundColor: null,
                        plotBackgroundImage:null,
                        plotBorderWidth: 0,
                        plotShadow: false
                    },
                    title:{text:" "},
                    credits: {text: " "},
                
                    pane: {
                        startAngle: -150,
                        endAngle: 150,
                        background: [{
                            backgroundColor: {
                                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                                stops: [
                                    [0, '#fff'],
                                    [1, '#fff']
                                ]
                            },
                            borderWidth: 0,
                            outerRadius: '100%'
                        }, {
                            backgroundColor: {
                                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                                stops: [
                                    [0, '#fff'],
                                    [1, '#FFF']
                                ]
                            },
                            borderWidth: 1,
                            outerRadius: '100%'
                        }, {
                            // default background
                        }, {
                            backgroundColor: '#f7f2f2',
                            borderWidth: 0,
                            outerRadius: '100%',
                            innerRadius: '100%'
                        }]
                    },

                    // the value axis
                    yAxis: {
                        min: -30,
                        max: 50,

                        minorTickInterval: 'auto',
                        minorTickWidth: 0,
                        minorTickLength: 15,
                        minorTickPosition: 'inside',
                        tickPosition: 'inside',
                        minorTickColor: '#fff',


                        tickPixelInterval: 30,
                        tickWidth: 1,
                       minorTickPosition: 'inside',
                        tickPosition: 'inside',
                        tickLength: 10,
                        tickColor: '#fff',
                        labels: {
                            step: 2,
                            rotation: 'auto'
                        },
                        title: {
                            text: '℃'
                        },
                        plotBands: [{
                            from: -30,
                            to: 0,
                            color: '#d51505' 
                        }, {
                            from: 0,
                            to: 30,
                            color: '#fef547' 
                        }, {
                            from: 30,
                            to: 50,
                            color: '#2fb43e' 
                        }]
                    },

                    series: [{
                        name: "温度",
                        // 默认获取的数值
                        data: [20],
                        tooltip: {
                            valueSuffix: '℃'
                        }
                    }]

                },
                // Add some life
                function (chart) {
                    if (!chart.renderer.forExport) {
                        setInterval(function () {
                            var point = chart.series[0].points[0],
                                    newVal,
                                    inc = Math.round((Math.random() - 0.5) * 20);

                            newVal = point.y + inc;
                            if (newVal < -30 || newVal > 50) {
                                newVal = point.y - inc;
                            }

                            // point.update(newVal);

                        }, 3000);
                    }
                });
    });

// 湿度
 $(function () {

        $('#humidity').highcharts({

                    chart: {
                        type: 'gauge',
                        plotBackgroundColor: null,
                        plotBackgroundImage:null,
                        plotBorderWidth: 0,
                        plotShadow: false
                    },
                    title:{text:" "},
                    credits: {text: " "},
                
                    pane: {
                        startAngle: -150,
                        endAngle: 150,
                        background: [{
                            backgroundColor: {
                                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                                stops: [
                                    [0, '#fff'],
                                    [1, '#fff']
                                ]
                            },
                            borderWidth: 0,
                            outerRadius: '100%'
                        }, {
                            backgroundColor: {
                                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                                stops: [
                                    [0, '#fff'],
                                    [1, '#FFF']
                                ]
                            },
                            borderWidth: 1,
                            outerRadius: '100%'
                        }, {
                            // default background
                        }, {
                            backgroundColor: '#f7f2f2',
                            borderWidth: 0,
                            outerRadius: '100%',
                            innerRadius: '100%'
                        }]
                    },

                    // the value axis
                    yAxis: {
                        min: 20,
                        max: 100,

                        minorTickInterval: 'auto',
                        minorTickWidth: 0,
                        minorTickLength: 25,
                        minorTickPosition: 'inside',
                        tickPosition: 'inside',
                        minorTickColor: '#fff',


                        tickPixelInterval: 30,
                        tickWidth: 1,
                       minorTickPosition: 'inside',
                        tickPosition: 'inside',
                        tickLength: 10,
                        tickColor: '#fff',
                        labels: {
                            step: 2,
                            rotation: 'auto'
                        },
                        title: {
                            text: 'mg/L'
                        },
                        plotBands: [{
                            from: 20,
                            to: 50,
                            color: '#d51505' 
                        }, {
                            from: 50,
                            to: 80,
                            color: '#fef547' 
                        }, {
                            from: 80,
                            to: 100,
                            color: '#2fb43e' 
                        }]
                    },

                    series: [{
                        name: "湿度",
                        // 默认获取的数值
                        data: [60],
                        tooltip: {
                            valueSuffix: 'mg/L'
                        }
                    }]

                },
                // Add some life
                function (chart) {
                    if (!chart.renderer.forExport) {
                        setInterval(function () {
                            var point = chart.series[0].points[0],
                                    newVal,
                                    inc = Math.round((Math.random() - 0.5) * 20);

                            newVal = point.y + inc;
                            if (newVal < 20 || newVal > 100) {
                                newVal = point.y - inc;
                            }

                            // point.update(newVal);

                        }, 3000);
                    }
                });
    });

   