let asciiArray = [];

for (let i = 0; i < 256; i++) {
  let charSequence = String.fromCharCode(i);
  asciiArray.push({ index: i, charSequence: charSequence });
}

const wordInput = document.getElementById('word_input');
const asciiCheckbox = document.getElementById('ascii_checkbox');
const submitButton = document.getElementById('submit_button');
const table = document.getElementById('table');
let word = '';
let index = 0;
const indexTable = [];
const tableData = [];

submitButton.addEventListener('click', onSubmitValues);

function onSubmitValues() {
  word = wordInput.value;
  clearTable();

  if (asciiCheckbox.checked) {
    index = 256;
    indexTable.push(...asciiArray);
  }

  lzwEncoding();
  renderTableRows();
}

function clearTable() {
  indexTable.length = 0;
  tableData.length = 0;

  while (table.lastElementChild.classList[1] !== 'head') {
    table.removeChild(table.lastElementChild);
  }
}

function renderTableRows() {
  tableData.forEach((rowData) => {
    const rowElement = createNewTableRow(rowData);
    table.appendChild(rowElement);
  });
}

function createNewTableRow({ k, pk, pkIndex, resultIndex, resultChar, p }) {
  const tableRow = document.createElement('div');
  tableRow.classList.add('table-row', 'data');
  const formattedValues = [
    k ?? '',
    (pk && `<${pk}>, ${pkIndex}`) ?? '',
    (resultIndex && `${resultIndex} (${resultChar})`) ?? '',
    (p && `<${p}>`) ?? '< >',
  ];

  formattedValues.forEach((value) => {
    const columnDiv = document.createElement('div');
    columnDiv.textContent = value;
    tableRow.appendChild(columnDiv);
  });

  return tableRow;
}

function isCharSequenceAlreadyInTable(targetCharSequence) {
  return indexTable.some((obj) => obj.charSequence === targetCharSequence);
}

function getIndexOfCharSeq(targetCharSeq) {
  for (let i = 0; i < indexTable.length; i++) {
    if (indexTable[i].charSequence === targetCharSeq) {
      return indexTable[i].index;
    }
  }
  return -1;
}

function lzwEncoding() {
  let k = '';
  let p = k;
  let result;
  for (let i = 0; i < word.length; i++) {
    let k = word.charAt(i);
    const pk = p.concat(k);
    if (isCharSequenceAlreadyInTable(pk)) {
      p = pk;
      pushData(k, '', undefined, undefined, '', p);
    } else {
      indexTable.push({ index: index, charSequence: pk });
      index++;
      result = getIndexOfCharSeq(p);
      const pkIndex = getIndexOfCharSeq(pk);
      const oldP = p;
      p = k;
      pushData(k, pk, pkIndex, result, oldP, p);
    }
  }
  oldP = p;
  result = getIndexOfCharSeq(p);
  pushData('', '', undefined, result, oldP, undefined);
}

function pushData(k, pk, pkIndex, resultIndex, resultChar, p) {
  tableData.push({
    k: k,
    pk: pk,
    pkIndex: pkIndex,
    resultIndex: resultIndex,
    resultChar: resultChar,
    p: p,
  });
}
