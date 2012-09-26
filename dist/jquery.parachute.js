(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = [].slice;

  (function(factory) {
    if (typeof define === "function" && define.amd) {
      return define(["jquery"], factory);
    } else {
      return factory(jQuery);
    }
  })(function($) {
    var jQueryParachuteObject;
    window.debugMode = document.location.hash.match(/debug/) && (typeof console !== "undefined" && console !== null);
    window.jQueryParachuteObject = jQueryParachuteObject = (function() {
      var addEasing, easing, getStyle, makeBezier;

      easing = {
        "linear": [0, 0, 1, 1],
        "ease": [0.25, 0.1, 0.25, 1],
        "ease-in": [0.42, 0, 1, 1],
        "ease-out": [0, 0, 0.58, 1],
        "ease-in-out": [0.42, 0, 0.58, 1]
      };

      addEasing = function(str) {
        var coords, fn, l, name;
        fn = $.easing[str];
        name = void 0;
        coords = void 0;
        l = void 0;
        if (fn) {
          return fn;
        }
        if (easing[str]) {
          name = str;
          coords = easing[str];
          str = "cubic-bezier(" + coords.join(", ") + ")";
        } else {
          coords = str.match(/\d*\.?\d+/g);
          l = coords.length;
          while (l--) {
            coords[l] = parseFloat(coords[l]);
          }
        }
        fn = makeBezier.apply(this, coords);
        $.easing[str] = fn;
        if (name) {
          $.easing[name] = fn;
        }
        return fn;
      };

      makeBezier = function(x1, y1, x2, y2) {
        return function(t) {
          var f0, f1, f2, i, refinedT, refinedT2, refinedT3, slope, x;
          f0 = 1 - 3 * x2 + 3 * x1;
          f1 = 3 * x2 - 6 * x1;
          f2 = 3 * x1;
          refinedT = t;
          i = void 0;
          refinedT2 = void 0;
          refinedT3 = void 0;
          x = void 0;
          slope = void 0;
          i = 0;
          while (i < 5) {
            refinedT2 = refinedT * refinedT;
            refinedT3 = refinedT2 * refinedT;
            x = f0 * refinedT3 + f1 * refinedT2 + f2 * refinedT;
            slope = 1.0 / (3.0 * f0 * refinedT2 + 2.0 * f1 * refinedT + f2);
            refinedT -= (x - t) * slope;
            refinedT = Math.min(1, Math.max(0, refinedT));
            i++;
          }
          return 3 * Math.pow(1 - refinedT, 2) * refinedT * y1 + 3 * (1 - refinedT) * Math.pow(refinedT, 2) * y2 + Math.pow(refinedT, 3);
        };
      };

      $.addEasing = addEasing;

      function jQueryParachuteObject() {
        this.boxModelList = ["top", "right", "bottom", "left", "margin-top", "margin-right", "margin-bottom", "margin-left", "padding-top", "padding-right", "padding-bottom", "padding-left", "width", "height"];
        this.transformationsList = ["x", "y", "translate", "rotate", "rotateX", "rotateY", "rotate3d", "scale", "perspective", "skewX", "skewY", "opacity"];
      }

      jQueryParachuteObject.prototype.init = function(animation, $elem, callback) {
        var self;
        this.animation = animation;
        this.$elem = $elem;
        this.callback = callback;
        self = this;
        return this.translateAnimation(function() {
          return self.animate(function() {
            if (typeof callback === 'function') {
              if (callback != null) {
                if (typeof callback.apply === "function") {
                  callback.apply($elem);
                }
              }
            }
            return self;
          });
        });
      };

      jQueryParachuteObject.prototype.rotateInPlace = function(degree, duration) {
        var numRotations, percentageIncrement,
          _this = this;
        numRotations = 10;
        percentageIncrement = 1 / numRotations;
        return setTimeout(function() {
          var percent;
          if ($(_this.$elem).attr("data-rotate-percent") != null) {
            percent = parseFloat($(_this.$elem).attr("data-rotate-percent"));
          } else {
            percent = 1 / numRotations;
          }
          _this.setRotation(_this.$elem, degree * parseFloat(percent));
          if (percent < 1) {
            $(_this.$elem).attr("data-rotate-percent", percent + percentageIncrement);
            return _this.rotateInPlace(degree, duration);
          } else {
            return $(_this.$elem).attr("data-rotate-percent", "" + percentageIncrement);
          }
        }, duration / 20, true);
      };

      jQueryParachuteObject.prototype.skewInPlace = function(skewX, skewY, duration) {
        var numSkews, percentageIncrement,
          _this = this;
        numSkews = 10;
        percentageIncrement = 1 / numSkews;
        return setTimeout(function() {
          var percent;
          if ($(_this.$elem).attr("data-skew-percent") != null) {
            percent = parseFloat($(_this.$elem).attr("data-skew-percent"));
          } else {
            percent = percentageIncrement;
          }
          _this.skew(skewX, skewY, percent);
          if (percent < 1) {
            $(_this.$elem).attr("data-skew-percent", percent + percentageIncrement);
            return _this.skewInPlace(skewX, skewY, duration);
          } else {
            return $(_this.$elem).attr("data-skew-percent", "" + percentageIncrement);
          }
        }, duration / 20, true);
      };

      jQueryParachuteObject.prototype.animate = function(callback) {
        var options, rotation, skewX, skewY;
        if (typeof JSON !== "undefined" && JSON !== null) {
          if (debugMode) {
            if (typeof console !== "undefined" && console !== null) {
              console.log("animating: " + (JSON.stringify(this.animation)));
            }
          }
        }
        skewX = 0;
        skewY = 0;
        if ((this.animation.rotate != null) && this.animation.rotate !== 0) {
          $(this.$elem).attr("data-rotation", this.animation.rotate);
          rotation = parseInt($(this.$elem).attr("data-rotation"));
        }
        if ((this.animation.skewX != null) && this.animation.skewX !== 0) {
          $(this.$elem).attr("data-skewX", this.animation.skewX);
          skewX = parseInt($(this.$elem).attr("data-skewX"));
        }
        if ((this.animation.skewY != null) && this.animation.skewY !== 0) {
          $(this.$elem).attr("data-skewY", this.animation.skewY);
          skewY = parseInt($(this.$elem).attr("data-skewY"));
        }
        delete this.animation.rotate;
        delete this.animation.skewX;
        delete this.animation.skewY;
        options = {
          duration: this.duration,
          step: this.stepFunction
        };
        $(this.$elem).delay(this.delay).animate(this.animation, options);
        if (this.hasOnlyTransforms(this.animation, this.transformationsList)) {
          if (rotation != null) {
            this.rotateInPlace(rotation, this.duration);
          }
          if (skewY !== 0) {
            this.skewInPlace(skewX, skewY, this.duration);
          } else if (skewX !== 0) {
            this.skewInPlace(skewX, skewY, this.duration);
          }
        }
        return typeof callback === "function" ? callback() : void 0;
      };

      jQueryParachuteObject.prototype.hasOnlyTransforms = function(obj, props) {
        var iHaz;
        iHaz = true;
        if (obj.left != null) {
          iHaz = false;
        }
        if (obj.top != null) {
          iHaz = false;
        }
        return iHaz;
      };

      jQueryParachuteObject.prototype.stepFunction = function(now, fx) {
        var a, b, beforeLeft, beforeTop, c, costheta, d, deg2radians, percent, rad, rotation, sintheta, skewX, skewY;
        percent = (now / fx.end).toFixed(2);
        if (($(this).attr("data-rotation") != null) && parseInt($(this).attr("data-rotation")) !== 0) {
          rotation = $(this).attr("data-rotation");
        }
        if (($(this).attr("data-skewX") != null) && parseInt($(this).attr("data-skewX")) !== 0) {
          skewX = $(this).attr("data-skewX");
        }
        if (($(this).attr("data-skewX") != null) && parseInt($(this).attr("data-skewX")) !== 0) {
          skewX = $(this).attr("data-skewX");
        } else {
          skewX = 0;
        }
        if (($(this).attr("data-skewY") != null) && parseInt($(this).attr("data-skewY")) !== 0) {
          skewY = $(this).attr("data-skewY");
        } else {
          skewY = 0;
        }
        if (skewX !== 0) {
          $(this).transform({
            "skewX": "" + (skewX * percent) + "deg",
            "skewY": "" + (skewY * percent) + "deg"
          });
          $(this).animateTransform({
            "skewX": "" + (skewX * percent) + "deg",
            "skewY": "" + (skewY * percent) + "deg"
          });
        } else if (skewY !== 0) {
          $(this).transform({
            "skewX": "" + (skewX * percent) + "deg",
            "skewY": "" + (skewY * percent) + "deg"
          });
          $(this).animateTransform({
            "skewX": "" + (skewX * percent) + "deg",
            "skewY": "" + (skewY * percent) + "deg"
          });
        }
        if (rotation != null) {
          beforeLeft = $(this).css('left');
          beforeTop = $(this).css('top');
          deg2radians = Math.PI * 2 / 360;
          rad = ($(this).attr("data-rotation") * percent) * deg2radians;
          costheta = Math.cos(rad);
          sintheta = Math.sin(rad);
          a = parseFloat(costheta).toFixed(8);
          c = parseFloat(-sintheta).toFixed(8);
          b = parseFloat(sintheta).toFixed(8);
          d = parseFloat(costheta).toFixed(8);
          if ((this.filters != null) && (this.filters.item(0) != null) && (this.filters.item(0).M11 != null)) {
            try {
              this.filters.item(0).M11 = costheta;
              this.filters.item(0).M12 = -sintheta;
              this.filters.item(0).M21 = sintheta;
              this.filters.item(0).M22 = costheta;
            } catch (error) {
              if (typeof console !== "undefined" && console !== null) {
                console.log("rotate error: " + error.message);
              }
            }
          } else {
            this.setAttribute("style", "position:absolute; -moz-transform: matrix(" + a + ", " + b + ", " + c + ", " + d + ", 0, 0); -webkit-transform: matrix(" + a + ", " + b + ", " + c + ", " + d + ", 0, 0); -o-transform: matrix(" + a + ", " + b + ", " + c + ", " + d + ", 0, 0);");
          }
          $(this).css('left', beforeLeft);
          return $(this).css('top', beforeTop);
        }
      };

      jQueryParachuteObject.prototype.setRotation = function(oObj, deg) {
        var a, b, beforeLeft, beforeTop, c, costheta, d, deg2radians, distanceHeight, rad, sintheta;
        if ($(this.$elem).attr("data-rotation-left") != null) {
          beforeLeft = parseInt($(oObj).attr("data-rotation-left"));
        } else {
          beforeLeft = parseInt($(oObj).css('left'));
        }
        if ($(this.$elem).attr("data-rotation-top") != null) {
          beforeTop = parseInt($(oObj).attr("data-rotation-top"));
        } else {
          beforeTop = parseInt($(oObj).css('top'));
        }
        $(oObj).attr("data-rotation-left", beforeLeft);
        $(oObj).attr("data-rotation-top", beforeTop);
        deg2radians = Math.PI * 2 / 360;
        rad = deg * deg2radians;
        costheta = Math.cos(rad);
        sintheta = Math.sin(rad);
        a = parseFloat(costheta).toFixed(8);
        c = parseFloat(-sintheta).toFixed(8);
        b = parseFloat(sintheta).toFixed(8);
        d = parseFloat(costheta).toFixed(8);
        if ((oObj.filters != null) && (oObj.filters.item(0) != null) && (oObj.filters.item(0).M11 != null)) {
          try {
            oObj.filters.item(0).M11 = costheta;
            oObj.filters.item(0).M12 = -sintheta;
            oObj.filters.item(0).M21 = sintheta;
            oObj.filters.item(0).M22 = costheta;
          } catch (error) {
            if (debugMode) {
              if (typeof console !== "undefined" && console !== null) {
                console.log("rotate error: " + error.message);
              }
            }
          }
        } else {
          oObj.setAttribute("style", "position:absolute; -moz-transform: matrix(" + a + ", " + b + ", " + c + ", " + d + ", 0, 0); -webkit-transform: matrix(" + a + ", " + b + ", " + c + ", " + d + ", 0, 0); -o-transform: matrix(" + a + ", " + b + ", " + c + ", " + d + ", 0, 0);");
        }
        distanceHeight = Math.min($(oObj).parent().outerWidth(), $(oObj).parent().outerHeight()) / 2;
        $(oObj).css('top', (costheta * distanceHeight / 2) - (parseInt($(oObj).outerHeight()) / 2) + beforeTop);
        return $(oObj).css('left', (costheta * distanceHeight / 2) - (parseInt($(oObj).outerWidth()) / 2) + beforeLeft);
      };

      jQueryParachuteObject.prototype.skew = function(degreesX, degreesY, percent) {
        var beforeLeft, beforeTop;
        if (percent == null) {
          percent = 1;
        }
        beforeLeft = $(this.$elem).css('left');
        beforeTop = $(this.$elem).css('top');
        $(this.$elem).transform({
          "skewX": "" + (degreesX * percent) + "deg",
          "skewY": "" + (degreesY * percent) + "deg"
        });
        $(this.$elem).animateTransform({
          "skewX": "" + (degreesX * percent) + "deg",
          "skewY": "" + (degreesY * percent) + "deg"
        });
        $(this.$elem).css('left', beforeLeft);
        return $(this.$elem).css('top', beforeTop);
      };

      jQueryParachuteObject.prototype.translateAnimation = function(callback) {
        var key, transformations, val, _ref;
        this.duration = this.animation.duration != null ? this.animation.duration : $.fx.speeds._default;
        this.easing = this.animation.easing != null ? this.animation.easing : "linear";
        this.delay = this.animation.delay != null ? this.animation.delay : 0;
        this.animation = this.reject(this.animation, "duration", "easing", "delay");
        transformations = {};
        _ref = this.animation;
        for (key in _ref) {
          val = _ref[key];
          if (__indexOf.call(this.transformationsList, key) >= 0) {
            transformations[key] = val;
          }
        }
        if (this.hasOwnProperties(transformations, this.transformationsList)) {
          this.animation = this.translateTransforms(this.getElementBoxModel(this.$elem), transformations);
        }
        return typeof callback === "function" ? callback() : void 0;
      };

      jQueryParachuteObject.prototype.getElementBoxModel = function(elem) {
        var boxModel, key, _i, _len, _ref;
        boxModel = {};
        if (elem.length != null) {
          elem = elem[0];
        }
        _ref = this.boxModelList;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          key = _ref[_i];
          if (getStyle(elem, key) !== 'auto') {
            boxModel[key] = getStyle(elem, key);
          }
        }
        if (boxModel["left"] == null) {
          boxModel["left"] = 0;
        }
        if (boxModel["top"] == null) {
          boxModel["top"] = 0;
        }
        return boxModel;
      };

      getStyle = function(elem, key) {
        return $(elem).css(key);
      };

      jQueryParachuteObject.prototype.convertRelativeUnits = function(transforms) {
        var key, stripPrefix, val;
        stripPrefix = function(value) {
          if (/\+\=/.exec(value)) {
            value = value.replace(/\+\=/, '');
          } else if (/\-\=/.exec(value)) {
            value = value.replace(/\-\=/, '-');
          }
          return value;
        };
        for (key in transforms) {
          val = transforms[key];
          if (typeof val === "string") {
            transforms[key] = stripPrefix(val);
          }
        }
        return transforms;
      };

      jQueryParachuteObject.prototype.translateTransforms = function(boxModel, transforms) {
        var animations, key, pieces, previousXTranslation, previousYTranslation, val;
        transforms = this.convertRelativeUnits(transforms);
        if (($(this.$elem).attr("data-rotation") != null) && (transforms.rotate != null)) {
          transforms.rotate = parseInt($(this.$elem).attr("data-rotation")) + parseInt(transforms.rotate);
        }
        if (($(this.$elem).attr("data-skewX") != null) && (transforms.skewX != null)) {
          transforms.skewX = parseInt($(this.$elem).attr("data-skewX")) + parseInt(transforms.skewX);
        }
        if (($(this.$elem).attr("data-skewY") != null) && (transforms.skewY != null)) {
          transforms.skewY = parseInt($(this.$elem).attr("data-skewY")) + parseInt(transforms.skewY);
        }
        if (transforms.translate != null) {
          pieces = String(transforms.translate).split(',');
          if (pieces.length === 2) {
            transforms.x = pieces[0];
            transforms.y = pieces[1];
          }
        }
        if (transforms.x != null) {
          if ($(this.$elem).attr("data-x-translation") != null) {
            previousXTranslation = parseInt($(this.$elem).attr("data-x-translation"));
            $(this.$elem).attr("data-x-translation", parseInt(transforms.x));
            transforms.x = parseInt(transforms.x) - previousXTranslation;
          } else {
            $(this.$elem).attr("data-x-translation", parseInt(transforms.x));
          }
        }
        if (transforms.y != null) {
          if ($(this.$elem).attr("data-y-translation") != null) {
            previousYTranslation = parseInt($(this.$elem).attr("data-y-translation"));
            $(this.$elem).attr("data-y-translation", parseInt(transforms.y));
            transforms.y = parseInt(transforms.y) - previousYTranslation;
          } else {
            $(this.$elem).attr("data-y-translation", parseInt(transforms.y));
          }
        }
        animations = {};
        for (key in boxModel) {
          val = boxModel[key];
          if (typeof val === "string") {
            boxModel[key] = parseInt(val);
          }
        }
        for (key in transforms) {
          val = transforms[key];
          if (typeof val === "string") {
            transforms[key] = parseInt(val);
          }
        }
        if (transforms.scale instanceof Array && transforms.scale.length === 2) {
          transforms.scaleX = transforms.scale[0];
          transforms.scaleY = transforms.scale[1];
        } else {
          transforms.scaleX = transforms.scale;
          transforms.scaleY = transforms.scale;
        }
        if (transforms.scaleX == null) {
          transforms.scaleX = 1;
        }
        if (transforms.scaleY == null) {
          transforms.scaleY = 1;
        }
        if (transforms.scale !== 1 && (($(this.$elem).attr("data-scale-width") != null) && ($(this.$elem).attr("data-scale-height") != null))) {
          $(this.$elem).attr({
            "data-scale-width": boxModel.width,
            "data-scale-height": boxModel.height
          });
        }
        if (($(this.$elem).attr("data-scale-width") != null) && ($(this.$elem).attr("data-scale-height") != null)) {
          boxModel.width = $(this.$elem).attr("data-scale-width");
          boxModel.height = $(this.$elem).attr("data-scale-height");
        }
        animations.left = boxModel.left;
        animations.top = boxModel.top;
        if (transforms.x != null) {
          animations.left += transforms.x;
        }
        if (transforms.y != null) {
          animations.top += transforms.y;
        }
        if (transforms.skewX != null) {
          animations.skewX = transforms.skewX;
        }
        if (transforms.skewY != null) {
          animations.skewY = transforms.skewY;
        }
        if ((transforms.scaleX != null) && transforms.scaleX !== 1) {
          animations.width = transforms.scaleX * boxModel["width"];
          animations.left += (boxModel["width"] - animations.width) * 0.5;
        }
        if ((transforms.scaleY != null) && transforms.scaleY !== 1) {
          animations.height = transforms.scaleY * boxModel["height"];
          animations.top += (boxModel["height"] - animations.height) * 0.5;
        }
        if (animations.left === boxModel.left) {
          delete animations.left;
        }
        if (animations.top === boxModel.top) {
          delete animations.top;
        }
        if (transforms.opacity != null) {
          animations.opacity = transforms.opacity;
        }
        if (transforms.rotate != null) {
          animations.rotate = transforms.rotate;
        }
        for (key in animations) {
          val = animations[key];
          if (__indexOf.call(this.boxModelList, key) >= 0) {
            animations[key] = "" + animations[key] + "px";
          }
        }
        return animations;
      };

      jQueryParachuteObject.prototype.hasOwnProperties = function(obj, props) {
        var iHaz, prop, _i, _len;
        iHaz = false;
        for (_i = 0, _len = props.length; _i < _len; _i++) {
          prop = props[_i];
          if (obj.hasOwnProperty(prop)) {
            iHaz = true;
          }
        }
        return iHaz;
      };

      jQueryParachuteObject.prototype.reject = function() {
        var key, obj, rejectList, result, val, _fn;
        obj = arguments[0], rejectList = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        result = {};
        _fn = function(key) {
          if (__indexOf.call(rejectList, key) < 0) {
            return result[key] = obj[key];
          }
        };
        for (key in obj) {
          val = obj[key];
          _fn(key);
        }
        return result;
      };

      return jQueryParachuteObject;

    })();
    return $.fn.parachute = function(animation, duration, easing, callback) {
      var self;
      self = this;
      if (typeof duration === "function") {
        callback = duration;
        duration = 'undefined';
      } else if (duration != null) {
        animation.duration = duration;
      }
      if (typeof easing === "function") {
        callback = easing;
        easing = 'undefined';
      } else if (easing != null) {
        animation.easing = easing;
      }
      $(this).css({
        "filter": "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand')"
      });
      if ($(this).css("position") !== "absolute") {
        $(this).css({
          "position": "relative"
        });
      }
      return this.each(function() {
        var jQueryParachute;
        jQueryParachute = new jQueryParachuteObject();
        return jQueryParachute.init(animation, this, callback);
      });
    };
  });

}).call(this);
