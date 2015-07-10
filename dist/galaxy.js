(function() {
  'use strict';
  angular.module('galaxy', ['restangular', 'ngLodash']);

  'use strict';

  angular.module('galaxy').factory('Datasets', [
    'Galaxy', function(Galaxy) {
      Galaxy.extendModel('datasets', function(dataset) {
        if (dataset.history_id != null) {
          dataset.history = Galaxy.one('histories', dataset.history_id);
        }
        dataset.download = function() {
          return dataset.customGET('download');
        };
        return dataset;
      });
      return Galaxy.service('datasets');
    }
  ]);

  'use strict';

  angular.module('galaxy').factory('Galaxy', [
    '$cacheFactory', 'Restangular', function($cacheFactory, Restangular) {
      var Galaxy, cache;
      cache = $cacheFactory('galaxy');
      if (Galaxy = cache.get('client')) {
        return Galaxy;
      } else {
        Galaxy = Restangular.withConfig(function(config) {
          config.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
            if (what === 'tools' && operation === 'getList') {
              data = _.chain(data).pluck('elems').flatten().value();
            }
            return data;
          });
          config.addFullRequestInterceptor(function(element, operation, what, url, headers, params, httpConfig) {
            if (what === 'tools' && operation === 'get') {
              params = _.assign(params, {
                io_details: true
              });
            }
            return {
              params: params
            };
          });
        });
        return cache.put('client', Galaxy);
      }
    }
  ]);

  'use strict';

  angular.module('galaxy').factory('Histories', [
    'Galaxy', function(Galaxy) {
      Galaxy.extendCollection('histories', function(histories) {
        histories.mostRecentlyUsed = function() {
          return histories.customGET('most_recently_used').then(function(response) {
            return Galaxy.restangularizeElement(null, response, 'histories');
          });
        };
        return histories;
      });
      Galaxy.extendModel('histories', function(history) {
        history.addDataset = function(dataset, source) {
          if (source == null) {
            source = 'library';
          }
          return history.customPOST({
            source: source,
            content: dataset.id
          }, 'contents');
        };
        history.contents = function() {
          return history.customGET('contents');
        };
        return history;
      });
      return Galaxy.service('histories');
    }
  ]);

  'use strict';

  angular.module('galaxy').factory('Jobs', [
    'Galaxy', function(Galaxy) {
      return Galaxy.service('jobs');
    }
  ]);

  'use strict';

  angular.module('galaxy').factory('Libraries', [
    'Galaxy', function(Galaxy) {
      Galaxy.extendModel('libraries', function(library) {
        library.permissions = Galaxy.service('permissions', library);
        library.contents = Galaxy.service('contents', library);
        return library;
      });
      return Galaxy.service('libraries');
    }
  ]);

  'use strict';

  angular.module('galaxy').factory('Search', [
    'Galaxy', function(Galaxy) {
      return Galaxy.service('search');
    }
  ]);

  'use strict';

  angular.module('galaxy').factory('Tools', [
    'Galaxy', function(Galaxy) {
      Galaxy.extendModel('tools', function(tool) {
        tool.build = function(options) {
          if (options == null) {
            options = {};
          }
          return tool.customGET('build', options);
        };
        tool.reload = function(options) {
          if (options == null) {
            options = {};
          }
          return tool.customGET('reload', options);
        };
        tool.diagnostics = function(options) {
          if (options == null) {
            options = {};
          }
          return tool.customGET('diagnostics', options);
        };
        tool.run = function(options) {
          var configArguments, payload, renderInput;
          if (options == null) {
            options = {};
          }
          configArguments = ['history_id', 'action'];
          payload = {
            tool_version: tool.version,
            tool_id: tool.id
          };
          payload = _.assign(payload, _.pick(options, configArguments));
          renderInput = function(name, value, input) {
            var batch;
            if (input == null) {
              input = _.find(tool.inputs, {
                name: name
              });
            }
            switch (input.type) {
              case 'repeat':
                return _.chain(value).thru(function(value) {
                  return [value];
                }).flatten().map(function(valueInstance, index) {
                  return _.chain(valueInstance).map(function(propertyValue, propertyName) {
                    var nestedInput;
                    nestedInput = _.find(input.inputs, {
                      name: propertyName
                    });
                    return renderInput(propertyName, propertyValue, nestedInput);
                  }).map(function(propertyValue, propertyName) {
                    return ["" + name + "_" + index + "|" + propertyName, propertyValue];
                  }).value();
                }).flatten().zipObject().value();
              case 'data':
                batch = value.batch || false;
                value = _.omit(value, 'batch');
                return _.chain(value.values).thru(function(values) {
                  return {
                    batch: batch,
                    values: values
                  };
                }).thru(function(properties) {
                  return [[name, properties]];
                }).zipObject().value();
            }
          };
          payload.inputs = _.chain(options).omit(configArguments).map(function(values, property) {
            return renderInput(property, values);
          }).thru(function(inputs) {
            return _.merge.apply(_, inputs);
          }).value();
          return Galaxy.service('tools').post(payload);
        };
        return tool;
      });
      return Galaxy.service('tools');
    }
  ]);

  'use strict';

  angular.module('galaxy').factory('Workflow', [
    'Galaxy', function(Galaxy) {
      Galaxy.extendModel('workflows', function(workflow) {
        workflow.invocations = Galaxy.service('invocations', workflow);
        workflow.invoke = function(options) {
          return workflow.invocations.post(options);
        };
        return workflow;
      });
      return Galaxy.service('workflows');
    }
  ]);

}).call(this);

//# sourceMappingURL=galaxy.js.map
