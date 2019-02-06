module.exports = {
  search: {
    as: 'groups_common:title LIKE \'Test %\'',
    wf_deleted: false,
  },
  update: (item, readRecord) => readRecord()
    .then((response) => {
      const scopeNote = response.data.document['ns2:groups_common'].scopeNote;

      return {
        document: {
          '@name': 'groups',
          'ns2:groups_common': {
            '@xmlns:ns2': 'http://collectionspace.org/services/group',
            scopeNote: `${scopeNote} Updated ${new Date()}.`,
          },
        },
      };
    }),
};
