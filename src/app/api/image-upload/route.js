import { put } from '@vercel/blob';
import path from "path";

export async function POST(request) {
    try {
        // Parse form data
        let data = await request.formData();
        let file = data.get('image');

        // Check if file is present
        if (file) {
            // Create a unique filename
            let timestamp = Date.now();
            let originalFilename = file.name;
            // let fileExtension = path.extname(originalFilename);
            let filename = `${timestamp}-${originalFilename}`;
            // Upload to Vercel Blob
            const blobResponse = await put(filename, file, {
                access: 'public',
            });

            // const imageUrl = `https://${process.env.VERCEL_PROJECT_ID}.vercel.app/api/blob/${filename}`;
            console.log(blobResponse.url);
            return new Response(JSON.stringify({ message: `File uploaded successfully: ${filename}`, imgUrl: blobResponse.url }), { status: 200 });
        } else {
            return new Response(JSON.stringify({ message: "File not found!" }), { status: 400 });
        }
    } catch (err) {
        console.log(err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}