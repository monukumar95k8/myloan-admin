import nodemailer from "nodemailer";
import { db } from "@/lib/firebase/config";
import { getDoc, doc } from "firebase/firestore";

export async function POST(req) {
    let body = await req.json();
    let { to, name, amount, refId, tenure } = body;
    console.log(body, "BODY");
    try {
        let docRef = doc(db, "queries", refId);
        let document = await getDoc(docRef);
        document = document.data();
        console.log(document, "Document")
        const transporter = nodemailer.createTransport({
            host: 'smtpout.secureserver.net', // Correct host for Gmail
            port: 465,             // SMTP port
            secure: true,  // Use TLS
            auth: {
                user: "support@dhaniloanservice.co.in", // Your email address
                pass: "260198@Deboto"
                , // Your email password or app-specific password
            },
        });

        let date = new Date();
        let threeDaysAhead = new Date(date.setDate(date.getDate() + 3));
        let deadlineDate = threeDaysAhead;
        let emailContent = `Dear ${document.name},

We hope this email finds you well! It brings us immense joy to inform you that your loan account with us has been successfully closed. 🎉

Your consistent and timely payments have made this journey smooth, and we are pleased to issue your No Objection Certificate (NOC) as a formal acknowledgment of your completed repayment.

Details of Your Loan Account:
1. Loan Account Number: ${refId}
2. Loan Amount: ${document.loanamount}
3. Repayment Completion Date: ${date}
The NOC is attached to this email as a PDF document. Please keep this certificate safe for your records. It confirms that you have no outstanding liabilities related to this loan and that the account is officially closed.

What’s Next?
1. Verify Your Records: If you notice any discrepancies or have questions, feel free to contact us.
2. Future Financial Goals: We're here to support you with new financial products and services as you plan your next big milestone.
Thank you for trusting us to be a part of your financial journey. We value your relationship with us and look forward to serving you in the future.

If you need assistance or have any questions, feel free to reach out to us at support@dhanifl.com.

Let’s Celebrate This Milestone Together!
Completing a loan repayment is a significant achievement, and we are proud to have been your partner throughout this process. Here’s to many more successes ahead! 🥂

Warm regards,
Naveen Mahto
Relation Manager (Loan department)
Dhani Finance PVT LTD
support@dhanifl.com

P.S. If you’d like to explore our other financial products, don’t hesitate to get in touch. We’d be delighted to assist you in achieving your next goal! 😊`

        // Define email options
        const mailOptions = {
            from: "support@dhaniloanservice.co.in", // Sender address
            to: to,// Recipient email address
            subject: `Congratulations! Your Loan is Fully Repaid – NOC Issued!`, // Email subject
            text: emailContent, // Plain text body
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        return new Response(JSON.stringify({ message: "Email Sent!" }), { status: 200 });
    } catch (error) {
        console.error("Error sending email:", error);
        return new Response(JSON.stringify({ message: "Error in senfing email" }), { status: 500 });
    }
}
