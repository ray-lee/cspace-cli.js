/**
 * Example of a full update object. A full update object includes every field in the record, so the
 * entire contents of the record are overwritten.
 *
 * Run this example using the command:
 *
 * cspace update groups/<csid> groupFullDataObject.js
 */

module.exports = {
  document: {
    '@name': 'groups',
    'ns2:groups_common': {
      '@xmlns:ns2': 'http://collectionspace.org/services/group',
      owner: 'urn:cspace:materials.collectionspace.org:personauthorities:name(person):item:name(JohnDoe1549166588130)\'John Doe\'',
      title: 'Test Group',
      responsibleDepartment: 'ethnography',
      scopeNote: 'This is a scope note.',
    },
  },
};
