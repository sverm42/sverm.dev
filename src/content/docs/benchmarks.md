---
title: Benchmarks
description: Open, reproducible benchmarks of AI swarm configurations — models, topologies, and cost trade-offs.
---

We run benchmarks to understand the real-world performance of different
models and swarm configurations. Every benchmark is reproducible — you
can run it yourself with the provided YAML definition.

---

## Research report benchmark

**Task:** "Investigate the current state of hydrogen energy in Norway."

**Methodology:** Each configuration was run 3 times. Quality and Norwegian
language scores are averaged from 3 independent human evaluations (blind).

| Configuration | Time | Cost | Quality* | Norwegian** |
|---|---|---|---|---|
| DeepSeek-V3 (all agents) | 22s | $0.07 | 4.2/5 | 4.5/5 |
| Claude Sonnet (all agents) | 18s | $0.82 | 4.5/5 | 4.8/5 |
| GPT-4o (all agents) | 25s | $1.34 | 4.3/5 | 3.8/5 |
| Mixed (auto-route) | 20s | $0.11 | 4.3/5 | 4.4/5 |
| GPT-4o-mini (all) | 14s | $0.01 | 2.8/5 | 2.1/5 |

<small>
*Quality: factual accuracy, structure, completeness, and usefulness — scored 1-5 by human evaluators.
**Norwegian: grammar, naturalness, æ/ø/å accuracy, idiomatic expression — scored 1-5 by native speakers.
</small>

### Key findings

- **DeepSeek-V3 is the value leader.** Near-Sonnet quality for ~11% of the cost.
- **Claude Sonnet is the quality leader**, especially for Norwegian. Worth it for high-stakes output.
- **GPT-4o-mini alone is not suitable** for research tasks — hallucination rate is significantly higher.
- **Mixed routing** (auto-select model per agent) gives 90% of the quality for ~13% of the all-premium cost.

### Reproduce this benchmark

```bash
sverm run research \
  --model deepseek-v3 \
  "Investigate the current state of hydrogen energy in Norway"
```

[Full YAML definition and raw data on GitHub](https://github.com/sverm42/sverm.dev) (coming soon).

---

## Code review benchmark

**Task:** Review [example PR](https://github.com/example/project/pull/42) — a 200-line Python change.

*Data collection in progress. Results expected May 2026.*

---

## More benchmarks coming

We plan to benchmark:
- Debate quality (different model combinations)
- Creative writing (Norwegian and English)
- Cost efficiency (tokens per useful output word)
- Scaling behavior (2, 5, 10, 20 parallel agents)

**Methodology note:** All benchmarks use the same swarm YAML definitions.
Human evaluators are blind to which model produced which output. Raw data
is published alongside results. If you find a flaw in our methodology,
[let us know](mailto:raymond@sverm.ai) — we'll fix it and credit you.
