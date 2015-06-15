'use strict'

angular.module 'galaxy'
  .factory 'workflow', ['galaxy', 'Restangular', (Galaxy, Restangular) ->

    Galaxy.extendModel 'workflows', (workflow) ->
      workflow.invocations = Galaxy.service('invocations', workflow)

      workflow.invoke = (options) ->
        workflow.invocations.post options

      workflow

    Galaxy.service 'workflows'
  ]
