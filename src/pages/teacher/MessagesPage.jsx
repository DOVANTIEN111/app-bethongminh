// src/pages/teacher/MessagesPage.jsx
// Teacher's Messages Page
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  MessageSquare, Search, Loader2, Send, Users,
  Bell, ChevronRight, Check, CheckCheck
} from 'lucide-react';

export default function MessagesPage() {
  const { profile } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastClass, setBroadcastClass] = useState('');
  const [classes, setClasses] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (profile?.id) {
      loadData();
    }
  }, [profile?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadData = async () => {
    try {
      // Load classes
      const { data: classesData } = await supabase
        .from('classes')
        .select('id, name')
        .eq('teacher_id', profile.id)
        .order('name');

      setClasses(classesData || []);

      // Mock contacts (parents of students)
      setContacts([
        {
          id: 'c1',
          name: 'Phu huynh - Nguyen Van A',
          student: 'Nguyen Van A',
          class: 'Lop 3A',
          lastMessage: 'Cam on thay da thong bao',
          time: '10:30',
          unread: 0,
          online: true,
        },
        {
          id: 'c2',
          name: 'Phu huynh - Tran Thi B',
          student: 'Tran Thi B',
          class: 'Lop 3A',
          lastMessage: 'Con toi hom nay co di hoc khong a?',
          time: '09:15',
          unread: 2,
          online: false,
        },
        {
          id: 'c3',
          name: 'Phu huynh - Le Van C',
          student: 'Le Van C',
          class: 'Lop 3B',
          lastMessage: 'Da nhan duoc thong bao',
          time: 'Hom qua',
          unread: 0,
          online: true,
        },
        {
          id: 'c4',
          name: 'Phu huynh - Pham Thi D',
          student: 'Pham Thi D',
          class: 'Lop 3B',
          lastMessage: 'Xin cam on thay',
          time: 'Hom qua',
          unread: 0,
          online: false,
        },
      ]);
    } catch (err) {
      console.error('Load data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    // Mock messages
    setMessages([
      { id: 'm1', from: 'parent', text: 'Xin chao thay a', time: '09:00', read: true },
      { id: 'm2', from: 'teacher', text: 'Xin chao phu huynh', time: '09:05', read: true },
      { id: 'm3', from: 'parent', text: 'Thay cho toi hoi ve tinh hinh hoc tap cua con', time: '09:10', read: true },
      { id: 'm4', from: 'teacher', text: 'Con hoc tot, cham chi lam bai tap. Tuy nhien can cai thien phan doc hieu', time: '09:15', read: true },
      { id: 'm5', from: 'parent', text: 'Cam on thay da thong bao', time: '09:20', read: true },
    ]);
    // Clear unread
    setContacts(prev => prev.map(c =>
      c.id === contact.id ? { ...c, unread: 0 } : c
    ));
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return;

    setMessages(prev => [...prev, {
      id: 'm' + Date.now(),
      from: 'teacher',
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      read: false,
    }]);

    // Update last message in contacts
    setContacts(prev => prev.map(c =>
      c.id === selectedContact.id
        ? { ...c, lastMessage: newMessage.trim(), time: 'Vua xong' }
        : c
    ));

    setNewMessage('');
  };

  const handleBroadcast = () => {
    if (!broadcastMessage.trim() || !broadcastClass) return;

    alert(`Da gui thong bao den tat ca phu huynh lop ${classes.find(c => c.id === broadcastClass)?.name}`);
    setBroadcastMessage('');
    setBroadcastClass('');
    setShowBroadcastModal(false);
  };

  const filteredContacts = contacts.filter(c =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.student?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-140px)]">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden h-full flex">
        {/* Contacts List */}
        <div className={`w-full md:w-80 border-r border-gray-100 flex flex-col ${selectedContact ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Tin nhan</h3>
              <button
                onClick={() => setShowBroadcastModal(true)}
                className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200"
                title="Gui thong bao"
              >
                <Bell className="w-5 h-5" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tim kiem..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-50 ${
                  selectedContact?.id === contact.id ? 'bg-emerald-50' : ''
                }`}
                onClick={() => handleSelectContact(contact)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xl">👨‍👩‍👧</span>
                    </div>
                    {contact.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900 text-sm truncate">{contact.name}</p>
                      <span className="text-xs text-gray-400">{contact.time}</span>
                    </div>
                    <p className="text-xs text-emerald-600">{contact.class}</p>
                    <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
                  </div>
                  {contact.unread > 0 && (
                    <span className="w-5 h-5 bg-emerald-600 text-white rounded-full text-xs flex items-center justify-center">
                      {contact.unread}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {filteredContacts.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Khong co lien he nao</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${selectedContact ? 'flex' : 'hidden md:flex'}`}>
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                <button
                  onClick={() => setSelectedContact(null)}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronRight className="w-5 h-5 rotate-180" />
                </button>
                <div className="relative">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span>👨‍👩‍👧</span>
                  </div>
                  {selectedContact.online && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{selectedContact.name}</p>
                  <p className="text-xs text-gray-500">
                    {selectedContact.online ? 'Dang hoat dong' : 'Offline'}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.from === 'teacher' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                        msg.from === 'teacher'
                          ? 'bg-emerald-600 text-white rounded-br-sm'
                          : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <div className={`flex items-center justify-end gap-1 mt-1 ${
                        msg.from === 'teacher' ? 'text-emerald-200' : 'text-gray-400'
                      }`}>
                        <span className="text-xs">{msg.time}</span>
                        {msg.from === 'teacher' && (
                          msg.read ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Nhap tin nhan..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="p-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Chon mot cuoc tro chuyen</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald-600" />
                Gui thong bao cho lop
              </h3>
              <button onClick={() => setShowBroadcastModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chon lop
                </label>
                <select
                  value={broadcastClass}
                  onChange={(e) => setBroadcastClass(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- Chon lop --</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Noi dung thong bao
                </label>
                <textarea
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="Nhap noi dung thong bao..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowBroadcastModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50"
                >
                  Huy
                </button>
                <button
                  onClick={handleBroadcast}
                  disabled={!broadcastMessage.trim() || !broadcastClass}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50"
                >
                  Gui thong bao
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
