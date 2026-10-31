import React, { useState, useEffect } from 'react';
import { 
  BookOpen, BrainCircuit, CheckCircle, ChevronRight, Play, Award, 
  Users, BarChart3, Upload, FileText, Settings, LogOut, Image as ImageIcon,
  ArrowUp, ArrowDown, User, Check, X, Search
} from 'lucide-react';

// --- MOCK DATA: 30 Students for Mathayom 1 (โรงเรียนเตรียมอุดมศึกษาพัฒนาการ) ---
const MOCK_STUDENTS = Array.from({ length: 30 }, (_, i) => {
  const firstNames = ["ภูมิภัทร", "ณัฐชา", "กฤตเมธ", "ปพิชญา", "ธนกร", "พิมพ์มาดา", "ศุภกร", "จิรัชญา", "ธีรภัทร", "ปุณยาพร"];
  const lastNames = ["ศรีสุวรรณ", "วงศ์สว่าง", "ศิริกุล", "เตชะวณิช", "พัฒนกุล", "ใจดี", "แซ่ตั้ง", "มั่งมี", "คงคา", "แสงทอง"];
  return {
    id: `std-6601${(i + 1).toString().padStart(2, '0')}`,
    name: `ด.ช./ด.ญ. ${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
    no: i + 1,
    avatar: `https://placehold.co/100x100/3b82f6/ffffff?text=${i+1}`,
    progress: Math.floor(Math.random() * 100),
    score: Math.floor(Math.random() * 20),
    lastActive: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString('th-TH')
  };
});

const COURSE_MODULES = [
  {
    id: 'm1',
    title: 'บทที่ 1: แนวคิดเชิงนามธรรม (Abstraction)',
    description: 'เรียนรู้การแยกแยะข้อมูลที่สำคัญออกจากข้อมูลที่ไม่จำเป็นในการแก้ปัญหา',
    icon: <BrainCircuit className="w-8 h-8 text-blue-500" />,
    totalSteps: 3
  },
  {
    id: 'm2',
    title: 'บทที่ 2: การออกแบบอัลกอริทึม (Algorithm)',
    description: 'นำข้อมูลที่คัดกรองแล้วมาวางแผนเรียงลำดับขั้นตอนแก้ปัญหาอย่างเป็นระบบ',
    icon: <BookOpen className="w-8 h-8 text-indigo-500" />,
    totalSteps: 2
  }
];

// --- SUPABASE SERVICE SIMULATION ---
const supabaseService = {
  getStudents: async () => new Promise(res => setTimeout(() => res(MOCK_STUDENTS), 500)),
  getStudentById: async (id) => new Promise(res => setTimeout(() => res(MOCK_STUDENTS.find(s => s.id === id)), 300)),
  updateProgress: async (id, progress) => new Promise(res => setTimeout(() => res({ success: true }), 300)),
  uploadFile: async (file) => new Promise(res => setTimeout(() => res({ url: `mock-url-${Date.now()}` }), 800)),
};

const LoginView = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Branding */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 md:w-2/5 flex flex-col items-center justify-center text-white">
          <BrainCircuit className="w-24 h-24 mb-6 text-blue-200" />
          <h1 className="text-3xl font-bold text-center mb-2">CAI วิทยาการคำนวณ</h1>
          <p className="text-center text-blue-100 mb-4">รหัสวิชา ว21103 ชั้นมัธยมศึกษาปีที่ 1</p>
          <div className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium">
            โรงเรียนเตรียมอุดมศึกษาพัฒนาการ
          </div>
        </div>
        
        {/* Right Login Selection */}
        <div className="p-8 md:w-3/5">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">เข้าสู่ระบบ (Demo)</h2>
          
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-700 mb-3 flex items-center">
              <User className="w-5 h-5 mr-2" /> เข้าใช้งานในฐานะครูผู้สอน
            </h3>
            <button 
              onClick={() => onLogin({ role: 'teacher' })}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center cursor-pointer"
            >
              <Settings className="w-5 h-5 mr-2" />
              เปิด Teacher Dashboard (Supabase Admin)
            </button>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-3 flex items-center">
              <Users className="w-5 h-5 mr-2" /> เข้าใช้งานในฐานะนักเรียน (30 คน)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-2 pb-2">
              {MOCK_STUDENTS.slice(0, 15).map(std => (
                <button
                  key={std.id}
                  onClick={() => onLogin({ role: 'student', ...std })}
                  className="bg-slate-100 hover:bg-blue-50 hover:border-blue-300 border border-transparent p-3 rounded-lg flex flex-col items-center transition-all text-xs text-slate-700 cursor-pointer"
                >
                  <img src={std.avatar} alt={std.name} className="w-10 h-10 rounded-full mb-2" />
                  <span className="font-medium truncate w-full text-center">{std.name}</span>
                  <span className="text-slate-400">เลขที่ {std.no}</span>
                </button>
              ))}
              <div className="col-span-full text-center text-xs text-slate-400 py-2">
                *แสดงตัวอย่างรายชื่อนักเรียนจากระบบฐานข้อมูล
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentDashboard = ({ user, onStartLesson, onLogout }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <BrainCircuit className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="font-bold text-slate-800">วิทยาการคำนวณ ม.1 (ว21103)</h1>
            <p className="text-xs text-slate-500">โรงเรียนเตรียมอุดมศึกษาพัฒนาการ</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-right">
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-slate-700">{user.name}</p>
              <p className="text-xs text-slate-500">เลขที่ {user.no}</p>
            </div>
            <img src={user.avatar} alt="Profile" className="w-10 h-10 rounded-full border-2 border-blue-200" />
          </div>
          <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors cursor-pointer" title="ออกจากระบบ">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-6 mt-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">สวัสดี, {user.name.split(' ')[1] || user.name}! 👋</h2>
            <p className="text-blue-100 max-w-lg">
              มาฝึกฝนกระบวนการคิดเชิงนามธรรมและการออกแบบอัลกอริทึมเพื่อแก้ปัญหาในชีวิตจริงอย่างเป็นระบบกันเถอะ!
            </p>
          </div>
          <div className="hidden md:flex flex-col items-center bg-white/20 p-4 rounded-xl">
            <Award className="w-10 h-10 text-yellow-300 mb-1" />
            <span className="text-sm font-medium">คะแนนสะสม</span>
            <span className="text-2xl font-bold">{user.score} / 20</span>
          </div>
        </div>

        {/* Modules Grid */}
        <h3 className="text-xl font-bold text-slate-800 mb-4">บทเรียนของคุณ</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {COURSE_MODULES.map((module, idx) => (
            <div key={module.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
                <div 
                  className={`h-full ${idx === 0 ? 'bg-blue-500 w-full' : 'bg-indigo-500 w-1/2'}`} 
                />
              </div>
              
              <div className="flex items-start gap-4 mb-4 mt-2">
                <div className="bg-slate-50 p-3 rounded-xl">
                  {module.icon}
                </div>
                <div>
                  <h4 className="font-bold text-lg text-slate-800">{module.title}</h4>
                  <p className="text-sm text-slate-500 line-clamp-2">{module.description}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-6">
                <span className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                  {module.totalSteps} กิจกรรม
                </span>
                <button 
                  onClick={() => onStartLesson(module.id)}
                  className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-medium px-4 py-2 rounded-lg flex items-center transition-colors text-sm cursor-pointer"
                >
                  เข้าสู่บทเรียน <Play className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const InteractiveAbstraction = ({ onComplete }) => {
  const [items, setItems] = useState([
    { id: 1, text: "ความจุแบตเตอรี่ (mAh)", isEssential: true, selectedAs: null },
    { id: 2, text: "สีสันและลวดลายของเคสโทรศัพท์", isEssential: false, selectedAs: null },
    { id: 3, text: "ชื่อร้านค้าที่แถมของสมนาคุณ", isEssential: false, selectedAs: null },
    { id: 4, text: "หน่วยประมวลผล (Processor / RAM)", isEssential: true, selectedAs: null },
    { id: 5, text: "ขนาดหน้าจอและน้ำหนักของตัวเครื่อง", isEssential: true, selectedAs: null },
  ]);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelect = (id, type) => {
    if (checked) return;
    setItems(items.map(item => item.id === id ? { ...item, selectedAs: type } : item));
  };

  const checkAnswers = () => {
    let currentScore = 0;
    items.forEach(item => {
      if ((item.isEssential && item.selectedAs === 'essential') || 
          (!item.isEssential && item.selectedAs === 'non-essential')) {
        currentScore++;
      }
    });
    setScore(currentScore);
    setChecked(true);
  };

  const allAnswered = items.every(item => item.selectedAs !== null);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-800 mb-2">ภารกิจ: แยกแยะข้อมูล (Abstraction)</h3>
        <p className="text-slate-600 bg-blue-50 p-4 rounded-lg text-sm border border-blue-100">
          <strong>สถานการณ์:</strong> นักเรียนต้องการเลือกซื้อ "โทรศัพท์มือถือ" สำหรับใช้เรียนออนไลน์ 
          จงพิจารณาข้อความต่อไปนี้ว่าข้อมูลใดคือ <strong>"ข้อมูลสำคัญ"</strong> หรือ <strong>"ข้อมูลไม่สำคัญ"</strong>
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {items.map((item) => {
          let statusColor = "";
          let icon = null;
          if (checked) {
            const isCorrect = (item.isEssential && item.selectedAs === 'essential') || (!item.isEssential && item.selectedAs === 'non-essential');
            statusColor = isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200";
            icon = isCorrect ? <Check className="w-5 h-5 text-green-500" /> : <X className="w-5 h-5 text-red-500" />;
          }

          return (
            <div key={item.id} className={`flex items-center justify-between p-4 rounded-xl border ${statusColor || 'border-slate-200 bg-white'}`}>
              <div className="flex items-center gap-3">
                {checked && icon}
                <span className="font-medium text-slate-700 text-sm md:text-base">{item.text}</span>
              </div>
              <div className="flex gap-2">
                <button
                  disabled={checked}
                  onClick={() => handleSelect(item.id, 'essential')}
                  className={`px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors cursor-pointer ${
                    item.selectedAs === 'essential' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  สำคัญ
                </button>
                <button
                  disabled={checked}
                  onClick={() => handleSelect(item.id, 'non-essential')}
                  className={`px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors cursor-pointer ${
                    item.selectedAs === 'non-essential' 
                      ? 'bg-slate-600 text-white' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  ไม่สำคัญ
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {!checked ? (
        <button
          onClick={checkAnswers}
          disabled={!allAnswered}
          className={`w-full py-3 rounded-xl font-bold transition-colors cursor-pointer ${
            allAnswered ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          ตรวจคำตอบ
        </button>
      ) : (
        <div className="text-center">
          <div className="inline-block bg-blue-100 text-blue-800 px-6 py-3 rounded-xl font-bold text-lg mb-4">
            คุณตอบถูก {score} จาก 5 ข้อ
          </div>
          <button
            onClick={onComplete}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl shadow-md transition-colors flex items-center justify-center cursor-pointer"
          >
            ไปหน้าถัดไป <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      )}
    </div>
  );
};

const InteractiveAlgorithm = ({ onComplete }) => {
  const [steps, setSteps] = useState([
    { id: 's3', text: 'ต้มน้ำในหม้อให้เดือด ใส่เส้นและเครื่องปรุง', order: 3 },
    { id: 's5', text: 'ตักใส่ชาม พร้อมรับประทาน', order: 5 },
    { id: 's1', text: 'เตรียมบะหมี่กึ่งสำเร็จรูปและอุปกรณ์', order: 1 },
    { id: 's4', text: 'ปิดฝารอประมาณ 3 นาที', order: 4 },
    { id: 's2', text: 'ฉีกซองบะหมี่และเครื่องปรุง', order: 2 },
  ]);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const moveUp = (index) => {
    if (index === 0 || checked) return;
    const newSteps = [...steps];
    [newSteps[index - 1], newSteps[index]] = [newSteps[index], newSteps[index - 1]];
    setSteps(newSteps);
  };

  const moveDown = (index) => {
    if (index === steps.length - 1 || checked) return;
    const newSteps = [...steps];
    [newSteps[index + 1], newSteps[index]] = [newSteps[index], newSteps[index + 1]];
    setSteps(newSteps);
  };

  const checkOrder = () => {
    const correct = steps.every((step, index) => step.order === index + 1);
    setIsCorrect(correct);
    setChecked(true);
  };

  const reset = () => {
    setChecked(false);
    setIsCorrect(false);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-800 mb-2">ภารกิจ: เรียงลำดับขั้นตอน (Algorithm Design)</h3>
        <p className="text-slate-600 bg-indigo-50 p-4 rounded-lg text-sm border border-indigo-100">
          <strong>สถานการณ์:</strong> ขั้นตอนการต้มบะหมี่กึ่งสำเร็จรูป
          <br/>จงเรียงลำดับขั้นตอนการแก้ปัญหานี้ให้ถูกต้อง โดยใช้ปุ่มลูกศรขึ้น/ลง
        </p>
      </div>

      <div className="space-y-2 mb-6">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-3 rounded-xl">
            <div className="flex flex-col gap-1">
              <button 
                onClick={() => moveUp(index)} 
                disabled={index === 0 || checked}
                className={`p-1 rounded bg-white border border-slate-200 shadow-sm cursor-pointer ${index === 0 || checked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50 text-slate-600'}`}
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button 
                onClick={() => moveDown(index)} 
                disabled={index === steps.length - 1 || checked}
                className={`p-1 rounded bg-white border border-slate-200 shadow-sm cursor-pointer ${index === steps.length - 1 || checked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50 text-slate-600'}`}
              >
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 font-medium text-slate-700 bg-white p-3 rounded-lg border border-slate-100 shadow-sm text-sm">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-xs font-bold text-slate-600 mr-3">
                {index + 1}
              </span>
              {step.text}
            </div>
          </div>
        ))}
      </div>

      {!checked ? (
        <button
          onClick={checkOrder}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md transition-colors cursor-pointer"
        >
          ตรวจสอบอัลกอริทึม
        </button>
      ) : (
        <div className="text-center">
          {isCorrect ? (
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-6 py-3 rounded-xl font-bold text-lg mb-4">
                <CheckCircle className="w-6 h-6" /> อัลกอริทึมถูกต้องสมบูรณ์!
              </div>
              <button
                onClick={onComplete}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md transition-colors flex items-center justify-center cursor-pointer"
              >
                เสร็จสิ้นบทเรียน <Check className="w-5 h-5 ml-2" />
              </button>
            </div>
          ) : (
            <div>
              <div className="inline-flex items-center gap-2 bg-red-100 text-red-800 px-6 py-3 rounded-xl font-bold text-lg mb-4">
                <X className="w-6 h-6" /> ลำดับขั้นตอนยังไม่ถูกต้อง
              </div>
              <button
                onClick={reset}
                className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 rounded-xl transition-colors cursor-pointer"
              >
                ลองใหม่อีกครั้ง
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const LessonView = ({ moduleId, onBack }) => {
  const [step, setStep] = useState(0);

  const renderContent = () => {
    if (moduleId === 'm1') {
      if (step === 0) {
        return (
          <div className="prose max-w-none text-slate-700">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">แนวคิดเชิงนามธรรม (Abstraction) คืออะไร?</h2>
            <p className="text-base leading-relaxed mb-4">
              <strong>แนวคิดเชิงนามธรรม (Abstraction)</strong> คือการประเมินความสำคัญของรายละเอียดของปัญหา 
              โดยแยกแยะส่วนที่เป็นสาระสำคัญ (จำเป็นต้องใช้) ออกจากส่วนที่ไม่ใช่สาระสำคัญ (สามารถตัดทิ้งได้)
            </p>
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg mb-6 text-sm">
              <p className="font-bold mb-1">💡 วัตถุประสงค์การเรียนรู้:</p>
              <p>เพื่อช่วยให้ผู้เรียนเข้าใจปัญหาได้ตรงจุด ออกแบบวิธีแก้ปัญหาได้มีประสิทธิภาพ ไม่ถูกรบกวนจากข้อมูลที่ไม่เกี่ยวข้อง</p>
            </div>
            <button 
              onClick={() => setStep(1)}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors shadow-md flex items-center justify-center ml-auto cursor-pointer"
            >
              ทำกิจกรรมฝึกปฏิบัติ <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          </div>
        );
      } else if (step === 1) {
        return <InteractiveAbstraction onComplete={() => setStep(2)} />;
      } else {
        return (
          <div className="text-center py-12">
            <Award className="w-24 h-24 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-slate-800 mb-4">ยอดเยี่ยมมาก! ผ่านบทเรียนที่ 1 แล้ว 🎉</h2>
            <button onClick={onBack} className="px-8 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-bold transition-colors cursor-pointer">
              กลับสู่หน้าหลัก
            </button>
          </div>
        );
      }
    } else {
       if (step === 0) {
          return (
             <div className="prose max-w-none text-slate-700">
              <h2 className="text-2xl font-bold text-indigo-700 mb-4">การออกแบบอัลกอริทึม (Algorithm Design)</h2>
              <p className="text-base leading-relaxed mb-4">
                หลังจากคัดกรองข้อมูลที่สำคัญแล้ว ขั้นตอนถัดไปคือการเรียงลำดับขั้นตอนการทำงานหรือการแก้ปัญหาอย่างเป็นขั้นตอนชัดเจน เพื่อให้คอมพิวเตอร์หรือมนุษย์ปฏิบัติตามแล้วได้ผลลัพธ์ที่ถูกต้อง
              </p>
               <button 
                onClick={() => setStep(1)}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors shadow-md flex items-center justify-center ml-auto mt-8 cursor-pointer"
              >
                เริ่มภารกิจจัดเรียงขั้นตอน <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            </div>
          );
       } else if (step === 1) {
          return <InteractiveAlgorithm onComplete={() => setStep(2)} />;
       } else {
         return (
          <div className="text-center py-12">
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-slate-800 mb-4">ยินดีด้วย! คุณผ่านบทเรียนทั้งหมดแล้ว 🎉</h2>
            <button onClick={onBack} className="px-8 py-3 bg-slate-800 text-white hover:bg-slate-700 rounded-xl font-bold transition-colors cursor-pointer">
              กลับสู่หน้าหลัก
            </button>
          </div>
         );
       }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-slate-800 p-4 flex items-center gap-4 text-white">
          <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer">
            <ChevronRight className="w-6 h-6 rotate-180" />
          </button>
          <div className="flex-1">
            <h2 className="font-bold">{COURSE_MODULES.find(m => m.id === moduleId)?.title}</h2>
          </div>
          <div className="text-sm font-medium bg-slate-700 px-3 py-1 rounded-full">
            Step {step + 1}
          </div>
        </div>
        
        <div className="p-8 md:p-12">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

const TeacherDashboard = ({ onLogout }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDB = async () => {
      const data = await supabaseService.getStudents();
      setStudents(data);
      setLoading(false);
    };
    fetchDB();
  }, []);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.no.toString().includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col">
        <div className="p-6 bg-slate-950 flex items-center gap-3">
          <Settings className="w-6 h-6 text-blue-400" />
          <div>
            <h1 className="font-bold text-white text-base">Supabase Admin</h1>
            <p className="text-xs text-slate-400">เตรียมอุดมศึกษาพัฒนาการ</p>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}
          >
            <BarChart3 className="w-5 h-5" /> <span>ผลการเรียนนักเรียน</span>
          </button>
          <button 
            onClick={() => setActiveTab('media')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors cursor-pointer ${activeTab === 'media' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}
          >
            <Upload className="w-5 h-5" /> <span>จัดการสื่อ (Storage)</span>
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-400 transition-colors cursor-pointer">
            <LogOut className="w-5 h-5" /> <span>ออกจากระบบ</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b border-slate-200 p-6 flex flex-col sm:flex-row justify-between items-center sticky top-0 z-10 gap-4">
          <h2 className="text-2xl font-bold text-slate-800">
            {activeTab === 'overview' ? 'รายงานภาพรวมนักเรียน (30 คน)' : 'จัดการไฟล์และสื่อการสอนในระบบ'}
          </h2>
          {activeTab === 'overview' && (
            <div className="relative w-full sm:w-auto">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="ค้นหาด้วยชื่อหรือเลขที่..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
              />
            </div>
          )}
        </header>

        <div className="p-6 max-w-6xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-20 text-slate-400">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : activeTab === 'overview' ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-4">เลขที่</th>
                      <th className="p-4">โปรไฟล์</th>
                      <th className="p-4">ชื่อ-สกุล</th>
                      <th className="p-4">ความก้าวหน้า</th>
                      <th className="p-4">คะแนนรวม</th>
                      <th className="p-4">เข้าสู่ระบบล่าสุด</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 text-slate-500 font-medium">{student.no}</td>
                        <td className="p-4">
                          <img src={student.avatar} alt="avatar" className="w-8 h-8 rounded-full border border-slate-200" />
                        </td>
                        <td className="p-4 font-medium text-slate-800">{student.name}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden w-28">
                              <div 
                                className={`h-full rounded-full ${student.progress > 70 ? 'bg-green-500' : student.progress > 30 ? 'bg-blue-500' : 'bg-amber-400'}`} 
                                style={{ width: `${student.progress}%` }} 
                              />
                            </div>
                            <span className="text-xs font-bold text-slate-500">{student.progress}%</span>
                          </div>
                        </td>
                        <td className="p-4 font-bold text-slate-700">{student.score}/20</td>
                        <td className="p-4 text-xs text-slate-400">{student.lastActive}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
             <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center border-dashed">
                <ImageIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-700 mb-2">อัปโหลดสื่อการสอนและใบงาน</h3>
                <p className="text-slate-500 mb-6 text-sm">จำลองการเชื่อมต่อ Supabase Storage สำเร็จ</p>
                <label className="bg-blue-50 text-blue-600 px-6 py-3 rounded-xl font-semibold cursor-pointer hover:bg-blue-100 transition-colors inline-block">
                  เลือกไฟล์ที่จะอัปโหลด (.pdf / .docx)
                  <input type="file" className="hidden" accept=".pdf,.docx" />
                </label>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('login');
  const [activeModule, setActiveModule] = useState(null);

  const handleLogin = (user) => {
    setCurrentUser(user);
    if (user.role === 'teacher') {
      setCurrentView('teacher_dash');
    } else {
      setCurrentView('student_dash');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('login');
    setActiveModule(null);
  };

  const startLesson = (moduleId) => {
    setActiveModule(moduleId);
    setCurrentView('lesson');
  };

  const backToDash = () => {
    setActiveModule(null);
    setCurrentView('student_dash');
  };

  return (
    <div className="font-sans antialiased text-slate-900">
      {currentView === 'login' && <LoginView onLogin={handleLogin} />}
      {currentView === 'student_dash' && currentUser && (
        <StudentDashboard 
          user={currentUser} 
          onStartLesson={startLesson} 
          onLogout={handleLogout} 
        />
      )}
      {currentView === 'lesson' && activeModule && (
        <LessonView 
          moduleId={activeModule} 
          onBack={backToDash} 
        />
      )}
      {currentView === 'teacher_dash' && (
        <TeacherDashboard onLogout={handleLogout} />
      )}
    </div>
  );
}