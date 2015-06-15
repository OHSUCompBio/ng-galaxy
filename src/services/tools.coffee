'use strict'

angular.module 'galaxy'
  .factory 'tools', ['Restangular', 'galaxy', (Restangular, Galaxy) ->

    Restangular.extendModel 'tools', (tool) ->
      tool.build = (options={}) ->
        tool.customGET 'build', options

      tool.reload = (options={}) ->
        tool.customGET 'reload', options

      tool.diagnostics = (options={}) ->
        tool.customGET 'diagnostics', options

      tool.run = (options={}) ->
        options['tool_version'] = tool.tool_version
        options['tool_id'] = tool.tool_id
        Galaxy.service('tools').post options

    Galaxy.service 'tools'
  ]
