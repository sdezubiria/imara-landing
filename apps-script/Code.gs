/**
 * Imara · registro de leads → Google Sheets
 *
 * Setup (once):
 * 1. Create a Google Sheet (e.g. "Imara · Leads"). Extensions → Apps Script.
 * 2. Paste this file as Code.gs and save.
 * 3. Deploy → New deployment → type "Web app".
 *      Execute as: Me.   Who has access: Anyone.
 * 4. Copy the Web app URL (ends in /exec) into FORM_ENDPOINT in config.js and push.
 *
 * Optional: set NOTIFY_EMAIL to get an email for every new lead.
 */
var SHEET_NAME = "Leads";
var NOTIFY_EMAIL = ""; // e.g. "ventas@imara.com.co"

var COLUMNS = [
  "fecha", "nombre", "correo", "telefono", "interes", "habeas_data",
  "pagina", "referrer", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var p = (e && e.parameter) || {};
    if (!p.nombre || !p.correo || p.habeas_data !== "acepto") {
      return json({ ok: false, error: "missing fields" });
    }
    var sheet = getSheet();
    var row = COLUMNS.map(function (c) {
      if (c === "fecha") return new Date();
      return String(p[c] || "").slice(0, 500);
    });
    sheet.appendRow(row);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(NOTIFY_EMAIL, "Nuevo registro Imara: " + p.nombre,
        COLUMNS.map(function (c, i) { return c + ": " + row[i]; }).join("\n"));
    }
    return json({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json({ ok: true, service: "imara-leads" });
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
