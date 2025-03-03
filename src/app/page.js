"use client"
import Image from "next/image";
import "./page.css";
import { db } from "@/lib/firebase/config";
import { getDocs, collection, query, where, orderBy } from "firebase/firestore";
import { useEffect, useState } from "react";
import useAuth from "./_hooks/useAuth";
import Loading from "./loading";

export default function Home() {

  const { user, loading } = useAuth();
  const [userList, setUserList] = useState([]);

  let [queryStatus, setQueryStatus] = useState({});

  const fetchData = async () => {
    try {
      let colRef = collection(db, "queries");
      let totalQuerySnapshot;

      if (user.superAdmin) {
        totalQuerySnapshot = await getDocs(colRef);
      } else {
        let queryQuery = query(colRef, where("userasigned", "==", user.displayName));
        totalQuerySnapshot = await getDocs(queryQuery);
      }
      let paidApprovalsQuery = user.superAdmin ? query(colRef, where("status", "==", "Paid Approval")) : query(colRef, where("userasigned", "==", user.displayName), orderBy("userasigned"), where("status", "==", "Paid Approval"));
      let totalPaidApprovalQueries = await getDocs(paidApprovalsQuery);

      let paidInsuranceQueries = user.superAdmin ? query(colRef, where("status", "==", "Paid Insurance")) : query(colRef, where("userasigned", "==", user.displayName), orderBy("userasigned"), where("status", "==", "Paid Insurance"));
      let totalPaidInsuranceSnapshot = await getDocs(paidInsuranceQueries);

      let totalPaidNocQuery = user.superAdmin ? query(colRef, where("status", "==", "Paid NOC")) : query(colRef, where("userasigned", "==", user.displayName), where("status", "==", "Paid NOC"));
      let totalPaidSnapshot = await getDocs(totalPaidNocQuery);

      let totalPaidHoldingQuery = user.superAdmin ? query(colRef, where("status", "==", "Paid Holding")) : query(colRef, where("userasigned", "==", user.displayName), where("status", "==", "Paid Holding"));
      let totalPaidHoldingSnapshot = await getDocs(totalPaidHoldingQuery);

      let totalNewleadsQuery = user.superAdmin ? query(colRef, where("status", "==", "New Lead")) : query(colRef, where("userasigned", "==", user.displayName), where("status", "==", "New Lead"));
      let newLeadSnapshot = await getDocs(totalNewleadsQuery);

      let totalCount = totalQuerySnapshot.size;
      let paidApprovalSize = totalPaidApprovalQueries.size;
      let paidInsuranceSize = totalPaidInsuranceSnapshot.size;
      let paidNOCSize = totalPaidSnapshot.size;
      let holdingSize = totalPaidHoldingSnapshot.size;
      let newLeadSize = newLeadSnapshot.size;

      setQueryStatus({ totalQueries: totalCount, paidApprovals: paidApprovalSize, paidInsurance: paidInsuranceSize, paidNOC: paidNOCSize, paidHolding: holdingSize, newLeads: newLeadSize });

    } catch (err) {
      console.log(err);
    }
  };

  const fetchUsers = async () => {
    try {
      // Fetch users
      const userCol = await getDocs(collection(db, "users"));
      console.log(userCol, "User Column");
      let data = [];
      // Loop through each user and fetch the total number of queries assigned to them
      userCol.docs.forEach(async (doc) => {
        const userData = { id: doc.id, ...doc.data() };
        console.log(userData, "User Data")
        const userName = userData.name;
        let querySnapshot;
        // Query the "queries" collection to count the number of queries assigned to this user
        if (userData.role !== "admin") {
          querySnapshot = await getDocs(query(collection(db, "queries"), where("userasigned", "==", userName)));
          console.log("Checking data for: " + userName, querySnapshot);
        } else {
          querySnapshot = await getDocs(collection(db, "queries"));
          console.log("Checking data for: " + userName, querySnapshot)
        }

        const queryCount = querySnapshot.size;  // Number of queries assigned to this user

        // Add the query count to the user data
        data.push({ ...userData, queries: queryCount });
      });

      console.log(data, "Users Data with Query Count");
      setUserList(data);  // Set the user list state
    } catch (err) {
      console.log("Error in fetching users!", err);
    }
  };



  useEffect(() => {
    if (typeof window !== "undefined") {
      document.getElementById("navbar").style.display = "block";
      document.getElementById("mobileNavbar").style.display = "block";
    }
    if (user) {
      fetchData();
    }
    if (user && user.superAdmin) {
      fetchUsers();
    }
  }, [user]);

  if (loading) {
    return <Loading />
  }

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  return (
    <>
      {user && <section style={{ padding: 0 }} className="wptb-video-wrapper-">
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 40 }} className="header_title" >
          <h2>Today's Insights</h2>
          <p>Check today's business status!</p>
        </div>
        <div className="container" bis_skin_checked={1} >
          <div className="overview_dashboard">
            {user.superAdmin && <div className="all_Users_sec" >
              <h1 style={{ color: "rgb(4, 106, 33)" }} >All Users</h1>
              <div className="card_container"  >
                {userList && userList.map(a => {
                  return <div className="users_card" >
                    <div className="user_box" >
                      <h4 className="user_name" >{a.name}</h4>
                      <i className="fa-solid fa-receipt"></i>
                    </div>
                    <div className="user_details" >
                      <h3>{a.queries}</h3> <p>Query</p>
                    </div>
                  </div>
                })}
              </div>
            </div>}

            <div className="query_status" >
              <h1 style={{ color: "rgb(4, 106, 33)" }} >All Queries</h1>
              <div className="all_query_sec" >
                <div className="card_container" >
                  <div className="users_card" >
                    <div className="user_box" >
                      <h4 className="user_name" >Total Query</h4>
                      <i className="fa-solid fa-receipt"></i>
                    </div>
                    <div className="user_details" >
                      <h3>{queryStatus.totalQueries || 0}</h3> <p>(Query)</p>
                    </div>

                  </div>
                  <div className="users_card" >
                    <div className="user_box" >
                      <h4 className="user_name" >Paid Approvals</h4>
                      <i className="fa-solid fa-receipt"></i>
                    </div>
                    <div className="user_details" >
                      <h3>{queryStatus.paidApprovals || 0}</h3> <p>(Query)</p>
                    </div>
                  </div>

                  <div className="users_card" >
                    <div className="user_box" >
                      <h4 className="user_name" >Paid Insurance</h4>
                      <i className="fa-solid fa-receipt"></i>
                    </div>
                    <div className="user_details" >
                      <h3>{queryStatus.paidInsurance || 0}</h3> <p>(Query)</p>
                    </div>
                  </div>
                  <div className="users_card" >
                    <div className="user_box" >
                      <h4 className="user_name" >Paid Hold Charge</h4>
                      <i className="fa-solid fa-receipt"></i>
                    </div>
                    <div className="user_details" >
                      <h3>{queryStatus.paidHolding || 0}</h3> <p>(Query)</p>
                    </div>

                  </div>
                  <div className="users_card" >
                    <div className="user_box" >
                      <h4 className="user_name" >Paid NOC</h4>
                      <i className="fa-solid fa-receipt"></i>
                    </div>
                    <div className="user_details" >
                      <h3>{queryStatus.paidNOC || 0}</h3> <p>(Query)</p>
                    </div>
                  </div>
                  <div className="users_card" >
                    <div className="user_box" >
                      <h4 className="user_name" >New Leads </h4>
                      <i className="fa-solid fa-receipt"></i>
                    </div>
                    <div className="user_details" >
                      <h3>{queryStatus.newLeadSize || 0}</h3> <p>(Query)</p>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section >}
    </>
  );
}
