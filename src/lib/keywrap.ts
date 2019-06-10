import crypto from 'crypto'

const wrapKey = (key: string | Buffer, kek: string | Buffer): Buffer | undefined => {
  if (typeof key === 'string') {
    key = Buffer.from(key, 'hex')
  }
  if (typeof kek === 'string') {
    kek = Buffer.from(kek, 'hex')
  }
  if ((key.length % 8) || (kek.length % 8)) return

  // create a cipher
  const cipher = crypto.createCipheriv('aes-128-ecb', kek, '')

  // Inputs:      Plaintext, n 64-bit values {P1, P2, ..., Pn}, and
  // Key, K (the KEK).
  // Outputs:     Ciphertext, (n+1) 64-bit values {C0, C1, ..., Cn}.
  const n = key.length / 8
  if (n < 1) return

  // 1) Initialize variables.
  //
  //    Set A = IV, an initial value (see 2.2.3)
  //      For i = 1 to n
  //      R[i] = P[i]
  const A = Buffer.from('A6A6A6A6A6A6A6A6', 'hex')
  const R = [A]
  for (let i = 1; i <= n; i++) {
    R[i] = Buffer.alloc(8)
    key.copy(R[i], 0, (i - 1) * 8, i * 8)
  }

  // 2) Calculate intermediate values.
  //
  //    For j = 0 to 5
  //      For i=1 to n
  //        B = AES(K, A | R[i])
  //        A = MSB(64, B) ^ t where t = (n*j)+i
  //        R[i] = LSB(64, B)
  for (let j = 0; j <= 5; j++) {
    for (let i = 1; i <= n; i++) {
      const block = Buffer.concat([A, R[i]])
      const B = cipher.update(block)
      B.copy(A, 0, 0, 8)
      // tslint:disable-next-line: no-bitwise
      A[7] ^= (n * j) + i
      B.copy(R[i], 0, 8, 16)
    }
  }

  // 3) Output the results.
  //
  //    Set C[0] = A
  //    For i = 1 to n
  //      C[i] = R[i]
  return Buffer.concat(R)
}

const unwrapKey = (key: string | Buffer, kek: string | Buffer): Buffer | undefined => {
  if (typeof key === 'string') {
    key = Buffer.from(key, 'hex')
  }
  if (typeof kek === 'string') {
    kek = Buffer.from(kek, 'hex')
  }
  if ((key.length % 8) || (kek.length % 8)) return

  // create a cipher
  const decipher = crypto.createDecipheriv('aes-128-ecb', kek, '')
  decipher.setAutoPadding(false)

  // Inputs:  Ciphertext, (n+1) 64-bit values {C0, C1, ..., Cn}, and
  // Key, K (the KEK).
  // Outputs: Plaintext, n 64-bit values {P0, P1, K, Pn}.
  const n = key.length / 8 - 1
  if (n < 1) return

  // 1) Initialize variables.
  //
  //    Set A = C[0]
  //    For i = 1 to n
  //      R[i] = C[i]
  const A = Buffer.alloc(8)
  key.copy(A, 0, 0, 8)
  const R = [Buffer.alloc(0)]
  for (let i = 1; i <= n; i++) {
    R[i] = Buffer.alloc(8)
    key.copy(R[i], 0, i * 8, (i + 1) * 8)
  }

  // 2) Compute intermediate values.
  //
  //    For j = 5 to 0
  //     For i = n to 1
  //       B = AES-1(K, (A ^ t) | R[i]) where t = n*j+i
  //       A = MSB(64, B)
  //       R[i] = LSB(64, B)
  for (let j = 5; j >= 0; j--) {
    for (let i = n; i >= 1; i--) {
      // tslint:disable-next-line: no-bitwise
      A[7] ^= (n * j) + i
      const block = Buffer.concat([A, R[i]])
      const B = decipher.update(block)
      B.copy(A, 0, 0, 8)
      B.copy(R[i], 0, 8, 16)
    }
  }

  // 3) Output results.
  //
  //    If A is an appropriate initial value (see 2.2.3),
  //    Then
  //      For i = 1 to n
  //        P[i] = R[i]
  //    Else
  //      Return an error
  let ivIsValid = true // compare in constant time
  for (let i = 0; i < 8; i++) {
    if (A[i] !== 0xA6) {
      ivIsValid = false
    }
  }
  if (!ivIsValid) return undefined
  return Buffer.concat(R)
}

export default {
  unwrapKey,
  wrapKey
}
