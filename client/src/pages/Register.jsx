import { useNavigate } from "react-router-dom"
import { useState } from "react"
import api from "../config/api"
import { GoogleLogin } from "@react-oauth/google"

function Register(){
     const [registerUser, setRegisterUser] = useState({
             username : "",
             email : "",
             password : "",
             confirmPassword : ""
         })

         const navigate = useNavigate()
     
         const handleChange = (e) => {
             setRegisterUser({...registerUser, [e.target.name] : e.target.value})
         }
     
         const handleSubmit = async (e) => {
             e.preventDefault();
             try{
               const response = await api.post("/auth/register", registerUser);
               alert(response.data.message);
               navigate("/verify-email");
             }catch(err){
               alert(err.response?.data?.message || "Register failed");
             }
         }

         const handleGoogleLogin = async (responseCredential) => {
              try{
                 const response = await api.post("/auth/google-login", {credential : responseCredential.credential});
                 alert(response.data.message);
                 localStorage.setItem("token", response.data.data.token);
                 navigate("/dashboard");
              }catch(err){
                 alert(err.response?.data?.message || "Google login failed")
              }
         }

         const [isVisible, setIsVisible] = useState(false);
         const [isVisibleConfirm, setIsVisibleConfirm] = useState(false);

         const handleShowHide = () => {
            setIsVisible(!isVisible);
         }

         const handleShowHideConfirm = () => {
            setIsVisibleConfirm(!isVisibleConfirm);
         }

         return(
             <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8">
                 <form onSubmit={handleSubmit}
                     className="w-full max-w-md bg-white p-5 sm:p-8 rounded-2xl shadow-xl"
                 >
                     <h1
                         className="text-2xl sm:text-3xl font-bold text-center text-blue-800 mb-8"
                     >
                         Register
                     </h1>

                     <label htmlFor=""
                         className="block text-sm font-medium text-gray-700 mb-2"
                     >
                         Username :
                     </label>

                     <input value={registerUser.username} onChange={handleChange} name="username" type="text"
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800"
                     />

                     <br />
                     <br />

                     <label htmlFor=""
                         className="block text-sm font-medium text-gray-700 mb-2"
                     >
                         Email :
                     </label>

                     <input value={registerUser.email} onChange={handleChange} name="email" type="email"
                         className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800"
                     />

                     <br />
                     <br />

                     <label htmlFor=""
                         className="block text-sm font-medium text-gray-700 mb-2"
                     >
                         Password :
                     </label>

                     <div className="relative">
                         <input value={registerUser.password} onChange={handleChange} name="password" type={isVisible? "text" : "password"}
                             className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800"
                         />

                         <button
                             type="button"
                             onClick={handleShowHide}
                             className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-blue-800 hover:text-blue-900"
                         >
                             {isVisible? "Hide" : "Show"}
                         </button>
                     </div>

                     <br />
                     <br />

                     <label htmlFor=""
                         className="block text-sm font-medium text-gray-700 mb-2"
                     >
                         Confirm Password :
                     </label>

                     <div className="relative">
                         <input value={registerUser.confirmPassword} onChange={handleChange} name="confirmPassword" type={isVisibleConfirm? "text" : "password"}
                             className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800"
                         />

                         <button
                             type="button"
                             onClick={handleShowHideConfirm}
                             className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-blue-800 hover:text-blue-900"
                         >
                             {isVisibleConfirm? "Hide" : "Show"}
                         </button>
                     </div>

                     <br />
                     <br />

                     <button type="submit"
                         className="w-full bg-blue-800 text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition"
                     >
                         Register
                     </button>

                     <div
                         className="flex justify-center mt-5"
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
                         Already have an account?{" "}
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

export default Register;