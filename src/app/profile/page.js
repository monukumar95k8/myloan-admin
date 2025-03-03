"use client"
import { useEffect, useRef, useState } from "react";
import "./profile.css";
import useAuth from "../_hooks/useAuth";
import { addDoc, doc, setDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { toast } from "react-toastify";
const ProfilePage = () => {
    const { user } = useAuth();
    const [userDetailas, setUserDetails] = useState(null);
    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const mobileRef = useRef(null);
    const websiteTitleRef = useRef(null);
    const interestRateRef = useRef(null);
    const bankNameRef = useRef(null);
    const banIfscRef = useRef(null);
    const accountNumberRef = useRef(null);
    const accountHolderRef = useRef(null);
    const completeAddressRef = useRef(null);
    const processingFeeRef = useRef(null);
    const insuranceFeeRef = useRef(null);
    const holdingFeeRef = useRef(null);
    const nocFeeRef = useRef(null);
    const [imgUrl, setImgUrl] = useState("");
    const [qrcode, setQrcode] = useState("");
    const [profile, setProfile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let profileDetails = {
                title: websiteTitleRef.current.value,
                email: emailRef.current.value,
                mobile: mobileRef.current.value,
                interestrate: interestRateRef.current.value,
                bankname: bankNameRef.current.value,
                bankifsc: banIfscRef.current.value,
                accountnumber: accountNumberRef.current.value,
                accountholder: accountHolderRef.current.value,
                address: completeAddressRef.current.value,
                processingfee: processingFeeRef.current.value,
                insurancefee: insuranceFeeRef.current.value,
                holdingfee: holdingFeeRef.current.value,
                nocfee: nocFeeRef.current.value,
                image: imgUrl !== "" ? imgUrl : profile.image,
                qrcode: qrcode !== "" ? qrcode : profile.qrcode
            };

            let colRef = await getDocs(collection(db, "profile"))
            let data = colRef.docs.map(a => {
                return { id: a.id, ...a.data() }
            });
            console.log(data, "Data");
            if (!data.length) {
                await addDoc(collection(db, "profile"), profileDetails);
            } else {
                let docRef = doc(db, "profile", profile.id)
                await updateDoc(docRef, profileDetails);
            }
            fetchProfile();
            toast.success("Profile updated successfully");
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        if (user) {
            console.log(user, "User");
            setUserDetails(user);
        }
    }, [user]);

    const fetchProfile = async () => {
        let colRef = await getDocs(collection(db, "profile"))
        let data = colRef.docs.map(a => {
            return { id: a.id, ...a.data() }
        });
        setProfile(data[0])
        setImgUrl(data[0].image)
        setQrcode(data[0].qrcode)
    }

    const handleUpload = async (e) => {
        try {
            let file = e.target.files[0];
            if (!file) return; // Ensure a file is selected

            let formData = new FormData();
            formData.append("image", file);
            formData.append("type", "image");

            let response = await fetch("/api/image-upload", {
                method: "POST",
                body: formData, // Send form data
            });

            let result = await response.json();
            if (response.ok) {
                console.log("Upload successful:", result);
                setImgUrl(result.imgUrl)
            } else {
                console.error("Upload failed:", result);
            }
        } catch (err) {
            console.error("Error uploading image:", err);
        }
    };

    const handleQrUpload = async (e) => {
        try {
            let file = e.target.files[0];
            if (!file) return; // Ensure a file is selected

            let formData = new FormData();
            formData.append("image", file);
            formData.append("type", "image");

            let response = await fetch("/api/image-upload", {
                method: "POST",
                body: formData, // Send form data
            });

            let result = await response.json();
            if (response.ok) {
                console.log("Upload successful:", result);
                setQrcode(result.imgUrl)
            } else {
                console.error("Upload failed:", result);
            }
        } catch (err) {
            console.error("Error uploading image:", err);
        }
    };


    useEffect(() => {
        fetchProfile();
    }, []);

    return <>
        <div className="page-body" bis_skin_checked={1}>
            <div className="container-fluid" bis_skin_checked={1}>
                <div className="page-title" bis_skin_checked={1}>
                    <div className="row" bis_skin_checked={1}>
                        <div className="col-6" bis_skin_checked={1}>
                            {/* <h4>Edit Profile</h4>*/}
                        </div>

                    </div>
                </div>
            </div>
            {/* Container-fluid starts*/}
            <div className="container-fluid" bis_skin_checked={1}>
                <div className="edit-profile" bis_skin_checked={1}>
                    <div className="row" bis_skin_checked={1}>
                        <div className="col-xl-4" bis_skin_checked={1}>
                            <div className="card" bis_skin_checked={1}>
                                <div className="card-header" bis_skin_checked={1}>
                                    <h4 className="card-title mb-0">My Profile</h4>
                                    <div className="card-options" bis_skin_checked={1}>
                                        <a
                                            className="card-options-collapse"
                                            href="#"
                                            data-bs-toggle="card-collapse"
                                        >
                                            <i className="fe fe-chevron-up" />
                                        </a>
                                        <a
                                            className="card-options-remove"
                                            href="#"
                                            data-bs-toggle="card-remove"
                                        >
                                            <i className="fe fe-x" />
                                        </a>
                                    </div>
                                </div>
                                <div className="card-body" bis_skin_checked={1}>
                                    {profile && <form onSubmit={handleSubmit}>
                                        <div className="row mb-2" bis_skin_checked={1}>
                                            <div className="profile-title" bis_skin_checked={1}>
                                                <div className="media" bis_skin_checked={1}>
                                                    <img
                                                        className="img-70 rounded-circle"
                                                        src="https://indiadhaniservice.co.in/upload/admin_images/2024-11-20loo.png"
                                                        alt=""
                                                    />
                                                    <div className="media-body" bis_skin_checked={1}>
                                                        <h5 className="mb-1">India Dhani Service</h5>
                                                        <p>Admin</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mb-3" bis_skin_checked={1}>
                                            <h6 className="form-label">Address</h6>
                                            <textarea
                                                className="form-control"
                                                rows={5}
                                                defaultValue={
                                                    "D 114, 1st Floor, Eastern Business District, offLal Bahadur Shastri Marg, Ganesh Nagar, Bhandup West, Mumbai, Maharashtra 400078"
                                                }
                                                ref={completeAddressRef}
                                            />
                                        </div>
                                        <div className="mb-3" bis_skin_checked={1}>
                                            <label className="form-label">Email-Address</label>
                                            <input
                                                className="form-control"
                                                placeholder="support@indiadhaniservice.co.in"
                                                defaultValue={profile.email || "support@indiabullsdhanifinance.org.in"}
                                                ref={emailRef}
                                            />
                                        </div>
                                        <div className="mb-3" bis_skin_checked={1}>
                                            <label className="form-label">Password</label>
                                            <input
                                                className="form-control"
                                                type="password"
                                                defaultValue=""
                                            />
                                        </div>
                                        <div className="mb-3" bis_skin_checked={1}>
                                            <label className="form-label">Website</label>
                                            <input
                                                className="form-control"
                                                placeholder="Dhani Finance Ltd"
                                                defaultValue={profile.title || "Dhani Finance Ltd"}
                                                ref={websiteTitleRef}
                                            />
                                        </div>
                                        {/*<div class="form-footer">
              <button class="btn btn-primary btn-block">Save</button>
            </div>*/}
                                    </form>}
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-8" bis_skin_checked={1}>
                            {profile && <form
                                onSubmit={handleSubmit}
                                className="card"
                                method="post"
                            >
                                <div className="card-header" bis_skin_checked={1}>
                                    <h4 className="card-title mb-0">Edit Profile</h4>
                                    <div className="card-options" bis_skin_checked={1}>
                                        <a
                                            className="card-options-collapse"
                                            href="#"
                                            data-bs-toggle="card-collapse"
                                        >
                                            <i className="fe fe-chevron-up" />
                                        </a>
                                        <a
                                            className="card-options-remove"
                                            href="#"
                                            data-bs-toggle="card-remove"
                                        >
                                            <i className="fe fe-x" />
                                        </a>
                                    </div>
                                </div>
                                <div className="card-body" bis_skin_checked={1}>
                                    <div className="row" bis_skin_checked={1}>
                                        <div className="col-sm-6 col-md-4" bis_skin_checked={1}>
                                            <div className="mb-3" bis_skin_checked={1}>
                                                <label className="form-label">Your Name</label>
                                                <input
                                                    type="text"
                                                    name="username"
                                                    className="form-control"
                                                    defaultValue={profile.title || "India Dhani Service"}
                                                    ref={websiteTitleRef}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-6 col-md-4" bis_skin_checked={1}>
                                            <div className="mb-3" bis_skin_checked={1}>
                                                <label className="form-label">Logo</label>
                                                <input
                                                    id="Image"
                                                    type="file"
                                                    name="user_images"
                                                    className="form-control"
                                                    onChange={handleUpload}
                                                />
                                                <img
                                                    style={{ width: "20%" }}
                                                    id="showImage"
                                                    src={imgUrl}
                                                    alt=""
                                                />
                                            </div>
                                        </div>

                                        <div className="col-sm-7 col-md-4" bis_skin_checked={1}>
                                            <div className="mb-3" bis_skin_checked={1}>
                                                <label className="form-label">Email Id</label>
                                                <input
                                                    name="email_id"
                                                    className="form-control"
                                                    defaultValue={profile.email || "support@indiadhaniservice.co.in"}
                                                    type="text"
                                                    placeholder=""
                                                    ref={emailRef}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-6 col-md-4" bis_skin_checked={1}>
                                            <div className="mb-3" bis_skin_checked={1}>
                                                <label className="form-label">Mobile No</label>
                                                <input
                                                    type="text"
                                                    name="mobile"
                                                    className="form-control"
                                                    defaultValue={profile.mobile || 8981356338}
                                                    ref={mobileRef}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-6 col-md-4" bis_skin_checked={1}>
                                            <div className="mb-3" bis_skin_checked={1}>
                                                <label className="form-label">Website</label>
                                                <input
                                                    type="text"
                                                    name="website"
                                                    className="form-control"
                                                    defaultValue="Dhani Finance Ltd"
                                                    ref={websiteTitleRef}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-6 col-md-4" bis_skin_checked={1}>
                                            <div className="mb-3" bis_skin_checked={1}>
                                                <label className="col-form-label">Interest Rate</label>
                                                <input
                                                    type="text"
                                                    name="annualInterestRate"
                                                    className="form-control"
                                                    defaultValue="6.99"
                                                    ref={interestRateRef}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-3 col-md-4" bis_skin_checked={1}>
                                            <div className="mb-3" bis_skin_checked={1}>
                                                <label className="col-form-label">Bank Name</label>
                                                <input
                                                    type="text"
                                                    name="bank_name"
                                                    className="form-control"
                                                    defaultValue="Punjab & Sind Bank"
                                                    ref={bankNameRef}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-3 col-md-4" bis_skin_checked={1}>
                                            <div className="mb-3" bis_skin_checked={1}>
                                                <label className="col-form-label">IFSC</label>
                                                <input
                                                    type="text"
                                                    name="ifsc"
                                                    className="form-control"
                                                    ref={banIfscRef}
                                                    defaultValue={profile.bankifsc}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-3 col-md-4" bis_skin_checked={1}>
                                            <div className="mb-3" bis_skin_checked={1}>
                                                <label className="col-form-label">Account No</label>
                                                <input
                                                    type="text"
                                                    name="account"
                                                    className="form-control"
                                                    defaultValue={15951000000932}
                                                    ref={accountNumberRef}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-3 col-md-4" bis_skin_checked={1}>
                                            <div className="mb-3" bis_skin_checked={1}>
                                                <label className="col-form-label">Holder Name</label>
                                                <input
                                                    type="text"
                                                    name="holder_name"
                                                    className="form-control"
                                                    defaultValue="Dhani Finance Limited"
                                                    ref={accountHolderRef}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-6 col-md-4" bis_skin_checked={1}>
                                            <div className="mb-3" bis_skin_checked={1}>
                                                <label className="col-form-label">Google pay</label>
                                                <input
                                                    type="text"
                                                    name="google_pay"
                                                    className="form-control"
                                                    defaultValue=""
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-6 col-md-4" bis_skin_checked={1}>
                                            <div className="mb-3" bis_skin_checked={1}>
                                                <label className="form-label">QR Code</label>
                                                <input
                                                    id="QrImage"
                                                    type="file"
                                                    name="qr_image"
                                                    className="form-control"
                                                    onChange={handleQrUpload}
                                                />
                                                <img
                                                    style={{ width: "20%" }}
                                                    id="showImage"
                                                    src={qrcode}
                                                    alt=""
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-12" bis_skin_checked={1}>
                                            <div className="mb-3" bis_skin_checked={1}>
                                                <label className="form-label">Complete Address</label>
                                                <textarea
                                                    type="password"
                                                    name="address"
                                                    className="form-control"
                                                    defaultValue={
                                                        " D 114, 1st Floor, Eastern Business District, offLal Bahadur Shastri Marg, Ganesh Nagar, Bhandup West, Mumbai, Maharashtra 400078"
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-6 col-md-6" bis_skin_checked={1}>
                                            <div className="mb-3" bis_skin_checked={1}>
                                                <label className="form-label">Processing Fee</label>
                                                <input
                                                    type="text"
                                                    name="processing_free"
                                                    className="form-control"
                                                    defaultValue={2450}
                                                    ref={processingFeeRef}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-6 col-md-6" bis_skin_checked={1}>
                                            <div className="mb-3" bis_skin_checked={1}>
                                                <label className="form-label">Insurance Fee</label>
                                                <input
                                                    type="text"
                                                    name="health_insurance_free"
                                                    className="form-control"
                                                    defaultValue={6666}
                                                    ref={insuranceFeeRef}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-6 col-md-6" bis_skin_checked={1}>
                                            <div className="mb-3" bis_skin_checked={1}>
                                                <label className="form-label">Holding Fee</label>
                                                <input
                                                    type="text"
                                                    name="holding_fee"
                                                    className="form-control"
                                                    defaultValue={11999}
                                                    ref={holdingFeeRef}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-sm-6 col-md-6" bis_skin_checked={1}>
                                            <div className="mb-3" bis_skin_checked={1}>
                                                <label className="form-label">Noc Fee</label>
                                                <input
                                                    type="text"
                                                    name="noc_fee"
                                                    className="form-control"
                                                    defaultValue={22555}
                                                    ref={nocFeeRef}
                                                />
                                            </div>
                                        </div>
                                        {/*<div class="col-md-12">
              <div>
                <label class="form-label">About Me</label>
                <textarea class="form-control" rows="4" placeholder="Enter About your description"></textarea>
              </div>
            </div>*/}
                                    </div>
                                </div>
                                <div className="card-footer text-end" bis_skin_checked={1}>
                                    <button className="btn btn-primary" type="submit">
                                        Update Profile
                                    </button>
                                </div>
                            </form>}
                        </div>
                    </div>
                </div>
            </div>
            {/* Container-fluid Ends*/}
        </div>

    </>
}

export default ProfilePage;