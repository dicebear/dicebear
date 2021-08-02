import * as React from 'react';
import { StyleSchema } from '@dicebear/avatars';

type Props = {
  fields: StyleSchema[];
};

export default function OptionsType({ fields }: Props) {
  return (
    <>
      {fields.map((field, fieldIndex) => {
        let items: StyleSchema[] = [];

        // Array type currently not implemented.
        if (field.items && false === Array.isArray(field.items)) {
          const fieldItems = field.items as StyleSchema;

          items = (fieldItems.anyOf as StyleSchema[]) ?? [fieldItems];
        }

        return (
          <React.Fragment key={fieldIndex}>
            {fieldIndex > 0 && <div className="text-center small mt-1">or</div>}
            <div className={`box small mt-${fieldIndex > 0 ? 1 : 2}`}>
              <p>
                <strong>Type:</strong> <code>{field.type}</code>
              </p>
              {field.minimum !== undefined && (
                <p>
                  <strong>Minimum:</strong> <code>{field.minimum}</code>
                </p>
              )}
              {field.maximum !== undefined && (
                <p>
                  <strong>Maximum:</strong> <code>{field.maximum}</code>
                </p>
              )}
              {field.pattern !== undefined && (
                <p>
                  <strong>Pattern:</strong> <code>{field.pattern}</code>
                </p>
              )}
              {field.enum !== undefined && (
                <p>
                  <strong>Enum:</strong>{' '}
                  {field.enum.map((val, valIndex) => (
                    <React.Fragment key={valIndex}>
                      {valIndex > 0 && ', '}
                      <code>{val}</code>
                    </React.Fragment>
                  ))}
                </p>
              )}

              {items.length > 0 && (
                <>
                  <p>
                    <strong>Items:</strong>
                  </p>
                  <OptionsType fields={items} />
                </>
              )}
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
}
