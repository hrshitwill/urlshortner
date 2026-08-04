import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Dashboard() {

    const navigate = useNavigate();

    const { user, logout } = useAuth();

    const [urls, setUrls] = useState([]);

    const [originalUrl, setOriginalUrl] = useState("");

    const [loading, setLoading] = useState(false);

    // Fetch URLs
    const fetchUrls = async () => {

        try {

            const res = await api.get("/url");

            setUrls(res.data.data);

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        fetchUrls();

    }, []);

    // Create URL
    const createShortUrl = async (e) => {

        e.preventDefault();

        if (!originalUrl) return;

        try {

            setLoading(true);

            await api.post("/url", {
                originalUrl
            });

            setOriginalUrl("");

            fetchUrls();

        } catch (error) {

            alert(
                error.response?.data?.message
            );

        } finally {

            setLoading(false);

        }

    };

    // Delete URL
    const deleteUrl = async (id) => {

        const confirmDelete = window.confirm(
            "Delete this URL?"
        );

        if (!confirmDelete) return;

        try {

            await api.delete(`/url/${id}`);

            fetchUrls();

        } catch (error) {

            alert(
                error.response?.data?.message
            );

        }

    };

    // Logout
    const handleLogout = async () => {

        await logout();

        navigate("/login");

    };

    // Copy URL
    const copyUrl = (shortCode) => {

    navigator.clipboard.writeText(
        `${process.env.VITE_BASE_URL}/${shortCode}`
    );

    alert("Copied");

};

    return (

        <div className="min-h-screen bg-gray-100">

            {/* Navbar */}

            <div className="bg-white shadow">

                <div className="max-w-6xl mx-auto flex justify-between items-center p-5">

                    <h1 className="text-3xl font-bold">

                        URL Shortener

                    </h1>

                    <div className="flex gap-5 items-center">

                        <Link
                            to="/profile"
                            className="text-blue-600"
                        >
                            {user?.name}
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

            {/* Body */}

            <div className="max-w-6xl mx-auto mt-10">

                {/* Create URL */}

                <form
                    onSubmit={createShortUrl}
                    className="flex gap-4"
                >

                    <input
                        type="text"
                        placeholder="https://example.com"
                        value={originalUrl}
                        onChange={(e) =>
                            setOriginalUrl(
                                e.target.value
                            )
                        }
                        className="flex-1 border p-3 rounded"
                    />

                    <button
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 rounded"
                    >
                        {
                            loading
                                ? "Creating..."
                                : "Shorten"
                        }
                    </button>

                </form>

                {/* URL Table */}

                <div className="mt-10 bg-white rounded shadow overflow-hidden">

                    <table className="w-full">

                        <thead className="bg-gray-200">

                            <tr>

                                <th className="p-4">
                                    Original URL
                                </th>

                                <th>
                                    Short URL
                                </th>

                                <th>
                                    Clicks
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                urls.length === 0 ?

                                    (

                                        <tr>

                                            <td
                                                colSpan="4"
                                                className="text-center p-8"
                                            >

                                                No URLs Found

                                            </td>

                                        </tr>

                                    )

                                    :

                                    (

                                        urls.map((url) => (

                                            <tr
                                                key={url._id}
                                                className="border-t"
                                            >

                                                <td className="p-4 break-all">

                                                    {url.originalUrl}

                                                </td>

                                                <td>

                                                    <a
    href={`${process.env.VITE_BASE_URL}/${url.shortCode}`}
    target="_blank"
    rel="noreferrer"
    className="text-blue-600 hover:underline"
>

    {`${process.env.VITE_BASE_URL}/${url.shortCode}`}

</a>

                                                </td>

                                                <td>

                                                    {url.clicks}

                                                </td>

                                                <td>

                                                    <div className="flex gap-3">

                                                        <button
                                                            onClick={() =>
                                                                copyUrl(
                                                                    url.shortCode
                                                                )
                                                            }
                                                            className="text-green-600"
                                                        >

                                                            Copy

                                                        </button>

                                                        <Link
                                                            to={`/analytics/${url._id}`}
                                                            className="text-blue-600"
                                                        >

                                                            Analytics

                                                        </Link>

                                                        <button
                                                            onClick={() =>
                                                                deleteUrl(
                                                                    url._id
                                                                )
                                                            }
                                                            className="text-red-600"
                                                        >

                                                            Delete

                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        ))

                                    )

                            }

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}

export default Dashboard;