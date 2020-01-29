
let items = [['owjevtkuyv', '58584272', '62930912'],
['rpaqgbjxik', '9425650', '96088250'],
['dfbkasyqcn', '37469674', '46363902'],
['vjrrisdfxe', '18666489', '88046739']];
const start = 0;
const end = 2;
let sortParameter = 2;
let sortOrder = 1;

if (sortParameter > 0) {
  items.sort(function(a, b) {
    let index = sortParameter;
    if (sortOrder === 1) {
      console.log(sortOrder);
      console.log(a[index], b);

      return b[sortParameter] - a[sortParameter];
    }

  return a[sortParameter] - b[sortParameter];
  });
  console.log(items);
} else {
  items.sort();
}
items = items.map(function(value, index) { return value[0]; });
items = items.slice(start, end);
let result = items;

console.log(result);
