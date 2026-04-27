---
title: Agent Model
description: How individual agents think, act, and communicate — the stateless worker at the heart of every swarm.
---

Every agent in a swarm is a **stateless worker** with a simple, predictable lifecycle.

---

## Agent anatomy

```python
Agent {
  role: "researcher"          # What this agent does
  model: "deepseek-v3"        # Which LLM to use
  tools: ["web_search"]       # What tools it has access to
  temperature: 0.7            # Creativity dial
  system_prompt: "..."        # Core instructions
  max_tokens: 4096            # Response budget
}
```

An agent is **just configuration + an LLM call**. No persistent state, no local
memory — everything flows through the message bus.

---

## The Think-Act Loop

Every agent runs in a continuous loop:

```
┌─────────────────────────────┐
│        AGENT LOOP           │
│                             │
│  1. RECEIVE — get messages  │
│       │                     │
│  2. THINK   — call LLM      │
│       │                     │
│       ├→ "reply" → 3. SEND  │
│       │                     │
│       └→ "tool"  → 4. EXEC  │
│           │                 │
│           └→ back to THINK  │
└─────────────────────────────┘
```

### Receive

The agent reads new messages addressed to it from the Redis Stream. Each
message has a type (task, result, query, vote) and a payload.

### Think

The agent calls its assigned LLM with:
1. Its system prompt
2. The conversation history (messages received so far)
3. Available tool definitions

The LLM returns either a text response or a tool call.

### Act

- **Text response** → published to the message bus, addressed to the next agent
- **Tool call** → the tool is executed, the result is fed back to the LLM (back to Think)
- **Delegate** → a new sub-task is sent to another agent
- **Finish** → the agent is done and reports to the orchestrator

---

## Why stateless?

1. **Horizontal scaling** — spin up more workers without worrying about state sync
2. **Fault tolerance** — if an agent crashes, restart it and replay the messages
3. **Deterministic testing** — given the same input messages, the agent should behave identically
4. **Simplicity** — no distributed state to manage, no consensus algorithms

All state lives in two places:
- **Redis Streams** — the conversation history (ephemeral)
- **Redis JSON** — shared working memory for the swarm

---

## Tools

Agents can be given tools — functions they can call during their Think-Act loop:

| Tool | What it does |
|------|-------------|
| `web_search` | Search the web (Exa, Tavily, or SerpAPI) |
| `run_python` | Execute Python code in a sandbox |
| `read_file` | Read a file from the workspace |
| `write_file` | Write a file to the workspace |
| `api_call` | Make HTTP calls to external APIs |
| `delegate` | Send a sub-task to another agent |

Tools are defined with a name, description, and JSON Schema for parameters.
The LLM decides when to call them.

---

## Spawning new agents

A powerful feature: **agents can create other agents**.

If a manager agent realizes it needs a specialist that doesn't exist yet (e.g.,
a "legal expert" for a research task), it can spawn one dynamically. This
means swarm size adapts to the task, not the other way around.

---

## Next

- **[Communication Topologies](/concepts/communication-topologies/)** — how agents talk to each other
- **[Cost Routing](/concepts/cost-routing/)** — how we pick the right model for each agent
