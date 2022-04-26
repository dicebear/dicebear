import { Style, StyleOptions } from '@dicebear/core';
import React from 'react';

export type AvatarProps<O extends {}> = {
  style: Style<O>;
  options: StyleOptions<O>;
} & React.ImgHTMLAttributes<HTMLImageElement>;
