import assert from "node:assert/strict"
import test from "node:test"

import { resolveS3UploadBody } from "../src/lib/s3-upload-body"

test("S3 uploads materialize streamed files into a concrete body", async () => {
  const file = {
    arrayBuffer: async () => Uint8Array.from([1, 2, 3, 4]).buffer,
  } as Pick<File, "arrayBuffer">

  const body = await resolveS3UploadBody(file as File, null)

  assert.ok(Buffer.isBuffer(body))
  assert.deepEqual([...body], [1, 2, 3, 4])
})

test("S3 uploads reuse an already prepared image buffer", async () => {
  const preparedBuffer = Buffer.from("prepared")
  const file = {
    arrayBuffer: async () => {
      throw new Error("file should not be read when a prepared buffer exists")
    },
  } as Pick<File, "arrayBuffer">

  const body = await resolveS3UploadBody(file as File, preparedBuffer)

  assert.strictEqual(body, preparedBuffer)
})
