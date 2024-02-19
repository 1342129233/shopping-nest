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
export async function setExcel(rows: any[] = []) {
    // 初始化一个 workbook
    const workbook = new ExcelJS.Workbook();

    // 写入文件开始
    const worksheet = workbook.addWorksheet('data');

    // 通过上传的临时文件处理
    let columns = [
        // { header: 'ID', key: 'id', width: 20 },
        // { header: '姓名', key: 'name', width: 30 },
        // { header: '出生日期', key: 'birthday', width: 30},
        // { header: '手机号', key: 'phone', width: 50 }
    ];
    let data: any[] = [
        // { id: 1, name: '光光', birthday: new Date('1994-07-07'), phone: '13255555555' },
        // { id: 2, name: '东东', birthday: new Date('1994-04-14'), phone: '13222222222' },
        // { id: 3, name: '小刚', birthday: new Date('1995-08-08'), phone: '13211111111' }
    ]
    if(rows.length > 0) {
        columns = [];
        rows[0].forEach(element => {
            columns.push({
                header: element, key: element, width: 50
            })
        });

        const dataList = rows.slice(1);
        data = []
        dataList.forEach(element => {
            const obj = {};
            columns.forEach((item, index) => {
                obj[item.key] = element[index + 1]
            });
            data.push({
                ...obj
            });
        });
        
    }
    worksheet.columns = columns;
    worksheet.addRows(data);

    // Excel设置格式(字体 背景色等), 遍历 row、cell，根据行数设置 style 就好了
    // style 可以设置 font、fill、border、alignment 这些
    worksheet.eachRow((row, rowIndex) => {
        row.eachCell(cell => {
            if(rowIndex === 1) {
                cell.style = {
                    font: {
                        size: 10,
                        bold: true,
                        color: { argb: 'FFFFFF' }
                    },
                    alignment: {
                        vertical: 'middle',
                        horizontal: 'center',
                    },
                    fill: {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: '000000' }
                    },
                    border: {
                        top: { style: 'dashed', color: { argb: '0000ff' } },
                        left: { style: 'dashed', color: { argb: '0000ff' } },
                        bottom: { style: 'dashed', color: { argb: '0000ff' } },
                        right: { style: 'dashed', color: { argb: '0000ff' } }
                    }
                }
            } else {
                cell.style = {
                    font: {
                        size: 10,
                        bold: true,
                    },
                    alignment: { vertical: 'middle', horizontal: 'left' },
                    border: {
                        top: { style: 'dashed', color: { argb: '0000ff' } },
                        left: { style: 'dashed', color: { argb: '0000ff' } },
                        bottom: { style: 'dashed', color: { argb: '0000ff' } },
                        right: { style: 'dashed', color: { argb: '0000ff' } }
                    }
                }
            }
        })
    })

    workbook.xlsx.writeFile(`src/common/excel/data.xlsx`); 
    // // 写入文件结束
    return rows;
}
