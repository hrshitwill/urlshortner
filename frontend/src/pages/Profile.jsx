import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Profile() {

    const navigate = useNavigate();

    const { user, logout } = useAuth();

    const handleLogout = async () => {

        await logout();

        navigate("/login");

    };

    return (

        <div className="min-h-screen bg-gray-100">

            {/* Navbar */}

            <div className="bg-white shadow">

                <div className="max-w-5xl mx-auto flex justify-between items-center p-5">

                    <h1 className="text-3xl font-bold">

                        My Profile

                    </h1>

                    <div className="flex gap-5">

                        <Link
                            to="/"
                            className="text-blue-600 font-semibold"
                        >
                            Dashboard
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded"
                        >
                            Logout
                        </button>

                    </div>

                </div>

            </div>

            {/* Profile Card */}

            <div className="max-w-3xl mx-auto mt-12">

                <div className="bg-white rounded-lg shadow-lg p-8">

                    <div className="flex justify-center">

                        <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-4xl font-bold">

                            {user?.name?.charAt(0).toUpperCase()}

                        </div>

                    </div>

                    <h2 className="text-center text-3xl font-bold mt-6">

                        {user?.name}

                    </h2>

                    <p className="text-center text-gray-500">

                        {user?.email}

                    </p>

                    <hr className="my-8" />

                    <div className="grid grid-cols-1 gap-6">

                        <div>

                            <h3 className="text-gray-500">

                                User ID

                            </h3>

                            <p className="break-all">

                                {user?._id}

                            </p>

                        </div>

                        <div>

                            <h3 className="text-gray-500">

                                Email

                            </h3>

                            <p>

                                {user?.email}

                            </p>

                        </div>

                        <div>

                            <h3 className="text-gray-500">

                                Joined

                            </h3>

                            <p>

                                {

                                    user?.createdAt ?

                                    new Date(
                                        user.createdAt
                                    ).toLocaleString()

                                    :

                                    "-"

                                }

                            </p>

                        </div>

                    </div>

                    <div className="mt-10">

                        <Link
                            to="/"
                            className="bg-blue-600 text-white px-5 py-3 rounded"
                        >
                            Back to Dashboard
                        </Link>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Profile;