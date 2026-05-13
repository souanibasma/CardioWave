import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

export default function CompleteProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [specialty, setSpecialty] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [hospitalOrClinic, setHospitalOrClinic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!specialty || !licenseNumber || !hospitalOrClinic) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // API call to update profile
      await API.put("/doctor/profile", {
        specialty,
        licenseNumber,
        hospitalOrClinic,
      });

      // After completing profile, doctor goes to pending validation state
      // (The backend should trigger admin notification, or we just redirect them to dashboard to see "en attente")
      navigate("/tableau-de-bord");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de la mise à jour du profil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Complétez votre profil médecin
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ces informations sont nécessaires pour valider votre compte.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
          
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">Spécialité</label>
              <input
                id="specialty"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">Numéro de licence (RPPS / Ordre)</label>
              <input
                id="licenseNumber"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="hospitalOrClinic" className="block text-sm font-medium text-gray-700">Hôpital ou Clinique</label>
              <input
                id="hospitalOrClinic"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={hospitalOrClinic}
                onChange={(e) => setHospitalOrClinic(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Finaliser mon inscription"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
