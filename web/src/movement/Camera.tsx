import { Component } from 'react';
import throttle from 'lodash.throttle';
import { connect } from 'react-redux';
import { actionCreators, type TurnstileActions } from '../store/actions';
import { VerificationMethods } from '../store';
import { Scanner } from './Scanner';
import { beep } from './beep';
import Status from './Status';
import { DetectedBarcode } from './detected-barcode';
import { Container } from '@mui/material';
import './Camera.css';

class Camera extends Component<TurnstileActions> {
  constructor(props: TurnstileActions) {
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

export default connect(() => ({}), actionCreators)(Camera);
