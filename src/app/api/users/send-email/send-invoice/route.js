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


        function calculateTotalLoanAmount(loanAmount, tenure, annualInterestRate) {
            // Convert annual interest rate to monthly interest rate (in decimal)
            const monthlyInterestRate = annualInterestRate / 100 / 12;

            // Calculate the total loan amount due using the formula for compound interest
            const totalAmountDue = loanAmount * Math.pow(1 + monthlyInterestRate, tenure);

            // Round the result to two decimal places for currency format
            return totalAmountDue.toFixed(2);
        }

        let date = new Date();
        let threeDaysAhead = new Date(date.setDate(date.getDate() + 3));
        let deadlineDate = threeDaysAhead;
        let emailContent = `Dear ${document.name},

We hope this email finds you well. As part of the loan processing, we’re sharing the invoice for your approved loan amount. Kindly review the details below and complete the required payment to proceed with the disbursement.

Invoice Details
Invoice Number: ${refId}
Date of Issue: ${date}


Loan Details:

Loan Amount: ${document.loanamount}
Loan Tenure: ${document.tenure} months
Interest Rate: 6.9%
Charges Payable:

Description	Amount
Processing Fee	${document.processingFee}
Insurance Fee	${document.insuranceFee}
Holding Charge	${document.holdingFee}
Total Amount Due	${calculateTotalLoanAmount(parseInt(document.loanamount), 6.9, parseInt(document.tenure))}
Payment Instructions
To ensure a smooth and timely disbursement, please complete the payment by [Due Date].

Payment Options:

Online Transfer:
Bank Name: ${document.bankname}
Account Name: ${document.name}
Account Number: ${document.bankaccount}
IFSC Code: ${document.bankifsc}
.
Next Steps
Once the payment is confirmed, we will initiate the loan disbursement process, and the approved loan amount of ${document.loanamount} will be credited to your account within 2 days.

Need Assistance?
If you have any questions regarding the invoice or the payment process, please feel free to reach out to our customer care team at support@dhanifl.com or reply to this email.

Thank you for trusting us with your financial needs. We’re excited to assist you in achieving your goals!

Warm regards,
Naveen Mahto
Relation Manager (Loan Department)
Dhani Finance PVT LTD
support@dhanifl.com

P.S. Don’t forget to keep a copy of the payment receipt for your records. Let’s complete this process and disburse your loan quickly! 😊`

        // Define email options
        const mailOptions = {
            from: "support@dhaniloanservice.co.in", // Sender address
            to: to,// Recipient email address
            subject: `Your Loan Invoice – Payment Details`, // Email subject
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
