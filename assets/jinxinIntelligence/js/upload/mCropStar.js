jQuery( function( $ ) {
    $.mCropStar = function( options ) {
        var settings = {
            debug:              false,
            cropBoxWidth:       350,
            cropBoxHeight:      350,
            uploadBtn:          'uploadSelect',
            container:          'cropContainer',
            fg:                 'crop-fg',
            bg:                 'crop-bg',
            rotateBtn:          'rotate-btn',
            prefix:             'mCropStar-',
            cropBoxBorderWidth: 1,
            minScale:           0.5,
            maxScale:           3,
            isCheckEdge:        true,
            quality:            0.8,
            bounceEffect:       true,
            embellish:          false,  // 是否开启美化功能，默认关闭
            fontSize:           16,
            tipImage:           './static/image/font-handSign.png',
            complete: function() {}
        };
        if ( options ) $.extend( settings, options );

        /**
         * 全局参数初始化
         * */
        var uploadBtn, container, inputFile
            ,img, imageOriginalWidth, imageOriginalHeight
            ,fg, ctxFg, bg, ctxBg, fgOffset
            ,clientWidth = window.innerWidth || document.documentElement.clientWidth
            ,clientHeight = window.innerHeight || document.documentElement.clientHeight
            ,clientRadio = clientWidth / clientHeight
            ,bgDomWidth = clientWidth, bgDomHeight = clientHeight
            ,fgDomWidth = clientWidth, fgDomHeight = fgDomWidth * settings.cropBoxHeight / settings.cropBoxWidth
            ,bgWidth, bgHeight
            ,cropBoxWidth = settings.cropBoxWidth, cropBoxHeight = settings.cropBoxHeight, cropBoxX = 0, cropBoxY = 0
            ,cropBoxBorderWidth = settings.cropBoxBorderWidth
            ,isCheckEdge = settings.isCheckEdge, duration_v, duration_h
            ,rotateBtn
            ,Crop = {}, cropBoxImageData, toolContainer, angleContainer, toolAngleItems, angle = 0;

        var cropBoxRadio = cropBoxWidth / cropBoxHeight;
        if(clientRadio >=1 ) {
            bgHeight = settings.cropBoxHeight, bgWidth = bgHeight * clientRadio;
        } else {
            bgWidth = settings.cropBoxWidth, bgHeight = bgWidth / clientRadio;
        }
        cropBoxX = ( bgWidth - cropBoxWidth ) / 2, cropBoxY = (bgHeight - cropBoxHeight) / 2;


        // 检测依赖环境，并创建基本DOM
        function checkDom() {
            uploadBtn = $( '#'+ settings.uploadBtn );
            if ( !uploadBtn.get(0) ) {
                console.error('Upload Btn is null!');
                return false;
            }

            container = $( '#'+ settings.container).css({position: 'absolute', top: 0, left: 0});
            if ( !container.get(0) ) {
                container = $('<div id="'+ settings.container +'"></div>');
                container.css({position: 'absolute', top: 0, left: 0});
                $('body').append( container );
            }

        };checkDom();


        // 生成Input上传控件
        function createInputFile( ) {
            inputFile = $('<input id="'+ settings.uploadBtn +'-file" type="file" accept="image/*" />');
            inputFile.css({opacity: 0, width: 0, height: 0, position: 'absolute', top: 0, left: 0});
            //obj.after( inputFile );
            $('body').append( inputFile );
        };createInputFile( );


        // 重新替换Input上传控件
        function resetInputFile( obj ) {
            inputFile = obj.clone();
            //obj.before( inputFile).remove();
            obj.remove();
            $('body').append( inputFile );
            registerEvents();
        };


        // 注册事件
        function registerEvents() {
            uploadBtn.unbind('click').bind('click', function( e ) {
                inputFile.click();
                e.preventDefault();
            });
            inputFile.bind('change', handleFiles);
            inputFile.click();
        };registerEvents();

        var ImageCropLayer;
        // 处理上传文件
        function handleFiles( e ) {
            console.log('handleFiles.click!');
            // 弹出层
            ImageCropLayer = $.VelocityLayer.ImageCrop({
                loadingAutoComplete: false,
                insertAfterFun: function() {},
                OKFun: function( L ) {
                    if ( !L.VL.hasClass('complete') ) {
                        $.VelocityLayer.alert('系统准备中，请稍等...');
                        return false;
                    } else {
                        var imageData = getResult();
                        if ( imageData ) {
                            if ( settings.complete && settings.complete instanceof Function ) {
                                settings.complete( imageData );
                            }
                            L.close();
                        } else {
                            $.VelocityLayer.alert('图片裁剪失败！');
                        }
                    }
                    return false;
                }
            });

            Crop.mime = {'png': 'image/png', 'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'bmp': 'image/bmp'};
            var file = e.target.files[0];
            //resetInputFile( $(this) );
            Crop.type = file.type;
            Crop.fileName = file.name;
            Crop.fileSize = file.size;
            Crop.fileType = 'image/png';
            Crop.fileDate = file.lastModifiedDate;

            readImage( file, function( uri ) { createImage( uri ); } );
            e.stopPropagation();
        };


        // 读取图片
        function readImage( file, callback ) {
            var reader = new FileReader();

            function tmpLoad() {
                var re = /^data:base64,/;
                var ret = this.result + '';
                if (re.test(ret)) ret = ret.replace(re, 'data:' + Crop.mime[Crop.fileType] + ';base64,');
                callback && callback(ret);
            };

            reader.onload = tmpLoad;
            reader.readAsDataURL( file );
            return false;
        };


        // 创建图片
        function createImage( uri ) {
            img = new Image();
            img.src = uri;
            img.onload = function() {
                img.onload = null;
                imageOriginalWidth = img.width, imageOriginalHeight = img.height;
                if ( imageOriginalWidth * imageOriginalHeight > settings.cropBoxWidth * settings.scale * settings.cropBoxHeight * settings.scale ) {
                    var data = compressionImage( img );
                    img.src = data;
                }
                createBg();
            };
        };


        // 创建Bg
        function createBg() {
            container.empty();
            bg = $('<canvas id="'+ settings.bg +'"  width="'+ bgWidth +'" height="'+ bgHeight +'"></canvas>');
            bg.css({position: 'absolute', top: 0, left: 0, width: clientWidth +'px', border: '0', boxSizing: 'border-box'});
            container.append( bg );
            ctxBg = bg.get(0).getContext('2d');


            draw();
            ImageCropLayer['loadingAutoComplete'] = true;
            //alert( 'containerCanvasLength='+$('#'+ settings.container+' canvas').length );
            ImageCropLayer.insertTmplDom( $('#'+ settings.container+' > *') );
            $.VelocityLayer.ImageCropTip('您可以移动、旋转、拉伸图片', settings.tipImage);
        };


        // 绘画
        function draw() {
            // 初始化 图片裁剪类
            theSelection = new Selection( 0, 0, imageOriginalWidth, imageOriginalHeight );

            createToolEvent();
        };


        // 工具事件初始化
        function createToolEvent() {
            var Htm = '<div id="'+settings.prefix+'tool-container" class="'+settings.prefix+'tool-container">'+
                '<div id="'+settings.prefix+'angle-container" class="'+settings.prefix+'angle-container">' +
                '<ul class="'+settings.prefix+'angle-container-inner">' +
                '<li class="'+settings.prefix+'angle-item on" data-angle="0"><span>0<i>°</i></span></li>'+
                '<li class="'+settings.prefix+'angle-item" data-angle="90"><span>90<i>°</i></span></li>'+
                '<li class="'+settings.prefix+'angle-item" data-angle="180"><span>180<i>°</i></span></li>'+
                '<li class="'+settings.prefix+'angle-item" data-angle="270"><span>270<i>°</i></span></li>'+
                '</ul>'+
                '</div>'+
                '</div>';

            toolContainer = $(Htm);
            bg.after( toolContainer );
            registerToolEvent();
        };
        function registerToolEvent() {
            if ( !theSelection ) return false;
            rotateBtn = $('#'+ settings.rotateBtn );
            angleContainer = $('#'+ settings.prefix + 'angle-container');
            toolAngleItems = $('.'+ settings.prefix +'angle-item');
            rotateBtn.unbind('click').bind('click', function() {
                if ( $(this).hasClass('doing') ) return;
                if ( $(this).hasClass('expand') ) {
                    $(this).addClass('doing').removeClass('expand');
                    angleContainer.removeClass('expand');
                } else {
                    $(this).addClass('doing').addClass('expand');
                    angleContainer.addClass('expand');
                }
                setTimeout(function() { rotateBtn.removeClass('doing'); }, 500);
            });
            toolAngleItems.unbind('click').bind('click', function( e ) {
                rotateBtn.click();
                var a = parseInt($(this).attr('data-angle'));
                if (isNaN( a ) ||  a == theSelection.getAngle ) return;
                toolAngleItems.removeClass('on');
                $(this).addClass('on');
                theSelection.setAngle(a);
            });
        };


        // 获取图片数据
        function getResult() {
            if ( !cropBoxImageData ) {
                console.error('ImageData is null!');
                return false;
            } else {
                var canvas = document.createElement('canvas'), ctx;
                ctx = canvas.getContext('2d');
                canvas.width = settings.cropBoxWidth, canvas.height = settings.cropBoxHeight;
                ctx.putImageData( cropBoxImageData, 0, 0 );
                return canvas.toDataURL('image/png', settings.quality || 0.8);
            }
        };


        /**
         * 绘图选区类
         * */
        var theSelection;
        function Selection( x, y, w, h ) {
            var px = x, py = y, test = 0
                ,angle = 0, angleType = 0, lastAngle = 0, touchStartDegree = 0, startAngle = 0
                ,startX = 0, startY = 0, moveX = 0, moveY = 0, originX = 0, originY = 0, moveDistanceX = 0, moveDistanceY = 0
                ,dragAll = false
                ,duration_v = 0, lastDist = 0, scale = 1, startDegree = 0, degree = 0
                ,originBgX = 0, originBgY = 0, originFgX = 0, originFgY = 0, translateX = 0, translateY = 0
                ,bounceX = 0, bounceY = 0, bounceXRequire = false, bounceYRequire = false, bounceIng = false;

            var image2BgWidth, image2BgHeight
                ,duration_bg_v, duration_fg_v, duration_bg_h
                ,clearSize_bg;
            if ( imageOriginalWidth <= imageOriginalHeight ) {
                image2BgHeight = bgHeight;
                image2BgWidth = imageOriginalWidth * image2BgHeight / imageOriginalHeight;
            } else {
                image2BgWidth = bgWidth;
                image2BgHeight = imageOriginalHeight * image2BgWidth / imageOriginalWidth;
            }
            duration_bg_v = ( bgHeight - image2BgHeight ) / 2;
            duration_bg_h = ( bgWidth - image2BgWidth ) / 2;
            clearSize_bg = ( bgWidth > bgHeight ) ? bgWidth : bgHeight;



            // 选区初始化
            function init() {
                duration_v = dom2CanvasOfSize( duration_v );
                registerDrawEvent();
                draw();
            };init();


            // 图片缩放
            function zoom( pos1, pos2 ) {
                var x1, y1, x2, y2, x, y, dist;

                x1 = pos1.x, y1 = pos1.y, x2 = pos2.x, y2 = pos2.y;
                x = x1 - x2, y = y1 - y2;
                dist = Math.sqrt( x * x + y * y );
                if ( lastDist == 0 ) {
                    lastDist = dist;
                } else {
                    scale = scale * ( dist / lastDist );
                    if ( scale > settings.maxScale ) {
                        scale = settings.maxScale, lastDist = 0;
                    } else {
                        lastDist = dist;
                    }

                    if ( scale < settings.minScale ) {
                        scale  = settings.minScale, lastDist = 0;
                    } else {
                        lastDist = dist;
                    }
                }
            };

            // 图片旋转
            function rotateStart( pos1, pos2 ) {
                var x1, y1, x2, y2, dx, dy;

                x1 = pos1.x, y1 = pos1.y, x2 = pos2.x, y2 = pos2.y;
                dx = x2 - x1, dy = y2 - y1;

                touchStartDegree = Math.atan2( dy, dx );
                startAngle = angle;
                //alert(startAngle);
            };
            function rotate( pos1, pos2 ) {
                var x1, y1, x2, y2, dx, dy, touchDegree, changeDegree;

                x1 = pos1.x, y1 = pos1.y, x2 = pos2.x, y2 = pos2.y;
                dx = x2 - x1, dy = y2 - y1;

                touchDegree = Math.atan2( dy, dx );
                changeDegree = touchDegree - touchStartDegree;
                angle = startAngle + degree2Angle( changeDegree );
            };

            function draw() {
                if ( isCheckEdge ) checkMoveAbled();
                drawBg();
                //drawFg();
            };

            // 绘制背景层
            function drawBg() {
                angle = angle % 360;
                if ( angle < 0 ) angle += 360;
                ctxBg.clearRect( -originBgX, -originBgY, clearSize_bg, clearSize_bg );
                ctxBg.fillStyle = 'rgba(0,0,0,1)';
                ctxBg.fillRect( -originBgX, -originBgY, clearSize_bg, clearSize_bg );

                var swidth = imageOriginalWidth, sheight = imageOriginalHeight
                    ,sx = x - image2BgWidth * ( scale - 1 ) / 2 + duration_bg_h
                    ,sy = y - image2BgHeight * ( scale - 1 ) / 2 + duration_bg_v
                    ,width = image2BgWidth * scale, height = image2BgHeight * scale;

                ctxBg.save();
                translateX = sx + image2BgWidth * scale / 2, translateY = sy + image2BgHeight * scale / 2;
                ctxBg.translate( translateX, translateY );
                ctxBg.rotate( angle2Degree(angle) );
                ctxBg.translate( -translateX, -translateY );

                drawImageIOSFix( ctxBg, img, 0, 0, swidth, sheight, sx, sy, width, height );

                ctxBg.translate( translateX, translateY );
                ctxBg.rotate( -angle2Degree(angle) );
                ctxBg.translate( -translateX, -translateY );


                console.log(cropBoxX+";"+cropBoxY+";"+cropBoxWidth+";"+cropBoxHeight);
                cropBoxImageData = ctxBg.getImageData( cropBoxX, cropBoxY, cropBoxWidth, cropBoxHeight );
                ctxBg.fillStyle = 'rgba(0,0,0,0.5)';
                ctxBg.fillRect( -originBgX, -originBgY, clearSize_bg, clearSize_bg );
                ctxBg.putImageData( cropBoxImageData, cropBoxX, cropBoxY );
                ctxBg.restore();

                ctxBg.lineWidth = cropBoxBorderWidth;
                ctxBg.strokeStyle = 'rgba(255,255,255,1)';
                ctxBg.strokeRect( cropBoxX + ( cropBoxBorderWidth / 2), cropBoxY + ( cropBoxBorderWidth ) / 2, cropBoxWidth - cropBoxBorderWidth, cropBoxHeight-cropBoxBorderWidth );

                if ( settings.debug ) {
                    /* Debug */
                    var text = '角度：'+angle.toFixed(1)+'°';
                    ctxBg.save();
                    ctxBg.font = settings.fontSize +'px Microsoft YaHei';
                    var measure = ctxBg.measureText( text );
                    var x1 = 0, y1 = 0
                        ,x2 = x1 + measure['width'], y2 = settings.fontSize;
                    ctxBg.fillStyle = 'rgba(0, 255, 255, 1)';
                    ctxBg.textBaseline = 'top';
                    ctxBg.fillText( text, x1, y1 );
                    ctxBg.restore();
                }


            };


            // 移动边缘检测
            function checkMoveAbled() {
                if ( settings.bounceEffect && TWEEN ) {
                    if ( x >= -( image2BgWidth / 3 ) * scale  &&  x <= ( image2BgWidth / 3 ) * scale ) {
                        bounceX = x;
                        bounceXRequire = false;
                    } else {
                        if ( x < - ( image2BgWidth / 3 ) * scale ) {
                            bounceX = - ( image2BgWidth / 3 ) * scale;
                        }

                        if ( x > ( image2BgWidth / 3 ) * scale ) {
                            bounceX = ( image2BgWidth / 3 ) * scale;
                        }
                        bounceXRequire = true;
                    }

                    if ( y >= -( image2BgHeight / 3 ) * scale && y <= ( image2BgHeight / 3 ) * scale ) {
                        bounceY = y;
                        bounceYRequire = false;
                    } else {
                        if ( y < -( image2BgHeight / 3 ) * scale ) {
                            bounceY = -( image2BgHeight / 3 ) * scale;
                        }

                        if ( y > ( image2BgHeight / 3 ) * scale ) {
                            bounceY = ( image2BgHeight / 3 ) * scale;
                        }
                        bounceYRequire = true;
                    }
                } else {
                    x = ( x < -( image2BgWidth / 3 ) * scale ) ? ( x < -(image2BgWidth / 3 ) * scale ) : x;
                    x = ( x > ( image2BgWidth / 3 ) * scale ) ? ( x > ( image2BgWidth / 3 ) * scale ) : x;
                    y = ( y < -( image2BgHeight / 3 ) * scale ) ? ( y < -( image2BgHeight / 3 ) * scale ) : y;
                    y = ( y > ( image2BgHeight / 3 ) * scale ) ? ( y > ( image2BgHeight / 3 ) * scale ) : y;
                }
            };


            // Bounce效果移动
            function bounceMove() {
                if ( settings.bounceEffect && TWEEN && !bounceIng ) {
                    if ( bounceXRequire || bounceYRequire ) {
                        bounceIng = true;
                        console.log('bounce Start!');
                        new TWEEN.Tween({x: x, y: y})
                            .to({x: bounceX, y: bounceY}, 250)
                            .easing( TWEEN.Easing.Linear.None )
                            .onUpdate( function() {
                                x = this.x, y = this.y;
                                draw();
                                console.log('bounce doing!');
                            })
                            .onComplete( function() {
                                bounceIng = false;
                                console.log('bounce End!');
                            })
                            .start();
                        render();
                    }
                }
            };


            function render() {
                if ( bounceIng ) {
                    window['requestAnimFrame'](function () { return render(); });
                }
                if ( TWEEN ) {
                    TWEEN.update();
                }
                draw();
            };


            // 移动选区事件注册
            function registerDrawEvent() {
                //alert(5656);
                bg.bind('mousedown touchstart', touchStart).bind('mousemove touchmove', touchMove).bind('mouseup mouseleave touchend', touchEnd);
            };


            function touchStart( e ) {
                var touch, touch2;
                e.preventDefault();
                dragAll = true;

                switch ( e.type ) {
                    case "mousedown":
                        touch = e;
                        break;
                    case "touchstart":
                        e.touches = e.touches ? e.touches : e.originalEvent.touches;
                        touch = e.touches[0];
                        touch2 = e.touches[1];
                        break;
                }

                switch ( angleType ) {
                    case 0:
                        startX = dom2CanvasOfSize(touch.pageX);
                        startY = dom2CanvasOfSize(touch.pageY);
                        break;
                    case 1:
                        break;
                    case 2:
                        break;
                    case 3:
                        break;
                }
                originX = x, originY = y;
                px = startX - x, py = startY - y;

                if ( touch && touch2 ) {
                    rotateStart( {x: touch.pageX, y: touch.pageY}, {x: touch2.pageX, y: touch2.pageY} );
                }

            };

            function touchMove( e ) {
                if ( dragAll && !bounceIng ) {
                    var touch, touch2;
                    e.preventDefault();
                    switch ( e.type ) {
                        case "mousemove":
                            touch = e;
                            break;
                        case "touchmove":
                            e.touches = e.touches ? e.touches : e.originalEvent.touches;
                            touch = e.touches[0];
                            touch2 = e.touches[1];
                            break;
                    }



                    switch ( angleType ) {
                        case 0:
                            moveX = dom2CanvasOfSize(touch.pageX);
                            moveY = dom2CanvasOfSize(touch.pageY);
                            break;
                        case 1:
                            break;
                        case 2:
                            break;
                        case 3:
                            break;
                    }

                    if ( touch && touch2 ) {
                        zoom( {x: touch.pageX, y: touch.pageY}, {x: touch2.pageX, y: touch2.pageY} );
                        rotate( {x: touch.pageX, y: touch.pageY}, {x: touch2.pageX, y: touch2.pageY} );
                    }
                    x = (moveX - px) , y = (moveY - py);
                    /*moveDistanceX = moveX - startX, moveDistanceY = moveY - startY;
                     x = originX + moveDistanceX;
                     y = originY + moveDistanceY;*/
                    draw();
                }
            };

            function touchEnd( e ) {
                /*if ( dragAll ) {
                 if ( test == 0 ) {
                 ctxBg.translate( translateX, translateY );
                 ctxBg.rotate( angle2Degree(angle) );
                 ctxBg.translate( -translateX, -translateY );
                 }
                 draw();
                 if ( test == 0 ) {
                 ctxBg.translate( translateX, translateY );
                 ctxBg.rotate( -angle2Degree(angle) );
                 ctxBg.translate( -translateX, -translateY );
                 }
                 }*/
                dragAll = false;
                px = 0, py = 0, lastDist = 0, startDegree = 0, translateX = 0, translateY = 0;
                bounceMove();
            };


            function dom2CanvasOfSize( size ) {
                return cropBoxWidth / fgDomWidth * size;
            };

            function canvas2DomOfSize( size ) {
                return fgDomWidth / cropBoxWidth * size;
            };

            function getAngle() {
                return angle;
            };

            function setAngle( a ) {
                angle = a;
                draw();
            };

            return { getAngle: getAngle, setAngle: setAngle };
        };





        /**
         * Filter
         * */
        var Filters = {};
        Filters.getPixels = function(img) {
            var c,ctx;
            if (img.getContext) {
                c = img;
                try { ctx = c.getContext('2d'); } catch(e) {}
            }
            if (!ctx) {
                c = this.getCanvas(img.width, img.height);
                ctx = c.getContext('2d');
                ctx.drawImage(img, 0, 0);
            }
            return ctx.getImageData(0,0,c.width,c.height);
        };

        Filters.getCanvas = function(w,h) {
            var c = document.createElement('canvas');
            c.width = w;
            c.height = h;
            return c;
        };

        Filters.filterImage = function(filter, image, var_args) {
            var args = [this.getPixels(image)];
            for (var i=2; i<arguments.length; i++) {
                args.push(arguments[i]);
            }
            return filter.apply(null, args);
        };

        Filters.grayscale = function(pixels, args) {
            var d = pixels.data;
            for (var i=0; i<d.length; i+=4) {
                var r = d[i];
                var g = d[i+1];
                var b = d[i+2];
                // CIE luminance for the RGB
                var v = 0.2126*r + 0.7152*g + 0.0722*b;
                d[i] = d[i+1] = d[i+2] = v
            }
            return pixels;
        };

        Filters.brightness = function(pixels, adjustment) {
            var d = pixels.data;
            for (var i=0; i<d.length; i+=4) {
                d[i] += adjustment;
                d[i+1] += adjustment;
                d[i+2] += adjustment;
            }
            return pixels;
        };

        Filters.threshold = function(pixels, threshold) {
            var d = pixels.data;
            for (var i=0; i<d.length; i+=4) {
                var r = d[i];
                var g = d[i+1];
                var b = d[i+2];
                var v = (0.2126*r + 0.7152*g + 0.0722*b >= threshold) ? 255 : 0;
                d[i] = d[i+1] = d[i+2] = v
            }
            return pixels;
        };

        Filters.tmpCanvas = document.createElement('canvas');
        Filters.tmpCtx = Filters.tmpCanvas.getContext('2d');

        Filters.createImageData = function(w,h) {
            return this.tmpCtx.createImageData(w,h);
        };

        Filters.convolute = function(pixels, weights, opaque) {
            var side = Math.round(Math.sqrt(weights.length));
            var halfSide = Math.floor(side/2);

            var src = pixels.data;
            var sw = pixels.width;
            var sh = pixels.height;

            var w = sw;
            var h = sh;
            var output = Filters.createImageData(w, h);
            var dst = output.data;

            var alphaFac = opaque ? 1 : 0;

            for (var y=0; y<h; y++) {
                for (var x=0; x<w; x++) {
                    var sy = y;
                    var sx = x;
                    var dstOff = (y*w+x)*4;
                    var r=0, g=0, b=0, a=0;
                    for (var cy=0; cy<side; cy++) {
                        for (var cx=0; cx<side; cx++) {
                            var scy = Math.min(sh-1, Math.max(0, sy + cy - halfSide));
                            var scx = Math.min(sw-1, Math.max(0, sx + cx - halfSide));
                            var srcOff = (scy*sw+scx)*4;
                            var wt = weights[cy*side+cx];
                            r += src[srcOff] * wt;
                            g += src[srcOff+1] * wt;
                            b += src[srcOff+2] * wt;
                            a += src[srcOff+3] * wt;
                        }
                    }
                    dst[dstOff] = r;
                    dst[dstOff+1] = g;
                    dst[dstOff+2] = b;
                    dst[dstOff+3] = a + alphaFac*(255-a);
                }
            }
            return output;
        };

        if (!window.Float32Array)
            Float32Array = Array;

        Filters.convoluteFloat32 = function(pixels, weights, opaque) {
            var side = Math.round(Math.sqrt(weights.length));
            var halfSide = Math.floor(side/2);

            var src = pixels.data;
            var sw = pixels.width;
            var sh = pixels.height;

            var w = sw;
            var h = sh;
            var output = {
                width: w, height: h, data: new Float32Array(w*h*4)
            };
            var dst = output.data;

            var alphaFac = opaque ? 1 : 0;

            for (var y=0; y<h; y++) {
                for (var x=0; x<w; x++) {
                    var sy = y;
                    var sx = x;
                    var dstOff = (y*w+x)*4;
                    var r=0, g=0, b=0, a=0;
                    for (var cy=0; cy<side; cy++) {
                        for (var cx=0; cx<side; cx++) {
                            var scy = Math.min(sh-1, Math.max(0, sy + cy - halfSide));
                            var scx = Math.min(sw-1, Math.max(0, sx + cx - halfSide));
                            var srcOff = (scy*sw+scx)*4;
                            var wt = weights[cy*side+cx];
                            r += src[srcOff] * wt;
                            g += src[srcOff+1] * wt;
                            b += src[srcOff+2] * wt;
                            a += src[srcOff+3] * wt;
                        }
                    }
                    dst[dstOff] = r;
                    dst[dstOff+1] = g;
                    dst[dstOff+2] = b;
                    dst[dstOff+3] = a + alphaFac*(255-a);
                }
            }
            return output;
        };




        /**
         * 工具方法
         * */
        /**
         * Detecting vertical squash in loaded image.
         * Fixes a bug which squash image vertically while drawing into canvas for some images.
         * This is a bug in iOS6 devices. This function from https://github.com/stomita/ios-imagefile-megapixel
         *
         */
        function detectVerticalSquash(img) {
            var iw = img.naturalWidth, ih = img.naturalHeight;
            var canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = ih;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            var data = ctx.getImageData(0, 0, 1, ih).data;
            // search image edge pixel position in case it is squashed vertically.
            var sy = 0;
            var ey = ih;
            var py = ih;
            while (py > sy) {
                var alpha = data[(py - 1) * 4 + 3];
                if (alpha === 0) {
                    ey = py;
                } else {
                    sy = py;
                }
                py = (ey + sy) >> 1;
            }
            var ratio = (py / ih);
            return (ratio===0)?1:ratio;
        }

        /**
         * A replacement for context.drawImage
         * (args are for source and destination).
         */
        function drawImageIOSFix(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
            var vertSquashRatio = detectVerticalSquash(img);
            // Works only if whole image is displayed:
            // ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
            // The following works correct also when only a part of the image is displayed:
            ctx.drawImage(img, sx * vertSquashRatio, sy * vertSquashRatio,
                sw * vertSquashRatio, sh * vertSquashRatio,
                dx, dy, dw, dh );
        }

        function detectSubsampling(img) {
            var iw = img.naturalWidth,
                ih = img.naturalHeight,
                ssCanvas,
                ssCTX;
            if (iw * ih > 1024 * 1024) { // Subsampling may happen over megapixel image
                ssCanvas = document.createElement('canvas');
                ssCanvas.width = ssCanvas.height = 1;
                ssCTX = ssCanvas.getContext('2d');
                ssCTX.drawImage(img, -iw + 1, 0);
                // Subsampled image becomes half smaller in rendering size.
                // Check alpha channel value to confirm image is covering edge pixel or not.
                // If alpha value is 0 image is not covering, hence subsampled.
                return ssCTX.getImageData(0, 0, 1, 1).data[3] === 0;
            }
            return false;
        }


        function compressionImage( img ) {
            var width = img.naturalWidth, height = img.naturalHeight, canvas, ctx, sWidth, sHeight;
            if ( width * height > settings.cropBoxWidth * settings.scale * settings.cropBoxHeight * settings.scale ) {
                if ( width > height ) {
                    sWidth = settings.cropBoxWidth * settings.scale; sHeight = sWidth * height / width;
                } else {
                    sHeight = settings.cropBoxHeight * settings.scale, sWidth = sHeight * width / height;
                }
            } else {
                sWidth = width, sHeight = height;
            }
            canvas = document.createElement('canvas');
            canvas.width = sWidth; canvas.height = sHeight;
            canvas.style.display = 'none';
            ctx = canvas.getContext('2d');
            ctx.drawImage( img, 0, 0, sWidth, sHeight);
            return canvas.toDataURL('image/png', settings.quality || 0.8);
        }

        function angle2Degree( angle ) {
            return Math.PI / 180 * angle;
        }

        function degree2Angle( degree ) {
            return degree / Math.PI * 180;
        }

        /**
         * 动画关键帧
         * */
        window['requestAnimFrame'] = (function(){
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.msRequestAnimationFrame ||

                function(callback){
                    window.setTimeout( callback, 1000 / 60 );
                };
        })();
    };
});
