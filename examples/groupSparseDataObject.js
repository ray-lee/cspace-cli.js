/**
 * Example of a sparse update object. A sparse update object includes only the fields of a record
 * that should be changed. All other fields will remain unchanged.
 *
 * Run this example using the command:
 *
 * cspace update groups/<csid> groupSparseDataObject.js
 */

module.exports = {
  document: {
    '@name': 'groups',
    'ns2:groups_common': {
      '@xmlns:ns2': 'http://collectionspace.org/services/group',
      title: 'Sample 1',
    },
  },
};
