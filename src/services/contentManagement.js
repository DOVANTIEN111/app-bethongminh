// src/services/contentManagement.js
// Service quản lý nội dung: Môn học, Bài học, Từ vựng, Câu hỏi, Media

import { supabase } from '../lib/supabase';

// ========================================
// SUBJECTS (Môn học)
// ========================================

export async function getSubjects(includeInactive = false) {
  let query = supabase
    .from('subjects')
    .select('*')
    .order('sort_order', { ascending: true });

  if (!includeInactive) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getSubjectById(id) {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createSubject(subject) {
  const { data, error } = await supabase
    .from('subjects')
    .insert([subject])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateSubject(id, updates) {
  const { data, error } = await supabase
    .from('subjects')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteSubject(id) {
  const { error } = await supabase
    .from('subjects')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

// ========================================
// LESSONS (Bài học)
// ========================================

export async function getLessons(filters = {}) {
  let query = supabase
    .from('lessons')
    .select(`
      *,
      subject:subjects(id, name, icon),
      vocabulary_count:vocabulary(count),
      question_count:questions(count)
    `)
    .order('sort_order', { ascending: true });

  if (filters.subjectId) {
    query = query.eq('subject_id', filters.subjectId);
  }

  if (!filters.includeInactive) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getLessonById(id) {
  const { data, error } = await supabase
    .from('lessons')
    .select(`
      *,
      subject:subjects(id, name, icon, color)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createLesson(lesson) {
  const { data, error } = await supabase
    .from('lessons')
    .insert([lesson])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateLesson(id, updates) {
  const { data, error } = await supabase
    .from('lessons')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteLesson(id) {
  const { error } = await supabase
    .from('lessons')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

// ========================================
// VOCABULARY (Từ vựng)
// ========================================

export async function getVocabulary(filters = {}) {
  let query = supabase
    .from('vocabulary')
    .select(`
      *,
      lesson:lessons(id, title, subject:subjects(id, name, icon))
    `)
    .order('sort_order', { ascending: true });

  if (filters.lessonId) {
    query = query.eq('lesson_id', filters.lessonId);
  }

  if (!filters.includeInactive) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getVocabularyById(id) {
  const { data, error } = await supabase
    .from('vocabulary')
    .select(`
      *,
      lesson:lessons(id, title, subject:subjects(id, name))
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createVocabulary(vocab) {
  const { data, error } = await supabase
    .from('vocabulary')
    .insert([vocab])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createVocabularyBulk(vocabList) {
  const { data, error } = await supabase
    .from('vocabulary')
    .insert(vocabList)
    .select();

  if (error) throw error;
  return data;
}

export async function updateVocabulary(id, updates) {
  const { data, error } = await supabase
    .from('vocabulary')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteVocabulary(id) {
  const { error } = await supabase
    .from('vocabulary')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

// ========================================
// QUESTIONS (Câu hỏi Quiz)
// ========================================

export async function getQuestions(filters = {}) {
  let query = supabase
    .from('questions')
    .select(`
      *,
      lesson:lessons(id, title, subject:subjects(id, name, icon))
    `)
    .order('sort_order', { ascending: true });

  if (filters.lessonId) {
    query = query.eq('lesson_id', filters.lessonId);
  }

  if (filters.type) {
    query = query.eq('type', filters.type);
  }

  if (!filters.includeInactive) {
    query = query.eq('is_active', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getQuestionById(id) {
  const { data, error } = await supabase
    .from('questions')
    .select(`
      *,
      lesson:lessons(id, title, subject:subjects(id, name))
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function createQuestion(question) {
  const { data, error } = await supabase
    .from('questions')
    .insert([question])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createQuestionsBulk(questions) {
  const { data, error } = await supabase
    .from('questions')
    .insert(questions)
    .select();

  if (error) throw error;
  return data;
}

export async function updateQuestion(id, updates) {
  const { data, error } = await supabase
    .from('questions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteQuestion(id) {
  const { error } = await supabase
    .from('questions')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

// ========================================
// MEDIA (Thư viện Media)
// ========================================

export async function getMedia(filters = {}) {
  let query = supabase
    .from('media')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters.type) {
    query = query.eq('type', filters.type);
  }

  if (filters.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function uploadMedia(file, type, userId) {
  // Upload to Supabase Storage
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
  const filePath = `${type}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('media')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('media')
    .getPublicUrl(filePath);

  // Save to database
  const { data, error } = await supabase
    .from('media')
    .insert([{
      name: file.name,
      type: type,
      url: publicUrl,
      size: file.size,
      mime_type: file.type,
      uploaded_by: userId,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteMedia(id, url) {
  // Extract file path from URL
  const urlParts = url.split('/');
  const filePath = urlParts.slice(-2).join('/');

  // Delete from storage
  const { error: storageError } = await supabase.storage
    .from('media')
    .remove([filePath]);

  if (storageError) console.error('Storage delete error:', storageError);

  // Delete from database
  const { error } = await supabase
    .from('media')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

// ========================================
// STATISTICS (Thống kê)
// ========================================

export async function getContentStats() {
  try {
    const [subjects, lessons, vocabulary, questions] = await Promise.all([
      supabase.from('subjects').select('id', { count: 'exact' }),
      supabase.from('lessons').select('id', { count: 'exact' }),
      supabase.from('vocabulary').select('id', { count: 'exact' }),
      supabase.from('questions').select('id', { count: 'exact' }),
    ]);

    return {
      subjects: subjects.count || 0,
      lessons: lessons.count || 0,
      vocabulary: vocabulary.count || 0,
      questions: questions.count || 0,
    };
  } catch (error) {
    console.error('Error getting content stats:', error);
    return { subjects: 0, lessons: 0, vocabulary: 0, questions: 0 };
  }
}

// ========================================
// QUESTION TYPES
// ========================================

export const QUESTION_TYPES = [
  { id: 'multiple_choice', name: 'Trắc nghiệm', icon: '✅' },
  { id: 'fill_blank', name: 'Điền từ', icon: '✍️' },
  { id: 'listening', name: 'Nghe', icon: '👂' },
  { id: 'matching', name: 'Nối từ', icon: '🔗' },
  { id: 'speaking', name: 'Phát âm', icon: '🎤' },
];

// ========================================
// DIFFICULTY LEVELS
// ========================================

export const DIFFICULTY_LEVELS = [
  { id: 1, name: 'Dễ', color: 'green' },
  { id: 2, name: 'Trung bình', color: 'yellow' },
  { id: 3, name: 'Khó', color: 'red' },
];
