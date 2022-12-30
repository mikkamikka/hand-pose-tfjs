import * as THREE from 'three'

export const Calculations = {
  rotateMatrix: (m, q) => {
    // the function for calculating the matrix, no need to touch it, it just has to lie here
    // Precalculate coordinate products
    var x = q.x * 2.0
    var y = q.y * 2.0
    var z = q.z * 2.0
    var xx = q.x * x
    var yy = q.y * y
    var zz = q.z * z
    var xy = q.x * y
    var xz = q.x * z
    var yz = q.y * z
    var wx = q.w * x
    var wy = q.w * y
    var wz = q.w * z

    m.m00 = 1.0 - (yy + zz)
    m.m10 = xy + wz
    m.m20 = xz - wy
    m.m30 = 0.0
    m.m01 = xy - wz
    m.m11 = 1.0 - (xx + zz)
    m.m21 = yz + wx
    m.m31 = 0.0
    m.m02 = xz + wy
    m.m12 = yz - wx
    m.m22 = 1.0 - (xx + yy)
    m.m32 = 0.0
    m.m03 = 0.0
    m.m13 = 0.0
    m.m23 = 0.0
    m.m33 = 1.0
    return m
  },

  multiplyMatrices: (lhs, rhs) => {
    // the function for calculating the matrix, no need to touch it, it just has to lie here
    var res = new THREE.Matrix4()
    res.m00 = lhs.m00 * rhs.m00 + lhs.m01 * rhs.m10 + lhs.m02 * rhs.m20 + lhs.m03 * rhs.m30
    res.m01 = lhs.m00 * rhs.m01 + lhs.m01 * rhs.m11 + lhs.m02 * rhs.m21 + lhs.m03 * rhs.m31
    res.m02 = lhs.m00 * rhs.m02 + lhs.m01 * rhs.m12 + lhs.m02 * rhs.m22 + lhs.m03 * rhs.m32
    res.m03 = lhs.m00 * rhs.m03 + lhs.m01 * rhs.m13 + lhs.m02 * rhs.m23 + lhs.m03 * rhs.m33

    res.m10 = lhs.m10 * rhs.m00 + lhs.m11 * rhs.m10 + lhs.m12 * rhs.m20 + lhs.m13 * rhs.m30
    res.m11 = lhs.m10 * rhs.m01 + lhs.m11 * rhs.m11 + lhs.m12 * rhs.m21 + lhs.m13 * rhs.m31
    res.m12 = lhs.m10 * rhs.m02 + lhs.m11 * rhs.m12 + lhs.m12 * rhs.m22 + lhs.m13 * rhs.m32
    res.m13 = lhs.m10 * rhs.m03 + lhs.m11 * rhs.m13 + lhs.m12 * rhs.m23 + lhs.m13 * rhs.m33

    res.m20 = lhs.m20 * rhs.m00 + lhs.m21 * rhs.m10 + lhs.m22 * rhs.m20 + lhs.m23 * rhs.m30
    res.m21 = lhs.m20 * rhs.m01 + lhs.m21 * rhs.m11 + lhs.m22 * rhs.m21 + lhs.m23 * rhs.m31
    res.m22 = lhs.m20 * rhs.m02 + lhs.m21 * rhs.m12 + lhs.m22 * rhs.m22 + lhs.m23 * rhs.m32
    res.m23 = lhs.m20 * rhs.m03 + lhs.m21 * rhs.m13 + lhs.m22 * rhs.m23 + lhs.m23 * rhs.m33

    res.m30 = lhs.m30 * rhs.m00 + lhs.m31 * rhs.m10 + lhs.m32 * rhs.m20 + lhs.m33 * rhs.m30
    res.m31 = lhs.m30 * rhs.m01 + lhs.m31 * rhs.m11 + lhs.m32 * rhs.m21 + lhs.m33 * rhs.m31
    res.m32 = lhs.m30 * rhs.m02 + lhs.m31 * rhs.m12 + lhs.m32 * rhs.m22 + lhs.m33 * rhs.m32
    res.m33 = lhs.m30 * rhs.m03 + lhs.m31 * rhs.m13 + lhs.m32 * rhs.m23 + lhs.m33 * rhs.m33

    return res
  },

  translate: (vector) => {
    // the function for calculating the matrix, no need to touch it, it just has to lie here
    const m = new THREE.Matrix4()
    m.m00 = 1
    m.m01 = 0
    m.m02 = 0
    m.m03 = vector.x
    m.m10 = 0
    m.m11 = 1
    m.m12 = 0
    m.m13 = vector.y
    m.m20 = 0
    m.m21 = 0
    m.m22 = 1
    m.m23 = vector.z
    m.m30 = 0
    m.m31 = 0
    m.m32 = 0
    m.m33 = 1
    return m
  },

  invertMatrix: (MatrixS) => {
    // the function for calculating the matrix, no need to touch it, it just has to lie here

    const te = MatrixS.elements,
      n11 = te[0],
      n21 = te[1],
      n31 = te[2],
      n41 = te[3],
      n12 = te[4],
      n22 = te[5],
      n32 = te[6],
      n42 = te[7],
      n13 = te[8],
      n23 = te[9],
      n33 = te[10],
      n43 = te[11],
      n14 = te[12],
      n24 = te[13],
      n34 = te[14],
      n44 = te[15],
      t11 =
        n23 * n34 * n42 -
        n24 * n33 * n42 +
        n24 * n32 * n43 -
        n22 * n34 * n43 -
        n23 * n32 * n44 +
        n22 * n33 * n44,
      t12 =
        n14 * n33 * n42 -
        n13 * n34 * n42 -
        n14 * n32 * n43 +
        n12 * n34 * n43 +
        n13 * n32 * n44 -
        n12 * n33 * n44,
      t13 =
        n13 * n24 * n42 -
        n14 * n23 * n42 +
        n14 * n22 * n43 -
        n12 * n24 * n43 -
        n13 * n22 * n44 +
        n12 * n23 * n44,
      t14 =
        n14 * n23 * n32 -
        n13 * n24 * n32 -
        n14 * n22 * n33 +
        n12 * n24 * n33 +
        n13 * n22 * n34 -
        n12 * n23 * n34
    const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14
    if (det === 0) return MatrixS.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
    const detInv = 1 / det
    te[0] = t11 * detInv
    te[1] =
      (n24 * n33 * n41 -
        n23 * n34 * n41 -
        n24 * n31 * n43 +
        n21 * n34 * n43 +
        n23 * n31 * n44 -
        n21 * n33 * n44) *
      detInv
    te[2] =
      (n22 * n34 * n41 -
        n24 * n32 * n41 +
        n24 * n31 * n42 -
        n21 * n34 * n42 -
        n22 * n31 * n44 +
        n21 * n32 * n44) *
      detInv
    te[3] =
      (n23 * n32 * n41 -
        n22 * n33 * n41 -
        n23 * n31 * n42 +
        n21 * n33 * n42 +
        n22 * n31 * n43 -
        n21 * n32 * n43) *
      detInv
    te[4] = t12 * detInv
    te[5] =
      (n13 * n34 * n41 -
        n14 * n33 * n41 +
        n14 * n31 * n43 -
        n11 * n34 * n43 -
        n13 * n31 * n44 +
        n11 * n33 * n44) *
      detInv
    te[6] =
      (n14 * n32 * n41 -
        n12 * n34 * n41 -
        n14 * n31 * n42 +
        n11 * n34 * n42 +
        n12 * n31 * n44 -
        n11 * n32 * n44) *
      detInv
    te[7] =
      (n12 * n33 * n41 -
        n13 * n32 * n41 +
        n13 * n31 * n42 -
        n11 * n33 * n42 -
        n12 * n31 * n43 +
        n11 * n32 * n43) *
      detInv
    te[8] = t13 * detInv
    te[9] =
      (n14 * n23 * n41 -
        n13 * n24 * n41 -
        n14 * n21 * n43 +
        n11 * n24 * n43 +
        n13 * n21 * n44 -
        n11 * n23 * n44) *
      detInv
    te[10] =
      (n12 * n24 * n41 -
        n14 * n22 * n41 +
        n14 * n21 * n42 -
        n11 * n24 * n42 -
        n12 * n21 * n44 +
        n11 * n22 * n44) *
      detInv
    te[11] =
      (n13 * n22 * n41 -
        n12 * n23 * n41 -
        n13 * n21 * n42 +
        n11 * n23 * n42 +
        n12 * n21 * n43 -
        n11 * n22 * n43) *
      detInv
    te[12] = t14 * detInv
    te[13] =
      (n13 * n24 * n31 -
        n14 * n23 * n31 +
        n14 * n21 * n33 -
        n11 * n24 * n33 -
        n13 * n21 * n34 +
        n11 * n23 * n34) *
      detInv
    te[14] =
      (n14 * n22 * n31 -
        n12 * n24 * n31 -
        n14 * n21 * n32 +
        n11 * n24 * n32 +
        n12 * n21 * n34 -
        n11 * n22 * n34) *
      detInv
    te[15] =
      (n12 * n23 * n31 -
        n13 * n22 * n31 +
        n13 * n21 * n32 -
        n11 * n23 * n32 -
        n12 * n21 * n33 +
        n11 * n22 * n33) *
      detInv
    return te
  },

  scaleMatrix: (vector) => {
    // the function for calculating the matrix, no need to touch it, it just has to lie here
    const m = new THREE.Matrix4()
    m.m00 = vector.x
    m.m01 = 0
    m.m02 = 0
    m.m03 = 0
    m.m10 = 0
    m.m11 = vector.y
    m.m12 = 0
    m.m13 = 0
    m.m20 = 0
    m.m21 = 0
    m.m22 = vector.z
    m.m23 = 0
    m.m30 = 0
    m.m31 = 0
    m.m32 = 0
    m.m33 = 1
    return m
  },
}
