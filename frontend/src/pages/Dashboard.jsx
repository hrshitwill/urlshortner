import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // =========================
    // URL STATES
    // =========================

    const [urls, setUrls] = useState([]);

    const [originalUrl, setOriginalUrl] = useState("");
    const [customCode, setCustomCode] = useState("");
    const [expirationDays, setExpirationDays] = useState("");

    const [loading, setLoading] = useState(false);

    // =========================
    // QR STATES
    // =========================

    const [showQR, setShowQR] = useState(false);
    const [qrCode, setQrCode] = useState("");
    const [qrShortUrl, setQrShortUrl] = useState("");
    const [qrLoading, setQrLoading] = useState(false);

    // =========================
    // BASE URL
    // =========================

    const BASE_URL =
        import.meta.env.VITE_BASE_URL ||
        "http://localhost:3000";

    // =========================
    // FETCH URLS
    // =========================

    const fetchUrls = async () => {
        try {
            const res = await api.get("/url");

            setUrls(res.data.data || []);

        } catch (error) {
            console.error(
                "Fetch URLs error:",
                error.response?.data || error
            );
        }
    };

    // =========================
    // LOAD URLS
    // =========================

    useEffect(() => {
        fetchUrls();
    }, []);

    // =========================
    // CREATE SHORT URL
    // =========================

    const createShortUrl = async (e) => {
        e.preventDefault();

        const value = originalUrl.trim();
        const custom = customCode.trim();

        // Validate URL
        if (!value) {
            alert("Please enter a URL");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post("/url", {
                originalUrl: value,

                // Custom alias
                customCode: custom,

                // Expiration
                expirationDays:
                    expirationDays || undefined
            });

            console.log(
                "REQUEST SENT:",
                {
                    originalUrl: value,
                    customCode: custom,
                    expirationDays
                }
            );

            console.log(
                "SERVER RESPONSE:",
                response.data
            );

            // Clear form
            setOriginalUrl("");
            setCustomCode("");
            setExpirationDays("");

            // Refresh URLs
            await fetchUrls();

        } catch (error) {

            console.error(
                "Create URL error:",
                error.response?.data || error
            );

            alert(
                error.response?.data?.message ||
                "Failed to create URL"
            );

        } finally {
            setLoading(false);
        }
    };

    // =========================
    // DELETE URL
    // =========================

    const deleteUrl = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this URL?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await api.delete(`/url/${id}`);

            await fetchUrls();

        } catch (error) {

            console.error(
                "Delete error:",
                error.response?.data || error
            );

            alert(
                error.response?.data?.message ||
                "Failed to delete URL"
            );
        }
    };

    // =========================
    // LOGOUT
    // =========================

    const handleLogout = async () => {

        try {

            await logout();

            navigate("/login");

        } catch (error) {

            console.error(
                "Logout error:",
                error
            );
        }
    };

    // =========================
    // COPY URL
    // =========================

    const copyUrl = async (shortCode) => {

        try {

            const shortUrl =
                `${BASE_URL}/${shortCode}`;

            await navigator.clipboard.writeText(
                shortUrl
            );

            alert("Short URL copied!");

        } catch (error) {

            console.error(
                "Copy error:",
                error
            );

            alert("Failed to copy URL");
        }
    };

    // =========================
    // QR CODE
    // =========================

    const openQRCode = async (id) => {

        try {

            setShowQR(true);
            setQrLoading(true);

            setQrCode("");
            setQrShortUrl("");

            const res =
                await api.get(`/url/${id}/qr`);

            console.log(
                "QR RESPONSE:",
                res.data
            );

            setQrCode(
                res.data.data.qrCode
            );

            setQrShortUrl(
                res.data.data.shortUrl
            );

        } catch (error) {

            console.error(
                "QR error:",
                error.response?.data || error
            );

            setShowQR(false);

            alert(
                error.response?.data?.message ||
                "Failed to generate QR code"
            );

        } finally {

            setQrLoading(false);
        }
    };

    // =========================
    // CLOSE QR
    // =========================

    const closeQR = () => {

        setShowQR(false);

        setQrCode("");
        setQrShortUrl("");
    };

    // =========================
    // CHECK EXPIRATION
    // =========================

    const isExpired = (expiresAt) => {

        if (!expiresAt) {
            return false;
        }

        return new Date(expiresAt) <= new Date();
    };

    // =========================
    // FORMAT DATE
    // =========================

    const formatDate = (date) => {

        if (!date) {
            return "Never";
        }

        return new Date(date).toLocaleString();
    };

    // =========================
    // UI
    // =========================

    return (
        <div className="min-h-screen bg-gray-100">

            {/* =========================
                NAVBAR
            ========================= */}

            <div className="bg-white shadow">

                <div className="max-w-7xl mx-auto px-4 py-5 flex justify-between items-center">

                    <h1 className="text-3xl font-bold">
                        URL Shortener
                    </h1>

                    <div className="flex items-center gap-4">

                        <Link
                            to="/profile"
                            className="text-blue-600 hover:underline"
                        >
                            {user?.name || "Profile"}
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
                MAIN
            ========================= */}

            <div className="max-w-7xl mx-auto px-4 py-10">

                {/* =========================
                    CREATE URL CARD
                ========================= */}

                <div className="bg-white rounded-xl shadow p-6">

                    <h2 className="text-2xl font-bold mb-6">
                        Create Short URL
                    </h2>

                    <form
                        onSubmit={createShortUrl}
                        className="space-y-5"
                    >

                        {/* ORIGINAL URL */}

                        <div>

                            <label className="block font-medium mb-2">
                                Original URL
                            </label>

                            <input
                                type="url"
                                placeholder="https://example.com"
                                value={originalUrl}
                                onChange={(e) =>
                                    setOriginalUrl(
                                        e.target.value
                                    )
                                }
                                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />

                        </div>


                        {/* CUSTOM ALIAS */}

                        <div>

                            <label className="block font-medium mb-2">

                                Custom Alias

                                <span className="text-gray-500 text-sm ml-2">
                                    (optional)
                                </span>

                            </label>

                            <input
                                type="text"
                                placeholder="my-link"
                                value={customCode}
                                onChange={(e) =>
                                    setCustomCode(
                                        e.target.value
                                    )
                                }
                                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <p className="text-sm text-gray-500 mt-2">

                                Example:

                                {" "}

                                {BASE_URL}/my-link

                            </p>

                        </div>


                        {/* EXPIRATION */}

                        <div>

                            <label className="block font-medium mb-2">
                                Expiration
                            </label>

                            <select
                                value={expirationDays}
                                onChange={(e) =>
                                    setExpirationDays(
                                        e.target.value
                                    )
                                }
                                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >

                                <option value="">
                                    Never expires
                                </option>

                                <option value="1">
                                    1 day
                                </option>

                                <option value="7">
                                    7 days
                                </option>

                                <option value="30">
                                    30 days
                                </option>

                                <option value="90">
                                    90 days
                                </option>

                                <option value="365">
                                    1 year
                                </option>

                            </select>

                        </div>


                        {/* SUBMIT */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium"
                        >

                            {loading
                                ? "Creating..."
                                : "Shorten URL"
                            }

                        </button>

                    </form>

                </div>


                {/* =========================
                    URL LIST
                ========================= */}

                <div className="mt-10">

                    <h2 className="text-2xl font-bold mb-5">
                        Your URLs
                    </h2>


                    <div className="bg-white rounded-xl shadow overflow-x-auto">

                        <table className="w-full min-w-[1000px]">

                            {/* HEADER */}

                            <thead className="bg-gray-200">

                                <tr>

                                    <th className="text-left p-4">
                                        Original URL
                                    </th>

                                    <th className="text-left p-4">
                                        Short URL
                                    </th>

                                    <th className="text-center p-4">
                                        Clicks
                                    </th>

                                    <th className="text-center p-4">
                                        Expiration
                                    </th>

                                    <th className="text-center p-4">
                                        Status
                                    </th>

                                    <th className="text-center p-4">
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            {/* BODY */}

                            <tbody>

                                {urls.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="6"
                                            className="text-center p-10 text-gray-500"
                                        >
                                            No URLs found
                                        </td>

                                    </tr>

                                ) : (

                                    urls.map((url) => {

                                        const expired =
                                            isExpired(
                                                url.expiresAt
                                            );

                                        const shortUrl =
                                            `${BASE_URL}/${url.shortCode}`;

                                        return (

                                            <tr
                                                key={url._id}
                                                className="border-t hover:bg-gray-50"
                                            >

                                                {/* ORIGINAL */}

                                                <td className="p-4 max-w-xs">

                                                    <div className="break-all">
                                                        {url.originalUrl}
                                                    </div>

                                                </td>


                                                {/* SHORT URL */}

                                                <td className="p-4 max-w-xs">

                                                    <a
                                                        href={shortUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className={`break-all hover:underline ${
                                                            expired
                                                                ? "text-gray-400"
                                                                : "text-blue-600"
                                                        }`}
                                                    >
                                                        {shortUrl}
                                                    </a>

                                                </td>


                                                {/* CLICKS */}

                                                <td className="text-center p-4">

                                                    {url.clicks || 0}

                                                </td>


                                                {/* EXPIRATION */}

                                                <td className="text-center p-4">

                                                    {formatDate(
                                                        url.expiresAt
                                                    )}

                                                </td>


                                                {/* STATUS */}

                                                <td className="text-center p-4">

                                                    {expired ? (

                                                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                                                            Expired
                                                        </span>

                                                    ) : (

                                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                                                            Active
                                                        </span>

                                                    )}

                                                </td>


                                                {/* ACTIONS */}

                                                <td className="p-4">

                                                    <div className="flex flex-wrap justify-center gap-2">

                                                        {/* COPY */}

                                                        <button
                                                            onClick={() =>
                                                                copyUrl(
                                                                    url.shortCode
                                                                )
                                                            }
                                                            disabled={expired}
                                                            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-3 py-1 rounded"
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
                                                            disabled={expired}
                                                            className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white px-3 py-1 rounded"
                                                        >
                                                            QR
                                                        </button>


                                                        {/* ANALYTICS */}

                                                        <Link
                                                            to={`/analytics/${url._id}`}
                                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                                        >
                                                            Analytics
                                                        </Link>


                                                        {/* DELETE */}

                                                        <button
                                                            onClick={() =>
                                                                deleteUrl(
                                                                    url._id
                                                                )
                                                            }
                                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                                        >
                                                            Delete
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        );
                                    })

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>


            {/* =========================
                QR MODAL
            ========================= */}

            {showQR && (

                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

                    <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center shadow-xl">

                        <h2 className="text-2xl font-bold mb-5">
                            Scan QR Code
                        </h2>


                        {/* LOADING */}

                        {qrLoading ? (

                            <div className="py-20">

                                <p className="text-gray-600">
                                    Generating QR Code...
                                </p>

                            </div>

                        ) : (

                            <>

                                {/* QR IMAGE */}

                                {qrCode && (

                                    <img
                                        src={qrCode}
                                        alt="QR Code"
                                        className="w-64 h-64 mx-auto"
                                    />

                                )}


                                {/* SHORT URL */}

                                <p className="text-sm text-gray-600 mt-4 break-all">

                                    {qrShortUrl}

                                </p>

                            </>

                        )}


                        {/* CLOSE */}

                        <button
                            onClick={closeQR}
                            className="mt-6 bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-lg"
                        >
                            Close
                        </button>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Dashboard;