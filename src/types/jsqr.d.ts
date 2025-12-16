// Since @types/jsqr doesn't exist, we create a minimal module declaration
// to satisfy TypeScript and provide basic type safety for the 'jsqr' library.

declare module 'jsqr' {
  // Define the structure of the object returned by jsQR when a code is found
  interface QRCode {
    data: string;
    version: number;
    location: {
      topRightCorner: { x: number; y: number };
      topLeftCorner: { x: number; y: number };
      bottomRightCorner: { x: number; y: number };
      bottomLeftCorner: { x: number; y: number };
      topRightFinderPattern: { x: number; y: number };
      topLeftFinderPattern: { x: number; y: number };
      bottomLeftFinderPattern: { x: number; y: number };
    };
  }

  // Define the options object that can be passed to the jsQR function
  interface Options {
    inversionAttempts?: 'dontInvert' | 'onlyInvert' | 'attemptBoth';
  }

  // Declare the main function exported by the library
  function jsQR(data: Uint8ClampedArray, width: number, height: number, options?: Options): QRCode | null;

  export default jsQR;
}
