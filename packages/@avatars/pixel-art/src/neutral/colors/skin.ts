export default (colors?: number[]) =>
  Object.entries({
    100: '#FFDBAC',
    200: '#F1CA9B',
    300: '#E3BA8A',
    400: '#D4A979',
    500: '#C69868',
    600: '#B88757',
    700: '#AA7746',
    800: '#9B6635',
    900: '#8D5524',
  })
    .filter(([name]) => (colors || [parseInt(name)]).includes(parseInt(name)))
    .map(([, value]) => value);
