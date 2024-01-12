let asciiArrayDec = [];

for (let i = 0; i < 256; i++) {
  let charSequence = String.fromCharCode(i);
  asciiArrayDec.push({ index: i, charSequence: charSequence });
}

const wordInputDec = document.getElementById('word_input_decoding');
const asciiCheckboxDec = document.getElementById('ascii_checkbox_decoding');
const submitButtonDec = document.getElementById('submit_button_decoding');
const tableDec = document.getElementById('table_decoding');
let wordDec = '';
let indexDec = 0;
const indexTableDec = [];
const tableDataDec = [];
const charCodes = [];
const resultDec = [];

submitButtonDec.addEventListener('click', onSubmitDecodingValues);

function onSubmitDecodingValues() {
  wordDec = wordInputDec.value;
  clearTableDecoding();
  charCodes.push(...wordDec.split('-'));

  if (asciiCheckboxDec.checked) {
    indexDec = 256;
    indexTableDec.push(...asciiArrayDec);
  }

  lzwDecoding();
  console.table(tableDataDec);
  renderTableRowsDecoding();
  displayResultDecoding();
}

function clearTableDecoding() {
  indexTableDec.length = 0;
  tableDataDec.length = 0;
  charCodes.length = 0;
  result.length = 0;

  while (tableDec.lastElementChild.classList[1] !== 'head') {
    tableDec.removeChild(tableDec.lastElementChild);
  }
}

function displayResultDecoding() {
  const resultString = resultDec.join('');
  const endResult = createResultLabel().outerHTML + resultString;

  const resultP = document.getElementById('result_decoding');
  resultP.innerHTML = endResult;
  console.warn(resultString, endResult);
}

function renderTableRowsDecoding() {
  tableDataDec.forEach((rowData) => {
    const rowElement = createNewTableRowDecoding(rowData);
    tableDec.appendChild(rowElement);
  });
}

function createNewTableRowDecoding({
  k,
  akt,
  p,
  pq,
  pqIndex,
  old,
  isSpecialCase,
}) {
  const tableRow = document.createElement('div');
  tableRow.classList.add('table-row', 'data');

  const formatValueWithUnderline = (text) => {
    if (text) {
      const span = document.createElement('span');
      span.textContent = text.charAt(0);
      span.classList.add('underlined');
      return span.outerHTML + text.substring(1);
    }
    return '';
  };

  const formattedValues = [
    k ?? '',
    akt && !isSpecialCase ? formatValueWithUnderline(akt) : akt ?? '',
    p && isSpecialCase ? formatValueWithUnderline(p) : p ?? '',
    pq && pqIndex ? `&lt;${pq}&gt;, ${pqIndex}` : '',
    old ?? '',
  ];

  formattedValues.forEach((value) => {
    const columnDiv = document.createElement('div');
    columnDiv.innerHTML = value; // Use innerHTML to parse HTML content
    tableRow.appendChild(columnDiv);
  });

  if (akt) {
    resultDec.push(akt);
    console.log(resultDec);
  }

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
  console.log(charCodes);
  const firstAkt = getCharSeqOfIndex(k);
  old = k;
  console.table(indexTableDec);
  console.log(firstAkt);
  pushDecodingData(k, firstAkt, undefined, undefined, undefined, old, false);
  console.table(tableDataDec);
  for (let i = 1; i < charCodes.length; i++) {
    const k = charCodes[i];
    if (isCharCodeAlreadyInTable(k)) {
      const akt = getCharSeqOfIndex(k);
      const q = akt.charAt(0);
      const p = getCharSeqOfIndex(old);
      const pq = p.concat(q);
      const pqIndex = indexDec;
      old = k;
      console.log('true k, old: ', k, old, pq);
      indexTableDec.push({ index: pqIndex, charSequence: pq });

      pushDecodingData(k, akt, p, pq, pqIndex, old, false);
    } else {
      const p = getCharSeqOfIndex(old);
      const q = p.charAt(0);
      const pq = p.concat(q);
      const pqIndex = indexDec;
      const akt = pq;
      old = k;
      console.log('false k, old: ', k, old, pq);

      pushDecodingData(k, akt, p, pq, pqIndex, old, true);
    }
    indexDec++;
  }
}

function pushDecodingData(k, akt, p, pq, pqIndex, old, isSpecialCase) {
  tableDataDec.push({
    k: k,
    akt: akt,
    p: p,
    pq: pq,
    pqIndex: pqIndex,
    old: old,
    isSpecialCase: isSpecialCase,
  });
}
