const rhymeUrl = "https://api.datamuse.com/words";

function checkResponse(res: Response) {
  return res.ok ? res.json() : Promise.reject(`Error ${res.status}`);
}

const getRhyme = (word: string, engine: string, topic: string, max: number) => {
  return fetch(
    `${rhymeUrl}?rel_rhy=${word}&${engine}=${topic}&max=${max}`
  ).then(checkResponse);
};

const getSoundAlike = (word: string, engine: string, topic: string, max: number) => {
  return fetch(
    `${rhymeUrl}?rel_nry=${word}&${engine}=${topic}&max=${max}`
  ).then(checkResponse);
};

const getRelatedAdjectives = (word: string, engine: string, topic: string, max: number) => {
  return fetch(
    `${rhymeUrl}?rel_jja=${word}&${engine}=${topic}&max=${max}`
  ).then(checkResponse);
};

const getRelatedNouns = (word: string, engine: string, topic: string, max: number) => {
  return fetch(
    `${rhymeUrl}?rel_jjb=${word}&${engine}=${topic}&max=${max}`
  ).then(checkResponse);
};

const getRelatedWords = (word: string, engine: string, topic: string, max: number) => {
  return fetch(
    `${rhymeUrl}?rel_trg=${word}&${engine}=${topic}&max=${max}`
  ).then(checkResponse);
};

const getSynonyms = (word: string, engine: string, topic: string, max: number) => {
  return fetch(
    `${rhymeUrl}?rel_syn=${word}&${engine}=${topic}&max=${max}`
  ).then(checkResponse);
};

const getAntonyms = (word: string, engine: string, topic: string, max: number) => {
  return fetch(
    `${rhymeUrl}?rel_ant=${word}&${engine}=${topic}&max=${max}`
  ).then(checkResponse);
};

const getFrequentFollowers = (word: string, engine: string, topic: string, max: number) => {
  return fetch(
    `${rhymeUrl}?rel_bga=${word}&${engine}=${topic}&max=${max}`
  ).then(checkResponse);
};

export {
  getRhyme,
  getSoundAlike,
  getRelatedAdjectives,
  getRelatedNouns,
  getRelatedWords,
  getSynonyms,
  getAntonyms,
  getFrequentFollowers
}