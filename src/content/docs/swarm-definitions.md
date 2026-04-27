---
title: Swarm Definitions
description: The YAML format for defining swarms — every field explained with examples.
---

Swarms are defined in YAML. A swarm definition specifies the topology, agents,
and budget for a swarm that can be instantiated via the CLI or API.

---

## Full example

```yaml
# A research swarm that investigates a topic and writes a report
swarm_id: research-swarm-v1
name: Research Swarm
description: >
  Investigates a topic thoroughly and produces a fact-based report.
  Uses parallel research + fact-checking + Norwegian report writing.

topology: hierarchical

agents:
  - id: manager
    role: Research Manager
    model:
      primary: deepseek-v3
      fallback: gpt-4o-mini
    temperature: 0.3
    system_prompt: |
      You are a research manager. Your job:
      1. Analyze the research question
      2. Break it into 2-4 subtopics
      3. Send each to a researcher
      4. Collect results and send to fact-checker
      5. Send verified findings to writer
      6. Return the finished report
    tools: [delegate]

  - id: researcher
    role: Researcher
    instances: 3
    model: deepseek-v3
    temperature: 0.7
    system_prompt: |
      You are a thorough researcher. When you receive a subtopic:
      1. Search with web_search
      2. Be source-critical
      3. Structure findings: main points, sources, uncertainties
      Write in the target language. Be precise.
    tools: [web_search]
    max_tokens: 8192

  - id: fact_checker
    role: Fact Checker
    model: gpt-4o-mini
    temperature: 0.1
    system_prompt: |
      Verify every claim. Mark as {CONFIRMED}, {LIKELY}, or {UNCERTAIN}.
    tools: [web_search]

  - id: writer
    role: Report Writer
    model: deepseek-v3
    temperature: 0.7
    system_prompt: |
      Write a well-structured report in the target language.
    tools: []

cost_budget:
  max_total_usd: 2.50
  max_per_agent_usd: 0.80
```

---

## Top-level fields

| Field | Required | Description |
|-------|----------|-------------|
| `swarm_id` | Yes | Unique identifier, used in API calls |
| `name` | No | Human-readable name |
| `description` | No | What this swarm does and when to use it |
| `topology` | Yes | `sequential`, `parallel`, `debate`, or `hierarchical` |
| `agents` | Yes | List of agent definitions (see below) |
| `cost_budget` | No | Spending limits for this swarm |

---

## Agent fields

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `id` | Yes | — | Unique within this swarm |
| `role` | Yes | — | What the agent does (shown in logs) |
| `model` | Yes | — | String (`"deepseek-v3"`) or object with `primary`/`fallback` |
| `instances` | No | `1` | How many copies of this agent to spawn (for parallel work) |
| `temperature` | No | `0.7` | LLM creativity (0.0 = deterministic, 1.0 = creative) |
| `max_tokens` | No | `4096` | Maximum tokens per LLM response |
| `system_prompt` | No | `""` | Core instructions for the agent |
| `tools` | No | `[]` | List of tool names available to this agent |

---

## Model definition

### Simple (single model)

```yaml
model: deepseek-v3
```

### With fallback

```yaml
model:
  primary: deepseek-v3
  fallback: gpt-4o-mini   # Used if primary fails or is overloaded
```

The fallback is used automatically when the primary model returns an error
(rate limit, overload, timeout). The cost router also considers the fallback
when choosing a model to fit within budget.

---

## Tools reference

| Tool | Description |
|------|-------------|
| `web_search` | Search the web via Exa, Tavily, or SerpAPI |
| `run_python` | Execute Python in an isolated sandbox |
| `read_file` | Read a file from the workspace |
| `write_file` | Write a file to the workspace |
| `api_call` | Make HTTP requests to external APIs |
| `delegate` | Send a subtask to another agent |

---

## Using swarm definitions

### CLI

```bash
sverm run --definition research-swarm.yaml "Investigate X"
```

### API

```http
POST /api/v1/swarms
Content-Type: application/json

{
  "template": "research-swarm-v1",
  "task": "Investigate Norwegian hydrogen economy",
  "max_budget_usd": 2.50
}
```

---

## Built-in templates

Sverm ships with these templates:

| Template | Topology | Description |
|----------|----------|-------------|
| `research-swarm-v1` | Hierarchical | Research any topic and produce a report |
| `code-review-swarm-v1` | Parallel | Review code from multiple angles (security, perf, style) |
| `writing-swarm-v1` | Sequential | Write → critique → polish creative text |
| `debate-swarm-v1` | Debate | Two sides argue, a judge evaluates |
