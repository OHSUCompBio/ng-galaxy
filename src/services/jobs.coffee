'use strict'

angular.module 'galaxy'
  .factory 'Jobs', ['Galaxy', (Galaxy) ->
    Galaxy.service('jobs')
  ]
