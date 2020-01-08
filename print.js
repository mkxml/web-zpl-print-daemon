let label;

async function getPrinterStatus() {
  const response = await fetch('https://localhost:9222/status', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  });
  const json = await response.json();
  const status = JSON.parse(json);
  return status;
}

async function print() {
  label.innerText = 'Printing...';
  const textarea = document.getElementById('zpldata');
  const encoder = new TextEncoder();
  const text = textarea.value;
  const data = encoder.encode(text);
  await fetch('https://localhost:9222/print', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ zpl: data })
  });
  label.innerText = 'Check the printer!';
}

function showConnectButton() {
  const btn = document.querySelector('.connectbtn');
  btn.addEventListener('click', connectPrinter, false);
}

function hideConnectButton() {
  const btn = document.querySelector('.connectbtn');
  btn.parentElement.removeChild(btn);
}

async function connectPrinter() {
  label = document.getElementById('label');
  try {
    const { healthy, printerName } = await getPrinterStatus();
    if (healthy) {
      const printer = document.getElementById('printer');
      printer.innerText = `Printer: ${printerName}`;
      hideConnectButton();
    } else {
      label.innerText = 'Printer not available';
    }
  } catch(e) {
    label.innerText = 'Printer not found...';
    console.error(e);
  }
}

async function setup() {
  showConnectButton();
  // Try to connect onload
  await connectPrinter();
  const btn = document.getElementById('printbtn');
  btn.addEventListener('click', print, false);
}

document.addEventListener('DOMContentLoaded', setup, false);
