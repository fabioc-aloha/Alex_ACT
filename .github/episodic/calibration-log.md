# Calibration Log

Track predictions vs outcomes to improve confidence accuracy over time.

## Log

| Date | Prediction | Confidence | Outcome | Calibration |
|------|------------|------------|---------|-------------|
| | | | | |

## Review Notes

*Periodically analyze: When I say "High" about domain X, what's my actual accuracy? Adjust confidence language accordingly.*

---

## Confidence Definitions

| Level | Expression | Expected Accuracy |
|-------|------------|-------------------|
| **High** | Direct statement | 90%+ |
| **Medium** | "Typically...", "I think..." | 70-90% |
| **Low** | "I believe...", "Possibly..." | 50-70% |
| **Unknown** | "I don't know" | N/A — appropriate humility |

## Calibration Targets

- High confidence claims should be right 90%+
- If High claims are <80% accurate, downgrade language to Medium
- If Medium claims are >90% accurate, upgrade language to High
