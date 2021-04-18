import * as React from 'react';
import { StyleSchema, utils } from '@dicebear/avatars';
import OptionsType from './optionsType';

type Props = {
  schema: StyleSchema;
};

export default function Options({ schema }: Props) {
  let aliases = utils.schema.aliases(schema).reduce<Record<string, string[]>>((res, cur) => {
    cur.forEach((alias) => {
      res[alias] = cur;
    });

    return res;
  }, {});

  return (
    <table className="table">
      <tbody>
        {Object.keys(schema.properties || {}).map((key) => {
          const propertyAliases = (aliases[key] || []).filter(
            (alias) => !((schema.properties || {})[alias] as StyleSchema).description?.includes('@deprecated')
          );

          const property = (schema.properties || {})[key] as StyleSchema;
          const isDepecated = property.description?.includes('@deprecated');
          const isPrimary = propertyAliases.length === 0 || aliases[key][aliases[key].length - 1] === key;

          if (false === isPrimary || isDepecated) {
            return null;
          }

          return (
            <tr key={key}>
              <td>
                <div className="row">
                  <div className="col-6">
                    <p className="h5">
                      <strong>{key}</strong>
                    </p>
                    <p className="line-height-120 small">{property.description || property.title}</p>
                  </div>
                  <div className="col-6 text-right">
                    {propertyAliases.length > 1 &&
                      propertyAliases.map((alias) => {
                        if (alias === key) {
                          return '';
                        }

                        return (
                          <React.Fragment key={alias}>
                            <span className="badge badge--secondary">Alias: {alias}</span>{' '}
                          </React.Fragment>
                        );
                      })}
                  </div>
                </div>

                <p className="small">
                  <strong>Default:</strong> {undefined === property.default && <code>undefined</code>}
                  {undefined !== property.default && false === Array.isArray(property.default) && (
                    <code>
                      {typeof property.default === 'string' ? property.default : JSON.stringify(property.default)}
                    </code>
                  )}
                  {Array.isArray(property.default) &&
                    property.default.map((val, valIndex) => (
                      <React.Fragment key={valIndex}>
                        {valIndex > 0 && ', '}
                        <code>{val}</code>
                      </React.Fragment>
                    ))}
                </p>

                <OptionsType fields={(property.oneOf as StyleSchema[]) ?? [property]} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
