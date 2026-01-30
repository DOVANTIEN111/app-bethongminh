// src/pages/learn/LearnAssignmentsPage.jsx
// Student Assignments Page - With Real Database and Do Assignment
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { getMathLesson } from '../../data/mathLessons';
import {
  ClipboardList, Clock, CheckCircle, AlertCircle, Play,
  Star, Calendar, Trophy, ChevronRight, X, Loader2, School,
  Heart, ArrowLeft, RotateCcw
} from 'lucide-react';

export default function LearnAssignmentsPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noClass, setNoClass] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);

  // Quiz state
  const [doingQuiz, setDoingQuiz] = useState(false);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [lives, setLives] = useState(3);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  useEffect(() => {
    loadAssignments();
  }, [profile?.id, profile?.class_id]);

  const loadAssignments = async () => {
    setLoading(true);
    try {
      if (!profile?.class_id) {
        // Check if student is in any class via class_students
        const { data: classStudent } = await supabase
          .from('class_students')
          .select('class_id')
          .eq('student_id', profile?.id)
          .limit(1)
          .single();

        if (!classStudent) {
          setNoClass(true);
          setLoading(false);
          return;
        }
      }

      const classId = profile?.class_id;

      // Get class from class_students if not in profile
      let actualClassId = classId;
      if (!actualClassId) {
        const { data: cs } = await supabase
          .from('class_students')
          .select('class_id')
          .eq('student_id', profile?.id)
          .limit(1)
          .single();
        actualClassId = cs?.class_id;
      }

      if (!actualClassId) {
        setNoClass(true);
        setLoading(false);
        return;
      }

      // Get assignments for the class
      const { data: assignmentsData, error } = await supabase
        .from('assignments')
        .select(`
          id, title, due_date, note, status, lesson_id,
          teacher:teacher_id(full_name),
          lesson:lesson_id(title, subject_id)
        `)
        .eq('class_id', actualClassId)
        .order('due_date', { ascending: true });

      if (error) throw error;

      // Get student's submissions
      const { data: submissions } = await supabase
        .from('student_assignments')
        .select('*')
        .eq('student_id', profile?.id);

      const submissionMap = {};
      (submissions || []).forEach(s => {
        submissionMap[s.assignment_id] = s;
      });

      // Merge assignment with submission status
      const assignmentsWithStatus = (assignmentsData || []).map(a => ({
        ...a,
        submission: submissionMap[a.id],
        studentStatus: submissionMap[a.id]?.status || 'not_started',
      }));

      setAssignments(assignmentsWithStatus);
      setNoClass(false);
    } catch (err) {
      console.error('Error loading assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  const pendingAssignments = assignments.filter(a =>
    a.status === 'active' && (!a.submission || a.submission.status === 'not_started' || a.submission.status === 'in_progress')
  );
  const completedAssignments = assignments.filter(a =>
    a.submission && (a.submission.status === 'submitted' || a.submission.status === 'graded')
  );

  const getDaysLeft = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDeadline = (deadline) => {
    const daysLeft = getDaysLeft(deadline);
    if (daysLeft < 0) return { text: 'Qua han', color: 'text-red-500', bg: 'bg-red-100' };
    if (daysLeft === 0) return { text: 'Hom nay', color: 'text-orange-500', bg: 'bg-orange-100' };
    if (daysLeft === 1) return { text: 'Ngay mai', color: 'text-yellow-500', bg: 'bg-yellow-100' };
    return { text: `Con ${daysLeft} ngay`, color: 'text-green-500', bg: 'bg-green-100' };
  };

  const handleStartAssignment = async (assignment) => {
    // Get lesson data
    let questions = [];

    // Check if it's a math lesson
    if (assignment.lesson_id && assignment.lesson_id.startsWith('math-')) {
      const mathLesson = getMathLesson(assignment.lesson_id);
      if (mathLesson?.questions) {
        questions = mathLesson.questions;
      }
    }

    // If no questions from math, create simple questions
    if (questions.length === 0) {
      questions = [
        {
          type: 'count',
          question: 'Co may qua tao?',
          image: '🍎',
          imageCount: 3,
          options: ['2', '3', '4', '5'],
          answer: '3',
        },
        {
          type: 'count',
          question: 'Co may con meo?',
          image: '🐱',
          imageCount: 2,
          options: ['1', '2', '3', '4'],
          answer: '2',
        },
        {
          type: 'select',
          question: 'Chon hinh co 4 do vat',
          options: [
            { image: '🍎', count: 2 },
            { image: '🍎', count: 3 },
            { image: '🍎', count: 4 },
            { image: '🍎', count: 5 },
          ],
          answer: 2,
        },
      ];
    }

    // Create or update student_assignment record
    const { data: existing } = await supabase
      .from('student_assignments')
      .select('id')
      .eq('assignment_id', assignment.id)
      .eq('student_id', profile.id)
      .single();

    if (!existing) {
      await supabase
        .from('student_assignments')
        .insert({
          assignment_id: assignment.id,
          student_id: profile.id,
          status: 'in_progress',
          started_at: new Date().toISOString(),
        });
    } else {
      await supabase
        .from('student_assignments')
        .update({
          status: 'in_progress',
          started_at: new Date().toISOString(),
        })
        .eq('id', existing.id);
    }

    setCurrentAssignment(assignment);
    setQuizQuestions(questions);
    setCurrentQ(0);
    setAnswers([]);
    setLives(3);
    setShowAnswer(false);
    setQuizFinished(false);
    setDoingQuiz(true);
  };

  const handleAnswer = (answer, index) => {
    if (showAnswer) return;

    const question = quizQuestions[currentQ];
    let correct = false;

    if (question.type === 'select') {
      correct = index === question.answer;
    } else {
      correct = answer === question.answer;
    }

    const newAnswers = [...answers, { answer, index, correct }];
    setAnswers(newAnswers);
    setShowAnswer(true);

    if (!correct) {
      setLives(l => l - 1);
    }

    // Move to next question after delay
    setTimeout(() => {
      if (currentQ < quizQuestions.length - 1 && lives > (correct ? 0 : 1)) {
        setCurrentQ(c => c + 1);
        setShowAnswer(false);
      } else {
        // Finish quiz
        const correctCount = newAnswers.filter(a => a.correct).length;
        const score = Math.round((correctCount / quizQuestions.length) * 10);
        setFinalScore(score);
        setQuizFinished(true);

        // Save result
        submitAssignment(score, newAnswers);
      }
    }, 1500);
  };

  const submitAssignment = async (score, answerData) => {
    try {
      await supabase
        .from('student_assignments')
        .update({
          status: 'submitted',
          score: score,
          answers: answerData,
          submitted_at: new Date().toISOString(),
        })
        .eq('assignment_id', currentAssignment.id)
        .eq('student_id', profile.id);

      // Reload assignments
      loadAssignments();
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  const handleViewResult = (assignment) => {
    setSelectedAssignment(assignment);
    setShowResultModal(true);
  };

  const resetQuiz = () => {
    setDoingQuiz(false);
    setCurrentAssignment(null);
    setQuizQuestions([]);
    setCurrentQ(0);
    setAnswers([]);
    setLives(3);
    setShowAnswer(false);
    setQuizFinished(false);
  };

  // Render quiz image
  const renderImage = (emoji, count) => {
    return (
      <div className="flex flex-wrap justify-center gap-2 py-4">
        {Array(count).fill(null).map((_, i) => (
          <span key={i} className="text-5xl sm:text-6xl drop-shadow-lg">{emoji}</span>
        ))}
      </div>
    );
  };

  // Render quiz select options (images)
  const renderSelectOptions = (question) => {
    return (
      <div className="grid grid-cols-2 gap-3">
        {question.options.map((opt, i) => {
          const isCorrect = i === question.answer;
          const isSelected = answers[currentQ]?.index === i;

          let bgClass = 'bg-white border-gray-200';
          if (showAnswer) {
            if (isCorrect) bgClass = 'bg-green-100 border-green-500';
            else if (isSelected) bgClass = 'bg-red-100 border-red-500';
          }

          return (
            <button
              key={i}
              onClick={() => handleAnswer(opt, i)}
              disabled={showAnswer}
              className={`p-4 rounded-2xl border-3 transition-all ${bgClass} ${showAnswer ? '' : 'hover:border-blue-400 active:scale-95'}`}
            >
              <div className="flex flex-wrap justify-center gap-1">
                {Array(opt.count).fill(null).map((_, j) => (
                  <span key={j} className="text-2xl sm:text-3xl">{opt.image}</span>
                ))}
              </div>
              {showAnswer && isCorrect && (
                <div className="mt-2 text-green-600 font-bold text-sm">
                  <CheckCircle className="w-5 h-5 mx-auto" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  // QUIZ MODE
  if (doingQuiz) {
    if (quizFinished) {
      const passed = finalScore >= 6;
      const stars = finalScore >= 9 ? 3 : finalScore >= 7 ? 2 : finalScore >= 5 ? 1 : 0;

      return (
        <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${passed ? 'bg-gradient-to-b from-green-400 to-emerald-500' : 'bg-gradient-to-b from-orange-400 to-red-500'}`}>
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="text-6xl sm:text-7xl mb-4">
              {passed ? '🎉' : '💪'}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
              {passed ? 'Tuyet voi!' : 'Co gang them nhe!'}
            </h2>
            <p className="text-gray-500 mb-2">Ban da hoan thanh</p>
            <p className="text-lg font-bold text-indigo-600 mb-4">{currentAssignment.title}</p>

            {/* Stars */}
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3].map(i => (
                <Star key={i} className={`w-10 h-10 sm:w-12 sm:h-12 ${i <= stars ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
              ))}
            </div>

            {/* Score */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-4 mb-6 text-white">
              <p className="text-4xl sm:text-5xl font-bold">{finalScore}/10</p>
              <p className="text-white/80">Diem so</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={resetQuiz}
                className="flex-1 py-3 bg-gray-100 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200"
              >
                <RotateCcw className="w-5 h-5" /> Lam lai
              </button>
              <button
                onClick={() => { resetQuiz(); setActiveTab('completed'); }}
                className="flex-1 py-3 bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-600"
              >
                Xong
              </button>
            </div>
          </div>
        </div>
      );
    }

    const question = quizQuestions[currentQ];

    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 to-purple-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3">
          <div className="flex items-center justify-between">
            <button onClick={resetQuiz} className="p-2 bg-white/20 rounded-full">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>

            <div className="flex-1 mx-4">
              <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-white h-full rounded-full transition-all"
                  style={{ width: `${((currentQ + 1) / quizQuestions.length) * 100}%` }}
                />
              </div>
              <p className="text-center text-white/90 text-xs mt-1">
                Cau {currentQ + 1} / {quizQuestions.length}
              </p>
            </div>

            {/* Lives */}
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <Heart key={i} className={`w-6 h-6 ${i < lives ? 'text-red-400 fill-red-400' : 'text-white/30'}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="p-4 max-w-lg mx-auto">
          <div className="bg-white rounded-3xl p-5 shadow-xl mb-4">
            {/* Image */}
            {question.image && question.imageCount && (
              <div className="bg-amber-50 rounded-2xl p-4 mb-4">
                {renderImage(question.image, question.imageCount)}
              </div>
            )}

            {/* Question text */}
            <div className="bg-indigo-50 rounded-xl p-4 mb-4">
              <p className="text-lg sm:text-xl font-bold text-gray-800 text-center">
                {question.question}
              </p>
            </div>

            {/* Answer feedback */}
            {showAnswer && (
              <div className={`text-center py-2 mb-4 rounded-xl ${answers[currentQ]?.correct ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                <p className="font-bold text-lg">
                  {answers[currentQ]?.correct ? '🎉 Dung roi!' : '😢 Sai roi!'}
                </p>
              </div>
            )}
          </div>

          {/* Options */}
          {question.type === 'select' ? (
            renderSelectOptions(question)
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {question.options.map((opt, i) => {
                const isCorrect = opt === question.answer;
                const isSelected = answers[currentQ]?.answer === opt;

                let bgClass = 'bg-white border-gray-200';
                if (showAnswer) {
                  if (isCorrect) bgClass = 'bg-green-100 border-green-500 text-green-700';
                  else if (isSelected) bgClass = 'bg-red-100 border-red-500 text-red-700';
                }

                const colors = ['bg-blue-50', 'bg-orange-50', 'bg-purple-50', 'bg-green-50'];

                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt, i)}
                    disabled={showAnswer}
                    className={`py-4 rounded-xl border-3 font-bold text-xl transition-all ${showAnswer ? bgClass : colors[i] + ' border-transparent hover:border-blue-400 active:scale-95'}`}
                  >
                    {opt}
                    {showAnswer && isCorrect && <CheckCircle className="w-5 h-5 inline ml-2" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // No class message
  if (!loading && noClass) {
    return (
      <div className="p-4 space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <ClipboardList className="w-7 h-7 text-orange-500" />
            Bai tap cua ban
          </h1>
        </div>

        <div className="bg-white rounded-3xl p-8 text-center shadow-lg">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <School className="w-10 h-10 text-orange-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Chua co lop hoc</h3>
          <p className="text-gray-500 mb-4">
            Ban chua duoc them vao lop hoc nao. Hay lien he giao vien hoac nha truong de duoc ho tro.
          </p>
          <div className="bg-orange-50 rounded-xl p-4 text-left">
            <p className="text-sm text-orange-700">
              💡 <strong>Goi y:</strong> Ban van co the hoc cac bai hoc he thong trong muc "Bai hoc" ma khong can co lop.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/learn/lessons')}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg"
        >
          <Play className="w-5 h-5" />
          Hoc bai he thong
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
          <ClipboardList className="w-7 h-7 text-orange-500" />
          Bai tap cua ban
        </h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-2xl p-1">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === 'pending'
                  ? 'bg-white text-orange-600 shadow'
                  : 'text-gray-500'
              }`}
            >
              <AlertCircle className="w-5 h-5" />
              Chua lam ({pendingAssignments.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === 'completed'
                  ? 'bg-white text-green-600 shadow'
                  : 'text-gray-500'
              }`}
            >
              <CheckCircle className="w-5 h-5" />
              Da lam ({completedAssignments.length})
            </button>
          </div>

          {/* Assignments List */}
          {activeTab === 'pending' && (
            <div className="space-y-3">
              {pendingAssignments.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 text-center shadow-lg">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-lg font-bold text-gray-800">Tuyet voi!</h3>
                  <p className="text-gray-500">Ban da lam het bai tap roi!</p>
                </div>
              ) : (
                pendingAssignments.map((assignment) => {
                  const deadline = formatDeadline(assignment.due_date);
                  return (
                    <div
                      key={assignment.id}
                      className="bg-white rounded-2xl p-4 shadow-lg"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
                          📝
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-bold text-gray-800">{assignment.title}</h3>
                              <p className="text-sm text-gray-500">
                                {assignment.lesson?.title || 'Bai tap'} • {assignment.teacher?.full_name || 'Giao vien'}
                              </p>
                            </div>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${deadline.bg} ${deadline.color}`}>
                              {deadline.text}
                            </span>
                          </div>

                          {assignment.note && (
                            <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                              {assignment.note}
                            </p>
                          )}

                          <div className="flex items-center gap-4 mt-3">
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Han: {new Date(assignment.due_date).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleStartAssignment(assignment)}
                        className="w-full mt-4 bg-gradient-to-r from-orange-400 to-yellow-400 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow hover:shadow-lg transition-all active:scale-[0.98]"
                      >
                        <Play className="w-5 h-5" />
                        🎮 Lam bai ngay!
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'completed' && (
            <div className="space-y-3">
              {completedAssignments.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 text-center shadow-lg">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-lg font-bold text-gray-800">Chua co bai nao</h3>
                  <p className="text-gray-500">Hay hoan thanh bai tap dau tien nhe!</p>
                </div>
              ) : (
                completedAssignments.map((assignment) => (
                  <button
                    key={assignment.id}
                    onClick={() => handleViewResult(assignment)}
                    className="w-full bg-white rounded-2xl p-4 shadow-lg text-left hover:shadow-xl transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center text-3xl shadow-inner relative">
                        ✅
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800">{assignment.title}</h3>
                        <p className="text-sm text-gray-500">
                          {assignment.lesson?.title || 'Bai tap'} • {assignment.teacher?.full_name || 'Giao vien'}
                        </p>
                        {assignment.submission?.score !== undefined && (
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor((assignment.submission.score || 0) / 2)
                                      ? 'text-yellow-400 fill-yellow-400'
                                      : 'text-gray-200'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-bold text-green-600">
                              {assignment.submission.score}/10 diem
                            </span>
                          </div>
                        )}
                      </div>

                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          {/* Stats Card */}
          <div className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <p className="text-white/80 text-sm">Tong diem bai tap</p>
                <p className="text-3xl font-bold">
                  {completedAssignments.reduce((sum, a) => sum + (a.submission?.score || 0), 0)} diem
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Result Modal */}
      {showResultModal && selectedAssignment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden">
            <div className="bg-gradient-to-r from-green-400 to-emerald-400 p-6 text-white text-center relative">
              <button
                onClick={() => setShowResultModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-6xl mb-3">
                {(selectedAssignment.submission?.score || 0) >= 8 ? '🎉' :
                 (selectedAssignment.submission?.score || 0) >= 6 ? '👍' : '💪'}
              </div>
              <h2 className="text-2xl font-bold">
                {(selectedAssignment.submission?.score || 0) >= 8 ? 'Xuat sac!' :
                 (selectedAssignment.submission?.score || 0) >= 6 ? 'Tot lam!' : 'Co gang them!'}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <h3 className="font-bold text-gray-800 text-center">{selectedAssignment.title}</h3>

              <div className="flex justify-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-green-600">
                      {selectedAssignment.submission?.score || 0}
                    </p>
                    <p className="text-sm text-green-500">/10 diem</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-8 h-8 ${
                      i < Math.floor((selectedAssignment.submission?.score || 0) / 2)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>

              {selectedAssignment.submission?.feedback && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-sm text-blue-700">
                    <strong>Nhan xet:</strong> {selectedAssignment.submission.feedback}
                  </p>
                </div>
              )}

              <button
                onClick={() => setShowResultModal(false)}
                className="w-full py-3 bg-gray-100 rounded-xl font-medium text-gray-600 hover:bg-gray-200"
              >
                Dong
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
