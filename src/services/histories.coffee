'use strict'

angular.module 'galaxy'
  .factory 'Histories', ['Galaxy', (Galaxy) ->

    Galaxy.extendCollection 'histories', (histories) ->

      histories.mostRecentlyUsed = ->
        histories.customGET('most_recently_used').then (response) ->
          Galaxy.restangularizeElement null, response, 'histories'

      return histories

    Galaxy.extendModel 'histories', (history) ->

      history.addDataset = (dataset, source='library') ->
        history.customPOST source: source, content: dataset.id, 'contents'

      return history

    Galaxy.service('histories')
  ]
