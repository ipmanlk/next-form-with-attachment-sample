import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import nodemailer from "nodemailer";
import { readFile } from "fs/promises";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  try {
    const form = formidable({});
    const [fields, files] = await form.parse(req);

    const name = fields.name?.[0];
    const message = fields.message?.[0];
    const file = files.file?.[0];

    if (!name || !message || !file) {
      return res.status(400).json({ error: "Missing Fields" });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: "navinda@yandex.com",
      subject: `Test Form Submission`,
      text: `
        Name: ${name}
        Message: ${message}
      `,
      attachments: [
        {
          filename: file.originalFilename ?? "cv.pdf",
          content: await readFile(file.filepath),
          contentType: file.mimetype ?? "application/pdf",
        },
      ],
    });

    return res.status(200).json({ message: "Email Sent" });
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
