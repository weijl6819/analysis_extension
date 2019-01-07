import xhr from 'utility/xhr';

export default async ({term}) => {
  try {
    const url = 'https://completion.amazon.com/search/complete?method=completion&mkt=1&p=Gateway&l=en_US&sv=desktop&client=amazon-search-ui&x=String&search-alias=aps&q=__term__&qs=&cf=1&fb=1&sc=1'.replace(
      '__term__',
      encodeURIComponent(term)
    );
    const response = await xhr('GET', url);
    const json = JSON.parse(response.replace('completion =', '').replace(';String();', ''));
    return json[1];
  } catch (e) {
    return null;
  }
};
