import ExcelJS from "exceljs";

export const exportToExcel = (data, sheetName) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(sheetName);

    if (data.length) {
        sheet.columns = Object.keys(data[0]).map(key => ({ header: key, key }));
        sheet.addRows(data);
    }

    return workbook.xlsx.writeBuffer();
};