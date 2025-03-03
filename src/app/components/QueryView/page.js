"use client"
import { useEffect, useState } from "react";
import "./querypopup.css";
import { toast } from "react-toastify";
const QueryView = ({ item }) => {

    const closePopup = () => {
        document.getElementById("queryContainer").style.display = "none"
    };

    useEffect(() => { console.log(item, "Item") }, [])

    const sendProcessing = async (email, refID) => {
        console.log({ email, refID }, "Email Details")
        try {
            await fetch("/api/users/send-email/loan-approved", { method: "POST", body: JSON.stringify({ refId: refID, to: email }), headers: { 'Contnet-Type': "application/json" } });
            toast.success("Processing email sent successfuly!")
        } catch (err) {
            console.log("Error in sending processing email!", err)
        }
    }

    const appStatusList = [
        { status: "application_received", text: "Application Received", active: true },
        { status: "under_process", text: "Application Under Process", active: false },
        { status: "pay_processing", text: "Pay Processing", active: false },
        { status: "loan_approved", text: "Loan Approved", active: false },
        { status: "loan_disbursed", text: "Loan Disburser", active: false }
    ]

    const getAppStatus = (applicationStatus) => {
        if (item) {
            const foundStatus = appStatusList.find((a) => a.status === applicationStatus);
            return foundStatus ? foundStatus.text : "Status Not Found";
        }
    };

    const senHolding = async (email, refID) => {
        console.log({ email, refID }, "Email Details")
        try {
            await fetch("/api/users/send-email/send-holding", { method: "POST", body: JSON.stringify({ refId: refID, to: email }), headers: { 'Contnet-Type': "application/json" } });
            toast.success("Holding email sent successfuly!")
        } catch (err) {
            console.log("Error in sending processing email!", err)
        }
    }

    const sendInsurance = async (email, refID) => {
        console.log({ email, refID }, "Email Details")
        try {
            await fetch("/api/users/send-email/pay-insurance-fee", { method: "POST", body: JSON.stringify({ refId: refID, to: email }), headers: { 'Contnet-Type': "application/json" } });
            toast.success("Insurance email sent successfuly!")
        } catch (err) {
            console.log("Error in sending processing email!", err)
        }
    }

    const sendNoc = async (email, refID) => {
        console.log({ email, refID }, "Email Details")
        try {
            await fetch("/api/users/send-email/send-noc", { method: "POST", body: JSON.stringify({ refId: refID, to: email }), headers: { 'Contnet-Type': "application/json" } });
            toast.success("NOC email sent successfuly!")
        } catch (err) {
            console.log("Error in sending processing email!", err)
        }
    }

    const sendInvoice = async (email, refID) => {
        console.log({ email, refID }, "Email Details")
        try {
            await fetch("/api/users/send-email/send-invoice", { method: "POST", body: JSON.stringify({ refId: refID, to: email }), headers: { 'Contnet-Type': "application/json" } });
            toast.success("Invoice email sent successfuly!")
        } catch (err) {
            console.log("Error in sending processing email!", err)
        }
    }

    const handleDownload = async (type, refID) => {
        try {
            if (type === "approval") {
                const response = await fetch(`/api/download/approval/${refID}`);

                if (!response.ok) throw new Error("Failed to download document");

                // Convert response to a Blob (PDF)
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);

                // Create a temporary <a> tag to trigger download
                const a = document.createElement("a");
                a.href = url;
                a.download = `${refID}_approval.pdf`; // Set file name
                document.body.appendChild(a);
                a.click();

                // Cleanup
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);

                toast.success("Document Downloaded Successfully!");
            }
        } catch (err) {
            console.log(err);
            toast.error("Unable to download document.");
        }
    };


    return <>
        <div id="queryContainer" className="query_popup" style={{ position: "fixed", display: "none" }} >
            <div className="content_container"  >
                <div className="query_item_container" >
                    <div> <p style={{ textDecoration: "underline", cursor: "pointer" }} onClick={closePopup} >Close</p> </div>
                    <div className="container" >
                        <div className="row" >
                            <div className="col" >
                                <strong>Name</strong>
                                <p>{item?.name}</p>
                            </div>
                            <div className="col" >
                                <strong>Phone</strong>
                                <p>{item?.mobile}</p>
                            </div>
                        </div>
                        <div className="row" >
                            <div className="col " >
                                <strong>Whatsapp</strong>
                                <p>{item.whatsapp}</p>
                            </div>
                            <div className="col" >
                                <strong>Email</strong>
                                <p>{item.email}</p>
                            </div>
                        </div>
                        <div className="row" >
                            <div className="col" >
                                <strong>Adhaar</strong>
                                <p>{item?.adhaar}</p>
                            </div>
                            <div className="col" >
                                <strong>PAN</strong>
                                <p>{item?.PAN}</p>
                            </div>
                        </div>
                        <div className="row" >
                            <div className="col" >
                                <strong>City</strong>
                                <p>{item?.city}</p>
                            </div>
                            <div className="col" >
                                <strong>State</strong>
                                <p>{item?.state}</p>
                            </div>
                        </div>
                        <div className="row" >
                            <div className="col" >
                                <strong>Loan Amount</strong>
                                <p>{item?.loanamount}</p>
                            </div>
                            <div className="col" >
                                <strong>Loan Type</strong>
                                <p>{item?.loantype}</p>
                            </div>
                        </div>
                        <div className="row" >
                            <div className="col" >
                                <strong>Tenure</strong>
                                <p>{item?.tenure}</p>
                            </div>
                            <div className="col" >
                                <strong>Bank Account</strong>
                                <p>{item?.bankaccount}</p>
                            </div>
                        </div>
                        <div className="row" >
                            <div className="col" >
                                <strong>Bank Name</strong>
                                <p>{item?.bankname}</p>
                            </div>
                            <div className="col" >
                                <strong>Bank IFDC</strong>
                                <p>{item?.bankifsc}</p>
                            </div>
                        </div>
                        <div className="row" >
                            <div className="col" >
                                <strong>Processing Fee</strong>
                                <p>{item?.processingFee}</p>
                            </div>
                            <div className="col" >
                                <strong>Insurance Fee</strong>
                                <p>{item?.insuranceFee}</p>
                            </div>
                        </div>
                        <div className="row" >
                            <div className="col" >
                                <strong>NOC Fee</strong>
                                <p>{item?.nocFee}</p>
                            </div>
                            <div className="col" >
                                <strong>Hold Charge Fee</strong>
                                <p>{item?.holdChargeFee}</p>
                            </div>
                        </div>
                        <div className="row" >
                            <div className="col" >
                                <strong>Asigned User</strong>
                                <p>{item?.userasigned}</p>
                            </div>
                            <div className="col" >
                                <strong>Application Status</strong>
                                <p>{getAppStatus()}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="admin_actions" >
                    <div className="docs_options" >
                        <p>Download PDF:</p>
                        <div className="options">
                            <label onClick={() => handleDownload("approval", item.id)} className="processing" >Approval</label>
                            <label className="insurance" >Insurance</label>
                            <label className="noc" >NOC</label>
                            <label className="holding" >Holding</label>
                            <label className="invoice" >Invoice</label>
                        </div>
                    </div>
                    <div className="email_options" >
                        <p>Send Mail:</p>
                        <div className="options">
                            <label onClick={() => sendProcessing(item.email, item.id)} className="processing" >Approval</label>
                            <label onClick={() => sendInsurance(item.email, item.id)} className="insurance" >Insurance</label>
                            <label onClick={() => sendNoc(item.email, item.id)} className="noc" >NOC</label>
                            <label onClick={() => senHolding(item.email, item.id)} className="holding" >Holding</label>
                            <label onClick={() => sendInvoice(item.email, item.id)} className="invoice" >Invoice</label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}


export default QueryView;