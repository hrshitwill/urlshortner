import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function Analytics() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [url, setUrl] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchAnalytics = async () => {

            try {

                const res = await api.get(`/url/${id}/analytics`);

                setUrl(res.data.data);

            } catch (error) {

                alert(
                    error.response?.data?.message ||
                    "Unable to fetch analytics"
                );

                navigate("/");

            } finally {

                setLoading(false);

            }

        };

        fetchAnalytics();

    }, [id, navigate]);

    if (loading) {

        return (

            <div className="flex justify-center items-center h-screen">

                <h1 className="text-2xl font-semibold">
                    Loading...
                </h1>

            </div>

        );

    }

    return (

        <div className="min-h-screen bg-gray-100">

            {/* Navbar */}

            <div className="bg-white shadow">

                <div className="max-w-5xl mx-auto flex justify-between items-center p-5">

                    <h1 className="text-3xl font-bold">

                        URL Analytics

                    </h1>

                    <Link
                        to="/"
                        className="bg-blue-600 text-white px-5 py-2 rounded"
                    >
                        Dashboard
                    </Link>

                </div>

            </div>

            {/* Analytics Card */}

            <div className="max-w-4xl mx-auto mt-10">

                <div className="bg-white shadow-lg rounded-lg p-8">

                    <div className="space-y-6">

                        <div>

                            <h3 className="text-gray-500 text-sm">
                                Original URL
                            </h3>

                            <p className="break-all text-lg">

                                {url.originalUrl}

                            </p>

                        </div>

                        <div>

                            <h3 className="text-gray-500 text-sm">
                                Short URL
                            </h3>

                            <a
    href={`${import.meta.env.VITE_BASE_URL}/${url.shortCode}`}
    target="_blank"
    rel="noreferrer"
    className="text-blue-600 hover:underline"
>
    {`${import.meta.env.VITE_BASE_URL}/${url.shortCode}`}
</a>

                        </div>

                        <div>

                            <h3 className="text-gray-500 text-sm">
                                Total Clicks
                            </h3>

                            <p className="text-4xl font-bold text-green-600">

                                {url.clicks}

                            </p>

                        </div>

                        <div>

                            <h3 className="text-gray-500 text-sm">
                                Created At
                            </h3>

                            <p>

                                {new Date(url.createdAt).toLocaleString()}

                            </p>

                        </div>

                        <div>

                            <h3 className="text-gray-500 text-sm">
                                Last Updated
                            </h3>

                            <p>

                                {new Date(url.updatedAt).toLocaleString()}

                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Analytics;