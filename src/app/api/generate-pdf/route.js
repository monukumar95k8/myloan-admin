
import fs from 'fs';
import path from 'path';
import chromium from '@sparticuz/chromium';

//comment

let puppeteer;
if (process.env.AWS_LAMBDA_FUNCTION_VERSION || process.env.NODE_ENV === "production") {
    puppeteer = require("puppeteer-core");
} else {
    puppeteer = require("puppeteer");
}

export default async function POST(req, res) {
    if (req.method === 'POST') {
        const { htmlContent } = req.body;

        try {
            let options = {};

            if (process.env.AWS_LAMBDA_FUNCTION_VERSION || process.env.NODE_ENV === "production") {
                options = {
                    args: chromium.args,
                    executablePath: await chromium.executablePath(),
                    headless: chromium.headless,
                };
            } else {
                options = {
                    headless: true,
                    args: ['--no-sandbox', '--disable-setuid-sandbox'],
                };
            }

            // Launch Puppeteer browser
            const browser = await puppeteer.launch(options);
            const page = await browser.newPage();
            await page.setContent(htmlContent);

            // Generate PDF
            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
            });

            await browser.close();

            // Save the PDF in the writable `/tmp` directory
            const fileName = `receipt_${Date.now()}.pdf`;
            const localPath = path.join('/tmp', fileName);

            fs.writeFileSync(localPath, pdfBuffer);



            // Respond with the path
            return new Response(JSON.stringify({ message: "PDF generated successfully!" }), { status: 200 })
            // res.status(200).json({
            //     message: 'PDF generated successfully!',
            //     filePath: localPath, // Temporary path for the generated PDF
            // });
        } catch (error) {
            console.error('Error generating PDF:', error);
            return new Response(JSON.stringify({ message: "Error in generating PDF", error: JSON.stringify(error) }), { status: 500 })
            // res.status(500).json({ error: `Failed to generate PDF: ${error.message}` });
        }
    } else {
        return new Response(JSON.stringify({ error: "Method Not Allowed" }), { status: 405 })
        // res.status(405).json({ error: 'Method Not Allowed' });
    }
}
