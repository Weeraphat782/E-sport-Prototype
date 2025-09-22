"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, TrendingDown, MessageSquare, Gift, Eye, Clock, Zap, Trophy, AlertTriangle } from "lucide-react"

// Mock analytics data
const viewershipData = [
  { time: "00:00", viewers: 12500, chatMessages: 45 },
  { time: "00:15", viewers: 15200, chatMessages: 67 },
  { time: "00:30", viewers: 18900, chatMessages: 89 },
  { time: "00:45", viewers: 22100, chatMessages: 112 },
  { time: "01:00", viewers: 28500, chatMessages: 156 },
  { time: "01:15", viewers: 35600, chatMessages: 203 },
  { time: "01:30", viewers: 42300, chatMessages: 267 },
  { time: "01:45", viewers: 45600, chatMessages: 298 },
  { time: "02:00", viewers: 47200, chatMessages: 321 },
  { time: "02:15", viewers: 44800, chatMessages: 289 },
  { time: "02:30", viewers: 41200, chatMessages: 245 },
  { time: "02:45", viewers: 38900, chatMessages: 198 },
]

const engagementData = [
  { name: "Chat Messages", value: 15420, color: "#8b5cf6" },
  { name: "Quiz Participation", value: 8930, color: "#ec4899" },
  { name: "Donations", value: 2340, color: "#06b6d4" },
  { name: "Follows", value: 1890, color: "#10b981" },
]

const streamPerformance = [
  { stream: "VALORANT Finals", avgViewers: 45600, peakViewers: 52300, duration: 180, engagement: 89 },
  { stream: "CS2 Tournament", avgViewers: 38200, peakViewers: 44100, duration: 165, engagement: 76 },
  { stream: "League Worlds", avgViewers: 62100, peakViewers: 71800, duration: 210, engagement: 94 },
  { stream: "Apex Legends", avgViewers: 28900, peakViewers: 35200, duration: 145, engagement: 68 },
]

const audienceRetention = [
  { minute: 0, retention: 100 },
  { minute: 15, retention: 95 },
  { minute: 30, retention: 88 },
  { minute: 45, retention: 82 },
  { minute: 60, retention: 78 },
  { minute: 75, retention: 74 },
  { minute: 90, retention: 69 },
  { minute: 105, retention: 65 },
  { minute: 120, retention: 61 },
  { minute: 135, retention: 58 },
  { minute: 150, retention: 55 },
  { minute: 165, retention: 52 },
  { minute: 180, retention: 49 },
]

const moderationStats = [
  { date: "2024-01-15", totalMessages: 15420, flagged: 234, toxicityRate: 1.5 },
  { date: "2024-01-16", totalMessages: 18900, flagged: 189, toxicityRate: 1.0 },
  { date: "2024-01-17", totalMessages: 22100, flagged: 298, toxicityRate: 1.3 },
  { date: "2024-01-18", totalMessages: 19800, flagged: 156, toxicityRate: 0.8 },
  { date: "2024-01-19", totalMessages: 25600, flagged: 267, toxicityRate: 1.0 },
]

export function AnalyticsDashboard() {
  const currentMetrics = {
    totalViewers: 45672,
    avgWatchTime: "2h 34m",
    chatMessages: 15420,
    quizParticipation: 8930,
    donations: 2340,
    follows: 1890,
    engagementRate: 89.2,
    toxicityRate: 1.1,
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-black/40 border-purple-800/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Current Viewers</p>
                <p className="text-2xl font-bold text-white">{currentMetrics.totalViewers.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-green-400">+12.5%</span>
                </div>
              </div>
              <Eye className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-800/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Avg Watch Time</p>
                <p className="text-2xl font-bold text-white">{currentMetrics.avgWatchTime}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-green-400">+8.2%</span>
                </div>
              </div>
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-800/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Engagement Rate</p>
                <p className="text-2xl font-bold text-white">{currentMetrics.engagementRate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-green-400">+5.7%</span>
                </div>
              </div>
              <Zap className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-800/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Toxicity Rate</p>
                <p className="text-2xl font-bold text-white">{currentMetrics.toxicityRate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-green-400">-2.1%</span>
                </div>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="viewership" className="space-y-4">
        <TabsList className="bg-black/40 border border-purple-800/30">
          <TabsTrigger value="viewership" className="data-[state=active]:bg-purple-600">
            Viewership
          </TabsTrigger>
          <TabsTrigger value="engagement" className="data-[state=active]:bg-purple-600">
            Engagement
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-purple-600">
            Performance
          </TabsTrigger>
          <TabsTrigger value="moderation" className="data-[state=active]:bg-purple-600">
            Moderation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="viewership" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-black/40 border-purple-800/30">
              <CardHeader>
                <CardTitle className="text-purple-300">Live Viewership Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={viewershipData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #6b46c1",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="viewers"
                      stroke="#8b5cf6"
                      fill="url(#viewerGradient)"
                      strokeWidth={2}
                    />
                    <defs>
                      <linearGradient id="viewerGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-purple-800/30">
              <CardHeader>
                <CardTitle className="text-purple-300">Audience Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={audienceRetention}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="minute" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #6b46c1",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="retention"
                      stroke="#ec4899"
                      strokeWidth={3}
                      dot={{ fill: "#ec4899", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="bg-black/40 border-purple-800/30">
              <CardHeader>
                <CardTitle className="text-purple-300">Engagement Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={engagementData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {engagementData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #6b46c1",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-purple-800/30">
              <CardHeader>
                <CardTitle className="text-purple-300">Chat Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={viewershipData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #6b46c1",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="chatMessages" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-black/40 border-purple-800/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-8 h-8 text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-400">Chat Messages</p>
                    <p className="text-xl font-bold text-white">{currentMetrics.chatMessages.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-purple-800/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-yellow-400" />
                  <div>
                    <p className="text-sm text-gray-400">Quiz Participants</p>
                    <p className="text-xl font-bold text-white">{currentMetrics.quizParticipation.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-purple-800/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Gift className="w-8 h-8 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-400">Donations</p>
                    <p className="text-xl font-bold text-white">{currentMetrics.donations.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card className="bg-black/40 border-purple-800/30">
            <CardHeader>
              <CardTitle className="text-purple-300">Stream Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {streamPerformance.map((stream, index) => (
                  <div key={index} className="p-4 rounded-lg bg-slate-800/50 border border-purple-800/20">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-white">{stream.stream}</h3>
                      <Badge variant="outline" className="border-purple-400 text-purple-300">
                        {stream.duration}min
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-400">Avg Viewers</p>
                        <p className="text-lg font-bold text-white">{stream.avgViewers.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Peak Viewers</p>
                        <p className="text-lg font-bold text-white">{stream.peakViewers.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Engagement</p>
                        <p className="text-lg font-bold text-white">{stream.engagement}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Performance</p>
                        <Progress value={stream.engagement} className="h-2 mt-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="moderation" className="space-y-4">
          <Card className="bg-black/40 border-purple-800/30">
            <CardHeader>
              <CardTitle className="text-purple-300">AI Moderation Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={moderationStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #6b46c1",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="toxicityRate"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    name="Toxicity Rate (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-black/40 border-purple-800/30">
              <CardContent className="p-4">
                <div className="text-center">
                  <AlertTriangle className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Avg Toxicity Rate</p>
                  <p className="text-2xl font-bold text-white">{currentMetrics.toxicityRate}%</p>
                  <p className="text-xs text-green-400 mt-1">Below industry average</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-purple-800/30">
              <CardContent className="p-4">
                <div className="text-center">
                  <MessageSquare className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Messages Flagged</p>
                  <p className="text-2xl font-bold text-white">234</p>
                  <p className="text-xs text-gray-400 mt-1">Last 24 hours</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-purple-800/30">
              <CardContent className="p-4">
                <div className="text-center">
                  <Zap className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">AI Accuracy</p>
                  <p className="text-2xl font-bold text-white">94.2%</p>
                  <p className="text-xs text-green-400 mt-1">High performance</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
