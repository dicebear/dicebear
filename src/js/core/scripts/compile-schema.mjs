import { validator } from '@exodus/schemasafe';
import { createRequire } from 'module';
import { writeFileSync, mkdirSync } from 'fs';

const require = createRequire(import.meta.url);

function compileValidator({ schemaModule, domain }) {
  const errorClass = `${domain}ValidationError`;
  const validatorClass = `${domain}Validator`;

  const schema = require(schemaModule);

  // isJSON matches Ajv's presence semantics: a property whose value is
  // `undefined` counts as absent. Without it, schemasafe uses an `in` check
  // and would reject calls like `createAvatar(style, { size: undefined })`.
  const validate = validator(schema, {
    includeErrors: true,
    allErrors: true,
    isJSON: true,
  });

  // toModule() emits the validator as a single self-contained IIFE expression
  // without imports or requires, so the generated file has no runtime
  // dependency on the @exodus/schemasafe package.
  const moduleCode = validate.toModule().trim();

  const classCode = `import { ${errorClass} } from '../Error/${errorClass}.js';

const validate = ${moduleCode}

// schemasafe reports errors as JSON pointers only (instanceLocation into the
// data, keywordLocation into the schema) without prose. Derive a short message
// from the failing keyword; the detail keeps keywordLocation as schemaPath for
// anyone who needs the exact schema rule.
const KEYWORD_MESSAGES = {
  type: 'has an invalid type',
  enum: 'must be one of the allowed values',
  const: 'must equal the expected value',
  pattern: 'does not match the required pattern',
  required: 'is required but missing',
  additionalProperties: 'has an unexpected property',
  propertyNames: 'has an invalid property name',
  minimum: 'is smaller than allowed',
  maximum: 'is larger than allowed',
  exclusiveMinimum: 'is smaller than allowed',
  exclusiveMaximum: 'is larger than allowed',
  minLength: 'is too short',
  maxLength: 'is too long',
  minItems: 'has too few items',
  maxItems: 'has too many items',
  uniqueItems: 'has duplicate items',
  minProperties: 'has too few properties',
  maxProperties: 'has too many properties',
  anyOf: 'does not match any allowed variant',
  oneOf: 'does not match exactly one allowed variant',
  allOf: 'does not match all required schemas',
  not: 'matches a disallowed schema',
};

function toDetail(error) {
  const keyword = error.keywordLocation.slice(
    error.keywordLocation.lastIndexOf('/') + 1,
  );

  return {
    instancePath: error.instanceLocation.slice(1),
    schemaPath: error.keywordLocation,
    keyword,
    message: KEYWORD_MESSAGES[keyword] ?? \`must satisfy '\${keyword}'\`,
  };
}

export class ${validatorClass} {
  static validate(data) {
    if (!validate(data)) {
      throw new ${errorClass}((validate.errors ?? []).map(toDetail));
    }
  }
}
`;

  writeFileSync(`./src/Validator/${validatorClass}.js`, classCode);
}

mkdirSync('./src/Validator', { recursive: true });

compileValidator({
  schemaModule: '@dicebear/schema/definition.json',
  domain: 'Style',
});
compileValidator({
  schemaModule: '@dicebear/schema/options.json',
  domain: 'Options',
});
