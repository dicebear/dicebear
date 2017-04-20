declare namespace Chance {
    interface ChanceStatic {
        (seed: number|string): SeededChance
        new(seed: number|string): SeededChance;
    }

    interface Chance {
        seed: number;
    }
}
