'use strict'

angular.module 'galaxy'
  .factory 'galaxy', ['$cacheFactory', 'Restangular', 'host', ($cacheFactory, Restangular, host) ->
    cache = $cacheFactory 'galaxy'

    # Note that we cache our client so that all resources that use this factory
    # have access to the same client instance.
    cache.get('client') || cache.put('client', Restangular.withConfig (config) -> config.setBaseUrl(host))
  ]
