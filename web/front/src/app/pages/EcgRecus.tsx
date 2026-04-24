import { useState, useRef } from 'react';
import { MedecinLayout } from '../components/MedecinLayout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Upload,
  Loader2,
  Inbox,
  FileText,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { uploadECG } from '../../services/api';

export default function EcgRecus() {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const finalTitle = title || file.name;

    try {
      setUploading(true);
      const { analysis } = await uploadECG({ 
        file, 
        title: finalTitle, 
        patientId: null 
      });
      navigate(`/ecg-analysis/${analysis._id}`);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Erreur lors de l'envoi de l'ECG");
    } finally {
      setUploading(false);
      setTitle('');
    }
  };

  return (
    <MedecinLayout>
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-indigo-50 border border-indigo-100">
              <Inbox className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">ECG Reçus</h1>
              <p className="text-gray-500 text-sm">Mode Test : Upload direct sans patient</p>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <Input 
              placeholder="Titre de l'ECG..." 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="w-48"
            />
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileChange}
              accept="image/*"
            />
            <Button 
              onClick={handleUploadClick}
              disabled={uploading}
              className="gap-2 bg-indigo-600 hover:bg-indigo-700"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading ? 'Envoi...' : '+ Envoyer ECG'}
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <FileText className="w-12 h-12 mx-auto text-gray-200 mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-1">Prêt pour le test</h2>
          <p className="text-gray-500 max-w-sm mx-auto">
            Utilisez le bouton en haut à droite pour uploader une image d'ECG. 
            L'analyse sera créée anonymement et vous serez redirigé vers la page d'analyse.
          </p>
        </div>
      </div>
    </MedecinLayout>
  );
}
