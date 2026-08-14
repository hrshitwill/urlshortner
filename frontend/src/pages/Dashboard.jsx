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

    // QR states
    const [qrCode, setQrCode] = useState(null);
    const [qrShortUrl, setQrShortUrl] = useState("");
    const [qrLoading, setQrLoading] = useState(false);

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    // =========================
    // Fetch URLs
    // =========================

    const fetchUrls = async () => {
        try {
            const res = await api.get("/url");

            setUrls(res.data.data || []);

        } catch (error) {
            console.error("Failed to fetch URLs:", error);

            if (error.response?.status === 401) {
                navigate("/login");
            }
        }
    };

    useEffect(() => {
        fetchUrls();
    }, []);

    // =========================
    // Create Short URL
    // =========================

    const createShortUrl = async (e) => {
        e.preventDefault();

        if (!originalUrl.trim()) {
            alert("Please enter a URL");
            return;
        }

        try {
            setLoading(true);

            await api.post("/url", {
                originalUrl: originalUrl.trim()
            });

            setOriginalUrl("");

            await fetchUrls();

        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to create URL"
            );

        } finally {
            setLoading(false);
        }
    };

    // =========================
    // Delete URL
    // =========================

    const deleteUrl = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this URL?"
        );

        if (!confirmDelete) return;

        try {

            await api.delete(`/url/${id}`);

            await fetchUrls();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete URL"
            );
        }
    };

    // =========================
    // Logout
    // =========================

    const handleLogout = async () => {

        try {

            await logout();

            navigate("/login");

        } catch (error) {

            console.error("Logout failed:", error);
        }
    };

    // =========================
    // Copy URL
    // =========================

    const copyUrl = async (shortCode) => {

        const shortUrl = `${BASE_URL}/${shortCode}`;

        try {

            await navigator.clipboard.writeText(shortUrl);

            alert("Short URL copied!");

        } catch (error) {

            console.error(error);

            alert("Failed to copy URL");
        }
    };

    // =========================
    // Generate QR Code
    // =========================

    const openQRCode = async (id) => {

        try {

            setQrLoading(true);

            const res = await api.get(`/url/${id}/qr`);

            setQrCode(res.data.data.qrCode);

            setQrShortUrl(res.data.data.shortUrl);

        } catch (error) {

            console.error("QR error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to generate QR code"
            );

        } finally {

            setQrLoading(false);
        }
    };

    // =========================
    // Close QR Modal
    // =========================

    const closeQRCode = () => {

        setQrCode(null);
        setQrShortUrl("");
    };

    // =========================
    // Download QR
    // =========================

    const downloadQRCode = () => {

        if (!qrCode) return;

        const link = document.createElement("a");

        link.href = qrCode;
        link.download = "short-url-qr-code.png";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-gray-100">

            {/* =========================
                NAVBAR
            ========================= */}

            <div className="bg-white shadow">

                <div className="max-w-6xl mx-auto flex justify-between items-center p-5">

                    <h1 className="text-2xl font-bold">
                        URL Shortener
                    </h1>

                    <div className="flex gap-5 items-center">

                        <Link
                            to="/profile"
                            className="text-blue-600 hover:underline"
                        >
                            {user?.name}
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                        >
                            Logout
                        </button>

                    </div>

                </div>

            </div>


            {/* =========================
                MAIN CONTENT
            ========================= */}

            <div className="max-w-6xl mx-auto mt-10 px-4">


                {/* =========================
                    CREATE URL
                ========================= */}

                <div className="bg-white p-6 rounded-lg shadow">

                    <h2 className="text-xl font-semibold mb-4">
                        Create Short URL
                    </h2>

                    <form
                        onSubmit={createShortUrl}
                        className="flex gap-4"
                    >

                        <input
                            type="url"
                            placeholder="https://example.com"
                            value={originalUrl}
                            onChange={(e) =>
                                setOriginalUrl(e.target.value)
                            }
                            className="flex-1 border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 rounded"
                        >
                            {loading
                                ? "Creating..."
                                : "Shorten"
                            }
                        </button>

                    </form>

                </div>


                {/* =========================
                    URL TABLE
                ========================= */}

                <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">

                    <div className="p-5 border-b">

                        <h2 className="text-xl font-semibold">
                            Your URLs
                        </h2>

                    </div>


                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-gray-200">

                                <tr>

                                    <th className="p-4 text-left">
                                        Original URL
                                    </th>

                                    <th className="p-4 text-left">
                                        Short URL
                                    </th>

                                    <th className="p-4">
                                        Clicks
                                    </th>

                                    <th className="p-4">
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {urls.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="4"
                                            className="text-center p-10 text-gray-500"
                                        >
                                            No URLs found
                                        </td>

                                    </tr>

                                ) : (

                                    urls.map((url) => (

                                        <tr
                                            key={url._id}
                                            className="border-t hover:bg-gray-50"
                                        >

                                            {/* Original URL */}

                                            <td className="p-4 max-w-xs">

                                                <div className="break-all">

                                                    {url.originalUrl}

                                                </div>

                                            </td>


                                            {/* Short URL */}

                                            <td className="p-4 max-w-xs">

                                                <a
                                                    href={`${BASE_URL}/${url.shortCode}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-blue-600 hover:underline break-all"
                                                >
                                                    {`${BASE_URL}/${url.shortCode}`}
                                                </a>

                                            </td>


                                            {/* Clicks */}

                                            <td className="p-4 text-center">

                                                {url.clicks}

                                            </td>


                                            {/* Actions */}

                                            <td className="p-4">

                                                <div className="flex gap-3 items-center justify-center flex-wrap">


                                                    {/* Copy */}

                                                    <button
                                                        onClick={() =>
                                                            copyUrl(
                                                                url.shortCode
                                                            )
                                                        }
                                                        className="text-green-600 hover:underline"
                                                    >
                                                        Copy
                                                    </button>


                                                    {/* QR */}

                                                    <button
                                                        onClick={() =>
                                                            openQRCode(
                                                                url._id
                                                            )
                                                        }
                                                        className="text-purple-600 hover:underline"
                                                    >
                                                        QR Code
                                                    </button>


                                                    {/* Analytics */}

                                                    <Link
                                                        to={`/analytics/${url._id}`}
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        Analytics
                                                    </Link>


                                                    {/* Delete */}

                                                    <button
                                                        onClick={() =>
                                                            deleteUrl(
                                                                url._id
                                                            )
                                                        }
                                                        className="text-red-600 hover:underline"
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>


            {/* =========================
                QR CODE MODAL
            ========================= */}

            {qrCode && (

                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

                    <div className="bg-white rounded-xl p-8 shadow-xl w-96 text-center">

                        <h2 className="text-2xl font-bold mb-2">
                            QR Code
                        </h2>

                        <p className="text-gray-500 text-sm mb-5 break-all">
                            {qrShortUrl}
                        </p>


                        {/* QR Image */}

                        <img
                            src={qrCode}
                            alt="QR Code"
                            className="w-64 h-64 mx-auto border p-2"
                        />


                        {/* Buttons */}

                        <div className="flex justify-center gap-4 mt-6">

                            <button
                                onClick={downloadQRCode}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
                            >
                                Download
                            </button>

                            <button
                                onClick={closeQRCode}
                                className="bg-gray-300 hover:bg-gray-400 px-5 py-2 rounded"
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Dashboard;