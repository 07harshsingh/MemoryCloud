import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../config/api";

function VerifyEmail(){

    const [emailVerify, setEmailVerify] = useState({
        email : "",
        verificationCode : ""
    })

    const navigate = useNavigate();

    const handleChange = (e) => {
        setEmailVerify({...emailVerify, [e.target.name] : e.target.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
          const response = await api.post("/auth/verify-email", emailVerify);
          alert(response.data.message);
          navigate("/login");
        }catch(err){
          alert(err.response?.data?.message || "Email verification failed");
        }
    }

    return(
        <div
            className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8"
        >
          <form onSubmit={handleSubmit}
              className="w-full max-w-md bg-white p-5 sm:p-8 rounded-2xl shadow-xl"
          >

            <h1
                className="text-2xl sm:text-3xl font-bold text-center text-blue-800 mb-3"
            >
                Verify Your Email
            </h1>

            <p
                className="text-center text-sm text-gray-500 mb-8"
            >
                Enter the verification code sent to your email
            </p>

            <label htmlFor=""
                className="block text-sm font-medium text-gray-700 mb-2"
            >
                Email :
            </label>

            <input value={emailVerify.email} onChange={handleChange} name="email" type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800"
            />

            <br />
            <br />

            <label htmlFor=""
                className="block text-sm font-medium text-gray-700 mb-2"
            >
                Verification code :
            </label>

            <input value={emailVerify.verificationCode} onChange={handleChange} name="verificationCode" type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800 tracking-widest"
            />

            <br />
            <br />

            <button type="submit"
                className="w-full bg-blue-800 text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition"
            >
                Verify Email
            </button>

            <p
                className="text-center text-sm text-gray-500 mt-6"
            >
                Already verified?{" "}

                <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-blue-800 font-semibold hover:text-blue-900 hover:underline"
                >
                    Login
                </button>
            </p>

          </form>
        </div>
    )
}

export default VerifyEmail;