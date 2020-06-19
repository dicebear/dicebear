import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import autoExternal from 'rollup-plugin-auto-external';
import pkg from './package.json';
import licenseChecker from 'license-checker';
import bannerPlugin from 'rollup-plugin-banner';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];
const name = 'Avatars';

const createLicenseText = (name, license) => {
  return [
    name + ':',
    '  author: ' + license.publisher,
    '  license: ' + license.licenses,
    '  repository: ' + license.repository,
  ].join('\n');
};

export default async () => {
  let licenseInformation = await new Promise((resolve, reject) => {
    licenseChecker.init(
      {
        start: __dirname,
        production: true,
      },
      function (err, json) {
        err ? reject(err) : resolve(json);
      }
    );
  });

  let licenses = [];

  Object.keys(licenseInformation).forEach((name) => {
    let license = licenseInformation[name];
    let nameWithoutVersion = name.replace(/(.*)@.*/, '$1');

    licenses.push(createLicenseText(nameWithoutVersion, license));
  });

  let banner = licenses.join('\n');

  return [
    {
      input: './src/index.ts',
      plugins: [
        resolve({ extensions }),
        commonjs(),
        babel({ extensions, include: ['src/**/*'] }),
        terser(),
        bannerPlugin(banner),
      ],
      external: ['crypto'],
      output: [
        {
          file: pkg.browser,
          format: 'umd',
          name: name,
        },
      ],
    },
    {
      input: './src/index.ts',
      plugins: [
        resolve({ extensions }),
        babel({ extensions, include: ['src/**/*'] }),
        autoExternal(),
        bannerPlugin(createLicenseText(pkg.name, licenseInformation[`${pkg.name}@${pkg.version}`])),
      ],
      output: [
        {
          file: pkg.main,
          format: 'cjs',
        },
        {
          file: pkg.module,
          format: 'es',
        },
      ],
    },
  ];
};
