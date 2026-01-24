// src/pages/parent/ParentMessagesPage.jsx
// Parent Messages Page
import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare, Search, Send, ChevronLeft, Check, CheckCheck,
  Bell, Users, ChevronRight
} from 'lucide-react';

const MOCK_TEACHERS = [
  {
    id: 1,
    name: 'Cô Nguyễn Thị Mai',
    role: 'Giáo viên chủ nhiệm',
    child: 'Minh Anh',
    class: 'Lớp 3A',
    avatar: '👩‍🏫',
    online: true,
    lastMessage: 'Minh Anh học rất tốt tuần này',
    lastTime: '10:30',
    unread: 2,
  },
  {
    id: 2,
    name: 'Cô Trần Thị Lan',
    role: 'Giáo viên chủ nhiệm',
    child: 'Gia Bảo',
    class: 'Lớp 1B',
    avatar: '👩‍🏫',
    online: false,
    lastMessage: 'Cảm ơn phụ huynh đã quan tâm',
    lastTime: 'Hôm qua',
    unread: 0,
  },
  {
    id: 3,
    name: 'Thầy Lê Văn Hùng',
    role: 'Giáo viên Toán',
    child: 'Minh Anh',
    class: 'Lớp 3A',
    avatar: '👨‍🏫',
    online: true,
    lastMessage: 'Bài tập Toán tuần này khá tốt',
    lastTime: 'Hôm qua',
    unread: 0,
  },
];

const MOCK_MESSAGES = [
  { id: 1, from: 'teacher', text: 'Xin chào phụ huynh ạ', time: '09:00', read: true },
  { id: 2, from: 'parent', text: 'Xin chào cô, con tôi học thế nào ạ?', time: '09:05', read: true },
  { id: 3, from: 'teacher', text: 'Con học rất chăm chỉ và tiến bộ nhiều. Đặc biệt là môn Tiếng Anh, con rất hứng thú.', time: '09:10', read: true },
  { id: 4, from: 'parent', text: 'Cảm ơn cô đã thông báo. Ở nhà cháu cũng rất thích học Tiếng Anh.', time: '09:15', read: true },
  { id: 5, from: 'teacher', text: 'Minh Anh học rất tốt tuần này, đạt 95 điểm bài kiểm tra Toán!', time: '10:30', read: false },
];

const MOCK_ANNOUNCEMENTS = [
  {
    id: 1,
    title: 'Thông báo nghỉ Tết Nguyên đán',
    content: 'Nhà trường thông báo lịch nghỉ Tết từ 25/01 đến 05/02/2025',
    date: '2025-01-20',
    read: false,
  },
  {
    id: 2,
    title: 'Họp phụ huynh cuối kỳ',
    content: 'Kính mời phụ huynh tham dự buổi họp phụ huynh vào ngày 15/01/2025',
    date: '2025-01-10',
    read: true,
  },
];

export default function ParentMessagesPage() {
  const [activeTab, setActiveTab] = useState('messages');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    setMessages(prev => [...prev, {
      id: Date.now(),
      from: 'parent',
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      read: false,
    }]);
    setNewMessage('');
  };

  const filteredTeachers = MOCK_TEACHERS.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.child.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Chat View
  if (selectedTeacher) {
    return (
      <div className="h-[calc(100vh-140px)] flex flex-col bg-white">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-3 bg-gradient-to-r from-purple-50 to-blue-50">
          <button
            onClick={() => setSelectedTeacher(null)}
            className="p-2 hover:bg-white rounded-lg"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="relative">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
              {selectedTeacher.avatar}
            </div>
            {selectedTeacher.online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>
          <div className="flex-1">
            <p className="font-bold text-gray-800">{selectedTeacher.name}</p>
            <p className="text-xs text-gray-500">
              {selectedTeacher.role} • {selectedTeacher.class}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.from === 'parent' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                  msg.from === 'parent'
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-br-sm'
                    : 'bg-white text-gray-800 shadow rounded-bl-sm'
                }`}
              >
                <p>{msg.text}</p>
                <div className={`flex items-center justify-end gap-1 mt-1 ${
                  msg.from === 'parent' ? 'text-white/70' : 'text-gray-400'
                }`}>
                  <span className="text-xs">{msg.time}</span>
                  {msg.from === 'parent' && (
                    msg.read ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Nhập tin nhắn..."
              className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full hover:shadow-lg disabled:opacity-50 transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <MessageSquare className="w-7 h-7 text-purple-500" />
          Tin nhắn
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-2xl p-1">
        <button
          onClick={() => setActiveTab('messages')}
          className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
            activeTab === 'messages'
              ? 'bg-white text-purple-600 shadow'
              : 'text-gray-500'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          Giáo viên
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
            activeTab === 'announcements'
              ? 'bg-white text-purple-600 shadow'
              : 'text-gray-500'
          }`}
        >
          <Bell className="w-5 h-5" />
          Thông báo
        </button>
      </div>

      {activeTab === 'messages' && (
        <>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm giáo viên..."
              className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          {/* Teachers List */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="divide-y divide-gray-50">
              {filteredTeachers.map((teacher) => (
                <button
                  key={teacher.id}
                  onClick={() => setSelectedTeacher(teacher)}
                  className={`w-full p-4 hover:bg-gray-50 transition-colors text-left ${
                    teacher.unread > 0 ? 'bg-purple-50/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
                        {teacher.avatar}
                      </div>
                      {teacher.online && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-gray-800">{teacher.name}</p>
                        <span className="text-xs text-gray-400">{teacher.lastTime}</span>
                      </div>
                      <p className="text-xs text-purple-600">{teacher.role} • {teacher.child}</p>
                      <p className="text-sm text-gray-500 truncate">{teacher.lastMessage}</p>
                    </div>
                    {teacher.unread > 0 && (
                      <span className="w-6 h-6 bg-purple-500 text-white rounded-full text-xs flex items-center justify-center font-bold">
                        {teacher.unread}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'announcements' && (
        <div className="space-y-3">
          {MOCK_ANNOUNCEMENTS.map((announcement) => (
            <div
              key={announcement.id}
              className={`bg-white rounded-2xl shadow-lg p-4 ${
                !announcement.read ? 'ring-2 ring-purple-200' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  !announcement.read ? 'bg-purple-100' : 'bg-gray-100'
                }`}>
                  <Bell className={`w-6 h-6 ${
                    !announcement.read ? 'text-purple-500' : 'text-gray-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-gray-800">{announcement.title}</h3>
                    {!announcement.read && (
                      <span className="w-2 h-2 bg-purple-500 rounded-full" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{announcement.content}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(announcement.date).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {MOCK_ANNOUNCEMENTS.length === 0 && (
            <div className="bg-white rounded-2xl p-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Không có thông báo mới</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
