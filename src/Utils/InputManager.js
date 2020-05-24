export default class InputManager {
  static isKeyDown = {};
  static wasPressedThisFrame = {};
  static _onKeyPress = event => {
    event.stopPropagation();
    if (event.repeat) return;
    this.isKeyDown[event.code] = true;
    this.wasPressedThisFrame[event.code] = true;
  }
  static _onKeyRelease = event => {
    event.stopPropagation();
    delete this.isKeyDown[event.code];
  }
  static onNextFrame = () => {
    this.wasPressedThisFrame = {};
  }
  static register() {
    document.addEventListener('keydown', this._onKeyPress);
    document.addEventListener('keyup', this._onKeyRelease);
  }
  static unregister() {
    document.removeEventListener('keydown', this._onKeyPress);
    document.removeEventListener('keyup', this._onKeyRelease);
  }
}