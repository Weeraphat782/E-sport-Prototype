"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { X, Shield, AlertTriangle, CheckCircle, TrendingDown } from "lucide-react"

interface ModerationStats {
  totalMessages: number
  flaggedMessages: number
  toxicityRate: number
}

interface ChatModerationSystemProps {
  stats: ModerationStats
  onClose: () => void
}

export function ChatModerationSystem({ stats, onClose }: ChatModerationSystemProps) {
  const recentFlags = [
    { user: "ToxicUser", reason: "Hate speech", severity: "high", timestamp: "14:26" },
    { user: "AngryGamer", reason: "Harassment", severity: "medium", timestamp: "14:20" },
    { user: "SpamBot123", reason: "Spam detected", severity: "low", timestamp: "14:15" },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-600"
      case "medium":
        return "bg-orange-500"
      case "low":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card className="bg-black/40 border-purple-800/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-purple-300 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            AI Moderation Panel
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-slate-800/50">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-400">Clean Messages</span>
            </div>
            <div className="text-lg font-bold text-white">{stats.totalMessages - stats.flaggedMessages}</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-800/50">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-orange-400" />
              <span className="text-xs text-gray-400">Flagged</span>
            </div>
            <div className="text-lg font-bold text-white">{stats.flaggedMessages}</div>
          </div>
        </div>

        {/* Toxicity Rate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Toxicity Rate</span>
            <span className="text-sm font-medium text-white">{stats.toxicityRate.toFixed(1)}%</span>
          </div>
          <Progress value={stats.toxicityRate} className="h-2 bg-slate-700" />
          <div className="flex items-center gap-1 text-xs text-green-400">
            <TrendingDown className="w-3 h-3" />
            <span>Below average for gaming streams</span>
          </div>
        </div>

        {/* Recent Flags */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-300">Recent Flags</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {recentFlags.map((flag, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded bg-slate-800/30">
                <div className="flex items-center gap-2">
                  <Badge className={`${getSeverityColor(flag.severity)} text-white text-xs`}>{flag.severity}</Badge>
                  <span className="text-xs text-white">{flag.user}</span>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">{flag.reason}</div>
                  <div className="text-xs text-gray-500">{flag.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Status */}
        <div className="p-3 rounded-lg bg-green-900/20 border border-green-800/30">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-green-400">AI Moderation Active</span>
          </div>
          <p className="text-xs text-gray-400">Real-time toxicity detection with 94% accuracy</p>
        </div>
      </CardContent>
    </Card>
  )
}
