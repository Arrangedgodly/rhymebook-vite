const dictionaryUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en_US/';

function checkResponse(res: Response) {
  return res.ok ? res.json() : Promise.reject(`Error ${res.status}`);
}

export const getDefinition = (word: string) => {
  return fetch(`${dictionaryUrl}${word}`).then(checkResponse);
}