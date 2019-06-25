import Avatars, { SpriteCollection } from '@dicebear/avatars';
import * as queryString from 'query-string';
import { ObjectSchema } from 'yup';

export function createHandler(sprites: (options: any) => SpriteCollection, options: ObjectSchema) {
  return async (request: Request) => {
    let route = request.url.match(/^http.*\/\/.*?\/v2\/.*?\/(.*)\.svg/);
    let parsedQueryString = queryString.parseUrl(request.url);
    let requestOptions = parsedQueryString.query['options'] || {};
    let headers = new Headers();

    try {
      await options.validate(requestOptions);
    } catch (e) {
      return new Response(e['errors'].join(''), {
        status: 400
      });
    }

    if ('gravatar' in parsedQueryString.query) {
      try {
        let gravatarHash = parsedQueryString.query['gravatar'] || route[1];
        let gravatarSize = parseInt((parsedQueryString.query['s'] || '0') as string);
        let gravatarUrl = gravatarSize
          ? `https://gravatar.com/avatar/${gravatarHash}.png?d=404&s=${gravatarSize}`
          : `https://gravatar.com/avatar/${gravatarHash}.png?d=404`;

        // Check whether the image exists at Gravatar.
        await fetch(gravatarUrl, { method: 'HEAD' });

        headers.set('Location', gravatarUrl);

        return new Response('', {
          status: 301,
          headers: headers
        });
      } catch (e) {
        // No image available at Gravtar, therefore no forwarding.
      }
    }

    let avatars = new Avatars(sprites(options.cast(requestOptions)));
    let svg = avatars.create(route[1]);

    headers.append('Content-Type', 'image/svg+xml');
    headers.append('Cache-Control', `max-age=${60 * 60 * 24 * 30}`);

    // Return graphql response
    return new Response(svg, {
      headers: headers
    });
  };
}
