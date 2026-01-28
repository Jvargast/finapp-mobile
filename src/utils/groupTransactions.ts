export const groupTransactionsByDate = (transactions: Transaction[]) => {
  const groups: { title: string; data: Transaction[] }[] = [];

  transactions.forEach((tx) => {
    const dateTitle = getFriendlyDate(tx.date);

    let group = groups.find((g) => g.title === dateTitle);
    if (!group) {
      group = { title: dateTitle, data: [] };
      groups.push(group);
    }
    group.data.push(tx);
  });

  return groups;
};
