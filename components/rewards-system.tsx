"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Gift, Trophy, Clock, Users, Zap, Star, Award } from "lucide-react"

interface Quiz {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  timeLimit: number
  prize: string
  prizeValue: string
  participants: number
}

interface Participant {
  id: number
  username: string
  score: number
  avatar?: string
  isWinner?: boolean
}

const mockQuiz: Quiz = {
  id: 1,
  question: "Which team won the VALORANT Champions 2023?",
  options: ["FNATIC", "Evil Geniuses", "Paper Rex", "Loud"],
  correctAnswer: 1,
  timeLimit: 15,
  prize: "Riot Points Gift Card",
  prizeValue: "$25",
  participants: 1247,
}

const mockLeaderboard: Participant[] = [
  { id: 1, username: "QuizMaster2024", score: 850, isWinner: true },
  { id: 2, username: "ESportsFan", score: 820 },
  { id: 3, username: "GameWiz", score: 800 },
  { id: 4, username: "ProPlayer", score: 780 },
  { id: 5, username: "StreamViewer", score: 750 },
]

export function RewardsSystem() {
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [quizPhase, setQuizPhase] = useState<"waiting" | "active" | "results">("waiting")
  const [userScore, setUserScore] = useState(0)
  const [hasAnswered, setHasAnswered] = useState(false)

  useEffect(() => {
    if (quizPhase === "active" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && quizPhase === "active") {
      setQuizPhase("results")
    }
  }, [timeLeft, quizPhase])

  const startQuiz = () => {
    setCurrentQuiz(mockQuiz)
    setTimeLeft(mockQuiz.timeLimit)
    setQuizPhase("active")
    setSelectedAnswer(null)
    setHasAnswered(false)
  }

  const submitAnswer = (answerIndex: number) => {
    if (hasAnswered) return

    setSelectedAnswer(answerIndex)
    setHasAnswered(true)

    // Calculate score based on speed and correctness
    const isCorrect = answerIndex === currentQuiz?.correctAnswer
    const speedBonus = Math.max(0, timeLeft * 10)
    const baseScore = isCorrect ? 100 : 0
    const totalScore = baseScore + speedBonus

    setUserScore(totalScore)

    // Auto-advance to results after a short delay
    setTimeout(() => {
      setQuizPhase("results")
    }, 2000)
  }

  const resetQuiz = () => {
    setCurrentQuiz(null)
    setQuizPhase("waiting")
    setSelectedAnswer(null)
    setUserScore(0)
    setHasAnswered(false)
  }

  if (quizPhase === "waiting") {
    return (
      <Card className="bg-black/40 border-purple-800/30">
        <CardHeader>
          <CardTitle className="text-purple-300 flex items-center gap-2">
            <Gift className="w-4 h-4" />
            Interactive Rewards
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-3">
            <div className="p-4 rounded-lg bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-700/30">
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-white">Next Quiz Starting Soon!</h3>
              <p className="text-sm text-gray-300">Compete with other viewers for amazing prizes</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-slate-800/50">
                <div className="text-center">
                  <Gift className="w-5 h-5 text-purple-400 mx-auto mb-1" />
                  <div className="text-sm font-medium text-white">$25 Riot Points</div>
                  <div className="text-xs text-gray-400">Next Prize</div>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/50">
                <div className="text-center">
                  <Users className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                  <div className="text-sm font-medium text-white">1,247</div>
                  <div className="text-xs text-gray-400">Participants</div>
                </div>
              </div>
            </div>

            <Button
              onClick={startQuiz}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Zap className="w-4 h-4 mr-2" />
              Join Quiz Competition
            </Button>
          </div>

          {/* Recent Winners */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-300">Recent Winners</h4>
            <div className="space-y-2">
              {mockLeaderboard.slice(0, 3).map((participant, index) => (
                <div key={participant.id} className="flex items-center gap-2 p-2 rounded bg-slate-800/30">
                  <div className="flex items-center gap-2">
                    {index === 0 && <Trophy className="w-4 h-4 text-yellow-400" />}
                    {index === 1 && <Award className="w-4 h-4 text-gray-400" />}
                    {index === 2 && <Award className="w-4 h-4 text-orange-400" />}
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs">{participant.username[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-medium text-white">{participant.username}</div>
                    <div className="text-xs text-gray-400">{participant.score} pts</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (quizPhase === "active" && currentQuiz) {
    return (
      <Card className="bg-black/40 border-purple-800/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-purple-300 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Live Quiz
            </CardTitle>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-400" />
              <span className="text-lg font-bold text-white">{timeLeft}s</span>
            </div>
          </div>
          <Progress value={(timeLeft / currentQuiz.timeLimit) * 100} className="h-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white leading-relaxed">{currentQuiz.question}</h3>

            <div className="space-y-2">
              {currentQuiz.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`w-full justify-start text-left h-auto p-3 ${
                    selectedAnswer === index
                      ? "bg-purple-600 border-purple-500 text-white"
                      : "bg-slate-800/50 border-purple-800/30 text-gray-300 hover:bg-slate-700/50"
                  } ${hasAnswered ? "cursor-not-allowed opacity-60" : ""}`}
                  onClick={() => submitAnswer(index)}
                  disabled={hasAnswered}
                >
                  <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center mr-3">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </Button>
              ))}
            </div>

            {hasAnswered && (
              <div className="p-3 rounded-lg bg-blue-900/20 border border-blue-800/30">
                <div className="flex items-center gap-2 text-blue-400">
                  <Star className="w-4 h-4" />
                  <span className="text-sm font-medium">Answer submitted! Score: {userScore} pts</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>
              Prize: {currentQuiz.prize} ({currentQuiz.prizeValue})
            </span>
            <span>{currentQuiz.participants.toLocaleString()} competing</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (quizPhase === "results" && currentQuiz) {
    const isCorrect = selectedAnswer === currentQuiz.correctAnswer

    return (
      <Card className="bg-black/40 border-purple-800/30">
        <CardHeader>
          <CardTitle className="text-purple-300 flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Quiz Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-3">
            <div
              className={`p-4 rounded-lg border ${
                isCorrect ? "bg-green-900/20 border-green-800/30" : "bg-red-900/20 border-red-800/30"
              }`}
            >
              {isCorrect ? (
                <div className="space-y-2">
                  <Trophy className="w-8 h-8 text-yellow-400 mx-auto" />
                  <h3 className="text-lg font-bold text-green-400">Correct!</h3>
                  <p className="text-sm text-gray-300">You earned {userScore} points</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center mx-auto">
                    <span className="text-white font-bold">X</span>
                  </div>
                  <h3 className="text-lg font-bold text-red-400">Incorrect</h3>
                  <p className="text-sm text-gray-300">
                    Correct answer: {currentQuiz.options[currentQuiz.correctAnswer]}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-300">Top Performers</h4>
              <div className="space-y-1">
                {mockLeaderboard.slice(0, 5).map((participant, index) => (
                  <div key={participant.id} className="flex items-center justify-between p-2 rounded bg-slate-800/30">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-purple-300">#{index + 1}</span>
                      <span className="text-xs text-white">{participant.username}</span>
                      {index === 0 && <Trophy className="w-3 h-3 text-yellow-400" />}
                    </div>
                    <span className="text-xs text-gray-400">{participant.score} pts</span>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={resetQuiz} className="w-full bg-purple-600 hover:bg-purple-700">
              Ready for Next Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
}
