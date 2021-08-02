import { Style, createAvatar } from '@dicebear/avatars';
import * as React from 'react';

type Props = {
  style: Style<{}>;
};

export default function Examples({ style }: Props) {
  let names = [
    'Sean Moore',
    'Lionel Quinn',
    'Lydia Ellis',
    'Bryan Phelps',
    'Ronald Frank',
    'Annette Klein',
    'Brent Hill',
    'Stanley Newman',
    'Grace Singleton',
  ];

  return (
    <p>
      {names.map((name) => {
        return (
          <React.Fragment key={name}>
            <img src={createAvatar(style, { s: name, dataUri: true, w: 60, h: 60 })} alt={name} />{' '}
          </React.Fragment>
        );
      })}
    </p>
  );
}
