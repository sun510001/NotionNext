
/**
 * Normalize Notion record maps back to the structure expected by `react-notion-x`.
 * Some newer Notion responses wrap entries multiple times, for example:
 * `{ spaceId: { id: { value: {...} } } }`.
 *
 * The renderer still expects first-level records such as `block`, `collection`
 * and `collection_view` to look like `{ value: {...} }`, so we unwrap the extra
 * nesting while preserving the outer `value` container.
 *
 * @param {*} blockMap
 * @returns
 */
export function adapterNotionBlockMap(blockMap) {
  if (!blockMap || typeof blockMap !== 'object') {
    return blockMap
  }

  const normalized = {}

  for (const [key, map] of Object.entries(blockMap)) {
    if (!map || typeof map !== 'object' || Array.isArray(map)) {
      normalized[key] = map
      continue
    }

    normalized[key] = normalizeRecordMap(key, map)
  }

  return normalized
}

function normalizeRecordMap(key, map) {
  const normalizedMap = {}

  for (const [id, item] of Object.entries(map)) {
    normalizedMap[id] = normalizeRecordItem(key, item)
  }

  return normalizedMap
}

function normalizeRecordItem(key, item) {
  if (!item || typeof item !== 'object') {
    return item
  }

  const shouldWrapValue =
    RECORD_MAP_KEYS_WITH_VALUE.has(key) &&
    (hasWrappedValue(item) || Object.prototype.hasOwnProperty.call(item, 'value'))

  if (!shouldWrapValue) {
    return item
  }

  return {
    value: unwrapValue(item)
  }
}

function hasWrappedValue(item) {
  return (
    (Object.prototype.hasOwnProperty.call(item, 'spaceId') ||
      Object.prototype.hasOwnProperty.call(item, 'space_id')) &&
    Object.prototype.hasOwnProperty.call(item, 'value')
  )
}

function unwrapValue(obj) {
  let current = obj
  let guard = 0

  while (
    current?.value &&
    typeof current.value === 'object' &&
    !Array.isArray(current.value) &&
    guard < 10
  ) {
    current = current.value
    guard += 1
  }

  return current
}

const RECORD_MAP_KEYS_WITH_VALUE = new Set([
  'block',
  'collection',
  'collection_view',
  'notion_user',
  'space',
  'space_view'
])