import React from 'react';
import GameView from './Components/GameView';
import Game from './Models/Game';
import Frame from './Models/Frame';
import InputManager from './Utils/InputManager';

export default class App extends React.Component {
  state = {
    game: null,
  };

  componentDidMount() {
    const fps = 24;
    this.setState({ game: new Game(), frame: new Frame(fps) });
    this._intervalHandle = setInterval(this._onUpdate, 1000 / fps);
    InputManager.register();
  }

  componentWillUnmount() {
    clearInterval(this._intervalHandle);
    InputManager.unregister();
  }

  render() {
    return this.state.game && (
      <GameView game={this.state.game} />
    );
  }

  _onUpdate = () => {
    const frame = new Frame(this.state.frame);
    // console.log((frame.realDeltaTime / frame.fixedDeltaTime).toFixed(1));
    this.state.game.update(frame);
    InputManager.onNextFrame();
    this.setState({ frame });
  }
}
