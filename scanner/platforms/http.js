async function fetchText(url, options = {}) {
  const response = await fetch(url, options);
  return {
    response,
    body: await response.text(),
  };
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  let body = {};
  try {
    body = await response.json();
  } catch (error) {
    body = {};
  }
  return { response, body };
}

function makeAbortSignal(ms = 9000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  return { controller, timeout };
}

module.exports = { fetchText, fetchJson, makeAbortSignal };
