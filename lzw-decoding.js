const wordInputDec = document.getElementById('word_input_decoding');
const asciiCheckboxDec = document.getElementById('ascii_checkbox_decoding');
const submitButtonDec = document.getElementById('submit_button_decoding');
const tableDec = document.getElementById('table_decoding');
let wordDec = '';
let indexDec = 0;
const indexTableDec = [];
const tableDataDec = [];
const charCodes = [];

submitButtonDec.addEventListener('click', onSubmitDecodingValues);

function onSubmitDecodingValues() {
  word = wordInputDec.value;
  charCodes.push(...word.split('-'));
  clearTableDecoding();

  if (asciiCheckbox.checked) {
    indexDec = 256;
    indexTableDec.push(...asciiArray);
  }

  lzwDecoding();
  console.table(tableDataDec);
  //   renderTableRowsDecoding();
}

function clearTableDecoding() {
  indexTableDec.length = 0;
  tableDataDec.length = 0;
  wordDec.value = '';

  while (table.lastElementChild.classList[1] !== 'head') {
    table.removeChild(table.lastElementChild);
  }
}

function renderTableRowsDecoding() {
  tableDataDec.forEach((rowData) => {
    const rowElement = createNewTableRowDecoding(rowData);
    table.appendChild(rowElement);
  });
}

function createNewTableRowDecoding({
  k,
  pk,
  pkIndex,
  resultIndex,
  resultChar,
  p,
}) {
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

function isCharCodeAlreadyInTable(charCode) {
  return indexTableDec.some((obj) => obj.index === +charCode);
}

function getCharSeqOfIndex(index) {
  for (let i = 0; i < indexTableDec.length; i++) {
    if (indexTableDec[i].index === +index) {
      return indexTableDec[i].charSequence;
    }
  }
  return '';
}

function lzwDecoding() {
  let old = '';
  let k = charCodes[0];
  const firstAkt = getCharSeqOfIndex(k);
  old = k;
  pushDecodingData(
    k,
    firstAkt,
    undefined,
    undefined,
    undefined,
    undefined,
    old
  );
  for (let i = 1; i < charCodes.length; i++) {
    const k = charCodes[i];
    if (isCharCodeAlreadyInTable(k)) {
      const akt = getCharSeqOfIndex(k);
      const q = akt.charAt(0);
      const p = getCharSeqOfIndex(old);
      const pq = p.concat(q);
      const pqIndex = indexDec;
      old = k;
      console.log('true k, old: ', k, old);
      indexTableDec.push({ index: pqIndex, charSequence: pq });

      pushDecodingData(k, akt, q, p, pq, pqIndex, old);
    } else {
      const p = getCharSeqOfIndex(old);
      const q = p.charAt(0);
      const pq = p.concat(q);
      const pqIndex = indexDec;
      const akt = pq;
      old = k;
      console.log('false k, old: ', k, old);

      pushDecodingData(k, akt, q, p, pq, pqIndex, old);
    }
    indexDec++;
  }
}

function pushDecodingData(k, akt, q, p, pq, pqIndex, old) {
  tableDataDec.push({
    k: k,
    akt: akt,
    q: q,
    p: p,
    pq: pq,
    pqIndex: pqIndex,
    old: old,
  });
}
