import got from 'got';

export function getHeaders() {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    AccessKey: process.env.BUNNYCDN_API_KEY,
  };
}

export function get<T>(uri: string) {
  return got.get<T>(`https://bunnycdn.com/api/${uri}`, {
    headers: getHeaders(),
    responseType: 'json',
  });
}

export function post<T>(uri: string, data: T) {
  return got.post(`https://bunnycdn.com/api/${uri}`, {
    headers: getHeaders(),
    responseType: 'json',
    body: JSON.stringify(data),
  });
}

export function del(uri: string) {
  return got.delete(`https://bunnycdn.com/api/${uri}`, {
    headers: getHeaders(),
    responseType: 'json',
  });
}
