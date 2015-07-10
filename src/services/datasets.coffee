'use strict'

angular.module 'galaxy'
  .factory 'Datasets', ['Galaxy', (Galaxy) ->

    Galaxy.extendModel 'datasets', (dataset) ->

      if dataset.history_id?
        dataset.history = Galaxy.one('histories', dataset.history_id)

      dataset.download = ->
        dataset.customGET 'download'

      return dataset

    Galaxy.service('datasets')
  ]
