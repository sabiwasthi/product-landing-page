import fs from "node:fs";
import path from "node:path";
import { google } from "googleapis";

const root = process.cwd();
const envPath = path.join(root, ".env.local");

function loadEnvFile(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex === -1) continue;

    const key = trimmed.slice(0, equalsIndex);
    let value = trimmed.slice(equalsIndex + 1);
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const headers = [
  "Order ID",
  "Date & Time",
  "Customer Name",
  "Phone Number",
  "Email Address",
  "Exact Location",
  "Product Name",
  "Quantity",
  "Price Per Piece",
  "Total Price",
  "Payment Method",
  "Order Status",
  "Notes"
];

const statusOptions = ["New Order", "Order Confirmed", "Order Ongoing", "Delivered", "Cancelled"];

loadEnvFile(envPath);

const spreadsheetId = requiredEnv("GOOGLE_SHEET_ID");
const tabName = process.env.GOOGLE_SHEET_TAB_NAME || "Soap order";
const auth = new google.auth.JWT({
  email: requiredEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL"),
  key: requiredEnv("GOOGLE_PRIVATE_KEY").replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"]
});

const sheets = google.sheets({ version: "v4", auth });

const spreadsheet = await sheets.spreadsheets.get({
  spreadsheetId,
  fields: "sheets.properties"
});

const tabs = spreadsheet.data.sheets || [];
const sheet =
  tabs.find((entry) => entry.properties?.title === tabName) ||
  tabs.find((entry) => entry.properties?.title?.trim().toLowerCase() === tabName.trim().toLowerCase()) ||
  tabs[0];

if (sheet?.properties?.sheetId === undefined || !sheet.properties.title) {
  throw new Error("Could not find a sheet tab to format.");
}

const sheetId = sheet.properties.sheetId;
const resolvedTabName = sheet.properties.title;

const firstRow = await sheets.spreadsheets.values.get({
  spreadsheetId,
  range: `'${resolvedTabName}'!A1:M1`
});

const currentHeaders = firstRow.data.values?.[0] || [];
const hasExpectedHeaders = headers.every((header, index) => currentHeaders[index] === header);

if (!hasExpectedHeaders && currentHeaders.some(Boolean)) {
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          insertDimension: {
            range: {
              sheetId,
              dimension: "ROWS",
              startIndex: 0,
              endIndex: 1
            },
            inheritFromBefore: false
          }
        }
      ]
    }
  });
}

await sheets.spreadsheets.values.update({
  spreadsheetId,
  range: `'${resolvedTabName}'!A1:M1`,
  valueInputOption: "RAW",
  requestBody: {
    values: [headers]
  }
});

await sheets.spreadsheets.batchUpdate({
  spreadsheetId,
  requestBody: {
    requests: [
      {
        updateSheetProperties: {
          properties: {
            sheetId,
            gridProperties: {
              frozenRowCount: 1
            },
            tabColor: {
              red: 0.19,
              green: 0.47,
              blue: 0.16
            }
          },
          fields: "gridProperties.frozenRowCount,tabColor"
        }
      },
      {
        repeatCell: {
          range: {
            sheetId,
            startRowIndex: 0,
            endRowIndex: 1,
            startColumnIndex: 0,
            endColumnIndex: headers.length
          },
          cell: {
            userEnteredFormat: {
              backgroundColor: {
                red: 0.15,
                green: 0.37,
                blue: 0.14
              },
              horizontalAlignment: "CENTER",
              verticalAlignment: "MIDDLE",
              textFormat: {
                foregroundColor: {
                  red: 1,
                  green: 1,
                  blue: 1
                },
                bold: true,
                fontSize: 11
              },
              wrapStrategy: "WRAP"
            }
          },
          fields:
            "userEnteredFormat(backgroundColor,horizontalAlignment,verticalAlignment,textFormat,wrapStrategy)"
        }
      },
      {
        updateDimensionProperties: {
          range: {
            sheetId,
            dimension: "ROWS",
            startIndex: 0,
            endIndex: 1
          },
          properties: {
            pixelSize: 42
          },
          fields: "pixelSize"
        }
      },
      ...[
        150, 170, 180, 145, 220, 310, 170, 90, 130, 130, 170, 155, 260
      ].map((pixelSize, index) => ({
        updateDimensionProperties: {
          range: {
            sheetId,
            dimension: "COLUMNS",
            startIndex: index,
            endIndex: index + 1
          },
          properties: {
            pixelSize
          },
          fields: "pixelSize"
        }
      })),
      {
        setBasicFilter: {
          filter: {
            range: {
              sheetId,
              startRowIndex: 0,
              startColumnIndex: 0,
              endColumnIndex: headers.length
            }
          }
        }
      },
      {
        repeatCell: {
          range: {
            sheetId,
            startRowIndex: 1,
            startColumnIndex: 0,
            endColumnIndex: headers.length
          },
          cell: {
            userEnteredFormat: {
              verticalAlignment: "MIDDLE",
              wrapStrategy: "WRAP",
              textFormat: {
                foregroundColor: {
                  red: 0.12,
                  green: 0.25,
                  blue: 0.12
                },
                fontSize: 10
              }
            }
          },
          fields: "userEnteredFormat(verticalAlignment,wrapStrategy,textFormat)"
        }
      },
      {
        repeatCell: {
          range: {
            sheetId,
            startRowIndex: 1,
            startColumnIndex: 8,
            endColumnIndex: 10
          },
          cell: {
            userEnteredFormat: {
              numberFormat: {
                type: "NUMBER",
                pattern: '"Rs" #,##0'
              },
              horizontalAlignment: "RIGHT"
            }
          },
          fields: "userEnteredFormat(numberFormat,horizontalAlignment)"
        }
      },
      {
        repeatCell: {
          range: {
            sheetId,
            startRowIndex: 1,
            startColumnIndex: 7,
            endColumnIndex: 8
          },
          cell: {
            userEnteredFormat: {
              horizontalAlignment: "CENTER"
            }
          },
          fields: "userEnteredFormat.horizontalAlignment"
        }
      },
      {
        setDataValidation: {
          range: {
            sheetId,
            startRowIndex: 1,
            startColumnIndex: 11,
            endColumnIndex: 12
          },
          rule: {
            condition: {
              type: "ONE_OF_LIST",
              values: statusOptions.map((userEnteredValue) => ({ userEnteredValue }))
            },
            showCustomUi: true,
            strict: true
          }
        }
      },
      {
        addBanding: {
          bandedRange: {
            range: {
              sheetId,
              startRowIndex: 0,
              startColumnIndex: 0,
              endColumnIndex: headers.length
            },
            rowProperties: {
              headerColor: {
                red: 0.15,
                green: 0.37,
                blue: 0.14
              },
              firstBandColor: {
                red: 0.96,
                green: 0.99,
                blue: 0.96
              },
              secondBandColor: {
                red: 1,
                green: 1,
                blue: 1
              }
            }
          }
        }
      }
    ]
  }
});

console.log(`Formatted spreadsheet tab: ${resolvedTabName}`);
