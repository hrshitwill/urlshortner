import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {

    const navigate = useNavigate();

    const { register } = useAuth();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            await register(
                form.name,
                form.email,
                form.password
            );

            alert("Registration Successful");

            navigate("/login");

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Registration Failed"
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="min-h-screen bg-gray-100 flex justify-center items-center">

            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">

                <h1 className="text-3xl font-bold text-center mb-8">
                    Register
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border p-3 rounded"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border p-3 rounded"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full border p-3 rounded"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700"
                    >
                        {
                            loading
                                ? "Creating Account..."
                                : "Register"
                        }
                    </button>

                </form>

                <p className="text-center mt-6">

                    Already have an account?

                    <Link
                        to="/login"
                        className="text-blue-600 ml-2"
                    >
                        Login
                    </Link>

                </p>

            </div>

        </div>

    );

}

export default Register;