---
title: Why stateless agents beat stateful ones
description: An architecture defense — why we chose stateless workers for AI swarms.
date: 2026-04-27
---

When designing the sverm agent architecture, we had a choice: stateful or
stateless agents. Stateful agents carry their own memory, maintain local
state, and feel more "agent-like." Every AI agent framework we looked at
took this approach.

We chose stateless. Here's why.

---

## What a stateful agent looks like

A stateful agent is an object that lives in memory:

```python
class StatefulAgent:
    def __init__(self):
        self.memory = []
        self.current_task = None
        self.status = "idle"

    async def run(self, task):
        self.current_task = task
        while self.status != "done":
            response = await self.llm.generate(self.memory + [task])
            self.memory.append(response)
            # ... complex state machine
```

This feels natural. The agent "remembers" things. It has a lifecycle.
It's what most tutorials show you.

**The problems:**

1. **Can't restart.** If the process dies, all memory is lost. No recovery.
2. **Can't scale.** You can't just spin up another instance — it doesn't
   have the first one's memory.
3. **Can't test deterministically.** The agent's behavior depends on its
   internal state, which is hard to set up and even harder to assert against.
4. **Hard to observe.** What is the agent thinking right now? You have to
   instrument the object and hope you catch it at the right moment.

---

## What a stateless agent looks like

A stateless agent is a pure function: messages in, decisions out.

```python
async def stateless_agent(messages: list[dict], tools: list[Tool]) -> AgentThought:
    response = await llm.generate(messages, tools)
    return parse_thought(response)
```

All state lives in the message bus. The agent reads new messages addressed
to it, thinks, and publishes its response. That's it.

**What you get:**

1. **Crash recovery for free.** The agent dies? Restart it. The full
   conversation is in the message bus. Replay the messages, and it picks
   up where it left off.
2. **Horizontal scaling is trivial.** Need more agents? Start more
   processes. They all read from and write to the same message bus.
3. **Testing is deterministic.** Give the agent the same input messages,
   and you get the same output. No setup, no teardown, no mocking internal
   state.
4. **Full observability.** The message bus IS the state. Every thought,
   every tool call, every delegation is a message. You can inspect,
   replay, and audit the entire swarm.

---

## But what about memory?

"But agents need memory!" Yes — but memory doesn't have to be local.

We use two levels of shared memory:
- **Redis Streams** for the conversation history (short-term)
- **Redis JSON** for shared working memory (the swarm's "notes")

Both survive agent restarts. Both are inspectable from outside.

The agent doesn't need to "remember" — it just needs to read what's in
the bus.

---

## The trade-off

Stateless isn't free. Every agent call requires re-reading from the bus.
That means more network calls than a stateful agent that holds everything
in local memory.

But network calls to a local Redis instance cost microseconds. LLM calls
cost seconds. The overhead is negligible.

What you gain — reliability, scalability, testability, observability — is
worth orders of magnitude more than what you pay in Redis round-trips.

---

## What we've learned

After running thousands of swarms:

- **Zero data loss from agent crashes.** The message bus design works.
- **Scaling is boring.** Adding workers is a docker-compose config change.
- **Testing caught bugs we'd never have found otherwise.** Deterministic
  replay of agent conversations found 3 logic errors in our first month.
- **Observability changed how we debug.** Instead of adding log statements
  to agent code, we just query the message bus.

Stateless isn't just a design choice. It's a debugging superpower.

---

*This is the first post in our architecture series. Next: how we built
the cost router that keeps swarms under $0.10.*
