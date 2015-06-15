(function() {
  'use strict';
  angular.module('galaxy', ['restangular', 'ngLodash']);

  'use strict';

  angular.module('galaxy').factory('datasets', [
    'Restangular', 'galaxy', function(Restangular, Galaxy) {
      Restangular.extendModel('datasets', function(dataset) {
        dataset.history = function() {
          return Restangular.one('histories', dataset.history_id);
        };
        return dataset;
      });
      return Galaxy.service('datasets');
    }
  ]);

  'use strict';

  angular.module('galaxy').factory('galaxy', [
    '$cacheFactory', 'Restangular', 'host', function($cacheFactory, Restangular, host) {
      var cache;
      cache = $cacheFactory('galaxy');
      return cache.get('client') || cache.put('client', Restangular.withConfig(function(config) {
        return config.setBaseUrl(host);
      }));
    }
  ]);

  'use strict';

  angular.module('galaxy').factory('histories', [
    'Restangular', 'galaxy', function(Restangular, Galaxy) {
      return Galaxy.service('histories');
    }
  ]);

  'use strict';

  angular.module('galaxy').factory('libraries', [
    'Restangular', 'galaxy', function(Restangular, Galaxy) {
      Restangular.extendModel('libraries', function(library) {
        library.permissions = function() {
          return Galaxy.service('permissions', dataset);
        };
        return library;
      });
      return Galaxy.service('libraries');
    }
  ]);

  'use strict';

  angular.module('galaxy').factory('tools', [
    'Restangular', 'galaxy', function(Restangular, Galaxy) {
      Restangular.extendModel('tools', function(tool) {
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
        return tool.run = function(options) {
          if (options == null) {
            options = {};
          }
          options['tool_version'] = tool.tool_version;
          options['tool_id'] = tool.tool_id;
          return Galaxy.service('tools').post(options);
        };
      });
      return Galaxy.service('tools');
    }
  ]);

  'use strict';

  angular.module('galaxy').factory('workflow', [
    'galaxy', 'Restangular', function(Galaxy, Restangular) {
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

  'use strict';

  angular.module('galaxy').value('host', null);

}).call(this);

//# sourceMappingURL=galaxy.js.map
