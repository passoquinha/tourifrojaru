// Spatially batch the static GLB after its original meshes have been used to
// build collision boxes. Keep transparent, animated and unsupported meshes intact.
export function batchCampus(root, { BufferGeometry, BufferAttribute, Mesh, Group, Vector3, Matrix4, MeshStandardMaterial }) {
  root.updateMatrixWorld(true);
  const inverseRoot = new Matrix4().copy(root.matrixWorld).invert();
  const batches = new Map();
  const sources = [];
  const simplifiedMaterials = new Map();
  const cellSize = 48;
  root.traverse(mesh => {
    if (!mesh.isMesh || !mesh.visible || mesh.isSkinnedMesh || mesh.morphTargetInfluences || mesh.children.length) return;
    for (let parent = mesh.parent; parent && parent !== root; parent = parent.parent) if (!parent.visible) return;
    const geometry = mesh.geometry;
    const position = geometry.getAttribute('position');
    const normal = geometry.getAttribute('normal');
    if (!position || !normal || geometry.morphAttributes.position || geometry.drawRange.start !== 0 || geometry.drawRange.count !== Infinity) return;
    // The campus currently contains only position and normal attributes. Do not
    // silently discard UVs, vertex colors or other attributes in future models.
    if (Object.keys(geometry.attributes).some(name => name !== 'position' && name !== 'normal')) return;
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    if (materials.some(m => !m || !m.isMeshStandardMaterial || m.transparent || m.opacity !== 1 || m.vertexColors || m.emissiveIntensity && (m.emissive.r || m.emissive.g || m.emissive.b) || Object.keys(m).some(key => key.endsWith('Map') && m[key]) || m.map)) return;
    const index = geometry.index;
    const count = index ? index.count : position.count;
    const groups = Array.isArray(mesh.material) ? geometry.groups : [{ start: 0, count, materialIndex: 0 }];
    if (!groups.length || groups.some(g => !materials[g.materialIndex] || g.start % 3 || g.count % 3 || g.start + g.count > count)) return;
    // Refuse partial or overlapping groups: hiding the original must never lose geometry.
    const ordered = [...groups].sort((a, b) => a.start - b.start);
    let end = 0;
    for (const group of ordered) { if (group.start !== end) return; end += group.count; }
    if (end !== count) return;
    const transform = new Matrix4().multiplyMatrices(inverseRoot, mesh.matrixWorld);
    if (!geometry.boundingBox) geometry.computeBoundingBox();
    const center = geometry.boundingBox.getCenter(new Vector3()).applyMatrix4(transform);
    const cell = `${Math.floor(center.x / cellSize)},${Math.floor(center.z / cellSize)}`;
    for (const group of groups) {
      const material = materials[group.materialIndex];
      // Bake the base color into vertices and share one inexpensive Lambert
      // material per face mode. This trades per-material roughness for fewer draws.
      const key = `${cell}:${material.side}`;
      if (!simplifiedMaterials.has(material.side)) simplifiedMaterials.set(material.side, new MeshStandardMaterial({ vertexColors: true, side: material.side, roughness: 0.9, metalness: 0 }));
      if (!batches.has(key)) batches.set(key, { material: simplifiedMaterials.get(material.side), parts: [], count: 0 });
      const batch = batches.get(key);
      batch.parts.push({ geometry, transform, color: material.color, start: group.start, count: group.count });
      batch.count += group.count;
    }
    sources.push(mesh);
  });
  const output = new Group();
  output.name = 'Campus spatial batches';
  let drawCalls = 0;
  for (const batch of batches.values()) {
    const positions = new Float32Array(batch.count * 3);
    const normals = new Float32Array(batch.count * 3);
    const colors = new Float32Array(batch.count * 3);
    let offset = 0;
    for (const part of batch.parts) {
      // applyMatrix4 also transforms normals using the inverse transpose.
      const transformed = part.geometry.clone().applyMatrix4(part.transform);
      const p = transformed.getAttribute('position'), n = transformed.getAttribute('normal');
      const index = transformed.index;
      const mirrored = part.transform.determinant() < 0;
      for (let i = 0; i < part.count; i++) {
        const triangleIndex = mirrored ? i - i % 3 + (i % 3 === 1 ? 2 : i % 3 === 2 ? 1 : 0) : i;
        const vertex = index ? index.getX(part.start + triangleIndex) : part.start + triangleIndex;
        positions[offset] = p.getX(vertex); normals[offset] = n.getX(vertex); colors[offset++] = part.color.r;
        positions[offset] = p.getY(vertex); normals[offset] = n.getY(vertex); colors[offset++] = part.color.g;
        positions[offset] = p.getZ(vertex); normals[offset] = n.getZ(vertex); colors[offset++] = part.color.b;
      }
      transformed.dispose();
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    geometry.setAttribute('normal', new BufferAttribute(normals, 3));
    geometry.setAttribute('color', new BufferAttribute(colors, 3));
    geometry.computeBoundingSphere();
    output.add(new Mesh(geometry, batch.material));
    drawCalls++;
  }
  // Collision boxes were built from the originals before this function ran.
  // Detach only after all batches are built, keeping shared unsupported geometry.
  const batched = new Set(sources);
  const retainedGeometry = new Set();
  root.traverse(object => { if (object.isMesh && !batched.has(object)) retainedGeometry.add(object.geometry); });
  const discardedGeometry = new Set();
  for (const source of sources) {
    source.parent.remove(source);
    if (!retainedGeometry.has(source.geometry)) discardedGeometry.add(source.geometry);
  }
  for (const geometry of discardedGeometry) geometry.dispose();
  root.add(output);
  console.info(`[Performance] ${sources.length} malhas agrupadas em ${drawCalls} lotes espaciais`);
  return { meshes: sources.length, batches: drawCalls };
}

export function lowPowerPixelRatio() {
  return Math.min(window.devicePixelRatio || 1, 1, 640 / window.innerWidth, 480 / window.innerHeight);
}
