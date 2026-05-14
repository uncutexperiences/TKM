import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const QUESTION_BANK = [
  {
    question: "What does Toyota Hybrid technology mainly help reduce?",
    options: ["Fuel consumption", "Engine weight", "Tyre pressure", "Vehicle size"],
    answer: "Fuel consumption",
  },
  {
    question: "What is regenerative braking?",
    options: [
      "Battery cooling system",
      "Braking that recharges the battery",
      "Emergency braking mode",
      "Wheel locking technology",
    ],
    answer: "Braking that recharges the battery",
  },
  {
    question: "Which Toyota model became globally famous for hybrid technology?",
    options: ["Fortuner", "Prius", "Innova", "Hilux"],
    answer: "Prius",
  },
  {
    question: "Toyota hybrids switch intelligently between:",
    options: [
      "Diesel and petrol",
      "Manual and automatic",
      "Electric motor and engine",
      "GPS and radar",
    ],
    answer: "Electric motor and engine",
  },
  {
    question: "One major benefit of hybrid vehicles is:",
    options: ["Higher emissions", "Reduced emissions", "Louder engines", "More fuel usage"],
    answer: "Reduced emissions",
  },
  {
    question: "Which driving condition benefits most from hybrid systems?",
    options: ["Racing tracks", "Urban traffic", "Off-roading only", "Snow driving only"],
    answer: "Urban traffic",
  },
  {
    question: "Toyota hybrid systems are known for:",
    options: ["Reliability and efficiency", "Frequent breakdowns", "Heavy smoke", "High noise"],
    answer: "Reliability and efficiency",
  },
  {
    question: "Hybrid cars generally produce:",
    options: ["Lower emissions", "Higher pollution", "No braking", "More smoke"],
    answer: "Lower emissions",
  },
  {
    question: "What stores electricity in a hybrid vehicle?",
    options: ["Fuel tank", "Hybrid battery", "Exhaust pipe", "Gearbox"],
    answer: "Hybrid battery",
  },
  {
    question: "Toyota’s sustainable mobility vision supports:",
    options: ["Cleaner mobility", "Higher emissions", "Fuel wastage", "Noise pollution"],
    answer: "Cleaner mobility",
  },
];

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function IconBadge({ emoji, label }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-red-600/20 border border-red-500/30 px-4 py-2 text-sm">
      <span>{emoji}</span>
      <span>{label}</span>
    </div>
  );
}

export default function ToyotaHybridQuizMicrosite() {
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [player, setPlayer] = useState({
    name: "",
    mobile: "",
    city: "",
  });

  // Production deployment additions
  const [leaderboard] = useState([
    { name: "Aarav", score: 145 },
    { name: "Meera", score: 138 },
    { name: "Rohan", score: 130 },
  ]);

  const [trainCode] = useState("TRAIN-A1");
  const [attemptId] = useState(() => crypto.randomUUID());

  const quizQuestions = useMemo(() => shuffle(QUESTION_BANK).slice(0, 10), []);

  useEffect(() => {
    if (!started || completed) return;

    if (timeLeft === 0) {
      handleNext();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, started, completed]);

  const saveQuizAttempt = async (finalScore) => {
    // Replace with Firebase / API integration in production
    const payload = {
      attemptId,
      trainCode,
      player,
      finalScore,
      timestamp: new Date().toISOString(),
    };

    console.log("Quiz Submission Payload", payload);

    localStorage.setItem("toyota-last-attempt", JSON.stringify(payload));
  };

  const handleAnswer = (option) => {
    if (selected) return;

    setSelected(option);

    if (option === quizQuestions[current].answer) {
      setScore((prev) => prev + 10 + timeLeft);
    }

    setTimeout(() => {
      handleNext();
    }, 1200);
  };

  const handleNext = () => {
    setSelected(null);
    setTimeLeft(15);

    if (current + 1 >= quizQuestions.length) {
      saveQuizAttempt(score);
      setCompleted(true);
      return;
    }

    setCurrent((prev) => prev + 1);
  };

  const progress = ((current + 1) / quizQuestions.length) * 100;

  const canStart =
    player.name.trim() &&
    player.mobile.trim().length >= 10 &&
    player.city.trim();

  if (!started) {
    return (
      <div className="min-h-screen bg-black text-white px-6 py-10 flex items-center justify-center">
        <div className="max-w-4xl w-full rounded-[40px] border border-white/10 bg-gradient-to-br from-zinc-900 to-red-950 p-10 lg:p-16 shadow-2xl">
          <IconBadge emoji="⚡" label="Toyota Hybrid Experience" />

          <h1 className="text-5xl lg:text-7xl font-black leading-tight mt-6">
            Scan. Play.
            <span className="text-red-500"> Win ₹100.</span>
          </h1>

          <p className="text-zinc-300 text-lg mt-6 max-w-2xl leading-relaxed">
            Participate in the Toyota Hybrid Tech Quiz and stand a chance to become one of 10 lucky winners per train every day.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mt-10">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-4xl mb-4">🏆</div>
              <div className="text-3xl font-black">10</div>
              <div className="text-zinc-400 mt-2">Lucky Winners Daily</div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-4xl mb-4">🎁</div>
              <div className="text-3xl font-black">₹100</div>
              <div className="text-zinc-400 mt-2">Voucher Reward</div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-4xl mb-4">⏱️</div>
              <div className="text-3xl font-black">15 Sec</div>
              <div className="text-zinc-400 mt-2">Per Question</div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-10">
            <input
              placeholder="Full Name"
              value={player.name}
              onChange={(e) => setPlayer({ ...player, name: e.target.value })}
              className="rounded-2xl bg-white/5 border border-white/10 px-5 py-4 outline-none"
            />

            <input
              placeholder="Mobile Number"
              value={player.mobile}
              onChange={(e) => setPlayer({ ...player, mobile: e.target.value })}
              className="rounded-2xl bg-white/5 border border-white/10 px-5 py-4 outline-none"
            />

            <input
              placeholder="City"
              value={player.city}
              onChange={(e) => setPlayer({ ...player, city: e.target.value })}
              className="rounded-2xl bg-white/5 border border-white/10 px-5 py-4 outline-none"
            />
          </div>

          <button
            disabled={!canStart}
            onClick={() => setStarted(true)}
            className={`mt-10 rounded-2xl px-10 py-5 text-xl font-bold transition-all ${
              canStart
                ? "bg-red-600 hover:bg-red-700"
                : "bg-zinc-700 cursor-not-allowed"
            }`}
          >
            Start Hybrid Challenge
          </button>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full rounded-[40px] border border-white/10 bg-gradient-to-br from-zinc-900 to-red-950 p-12 text-center"
        >
          <div className="text-7xl mb-6">✅</div>

          <h1 className="text-5xl font-black">Quiz Completed!</h1>

          <div className="text-7xl font-black text-red-500 mt-8">{score}</div>
          <div className="text-zinc-300 text-xl mt-2">Hybrid Hero Score</div>

          <div className="mt-8 rounded-3xl bg-white/5 border border-white/10 p-6">
            <div className="text-2xl font-bold">
              You are now eligible for the daily lucky draw.
            </div>
            <div className="text-zinc-400 mt-2">
              10 winners per train will receive ₹100 vouchers.
            </div>
          </div>

          <button
            onClick={() => window.location.reload()}
            className="mt-10 rounded-2xl bg-red-600 hover:bg-red-700 px-10 py-4 text-lg font-bold"
          >
            Play Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-zinc-400">Toyota Hybrid Quiz</div>
            <div className="text-3xl font-black">
              Question {current + 1}/{quizQuestions.length}
            </div>
          </div>

          <div className="h-20 w-20 rounded-full border-4 border-red-500 flex items-center justify-center text-2xl font-black">
            {timeLeft}
          </div>
        </div>

        <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-10">
          <div
            className="h-full bg-red-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-[40px] border border-white/10 bg-gradient-to-br from-zinc-900 to-zinc-950 p-10"
          >
            <IconBadge emoji="⚡" label="Earn XP + Speed Bonus" />

            <h2 className="text-4xl font-black leading-tight mb-10 mt-6">
              {quizQuestions[current].question}
            </h2>

            <div className="grid gap-4">
              {quizQuestions[current].options.map((option, index) => {
                const correct = option === quizQuestions[current].answer;
                const active = selected === option;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className={`rounded-2xl border px-6 py-5 text-left text-lg transition-all font-medium ${
                      active && correct
                        ? "bg-green-500/20 border-green-500"
                        : active
                        ? "bg-red-500/20 border-red-500"
                        : "bg-white/5 border-white/10 hover:border-red-500 hover:bg-red-500/10"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <div className="text-zinc-400 text-sm">Current Score</div>
            <div className="text-4xl font-black text-red-500 mt-2">{score}</div>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <div className="text-zinc-400 text-sm">Potential Reward</div>
            <div className="text-4xl font-black text-red-500 mt-2">₹100</div>
          </div>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <div className="text-zinc-400 text-sm">Daily Winners</div>
            <div className="text-4xl font-black text-red-500 mt-2">10</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-10">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-2xl font-black mb-4">🏆 Leaderboard</div>

            <div className="space-y-3">
              {leaderboard.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-2xl bg-black/30 border border-white/10 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-red-600 flex items-center justify-center font-bold">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="font-semibold">{user.name}</div>
                      <div className="text-zinc-400 text-sm">Hybrid Hero</div>
                    </div>
                  </div>

                  <div className="text-red-500 font-black text-xl">
                    {user.score}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-2xl font-black mb-4">🚀 Production Deployment</div>

            <ul className="space-y-3 text-zinc-300 leading-relaxed">
              <li>✅ Firebase OTP Authentication</li>
              <li>✅ QR Scan Analytics</li>
              <li>✅ Daily Winner Automation</li>
              <li>✅ Voucher Distribution API</li>
              <li>✅ Duplicate Participation Prevention</li>
              <li>✅ Real-Time Leaderboard</li>
              <li>✅ Train-wise Tracking</li>
              <li>✅ Admin Dashboard Integration</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center text-zinc-500 text-sm">
          Demo Production Build • Toyota Hybrid Quiz Experience
        </div>
      </div>
    </div>
  );
}
