import assert from "node:assert/strict"
import { EventEmitter } from "node:events"
import https from "node:https"
import test from "node:test"

import { isPublicOutboundIp, resolveSafeOutboundTarget, safeOutboundFetch } from "../src/lib/safe-outbound-http"

test("public outbound IP filter rejects internal, link-local, mapped, and reserved targets", () => {
  for (const address of [
    "0.0.0.0", "10.1.2.3", "100.64.0.1", "127.0.0.1", "169.254.169.254",
    "172.16.0.1", "192.168.0.1", "198.18.0.1", "203.0.113.1", "224.0.0.1",
    "::", "::1", "::ffff:127.0.0.1", "fc00::1", "fe80::1",
  ]) {
    assert.equal(isPublicOutboundIp(address), false, address)
  }

  assert.equal(isPublicOutboundIp("8.8.8.8"), true)
  assert.equal(isPublicOutboundIp("2606:4700:4700::1111"), true)
})

test("safe outbound resolver rejects local URL targets before attempting a request", async () => {
  await assert.rejects(() => resolveSafeOutboundTarget("http://127.0.0.1:3000"), /禁止访问|内网|保留/)
  await assert.rejects(() => resolveSafeOutboundTarget("http://[::1]:3000"), /禁止访问|内网|保留/)
  await assert.rejects(() => safeOutboundFetch("http://localhost:3000"), /禁止访问|内网|保留/)
})

test("safe outbound fetch supports Node 20 all-address lookup callbacks", async (t) => {
  const expectedError = new Error("stop after pinned lookup assertion")
  let lookupCalled = false

  t.mock.method(https, "request", ((options: https.RequestOptions) => {
    assert.equal(typeof options.lookup, "function")
    options.lookup?.("1.1.1.1", { all: true }, (error, addresses) => {
      assert.equal(error, null)
      assert.deepEqual(addresses, [{ address: "1.1.1.1", family: 4 }])
      lookupCalled = true
    })

    const request = new EventEmitter() as EventEmitter & {
      destroy: (error?: Error) => void
      end: () => void
    }
    request.destroy = (error) => request.emit("error", error)
    request.end = () => request.emit("error", expectedError)
    return request
  }) as typeof https.request)

  await assert.rejects(() => safeOutboundFetch("https://1.1.1.1"), expectedError)
  assert.equal(lookupCalled, true)
})
