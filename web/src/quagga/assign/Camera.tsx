import { Component } from 'react';
import throttle from 'lodash.throttle';
import { connect } from 'react-redux';
import { assignActionCreators, type MovementActions } from '../store/actions.ts';
import { VerificationMethods } from '../store';
import { Scanner } from './Scanner.tsx';
import { beep } from '../beep.ts';
import Status from './Status.tsx';
import { DetectedBarcode } from '../detected-barcode.ts';
import { Container } from '@mui/material';
import './Camera.css';

class Camera extends Component<MovementActions> {
  constructor(props: MovementActions) {
    super(props);
    this._onDetected = throttle(this._onDetected.bind(this), 3000, {
      trailing: false
    });
  }

  _onDetected(detectedBarcode: DetectedBarcode) {
    beep();
    const { code } = detectedBarcode.codeResult;
    this.props.verify(code, VerificationMethods.Barcode);
  }

  render() {
    return (
      <Container className="camera-container">
        <Status />
        <Scanner onDetected={this._onDetected} />
      </Container>
    );
  }
}

export default connect(() => ({}), assignActionCreators)(Camera);
