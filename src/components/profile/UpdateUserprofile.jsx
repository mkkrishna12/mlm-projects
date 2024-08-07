import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as api from "../../api";
import { updateProfile } from "../../actions/updateProfile";
const UpdateUserprofile = () => {
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.auth.userRole);
  const adminData = useSelector((state) => state.auth.authData.admin);
  const customerData = useSelector((state) => state.auth.authData.customer);

  const getInitialData = () => {
    if (userRole === "admin") {
      return adminData;
    } else if (userRole === "customer") {
      return customerData;
    }
  };

  const [formData, setFormData] = useState(getInitialData());
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [imageFile, setImageFile] = useState({
    aadhar_image_link: null,
    pan_image_link: null,
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const { name } = event.target;
      setImageFile({...imageFile,[name]:file})
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let updatedFormData = { ...formData };

    if (imageFile.aadhar_image_link) {
      const fileData = new FormData();
      fileData.append("file", imageFile.aadhar_image_link);
      try {
        const { data } = await api.imageUpload(fileData);
        updatedFormData = {
          ...updatedFormData,
          aadhar_image_link: data.body.file, 
        };
      } catch (error) {
        console.error("Aadhar image upload failed", error);
      }
    }
    if (imageFile.pan_image_link) {
      const fileData = new FormData();
      fileData.append("file", imageFile.pan_image_link);
      try {
        const { data } = await api.imageUpload(fileData);
        updatedFormData = {
          ...updatedFormData,
          pan_image_link: data.body.file, 
        };
      } catch (error) {
        console.error("PAN image upload failed", error);
      }
    }
    let payload = {
      customer: updatedFormData,
    };

    api
      .updateProfile(payload)
      .then((res) => {
        dispatch(updateProfile(res.data.body));
        setModalMessage("Profile updated successfully.");
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
        }, 3000); // Close modal after 3 seconds
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        setModalMessage("Failed to update profile.");
        setShowModal(true);
        setTimeout(() => {
          setShowModal(false);
        }, 3000); // Close modal after 3 seconds
      });
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="p-4 space-y-4 bg-white rounded shadow-md"
      >
        <div>
          <h2 className="text-xl font-bold">Personal Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="flex flex-col">
              <label
                htmlFor="first_name"
                className="mt-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData?.first_name}
                onChange={handleChange}
                placeholder="First Name"
                className="p-2 border rounded w-full mt-2"
                required
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="last_name"
                className="mt-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData?.last_name}
                onChange={handleChange}
                placeholder="Last Name"
                className="p-2 border rounded w-full mt-2"
                required
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="aadhar_no"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Aadhar Number
              </label>
              <input
                type="number"
                name="aadhar_card_no"
                value={formData?.aadhar_card_no}
                onChange={handleChange}
                placeholder="Aadhar Number"
                className="p-2 border rounded w-full mt-2"
                required
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="pan_no"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Pan Number
              </label>
              <input
                type="text"
                name="pan_card_no"
                value={formData?.pan_card_no}
                onChange={handleChange}
                placeholder="Pan Number"
                required
                className="p-2 border rounded w-full mt-2"  
              />
            </div>
            {formData?.aadhar_image_link == "HARDCODED" ? 
             <div className="flex flex-col">
             <label
               htmlFor="aadhar_image"
               className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
             >
               Aadhar Image
             </label>
             <input
               type="file"
               name="aadhar_image_link"
              //  value={formData?.aadhar_image_link}
               onChange={handleFileChange}
               
               className="p-2 border rounded w-full mt-2"  
             />
           </div>
            : <img src={formData.aadhar_image_link}></img>}
            {formData?.pan_image_link == "HARDCODED" ? 
             <div className="flex flex-col">
             <label
               htmlFor="pan_image"
               className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
             >
               Pan Image
             </label>
             <input
               type="file"
               name="pan_image_link"
              //  value={formData?.aadhar_image_link}
               onChange={handleFileChange}
               
               className="p-2 border rounded w-full mt-2"  
             />
           </div>
            : ""}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold">Bank Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="flex flex-col">
              <label
                htmlFor="bank_name"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Bank Name
              </label>
              <input
                type="text"
                name="bank_name"
                value={formData?.bank_name}
                onChange={handleChange}
                placeholder="Bank Name"
                className="p-2 border rounded w-full mt-2"
                required
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="account_no"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Account Number
              </label>
              <input
                type="text"
                name="account_no"
                value={formData?.account_no}
                onChange={handleChange}
                placeholder="Account Number"
                className="p-2 border rounded w-full mt-2"
                required
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="ifsc_code"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                IFSC Code
              </label>
              <input
                type="text"
                name="ifsc_code"
                value={formData?.ifsc_code}
                onChange={handleChange}
                placeholder="Account Number"
                className="p-2 border rounded w-full mt-2"
                required
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="branch_name"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Branch Name
              </label>
              <input
                type="text"
                name="branch_name"
                value={formData?.branch_name}
                onChange={handleChange}
                placeholder="Account Number"
                className="p-2 border rounded w-full mt-2"
                required
              />
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold ">Contact Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="flex flex-col">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData?.address}
                onChange={handleChange}
                placeholder="Address"
                className="p-2 border rounded w-full mt-2"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData?.email}
                onChange={handleChange}
                placeholder="Email"
                className="p-2 border rounded w-full mt-2"
                required
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="mobileNo"
                className=" block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Mobile Number
              </label>
              <input
                type="text"
                name="mobileNo"
                value={formData?.mobileNo}
                onChange={handleChange}
                placeholder="Mobile Number"
                className="p-2 border rounded w-full mt-2"
                required
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 font-bold text-white rounded hover:bg-blue-700"
            style={{ backgroundColor: "#3AA6B9" }}
          >
            Update Profile
          </button>
        </div>
      </form>
      {/* Modal */}
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white border border-gray-300 shadow-lg rounded-lg p-6">
            <p className="text-lg font-bold mb-4">{modalMessage}</p>
            <button
              onClick={closeModal}
              className="px-4 py-2 text-white rounded"
              style={{ backgroundColor: "#3AA6B9" }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateUserprofile;
