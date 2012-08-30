
# require 'helpers/pygments'

# activate :pygments

###
# Blog
###
activate :blog
set :blog_layout_engine, "haml"
set :blog_permalink, "blog/:category/:title.html"

# require 'kramdown'
# require 'redcarpet'
# set :markdown_engine, "redcarpet"
# set :markdown_engine, :redcarpet



###
# Compass
###

# Susy grids in Compass
# First: gem install compass-susy-plugin
require 'susy'

# Change Compass configuration
compass_config do |config|
  config.output_style = :compact
end

###
# Haml
###

# CodeRay syntax highlighting in Haml
# First: gem install haml-coderay
require 'haml-coderay'

# CoffeeScript filters in Haml
# First: gem install coffee-filter
require 'coffee-filter'

# Automatic image dimensions on image_tag helper
activate :automatic_image_sizes





# First: gem install rack-codehighlighter
require 'rack/codehighlighter'
use Rack::Codehighlighter,
  :pygments_api,
  :element => "pre>code",
  :pattern => /\A:::([-_+\w]+)\s*\n/,
  :markdown => true


# use Rack::Codehighlighter, :coderay, :markdown => true,
#   :element => "pre>code", :pattern => /\A:::(\w+)\s*(\n|&#x000A;)/i, :logging => false

# use Rack::Codehighlighter, :ultraviolet, :markdown => true,
#   :theme => "minimal_theme", :lines => false, :element => "pre>code",
#   :pattern => /\A:::([-_+\w]+)\s*(\n|&#x000A;)/, :logging => false,
#   :themes => {"vibrant_ink" => ["ruby"], "upstream_sunburst" => ["objective-c", "java"]}


# https://github.com/wbzyl/rack-codehighlighter
# To colorize code in pre elements with well known coderay highlighter use the following:
# use Rack::Codehighlighter, :coderay, :element => "pre", :pattern => /\A:::(\w+)\s*\n/





###
# Page command
###

# Per-page layout changes:
#
# With no layout
# page "/path/to/file.html", :layout => false
#
# With alternative layout
# page "/path/to/file.html", :layout => :otherlayout
#
# A path which all have the same layout
# with_layout :admin do
#   page "/admin/*"
# end

# page "/index.html", :layout => "/_layouts/prototype_layout"

# specific page layouts

# generic directory layouts
page "/parachute/*", :layout => "/_layouts/parachute_layout"

# Proxy (fake) files
# page "/this-page-has-no-template.html", :proxy => "/template-file.html" do
#   @which_fake_page = "Rendering a fake page with a variable"
# end

###
# Helpers
###

# Methods defined in the helpers block are available in templates
helpers do

  def is_case_study_article(tags)
    # tags =~ /case study|case_study/i
    tags.include? 'case study'
  end

  # def relative_link_to(content,href=nil,options={})
  #   href ||= content
  #   options.update :href => url_for(href, mode = :path_only)
  #   content_tag :a, content, options
  # end

  # def relative_link_to url_fragment, mode=:path_only
  #     case mode
  #     when :path_only
  #       base = request.script_name
  #     when :full_url
  #       if (request.scheme == 'http' && request.port == 80 ||
  #           request.scheme == 'https' && request.port == 443)
  #         port = ""
  #       else
  #         port = ":#{request.port}"
  #       end
  #       base = "#{request.scheme}://#{request.host}#{port}#{request.script_name}"
  #     else
  #       raise "Unknown script_url mode #{mode}"
  #     end
  #     "#{base}#{url_fragment}"
  #   end

#   def some_helper
#     "Helping"
#   end
end







# Change the CSS directory
# set :css_dir, "alternative_css_directory"

# Change the JS directory
# set :js_dir, "alternative_js_directory"

# Change the images directory
# set :images_dir, "alternative_image_directory"

# Build-specific configuration
configure :build do
  # For example, change the Compass output style for deployment
  activate :minify_css

  # Minify Javascript on build
  activate :minify_javascript

  # Enable cache buster
  activate :cache_buster

  # gzip assets
  # activate :gzip_assets

  # Use relative URLs
  activate :relative_assets

  # Compress PNGs after build
  # First: gem install middleman-smusher
  require "middleman-smusher"
  activate :smusher

  # Or use a different image path
  # set :http_path, "/Content/images/"


end
