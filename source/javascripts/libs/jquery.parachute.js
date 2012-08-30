// Generated by CoffeeScript 1.3.3
(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = [].slice;

  (function(factory) {
    if (typeof define === "function" && define.amd) {
      return define(["jquery", "jquery-add-easing"], factory);
    } else {
      return factory(jQuery);
    }
  })(function($) {
    var jQueryParachuteObject;
    window.debugMode = document.location.hash.match(/debug/) && (typeof console !== "undefined" && console !== null);
    window.jQueryParachuteObject = jQueryParachuteObject = (function() {
      var getStyle;

      function jQueryParachuteObject() {
        this.boxModelList = ["top", "right", "bottom", "left", "margin-top", "margin-right", "margin-bottom", "margin-left", "padding-top", "padding-right", "padding-bottom", "padding-left", "width", "height"];
        this.transformationsList = ["x", "y", "translate", "rotate", "rotateX", "rotateY", "rotate3d", "scale", "perspective", "skewX", "skewY", "opacity"];
      }

      jQueryParachuteObject.prototype.init = function(animation, $elem, callback) {
        var self,
          _this = this;
        this.animation = animation;
        this.$elem = $elem;
        this.callback = callback;
        self = this;
        return setTimeout(function() {
          return _this.translateAnimation(function() {
            return self.animate(function() {
              if (debugMode) {
                if (typeof console !== "undefined" && console !== null) {
                  console.log("animation complete");
                }
              }
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
        }, 0, true);
      };

      jQueryParachuteObject.prototype.rotateInPlace = function(degree, duration) {
        var _this = this;
        return setTimeout(function() {
          var percent;
          if ($(_this.$elem).attr("data-rotate-percent") != null) {
            percent = parseFloat($(_this.$elem).attr("data-rotate-percent"));
          } else {
            percent = 0.1;
          }
          _this.setRotation(_this.$elem, degree * parseFloat(percent));
          if (percent < 1) {
            $(_this.$elem).attr("data-rotate-percent", percent + 0.1);
            return _this.rotateInPlace(degree, duration);
          } else {
            return $(_this.$elem).attr("data-rotate-percent", '.1');
          }
        }, duration / 20, true);
      };

      jQueryParachuteObject.prototype.skewInPlace = function(skewX, skewY, duration) {
        var _this = this;
        return setTimeout(function() {
          var percent;
          if ($(_this.$elem).attr("data-skew-percent") != null) {
            percent = parseFloat($(_this.$elem).attr("data-skew-percent"));
          } else {
            percent = 0.1;
          }
          _this.skew(skewX, skewY, percent);
          if (percent < 1) {
            $(_this.$elem).attr("data-skew-percent", percent + 0.1);
            return _this.skewInPlace(skewX, skewY, duration);
          } else {
            return $(_this.$elem).attr("data-skew-percent", '.1');
          }
        }, duration / 20, true);
      };

      jQueryParachuteObject.prototype.animate = function(callback) {
        var options, rotation, skewX, skewY;
        if (typeof JSON !== "undefined" && JSON !== null) {
          if (debugMode) {
            if (typeof console !== "undefined" && console !== null) {
              console.log("animating the following! " + (JSON.stringify(this.animation)));
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
          easing: this.easing,
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
        if (($(this).attr("data-skewY") != null) && parseInt($(this).attr("data-skewY")) !== 0) {
          skewY = $(this).attr("data-skewY");
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
            this.setAttribute("style", "position:absolute; -moz-transform:  matrix(" + a + ", " + b + ", " + c + ", " + d + ", 0, 0); -webkit-transform:  matrix(" + a + ", " + b + ", " + c + ", " + d + ", 0, 0); -o-transform:  matrix(" + a + ", " + b + ", " + c + ", " + d + ", 0, 0);");
          }
          $(this).css('left', beforeLeft);
          $(this).css('top', beforeTop);
        }
        if (debugMode) {
          return console.log("" + percent + "%");
        }
      };

      jQueryParachuteObject.prototype.setRotation = function(oObj, deg) {
        var a, b, beforeLeft, beforeTop, c, cos, costheta, d, deg2radians, left_fix, rad, sin, sintheta, top_fix;
        beforeLeft = $(oObj).css('left');
        beforeTop = $(oObj).css('top');
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
            if (typeof console !== "undefined" && console !== null) {
              console.log("rotate error: " + error.message);
            }
          }
        } else {
          oObj.setAttribute("style", "position:absolute; -moz-transform:  matrix(" + a + ", " + b + ", " + c + ", " + d + ", 0, 0); -webkit-transform:  matrix(" + a + ", " + b + ", " + c + ", " + d + ", 0, 0); -o-transform:  matrix(" + a + ", " + b + ", " + c + ", " + d + ", 0, 0);");
        }
        rad = deg * Math.PI / 180;
        rad %= 2 * Math.PI;
        if (rad < 0) {
          rad += 2 * Math.PI;
        }
        rad %= Math.PI;
        if (rad > Math.PI / 2) {
          rad = Math.PI - rad;
        }
        cos = Math.cos(rad);
        sin = Math.sin(-rad);
        top_fix = ($(oObj).height() - $(oObj).height() * cos + $(oObj).width() * sin) / 2;
        left_fix = ($(oObj).width() - $(oObj).width() * cos + $(oObj).height() * sin) / 2;
        return $(oObj).css('top', top_fix + beforeTop);
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
        if (this.easing.search('cubic-bezier' !== -1)) {
          $.addEasing(this.easing);
        }
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
        var stripPrefix;
        stripPrefix = function(value) {
          if (/\+\=/.exec(value)) {
            value = value.replace(/\+\=/, '');
          } else if (/\-\=/.exec(value)) {
            value = value.replace(/\-\=/, '-');
          }
          return value;
        };
        if (transforms.rotate != null) {
          transforms.rotate = stripPrefix(transforms.rotate);
        }
        if (transforms.x != null) {
          transforms.x = stripPrefix(transforms.x);
        }
        if (transforms.y != null) {
          transforms.y = stripPrefix(transforms.y);
        }
        if (transforms.skewX != null) {
          transforms.skewX = stripPrefix(transforms.skewX);
        }
        if (transforms.skewY != null) {
          transforms.skewY = stripPrefix(transforms.skewY);
        }
        if (($(this.$elem).attr("data-rotation") != null) && (transforms.rotate != null)) {
          transforms.rotate = parseInt($(this.$elem).attr("data-rotation")) + parseInt(transforms.rotate);
        }
        if (($(this.$elem).attr("data-skewX") != null) && (transforms.skewX != null)) {
          transforms.skewX = parseInt($(this.$elem).attr("data-skewX")) + parseInt(transforms.skewX);
        }
        if (($(this.$elem).attr("data-skewY") != null) && (transforms.skewY != null)) {
          transforms.skewY = parseInt($(this.$elem).attr("data-skewY")) + parseInt(transforms.skewY);
        }
        return transforms;
      };

      jQueryParachuteObject.prototype.translateTransforms = function(boxModel, transforms) {
        var animations, key, pieces, val;
        transforms = this.convertRelativeUnits(transforms);
        animations = {};
        for (key in boxModel) {
          val = boxModel[key];
          if (typeof val === "string") {
            boxModel[key] = parseInt(val);
          }
        }
        if (transforms.translate != null) {
          pieces = String(transforms.translate).split(',');
          if (pieces.length === 2) {
            transforms.x = pieces[0];
            transforms.y = pieces[1];
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
        animations.skewX = 0;
        if (transforms.skewX != null) {
          animations.skewX = transforms.skewX;
        }
        animations.skewY = 0;
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
      return this.each(function() {
        var jQueryParachute;
        jQueryParachute = new jQueryParachuteObject();
        return jQueryParachute.init(animation, this, callback);
      });
    };
  });

}).call(this);