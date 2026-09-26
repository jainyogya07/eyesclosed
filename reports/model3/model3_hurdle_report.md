# Model 3: Two-Stage Hurdle Architecture Report

## 1. Mathematical Formulation
Due to 85.8% zero-inflation, a single-stage MSE regressor suffers from unconditional shrinkage toward zero, failing on peaks.
The two-stage hurdle explicitly factors the joint distribution:
$$P(Y = y \mid X) = \begin{cases} 1 - P(\text{rain} \ge 0.1 \mid X) & \text{if } y < 0.1 \\ P(\text{rain} \ge 0.1 \mid X) \cdot f(y \mid y \ge 0.1, X) & \text{if } y \ge 0.1 \end{cases}$$

## 2. Probabilistic Interpretation Integrity
- $P(\text{rain} \ge 0.1 \mid X)$ is the **occurrence probability**.
- $E[Y \mid Y \ge 0.1, X]$ is the **conditional rainfall intensity**.
- $\widehat{R}_{\text{expected}} = P(\text{rain}) \times E[Y \mid \text{rain}]$ is the **expected rainfall amount**.
- **CRITICAL:** This expectation is NOT "the most likely rainfall amount" (which is 0.0 mm/h for any $P(\text{rain}) < 0.5$). All three quantities are stored and returned as distinct fields.

## 3. Validation Threshold Selection
- Threshold tuned exclusively on validation set (AWS_LKO_04): **0.175**.
- Locked test set was never exposed to threshold tuning.
