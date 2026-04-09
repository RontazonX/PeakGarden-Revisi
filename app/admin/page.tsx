'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import { ArrowLeft, Users, Plus, Trash2, Save, Upload, Image as ImageIcon, Lock, LogOut } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  img: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  useEffect(() => {
    // Check session storage for admin auth
    if (sessionStorage.getItem('smartgarden_admin_auth') === 'true') {
      setIsAuthenticated(true);
    }
    
    // Load team from localStorage or use defaults
    const savedTeam = localStorage.getItem('smartgarden_team');
    if (savedTeam) {
      try {
        setTeam(JSON.parse(savedTeam));
      } catch (e) {
        console.error('Failed to parse team data', e);
        loadDefaults();
      }
    } else {
      loadDefaults();
    }
  }, []);

  const loadDefaults = () => {
    setTeam([
      { id: '1', name: 'Ivan Prasetya', role: 'Informatics / Developer', img: 'https://ui-avatars.com/api/?name=Ivan+Prasetya&background=059669&color=fff&size=300' },
      { id: '2', name: 'Medwin Deporangga', role: 'Developer / Engineer', img: 'https://ui-avatars.com/api/?name=Medwin+Deporangga&background=0f766e&color=fff&size=300' }
    ]);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple hardcoded admin credentials
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('smartgarden_admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Username atau password salah.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('smartgarden_admin_auth');
    setUsername('');
    setPassword('');
  };

  const handleSave = () => {
    setIsSaving(true);
    try {
      localStorage.setItem('smartgarden_team', JSON.stringify(team));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error('Failed to save team data', e);
      alert('Gagal menyimpan data. Mungkin ukuran foto terlalu besar.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddMember = () => {
    const newId = Date.now().toString();
    setTeam([...team, { id: newId, name: 'Anggota Baru', role: 'Posisi', img: 'https://ui-avatars.com/api/?name=Anggota+Baru&background=94a3b8&color=fff&size=300' }]);
  };

  const handleRemoveMember = (id: string) => {
    setTeam(team.filter(member => member.id !== id));
  };

  const handleChange = (id: string, field: keyof TeamMember, value: string) => {
    setTeam(team.map(member => member.id === id ? { ...member, [field]: value } : member));
  };

  const handleImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 500KB to avoid localStorage quota issues)
    if (file.size > 500 * 1024) {
      alert('Ukuran foto terlalu besar. Maksimal 500KB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      handleChange(id, 'img', base64String);
    };
    reader.readAsDataURL(file);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 w-full max-w-md"
        >
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-center text-slate-900 mb-2">Admin Login</h1>
          <p className="text-slate-500 text-center mb-8">Masuk untuk mengelola konten website</p>

          <form onSubmit={handleLogin} className="space-y-5">
            {loginError && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 text-center">
                {loginError}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="Masukkan username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="Masukkan password"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-emerald-600/30 mt-4"
            >
              Masuk
            </button>
          </form>
          
          <div className="mt-6 text-center text-xs text-slate-400">
            Hint: admin / admin123
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-12 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/')}
              className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-sm shrink-0"
              title="Kembali ke Beranda"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Admin Panel</h1>
              <p className="text-slate-500 mt-1 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Kelola Data "Tentang Kami"
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleAddMember}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Tambah
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm shadow-emerald-600/20 disabled:opacity-70"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Menyimpan...' : 'Simpan'}
            </button>
            <button 
              onClick={handleLogout}
              className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors shadow-sm shrink-0 ml-2"
              title="Keluar"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {saveSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
              <Save className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="font-medium">Berhasil disimpan!</p>
              <p className="text-sm opacity-80">Perubahan akan terlihat di halaman Tentang Kami.</p>
            </div>
          </motion.div>
        )}

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 md:p-8 space-y-8">
            {team.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-1">Belum ada anggota tim</h3>
                <p className="text-slate-500 mb-6">Tambahkan anggota tim untuk menampilkannya di halaman Tentang Kami.</p>
                <button 
                  onClick={handleAddMember}
                  className="px-4 py-2 bg-emerald-50 text-emerald-700 font-medium rounded-xl hover:bg-emerald-100 transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Anggota Pertama
                </button>
              </div>
            ) : (
              team.map((member, index) => (
                <motion.div 
                  key={member.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex flex-col md:flex-row gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100 relative group"
                >
                  <button 
                    onClick={() => handleRemoveMember(member.id)}
                    className="absolute top-4 right-4 w-8 h-8 bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 rounded-lg flex items-center justify-center transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"
                    title="Hapus Anggota"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Photo Upload Section */}
                  <div className="shrink-0 flex flex-col items-center gap-3">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md bg-slate-200 group/photo">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-opacity">
                        <button 
                          onClick={() => fileInputRefs.current[member.id]?.click()}
                          className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
                        >
                          <Upload className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <input 
                      type="file" 
                      accept="image/jpeg, image/png, image/webp"
                      className="hidden"
                      ref={el => { fileInputRefs.current[member.id] = el; }}
                      onChange={(e) => handleImageUpload(member.id, e)}
                    />
                    <button 
                      onClick={() => fileInputRefs.current[member.id]?.click()}
                      className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                    >
                      <ImageIcon className="w-3 h-3" />
                      Ganti Foto
                    </button>
                  </div>

                  {/* Details Section */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                      <input 
                        type="text" 
                        value={member.name}
                        onChange={(e) => handleChange(member.id, 'name', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
                        placeholder="Contoh: Ivan Prasetya"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Jabatan / Peran</label>
                      <input 
                        type="text" 
                        value={member.role}
                        onChange={(e) => handleChange(member.id, 'role', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
                        placeholder="Contoh: Developer / Engineer"
                      />
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
