import { Component } from 'react';
import './Scanner.css';
import { DetectedBarcode } from '../detected-barcode.ts';

// @ts-expect-error it is an expected error
import Quagga from 'quagga';

type Props = {
  onDetected: (detectedBarcode: DetectedBarcode) => any
};

export class Scanner extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this._onDetected = this._onDetected.bind(this);
  }

  componentDidMount() {
    Quagga.init({
      inputStream: {
        type : "LiveStream",
        constraints: {
          width: 640,
          height: 480,
          facingMode: "environment", // or user
        }
      },
      locator: {
        patchSize: "medium",
        halfSample: true
      },
      numOfWorkers: navigator.hardwareConcurrency,
      decoder: {
        readers : [ "code_128_reader"],
        debug: {
          drawBoundingBox: true,
          showFrequency: true,
          drawScanline: false,
          showPattern: false
        }
      },
      locate: true,
      frequency: 10,
    }, function(err: any) {
        if (err) {
            return console.log("The following error occurs on Quagga initialization: ", err);
        }
        Quagga.start();
    });
    Quagga.onDetected(this._onDetected);
  }

  componentWillUnmount() {
    Quagga.offDetected(this._onDetected);
  }

  _onDetected(result: any) {
    this.props.onDetected(result);
  }

  render() {
    return (
      <div id="interactive" className="viewport"/>
    )
  }
}
