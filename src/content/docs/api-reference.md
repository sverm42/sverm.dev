---
title: API Reference
description: REST API for running and managing AI swarms.
---

Base URL: `https://api.sverm.dev/v1`

All requests require an API key passed as a header:

```http
Authorization: Bearer sk-sverm-...
```

---

## Swarms

### Create and run a swarm

```http
POST /swarms
```

**Request body:**

```json
{
  "template": "research-swarm-v1",
  "task": "Investigate Norwegian hydrogen economy",
  "max_budget_usd": 2.50,
  "webhook_url": "https://my-app.com/swarm-callback"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `template` | Yes | Swarm template ID or inline YAML definition |
| `task` | Yes | The task description |
| `max_budget_usd` | No | Maximum cost for this swarm (default: $5.00) |
| `webhook_url` | No | URL to call when the swarm finishes |

**Response (201):**

```json
{
  "swarm_id": "abc-123-def",
  "status": "running",
  "estimated_cost_usd": 1.20,
  "created_at": "2026-04-27T21:41:00Z"
}
```

---

### Get swarm status

```http
GET /swarms/{swarm_id}
```

**Response:**

```json
{
  "swarm_id": "abc-123-def",
  "status": "running",
  "progress": 0.65,
  "current_cost_usd": 0.45,
  "agents_active": 4,
  "agents_total": 6,
  "created_at": "2026-04-27T21:41:00Z"
}
```

Status values: `running`, `completed`, `failed`, `cancelled`

---

### Get swarm result

```http
GET /swarms/{swarm_id}/result
```

**Response:**

```json
{
  "swarm_id": "abc-123-def",
  "status": "completed",
  "output": "## Norwegian Hydrogen Economy\n\n...",
  "cost_report": {
    "total_usd": 0.067,
    "total_tokens": 16500,
    "agents": [
      {
        "agent_id": "manager",
        "model": "deepseek-v3",
        "cost_usd": 0.012,
        "tokens_in": 2000,
        "tokens_out": 1500
      }
    ]
  },
  "agent_logs": [
    {
      "agent_id": "manager",
      "timestamp": "2026-04-27T21:41:05Z",
      "action": "delegate",
      "target": "researcher-1",
      "summary": "Searching for: ..."
    }
  ],
  "elapsed_seconds": 22.3,
  "created_at": "2026-04-27T21:41:00Z",
  "completed_at": "2026-04-27T21:41:22Z"
}
```

---

### Cancel a swarm

```http
DELETE /swarms/{swarm_id}
```

**Response (200):**

```json
{
  "swarm_id": "abc-123-def",
  "status": "cancelled",
  "cost_usd": 0.023
}
```

---

## Templates

### List available templates

```http
GET /templates
```

**Response:**

```json
{
  "templates": [
    {
      "id": "research-swarm-v1",
      "name": "Research Swarm",
      "description": "Investigates a topic and produces a report",
      "topology": "hierarchical",
      "estimated_cost_range": "$0.05 - $0.50"
    }
  ]
}
```

### Get template definition

```http
GET /templates/{template_id}
```

Returns the full YAML definition of the template.

---

## Cost & usage

### Get current usage

```http
GET /usage
```

**Response:**

```json
{
  "current_month": {
    "total_usd": 12.45,
    "total_swarms": 87,
    "total_tokens": 2450000,
    "by_swarm_type": {
      "research-swarm-v1": { "count": 45, "total_usd": 3.15 },
      "code-review-swarm-v1": { "count": 30, "total_usd": 5.20 },
      "writing-swarm-v1": { "count": 12, "total_usd": 4.10 }
    }
  }
}
```

---

## Rate limits

| Tier | Requests/minute | Swarms concurrent | Swarms/day |
|------|----------------|-------------------|------------|
| Free | 10 | 2 | 50 |
| Pro | 60 | 10 | 500 |
| Team | 300 | 50 | Unlimited |

Rate limit headers are included in every response:

```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 47
X-RateLimit-Reset: 1714254120
```

---

## Errors

All errors follow this format:

```json
{
  "error": {
    "code": "budget_exceeded",
    "message": "Swarm cost would exceed maximum budget of $2.50",
    "details": {
      "budget": 2.50,
      "estimated_cost": 3.10
    }
  }
}
```

**Common error codes:**

| Code | HTTP | Description |
|------|------|-------------|
| `invalid_request` | 400 | Malformed request body |
| `unauthorized` | 401 | Missing or invalid API key |
| `not_found` | 404 | Swarm or template not found |
| `budget_exceeded` | 422 | Task exceeds cost budget |
| `rate_limited` | 429 | Too many requests |
| `internal_error` | 500 | Something went wrong on our end |
