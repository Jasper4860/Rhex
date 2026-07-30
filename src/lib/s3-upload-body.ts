/**
 * Some S3-compatible gateways reject streamed PutObject bodies with 411 even
 * when the SDK receives ContentLength. Materialize only the remote-upload
 * body so the request has a concrete, non-chunked payload.
 */
export async function resolveS3UploadBody(file: File, preparedBuffer: Buffer | null) {
  return preparedBuffer ?? Buffer.from(await file.arrayBuffer())
}
