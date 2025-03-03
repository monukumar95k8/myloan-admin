"use client"
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase/config";
import { updateDoc, doc, collection, getDocs } from "firebase/firestore";
import "./queryedit.css";
import { toast } from "react-toastify";

const QueryEdit = ({ item }) => {
  console.log(item, "ITEM");

  const [formData, setFormData] = useState({});
  const [userList, setUserList] = useState([]);
  const [selectedAppStatus, setSelectedAppStatus] = useState("");
  console.log(formData, "FormData")
  const closePopup = () => {
    document.getElementById("queryEditPopup").style.display = "none";
  };
  const appStatusList = [
    { status: "application_received", text: "Application Received", active: true },
    { status: "under_process", text: "Under Process", active: false },
    { status: "pay_processing", text: "Pay Processing", active: false },
    { status: "loan_approved", text: "Loan Approved", active: false },
    { status: "loan_disbursed", text: "Loan Disbursed", active: false }
  ]
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleStatusChange = (e) => {
    console.log(e.target.value)
    let selectedOption = appStatusList.find(a => {
      if (a.status == e.target.value) {
        return a
      }
    })
    setFormData(prev => ({ ...prev, status: selectedOption.text }))
  }

  const handleUserChange = (e) => {
    console.log(e.target.value)
    setFormData(prev => ({ ...prev, userasigned: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      let docRef = doc(db, "queries", item.id);

      await updateDoc(docRef, formData);
      toast.success("Query updated Successfully!")
    } catch (err) {
      console.log(err);
    }
  };

  // Sync formData with item when item changes
  useEffect(() => {
    if (item) {
      setFormData({ ...item });
    }
  }, [item]);

  const fetchUsers = async () => {
    try {
      console.log("Firing Try Catch");
      const querySnapshot = await getDocs(collection(db, "users")); // Fetch query snapshot
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); // Map through docs
      console.log(data, "Data Users");
      setUserList(data); // Update the state with fetched data
    } catch (err) {
      console.log(err, "Error Fetching Users");
    }
  };


  useEffect(() => {
    console.log("UseEffect firing")
    fetchUsers();
  }, []);

  return (
    <>
      <div
        id="queryEditPopup"
        className="query_popup"
        style={{ position: "fixed", display: "none" }}
      >
        <div className="content_container">
          <div className="query_item_container">
            <div>
              <p
                style={{ textDecoration: "underline", cursor: "pointer" }}
                onClick={closePopup}
              >
                Close
              </p>
            </div>
            <form className="container" onSubmit={handleSubmit}>
              <div className="row">
                <div className="col">
                  <strong>Name</strong>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="col">
                  <strong>Phone</strong>
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <strong>Whatsapp</strong>
                  <input
                    type="text"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                  />
                </div>
                <div className="col">
                  <strong>Email</strong>
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <strong>Adhaar</strong>
                  <input
                    type="text"
                    name="adhaar"
                    value={formData.adhaar}
                    onChange={handleChange}
                  />
                </div>
                <div className="col">
                  <strong>PAN</strong>
                  <input
                    type="text"
                    name="PAN"
                    value={formData.PAN}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <strong>City</strong>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="col">
                  <strong>Pincode</strong>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <strong>State</strong>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
                <div className="col">
                  <strong>Loan Amount</strong>
                  <input
                    type="text"
                    name="loanamount"
                    value={formData.loanamount}
                    onChange={handleChange}
                  />
                </div>

              </div>
              <div className="row">
                <div className="col">
                  <strong>Loan Type</strong>
                  <input
                    type="text"
                    name="loantype"
                    value={formData.loantype}
                    onChange={handleChange}
                  />
                </div>
                <div className="col">
                  <strong>Tenure</strong>
                  <input
                    type="text"
                    name="tenure"
                    value={formData.tenure}
                    onChange={handleChange}
                  />
                </div>

              </div>
              <div className="row">
                <div className="col">
                  <strong>Bank Account</strong>
                  <input
                    type="text"
                    name="bankaccount"
                    value={formData.bankaccount}
                    onChange={handleChange}
                  />
                </div>
                <div className="col">
                  <strong>Bank Name</strong>
                  <input
                    type="text"
                    name="bankname"
                    value={formData.bankname}
                    onChange={handleChange}
                  />
                </div>

              </div>
              <div className="row">
                <div className="col">
                  <strong>Bank IFSC</strong>
                  <input
                    type="text"
                    name="bankifsc"
                    value={formData.bankifsc}
                    onChange={handleChange}
                  />
                </div>
                <div className="col">
                  <strong>Processing Fee</strong>
                  <input
                    type="text"
                    name="processingFee"
                    value={formData.processingFee}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <strong>Insurance Fee</strong>
                  <input
                    type="text"
                    name="insuranceFee"
                    value={formData.insuranceFee}
                    onChange={handleChange}
                  />
                </div>
                <div className="col">
                  <strong>NOC Fee</strong>
                  <input
                    type="text"
                    name="nocFee"
                    value={formData.nocFee}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <strong>Hold Charge Fee</strong>
                  <input
                    type="text"
                    name="holdChargeFee"
                    value={formData.holdChargeFee}
                    onChange={handleChange}
                  />
                </div>
                <div className="col">
                  <strong>Status</strong>
                  <select onChange={handleChange} name="status" defaultValue={formData.status} >
                    <option>Select Status</option>
                    <option value="New Lead" >New Lead</option>
                    <option value="Paid Approval" >Paid Approval</option>
                    <option value="Paid Insurance" >Paid Insurance</option>
                    <option value="Paid Hold Charge" >Paid Hold Charge</option>
                    <option value="Paid NOC" >Paid NOC</option>
                  </select>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <strong>Asigned User</strong>
                  <select onChange={handleUserChange} name="userasigned" value={formData.userasigned}  >
                    <option>Select Status</option>
                    {userList && userList.map(a => {
                      return <option value={a.name} >{a.name}</option>
                    })}

                  </select>
                </div>
                <div className="col">
                  <strong>Application Status</strong>
                  <select onChange={handleStatusChange} name="applicationstatus" defaultValue={formData.status} >
                    <option>Select Status</option>
                    {appStatusList && appStatusList.map(a => {
                      return <option value={a.status}> {a.text} </option>
                    })}
                  </select>
                </div>
              </div>
              <div className="row">
                <div
                  style={{ boxShadow: "none" }}
                  className="col"
                >
                  <button type="submit" className="btn btn-success">
                    Update
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default QueryEdit;
