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

We’re excited to inform you that your loan application has been approved and is ready for disbursement! 🎉 However, before we can proceed with transferring the loan amount of ${document.loanamount} to your account, there’s one final and essential step to complete.

Insurance Fee Payment – Secure Your Loan
As part of the loan process, payment of the insurance fee is required. This fee ensures that your loan is protected, giving you and your loved ones peace of mind.

In the unlikely event that you’re unable to repay the loan due to unforeseen circumstances, this insurance guarantees that the outstanding amount will be covered, ensuring a hassle-free resolution.

Here are the details for the insurance fee:
1. Insurance Fee Amount: ${document.insuranceFee}
2. Payment Deadline: ${deadlineDate}
3. How to Pay: Our customer support team will contact you soon, and will guide you for the payment.

Why is this Fee Mandatory?
1. Protection: Safeguard your financial obligations and avoid passing on any burden to your loved ones.
2. Loan Disbursement Requirement: Payment of the insurance fee is a mandatory step before disbursing the approved loan amount.
3. No Delays: Completing this payment now ensures that the loan is credited to your account without delay.

Act Now to Receive Your Loan Amount Quickly
Once the insurance fee is received, we’ll initiate the transfer process, and the funds will be in your account within 2 days.

To make the payment, click on the secure payment link below:
[Payment Link]

If you have any questions about the insurance fee or need assistance, please don’t hesitate to contact us at [Contact Number] or [Email Address]. Our team is here to assist you at every step of the way!

Your Peace of Mind Matters to Us
This insurance fee is not just a formality—it’s your safeguard against unexpected challenges. Let’s secure your financial future together!

Thank you for choosing us as your trusted financial partner. We’re looking forward to completing this process and disbursing your loan at the earliest.

Warm regards,
Naveen Mahto
Relation Manager
Dhani Finance PVT LTD
dhaniloanservice.co.in

P.S. Complete your insurance fee payment today and take the final step toward your approved loan! 😊`

        // Define email options
        const mailOptions = {
            from: "dhaniloanservice.co.in", // Sender address
            to: to,// Recipient email address
            subject: `Important Update: Mandatory Insurance Fee for Your Loan Disbursement`, // Email subject
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
