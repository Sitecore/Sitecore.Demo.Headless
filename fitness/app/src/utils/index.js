export const canUseDOM = !!(
  typeof window !== "undefined" &&
  window.document &&
  window.document.createElement
);

export const getUrlParams = (search = ``) => {
  if (!search) {
    return {};
  }
  let hashes = search.slice(search.indexOf("?") + 1).split("&");
  let params = {};
  hashes.each(hash => {
    let [key, val] = hash.split("=");
    params[key] = decodeURIComponent(val);
  });

  return params;
};

export const getRawFieldValue = (field, defaultValue) => {
  if (!field || !field.value) {
    return defaultValue;
  }
  return field.value;
};

export function required() {
  throw new Error('Missing parameter');
}