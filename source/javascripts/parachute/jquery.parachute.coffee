((factory) ->
  if typeof define is "function" and define.amd
    define ["jquery", "jquery-add-easing"], factory
  else
    factory(jQuery)
) ($) ->

  window.debugMode = document.location.hash.match(/debug/) and console?

  window.jQueryParachuteObject = class jQueryParachuteObject

    constructor: () ->

      @boxModelList = ["top","right","bottom","left","margin-top","margin-right","margin-bottom","margin-left","padding-top","padding-right","padding-bottom","padding-left","width","height"]
      @transformationsList = ["x","y","translate","rotate","rotateX","rotateY","rotate3d","scale","perspective","skewX","skewY","opacity"]

    init: (@animation, @$elem, @callback) ->
      self = @
      @translateAnimation ->
        self.animate ->
          console?.log "animation complete" if debugMode
          if typeof callback is 'function'
            callback?.apply? $elem
          self

    rotateInPlace: (degree, duration) ->
      setTimeout =>
        if $(@$elem).attr("data-rotate-percent")?
          percent = parseFloat($(@$elem).attr("data-rotate-percent"))
        else
          percent = 0.1

        @setRotation @$elem, degree * parseFloat(percent)

        if percent < 1
          $(@$elem).attr("data-rotate-percent", percent + 0.1)
          @rotateInPlace degree, duration
        else
          $(@$elem).attr("data-rotate-percent", '.1')
      , duration / 20, true

    skewInPlace: (skewX, skewY, duration) ->

      setTimeout =>
        if $(@$elem).attr("data-skew-percent")?
          percent = parseFloat($(@$elem).attr("data-skew-percent"))
        else
          percent = 0.1

        @skew skewX, skewY, percent

        if percent < 1
          $(@$elem).attr("data-skew-percent", percent + 0.1)
          @skewInPlace skewX, skewY, duration
        else
          $(@$elem).attr("data-skew-percent", '.1')
      , duration / 20, true

    animate: (callback) ->
      if JSON?
        console?.log "animating: #{JSON.stringify(@animation)}" if debugMode

      skewX = 0
      skewY = 0

      if @animation.rotate? and @animation.rotate isnt 0
        $(@$elem).attr("data-rotation", @animation.rotate)
        rotation = parseInt($(@$elem).attr("data-rotation"))

      if @animation.skewX? and @animation.skewX isnt 0
        $(@$elem).attr("data-skewX", @animation.skewX)
        skewX = parseInt($(@$elem).attr("data-skewX"))

      if @animation.skewY? and @animation.skewY isnt 0
        $(@$elem).attr("data-skewY", @animation.skewY)
        skewY = parseInt($(@$elem).attr("data-skewY"))

      delete @animation.rotate
      delete @animation.skewX
      delete @animation.skewY

      options = { duration: @duration, easing: @easing, step : @stepFunction}

      $(@$elem).delay(@delay).animate(@animation, options)

      if @hasOnlyTransforms @animation, @transformationsList
        if rotation?
          @rotateInPlace rotation, @duration

        if skewY isnt 0
          @skewInPlace skewX, skewY, @duration
        else if skewX isnt 0
          @skewInPlace skewX, skewY, @duration

      callback?()

    hasOnlyTransforms: (obj, props) ->
      iHaz = true
      if obj.left?
        iHaz = false
      if obj.top?
        iHaz = false
      iHaz

    #$.cssHooks.transform =
      #get: (elem) ->
        #$(elem).data "transform"

      #set: (elem, v) ->
        #rotation = v.match("rotate\\((.*)\\)")
        #if rotation.length > 1
          #setRotation elem, parseInt(rotation[1])
          #$(elem).attr "data-rotation", parseInt(rotation[1])
          #console.log "ROTATE #{parseInt(rotation[1])}"

    stepFunction: (now, fx) ->

      percent = (now/fx.end).toFixed(2)

      rotation = $(@).attr("data-rotation") if $(@).attr("data-rotation")? and parseInt($(@).attr("data-rotation")) isnt 0
      skewX = $(@).attr("data-skewX") if $(@).attr("data-skewX")? and parseInt($(@).attr("data-skewX")) isnt 0
      skewY = $(@).attr("data-skewY") if $(@).attr("data-skewY")? and parseInt($(@).attr("data-skewY")) isnt 0

      #if skewX?
        #console.log "skewing: #{(skewX * percent)/5}deg"
        #$(@).transform {"skewX": "#{(skewX * percent)/5deg"}
        #$(@).animateTransform {"skewX": "#{(skewX * percent)/5}deg", "scaleY": 1}

      #if skewY?
        #$(@).transform {"skewY": "#{skewY * percent}deg"}
        #$(@).animateTransform {"skewY": "#{skewY * percent}deg", "scaleX": 1}

      #if skewX isnt 0
        #$(@).transform {"skewX": "#{skewX * percent}deg", "skewY": "#{skewY * percent}deg"}
        #$(@).animateTransform {"skewX": "#{skewX * percent}deg", "skewY": "#{skewY * percent}deg"}
      #else if skewY isnt 0
        #$(@).transform {"skewX": "#{skewX * percent}deg", "skewY": "#{skewY * percent}deg"}
        #$(@).animateTransform {"skewX": "#{skewX * percent}deg", "skewY": "#{skewY * percent}deg"}

      if rotation?
        beforeLeft = $(@).css('left')
        beforeTop = $(@).css('top')

        deg2radians = Math.PI * 2 / 360
        rad = ($(@).attr("data-rotation") * percent) * deg2radians
        costheta = Math.cos(rad)
        sintheta = Math.sin(rad)
        a = parseFloat(costheta).toFixed(8)
        c = parseFloat(-sintheta).toFixed(8)
        b = parseFloat(sintheta).toFixed(8)
        d = parseFloat(costheta).toFixed(8)

        if @.filters? and @.filters.item(0)? and @.filters.item(0).M11?
          try
            @.filters.item(0).M11 = costheta
            @.filters.item(0).M12 = -sintheta
            @.filters.item(0).M21 = sintheta
            @.filters.item(0).M22 = costheta
          catch error
            console?.log "rotate error: #{error.message}"
        else
          @.setAttribute "style", "position:absolute; -moz-transform:  matrix(" + a + ", " + b + ", " + c + ", " + d + ", 0, 0); -webkit-transform:  matrix(" + a + ", " + b + ", " + c + ", " + d + ", 0, 0); -o-transform:  matrix(" + a + ", " + b + ", " + c + ", " + d + ", 0, 0);"

        $(@).css('left', beforeLeft)
        $(@).css('top', beforeTop)

      console.log "#{percent}%" if debugMode

    setRotation: (oObj, deg) ->
      beforeLeft = 180
      beforeTop = 20
      #console.log "BEFORE LEFT: {#{beforeLeft}"

      deg2radians = Math.PI * 2 / 360
      rad = deg * deg2radians
      costheta = Math.cos(rad)
      sintheta = Math.sin(rad)
      a = parseFloat(costheta).toFixed(8)
      c = parseFloat(-sintheta).toFixed(8)
      b = parseFloat(sintheta).toFixed(8)
      d = parseFloat(costheta).toFixed(8)

      if oObj.filters? and oObj.filters.item(0)? and oObj.filters.item(0).M11?
        try
            oObj.filters.item(0).M11 = costheta
            oObj.filters.item(0).M12 = -sintheta
            oObj.filters.item(0).M21 = sintheta
            oObj.filters.item(0).M22 = costheta
          catch error
            console?.log "rotate error: #{error.message}"
      else
        oObj.setAttribute "style", "position:absolute; -moz-transform:  matrix(" + a + ", " + b + ", " + c + ", " + d + ", 0, 0); -webkit-transform:  matrix(" + a + ", " + b + ", " + c + ", " + d + ", 0, 0); -o-transform:  matrix(" + a + ", " + b + ", " + c + ", " + d + ", 0, 0);"

      #dis = Math.min($(oObj).width(), $(oObj).height()) / 2



      #rad = deg * Math.PI / 180
      #rad %= 2 * Math.PI
      #if rad < 0
        #rad += 2 * Math.PI
      #rad %= Math.PI;
      #if rad > Math.PI / 2
        #rad = Math.PI - rad

      #cos = Math.cos(rad)
      #sin = Math.sin(-rad)

      #top_fix = ($(oObj).outerHeight() - $(oObj).height() * cos + $(oObj).width() * sin)/2
      #left_fix = ($(oObj).width() - $(oObj).width() * cos + $(oObj).height() * sin)/2

      disW = Math.min($(oObj).parent().outerWidth(), $(oObj).parent().outerHeight()) / 2
      disH = Math.min($(oObj).parent().outerWidth(), $(oObj).parent().outerHeight()) / 2
      console?.log

      $(oObj).css('top', (costheta * disH / 2) - (parseInt($(oObj).outerHeight()) / 2) + 20)
      $(oObj).css('left', (costheta * disH / 2) - (parseInt($(oObj).outerWidth()) / 2) + 180)






      #$(oObj).css('top': -(oObj.offsetWidth/2) + (oObj.clientWidth/2))

      #console.log "#{(costheta * dis / 2) - (parseInt($(oObj).width()) / 2)} + #{beforeLeft}"
      #$(oObj).css('left': ((costheta * dis / 2) - (parseInt($(oObj).width()) / 2)) + parseInt(beforeLeft))
      #$(oObj).css('top': ((sintheta * dis / 2) - (parseInt($(oObj).height()) / 2)) + parseInt(beforeTop))
      #console.log "SETTING TO: #{(costheta * dis / 2) - (parseInt($(oObj).width()) / 2)} + #{beforeLeft}"

      #$(oObj).css('left', beforeLeft)
      #$(oObj).css('top', beforeTop)

    skew: (degreesX, degreesY, percent = 1)->

      beforeLeft = $(@$elem).css('left')
      beforeTop = $(@$elem).css('top')

      $(@$elem).transform {"skewX": "#{degreesX * percent}deg", "skewY": "#{degreesY * percent}deg"}
      $(@$elem).animateTransform {"skewX": "#{degreesX * percent}deg", "skewY": "#{degreesY * percent}deg"}

      deg2radians = Math.PI * 2 / 360
      rad = degreesX * deg2radians
      costheta = Math.cos(rad)

      disW = Math.min($(@$elem).parent().outerWidth(), $(@$elem).parent().outerHeight()) / 2
      disH = Math.min($(@$elem).parent().outerWidth(), $(@$elem).parent().outerHeight()) / 2
      console?.log

      #$(oObj).css('top', (costheta * disH / 2) - (parseInt($(oObj).outerHeight()) / 2) + 20)
      $(@$elem).css('left', (costheta * disH / 2) - (parseInt($(@$elem).outerWidth()) / 2) + 180)

      $(@$elem).css('left', beforeLeft)
      $(@$elem).css('top', beforeTop)

    translateAnimation: (callback) ->
      @duration = if @animation.duration? then @animation.duration else $.fx.speeds._default
      @easing = if @animation.easing? then @animation.easing else "linear"
      @delay = if @animation.delay? then @animation.delay else 0
      @animation = @reject @animation, "duration", "easing", "delay"
      $.addEasing @easing if @easing.search 'cubic-bezier' isnt -1

      transformations = {}
      transformations[key] = val for key, val of @animation when key in @transformationsList

      if @hasOwnProperties transformations, @transformationsList
        @animation = @translateTransforms @getElementBoxModel(@$elem), transformations

      callback?()

    getElementBoxModel: (elem) ->
      boxModel = {}
      elem = elem[0] if elem.length?

      for key in @boxModelList
        if getStyle(elem, key) isnt 'auto'
        then boxModel[key] = getStyle(elem, key)

      boxModel["left"] = 0 unless boxModel["left"]?
      boxModel["top"] = 0 unless boxModel["top"]?

      boxModel

    getStyle = (elem, key) ->
      $(elem).css(key)

    convertRelativeUnits: (transforms) ->
      stripPrefix = (value) ->
        if /\+\=/.exec value
          value = value.replace /\+\=/, ''
        else if /\-\=/.exec value
          value = value.replace /\-\=/, '-'
        value

      transforms.rotate = stripPrefix transforms.rotate if transforms.rotate?
      transforms.x = stripPrefix transforms.x if transforms.x?
      transforms.y = stripPrefix transforms.y if transforms.y?
      transforms.skewX = stripPrefix transforms.skewX if transforms.skewX?
      transforms.skewY = stripPrefix transforms.skewY if transforms.skewY?

      if $(@$elem).attr("data-rotation")? and transforms.rotate?
        transforms.rotate = parseInt($(@$elem).attr("data-rotation")) + parseInt(transforms.rotate)

      if $(@$elem).attr("data-skewX")? and transforms.skewX?
        transforms.skewX = parseInt($(@$elem).attr("data-skewX")) + parseInt(transforms.skewX)

      if $(@$elem).attr("data-skewY")? and transforms.skewY?
        transforms.skewY = parseInt($(@$elem).attr("data-skewY")) + parseInt(transforms.skewY)

      transforms

    translateTransforms: (boxModel, transforms) ->

      transforms = @convertRelativeUnits transforms

      animations = {}
      boxModel[key] = parseInt(val) for key, val of boxModel when typeof(val) is "string"

      if transforms.translate?
        pieces = String(transforms.translate).split ','
        if pieces.length is 2
          transforms.x = pieces[0]
          transforms.y = pieces[1]

      transforms[key] = parseInt(val) for key, val of transforms when typeof(val) is "string"

      if transforms.scale instanceof Array and transforms.scale.length is 2
        transforms.scaleX = transforms.scale[0]
        transforms.scaleY = transforms.scale[1]
      else
        transforms.scaleX = transforms.scale
        transforms.scaleY = transforms.scale

      transforms.scaleX = 1 unless transforms.scaleX?
      transforms.scaleY = 1 unless transforms.scaleY?

      if transforms.scale isnt 1 and ($(@$elem).attr("data-scale-width")? and $(@$elem).attr("data-scale-height")?)
        $(@$elem).attr
          "data-scale-width"   : boxModel.width
          "data-scale-height"  : boxModel.height

      if $(@$elem).attr("data-scale-width")? and $(@$elem).attr("data-scale-height")?
        boxModel.width = $(@$elem).attr("data-scale-width")
        boxModel.height = $(@$elem).attr("data-scale-height")

      animations.left = boxModel.left
      animations.top = boxModel.top

      animations.left += transforms.x if transforms.x?
      animations.top += transforms.y if transforms.y?

      animations.skewX = 0
      animations.skewX = transforms.skewX if transforms.skewX?

      animations.skewY = 0
      animations.skewY = transforms.skewY if transforms.skewY?

      # If scaled X, add width and update left property
      if transforms.scaleX? and transforms.scaleX isnt 1
        animations.width = transforms.scaleX * boxModel["width"]
        animations.left += ((boxModel["width"]- animations.width) * 0.5)

      # If scaled Y, add height and update top property
      if transforms.scaleY? and transforms.scaleY isnt 1
        animations.height = transforms.scaleY * boxModel["height"]
        animations.top += ((boxModel["height"] - animations.height) * 0.5)

      # Delete animation.left if it hasn't changed
      if animations.left is boxModel.left
        delete animations.left

      # Delete animation.top if it hasn't changed
      if animations.top is boxModel.top
        delete animations.top

      animations.opacity = transforms.opacity if transforms.opacity?
      animations.rotate = transforms.rotate if transforms.rotate?

      animations[key] = "#{animations[key]}px" for key, val of animations when key in @boxModelList
      animations

    hasOwnProperties: (obj, props) ->
      iHaz = false
      for prop in props
        iHaz = true if obj.hasOwnProperty(prop)
      iHaz

    reject: (obj, rejectList...) ->
      result = {}
      for key, val of obj
       do (key) ->
        result[key] = obj[key] unless key in rejectList
      result

  $.fn.parachute = (animation, duration, easing, callback) ->
    self = @

    if typeof duration is "function"
      callback = duration
      duration = 'undefined'
    else if duration?
      animation.duration = duration

    if typeof easing is "function"
      callback = easing
      easing = 'undefined'
    else if easing?
      animation.easing = easing

    $(@).css("filter": "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand')")

    @each ->

      jQueryParachute = new jQueryParachuteObject()
      jQueryParachute.init animation, this, callback
