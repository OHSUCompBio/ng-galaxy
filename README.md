### ng-galaxy: Angular services for Galaxy ###

This Angular library provides services to interface with a [Galaxy](galaxyproject.org)
instance. This implementation uses [Restangular](https://github.com/mgonto/restangular)
for making API calls, so please read up on how promises are used within Angular.

#### Configuration ####

Make sure that you specify the base URL for the Galaxy instance. Note that if
you end up wanting to interface to a Galaxy instance that is cross-domain, you'll
need to specify an API key (or allow a user to specify their key within your app.

```coffeescript
  angular
    .module 'myApp', [
      'galaxy',
      '...'
    ]
    .run (Galaxy) ->
      Galaxy.setBaseUrl 'htttp://my.galaxy.com/api'
      Galaxy.setDefaultRequestParams key: '0c45e05d075c55875ebde52ded7472dd'
```

#### Examples ####

Take 5 library datasets and add them to the current history:

```coffeescript
  query = 'select id, uuid from library_dataset_dataset where deleted = false'

  History.mostRecentlyUsed()
    .then (history) ->
      Search.post(query: query)
        .then (response) ->
          datasets = response.results
          [history, datasets]
    .then ([history, datasets])
      _.chain datasets
        .take 5
        .map (datasets) -> history.addDataset dataset
        .value()
```
