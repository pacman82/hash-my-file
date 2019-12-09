let wasm = {
    computeSha256: null,
    computeMd5: null
};

let member = {
  inputEl: null,
  dropEl: null,
  algorithmEl: null,
  outputEl: null,
  unsupportedFileTypeInfoEl: null,
  unsupportedBrowserInfoEl: null,
}

;(async function main() {
  wasm = await getWasm()
  initElements()
  checkFileApiSupport()
})()

async function getWasm() {
  try {
    const wasm = await import('../pkg/index.js')
    return wasm
  } catch (exc) {
    console.error(exc)
  }
}

function initElements() {
  const containerEl = document.getElementById('container')

  member.inputEl = containerEl.querySelector('input')
  member.dropEl = containerEl.querySelector('.drop-zone')
  member.algorithmEl = document.getElementsByName("algorithm")
  member.unsupportedFileTypeInfoEl = containerEl.querySelector('.unsupported-filetype-info')
  member.unsupportedBrowserInfoEl = containerEl.querySelector('.unsupported-browser-info')

  member.inputEl.addEventListener('change', handleFileSelect, false)
  member.dropEl.addEventListener('dragover', handleDragOver, false)
  member.dropEl.addEventListener('drop', handleDrop, false)

  member.outputEl = document.getElementById('output')
}

function checkFileApiSupport() {
  if (window.File && window.FileReader) {
    member.unsupportedBrowserInfoEl.classList.add('hide')
  } else {
    member.unsupportedBrowserInfoEl.classList.remove('hide')
  }
}

function handleDragOver(event) {
  event.stopPropagation()
  event.preventDefault()
  event.dataTransfer.dropEffect = 'copy'
}

function handleDrop(event) {
  event.stopPropagation()
  event.preventDefault()

  const file = event.dataTransfer.files[0]
  processFile(file)
}

function handleFileSelect(event) {
  const file = event.target.files[0]
  processFile(file)
}

function processFile(file) {
  // `file` is supposed to be a blob which offers a possibility to wait for an `ArrayBuffer`. Yet,
  // until we get this to work, let's just use a `FileReader` instead.
  const reader = new FileReader()
  reader.onloadend = createHandleFileLoaded(file)
  reader.readAsArrayBuffer(file)
}

// Binds `file` to `handleFileLoaded`.
function createHandleFileLoaded(file) {
  return function handleFileLoaded(event) {
    
    // Get algorithm name from checked radio button
    let algorithmName = null
    for (let index = 0; index < member.algorithmEl.length; index++) {
      const element = member.algorithmEl[index];
      if (element.checked) {
        algorithmName = element.value
        break;
      }
    }

    let hashRep = null;
    const buffer = event.target.result
    if (algorithmName == 'md5') {
      hashRep = wasm.computeMd5(new Uint8Array(buffer))
    } else {
      hashRep = wasm.computeSha256(new Uint8Array(buffer))
    }
    member.outputEl.innerText = hashRep
  }
}
