"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import {
  Send,
  Users,
  Eye,
  Heart,
  Gift,
  Settings,
  Maximize2,
  Shield,
  AlertTriangle,
  BarChart3,
  Palette,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { ChatModerationSystem } from "@/components/chat-moderation"
import { RewardsSystem } from "@/components/rewards-system"
import Link from "next/link"

// Mock data for the stream
const mockStream = {
  title: "VALORANT Game Changers 2024 - Championship Finals",
  streamer: "VALORANT Esports",
  viewers: 45672,
  game: "VALORANT",
  thumbnail:
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Game%20Changers%20Women%20GIF%20by%20VALORANT%20Esports-TztYGACpiGa2GdqSCU3wjkHidiHtRb.gif",
  isLive: true,
}

const mockMatches = [
  { id: 1, team1: "Team Liquid", team2: "FNATIC", time: "Live", score: "13-11", status: "live" },
  { id: 2, team1: "G2 Esports", team2: "NaVi", time: "15:30", score: "0-0", status: "upcoming" },
  { id: 3, team1: "Cloud9", team2: "100 Thieves", time: "17:00", score: "0-0", status: "upcoming" },
]

interface ChatMessage {
  id: number
  user: string
  message: string
  timestamp: string
  isVip: boolean
  isModerated?: boolean
  moderationReason?: string
  toxicityScore?: number
}

interface HUDPreset {
  id: string
  name: string
  game: string
  players: Array<{
    name: string
    kills: number
    deaths: number
    assists: number
    score: number
    agent?: string
    weapon?: string
  }>
  teamA: string
  teamB: string
  scoreA: number
  scoreB: number
  round: number
  time: string
}

const mockChatMessages: ChatMessage[] = [
  { id: 1, user: "ProGamer123", message: "LIQUID IS INSANE!", timestamp: "14:23", isVip: false },
  { id: 2, user: "ESportsKing", message: "That clutch was incredible!", timestamp: "14:24", isVip: true },
  { id: 3, user: "ValFan2024", message: "GG EZ Clap", timestamp: "14:24", isVip: false },
  { id: 4, user: "StreamSniper", message: "FNATIC comeback incoming", timestamp: "14:25", isVip: false },
  {
    id: 5,
    user: "ToxicUser",
    message: "[Message flagged by AI moderation]",
    timestamp: "14:26",
    isVip: false,
    isModerated: true,
    moderationReason: "Toxic language detected",
    toxicityScore: 0.85,
  },
]

const chatPool = [
  { user: "ProGamer123", message: "LIQUID IS INSANE!", isVip: false },
  { user: "ESportsKing", message: "That clutch was incredible!", isVip: true },
  { user: "ValFan2024", message: "GG EZ Clap", timestamp: "14:24", isVip: false },
  { user: "StreamSniper", message: "FNATIC comeback incoming", timestamp: "14:25", isVip: false },
  { user: "ChatModerator", message: "Keep it clean everyone!", isVip: true },
  { user: "ViewerBot", message: "Amazing gameplay!", isVip: false },
  { user: "ToxicUser", message: "This team is trash", isVip: false, isToxic: true },
  { user: "FanGirl", message: "I love this tournament!", isVip: false },
  { user: "ProAnalyst", message: "Great strategy from both teams", isVip: true },
  { user: "RandomViewer", message: "Who's winning?", isVip: false },
  { user: "HaterUser", message: "These players are so bad", isVip: false, isToxic: true },
  { user: "SupportFan", message: "Let's go Team Liquid!", isVip: false },
  { user: "TechGuru", message: "The production quality is amazing", isVip: true },
  { user: "CasualViewer", message: "First time watching esports", isVip: false },
  { user: "TrollUser", message: "EZ game noobs", isVip: false, isToxic: true },
]

const hudPresets: HUDPreset[] = [
  {
    id: "valorant",
    name: "VALORANT Match",
    game: "VALORANT",
    teamA: "VVDH",
    teamB: "MVT",
    scoreA: 17,
    scoreB: 17,
    round: 35,
    time: "0:48",
    players: [
      { name: "Jett", kills: 24, deaths: 18, assists: 5, score: 1600, agent: "Jett", weapon: "Vandal" },
      { name: "Killjoy", kills: 19, deaths: 16, assists: 8, score: 3500, agent: "Killjoy", weapon: "Phantom" },
      { name: "Sova", kills: 21, deaths: 15, assists: 6, score: 1850, agent: "Sova", weapon: "Vandal" },
      { name: "Raze", kills: 16, deaths: 19, assists: 12, score: 1300, agent: "Raze", weapon: "Phantom" },
      { name: "Cypher", kills: 18, deaths: 17, assists: 9, score: 2500, agent: "Cypher", weapon: "Vandal" },
      { name: "Omen", kills: 26, deaths: 15, assists: 7, score: 2800, agent: "Omen", weapon: "Vandal" },
      { name: "Sova", kills: 22, deaths: 18, assists: 9, score: 2200, agent: "Sova", weapon: "Phantom" },
      { name: "Breach", kills: 20, deaths: 16, assists: 11, score: 1900, agent: "Breach", weapon: "Vandal" },
      { name: "Phoenix", kills: 17, deaths: 20, assists: 14, score: 1700, agent: "Phoenix", weapon: "Phantom" },
      { name: "Sage", kills: 15, deaths: 19, assists: 16, score: 1400, agent: "Sage", weapon: "Vandal" },
    ],
  },
]

export default function StreamPage() {
  const [chatMessage, setChatMessage] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages)
  const [isFollowing, setIsFollowing] = useState(false)
  const [showModerationPanel, setShowModerationPanel] = useState(false)
  const [showRewards, setShowRewards] = useState(true)
  const [showHUD, setShowHUD] = useState(true)
  const [expandedSections, setExpandedSections] = useState({
    video: true,
    streamInfo: true,
    matches: true,
    rewards: true,
    moderation: true,
  })
  const [moderationStats, setModerationStats] = useState({
    totalMessages: 156,
    flaggedMessages: 8,
    toxicityRate: 5.1,
  })

  const chatContainerRef = useRef<HTMLDivElement>(null)
  const currentHUD = hudPresets[0] // Always show VALORANT preset

  useEffect(() => {
    const interval = setInterval(() => {
      const randomChat = chatPool[Math.floor(Math.random() * chatPool.length)]
      const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

      // Simulate toxicity detection
      const isToxic = randomChat.isToxic || false
      const toxicityScore = isToxic ? Math.random() * 0.3 + 0.7 : Math.random() * 0.3
      const isModerated = toxicityScore > 0.7

      const newMessage: ChatMessage = {
        id: Date.now(),
        user: randomChat.user,
        message: isModerated ? "[Message flagged by AI moderation]" : randomChat.message,
        timestamp: currentTime,
        isVip: randomChat.isVip,
        isModerated,
        moderationReason: isModerated ? "Potentially toxic content detected" : undefined,
        toxicityScore,
      }

      setMessages((prev) => {
        const updated = [...prev, newMessage]
        // Keep only the 50 latest messages
        return updated.slice(-50)
      })

      // Update moderation stats
      if (isModerated) {
        setModerationStats((prev) => ({
          totalMessages: prev.totalMessages + 1,
          flaggedMessages: prev.flaggedMessages + 1,
          toxicityRate: ((prev.flaggedMessages + 1) / (prev.totalMessages + 1)) * 100,
        }))
      } else {
        setModerationStats((prev) => ({
          ...prev,
          totalMessages: prev.totalMessages + 1,
          toxicityRate: (prev.flaggedMessages / (prev.totalMessages + 1)) * 100,
        }))
      }
    }, 2000) // Add new message every 2 seconds

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (chatContainerRef.current) {
      const scrollElement = chatContainerRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
  }, [messages])

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const sendMessage = async () => {
    if (chatMessage.trim()) {
      // Simulate AI toxicity detection
      const toxicityScore = await simulateToxicityDetection(chatMessage)
      const isModerated = toxicityScore > 0.7

      const newMessage: ChatMessage = {
        id: messages.length + 1,
        user: "You",
        message: isModerated ? "[Message flagged by AI moderation]" : chatMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isVip: false,
        isModerated,
        moderationReason: isModerated ? "Potentially toxic content detected" : undefined,
        toxicityScore,
      }

      setMessages([...messages, newMessage])
      setChatMessage("")

      // Update moderation stats
      if (isModerated) {
        setModerationStats((prev) => ({
          totalMessages: prev.totalMessages + 1,
          flaggedMessages: prev.flaggedMessages + 1,
          toxicityRate: ((prev.flaggedMessages + 1) / (prev.totalMessages + 1)) * 100,
        }))
      } else {
        setModerationStats((prev) => ({
          ...prev,
          totalMessages: prev.totalMessages + 1,
          toxicityRate: (prev.flaggedMessages / (prev.totalMessages + 1)) * 100,
        }))
      }
    }
  }

  const simulateToxicityDetection = async (message: string): Promise<number> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Simple toxicity detection simulation
    const toxicWords = ["toxic", "hate", "stupid", "noob", "trash", "ez", "bad"]
    const lowerMessage = message.toLowerCase()
    const toxicWordCount = toxicWords.filter((word) => lowerMessage.includes(word)).length

    // Return a score between 0 and 1
    return Math.min(toxicWordCount * 0.3, 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-purple-800/30 bg-black/20 backdrop-blur-sm">
        <div className="w-full px-4 py-3">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                ArenaX
              </h1>
              <Badge variant="secondary" className="bg-red-600 text-white text-lg px-3 py-1">
                LIVE
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/overlays">
                <Button variant="outline" size="lg" className="border-purple-400 text-purple-300 bg-transparent">
                  <Palette className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/analytics">
                <Button variant="outline" size="lg" className="border-purple-400 text-purple-300 bg-transparent">
                  <BarChart3 className="w-5 h-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowRewards(!showRewards)}
                className="border-purple-400 text-purple-300"
              >
                <Gift className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowModerationPanel(!showModerationPanel)}
                className="border-purple-400 text-purple-300"
              >
                <Shield className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area - Left Side */}
      <div className="flex h-[calc(100vh-80px)]">
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-6">
            <div className="space-y-4">
              {/* Video Player */}
              <Card className="bg-black/40 border-purple-800/30">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-purple-300 text-lg">Live Stream</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSection("video")}
                      className="text-purple-300 hover:text-purple-200"
                    >
                      {expandedSections.video ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>
                </CardHeader>
                {expandedSections.video && (
                  <CardContent className="p-0">
                    <div className="relative aspect-[16/9] bg-black rounded-lg overflow-hidden max-w-6xl mx-auto">
                      <img
                        src="/Valorant_09-20-2025_23-5-24-359-ezgif.com-video-to-gif-converter.gif"
                        alt="Live VALORANT Game Changers Stream"
                        className="w-full h-full object-cover"
                        style={{ imageRendering: "auto" }}
                      />
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <Badge className="bg-red-600 text-white">
                          <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                          LIVE
                        </Badge>
                        <Badge variant="secondary" className="bg-black/60 text-white">
                          <Eye className="w-3 h-3 mr-1" />
                          {mockStream.viewers.toLocaleString()}
                        </Badge>
                      </div>
                      <Button size="sm" variant="secondary" className="absolute top-4 right-4 bg-black/60">
                        <Maximize2 className="w-4 h-4" />
                      </Button>

                      {showHUD && (
                        <div className="absolute inset-0 pointer-events-none">
                          {/* Top Score Bar */}
                          <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                            <div className="flex items-center gap-2 bg-black/90 rounded-lg px-4 py-2 border border-gray-600 text-sm">
                              {/* Team A */}
                              <div className="flex items-center gap-2">
                                <div className="text-white font-bold">{currentHUD.teamA}</div>
                                <div className="bg-green-600 text-white font-bold px-3 py-1 rounded text-sm">
                                  {currentHUD.scoreA}
                                </div>
                              </div>

                              {/* Round and Time */}
                              <div className="text-center px-3">
                                <div className="text-gray-300 text-xs">ROUND {currentHUD.round}</div>
                                <div className="text-white font-bold text-lg">{currentHUD.time}</div>
                              </div>

                              {/* Team B */}
                              <div className="flex items-center gap-2">
                                <div className="bg-red-600 text-white font-bold px-3 py-1 rounded text-sm">
                                  {currentHUD.scoreB}
                                </div>
                                <div className="text-white font-bold">{currentHUD.teamB}</div>
                              </div>
                            </div>
                          </div>

                          {/* Player Cards - Left Side (Team A) */}
                          <div className="absolute left-2 bottom-2 space-y-1">
                            {currentHUD.players.slice(0, 5).map((player, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 bg-blue-900/90 rounded-lg p-2 border border-blue-600 min-w-[220px] text-xs"
                              >
                                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                  <img
                                    src={`/images/${player.agent?.toLowerCase()}.webp`}
                                    alt={player.agent}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      // Fallback to placeholder if image fails to load
                                      const target = e.target as HTMLImageElement
                                      target.style.display = "none"
                                      target.nextElementSibling?.classList.remove("hidden")
                                    }}
                                  />
                                  <div className="w-full h-full bg-blue-600 rounded-full flex items-center justify-center hidden">
                                    <div className="text-white font-bold text-xs">{player.agent?.charAt(0) || "A"}</div>
                                  </div>
                                </div>

                                {/* Player Info */}
                                <div className="flex-1">
                                  <div className="text-white font-bold text-xs">{player.name}</div>
                                  <div className="text-blue-300 text-xs">{player.agent}</div>
                                </div>

                                {/* Money */}
                                <div className="text-green-400 font-bold text-xs">₹{player.score}</div>

                                {/* Weapon Icons */}
                                <div className="flex flex-col gap-1">
                                  <img
                                    src={player.weapon === "Phantom" ? "/images/phantom.png" : "/images/vandal.webp"}
                                    alt={player.weapon}
                                    className="w-8 h-4 object-contain"
                                  />
                                  <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <div key={i} className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Player Cards - Right Side (Team B) */}
                          <div className="absolute right-2 bottom-2 space-y-1">
                            {currentHUD.players.slice(5, 10).map((player, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 bg-red-900/90 rounded-lg p-2 border border-red-600 min-w-[220px] text-xs"
                              >
                                {/* Weapon Icons */}
                                <div className="flex flex-col gap-1">
                                  <img
                                    src={player.weapon === "Phantom" ? "/images/phantom.png" : "/images/vandal.webp"}
                                    alt={player.weapon}
                                    className="w-8 h-4 object-contain"
                                  />
                                  <div className="flex gap-1">
                                    {[...Array(6)].map((_, i) => (
                                      <div key={i} className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                                    ))}
                                  </div>
                                </div>

                                {/* Money */}
                                <div className="text-green-400 font-bold text-xs">₹{player.score}</div>

                                {/* Player Info */}
                                <div className="flex-1 text-right">
                                  <div className="text-white font-bold text-xs">{player.name}</div>
                                  <div className="text-red-300 text-xs">{player.agent}</div>
                                </div>

                                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                  <img
                                    src={`/images/${player.agent?.toLowerCase()}.webp`}
                                    alt={player.agent}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      // Fallback to placeholder if image fails to load
                                      const target = e.target as HTMLImageElement
                                      target.style.display = "none"
                                      target.nextElementSibling?.classList.remove("hidden")
                                    }}
                                  />
                                  <div className="w-full h-full bg-red-600 rounded-full flex items-center justify-center hidden">
                                    <div className="text-white font-bold text-xs">{player.agent?.charAt(0) || "A"}</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Stream Information */}
              <Card className="bg-black/40 border-purple-800/30">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-purple-300 text-lg">Stream Information</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSection("streamInfo")}
                      className="text-purple-300 hover:text-purple-200"
                    >
                      {expandedSections.streamInfo ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                {expandedSections.streamInfo && (
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <h2 className="text-xl font-bold text-white">{mockStream.title}</h2>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src="/abstract-gaming-logo.png" />
                              <AvatarFallback>ESL</AvatarFallback>
                            </Avatar>
                            <span className="text-purple-300 font-medium">{mockStream.streamer}</span>
                          </div>
                          <Badge variant="outline" className="border-purple-400 text-purple-300">
                            {mockStream.game}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant={isFollowing ? "secondary" : "default"}
                          onClick={() => setIsFollowing(!isFollowing)}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Heart className={`w-4 h-4 mr-2 ${isFollowing ? "fill-current" : ""}`} />
                          {isFollowing ? "Following" : "Follow"}
                        </Button>
                        <Button variant="outline" className="border-purple-400 text-purple-300 bg-transparent">
                          <Gift className="w-4 h-4 mr-2" />
                          Donate
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* AI Moderation Panel */}
              {showModerationPanel && (
                <Card className="bg-black/40 border-purple-800/30">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-purple-300 text-lg">AI Moderation</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSection("moderation")}
                        className="text-purple-300 hover:text-purple-200"
                      >
                        {expandedSections.moderation ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  {expandedSections.moderation && (
                    <CardContent>
                      <ChatModerationSystem stats={moderationStats} onClose={() => setShowModerationPanel(false)} />
                    </CardContent>
                  )}
                </Card>
              )}

              {/* Interactive Rewards */}
              {showRewards && (
                <Card className="bg-black/40 border-purple-800/30">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-purple-300 text-lg">Interactive Rewards</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSection("rewards")}
                        className="text-purple-300 hover:text-purple-200"
                      >
                        {expandedSections.rewards ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  {expandedSections.rewards && (
                    <CardContent>
                      <RewardsSystem />
                    </CardContent>
                  )}
                </Card>
              )}

              {/* Match Schedule */}
              <Card className="bg-black/40 border-purple-800/30">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-purple-300 text-lg">Match Schedule</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSection("matches")}
                      className="text-purple-300 hover:text-purple-200"
                    >
                      {expandedSections.matches ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                {expandedSections.matches && (
                  <CardContent className="space-y-3">
                    {mockMatches.map((match) => (
                      <div key={match.id} className="p-3 rounded-lg bg-slate-800/50 border border-purple-800/20">
                        <div className="flex justify-between items-center mb-2">
                          <Badge
                            variant={match.status === "live" ? "destructive" : "secondary"}
                            className={match.status === "live" ? "bg-red-600" : "bg-slate-600"}
                          >
                            {match.status === "live" ? "LIVE" : match.time}
                          </Badge>
                          <span className="text-sm text-purple-300">{match.score}</span>
                        </div>
                        <div className="text-sm">
                          <div className="text-white font-medium">{match.team1}</div>
                          <div className="text-white">vs</div>
                          <div className="text-white font-medium">{match.team2}</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                )}
              </Card>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-80 border-l border-purple-800/30 bg-black/20 backdrop-blur-sm">
          <div className="h-full flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-purple-800/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-300" />
                  <span className="text-purple-300 font-medium">Stream Chat</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-green-400">AI Protected</span>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full px-4" ref={chatContainerRef}>
                <div className="space-y-3 py-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-2 text-sm transition-all duration-300 ${
                        Date.now() - msg.id < 3000 ? "animate-pulse" : ""
                      }`}
                    >
                      <span className="text-gray-300 text-xs mt-1 flex-shrink-0">{msg.timestamp}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${msg.isVip ? "text-yellow-400" : "text-purple-300"}`}>
                            {msg.user}:
                          </span>
                          {msg.isModerated && (
                            <AlertTriangle
                              className="w-3 h-3 text-orange-400 flex-shrink-0"
                              title={msg.moderationReason}
                            />
                          )}
                        </div>
                        <span
                          className={`block break-words ${msg.isModerated ? "text-gray-400 italic" : "text-white"}`}
                        >
                          {msg.message}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-purple-800/30">
              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  className="bg-slate-800/50 border-purple-800/30 text-white placeholder-gray-300"
                />
                <Button onClick={sendMessage} size="sm" className="bg-purple-600 hover:bg-purple-700 flex-shrink-0">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-300">
                <span>AI moderated</span>
                <span>
                  {moderationStats.flaggedMessages} flagged / {moderationStats.totalMessages} total
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
