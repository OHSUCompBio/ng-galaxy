'use strict'

angular.module 'galaxy'
  .factory 'libraries', ['Restangular', 'galaxy', (Restangular, Galaxy) ->

    Restangular.extendModel('libraries', (library) ->
      library.permissions = -> Galaxy.service('permissions', dataset)

      library
    )

    Galaxy.service('libraries')
  ]
