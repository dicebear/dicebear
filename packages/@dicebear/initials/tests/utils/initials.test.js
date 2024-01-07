import { getInitials } from '../../lib/utils/initials.js';
import { test } from 'uvu';
import { equal } from 'uvu/assert';

const data = [
    ['John Doe', 'JD'],
    ['Florian', 'FL'],
    ['Störfried Würgekloß', 'SW'],
    ['Frank Walter Östernbach', 'FÖ'],
    ['陳方 陈方', '陳陈'],
    ['contact@dicebear.com', 'CO'],
];

for (const [input, expected] of data) {
    test(`Get initials for ${input}`, () => {
        equal(getInitials(input), expected);
    });
}

test.run();
