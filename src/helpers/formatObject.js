import util from 'util';

export default object => util.inspect(object, {
  depth: 6,
  colors: true,
});
