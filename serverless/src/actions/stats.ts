type WorkerEvent = {
  request: Request;
  respondWith: (response: Response | Promise<Response>) => void;
};

addEventListener<any>('fetch', (event: WorkerEvent) => {
  event.respondWith(handler());
});

async function handler() {
  let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Cache-Control', `max-age=${60 * 60}`);

  return new Response(JSON.stringify({ data: await github() }), {
    status: 200,
    headers: headers,
  });
}

async function github() {
  let headers = new Headers({
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'Dicebear-Avatars',
  });

  let response = await fetch('https://api.github.com/repos/dicebear/avatars', {
    method: 'get',
    headers: headers,
  });

  let json = await response.json();

  return {
    stars: json.stargazers_count,
  };
}
