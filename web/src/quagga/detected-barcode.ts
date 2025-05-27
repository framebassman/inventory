export class DetectedBarcode {
  public codeResult: CodeResult;
  public format: string; // code_128 or code_39, codabar, ean_13, ean_8, upc_a, upc_e

  constructor() {
    this.codeResult = new CodeResult();
    this.format = '';
  }
}

class CodeResult {
  public code: string;

  constructor() {
    this.code = '';
  }
}
