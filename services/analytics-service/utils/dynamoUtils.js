export const safeScan = async ({ ddbDocClient, command, params }) => {
  const items = [];
  let ExclusiveStartKey;

  do {
    const result = await ddbDocClient.send(
      new command({
        ...params,
        ExclusiveStartKey,
      })
    );

    if (result.Items) {
      items.push(...result.Items);
    }

    ExclusiveStartKey = result.LastEvaluatedKey;
  } while (ExclusiveStartKey);

  return items;
};
