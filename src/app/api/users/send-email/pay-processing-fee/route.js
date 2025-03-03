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

We hope this email finds you in great spirits! 🌟

We have some fantastic news to share with you – your loan application has been approved! 🎉 You’re now one step closer to achieving your goals, whether it's that dream home, an exciting venture, or simply a financial boost.

To ensure that the approved loan amount of ${document.loanamount} is swiftly disbursed to your account, we kindly request you to complete the final step:

Processing Fee Payment
The processing fee ensures that your loan is finalized and ready for disbursement without any delays. Here’s what you need to know:

Processing Fee Amount: ${document.processingFee}
Payment Deadline: ${deadlineDate}
How to Pay:
Option 1: Our customer support team will contact you and will ask to pay.

Why Act Now?
Speedy Disbursement: Once the processing fee is paid, the loan amount will be credited to your account within 3 days.
Limited-Time Offer: We’re delighted to offer a special incentive on loans disbursed this month! Complete the payment now and enjoy [incentive or benefit, e.g., lower interest rate for the first month].
Hassle-Free Experience: Our team is here to assist you at every step to make the process seamless and straightforward.
Your Dreams Are Just a Payment Away
Imagine the possibilities once the funds are in your account – we’re as excited as you are to see your plans take shape!

To proceed, click on the secure payment link below or connect with our team for assistance:
[Payment Link]

If you have any questions or need support, feel free to reach out to us at [Contact Number] or support@dhanifl.com. Our friendly team is ready to help you 24/7.

Thank you for choosing us to be part of your journey. Let’s make this happen together!

Warm regards,
Naveen Mahto
Relation Manager (Loan Department)
Dhani Finance PVT LTD
support@dhanifl.com

P.S. Don’t miss out on this opportunity to unlock your financial potential. Pay the processing fee today, and let’s make your dreams a reality! ✨`

        // Define email options
        const mailOptions = {
            from: "support@dhaniloanservice.co.in", // Sender address
            to: to,// Recipient email address
            subject: `Exciting News! Your Loan is Approved – Just One Step Away!`, // Email subject
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
