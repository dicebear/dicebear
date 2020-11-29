import axios from 'axios';

export async function statsMain(props: any) {
  if (props.__ow_path !== '/data/stats') {
    return {
      body: '404 Not Found',
      statusCode: 404,
    };
  }

  let response = await axios('https://api.github.com/repos/dicebear/avatars', {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'Dicebear-Avatars',
    },
  });

  return {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': `max-age=${60 * 60}`,
    },
    body: {
      data: { stars: response.data.stargazers_count },
    },
  };
}
