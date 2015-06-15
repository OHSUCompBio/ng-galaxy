'use strict'

angular.module 'galaxy'
  .factory 'histories', ['Restangular', 'galaxy', (Restangular, Galaxy) ->

    Galaxy.service('histories')
  ]
