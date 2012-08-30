(->

  # Delegate .transition() calls to .animate()
  # if the browser can't do CSS transitions.
  $.fn.transition = $.fn.parachute

  i = 0

  $("article button").live "click", (e) ->
    e.preventDefault()
    $parent = $(this).closest("article")
    $parent.trigger "jiggle"
    $parent.trigger "restore"

  $("article .hover").live "mouseover", (e) ->
    $(this).closest("article").trigger "jiggle"

  $("article .hover").live "mouseout", (e) ->
    $(this).closest("article").trigger "restore"

  $("article").live "restore", (e) ->
    $this = $(this)
    $this.removeClass "highlight"
    if $this.find(".ghost").length
      $this.find(".box").remove()
      $this.find(".ghost").removeClass("ghost").addClass "box"

  $("article").live "jiggle", (e) ->
    $this = $(this)
    id = $this.attr("id")
    $this.addClass "highlight"
    unless id
      id = "item_" + (i++)
      $this.attr "id", id
    code = $this.find("pre").text()
    code = code.replace(/\$\(['"](.*?)['"]\)/g, "$(\"#" + id + " $1:not(.ghost)\")")
    unless $this.is(".noghost")
      $this.find(".field>*").each ->
        $(this).before $(this).clone().removeClass("box").addClass("ghost")
    eval code
)()
