import get from 'lodash/get';
import ProgressBar from 'progress';
import output from './output';

const processPage = (
  cspace, resource, pagedSearchParams, callback, progressBar,
) => cspace.read(resource, { params: pagedSearchParams })
  .then((result) => {
    const pageNum = parseInt(get(result, ['data', 'ns2:abstract-common-list', 'pageNum']), 10);
    const totalItems = parseInt(get(result, ['data', 'ns2:abstract-common-list', 'totalItems']), 10);

    let itemsInPage = parseInt(get(result, ['data', 'ns2:abstract-common-list', 'itemsInPage']), 10);

    if (Number.isNaN(itemsInPage)) {
      itemsInPage = 0;
    }

    if (progressBar) {
      // eslint-disable-next-line no-param-reassign
      progressBar.total = totalItems;
    }

    if (itemsInPage === 0) {
      return Promise.resolve(itemsInPage);
    }

    let items = get(result, ['data', 'ns2:abstract-common-list', 'list-item']);

    if (!Array.isArray(items)) {
      items = [items];
    }

    return items.reduce((promise, item) => promise
      .then(() => {
        if (progressBar) {
          progressBar.tick({
            pageNum,
            uri: item.uri,
          });
        }

        return Promise.resolve(callback(item));
      }), Promise.resolve())
      .then(() => itemsInPage)
      .catch((err) => {
        if (progressBar) {
          output.error();
        }

        output.error(err);
      });
  });

export default async (cspace, resource, searchParams, callback) => {
  const {
    pagesize: pageSize,
    startpage: startPage,
    endpage: endPage,
  } = global.argv;

  let pgNum = startPage;
  let itemsInPage;
  let progressBar;

  if (!global.argv.verbose) {
    progressBar = new ProgressBar('[:bar] :percent | page :pageNum record :current/:total :uri | eta :eta s', {
      total: 1,
      width: 30,
      complete: '•',
      incomplete: ' ',
    });
  }

  do {
    const pagedSearchParams = Object.assign({}, searchParams, {
      pgNum,
      pgSz: pageSize,
      sortBy: 'collectionspace_core:createdAt, ecm:name',
    });

    try {
      itemsInPage = await processPage(cspace, resource, pagedSearchParams, callback, progressBar);
    } catch (error) {
      break;
    }

    pgNum += 1;
  } while (itemsInPage === pageSize && pgNum <= endPage);
};
