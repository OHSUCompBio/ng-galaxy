'use strict'

angular.module 'galaxy'
  .factory 'Libraries', ['Galaxy', (Galaxy) ->

    Galaxy.extendModel 'libraries', (library) ->
      library.permissions = Galaxy.service('permissions', library)
      library.contents = Galaxy.service('contents', library)

      library

    Galaxy.service('libraries')
  ]
