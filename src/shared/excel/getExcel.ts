import * as ExcelJS from 'exceljs';
import { join } from 'path';

/**
 * @param filepath 
 * workbook: 工作簿
 * worksheet: 工作表
 * row: 行
 * cell: 单元格
 * file: Express.Multer.File
 */
export async function getExcel(file: Express.Multer.File) {
    // 初始化一个 workbook
    const workbook = new ExcelJS.Workbook();
    
    // 读取上传的文件
    // const configFilePath = join(process.cwd(), 'src/shared/excel/data.xlsx');
    const workbook2 = await workbook.xlsx.readFile(file.path);
    if(workbook.worksheets.length === 0) {
        return []
    }
    let rows = [];
    // 第一种开始
    // 获取
    const worksheet = workbook.getWorksheet(1);
    worksheet.eachRow((row, rowNumber) => {
        rows.push(row.values);
    });
    // 第一种方式结束
    
    // 第二种方式获取开始
    // workbook2.eachSheet((sheet, index1) => {
    //     console.log('工作表' + index1);
    //     const value = sheet.getSheetValues();
    //     console.log(value)
    //     rows = value;
    //     // // 下面是获取每一行的数据
    //     // sheet.eachRow((row, index2) => {
    //     //     console.log('行' + index2);
            
    //     //     const rowData = [];
    //     //     row.eachCell((cell, index3) => {
    //     //         rowData.push(cell.value);
    //     //     });

    //     //     console.log('行' + index2, rowData)
    //     // })
    // })
    // 第二种方式获取结束
    return rows;
}
