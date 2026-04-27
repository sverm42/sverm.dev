---
title: Cost Routing
description: How sverm chooses the cheapest model that can do the job — the L1–L4 tier system explained.
---

Cost routing is the system that answers one question:

> **What's the cheapest model that can do this task well?**

---

## The L1–L4 tier system

Every available model is assigned a tier based on capability and cost:

| Tier | Models | Cost | Use for |
|------|--------|------|---------|
| **L4 — Local** | Llama, Mistral, Qwen (Ollama) | Free | Prototyping, simple classification |
| **L3 — Light** | GPT-4o-mini, Claude Haiku, DeepSeek-V3-lite | ~$0.15/M input | Summarization, simple text, fact-checking |
| **L2 — Standard** | DeepSeek-V3, Claude Sonnet, GPT-4o | ~$0.27-3/M input | General problem-solving, research, writing |
| **L1 — Heavy** | DeepSeek-R1, Claude Opus | ~$0.55/M+ input | Complex reasoning, architecture, debugging |

---

## How it works

```
User asks a question
        │
        ▼
1. CLASSIFY — a cheap model (L4) classifies complexity
        │
        ├── "trivial"  → L4 (local, free)
        ├── "simple"   → L3 (cheapest API)
        ├── "moderate" → L2 (standard)
        └── "complex"  → L1 (best available)
        │
        ▼
2. ROUTE — the task goes to the selected tier
        │
        ▼
3. ESCALATE — if the model fails, move up one tier
```

---

## Escalation

If a cheaper model fails (incomplete answer, wrong format, hallucination flag),
the system automatically tries the next tier:

```
L4 failed → try L3
L3 failed → try L2
L2 failed → try L1
L1 failed → report error
```

This means:

- **80% of tasks** are solved by L3 or L4 (nearly free)
- **18%** need L2 (moderate cost)
- **~2%** actually need L1 (premium cost)

The result: **premium accuracy at a fraction of the price.**

---

## Cost budgets

Every swarm has a budget:

```yaml
cost_budget:
  max_total_usd: 2.50     # Hard cap for the entire swarm
  max_per_agent_usd: 0.80 # Cap per individual agent
```

When the budget is 95% spent, the swarm stops — no surprise bills.

---

## Caching

Two levels of caching reduce costs further:

1. **Exact match** — identical prompt + model + parameters → cached response (free)
2. **Semantic match** — very similar question (embedding similarity > 0.97) → cached response

For commonly asked questions across many swarms, this adds up quickly.

---

## Cost dashboard

Every swarm returns a detailed cost report:

```json
{
  "swarm_id": "abc-123",
  "total_cost_usd": 0.067,
  "total_tokens": 16500,
  "agents": [
    {
      "agent_id": "manager",
      "model": "deepseek-v3",
      "calls": 3,
      "cost_usd": 0.012
    }
  ],
  "cache_hits": 2,
  "cache_savings_usd": 0.008,
  "escalations": 0
}
```

You always know exactly what you spent — and what you saved.
