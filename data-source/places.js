const mocked = [
  {
    _id: 'f4ab5e0a838ceda9813e86f24b00190d',
    _rev: '1-ab5c043491d9ad1f14d6c996cad9f494',
    place: 'holi'
  },
  {
    _id: 'cc83eb7090a07b5fb34433ce680015fa',
    _rev: '1-7f38c1c06ebeb999a316f8d00a126e43',
    place: 'whiskers'
  },
  {
    _id: 'cc83eb7090a07b5fb34433ce68000cba',
    _rev: '1-f1fc0ddd98788c80bba409749cb05f1e',
    place: 'you'
  },
  {
    _id: 'cc83eb7090a07b5fb34433ce680013b2',
    _rev: '1-9f142b26508adf602497a275bc99eebc',
    place: 'go'
  },
  {
    _id: 'cc83eb7090a07b5fb34433ce68000351',
    _rev: '1-018e1ae3ee34616232d6b96bf899ed86',
    place: 'siters'
  },
];


const getPlaces = () => {
  return mocked;
};

const getPlace = (id) => {
  return mocked.find((p) => p._id === id);
};

export default {
  getPlaces,
  getPlace,
};
