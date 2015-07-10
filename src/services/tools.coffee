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

        renderInput = (name, value, input=_.find tool.inputs, name: name) ->
          switch input.type
            when 'repeat'
              # For an input of type "repeat", we iterate through the instances
              # an compose an object that Galaxy is expecting. Note that we
              # have to recurse into renderInput a second time for each value.

              _.chain value

                # Make sure that the value is an array.
                .thru (value) ->
                  [value]

                .flatten()

                .map (valueInstance, index) ->
                  _.chain valueInstance

                    # For each nested value, generate the input.
                    .map (propertyValue, propertyName) ->
                      nestedInput = _.find input.inputs, name: propertyName
                      renderInput propertyName, propertyValue, nestedInput

                    # Rename the properties according to Galaxy's convention.
                    .map (propertyValue, propertyName) ->
                      ["#{name}_#{index}|#{propertyName}", propertyValue]

                    # Complete the chain.
                    .value()

                # Flatten and zip back to an object
                .flatten()
                .zipObject()
                .value()

            when 'data'
              # For an input of type "data", we expect to be passed an object
              # containing a "values" property containing an array of instances
              # along with an optional "batch" property that defaults to false.

              # Extract the 'bulk' flag from our input value
              batch = value.batch || false
              value = _.omit value, 'batch'

              _.chain value.values
                .thru (values) ->
                  batch: batch
                  values: values
                .thru (properties) ->
                  [[name, properties]]
                .zipObject()
                .value()

        payload.inputs = _.chain options
          .omit configArguments
          .map (values, property) ->
            renderInput property, values
          .thru (inputs) ->
            _.merge inputs...
          .value()

        Galaxy.service('tools').post payload

      return tool

    Galaxy.service 'tools'
  ]
