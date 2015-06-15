'use strict'

angular.module 'galaxy'
  .factory 'datasets', ['Restangular', 'galaxy', (Restangular, Galaxy) ->

    Restangular.extendModel 'datasets', (dataset) ->
      dataset.history = -> Restangular.one('histories', dataset.history_id)

      # TODO: Add dataset.contents

      dataset

    Galaxy.service('datasets')
  ]
