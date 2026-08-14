import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
    const navigate = useNavigate();

    const { user, logout } = useAuth();

    // =========================
    // STATE
    // =========================

    const [urls, setUrls] = useState([]);
    const [originalUrl, setOriginalUrl] = useState("");

    const [loading, setLoading] = useState(false);
    const [qrLoading, setQrLoading] = useState(false);

    const [qrCode, setQrCode] = useState(null);
    const [qrShortUrl, setQrShortUrl] = useState("");

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    // =========================
    // FETCH URLS
    // =========================

    const fetchUrls = async () => {
        try {
            const res = await api.get("/url");

            setUrls(res.data?.data || []);
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
    // CREATE SHORT URL
    // =========================

    const createShortUrl = async (e) => {
        e.preventDefault();

        const value = originalUrl.trim();

        if (!value) {
            alert("Please enter a URL");
            return;
        }

        try {
            setLoading(true);

            await api.post("/url", {
                originalUrl: value
            });

            setOriginalUrl("");

            await fetchUrls();

        } catch (error) {
            console.error("Create URL error:", error);

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

        if (!confirmDelete) return;

        try {
            await api.delete(`/url/${id}`);

            await fetchUrls();

        } catch (error) {
            console.error("Delete URL error:", error);

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
            console.error("Logout failed:", error);
        }
    };

    // =========================
    // COPY URL
    // =========================

    const copyUrl = async (shortCode) => {
        const shortUrl = `${BASE_URL}/${shortCode}`;

        try {
            await navigator.clipboard.writeText(shortUrl);

            alert("Short URL copied!");

        } catch (error) {
            console.error("Copy error:", error);

            alert("Failed to copy URL");
        }
    };

    // =========================
    // OPEN QR CODE
    // =========================

    const openQRCode = async (id) => {
        try {
            setQrLoading(true);

            const res = await api.get(`/url/${id}/qr`);

            console.log("QR API RESPONSE:", res.data);

            const qr = res.data?.data?.qrCode;
            const shortUrl = res.data?.data?.shortUrl;

            if (!qr) {
                throw new Error(
                    "QR code was not returned by the server"
                );
            }

            setQrCode(qr);
            setQrShortUrl(shortUrl || "");

        } catch (error) {
            console.error("QR generation failed:", error);

            alert(
                error.response?.data?.message ||
                error.message ||
                "Failed to generate QR code"
            );

        } finally {
            setQrLoading(false);
        }
    };

    // =========================
    // CLOSE QR MODAL
    // =========================

    const closeQRCode = () => {
        setQrCode(null);
        setQrShortUrl("");
    };

    // =========================
    // DOWNLOAD QR
    // =========================

    const downloadQRCode = () => {
        if (!qrCode) return;

        try {
            const link = document.createElement("a");

            link.href = qrCode;
            link.download = "short-url-qr-code.png";

            document.body.appendChild(link);

            link.click();

            document.body.removeChild(link);

        } catch (error) {
            console.error("QR download error:", error);

            alert("Failed to download QR code");
        }
    };

    // =========================
    // JSX
    // =========================

    return (
        <div className="min-h-screen bg-gray-100">

            {/* =========================
                NAVBAR
            ========================= */}

            <nav className="bg-white shadow">

                <div className="max-w-6xl mx-auto flex justify-between items-center p-5">

                    <h1 className="text-2xl font-bold">
                        URL Shortener
                    </h1>

                    <div className="flex gap-5 items-center">

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

            </nav>

            {/* =========================
                MAIN CONTENT
            ========================= */}

            <main className="max-w-6xl mx-auto mt-10 px-4">

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

                                                    {/* COPY */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            copyUrl(
                                                                url.shortCode
                                                            )
                                                        }
                                                        className="text-green-600 hover:underline"
                                                    >
                                                        Copy
                                                    </button>

                                                    {/* QR CODE */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openQRCode(
                                                                url._id
                                                            )
                                                        }
                                                        disabled={qrLoading}
                                                        className="text-purple-600 hover:underline disabled:text-gray-400"
                                                    >
                                                        {qrLoading
                                                            ? "Generating..."
                                                            : "QR Code"
                                                        }
                                                    </button>

                                                    {/* ANALYTICS */}

                                                    <Link
                                                        to={`/analytics/${url._id}`}
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        Analytics
                                                    </Link>

                                                    {/* DELETE */}

                                                    <button
                                                        type="button"
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

            </main>

            {/* =========================
                QR CODE MODAL
            ========================= */}

            {qrCode && (

                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                    onClick={closeQRCode}
                >

                    <div
                        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* Header */}

                        <div className="flex items-center justify-between mb-5">

                            <h2 className="text-2xl font-bold">
                                Your QR Code
                            </h2>

                            <button
                                type="button"
                                onClick={closeQRCode}
                                className="text-2xl text-gray-500 hover:text-black"
                            >
                                ×
                            </button>

                        </div>

                        {/* QR */}

                        <div className="flex justify-center">

                            <div className="rounded-xl border bg-white p-4">

                                <img
                                    src={qrCode}
                                    alt="QR Code"
                                    width="256"
                                    height="256"
                                    className="block"
                                />

                            </div>

                        </div>

                        {/* Short URL */}

                        <p className="mt-5 text-center text-sm text-gray-600 break-all">
                            {qrShortUrl}
                        </p>

                        {/* Buttons */}

                        <div className="mt-6 flex gap-3">

                            <button
                                type="button"
                                onClick={downloadQRCode}
                                className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-white hover:bg-blue-700"
                            >
                                Download QR
                            </button>

                            <button
                                type="button"
                                onClick={closeQRCode}
                                className="flex-1 rounded-lg bg-gray-200 px-4 py-3 hover:bg-gray-300"
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