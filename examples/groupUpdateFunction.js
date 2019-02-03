/**
 * Example of a functional update. A functional update may be used to update a record by computing
 * the next values from the current values. The current data will be passed into the function as an
 * argument. The function may return a new object, or it may mutate the argument object and return
 * it. The returned data may be sparse or full.
 *
 * Run this example using the command:
 *
 * cspace update groups/<csid> groupUpdateFunction.js
 */

/**
 * An update function for group records that increments a counter in the title.
 * @param {Object} data The current record data
 * @return {Object} A sparse data object containing the new title
 */
export default (data) => {
  const title = data.document['ns2:groups_common'].title;
  const countPattern = / (\d+)$/;

  let nextTitle;

  if (countPattern.test(title)) {
    const count = parseInt(RegExp.$1, 10);
    const nextCount = count + 1;

    nextTitle = title.replace(countPattern, ` ${nextCount}`);
  } else {
    nextTitle = `${title} 1`;
  }

  return {
    document: {
      '@name': 'groups',
      'ns2:groups_common': {
        '@xmlns:ns2': 'http://collectionspace.org/services/group',
        title: nextTitle,
      },
    },
  };
};
