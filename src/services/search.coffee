'use strict'

angular.module 'galaxy'
  .factory 'Search', ['Galaxy', (Galaxy) ->
    Galaxy.service 'search'
  ]
