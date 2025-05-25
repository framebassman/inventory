import { Component } from 'react';
import { MovementOnHold } from './MovementOnHold';
import Camera from './Camera';
import './index.css';

type State = {
  scanning: boolean;
};

export class Movement extends Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      scanning: false
    };
    this._toggle = this._toggle.bind(this);
  }

  _toggle() {
    this.setState({ scanning: !this.state.scanning });
  }

  render() {
    const { scanning } = this.state;
    return (
      <>{scanning ? <Camera /> : <MovementOnHold onClick={this._toggle} />}</>
    );
  }
}
