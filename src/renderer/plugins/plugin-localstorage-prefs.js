import { usePreferencesStore } from '../stores/usePreferencesStore';

export function pluginLocalStoragePrefs({ store }) {
  if (store.$id === 'prefs') {
    store.$subscribe((mutation, state) => {
      localStorage.setItem(store.$id, JSON.stringify(state));
    });
  }
}

export function loadPrefs() {
  const prefs = usePreferencesStore();

  const data = JSON.parse(localStorage.getItem(prefs.$id));
  if (data !== null) {
    prefs.init(data);
  }
}
