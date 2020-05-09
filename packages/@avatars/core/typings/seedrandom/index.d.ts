declare namespace seedrandom {
  interface prng {
    (): number;
  }

  interface seedrandom {
    (seed?: string): prng;
  }
}

declare module 'seedrandom/seedrandom' {
  var seedrandom: seedrandom.seedrandom;

  export = seedrandom;
}
