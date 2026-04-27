---
title: Memory & Context
description: How agents remember — short-term, working, and long-term memory in swarms.
---

Agents in a swarm have three levels of memory, each with a different purpose
and lifetime.

---

## Short-term memory (context window)

The active conversation — what the LLM can "see" right now.

```
System prompt + last N messages in the conversation
```

- **Lifetime:** One agent session
- **Size:** Up to 128K tokens (DeepSeek-V3), 200K (Claude)
- **Managed by:** The LLM API automatically

Long contexts are expensive. The swarm uses **automatic summarization**:
when the context gets full, older messages are summarized by a cheap
model (L3) and compressed into a single message.

---

## Working memory (shared state)

A Redis JSON document that all agents in a swarm can read and write.

```json
{
  "topic": "Norwegian hydrogen economy",
  "findings": [
    { "source": "researcher-1", "claim": "...", "confidence": 0.9 },
    { "source": "researcher-2", "claim": "...", "confidence": 0.7 }
  ],
  "status": "research_complete",
  "next_step": "fact_check"
}
```

- **Lifetime:** One swarm execution
- **Access:** Read/write by all agents
- **Use for:** Tracking progress, sharing discoveries, coordinating

This is where the swarm's "state of mind" lives. It's ephemeral — gone
when the swarm finishes.

---

## Long-term memory (vector store)

A semantic search index over previous swarm results.

```
Qdrant collection: swarm-memory
├── Embedding of each swarm's final output
├── Metadata: date, swarm type, cost, model used
└── Searchable by semantic similarity
```

- **Lifetime:** Persistent (days, weeks, months)
- **Access:** Read-only (new results are appended)
- **Use for:** "What did we learn about X last time?"

Example: A new research swarm about hydrogen can instantly recall that
a previous swarm already covered "carbon capture" and link to those
findings.

---

## Context window strategy

The default strategy is conservative — start small, expand only when needed:

1. Start with the system prompt + the current task (short context)
2. The agent can ask for "more context" if it needs previous messages
3. Automatic summarization kicks in when approaching the token limit
4. The full conversation is always available via the message bus if needed

This keeps costs low (shorter contexts = cheaper API calls) while ensuring
the agent can access history when it matters.

---

## Visual summary

```
┌─────────────────────────────────────────────────┐
│ SHORT-TERM     │  WORKING       │  LONG-TERM     │
│ (Context)      │  (Redis JSON)  │  (Qdrant)      │
│                │                │                │
│ What the LLM   │  What the      │  What we've     │
│ can see NOW    │  swarm KNOWS   │  LEARNED before │
│                │                │                │
│ ~128K tokens   │  Key-value     │  Vector search  │
│ Per-agent      │  Shared        │  Global         │
│ Ephemeral      │  Per-swarm     │  Persistent     │
└─────────────────────────────────────────────────┘
```
