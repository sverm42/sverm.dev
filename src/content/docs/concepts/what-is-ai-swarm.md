---
title: What is an AI Swarm?
description: Understand the swarm metaphor and why multi-agent systems outperform single agents for complex tasks.
---

An **AI swarm** is a group of AI agents that work together on a task — each with
a specific role, a specific model, and specific tools — coordinated by a shared
communication bus.

---

## The metaphor

In nature, a single ant accomplishes little. But an ant colony builds complex
structures, finds optimal paths to food, and defends itself — all without a
central planner.

An AI swarm works the same way:

- **No single agent does everything.** Each agent has a narrow, well-defined role.
- **Communication is simple.** Agents send structured messages to each other.
- **The intelligence emerges from the interaction**, not from any individual agent.

---

## Single agent vs. swarm

| | Single Agent | Swarm |
|---|---|---|
| **Reasoning** | One model, one perspective | Multiple models, multiple perspectives |
| **Verification** | Agent checks its own work | Dedicated fact-checker / critic agents |
| **Parallelism** | Sequential by default | Natural parallel execution |
| **Cost** | Premium models for everything | Route simple tasks to cheap models |
| **Failure modes** | Silent errors, hallucination | Errors are caught by other agents |

---

## When to use a swarm

Swarms shine when:

- The task has **multiple independent subtasks** (research, analysis, writing)
- You need **verification and critique** (code review, fact-checking, debate)
- The task benefits from **multiple perspectives** (creative writing, strategy)
- **Cost matters** — you want to use cheap models for simple subtasks

For simple Q&A or single-step tasks, a single agent is still the right call.

---

## The four core components

```
┌──────────────────────────────────────────┐
│ 1. AGENTS       ← The workers            │
│    Each has a role, a model, and tools    │
│                                          │
│ 2. MESSAGE BUS  ← How agents talk        │
│    Redis Streams, typed messages          │
│                                          │
│ 3. ORCHESTRATOR ← Manages the swarm      │
│    Assigns tasks, monitors progress      │
│                                          │
│ 4. COST ROUTER  ← Picks the right model  │
│    Complex → premium, simple → cheap     │
└──────────────────────────────────────────┘
```

---

## Next

- **[Agent Model](/concepts/agent-model/)** — how individual agents think and act
- **[Communication Topologies](/concepts/communication-topologies/)** — the four ways swarms communicate
- **[Cost Routing](/concepts/cost-routing/)** — how we keep swarms cheap
