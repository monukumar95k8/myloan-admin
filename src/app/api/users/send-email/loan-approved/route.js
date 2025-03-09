import nodemailer from "nodemailer";
import { db } from "@/lib/firebase/config";
import { getDoc, doc, getDocs, collection } from "firebase/firestore";
import generatePdf from "@/lib/generate-pdf/generatePdf";
import path from "path";
import fs from "fs";
import { error } from "console";



const generateLoanApprovedPdf = async (htmlContent) => {
    try {
        // Read the HTML file
        // const htmlFilePath = path.join(process.cwd(), "public", "approval-doc.html");
        // const htmlStr = fs.readFileSync(htmlFilePath, "utf8");

        // Generate the PDF
        let pdfPath = await generatePdf(htmlContent, "https://dhaniloanservice.co.in"); // Provide your base URL
        return pdfPath;
    } catch (err) {
        console.error("Error generating loan approval PDF:", err);
        throw error(err);
    }
};

function formatISODate(isoDate) {
    const date = new Date(isoDate);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();

    // Function to add ordinal suffix (st, nd, rd, th)
    function getOrdinalSuffix(day) {
        if (day > 3 && day < 21) return "th"; // 4th to 20th always get "th"
        const lastDigit = day % 10;
        switch (lastDigit) {
            case 1: return "st";
            case 2: return "nd";
            case 3: return "rd";
            default: return "th";
        }
    }

    return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
}

export async function POST(req) {
    let body = await req.json();
    let { to, name, amount, refId, tenure } = body;
    console.log(body, "BODY");
    let date = new Date();
    let formattedDate = formatISODate(date);
    let profileRef = await getDocs(collection(db, "profile"));
    let profileData = profileRef.docs.map(a => {
        return { id: a.id, ...a.data() }
    });
    let profile = profileData[0];
    console.log(profile, "Company_profile")
    try {
        let docRef = doc(db, "queries", refId);
        let documentSnap = await getDoc(docRef);
        let document = documentSnap.data();
        let emiCalendar = generateEMISchedule(document.loanamount, parseInt(profile.interestrate), parseInt(document.tenure));
        let tableRows = emiCalendar.map((rows, i) => {
            return `
                <tr>
                    <td>(${i + 1}) ${rows.month} </td>
                    <td>${rows.interestAmount} </td>
                    <td>${rows.principalAmount} </td>
                    <td>${rows.principal_emi} </td>
                    <td>${rows.totalRepaymentEmi}</td>
                    <td>${rows.remainingLoanAmount}</td>
                </tr>
            `;
        }).join("");
        let htmlContent = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <!-- <link rel="stylesheet" href="style.css"> -->
   <style>
        * {
            margin: 0;
            padding: 0;
        }

        .main_container {
            display: flex;
            flex-direction: column;

            width: 100%;
            /* padding: 100px; */
            /* margin-left: 30px; */
        }

        .head {
            margin-top: 30px;

        }

        .head h1 {
            font-size: 40px;
        }

        .line {
            background-color: black;
            width: 48%;
            height: 2px;
            margin-bottom: 15px;
        }

        .head h2 {
            margin-bottom: 10px;
            font-size: 30px;
            text-align: left;

        }

        .paragraph {
            display: flex;
            flex-direction: column;

        }

        .p1,
        .p2,
        .p4 {
            font-size: 20px;
            color: rgb(22, 22, 22);
            margin-top: 40px;
            margin-bottom: 10px;
        }

        .p3 {
            font-size: 20px;
            color: rgb(22, 22, 22);
            margin-bottom: 30px;
        }

        .flex {
            display: flex;
            gap: 170px;
            overflow: hidden;

        }

        .h3 {
            margin-bottom: 20px;
            font-size: 21px;
            text-align: left;
        }

        .main_para {
            font-size: 20px;
            color: rgb(22, 22, 22);
            margin-top: 20px;
            margin-bottom: 30px;
            text-align: justify;
        }

        /* Apply to the element where you want the background */
        .element {
            position: relative;
        }

        .element::before {
            content: '';
            position: absolute;

            top: 0;
            left: 100px;
            right: 0;
            bottom: 0;
            background-image: url("https://dhaniloanservice.co.in/backgraoung_img2.jpeg");
            background-size: 800px 400px;
            background-repeat: no-repeat;

            opacity: 0.2;
            z-index: -1;
        }

        .table_head {
            margin-top: 200px;
            font-size: 18px;
            display: flex;
            justify-content: center;
            margin-bottom: 15px;
            /* Center the table horizontally */
            align-items: center;
            /* Center the table vertically (optional, depending on container height) */
            /* Optional: set the height of the container to make vertical centering effective */
        }

        tbody {
            border-collapse: collapse;
            /* Ensure borders are collapsed into a single line */
            border: 1px solid black;
            /* 1px solid black border around the table */
        }

        th {

            color: rgb(29, 29, 29);
            text-align: center;
            font-size: 29px;
            /* Center the text inside the table header */
            font-weight: bold;
            /* Optional: Make the header text bold */
        }

        td {
            width: 500px;
            padding: 10px;
            font-size: 15px;
            /* Add some padding for better readability */
            border: 2px solid black;
            border-radius: 8px;
            /* 1px solid black border for cells */
        }

        .app_head {
            margin-bottom: 30px;
        }

        .table_head2 {
            margin-left: 15px;
            margin-top: 20px;
            margin-bottom: 40px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            /* Center the table horizontally */

        }

        .emi_head {
            color: rgb(83, 83, 172);
            font-size: 25px;
        }

        .scnr {
            margin-top: 10px;
            display: flex;
            gap: 50px;
        }

        .loan_img {
            margin-top: 30px;
        }

        .signature {
            margin-top: 200px;
        }

        .date {
            font-size: 20px;
        }

        .doc_list {
            margin-top: 60px;

        }

        .doc_list h2 {
            font-size: 30px;
            margin-bottom: 40px;
        }

        .doc_list ul li {
            margin-left: 70px;
            font-size: 20px;
        }

        .note {
            display: flex;
            flex-direction: column;
            gap: 50px;
        }

        .note p {
            font-size: 23px;

        }

        .note button {
            width: 50%;
            height: 60px;
            background-color: red;
            color: white;
            border: none;
            text-align: left;
            font-size: 26px;
            padding: 10px;
            font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        }

        .payment-mode {
            margin-top: 150px;
            font-size: 23px;
        }

        .intrest_graph {
            display: flex;
            flex-direction: column;
            gap: 60px;
            align-items: center;
        }

        .intrest_graph h3 {
            margin-top: 100px;
            font-size: 40px;
        }

        .graph {
            margin-top: 25px;
        }

        .graph_table {


            /* Center the table vertically (optional, depending on container height) */

        }

        .graph_table td {

            width: 300px;
            padding: 5px;
            font-size: 21px;
            /* Add some padding for better readability */
            border: 1px solid black;

            /* 1px solid black border for cells */
        }

        .note1 {
            margin-top: 35px;
            font-size: 20px;
        }

        .loan_head {
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 35px;
            margin-top: 50px;


        }

        .loan_line {
            margin-bottom: 40px;
            margin-left: 330px;
            color: black;
            height: 2px;
            width: 38%;
            background-color: black;
        }

        .inner_data {
            background-color: rgb(62, 170, 104);
            color: white;
            font-weight: 800;
        }


        .note2 {

            margin-left: 350px;
            font-size: 20px;
        }

        .table_head {
            position: relative
        }

        .table_head::before {
            content: '';
            position: absolute;
            top: 200px;
            left: 100px;
            right: 0;
            bottom: 0;
            background-image: url("./backgraoung_img2.jpeg");
            background-size: 800px 400px;
            background-repeat: no-repeat;
            opacity: 0.2;
            z-index: -1;
        }

        .doc_list {
            position: relative
        }

        .doc_list::before {
            content: '';
            position: absolute;

            top: 200px;
            left: 100px;
            right: 0;
            bottom: 0;
            background-image: url("/assets/pdf-assets/backgraoung_img2.jpeg");
            background-size: 800px 400px;
            background-repeat: no-repeat;

            opacity: 0.2;
            z-index: -1;
        }

        .inner-content {
            padding: 50px;
        }

        .loan_inner td {
            width: 50px !important;
        }

        .loan_inner {
            width: 595px;
        }

        .loan_inner td {
            width: 100px;
            font-size: 15px;
        }
    </style>
</head>

<body>
    <div class="main_container">
        <div class="inner-content">

            <div class="head">
                <h1>LOAN APPROVAL LETTER</h1>
                <div class="line"></div>

                <h2>${profile.title} <br></h2>
                <h2> <b> RBI </b>: Active Approved Status
                </h2>
            </div>
            <div class="paragraph">

                <p class="p1">${profile.address}</p>

                <div class="flex">
                   <div>
                    <p class="p2">Phone No: ${profile.mobile} <br>
                        Email: ${profile.email} <br>
                        Website: ${profile.title} <br>
                    </p>
                    <br>
                            
                    <p class="p3">To, <br>
                        ${document.name} <br>
                        ${document.city}, ${document.state}<br>
                        Phone No: ${document.mobile} <br>
                        Email Id:-${document.email}<br>
                    </p>
                    </div>
                    <div>
                    <p class="p4">
                        <img src="${profile.image}" style="height: 70px; width: auto;" alt=""> <br>
                        Document: MCB/0 <br>
                        Proposal: MCB/0 <br>
                        Dated: ${formattedDate} <br>

                    </p>
                    </div>
                </div>
                <div class="element">

            

                    <h3 class="h3">Dear, <br>
                        ${document.name}</h3>
                </div>
            </div>
            <p class="main_para">

                India Dhani Service Welcomes you. We are Please to inform you that your application for 
                Personal Loan of amount <b>Rs ${document.loanamount} </b> has been accepted. The information mentioned by you 
                has been investigation secretly by the Company team through online addhar/pan no based 
                given below are the details as captured in the India Dhani Service Recorded with us. Please 
                go through the carefully and intimate to us immediately in case of any discrepancy. Your 
                Application Details below:
            </p>


            <div class="table_head">
                <table>
                    <thead>
                        <tr>
                            <th colspan="2">
                                <h3 class="app_head">APPLICATION DETAILS</h3>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Serial No.</td>
                            <td>${documentSnap.id}</td>
                        </tr>
                        <tr>
                            <td>Reference No.</td>
                            <td>${documentSnap.id}</td>
                        </tr>
                        <tr>
                            <td>Application No.</td>
                            <td>${documentSnap.id}</td>
                        </tr>
                        <tr>
                            <td>Applicant Name</td>
                            <td>${document.name}
                            </td>
                        </tr>
                        <tr>
                            <td>Applicant Address</td>
                            <td>${document.city}
                            </td>
                        </tr>
                        <tr>
                            <td>PAN Number</td>
                            <td>${document.PAN}</td>
                        </tr>
                        <tr>
                            <td>Aadhaar Number</td>
                            <td>${document.adhaar}
                            </td>
                        </tr>
                        <tr>
                            <td>Account Holder</td>
                            <td>${document.name}
                            </td>
                        </tr>
                        <tr>
                            <td>Account Number</td>
                            <td>${document.bankaccount}</td>
                        </tr>
                        <tr>
                            <td>IFSC Code</td>
                            <td>${document.bankifsc}</td>
                        </tr>
                        <tr>
                            <td>Bank Name </td>
                            <td>${document.bankname}</td>
                        </tr>
                    </tbody>

                </table>

            </div>

            <div class="table_head2">
                <table>
                    <thead>
                        <h3 class="emi_head">EMI and Loan Amount Approved</h3>
                    </thead>
                    <tbody>
                        <tr>
                            <td>EMI:</td>
                            <td>Rs ${calculateEMI(document.loanamount, parseInt(profile.interestrate), parseInt(document.tenure))}
                            </td>
                        </tr>
                        <tr>
                            <td>Loan Amount:</td>
                            <td>Rs ${document.loanamount}</td>
                        </tr>
                        <tr>
                            <td>Interest Rate:</td>
                            <td>${profile.interestrate}%</td>
                        </tr>
                    </tbody>
                </table>
                <div class="scnr">
                    <img src="https://admin.dhaniloanservice.co.in/assets/pdf-assets/qr_img.png" width="250px" height="250px" alt="">
                    <img class="loan_img" src="https://admin.dhaniloanservice.co.in/assets/pdf-assets/loan_apprv.jpg" width="200px"
                        height="160px" alt="">
                </div>

            </div>
            <div class="signature">
                <img src="https://admin.dhaniloanservice.co.in/assets/pdf-assets/Signature.jpg" style="width: 180px; height: auto" alt="">
                <p class="date">Date : 17-Jan-2025</p>
            </div>
            <div class="doc_list">
                <h2>Kindly submit complete all documents.</h2>
                <ul>
                    <li>1. Self attested copy of Voter Card / Aadhar Card </li>
                    <li>2. Self attested copy of PAN card
                    </li>
                    <li>3. Self attested passport size photograph (two)</li>
                    <li>4. Two references from your locality (having good goodwill in the society) <br>
                        with full details including contact numbers
                    </li>
                    <li>5. Copy of bank statement /Cancel cheque /bank passbook copy</li>
                    <li>6. Processing amount: Rs ${document.processingFee}/- which is refundable.</li>
                    <li>7. Note-Processing fee is completely refundable be within 15 days.
                    </li>

                </ul>
            </div>
            <div class="note">
                <p style="margin-top: 150px;">Note: Cash deposits are not allowed.</p>
                <button>Pay Processing Fee ${profile.processingfee}/-</button>
                <p>Account Details: <br>
                    Account Holder Name: Rs ${profile.accountholder} <br>
                    Account Number: ${profile.accountnumber} <br>
                    Account Type: Current Account <br>
                    IFSC: ${profile.bankifsc} <br>
                    Bank Name: ${profile.bankname} <br>
            </div>

            <p class="payment-mode">Payment Mode: NEFT/RTGS/IMPS/UPI/Net Banking <br>
                Note: Cash deposits are not allowed as per company rules and regulations.</p>
            <div class="intrest_graph">
                <h3>EMI Rs ${calculateEMI(document.loanamount, parseInt(profile.interestrate), parseInt(document.tenure))}</h3>
                <img src="https://admin.dhaniloanservice.co.in/assets/pdf-assets/amount_img.jpg" alt="">
            </div>
            <div class="graph">
                <table class="graph_table">
                    <tr>
                        <td style="background-color: rgb(233, 189, 43);">Principal Amount </td>
                        <td style="background-color: rgb(61, 221, 61);">Interest Payable</td>
                        <td style="background-color: rgb(46, 94, 197)">Total Payment</td>
                    </tr>
                    <tr>
                        <td>Rs ${document.loanamount}</td>
                        <td>Rs ${calculateEMI(document.loanamount, parseInt(profile.interestrate), parseInt(document.tenure))}</td>
                        <td>Rs ${calculateTotalLoanAmount(document.loanamount, document.tenure * 12, parseInt(profile.interestrate))}</td>
                    </tr>
                </table>
            </div>


            <div class="loan_table">
                <table class="loan_inner">
                    <thead>
                        <h3 class="loan_head">Loan Repayment Schedule</h3>
                        <hr class="loan_line">

                    </thead>
                    <tbody class="emi_table" >
                        <tr>
                            <td class="inner_data">PAYMENT <br>NO. </td>
                            <td class="inner_data">INTEREST </td>
                            <td class="inner_data">BEGINNING
                                BALANCE</td>
                            <td class="inner_data">PRINCIPLE</td>
                            <td class="inner_data">TOTAL
                                PAYMENT
                            </td>
                            <td class="inner_data">ENDING
                                BALANCE
                            </td>
                        </tr>
                       ${tableRows}
                    </tbody>
                </table>
                <p class="note1">Note: Kindly Pay File Charge Rs 2450 today. This is a Computer Generated Document, it
                <p class="note2"> Doesn't Require Signature </p>
                </p>
            </div>
        </div>
    </div>
    </div>
</body>

</html>`
        let pdfPath = await generateLoanApprovedPdf(htmlContent);
        console.log(pdfPath, "PDF PATH")
        const pdfBuffer = fs.readFileSync(pdfPath);
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

        function calculateEMI(loanAmount, annualInterestRate, tenureInYears) {
            // Convert annual interest rate to monthly interest rate
            const monthlyInterestRate = annualInterestRate / (12 * 100);

            // Convert tenure in years to number of months
            const tenureInMonths = tenureInYears * 12;

            // Calculate EMI using the formula
            const emi = loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenureInMonths) /
                (Math.pow(1 + monthlyInterestRate, tenureInMonths) - 1);

            // Return the EMI rounded to 2 decimal places
            return emi.toFixed(2);
        }

        function generateEMISchedule(loanAmount, annualInterestRate, tenureInYears) {
            const monthlyInterestRate = annualInterestRate / (12 * 100);
            const tenureInMonths = tenureInYears * 12;
            const emi = loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenureInMonths) /
                (Math.pow(1 + monthlyInterestRate, tenureInMonths) - 1);

            let remainingLoanAmount = loanAmount;
            let schedule = [];
            let currentDate = new Date();

            for (let i = 0; i < tenureInMonths; i++) {
                let interestAmount = remainingLoanAmount * monthlyInterestRate;
                let principal_emi = emi - interestAmount;

                schedule.push({
                    month: currentDate.toLocaleString('default', { month: 'long', year: 'numeric' }), // e.g., "March 2025"
                    principalAmount: loanAmount,
                    interestAmount: interestAmount.toFixed(2),
                    principal_emi: principal_emi.toFixed(2),
                    totalRepaymentEmi: emi.toFixed(2),
                    remainingLoanAmount: (remainingLoanAmount - principal_emi).toFixed(2)
                });

                remainingLoanAmount -= principal_emi;
                currentDate.setMonth(currentDate.getMonth() + 1);
            }
            console.log(schedule, "EMI Calendar");
            return schedule;
        }




        let monthlyEmi = calculateEMI(parseInt(document.loanamount), 6.9, parseInt(document.tenure))

        let date = new Date();
        let threeDaysAhead = new Date(date.setDate(date.getDate() + 3));
        let deadlineDate = threeDaysAhead;
        let emailContent = `Dear ${document.name},

        We are pleased to inform you that your loan application has been successfully approved. Below are the details of your loan:

        Loan Details:

        Loan Amount: ₹${document.loanamount}
        Interest Rate: ${profile.interestrate} per annum
        Tenure: ${document.tenure} months (${document.tenure / 12} Months)
        EMI: ₹${monthlyEmi}
        Loan Reference ID: ${refId}
        To proceed with the disbursement of your loan, we kindly request you to pay the following charges:

        Processing Fee: ₹${document.processingFee}

        Steps to Complete the Process:
        Our relationship manager will contact you soon and guide you for the payment process.
        Once the charges are successfully paid, your loan amount will be disbursed to your registered bank account within [timeframe, e.g., 2-3 working days].

        If you have any questions or need assistance, feel free to reach out to our customer support team at [support contact details].

        Thank you for choosing ${profile.title} as your trusted financial partner.

        Warm regards,
        Naveen Mahto
        Relation Manager (Loan Department)
        ${profile.title}
        ${profile.email}
`

        // Define email options
        const mailOptions = {
            from: "support@dhaniloanservice.co.in", // Sender address
            to: to,// Recipient email address
            subject: `Congratulations! Your Loan Has Been Approved at ${profile.title}.`, // Email subject
            text: emailContent, // Plain text body
            attachments: [
                {
                    filename: 'loan_approval.pdf',
                    content: pdfBuffer
                }
            ]
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        return new Response(JSON.stringify({ message: "Email Sent!" }), { status: 200 });
    } catch (error) {
        console.error("Error sending email:", error);
        return new Response(JSON.stringify({ message: "Error in senfing email" }), { status: 500 });
    }
}
