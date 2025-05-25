import Box from '@mui/material/Box';

export const Movement = () => {
  return (
    <Turnstile />
  )
}

import { Component } from 'react';
import { MovementOnHold } from './MovementOnHold';
import Camera from './Camera';

type State = { 
  scanning: boolean;
}

export default class Turnstile extends Component<any, State> {
  constructor(props: any) {
    super(props);
    this.state = {
        scanning: false,
    }
    this._toggle = this._toggle.bind(this);
  }

  _toggle() {
    this.setState({ scanning: !this.state.scanning });
  }

  render() {
    const { scanning } = this.state;

    if (scanning === false) {
      return <MovementOnHold onClick={this._toggle}/>
    } else {
      return <Camera />
    }
  }
}
