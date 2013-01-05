((factory) ->
  if typeof define is "function" and define.amd
    define ["jquery", "transit"], factory
  else
    factory(jQuery)
) ($) ->

  window.debugMode = document.location.hash.match(/debug/) and console?

  window.jQueryParachuteObject = class jQueryParachuteObject

    # Easing object
    easing =
      "linear": [0, 0, 1, 1]
      "ease": [0.25, 0.1, 0.25, 1]
      "ease-in": [0.42, 0, 1, 1]
      "ease-out": [0, 0, 0.58, 1]
      "ease-in-out": [0.42, 0, 0.58, 1]

    # Add Easing function
    addEasing = (str) ->
      fn = $.easing[str]
      name = undefined
      coords = undefined
      l = undefined

      # Return the cached function if it exists.
      return fn  if fn

      # Get the standard easing function if it's defined.
      if easing[str]
        name = str
        coords = easing[str]
        str = "cubic-bezier(" + coords.join(", ") + ")"

      # Else assume this is a cubic-bezier. It must be.
      else
        coords = str.match(/\d*\.?\d+/g)
        l = coords.length # Should be 4
        coords[l] = parseFloat(coords[l])  while l--

      fn = makeBezier.apply(this, coords)
      $.easing[str] = fn
      $.easing[name] = fn  if name
      fn

    makeBezier = (x1, y1, x2, y2) ->
      (t) ->

        # Extract X (which is equal to time here)
        f0 = 1 - 3 * x2 + 3 * x1
        f1 = 3 * x2 - 6 * x1
        f2 = 3 * x1
        refinedT = t
        i = undefined
        refinedT2 = undefined
        refinedT3 = undefined
        x = undefined
        slope = undefined
        i = 0
        while i < 5
          refinedT2 = refinedT * refinedT
          refinedT3 = refinedT2 * refinedT
          x = f0 * refinedT3 + f1 * refinedT2 + f2 * refinedT
          slope = 1.0 / (3.0 * f0 * refinedT2 + 2.0 * f1 * refinedT + f2)
          refinedT -= (x - t) * slope
          refinedT = Math.min(1, Math.max(0, refinedT))
          i++
        3 * Math.pow(1 - refinedT, 2) * refinedT * y1 + 3 * (1 - refinedT) * Math.pow(refinedT, 2) * y2 + Math.pow(refinedT, 3)

    $.addEasing = addEasing;

    constructor: () ->
      @boxModelList = ["top","right","bottom","left","margin-top","margin-right","margin-bottom","margin-left","padding-top","padding-right","padding-bottom","padding-left","width","height"]
      @transformationsList = ["x","y","translate","rotate","rotateX","rotateY","rotate3d","scale","perspective","skewX","skewY","opacity"]

    init: (@animation, @$elem, callback) ->
      console?.log @ if debugMode
      @translateAnimation =>
        @animate =>
          if typeof callback is 'function'
            callback?.apply? @$elem
          this

    rotateInPlace: (degree, duration) ->

      # TODO: determine best number of rotates per animation - currently 10 -
      # and reasonable timeout duration

      numRotations = 10
      percentageIncrement = 1 / numRotations

      setTimeout =>

        if $(@$elem).attr("data-rotate-percent")?
          percent = parseFloat($(@$elem).attr("data-rotate-percent"))
        else
          percent = 1 / numRotations

        @setRotation @$elem, degree * parseFloat(percent)

        if percent < 1
          $(@$elem).attr("data-rotate-percent", percent + percentageIncrement)
          @rotateInPlace degree, duration
        else
          $(@$elem).attr("data-rotate-percent", "#{percentageIncrement}")
      , duration / 20, true

    skewInPlace: (skewX, skewY, duration) ->

      # TODO: determine best number of rotates per animation - currently 10 -
      # and reasonable timeout duration

      numSkews = 10
      percentageIncrement = 1 / numSkews

      setTimeout =>
        if $(@$elem).attr("data-skew-percent")?
          percent = parseFloat($(@$elem).attr("data-skew-percent"))
        else
          percent = percentageIncrement

        @skew skewX, skewY, percent

        if percent < 1
          $(@$elem).attr("data-skew-percent", percent + percentageIncrement)
          @skewInPlace skewX, skewY, duration
        else
          $(@$elem).attr("data-skew-percent", "#{percentageIncrement}")
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

      options = { duration: @duration, step : @stepFunction, complete: callback}
      #console?.log "animating: #{JSON.stringify(@animation)}" if debugMode

      $(@$elem).delay(@delay).animate(@animation, options)

      # if only transforms, can't use step function to animate
      if @hasOnlyTransforms @animation, @transformationsList
        if rotation?
          @rotateInPlace rotation, @duration

        if skewY isnt 0
          @skewInPlace skewX, skewY, @duration
        else if skewX isnt 0
          @skewInPlace skewX, skewY, @duration

    # TODO: best determine if only transforms are being animated
    hasOnlyTransforms: (obj, props) ->
      iHaz = true
      if obj.left?
        iHaz = false
      if obj.top?
        iHaz = false
      iHaz

    stepFunction: (now, fx) ->

      percent = (now/fx.end).toFixed(2)

      rotation = $(@).attr("data-rotation") if $(@).attr("data-rotation")? and parseInt($(@).attr("data-rotation")) isnt 0
      skewX = $(@).attr("data-skewX") if $(@).attr("data-skewX")? and parseInt($(@).attr("data-skewX")) isnt 0

      if $(@).attr("data-skewX")? and parseInt($(@).attr("data-skewX")) isnt 0
        skewX = $(@).attr("data-skewX")
      else
        skewX = 0

      if $(@).attr("data-skewY")? and parseInt($(@).attr("data-skewY")) isnt 0
        skewY = $(@).attr("data-skewY")
      else
        skewY = 0

      if skewX isnt 0
        $(@).transform {"skewX": "#{skewX * percent}deg", "skewY": "#{skewY * percent}deg"}
        $(@).animateTransform {"skewX": "#{skewX * percent}deg", "skewY": "#{skewY * percent}deg"}
      else if skewY isnt 0
        $(@).transform {"skewX": "#{skewX * percent}deg", "skewY": "#{skewY * percent}deg"}
        $(@).animateTransform {"skewX": "#{skewX * percent}deg", "skewY": "#{skewY * percent}deg"}

      if rotation?

        #TODO: call @setRotation instead of code below - having trouble accessing within step function :(
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

    setRotation: (oObj, deg) ->

      if $(@$elem).attr("data-rotation-left")?
        beforeLeft = parseInt($(oObj).attr("data-rotation-left"))
      else
        beforeLeft = parseInt($(oObj).css('left'))

      if $(@$elem).attr("data-rotation-top")?
        beforeTop = parseInt($(oObj).attr("data-rotation-top"))
      else
        beforeTop = parseInt($(oObj).css('top'))

      $(oObj).attr("data-rotation-left", beforeLeft)
      $(oObj).attr("data-rotation-top", beforeTop)

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
            console?.log "rotate error: #{error.message}" if debugMode
      else
        oObj.setAttribute "style", "position:absolute; -moz-transform:  matrix(" + a + ", " + b + ", " + c + ", " + d + ", 0, 0); -webkit-transform:  matrix(" + a + ", " + b + ", " + c + ", " + d + ", 0, 0); -o-transform:  matrix(" + a + ", " + b + ", " + c + ", " + d + ", 0, 0);"

      distanceHeight = Math.min($(oObj).parent().outerWidth(), $(oObj).parent().outerHeight()) / 2

      $(oObj).css('top', (costheta * distanceHeight / 2) - (parseInt($(oObj).outerHeight()) / 2) + beforeTop)
      $(oObj).css('left', (costheta * distanceHeight / 2) - (parseInt($(oObj).outerWidth()) / 2) + beforeLeft)


    skew: (degreesX, degreesY, percent = 1)->

      beforeLeft = $(@$elem).css('left')
      beforeTop = $(@$elem).css('top')

      $(@$elem).transform {"skewX": "#{degreesX * percent}deg", "skewY": "#{degreesY * percent}deg"}
      $(@$elem).animateTransform {"skewX": "#{degreesX * percent}deg", "skewY": "#{degreesY * percent}deg"}

      $(@$elem).css('left', beforeLeft)
      $(@$elem).css('top', beforeTop)

    translateAnimation: (callback) ->
      @duration = if @animation.duration? then @animation.duration else $.fx.speeds._default
      @easing = if @animation.easing? then @animation.easing else "linear"
      @delay = if @animation.delay? then @animation.delay else 0
      @animation = @reject @animation, "duration", "easing", "delay"
      #$.addEasing @easing if @easing.search 'cubic-bezier' isnt -1

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

      transforms[key] = stripPrefix val for key, val of transforms when typeof(val) is "string"

      transforms

    translateTransforms: (boxModel, transforms) ->

      transforms = @convertRelativeUnits transforms

      # Store transform poperties for relative-based animations
      if $(@$elem).attr("data-rotation")? and transforms.rotate?
        transforms.rotate = parseInt($(@$elem).attr("data-rotation")) + parseInt(transforms.rotate)

      if $(@$elem).attr("data-skewX")? and transforms.skewX?
        transforms.skewX = parseInt($(@$elem).attr("data-skewX")) + parseInt(transforms.skewX)

      if $(@$elem).attr("data-skewY")? and transforms.skewY?
        transforms.skewY = parseInt($(@$elem).attr("data-skewY")) + parseInt(transforms.skewY)

      if transforms.translate?
        pieces = String(transforms.translate).split ','
        if pieces.length is 2
          transforms.x = pieces[0]
          transforms.y = pieces[1]

      if transforms.x?
        if $(@$elem).attr("data-x-translation")?
          previousXTranslation = parseInt($(@$elem).attr("data-x-translation"))
          $(@$elem).attr("data-x-translation", parseInt(transforms.x))
          transforms.x = parseInt(transforms.x) - previousXTranslation
        else
          $(@$elem).attr("data-x-translation", parseInt(transforms.x))

      if transforms.y?
        if $(@$elem).attr("data-y-translation")?
          previousYTranslation = parseInt($(@$elem).attr("data-y-translation"))
          $(@$elem).attr("data-y-translation", parseInt(transforms.y))
          transforms.y = parseInt(transforms.y) - previousYTranslation
        else
          $(@$elem).attr("data-y-translation", parseInt(transforms.y))

      animations = {}
      boxModel[key] = parseInt(val) for key, val of boxModel when typeof(val) is "string"

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

      animations.skewX = transforms.skewX if transforms.skewX?
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

    if $(@).css("position") isnt "absolute"
      $(@).css
        "position": "relative"

    @each ->
      jQueryParachute = new jQueryParachuteObject()
      jQueryParachute.init animation, this, callback

  $.fn.transition = $.fn.parachute if !$.support.transition