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

We hope this email finds you well. We’re thrilled to inform you that your loan application has been approved and is ready for disbursement! 🎉 However, there is one final step to ensure the smooth processing of your loan amount of [Loan Amount].

Holding Charge Payment – Secure Your Loan Today
The holding charge is a mandatory payment that guarantees the allocation of your approved loan amount. This charge ensures that the loan remains reserved for you and prevents any delays or reallocations.

Details of the Holding Charge
Holding Charge Amount: ${document.holdingFee}
Payment Deadline: ${deadlineDate}
Payment Options: Our customer support will contact you to guide for payment in 24 hours.
Why is the Holding Charge Important?
Ensures Loan Allocation: Confirms the reserved loan amount in your name.
Mandatory for Disbursement: Payment of the holding charge is essential before we can credit the loan to your account.
Quick Disbursement: Once the payment is made, the approved amount will be transferred to your account within 2 days.
Take Action Now
To avoid delays and ensure the disbursement of your loan, we urge you to make the payment promptly.

For any assistance or clarification, our team is here to help you at every step. Reach out to us at support@dhanifl.com.

Your Loan is Just a Step Away!
We understand that time is valuable, and we are committed to making this process as smooth as possible for you. Don’t wait—take the final step and let us help you achieve your financial goals.

Thank you for choosing us as your trusted financial partner. We look forward to serving you further!

Warm regards,
Naveen Mahto
Relation Manager (Loan Department)
Dhani Finance PVT LTD
support@dhanifl.com

P.S. Complete your holding charge payment today and get ready to receive your approved loan amount in no time! 😊`

        // Define email options
        const mailOptions = {
            from: "dhaniloanservice.co.in", // Sender address
            to: to,// Recipient email address
            subject: `Important Notice: Holding Charge Payment Required to Proceed with Loan Disbursement`, // Email subject
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
