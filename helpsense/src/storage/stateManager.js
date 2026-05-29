const fs = require('fs');
const path = require('path');

class StateManager {
  /**
   * @param {import('electron').App} app
   */
  constructor(app) {
    this.app = app;
  }

  statePath() {
    return path.join(this.app.getPath('userData'), 'helpsense-state.json');
  }

  async load() {
    try {
      return JSON.parse(await fs.promises.readFile(this.statePath(), 'utf8'));
    } catch {
      return null;
    }
  }

  async save(state) {
    await fs.promises.mkdir(this.app.getPath('userData'), { recursive: true });
    await fs.promises.writeFile(this.statePath(), JSON.stringify(state, null, 2), 'utf8');
    return true;
  }
}

module.exports = {
  StateManager
};
