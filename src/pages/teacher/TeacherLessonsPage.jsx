// src/pages/teacher/TeacherLessonsPage.jsx
// Quản lý bài giảng cho Giáo viên
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  FileText, Plus, Edit2, Trash2, Search, Loader2, X,
  BookOpen, Video, Eye, Lock, Send, Save, Globe,
  Languages, HelpCircle, ChevronDown, ChevronUp,
  Image, Volume2, CheckCircle, XCircle, Filter
} from 'lucide-react';

// Màu cho subjects - dùng full class name để Tailwind không purge
const SUBJECT_COLORS = {
  'Tiếng Anh': { bg: 'bg-blue-100', text: 'text-blue-600', badge: 'bg-blue-100 text-blue-700' },
  'English': { bg: 'bg-blue-100', text: 'text-blue-600', badge: 'bg-blue-100 text-blue-700' },
  'Toán': { bg: 'bg-green-100', text: 'text-green-600', badge: 'bg-green-100 text-green-700' },
  'Math': { bg: 'bg-green-100', text: 'text-green-600', badge: 'bg-green-100 text-green-700' },
  'Khoa học': { bg: 'bg-purple-100', text: 'text-purple-600', badge: 'bg-purple-100 text-purple-700' },
  'Science': { bg: 'bg-purple-100', text: 'text-purple-600', badge: 'bg-purple-100 text-purple-700' },
  'Tiếng Việt': { bg: 'bg-orange-100', text: 'text-orange-600', badge: 'bg-orange-100 text-orange-700' },
  'Vietnamese': { bg: 'bg-orange-100', text: 'text-orange-600', badge: 'bg-orange-100 text-orange-700' },
};

const DEFAULT_COLORS = { bg: 'bg-gray-100', text: 'text-gray-600', badge: 'bg-gray-100 text-gray-700' };

const QUESTION_TYPES = [
  { id: 'multiple_choice', name: 'Trắc nghiệm', icon: CheckCircle },
  { id: 'fill_blank', name: 'Điền từ', icon: Edit2 },
  { id: 'listening', name: 'Nghe', icon: Volume2 },
];

export default function TeacherLessonsPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('system');
  const [systemLessons, setSystemLessons] = useState([]);
  const [myLessons, setMyLessons] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subject_id: '', // UUID từ subjects table
    description: '',
    video_url: '',
    status: 'draft',
  });

  // Vocabulary list
  const [vocabularies, setVocabularies] = useState([]);
  const [showVocabForm, setShowVocabForm] = useState(false);
  const [vocabForm, setVocabForm] = useState({ word: '', meaning: '', image_url: '', audio_url: '' });

  // Questions list
  const [questions, setQuestions] = useState([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [questionForm, setQuestionForm] = useState({
    type: 'multiple_choice',
    question: '',
    options: ['', '', '', ''],
    correct_answer: 0,
    audio_url: '',
  });

  // Expanded sections
  const [expandedSections, setExpandedSections] = useState({
    vocabulary: true,
    questions: true,
    media: false,
  });

  useEffect(() => {
    loadLessons();
  }, [profile?.id, profile?.school_id]);

  const loadLessons = async () => {
    try {
      setLoading(true);

      // Load subjects từ database
      const { data: subjectsData, error: subjectsError } = await supabase
        .from('subjects')
        .select('id, name, icon')
        .eq('is_active', true)
        .order('sort_order');

      if (subjectsError) {
        console.error('Load subjects error:', subjectsError);
      }

      setSubjects(subjectsData || []);

      // Load system lessons (lesson_type = 'system' hoặc teacher_id = null)
      const { data: sysData, error: sysError } = await supabase
        .from('lessons')
        .select('*, subject:subjects(id, name, icon)')
        .or('lesson_type.eq.system,teacher_id.is.null')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (sysError) {
        console.error('Load system lessons error:', sysError);
      }

      // Filter ra bài nháp ở client side (vì status có thể null)
      const filteredSysData = (sysData || []).filter(l => l.status !== 'draft');
      setSystemLessons(filteredSysData);

      // Load my lessons (GV tự tạo)
      if (profile?.id) {
        const { data: myData, error: myError } = await supabase
          .from('lessons')
          .select('*, subject:subjects(id, name, icon)')
          .eq('teacher_id', profile.id)
          .order('created_at', { ascending: false });

        if (myError) {
          console.error('Load my lessons error:', myError);
        }

        setMyLessons(myData || []);
      }
    } catch (err) {
      console.error('Load lessons error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = async (lesson = null) => {
    if (lesson) {
      setEditingLesson(lesson);
      setFormData({
        title: lesson.title || '',
        subject_id: lesson.subject_id || '',
        description: lesson.description || '',
        video_url: lesson.video_url || '',
        status: lesson.status || 'draft',
      });

      // Load vocabulary
      const { data: vocabData } = await supabase
        .from('vocabulary')
        .select('*')
        .eq('lesson_id', lesson.id)
        .order('sort_order');
      setVocabularies(vocabData || []);

      // Load questions - map content to question for UI
      const { data: questData } = await supabase
        .from('questions')
        .select('*')
        .eq('lesson_id', lesson.id)
        .order('sort_order');
      // Map content -> question cho UI
      const mappedQuestions = (questData || []).map(q => ({
        ...q,
        question: q.content, // Map content to question for form
      }));
      setQuestions(mappedQuestions);
    } else {
      setEditingLesson(null);
      // Lấy subject đầu tiên làm mặc định
      const defaultSubjectId = subjects.length > 0 ? subjects[0].id : '';
      setFormData({
        title: '',
        subject_id: defaultSubjectId,
        description: '',
        video_url: '',
        status: 'draft',
      });
      setVocabularies([]);
      setQuestions([]);
    }
    setShowModal(true);
  };

  const handleAddVocab = () => {
    if (!vocabForm.word.trim() || !vocabForm.meaning.trim()) return;

    setVocabularies([...vocabularies, {
      id: 'temp_' + Date.now(),
      ...vocabForm,
      sort_order: vocabularies.length,
    }]);
    setVocabForm({ word: '', meaning: '', image_url: '', audio_url: '' });
    setShowVocabForm(false);
  };

  const handleRemoveVocab = (index) => {
    setVocabularies(vocabularies.filter((_, i) => i !== index));
  };

  const handleAddQuestion = () => {
    if (!questionForm.question.trim()) return;

    setQuestions([...questions, {
      id: 'temp_' + Date.now(),
      ...questionForm,
      sort_order: questions.length,
    }]);
    setQuestionForm({
      type: 'multiple_choice',
      question: '',
      options: ['', '', '', ''],
      correct_answer: 0,
      audio_url: '',
    });
    setShowQuestionForm(false);
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSave = async (saveStatus = formData.status) => {
    if (!formData.title.trim()) {
      alert('Vui lòng nhập tiêu đề bài giảng');
      return;
    }

    setSaving(true);
    try {
      const lessonData = {
        title: formData.title.trim(),
        subject_id: formData.subject_id || null,
        description: formData.description.trim(),
        video_url: formData.video_url.trim() || null,
        status: saveStatus,
        lesson_type: 'teacher',
        teacher_id: profile.id,
        school_id: profile.school_id,
      };

      let lessonId = editingLesson?.id;

      if (editingLesson) {
        // Update
        const { error } = await supabase
          .from('lessons')
          .update({ ...lessonData, updated_at: new Date().toISOString() })
          .eq('id', editingLesson.id);

        if (error) throw error;
      } else {
        // Insert
        const { data, error } = await supabase
          .from('lessons')
          .insert(lessonData)
          .select()
          .single();

        if (error) throw error;
        lessonId = data.id;
      }

      // Save vocabularies
      if (lessonId) {
        // Delete old vocab and insert new
        await supabase.from('vocabulary').delete().eq('lesson_id', lessonId);

        if (vocabularies.length > 0) {
          const vocabToInsert = vocabularies.map((v, i) => ({
            lesson_id: lessonId,
            word: v.word,
            meaning: v.meaning,
            image_url: v.image_url || null,
            audio_url: v.audio_url || null,
            sort_order: i,
          }));
          await supabase.from('vocabulary').insert(vocabToInsert);
        }

        // Delete old questions and insert new
        await supabase.from('questions').delete().eq('lesson_id', lessonId);

        if (questions.length > 0) {
          const questToInsert = questions.map((q, i) => ({
            lesson_id: lessonId,
            type: q.type,
            content: q.question, // Map question -> content cho DB
            options: q.options,
            correct_answer: q.correct_answer,
            audio_url: q.audio_url || null,
            sort_order: i,
          }));
          await supabase.from('questions').insert(questToInsert);
        }
      }

      alert(saveStatus === 'published' ? 'Đã xuất bản bài giảng!' : 'Đã lưu bài giảng!');
      setShowModal(false);
      loadLessons();
    } catch (err) {
      console.error('Save lesson error:', err);
      alert('Có lỗi xảy ra: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (lesson) => {
    if (!confirm(`Bạn có chắc muốn xóa bài giảng "${lesson.title}"?`)) return;

    try {
      const { error } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lesson.id);

      if (error) throw error;
      loadLessons();
    } catch (err) {
      console.error('Delete lesson error:', err);
      alert('Có lỗi xảy ra: ' + err.message);
    }
  };

  const handleAssign = (lesson) => {
    navigate('/teacher/assignments', { state: { selectedLesson: lesson } });
  };

  const getSubjectInfo = (subjectId) => {
    const subject = subjects.find(s => s.id === subjectId);
    if (subject) {
      const colors = SUBJECT_COLORS[subject.name] || DEFAULT_COLORS;
      return { ...subject, colors };
    }
    return { name: 'Chưa chọn', colors: DEFAULT_COLORS };
  };

  // Filter lessons
  const filteredSystem = systemLessons.filter(l => {
    const matchSearch = !searchQuery ||
      l.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSubject = !filterSubject || l.subject_id === filterSubject;
    return matchSearch && matchSubject;
  });

  const filteredMy = myLessons.filter(l => {
    const matchSearch = !searchQuery ||
      l.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSubject = !filterSubject || l.subject_id === filterSubject;
    return matchSearch && matchSubject;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý bài giảng</h1>
          <p className="text-gray-600">Tạo và quản lý bài giảng cho học sinh</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
        >
          <Plus className="w-5 h-5" />
          Tạo bài giảng mới
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bài giảng..."
              className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Tất cả môn học</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('system')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'system'
                ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Globe className="w-4 h-4" />
              Bài giảng hệ thống ({filteredSystem.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'my'
                ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" />
              Bài giảng của tôi ({filteredMy.length})
            </div>
          </button>
        </div>

        <div className="p-6">
          {/* System Lessons */}
          {activeTab === 'system' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSystem.map((lesson) => {
                const subject = getSubjectInfo(lesson.subject_id);
                return (
                  <div key={lesson.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 ${subject.colors.bg} rounded-lg flex items-center justify-center`}>
                        <BookOpen className={`w-5 h-5 ${subject.colors.text}`} />
                      </div>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Hệ thống
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">{lesson.title}</h4>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{lesson.description}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      <span className={`px-2 py-1 ${subject.colors.badge} rounded`}>
                        {subject.name}
                      </span>
                      {lesson.vocab_count > 0 && (
                        <span className="flex items-center gap-1">
                          <Languages className="w-3 h-3" />
                          {lesson.vocab_count} từ vựng
                        </span>
                      )}
                      {lesson.question_count > 0 && (
                        <span className="flex items-center gap-1">
                          <HelpCircle className="w-3 h-3" />
                          {lesson.question_count} câu
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm flex items-center justify-center gap-1">
                        <Eye className="w-4 h-4" />
                        Xem
                      </button>
                      <button
                        onClick={() => handleAssign(lesson)}
                        className="flex-1 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm flex items-center justify-center gap-1"
                      >
                        <Send className="w-4 h-4" />
                        Giao bài
                      </button>
                    </div>
                  </div>
                );
              })}
              {filteredSystem.length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-12">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg">Không tìm thấy bài giảng nào</p>
                </div>
              )}
            </div>
          )}

          {/* My Lessons */}
          {activeTab === 'my' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMy.map((lesson) => {
                const subject = getSubjectInfo(lesson.subject_id);
                return (
                  <div key={lesson.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 ${subject.colors.bg} rounded-lg flex items-center justify-center`}>
                        <FileText className={`w-5 h-5 ${subject.colors.text}`} />
                      </div>
                      <div className="flex items-center gap-2">
                        {lesson.status === 'draft' ? (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                            Nháp
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                            Đã xuất bản
                          </span>
                        )}
                      </div>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">{lesson.title}</h4>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{lesson.description || 'Chưa có mô tả'}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                      <span className={`px-2 py-1 ${subject.colors.badge} rounded`}>
                        {subject.name}
                      </span>
                      {lesson.vocab_count > 0 && (
                        <span className="flex items-center gap-1">
                          <Languages className="w-3 h-3" />
                          {lesson.vocab_count} từ
                        </span>
                      )}
                      {lesson.question_count > 0 && (
                        <span className="flex items-center gap-1">
                          <HelpCircle className="w-3 h-3" />
                          {lesson.question_count} câu
                        </span>
                      )}
                      {lesson.video_url && (
                        <span className="flex items-center gap-1">
                          <Video className="w-3 h-3" />
                          Video
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenModal(lesson)}
                        className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm flex items-center justify-center gap-1"
                      >
                        <Edit2 className="w-4 h-4" />
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(lesson)}
                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      {lesson.status === 'published' && (
                        <button
                          onClick={() => handleAssign(lesson)}
                          className="flex-1 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm flex items-center justify-center gap-1"
                        >
                          <Send className="w-4 h-4" />
                          Giao
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              {filteredMy.length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-12">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg mb-4">Bạn chưa có bài giảng nào</p>
                  <button
                    onClick={() => handleOpenModal()}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
                  >
                    Tạo bài giảng đầu tiên
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <h3 className="text-lg font-bold">
                {editingLesson ? 'Sửa bài giảng' : 'Tạo bài giảng mới'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-200 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiêu đề bài giảng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="VD: Animals - Động vật"
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Môn học
                  </label>
                  <select
                    value={formData.subject_id}
                    onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">-- Chọn môn học --</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link video YouTube
                  </label>
                  <input
                    type="url"
                    value={formData.video_url}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mô tả ngắn gọn về nội dung bài giảng..."
                    rows={2}
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Vocabulary Section */}
              <div className="border rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedSections({ ...expandedSections, vocabulary: !expandedSections.vocabulary })}
                  className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100"
                >
                  <div className="flex items-center gap-2">
                    <Languages className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Từ vựng ({vocabularies.length})</span>
                  </div>
                  {expandedSections.vocabulary ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>

                {expandedSections.vocabulary && (
                  <div className="p-4 space-y-3">
                    {vocabularies.map((vocab, index) => (
                      <div key={vocab.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <span className="font-medium">{vocab.word}</span>
                          <span className="text-gray-500 mx-2">-</span>
                          <span className="text-gray-600">{vocab.meaning}</span>
                        </div>
                        {vocab.image_url && <Image className="w-4 h-4 text-green-500" />}
                        {vocab.audio_url && <Volume2 className="w-4 h-4 text-blue-500" />}
                        <button
                          onClick={() => handleRemoveVocab(index)}
                          className="p-1 hover:bg-red-100 rounded"
                        >
                          <XCircle className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    ))}

                    {showVocabForm ? (
                      <div className="p-4 border-2 border-dashed border-blue-300 rounded-lg space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={vocabForm.word}
                            onChange={(e) => setVocabForm({ ...vocabForm, word: e.target.value })}
                            placeholder="Từ vựng (VD: Cat)"
                            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            value={vocabForm.meaning}
                            onChange={(e) => setVocabForm({ ...vocabForm, meaning: e.target.value })}
                            placeholder="Nghĩa (VD: Con mèo)"
                            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="url"
                            value={vocabForm.image_url}
                            onChange={(e) => setVocabForm({ ...vocabForm, image_url: e.target.value })}
                            placeholder="Link hình ảnh (tùy chọn)"
                            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="url"
                            value={vocabForm.audio_url}
                            onChange={(e) => setVocabForm({ ...vocabForm, audio_url: e.target.value })}
                            placeholder="Link audio (tùy chọn)"
                            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowVocabForm(false)}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                          >
                            Hủy
                          </button>
                          <button
                            onClick={handleAddVocab}
                            disabled={!vocabForm.word.trim() || !vocabForm.meaning.trim()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                          >
                            Thêm từ
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowVocabForm(true)}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-600 flex items-center justify-center gap-2"
                      >
                        <Plus className="w-5 h-5" />
                        Thêm từ vựng
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Questions Section */}
              <div className="border rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedSections({ ...expandedSections, questions: !expandedSections.questions })}
                  className="w-full flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100"
                >
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-900">Câu hỏi Quiz ({questions.length})</span>
                  </div>
                  {expandedSections.questions ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>

                {expandedSections.questions && (
                  <div className="p-4 space-y-3">
                    {questions.map((q, index) => (
                      <div key={q.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded mr-2">
                              {QUESTION_TYPES.find(t => t.id === q.type)?.name || q.type}
                            </span>
                            <p className="mt-2 font-medium">{q.question}</p>
                            {q.type === 'multiple_choice' && q.options && (
                              <div className="mt-2 grid grid-cols-2 gap-2">
                                {q.options.map((opt, i) => (
                                  <div
                                    key={i}
                                    className={`text-sm px-2 py-1 rounded ${
                                      i === q.correct_answer ? 'bg-green-100 text-green-700' : 'bg-white'
                                    }`}
                                  >
                                    {opt || `Đáp án ${i + 1}`}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveQuestion(index)}
                            className="p-1 hover:bg-red-100 rounded"
                          >
                            <XCircle className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {showQuestionForm ? (
                      <div className="p-4 border-2 border-dashed border-purple-300 rounded-lg space-y-3">
                        <div className="flex gap-2">
                          {QUESTION_TYPES.map(type => (
                            <button
                              key={type.id}
                              onClick={() => setQuestionForm({ ...questionForm, type: type.id })}
                              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm ${
                                questionForm.type === type.id
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              <type.icon className="w-4 h-4" />
                              {type.name}
                            </button>
                          ))}
                        </div>
                        <input
                          type="text"
                          value={questionForm.question}
                          onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                          placeholder="Nhập câu hỏi..."
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                        {questionForm.type === 'multiple_choice' && (
                          <div className="grid grid-cols-2 gap-2">
                            {questionForm.options.map((opt, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name="correct"
                                  checked={questionForm.correct_answer === i}
                                  onChange={() => setQuestionForm({ ...questionForm, correct_answer: i })}
                                  className="text-purple-600"
                                />
                                <input
                                  type="text"
                                  value={opt}
                                  onChange={(e) => {
                                    const newOpts = [...questionForm.options];
                                    newOpts[i] = e.target.value;
                                    setQuestionForm({ ...questionForm, options: newOpts });
                                  }}
                                  placeholder={`Đáp án ${i + 1}`}
                                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                        {questionForm.type === 'listening' && (
                          <input
                            type="url"
                            value={questionForm.audio_url}
                            onChange={(e) => setQuestionForm({ ...questionForm, audio_url: e.target.value })}
                            placeholder="Link audio cho câu hỏi nghe"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                          />
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowQuestionForm(false)}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                          >
                            Hủy
                          </button>
                          <button
                            onClick={handleAddQuestion}
                            disabled={!questionForm.question.trim()}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                          >
                            Thêm câu hỏi
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowQuestionForm(true)}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-purple-400 hover:text-purple-600 flex items-center justify-center gap-2"
                      >
                        <Plus className="w-5 h-5" />
                        Thêm câu hỏi
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-4 border-t bg-gray-50">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 border rounded-xl hover:bg-gray-100"
              >
                Hủy
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => handleSave('draft')}
                  disabled={saving || !formData.title.trim()}
                  className="flex items-center gap-2 px-6 py-2 border border-yellow-500 text-yellow-700 rounded-xl hover:bg-yellow-50 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Đang lưu...' : 'Lưu nháp'}
                </button>
                <button
                  onClick={() => handleSave('published')}
                  disabled={saving || !formData.title.trim()}
                  className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50"
                >
                  <Globe className="w-4 h-4" />
                  {saving ? 'Đang lưu...' : 'Xuất bản'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
