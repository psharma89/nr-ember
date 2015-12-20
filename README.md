# nr-ember
New Relic timing for Ember js

Tested with version < 2.0.0

1. Add nr-ember.js
	```
	<script src="../nr-ember.js"></script>
	```
2. NRQL queries:
```
SELECT average(renderTime) FROM PageAction FACET url SINCE 1 hour AGO TIMESERIES
SELECT average(appTime) FROM PageAction FACET url SINCE 1 hour AGO TIMESERIES
SELECT average(appTime), average(renderTime) FROM PageAction WHERE url='/menu/pizza' SINCE 1 hour AGO TIMESERIES
```