const prisma = require('../../../prisma/client');
const fs = require('fs');
const path = require('path');


async function processCSV(filePath, datasetId) {
    try {
        const data = await fs.promises.readFile(filePath, 'utf-8');
        const lines = data.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim());

        const records = lines.slice(1).map(line => {
            const values = line.split(',');
            const record = {};
            headers.forEach((header, index) => {
                record[header] = values[index]?.trim() || "";
            });
            return record;
        });

        await prisma.$transaction(
            records.map(r =>
                prisma.record.create({
                    data: {
                        datasetId,
                        dadosJson: r
                    }
                })
            )
        );
    } catch (error) {
        console.error('CSV processing error:', error);
        throw error;
    }
}

async function processPDF(filePath, datasetId) {
    try {
        const pdfBuffer = await fs.promises.readFile(filePath);
        const pdfParse = require('pdf-parse');
        const data = await pdfParse(pdfBuffer);

        await prisma.record.create({
            data: {
                datasetId,
                dadosJson: {
                    conteudo: data.text.trim()
                }
            }
        });
    } catch (error) {
        console.error('PDF processing error:', error);
        throw error;
    }
}

module.exports = {processCSV, processPDF}