export const joinUser = (
  userField: string,
  joinSchema = 'administrators',
): any => {
  const pipes = [
    {
      $lookup: {
        from: joinSchema,
        localField: userField,
        foreignField: '_id',
        as: userField,
        pipeline: [
          {
            $project: {
              _id: 0,
              displayName: 1,
              role: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: '$' + userField,
        preserveNullAndEmptyArrays: true,
      },
    },
  ];
  return pipes;
};
