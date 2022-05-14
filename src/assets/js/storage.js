import storage from 'good-storage'

export function load(key) {
  return storage.get(key, [])
}

export function save(key, items) {
  storage.set(key, items)
}
