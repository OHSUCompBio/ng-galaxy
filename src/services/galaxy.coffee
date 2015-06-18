'use strict'

angular.module 'galaxy'
  .factory 'Galaxy', ['$cacheFactory', 'Restangular', ($cacheFactory, Restangular) ->
    cache = $cacheFactory 'galaxy'

    # Note that we cache our client so that all resources that use this factory
    # have access to the same client instance.
    if Galaxy = cache.get('client')
      return Galaxy
    else
      Galaxy = Restangular.withConfig (config) -> 
        config.addResponseInterceptor (data, operation, what, url, response, deferred) ->
          # In the case for api/tools, we need to flatten the response
          if what == 'tools' && operation == 'getList'
              data = _.chain data
                .pluck 'elems'
                .flatten()
                .value()

          data

        config.addFullRequestInterceptor (element, operation, what, url, headers, params, httpConfig) ->
          # For tools#get, include io_details
          if what == 'tools' && operation == 'get'
            params = _.assign params, io_details: true

          params: params

        return

      cache.put 'client', Galaxy
  
  ]
