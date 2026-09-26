# Model 3: Baseline Comparison Report
**Evaluation Focus:** Raw NWP vs Persistence vs Hurdle Downscaling  

## 1. Coarse NWP Wet-Area / Occurrence Mismatch
- The pilot exhibits a substantial wet-area/occurrence mismatch between coarse NWP precipitation and station observations, consistent with the expected spatial smoothing of localized convective precipitation.
- Coarse NWP produces 129 predicted wet station-hours across 360 hours, whereas in-situ rain gauges observe localized rain in only 51 hours (85.8% dry).
- On the locked test station (AWS_LKO_05), NWP yields 20 False Alarms against only 5 Hits, resulting in a False Alarm Ratio of 80.0%. This highlights the observational challenge of resolving sub-grid convective showers from 100 km² coarse NWP cells.

## 2. Persistence Baseline (lag_1h)
- In-situ precipitation is highly episodic; lagged rainfall ($t-1$) provides short-term memory during convective systems but fails on storm initiation and cessation.
- Locked test MAE: 0.3953 mm/h.

## 3. Error Reductions Achieved
- On locked test (AWS_LKO_05):
  - NWP MAE: 0.5909 mm/h $\to$ Hurdle MAE: 0.5477 mm/h ($\Delta = -0.0432$ mm/h).
  - NWP RMSE: 1.1438 mm/h $\to$ Hurdle RMSE: 1.4930 mm/h.
