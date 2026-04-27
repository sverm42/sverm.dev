---
title: Communication Topologies
description: The four patterns swarms use to communicate — sequential, parallel, debate, and hierarchical.
---

Agents in a swarm communicate via a **Redis Streams** message bus. This
gives us four fundamental communication patterns.

---

## 1. Sequential (Pipeline)

```
Agent A  →  Agent B  →  Agent C
```

Each agent processes the output of the previous one. Good for tasks with a
natural order.

**Use when:**
- You need a clear, linear workflow
- Each step depends on the previous one
- Quality improves with iteration

**Example:** Writing swarm — writer → critic → polisher.

```yaml
topology: sequential
```

---

## 2. Parallel (Fan-out)

```
           ┌→ Agent B
Agent A ────→ Agent C
           └→ Agent D
```

One agent (or the orchestrator) sends the same task to multiple agents who
work independently.

**Use when:**
- Tasks have independent sub-tasks
- You need multiple perspectives on the same problem
- Speed matters (parallelism)

**Example:** Research swarm — 3 researchers search different aspects simultaneously.

```yaml
topology: parallel
```

---

## 3. Debate (Consensus)

```
Agent A ──→ Agent B ──→ Syntese
Agent C ──┘
```

Multiple agents argue different sides of a question. A synthesizer (or
voting mechanism) produces a final answer.

**Use when:**
- The question is subjective or controversial
- You want to explore both sides systematically
- You need to surface assumptions and blind spots

**Example:** Debate swarm — pro/con agents argue, judge evaluates.

```yaml
topology: debate
```

---

## 4. Hierarchical (Manager-Worker)

```
       Manager
       │  │  │
       ▼  ▼  ▼
      W1  W2  W3
```

A manager agent breaks down the task, delegates to workers, and synthesizes
results.

**Use when:**
- The task is complex and needs coordination
- Subtasks are interdependent
- You need quality control and synthesis

**Example:** Research swarm with a manager coordinating researchers,
fact-checkers, and writers.

```yaml
topology: hierarchical
```

---

## Message Format

All communication uses a simple JSON schema:

```json
{
  "msg_id": "uuid",
  "parent_id": "uuid | null",
  "swarm_id": "uuid",
  "from_agent": "researcher-1",
  "to_agent": "manager",
  "type": "task | result | query | vote | heartbeat",
  "payload": { ... },
  "timestamp": "2026-04-27T21:41:00Z",
  "cost": {
    "tokens_in": 150,
    "tokens_out": 300,
    "model": "deepseek-v3"
  }
}
```

Every message tracks its cost, so we always know exactly what each step
contributed to the total.

---

## Choosing a topology

| Topology | Parallelism | Coordination | Best for |
|----------|-------------|--------------|----------|
| Sequential | None | Low | Linear workflows, iteration |
| Parallel | High | Low | Independent sub-tasks |
| Debate | Medium | Medium | Subjective questions, analysis |
| Hierarchical | High | High | Complex multi-step tasks |
