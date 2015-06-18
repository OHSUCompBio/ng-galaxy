'use strict'

angular.module 'galaxy'
  .factory 'Datasets', ['Galaxy', (Galaxy) ->

    # Galaxy.extenCollection 'datasets', (dataset) ->
    #   datasets.search = (uuids...) ->
    #     Galaxy.service("search").post(

    Galaxy.extendModel 'datasets', (dataset) ->
      dataset.history = Galaxy.one('histories', dataset.history_id)

      # TODO: Add dataset.contents

      dataset

    Galaxy.service('datasets')
  ]
