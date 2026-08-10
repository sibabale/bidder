---
name: logging
description: How logging is structured in this app — client-side logger utility, server-side console conventions, log format, and what belongs where.
---

# Logging

This app has two separate runtimes with different logging strategies: a Next.js client (`/client`) and an Express server (`/server`).

---

## When to log

Every major function — route handlers, middleware, cron jobs, hooks, and async operations — **must** log at these points:

1. **Entry** — when the function is entered and execution begins
2. **Branches / critical logic** — when taking a significant code path (e.g. guard clauses, early returns, status decisions)
3. **Exit (success)** — when the function completes normally
4. **Catch (error)** — in every `catch` block

Simple utilities (pure transformers, formatters, selectors) do not need logging.

```js
// ✅ Entry
console.log(`[login] starting login... ${JSON.stringify({ email })}`)

// ✅ Branch
console.log(`[login] firebase auth error, code: auth/invalid-credential... ${JSON.stringify({ email })}`)

// ✅ Success exit
console.log(`[login] login successful... ${JSON.stringify({ email, uid })}`)

// ✅ Catch
console.error(`[login] unexpected error... ${JSON.stringify({ email, error: error.message })}`)
```

---

## What NOT to log (PII & secrets)

Never log any of the following — even in development:

- **Passwords** or password hashes
- **JWT tokens** or session tokens (full or partial)
- **Full names** — first/last name individually is acceptable in server logs only when operationally necessary (e.g. buyer assignment), but never combined with other identifiers
- **ID document numbers**, national IDs, or any government-issued identifiers
- **Bank or payment details**
- **Phone numbers**
- **IP addresses** in combination with user identifiers
- **Full error stack traces** — use `error.message` only

```js
// ❌ Never do this
console.log(`[register] user: ${JSON.stringify({ password, token, idNumber })}`)

// ✅ Safe metadata
console.log(`[register] user registered... ${JSON.stringify({ email, uid })}`)
```

---

## Client-side logging (`/client`)

### Logger utility

All client-side debug logs go through the logger utility at [`client/src/lib/logger.js`](/client/src/lib/logger.js). Never use `console.log` directly in client code.

```js
import logger from '@/lib/logger'

logger.log('[login] starting login...', { email })   // dev only
logger.warn('[login] token missing')                  // dev only
logger.error('[login] unexpected error', error)       // always logged
```

### Why

`console.log` is visible in browser DevTools in production. The logger guards against this:

```js
const isDev = process.env.NODE_ENV === 'development'

const logger = {
    log: (...args) => isDev && console.log(...args),   // silenced in production
    warn: (...args) => isDev && console.warn(...args), // silenced in production
    error: (...args) => console.error(...args),        // always logs (for monitoring)
}
```

### Rules

- Use `logger.log` for flow checkpoints (entry, branches, success exit)
- Use `logger.warn` for non-critical anomalies
- Use `logger.error` for caught errors — these always show, so keep messages user-safe (no stack traces or sensitive data)
- Never use `console.log`, `console.warn`, or `console.error` directly in client components, pages, or hooks

---

## Server-side logging (`/server`)

Server logs go to stdout (visible only in your terminal or Vercel log drain, never in the browser). Use plain `console.log` and `console.error` directly — no utility needed.

```js
console.log(`[login] starting login... ${JSON.stringify({ email })}`)
console.log(`[login] validation passed... ${JSON.stringify({ email })}`)
console.log(`[login] firebase auth successful... ${JSON.stringify({ email, uid })}`)
console.log(`[login] login successful... ${JSON.stringify({ email, uid })}`)
console.error(`[login] unexpected error... ${JSON.stringify({ email, error: error.message })}`)
```

### Rules

- Use `console.log` for all step checkpoints (entry, branch, success)
- Use `console.error` only in `catch` blocks for unexpected/unhandled errors
- Never log passwords, tokens, or full error stack traces
- Never log PII beyond what is operationally required (see "What NOT to log" above)

---

## Log format

Both client and server follow the same format:

```
[<module>] <action>... <JSON metadata>
```

| Part | Example |
|---|---|
| Module | `[login]`, `[register]`, `[register/verify]`, `[register/kyc]`, `[bids/create]`, `[cron/setBuyer]` |
| Action | `starting login`, `validation passed`, `login successful`, `unexpected error` |
| Metadata | `{ email, uid }` — include only what is useful, never passwords or tokens |

### Checkpoint pattern

Every function that hits the network, auth, or database must log at least:

```js
// Entry
logger.log(`[module] starting <action>... ${JSON.stringify(meta)}`)

// Branch (if applicable)
logger.log(`[module] <branch condition>... ${JSON.stringify(meta)}`)

// Success exit
logger.log(`[module] <action> successful... ${JSON.stringify(meta)}`)

// Catch
logger.error(`[module] unexpected error... ${JSON.stringify({ ...meta, error: error.message })}`)
```

---

## Example: login flow

### Client (`login/page.jsx`)

```js
import logger from '@/lib/logger'

mutationFn: async (values) => {
    logger.log(`[login] starting login... ${JSON.stringify({ email: values.email })}`)
    const response = await axios.post(`${BASE_URL}/api/login`, values)
    logger.log(`[login] login successful... ${JSON.stringify({ email: values.email })}`)
    return response.data.user
},
onError: (error) => {
    if (error.response) {
        logger.log(`[login] login failed... ${JSON.stringify({ status: error.response.status })}`)
    } else {
        logger.error(`[login] unexpected error... ${JSON.stringify({ message: error.message })}`)
    }
}
```

### Server (`routes/auth/login.js`)

```js
console.log(`[login] starting login... ${JSON.stringify({ email })}`)
console.log(`[login] validation passed... ${JSON.stringify({ email })}`)
console.log(`[login] firebase auth successful... ${JSON.stringify({ email, uid })}`)
console.log(`[login] login successful... ${JSON.stringify({ email, uid })}`)
console.error(`[login] unexpected error... ${JSON.stringify({ email, error: error.message })}`)
```

## Example: bid placement

### Server (`routes/bids/create.js`)

```js
console.log(`[bids/create] starting bid placement... ${JSON.stringify({ productId, amount })}`)
console.log(`[bids/create] checking product exists... ${JSON.stringify({ productId })}`)
// branch
console.log(`[bids/create] bidding not allowed for product status/time... ${JSON.stringify({ productId, status })}`)
// success
console.log(`[bids/create] bid placed and published successfully... ${JSON.stringify({ productId, amount })}`)
// catch
console.error(`[bids/create] unexpected error... ${JSON.stringify({ error: error.message })}`)
```
