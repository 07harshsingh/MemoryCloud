import { useState } from "react";
import api from "../config/api"
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

function Login(){
    const [user, setUser] = useState({
        email : "",
        password : ""
    })

    const navigate = useNavigate()

    const handleChange = (e) => {
        setUser({...user, [e.target.name] : e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
          const response = await api.post("/auth/login", user);
          alert(response.data.message);
          localStorage.setItem("token", response.data.data.token);
          navigate("/dashboard");
        }catch(err){
           alert(err.response?.data?.message || "Login failed");
        }
    }

    const handleGoogleLogin = async (responseCredential) => {
        try{
           const response = await api.post("/auth/google-login", {
              credential : responseCredential.credential
           });

           alert(response.data.message);

           localStorage.setItem("token", response.data.data.token);

           navigate("/dashboard");
        }catch(err){
           alert(err.response?.data?.message || "Google login failed");
        }
    }

    const [isVisible, setIsVisible] = useState(false)

    const handleShowHide = () => {
         setIsVisible(!isVisible);
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
                    Welcome Back
                </h1>

                <p
                    className="text-center text-sm text-gray-500 mb-8"
                >
                    Login to your MemoryCloud account
                </p>

                <label htmlFor=""
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Email :
                </label>

                <input value={user.email} onChange={handleChange} name="email" type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800"
                />

                <br />
                <br />

                <label htmlFor=""
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Password :
                </label>

                <div
                    className="relative"
                >
                    <input value={user.password} onChange={handleChange} name="password" type={isVisible? "text" : "password"}
                        className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800"
                    />

                    <button type="button" onClick={handleShowHide}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-blue-800 hover:text-blue-900"
                    >
                        {isVisible? "Hide" : "Show"}
                    </button>
                </div>

                <br />
                <br />

                <button type="submit"
                    className="w-full bg-blue-800 text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition"
                >
                    Login
                </button>

                <div
                    className="flex items-center gap-3 my-6"
                >
                    <div
                        className="flex-1 h-px bg-gray-200"
                    ></div>

                    <span
                        className="text-sm text-gray-400"
                    >
                        OR
                    </span>

                    <div
                        className="flex-1 h-px bg-gray-200"
                    ></div>
                </div>

                <div
                    className="flex justify-center"
                >
                    <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        onError={() => {
                            alert("Google login failed");
                        }}
                    />
                </div>

                <p
                    className="text-center text-sm text-gray-500 mt-6"
                >
                    Don't have an account?{" "}

                    <button
                        type="button"
                        onClick={() => navigate("/register")}
                        className="text-blue-800 font-semibold hover:text-blue-900 hover:underline"
                    >
                        Register
                    </button>
                </p>
            </form>
        </div>
    )
}

export default Login;