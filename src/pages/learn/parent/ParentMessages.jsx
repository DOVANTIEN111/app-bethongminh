// src/pages/learn/parent/ParentMessages.jsx
// Trang tin nhắn cho Phụ huynh - Chat với giáo viên
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';
import {
  MessageSquare, Send, User, ChevronLeft, Search,
  Clock, CheckCheck, Bell, GraduationCap, School
} from 'lucide-react';

export default function ParentMessages() {
  const { profile } = useAuth();
  const messagesEndRef = useRef(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - teachers list
  const [teachers, setTeachers] = useState([
    {
      id: '1',
      name: 'Cô Nguyễn Thị Hoa',
      subject: 'Giáo viên chủ nhiệm',
      avatar: null,
      lastMessage: 'Cháu học rất tiến bộ tuần này!',
      lastTime: '10:30',
      unread: 2,
    },
    {
      id: '2',
      name: 'Thầy Trần Văn Nam',
      subject: 'Giáo viên Toán',
      avatar: null,
      lastMessage: 'Cháu cần luyện thêm phép nhân',
      lastTime: 'Hôm qua',
      unread: 0,
    },
    {
      id: '3',
      name: 'Cô Lê Thị Mai',
      subject: 'Giáo viên Tiếng Anh',
      avatar: null,
      lastMessage: 'Bài tập về nhà đã được gửi',
      lastTime: '3 ngày trước',
      unread: 0,
    },
  ]);

  // Mock messages
  const [messages, setMessages] = useState([
    { id: '1', senderId: '1', content: 'Chào anh/chị, em gửi anh/chị báo cáo tuần này của cháu ạ!', time: '10:00', isMe: false },
    { id: '2', senderId: 'me', content: 'Cảm ơn cô đã thông báo. Cháu học có tiến bộ không ạ?', time: '10:15', isMe: true },
    { id: '3', senderId: '1', content: 'Cháu học rất tiến bộ tuần này! Đặc biệt là môn Toán đã cải thiện nhiều.', time: '10:30', isMe: false },
  ]);

  // Notifications from school
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Thông báo nghỉ Tết Nguyên Đán',
      content: 'Trường thông báo lịch nghỉ Tết từ ngày 08/02 đến 14/02/2024',
      time: '1 ngày trước',
      isRead: false,
    },
    {
      id: '2',
      title: 'Họp phụ huynh học kỳ 2',
      content: 'Kính mời phụ huynh tham dự họp vào ngày 15/02/2024',
      time: '3 ngày trước',
      isRead: true,
    },
  ]);

  const [activeTab, setActiveTab] = useState('teachers');

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedConversation) return;

    setSending(true);
    try {
      // Add message to local state (mock)
      const newMessage = {
        id: Date.now().toString(),
        senderId: 'me',
        content: message.trim(),
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        isMe: true,
      };
      setMessages([...messages, newMessage]);
      setMessage('');

      // TODO: Save to database
      // await supabase.from('messages').insert({...})
    } catch (err) {
      console.error('Send message error:', err);
      alert('Có lỗi xảy ra khi gửi tin nhắn');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredTeachers = teachers.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Chat view
  if (selectedConversation) {
    const teacher = teachers.find(t => t.id === selectedConversation);

    return (
      <div className="flex flex-col h-[calc(100vh-140px)]">
        {/* Chat Header */}
        <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSelectedConversation(null)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-800">{teacher?.name}</p>
            <p className="text-xs text-gray-500">{teacher?.subject}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  msg.isMe
                    ? 'bg-indigo-600 text-white rounded-br-md'
                    : 'bg-white text-gray-800 rounded-bl-md shadow-sm'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <div className={`flex items-center justify-end gap-1 mt-1 ${
                  msg.isMe ? 'text-indigo-200' : 'text-gray-400'
                }`}>
                  <span className="text-xs">{msg.time}</span>
                  {msg.isMe && <CheckCheck className="w-3 h-3" />}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white border-t px-4 py-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn..."
              className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || sending}
              className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Conversations list view
  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h1 className="text-lg font-bold text-gray-800 mb-1">Tin nhắn</h1>
        <p className="text-sm text-gray-500">Liên hệ với giáo viên và xem thông báo từ trường</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white rounded-xl p-2 shadow-sm">
        <button
          onClick={() => setActiveTab('teachers')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all ${
            activeTab === 'teachers'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span className="text-sm font-medium">Giáo viên</span>
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all relative ${
            activeTab === 'notifications'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-gray-500 hover:bg-gray-50'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span className="text-sm font-medium">Thông báo</span>
          {notifications.some(n => !n.isRead) && (
            <span className="absolute top-1 right-1/4 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </button>
      </div>

      {activeTab === 'teachers' && (
        <>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm giáo viên..."
              className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border-none shadow-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Teachers List */}
          <div className="space-y-2">
            {filteredTeachers.map((teacher) => (
              <button
                key={teacher.id}
                onClick={() => setSelectedConversation(teacher.id)}
                className="w-full bg-white rounded-xl p-4 shadow-sm flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-indigo-600" />
                  </div>
                  {teacher.unread > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {teacher.unread}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-800">{teacher.name}</p>
                    <span className="text-xs text-gray-400">{teacher.lastTime}</span>
                  </div>
                  <p className="text-sm text-gray-500">{teacher.subject}</p>
                  <p className="text-sm text-gray-400 truncate">{teacher.lastMessage}</p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {activeTab === 'notifications' && (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-xl p-4 shadow-sm ${
                !notification.isRead ? 'border-l-4 border-indigo-500' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  notification.isRead ? 'bg-gray-100' : 'bg-indigo-100'
                }`}>
                  <School className={`w-5 h-5 ${
                    notification.isRead ? 'text-gray-500' : 'text-indigo-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className={`font-medium ${
                      notification.isRead ? 'text-gray-700' : 'text-gray-900'
                    }`}>
                      {notification.title}
                    </p>
                    <span className="text-xs text-gray-400">{notification.time}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{notification.content}</p>
                </div>
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Không có thông báo mới</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
