import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMember } from '../contexts/MemberContext';
import { useAudio } from '../contexts/AudioContext';
import { Plus, Trash2, ChevronRight } from 'lucide-react';

const AVATARS = ['👶','👧','👦','🧒','👩','👨','🦸‍♀️','🦸‍♂️','🧚','🦄','🐱','🐶','🐼','🦊','🦁','🐯'];
const AGES = [3, 4, 5, 6, 7, 8, 9, 10];

export default function MemberSelectPage() {
  const navigate = useNavigate();
  const { members, addMember, selectMember, deleteMember, getLevel } = useMember();
  const { playSound } = useAudio();
  
  const [showModal, setShowModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [form, setForm] = useState({ name: '', avatar: '👦', age: 5 });
  
  const handleSelect = (member) => {
    playSound('click');
    selectMember(member);
    navigate('/');
  };
  
  const handleAdd = () => {
    if (!form.name.trim()) return;
    playSound('levelUp');
    addMember(form.name.trim(), form.avatar, form.age);
    setShowModal(false);
    setForm({ name: '', avatar: '👦', age: 5 });
  };
  
  const handleDelete = (id) => {
    playSound('pop');
    deleteMember(id);
    setConfirmDelete(null);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 safe-top safe-bottom">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
          <div className="text-6xl mb-4">🎓</div>
          <h1 className="text-3xl font-bold text-white mb-2">Gia Đình Thông Minh</h1>
          <p className="text-white/80">Chọn con để bắt đầu học</p>
        </motion.div>
        
        {/* Members */}
        <div className="space-y-3 mb-6">
          <AnimatePresence>
            {members.map((member, i) => {
              const level = getLevel(member.xp || 0);
              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div
                    onClick={() => handleSelect(member)}
                    className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                  >
                    <span className="text-4xl">{member.avatar}</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{member.name}</h3>
                      <p className="text-sm text-gray-500">
                        {member.age} tuổi • Lv.{level.level}
                        {member.stats?.streak > 0 && <span className="text-orange-500 ml-2">🔥{member.stats.streak}</span>}
                      </p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setConfirmDelete(member); }}
                      className="p-2 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {members.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👨‍👩‍👧‍👦</div>
              <p className="text-white/80">Chưa có thành viên nào</p>
            </div>
          )}
        </div>
        
        {/* Add Button */}
        <button
          onClick={() => { playSound('click'); setShowModal(true); }}
          className="w-full py-4 bg-white/20 border-2 border-white/40 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-white/30 transition-colors"
        >
          <Plus className="w-5 h-5" /> Thêm Thành Viên
        </button>
        
        {/* Dashboard Link */}
        {members.length > 0 && (
          <p className="text-center mt-6">
            <button onClick={() => navigate('/dashboard')} className="text-white/70 hover:text-white underline text-sm">
              👨‍👩‍👧 Vào Dashboard Phụ Huynh
            </button>
          </p>
        )}
      </div>
      
      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-6 w-full max-w-sm"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Thêm Thành Viên</h2>
            
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Tên con..."
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 outline-none mb-4"
              autoFocus
            />
            
            <p className="text-sm font-medium text-gray-700 mb-2">Tuổi</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {AGES.map((age) => (
                <button
                  key={age}
                  onClick={() => setForm({ ...form, age })}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    form.age === age ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {age}
                </button>
              ))}
            </div>
            
            <p className="text-sm font-medium text-gray-700 mb-2">Avatar</p>
            <div className="grid grid-cols-8 gap-2 mb-6">
              {AVATARS.map((av) => (
                <button
                  key={av}
                  onClick={() => setForm({ ...form, avatar: av })}
                  className={`text-2xl p-1 rounded-lg ${form.avatar === av ? 'bg-indigo-100 ring-2 ring-indigo-500' : ''}`}
                >
                  {av}
                </button>
              ))}
            </div>
            
            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold">
                Hủy
              </button>
              <button
                onClick={handleAdd}
                disabled={!form.name.trim()}
                className="flex-1 py-3 bg-indigo-500 text-white rounded-xl font-semibold disabled:opacity-50"
              >
                Thêm
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Delete Confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs text-center">
            <div className="text-5xl mb-3">{confirmDelete.avatar}</div>
            <p className="text-gray-600 mb-4">
              Xóa <strong>{confirmDelete.name}</strong>?
              <br /><span className="text-red-500 text-sm">Mất tất cả dữ liệu!</span>
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold">
                Hủy
              </button>
              <button onClick={() => handleDelete(confirmDelete.id)} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-semibold">
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
