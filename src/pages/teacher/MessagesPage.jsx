// src/pages/teacher/MessagesPage.jsx
// Teacher's Messages Page with Real Database and Realtime
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  MessageSquare, Search, Loader2, Send, Users,
  Bell, ChevronRight, Check, CheckCheck, X, AlertCircle
} from 'lucide-react';

export default function MessagesPage() {
  const { profile } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastClass, setBroadcastClass] = useState('');
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [classes, setClasses] = useState([]);
  const [sendingBroadcast, setSendingBroadcast] = useState(false);
  const messagesEndRef = useRef(null);
  const channelRef = useRef(null);

  useEffect(() => {
    if (profile?.id) {
      loadData();
    }
    return () => {
      // Cleanup subscription
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [profile?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Setup realtime subscription for new messages
  useEffect(() => {
    if (!profile?.id) return;

    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${profile.id}`,
        },
        async (payload) => {
          const newMsg = payload.new;

          // Fetch sender info
          const { data: senderData } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', newMsg.sender_id)
            .single();

          // Update contacts list
          setContacts(prev => {
            const existingIndex = prev.findIndex(c =>
              c.parentId === newMsg.sender_id || c.studentId === newMsg.student_id
            );

            if (existingIndex >= 0) {
              const updated = [...prev];
              updated[existingIndex] = {
                ...updated[existingIndex],
                lastMessage: newMsg.content?.substring(0, 50),
                time: 'Vừa xong',
                unread: (updated[existingIndex].unread || 0) + 1,
              };
              // Move to top
              const [contact] = updated.splice(existingIndex, 1);
              updated.unshift(contact);
              return updated;
            }
            return prev;
          });

          // If chat is open with this sender, add message
          if (selectedContact && (
            selectedContact.parentId === newMsg.sender_id ||
            selectedContact.studentId === newMsg.student_id
          )) {
            setMessages(prev => [...prev, {
              id: newMsg.id,
              from: 'parent',
              text: newMsg.content,
              time: new Date(newMsg.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
              read: true,
            }]);

            // Mark as read
            await supabase
              .from('messages')
              .update({ is_read: true, read_at: new Date().toISOString() })
              .eq('id', newMsg.id);
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id, selectedContact]);

  const loadData = async () => {
    try {
      // Load classes
      const { data: classesData } = await supabase
        .from('classes')
        .select('id, name')
        .eq('teacher_id', profile.id)
        .eq('is_active', true)
        .order('name');

      setClasses(classesData || []);

      // Get class IDs
      const classIds = classesData?.map(c => c.id) || [];

      if (classIds.length === 0) {
        setLoading(false);
        return;
      }

      // Get students in teacher's classes with their parent info
      const { data: studentsData } = await supabase
        .from('class_students')
        .select(`
          student_id,
          class_id,
          profiles:student_id(
            id,
            full_name,
            parent_phone,
            parent_name
          ),
          classes:class_id(name)
        `)
        .in('class_id', classIds);

      // Build contacts from students (for parent communication)
      const contactsList = [];
      const processedParents = new Set();

      for (const studentData of (studentsData || [])) {
        const student = studentData.profiles;
        const className = studentData.classes?.name || '';

        if (!student || processedParents.has(student.id)) continue;
        processedParents.add(student.id);

        // Get last message with this parent/student
        const { data: lastMsgData } = await supabase
          .from('messages')
          .select('content, created_at, is_read, sender_id')
          .or(`and(sender_id.eq.${profile.id},student_id.eq.${student.id}),and(receiver_id.eq.${profile.id},student_id.eq.${student.id})`)
          .order('created_at', { ascending: false })
          .limit(1);

        const lastMsg = lastMsgData?.[0];

        // Count unread messages
        const { count: unreadCount } = await supabase
          .from('messages')
          .select('id', { count: 'exact', head: true })
          .eq('receiver_id', profile.id)
          .eq('student_id', student.id)
          .eq('is_read', false);

        contactsList.push({
          id: `student-${student.id}`,
          studentId: student.id,
          parentId: null, // Will be set when parent sends message
          name: `PH - ${student.full_name}`,
          parentName: student.parent_name || 'Phụ huynh',
          student: student.full_name,
          class: className,
          lastMessage: lastMsg?.content?.substring(0, 50) || 'Chưa có tin nhắn',
          time: lastMsg ? formatTimeShort(lastMsg.created_at) : '',
          unread: unreadCount || 0,
          online: Math.random() > 0.5, // Placeholder - would need presence system
        });
      }

      // Sort by most recent message or unread
      contactsList.sort((a, b) => {
        if (a.unread !== b.unread) return b.unread - a.unread;
        return 0;
      });

      setContacts(contactsList);
    } catch (err) {
      console.error('Load data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeShort = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Hôm qua';
    } else if (diffDays < 7) {
      return `${diffDays} ngày`;
    }
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  const handleSelectContact = async (contact) => {
    setSelectedContact(contact);
    setLoadingMessages(true);

    try {
      // Load messages for this conversation
      const { data: messagesData } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          is_read,
          sender_id
        `)
        .eq('student_id', contact.studentId)
        .or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`)
        .order('created_at', { ascending: true });

      setMessages(messagesData?.map(m => ({
        id: m.id,
        from: m.sender_id === profile.id ? 'teacher' : 'parent',
        text: m.content,
        time: new Date(m.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        read: m.is_read,
      })) || []);

      // Mark unread messages as read
      const unreadIds = messagesData
        ?.filter(m => m.sender_id !== profile.id && !m.is_read)
        .map(m => m.id) || [];

      if (unreadIds.length > 0) {
        await supabase
          .from('messages')
          .update({ is_read: true, read_at: new Date().toISOString() })
          .in('id', unreadIds);

        // Update contacts unread count
        setContacts(prev => prev.map(c =>
          c.id === contact.id ? { ...c, unread: 0 } : c
        ));
      }
    } catch (err) {
      console.error('Load messages error:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedContact || sending) return;

    setSending(true);
    const messageText = newMessage.trim();
    setNewMessage('');

    try {
      // Insert message to database
      const { data: newMsgData, error } = await supabase
        .from('messages')
        .insert({
          sender_id: profile.id,
          receiver_id: selectedContact.parentId || null,
          student_id: selectedContact.studentId,
          content: messageText,
          message_type: 'direct',
        })
        .select()
        .single();

      if (error) throw error;

      // Add to local messages
      setMessages(prev => [...prev, {
        id: newMsgData.id,
        from: 'teacher',
        text: messageText,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        read: false,
      }]);

      // Update last message in contacts
      setContacts(prev => prev.map(c =>
        c.id === selectedContact.id
          ? { ...c, lastMessage: messageText.substring(0, 50), time: 'Vừa xong' }
          : c
      ));
    } catch (err) {
      console.error('Send message error:', err);
      setNewMessage(messageText); // Restore message on error
      alert('Không thể gửi tin nhắn. Vui lòng thử lại.');
    } finally {
      setSending(false);
    }
  };

  const handleBroadcast = async () => {
    if (!broadcastMessage.trim() || !broadcastClass || sendingBroadcast) return;

    setSendingBroadcast(true);

    try {
      // Get students in selected class
      const { data: studentsData } = await supabase
        .from('class_students')
        .select('student_id')
        .eq('class_id', broadcastClass);

      const studentIds = studentsData?.map(s => s.student_id) || [];

      if (studentIds.length === 0) {
        alert('Không có học sinh trong lớp này');
        return;
      }

      // Create broadcast messages for each student
      const messages = studentIds.map(studentId => ({
        sender_id: profile.id,
        student_id: studentId,
        class_id: broadcastClass,
        content: broadcastMessage.trim(),
        subject: broadcastSubject.trim() || 'Thông báo từ giáo viên',
        message_type: 'broadcast',
      }));

      const { error } = await supabase
        .from('messages')
        .insert(messages);

      if (error) throw error;

      const className = classes.find(c => c.id === broadcastClass)?.name;
      alert(`Đã gửi thông báo đến ${studentIds.length} phụ huynh lớp ${className}`);

      setBroadcastMessage('');
      setBroadcastSubject('');
      setBroadcastClass('');
      setShowBroadcastModal(false);

      // Refresh contacts
      loadData();
    } catch (err) {
      console.error('Broadcast error:', err);
      alert('Không thể gửi thông báo. Vui lòng thử lại.');
    } finally {
      setSendingBroadcast(false);
    }
  };

  const filteredContacts = contacts.filter(c =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.student?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.class?.toLowerCase().includes(searchQuery.toLowerCase())
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
              <h3 className="font-semibold text-gray-900">Tin nhắn</h3>
              <button
                onClick={() => setShowBroadcastModal(true)}
                className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200"
                title="Gửi thông báo"
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
                placeholder="Tìm kiếm..."
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
                <p>Không có liên hệ nào</p>
                <p className="text-sm mt-1">Học sinh cần được thêm vào lớp trước</p>
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
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{selectedContact.name}</p>
                  <p className="text-xs text-gray-500">
                    {selectedContact.class} - {selectedContact.student}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                  </div>
                ) : messages.length > 0 ? (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.from === 'teacher' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm ${
                          msg.from === 'teacher'
                            ? 'bg-emerald-600 text-white rounded-br-sm'
                            : 'bg-white text-gray-900 rounded-bl-sm'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
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
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p>Chưa có tin nhắn</p>
                      <p className="text-sm">Bắt đầu cuộc trò chuyện</p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-100 bg-white">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    placeholder="Nhập tin nhắn..."
                    disabled={sending}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sending}
                    className="p-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-50">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Chọn một cuộc trò chuyện</p>
                <p className="text-sm mt-1">Hoặc gửi thông báo cho cả lớp</p>
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
                Gửi thông báo cho lớp
              </h3>
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chọn lớp <span className="text-red-500">*</span>
                </label>
                <select
                  value={broadcastClass}
                  onChange={(e) => setBroadcastClass(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- Chọn lớp --</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề (tùy chọn)
                </label>
                <input
                  type="text"
                  value={broadcastSubject}
                  onChange={(e) => setBroadcastSubject(e.target.value)}
                  placeholder="VD: Thông báo lịch học..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nội dung thông báo <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="Nhập nội dung thông báo..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  Thông báo sẽ được gửi đến tất cả phụ huynh có học sinh trong lớp được chọn.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowBroadcastModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleBroadcast}
                  disabled={!broadcastMessage.trim() || !broadcastClass || sendingBroadcast}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {sendingBroadcast ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Gửi thông báo
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
