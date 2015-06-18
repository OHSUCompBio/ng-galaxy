'use strict'

angular.module 'galaxy'
  .factory 'Tools', ['Galaxy', (Galaxy) ->

    Galaxy.extendModel 'tools', (tool) ->
      tool.build = (options={}) ->
        tool.customGET 'build', options

      tool.reload = (options={}) ->
        tool.customGET 'reload', options

      tool.diagnostics = (options={}) ->
        tool.customGET 'diagnostics', options

      tool.run = (options={}) ->
        # These arguments, if passed in, will be added at the "top" level of the
        # payload.
        configArguments = ['history_id', 'action']

        # Populate the top-level of the payload with information from this tool.
        payload =
          tool_version: tool.version
          tool_id: tool.id

        # Apply config-related arguments to our config.        
        payload = _.assign payload, _.pick(options, configArguments)

        # Flatten out the rest of the options we're passing in as inputs. This
        # allows us to take {input_images: [{intput_file: [...]}, ...]}
        # and return {inpute_images_0|input_file: {batch: true, values: [...]}}

        payload.inputs = _.chain options
          .omit configArguments
          .map (value, property) ->
            input = _.find tool.inputs, name: property
            if input.type == 'repeat' and Array.isArray(value)
              _.chain value
                .map (repeatedInstance, index) ->
                  _.chain repeatedInstance
                    .map (obj) ->
                      _.map obj, (propertyValue, propertyName) ->
                        _.assign propertyValue, __propertyName: propertyName
                    .flatten()
                    .groupBy '__propertyName'
                    .map (collectionValue, collectionName) ->
                        ["#{property}_#{index}|#{collectionName}",
                          batch: true
                          values: collectionValue]
                    .value()
              .flatten()
              .value()
            else
              [[property, value]]
          .flatten()
          .zipObject()
          .value()

        Galaxy.service('tools').post payload

      return tool

    Galaxy.service 'tools'
  ]
