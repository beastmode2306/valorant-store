export const formatStoreMessages = (store) => {
  return store.map((item) => {
    const { skin, cost } = item;
    const { displayName } = skin;
    const price = Object.values(cost).at(-1);
    return `\`${displayName} -  ${price}VP\``;
  });
};
